import { getStore } from "@netlify/blobs"; // Importa o getStore do Netlify Blobs para acessar o banco de dados

export default async (req) => { // Exporta função assíncrona padrão que recebe a requisição
  try { // Tenta executar o código
    const url = new URL(req.url); // Cria objeto URL a partir da URL da requisição
    const mesFiltro = url.searchParams.get("mes"); // Pega parâmetro ?mes=yyyy-mm da URL se tiver
    const store = getStore("dizimos"); // Conecta no banco de dados chamado "dizimos"
    const list = await store.list(); // Lista todas as chaves existentes no banco
    let dados = []; // Cria array vazio para guardar os dados
    for (const k of list.blobs.map(b => b.key)) { // Para cada chave (key) encontrada na lista de blobs
      const item = await store.get(k, { type: "json" }); // Busca o item do banco no formato JSON
      if (item) dados.push(item); // Se achou item, adiciona no array dados
    }
    dados.sort((a,b) => new Date(b.data||b.criadoEm) - new Date(a.data||a.criadoEm)); // Ordena dados do mais novo para o mais antigo pela data
    let meses = [...new Set(dados.map(d=>(d.data||"").substring(0,7)).filter(Boolean))].sort().reverse(); // Cria lista única de meses yyyy-mm existentes nos dados, ordenada decrescente
    if(meses.length===0) meses=[new Date().toISOString().substring(0,7)]; // Se não tem nenhum mês ainda, cria mês atual como padrão
    if(mesFiltro) dados = dados.filter(d=>d.data&&d.data.startsWith(mesFiltro)); // Se veio filtro de mês na URL, filtra só dados daquele mês
    return new Response(JSON.stringify({dados, meses, mesAtual: meses[0]}), {status:200, headers:{"Content-Type":"application/json"}}); // Retorna resposta JSON com dados, meses e mesAtual, status 200 e header JSON
  } catch(e){ // Se deu erro em qualquer parte
    return new Response(JSON.stringify({dados:[],meses:[],error:e.message}), {status:500}); // Retorna erro 500 com dados vazios e mensagem de erro
  }
}; // Fim da função