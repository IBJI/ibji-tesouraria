import { getStore } from "@netlify/blobs";
export default async (req) => {
  if (req.method === "OPTIONS") return new Response("", {headers: {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type"}});
  if (req.method !== "POST") return new Response("Method not allowed", {status:405});
  try { const dados = await req.json(); const store = getStore("tesouraria"); let lista = await store.get("entradas", {type:"json"}) || []; lista.push({...dados, id: Date.now()}); await store.setJSON("entradas", lista); return new Response(JSON.stringify({ok:true}), {headers: {"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});} catch(e){ return new Response(JSON.stringify({error:e.message}), {status:500, headers: {"Access-Control-Allow-Origin":"*"}});}
}