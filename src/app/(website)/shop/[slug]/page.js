import { executeQuery } from '@/lib/db';
import { notFound } from 'next/navigation';
import ProductDetailsClient from './ProductDetailsClient';

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  try {
    const { slug } = await params;

    const result = await executeQuery(`
            SELECT 
                p.*, 
                c.name AS category_name,
                GROUP_CONCAT(pi.image_url) AS images
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN product_images pi ON p.id = pi.product_id
            WHERE p.slug = ?
            GROUP BY p.id
        `, [slug]);

    if (!result || result.length === 0) {
      return {
        title: 'Product Not Found',
        description: 'The requested product could not be found.',
      };
    }

    const product = {
      ...result[0],
      images: result[0].images ? result[0].images.split(',') : []
    };

    const imageUrl = product.images && product.images.length > 0 ? product.images[0] : '/Vape-Marina-1.png';
    const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `https://vapemarina.ae${imageUrl}`;

    // Clean description for meta tags
    const cleanDescription = product.description
      ? product.description.replace(/<[^>]*>/g, '').substring(0, 160)
      : `Buy ${product.product_name} online at Vape Marina UAE. High quality vaping products with fast delivery.`;

    return {
      title: `${product.product_name} - Vape Marina UAE`,
      description: cleanDescription,
      keywords: `vape, ${product.category_name || 'vaping'}, ${product.product_name}, Vape Marina UAE, ${product.tags || ''},${product.keywords || ''}`,
      openGraph: {
        title: `${product.product_name} - Vape Marina UAE`,
        description: cleanDescription,
        type: 'website',
        url: `https://vapemarina.ae/shop/${slug}`,
        images: [
          {
            url: fullImageUrl,
            width: 1200,
            height: 630,
            alt: product.product_name,
          },
        ],
        siteName: 'Vape Marina UAE',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.product_name} - Vape Marina UAE`,
        description: cleanDescription,
        images: [fullImageUrl],
      },
      alternates: {
        canonical: `https://vapemarina.ae/shop/${slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product - Vape Marina UAE',
      description: 'Buy high quality vaping products online at Vape Marina UAE.',
    };
  }
}

// Generate static params for better performance
export async function generateStaticParams() {
  try {
    const products = await executeQuery(`
            SELECT slug FROM products 
            WHERE status = '1' 
            ORDER BY create_date DESC 
            LIMIT 100
        `);

    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// Server Component for fetching product data
async function getProduct(slug) {
  try {
    const result = await executeQuery(`
            SELECT 
                p.*, 
                c.name AS category_name,
                GROUP_CONCAT(pi.image_url) AS images
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN product_images pi ON p.id = pi.product_id
            WHERE p.slug = ?
            GROUP BY p.id
        `, [slug]);

    if (!result || result.length === 0) {
      return null;
    }

    const product = {
      ...result[0],
      images: result[0].images ? result[0].images.split(',') : []
    };

    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Get related products
async function getRelatedProducts(categoryName, productId) {
  try {
    const products = await executeQuery(`
            SELECT 
                p.*, 
                c.name AS category_name,
                GROUP_CONCAT(pi.image_url) AS images
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN product_images pi ON p.id = pi.product_id
            WHERE c.name = ? AND p.id != ? AND p.status = '1'
            GROUP BY p.id
            ORDER BY p.create_date DESC
        `, [categoryName, productId]);

    return products.map(product => ({
      ...product,
      images: product.images ? product.images.split(',') : []
    }));
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

// Main Product Detail Page Component
export default async function ProductDetailsPage({ params }) {
  const { slug } = params;
  const product = await getProduct(slug);
  console.log(product);
  if (!product) {
    notFound();
  }

  // Get related products
  const relatedProducts = await getRelatedProducts(product.category_name, product.id);

  return (
    <ProductDetailsClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}