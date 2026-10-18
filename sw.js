const CACHE="pasolini-github-release-20261017-r8";
const PRECACHE=["/paginapessoal/favicon.svg","/paginapessoal/icon-192.png","/paginapessoal/icon-512.png","/paginapessoal/perfil-junior.webp","/paginapessoal/assets/index-release-20261013-r7.js","/paginapessoal/assets/newsreader-latin-ext-wght-normal-C-3rgBeH.woff2","/paginapessoal/assets/newsreader-latin-wght-normal-CCVVNp6i.woff2","/paginapessoal/assets/newsreader-vietnamese-wght-normal-Czsa-EzN.woff2","/paginapessoal/assets/routes-release-20261013-r7.js","/paginapessoal/assets/source-sans-3-cyrillic-ext-wght-normal-DzyfIafT.woff2","/paginapessoal/assets/source-sans-3-cyrillic-wght-normal-BMDVbyM7.woff2","/paginapessoal/assets/source-sans-3-greek-ext-wght-normal-BWSLJLk6.woff2","/paginapessoal/assets/source-sans-3-greek-wght-normal-C9H9m1vD.woff2","/paginapessoal/assets/source-sans-3-latin-ext-wght-normal-C8iNium2.woff2","/paginapessoal/assets/source-sans-3-latin-wght-normal-BqRLTx4X.woff2","/paginapessoal/assets/source-sans-3-vietnamese-wght-normal-C1uRvKPU.woff2","/paginapessoal/assets/styles-522dfb25de.css"];
const CACHE_NAVIGATION=true;
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(PRECACHE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('pasolini-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/')||url.pathname.startsWith('/__')||url.pathname.startsWith('/_'))return;
  if(request.mode==='navigate'){
    if(!CACHE_NAVIGATION)return;
    event.respondWith(fetch(request).then(response=>{if(response.ok&&response.type==='basic'){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(request,copy)));}return response;}).catch(()=>caches.match(request).then(cached=>cached||Response.error())));
    return;
  }
  if(!PRECACHE.includes(url.pathname))return;
  event.respondWith(caches.match(request).then(cached=>cached||fetch(request)));
});
