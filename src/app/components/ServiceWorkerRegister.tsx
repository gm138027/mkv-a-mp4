'use client';

import { useEffect } from 'react';

/**
 * Service Worker 注册组件
 * 启用PWA离线支持
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    // 只在生产环境和支持 Service Worker 的浏览器中注册
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registered:', registration.scope);

          // 检查更新
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (
                  newWorker.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  // 新版本可用
                  console.log('🔄 New Service Worker available');
                  
                  // 可以在这里提示用户刷新页面
                  if (
                    confirm(
                      'New version available! Click OK to update.'
                    )
                  ) {
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('❌ Service Worker registration failed:', error);
        });

      // 监听 Service Worker 控制器变化
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('🔄 Service Worker controller changed');
      });
    }
  }, []);

  return null; // 这是一个纯副作用组件
}
