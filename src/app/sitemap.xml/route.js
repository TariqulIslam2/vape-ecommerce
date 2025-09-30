// app/sitemap.xml.js
import { executeQuery } from '@/lib/db';

export async function GET() {
    const baseUrl = 'https://vapmarina.ae';
    const now = new Date().toISOString();

    // 1️⃣ Static pages
    const staticPages = [
        { url: '', changefreq: 'daily', priority: 1.0 },
        { url: 'shop/', changefreq: 'daily', priority: 0.9 },
        { url: 'blog/', changefreq: 'daily', priority: 0.9 },
        { url: 'myle/', changefreq: 'daily', priority: 0.9 },
        { url: 'disposable/', changefreq: 'daily', priority: 0.9 },
        { url: 'e-juice/', changefreq: 'daily', priority: 0.9 },
        { url: 'nicotine-pouches/', changefreq: 'daily', priority: 0.9 },
        { url: 'iqos-iluma/', changefreq: 'daily', priority: 0.9 },
        { url: 'heets-and-terea/', changefreq: 'daily', priority: 0.9 },
        { url: 'juul/', changefreq: 'daily', priority: 0.9 },
        { url: 'vape-kits/', changefreq: 'daily', priority: 0.9 },
        // Additional pages
        { url: 'about/', changefreq: 'weekly', priority: 0.8 },
        { url: 'contact/', changefreq: 'weekly', priority: 0.8 },
        { url: 'cart/', changefreq: 'weekly', priority: 0.8 },
        { url: 'faq/', changefreq: 'weekly', priority: 0.8 },
        { url: 'policy/', changefreq: 'weekly', priority: 0.8 },
        { url: 'term/', changefreq: 'weekly', priority: 0.8 },
    ].map(page => ({ ...page, lastModified: now }));

    // 2️⃣ Dynamic blog posts
    let blogPages = [];
    try {
        const posts = await executeQuery(`
      SELECT slug, updated_at, published_date 
      FROM blog_posts 
      WHERE published = 1
      ORDER BY published_date DESC
    `);

        blogPages = posts?.map(post => ({
            url: `blog/${post.slug}`,
            lastModified: (post.updated_at || post.published_date || now),
            changefreq: 'monthly',
            priority: 0.6,
        })) || [];
    } catch (err) {
        console.error('Error fetching blog posts:', err);
    }

    // 3️⃣ Dynamic product pages
    let productPages = [];
    try {
        const products = await executeQuery(`
      SELECT id,create_date 
      FROM products 
      WHERE status = 'active' OR status = 1
      ORDER BY create_date DESC
    `);

        productPages = products?.map(product => ({
            url: `product/${product.id}`,
            lastModified: ( product.create_date || now),
            changefreq: 'daily',
            priority: 0.9,
        })) || [];
    } catch (err) {
        console.error('Error fetching products:', err);
    }

    // Combine all pages
    const allPages = [...staticPages, ...blogPages, ...productPages];

    // 4️⃣ Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages
            .map(
                page => `
  <url>
    <loc>${baseUrl}/${page.url}</loc>
    <lastmod>${page.lastModified}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
  `
            )
            .join('')}
</urlset>`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 's-maxage=3600, stale-while-revalidate=3600',
        },
    });
}
