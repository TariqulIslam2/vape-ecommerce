export const dynamic = "force-dynamic"; // always SSR, no cache
export const revalidate = 0; // never cache

import { executeQuery } from '@/lib/db';
import ProductFilter from './ProductFilter';

const ProductCategoryPage = async ({ category }) => {
    // Normalize category name to ensure consistent matching
    const normalizedCategory = parseInt(category) || category;

    const products = await executeQuery(
        `SELECT
            p.*,
            c.name AS category_name,
            GROUP_CONCAT(pi.image_url) AS images
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN product_images pi ON p.id = pi.product_id
        WHERE p.status = 1 
            AND p.category_id = ?
        GROUP BY p.id`,
        [normalizedCategory]
    );

    const formattedProducts = products.map(product => ({
        ...product,
        images: product.images ? product.images.split(',') : []
    }));

    return (
        <div className="mx-auto">
            <ProductFilter
                initialProducts={formattedProducts}
                category={category}
                searchTerm=""
            />

            {/* Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ProductCollection",
                        "name": `${formattedProducts[0]?.category_name} Collection`,
                        "description": `Premium ${formattedProducts[0]?.category_name} collection in Dubai`,
                        "url": `https://vapmarina.ae/${formattedProducts[0]?.category_name.toLowerCase().replace(/\s+/g, '-')}`,
                        "image": `https://vapmarina.ae/${formattedProducts[0]?.category_name.toLowerCase()}-schema.jpg`,
                        "numberOfItems": formattedProducts.length,
                        "mainEntity": formattedProducts.slice(0, 10).map(product => ({
                            "@type": "Product",
                            "name": product.product_name,
                            "image": product.images?.[0] || "",
                            "offers": {
                                "@type": "Offer",
                                "price": product.single_price,
                                "priceCurrency": "AED"
                            }
                        }))
                    })
                }}
            />
        </div>
    );
};

export default ProductCategoryPage;