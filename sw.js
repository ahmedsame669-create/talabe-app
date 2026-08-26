// Talabati Service Worker
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // تمرير الطلبات مباشرة إلى شبكة الإنترنت بدون اعتراض يسبب صفحة بيضاء
  event.respondWith(fetch(event.request));
});
