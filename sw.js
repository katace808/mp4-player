// Personal MP4 Player: offline support for the home-screen (iPhone) version.
// Your songs are never sent anywhere; they live in the app's storage on your device.
const CACHE='pmp-v2';
const SHELL=['./','index.html','manifest.webmanifest','lame.min.js',
  'icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png','icons/apple-touch-icon.png',
  'fonts/bricolage-grotesque-latin-600-normal.woff2','fonts/bricolage-grotesque-latin-800-normal.woff2',
  'fonts/figtree-latin-400-normal.woff2','fonts/figtree-latin-500-normal.woff2','fonts/figtree-latin-600-normal.woff2',
  'fonts/jetbrains-mono-latin-500-normal.woff2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  if(new URL(req.url).origin!==location.origin)return;
  // Use the newest version when online, the saved copy when offline.
  e.respondWith(fetch(req).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(req,cp));}return res;})
    .catch(()=>caches.match(req,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));
});
