import { getStore } from "@netlify/blobs";
export default async () => {
  try { const store = getStore("tesouraria"); const lista = await store.get("entradas", {type:"json"}) || []; return new Response(JSON.stringify(lista), {headers: {"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});} catch(e){ return new Response(JSON.stringify([]), {headers: {"Content-Type":"application/json","Access-Control-Allow-Origin":"*"}});}
}