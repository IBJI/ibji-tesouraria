import { getStore } from "@netlify/blobs";

export default async (req) => {
  try {
    const url = new URL(req.url);
    const mesSolicitado = url.searchParams.get("mes"); // ex: 2026-10
    
    const agora = new Date();
    const mesAtual = mesSolicitado || `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}`;
    const chave = `dados-${mesAtual}`;

    const store = getStore("ofertas");
    
    // lista todos os meses que existem
    const { blobs } = await store.list();
    const meses = blobs.map(b => b.key.replace('dados-','')).sort().reverse();

    let dados = await store.get(chave, { type: "json" });
    if (!dados) dados = [];

    return new Response(JSON.stringify({ dados, meses, mesAtual }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ dados: [], meses: [], error: e.message }), { status: 500 });
  }
}