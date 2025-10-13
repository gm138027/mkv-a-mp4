// Service Worker for MKV to MP4 Converter
// Version: 1.0.0

const CACHE_NAME = 'mkv-mp4-v1';
const RUNTIME_CACHE = 'mkv-mp4-runtime-v1';

// 需要预缓存的核心资源
const PRECACHE_URLS = [
  '/',
  '/offline',
  '/logo/android-chrome-192x192.png',
  '/logo/android-chrome-512x512.png',
  '/logo/favicon.ico',
];

// 安装事件：预缓存核心资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  // 立即激活新的 Service Worker
  self.skipWaiting();
});

// 激活事件：清理旧缓存
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!currentCaches.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // 立即接管所有页面
  self.clients.claim();
});

// Fetch事件：网络优先策略（对于动态内容）
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 跳过非GET请求
  if (request.method !== 'GET') {
    return;
  }

  // 跳过Chrome扩展和其他协议
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // 跳过API请求（不缓存API）
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // 静态资源：缓存优先
  if (
    url.pathname.startsWith('/logo/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|webp|avif|woff2)$/)
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((response) => {
          // 只缓存成功的响应
          if (response.status === 200) {
            const responseToCache = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // HTML页面：网络优先，网络失败时使用缓存
  event.respondWith(
    fetch(request)
      .then((response) => {
        // 缓存HTML页面
        if (response.status === 200 && request.destination === 'document') {
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // 网络失败，尝试从缓存获取
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // 如果没有缓存，返回离线页面
          if (request.destination === 'document') {
            return caches.match('/offline');
          }
        });
      })
  );
});

// 后台同步
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-conversions') {
    event.waitUntil(syncConversions());
  }
});

async function syncConversions() {
  // 这里可以实现后台同步转换任务的逻辑
  console.log('Background sync: conversions');
}

// 推送通知（未来可选功能）
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'MKV to MP4 Converter';
  const options = {
    body: data.body || 'Your conversion is ready!',
    icon: '/logo/android-chrome-192x192.png',
    badge: '/logo/android-chrome-192x192.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/',
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// 通知点击事件
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});
