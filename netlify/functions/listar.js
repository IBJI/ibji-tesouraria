import { getStore } from "@netlify/blobs";
export default async (req) => {
  try {
    const url = new URL(req.url);
    const mesFiltro = url.searchParams.get("mes");
    const store = getStore("dizimos");
    const list = await store.list();
    let dados = [];
    for (const k of list.blobs.map(b => b.key)) {
      const item = await store.get(k, { type: "json" });
      if (item) dados.push(item);
    }
    dados.sort((a,b) => new Date(b.data||b.criadoEm) - new Date(a.data||a.criadoEm));
    let meses = [...new Set(dados.map(d=>(d.data||"").substring(0,7)).filter(Boolean))].sort().reverse();
    if(meses.length===0) meses=[new Date().toISOString().substring(0,7)];
    if(mesFiltro) dados = dados.filter(d=>d.data&&d.data.startsWith(mesFiltro));
    return new Response(JSON.stringify({dados, meses, mesAtual: meses[0]}), {status:200, headers:{"Content-Type":"application/json"}});
  } catch(e){
    return new Response(JSON.stringify({dados:[],meses:[],error:e.message}), {status:500});
  }
};