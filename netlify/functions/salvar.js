import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  
  try {
    const dados = await req.json();
    const agora = new Date();
    const mesAno = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}`; // 2026-10
    const chave = `dados-${mesAno}`;

    const store = getStore("ofertas");
    let existentes = await store.get(chave, { type: "json" });
    if (!existentes) existentes = [];

    existentes.push(dados);
    await store.setJSON(chave, existentes);

    return new Response(JSON.stringify({ ok: true, mes: mesAno }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}