import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/dashboard'],
    },
    sitemap: 'https://demandchange.vercel.app/sitemap.xml',
  };
}
