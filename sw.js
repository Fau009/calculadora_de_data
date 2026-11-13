/* Service worker — Calculadora de Data
   Estratégia network-first: busca a versão mais nova na rede e, se falhar
   (offline), serve o que estiver em cache. CSS/JS são sempre revalidados. */
const CACHE = "fs-calculadora_de_data-v1";
const CORE = ["./", "./index.html", "./manifest.webmanifest",
  "./icones/app-192.png", "./icones/app-512.png", "./icones/apple-touch-icon.png"];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE).catch(() => {})));
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  const revalidate = /\.(css|js)(\?|$)/.test(url.pathname);
  e.respondWith(
    fetch(revalidate ? new Request(req, { cache: "no-cache" }) : req)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then(r => r || caches.match("./index.html")))
  );
});
