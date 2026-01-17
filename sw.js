// 我們將版本號改為 v2，這會強迫瀏覽器重新下載檔案
const CACHE_NAME = 'reading-log-v2'; 

self.addEventListener('install', (e) => {
  // 強制這個新的 Service Worker 立即進入「等待中」狀態，不需等待舊的關閉
  self.skipWaiting(); 
  
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([
      './',
      './index.html',
      './manifest.json'
    ]))
  );
});

self.addEventListener('activate', (e) => {
  // 當這個新的 SW 啟動時，立即接管頁面控制權
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        // 刪除所有不是 v2 的舊快取
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
