import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  try {
    const dados = await req.json();
    
    if (!dados.nome || !dados.valor) {
      return new Response(JSON.stringify({ error: "Nome e valor obrigatórios" }), { status: 400 });
    }

    const store = getStore("dizimos");
    const id = Date.now() + "-" + Math.random().toString(36).substring(2,6);
    
    await store.setJSON(id, {
      ...dados,
      id,
      criadoEm: new Date().toISOString()
    });

    return new Response(JSON.stringify({ ok: true, id }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};