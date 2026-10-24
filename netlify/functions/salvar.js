import { getStore } from "@netlify/blobs"; // Importa o getStore do Netlify Blobs para acessar o banco

export default async (req) => { // Exporta função assíncrona padrão que recebe a requisição
  if (req.method !== "POST") { // Verifica se o método não é POST
    return new Response("Method not allowed", { status: 405 }); // Se não for POST, retorna erro 405 Método não permitido
  }
  try { // Tenta executar o salvamento
    const dados = await req.json(); // Converte o corpo da requisição para JSON (dados enviados do front)
    
    if (!dados.nome || !dados.valor) { // Valida se nome e valor existem
      return new Response(JSON.stringify({ error: "Nome e valor obrigatórios" }), { status: 400 }); // Se faltar, retorna erro 400
    }

    const store = getStore("dizimos"); // Conecta no banco de dados chamado "dizimos"
    const id = Date.now() + "-" + Math.random().toString(36).substring(2,6); // Cria ID único com data + letras aleatórias
    
    await store.setJSON(id, { // Salva no banco no formato JSON com esse ID
      ...dados, // Espalha todos os dados que vieram do front (data, nome, tipo, valor, etc)
      id, // Adiciona o ID criado
      criadoEm: new Date().toISOString() // Adiciona data/hora de criação em formato ISO
    });

    return new Response(JSON.stringify({ ok: true, id }), { // Retorna sucesso com ok true e ID
      status: 200, // Status 200 OK
      headers: { "Content-Type": "application/json" } // Header dizendo que é JSON
    });

  } catch (e) { // Se deu erro ao salvar
    console.error(e); // Mostra erro no log da function no Netlify
    return new Response(JSON.stringify({ error: e.message }), { status: 500 }); // Retorna erro 500 com mensagem
  }
}; // Fim da função