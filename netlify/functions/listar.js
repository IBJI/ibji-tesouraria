import { getStore } from "@netlify/blobs";

export default async (req) => {
  try {
    const url = new URL(req.url);
    const mesFiltro = url.searchParams.get("mes"); // formato YYYY-MM

    const store = getStore("dizimos");
    const list = await store.list();
    
    let dados = [];
    for (const key of list.blobs.map(b => b.key)) {
      const item = await store.get(key, { type: "json" });
      if (item) dados.push(item);
    }

    // Ordena do mais novo pro mais antigo
    dados.sort((a,b) => new Date(b.data) - new Date(a.data));

    // Pega todos os meses existentes
    const mesesSet = new Set(dados.map(d => {
      if(!d.data) return null;
      return d.data.substring(0,7); // YYYY-MM
    }).filter(Boolean));

    const meses = Array.from(mesesSet).sort().reverse();
    if(meses.length === 0){
      const hoje = new Date().toISOString().substring(0,7);
      meses.push(hoje);
    }

    // Filtra por mês se pediu
    if (mesFiltro) {
      dados = dados.filter(d => d.data && d.data.startsWith(mesFiltro));
    }

    return new Response(JSON.stringify({
      dados,
      meses,
      mesAtual: meses[0]
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ dados: [], meses: [], error: e.message }), { status: 500 });
  }
};