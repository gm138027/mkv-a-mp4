import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 显式禁用尾斜杠，确保 URL 统一为非斜杠结尾
  trailingSlash: false,
  
  // ✅ i18n 配置已移除：App Router 不支持传统的 i18n 配置
  // 我们使用自定义的 LocaleProvider 和 Context 来管理多语言

  // ✅ 生产环境：移除所有 console 日志（保留 error）
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' 
      ? { exclude: ['error'] } 
      : false,
  },

  // ✅ 图片优化配置
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1年
  },

  // ✅ 压缩和性能优化
  compress: true,
  poweredByHeader: false,  // 移除 X-Powered-By 头（安全性）
  
  // ✅ 实验性功能和优化
  experimental: {
    optimizePackageImports: ['lucide-react'],  // 优化图标库导入
  },

  // ✅ 生产构建优化
  productionBrowserSourceMaps: false,  // 禁用生产source maps
  reactStrictMode: true,  // React严格模式
  
  // ✅ 输出优化
  output: 'standalone',  // 优化部署包大小

  // ✅ FFmpeg.wasm 需要 SharedArrayBuffer 支持 + SEO 和安全头
  async headers() {
    const baseHeaders = [
      // FFmpeg.wasm 必需
      {
        key: 'Cross-Origin-Embedder-Policy',
        value: 'require-corp',
      },
      {
        key: 'Cross-Origin-Opener-Policy',
        value: 'same-origin',
      },
      // 安全头
      {
        key: 'X-Frame-Options',
        value: 'DENY',
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'X-DNS-Prefetch-Control',
        value: 'on',
      },
    ];

    return [
      {
        source: '/offline',
        headers: [
          ...baseHeaders,
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
      {
        source: '/((?!offline).*)',
        headers: [
          ...baseHeaders,
          // 性能提示
          {
            key: 'X-Robots-Tag',
            value: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
          },
        ],
      },
      // 缓存优化：静态资源
      {
        source: '/logo/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/icons/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // 301 重定向规则（仅在生产环境启用，避免本地开发刷新循环）
  async redirects() {
    if (process.env.NODE_ENV !== 'production') {
      return [];
    }
    return [
      // www 子域名统一到裸域名
      {
        source: '/:path*',
        has: [
          { type: 'host', value: 'www.mkvamp4.com' },
        ],
        destination: 'https://mkvamp4.com/:path*',
        permanent: true,
      },
      // 去除语言首页尾斜杠（显式列举）
      { source: '/en/', destination: '/en', permanent: true },
      { source: '/ja/', destination: '/ja', permanent: true },
      { source: '/fr/', destination: '/fr', permanent: true },
      { source: '/de/', destination: '/de', permanent: true },
    ];
  },
};

export default nextConfig;
