const CACHE_NAME = 'talabati-v2026';

// تثبيت السيرفس ووركر فورياً
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// مسح النسخ القديمة عند التحديث
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// جلب أحدث نسخة من الإنترنت أولاً، وفي حال انقطاع النت يتم الفتح من الكاش
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // تحديث الكاش بالنسخة الجديدة في الخلفية
        if (event.request.method === 'GET' && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // إذا كان هاتف الطالب بدون إنترنت، يتم فتح الملفات المخزنة
        return caches.match(event.request);
      })
  );
});
