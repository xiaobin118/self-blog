import { Router } from 'express';
import { prisma } from '../lib/prisma.js';
import { env } from '../config/env.js';

const router = Router();

router.get('/', async (_req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
    orderBy: { publishedAt: 'desc' },
  });

  const baseUrl = env.FRONTEND_URL || 'https://lillys-blog.onrender.com';

  const staticUrls = [
    { loc: baseUrl, lastmod: '', priority: '1.0', changefreq: 'daily' },
    { loc: `${baseUrl}/about`, lastmod: '', priority: '0.8', changefreq: 'monthly' },
    { loc: `${baseUrl}/archive`, lastmod: '', priority: '0.8', changefreq: 'weekly' },
  ];

  const postUrls = posts.map(p => ({
    loc: `${baseUrl}/post/${p.slug}`,
    lastmod: p.updatedAt.toISOString(),
    priority: '0.7',
    changefreq: 'monthly',
  }));

  const urls = [...staticUrls, ...postUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  res.set('Content-Type', 'application/xml');
  res.set('Cache-Control', 'public, max-age=3600');
  res.send(xml);
});

export default router;
