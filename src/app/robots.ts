import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = 'https://mkvamp4.com';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/storage/', '/uploads/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: 'mkvamp4.com',
  };
}
