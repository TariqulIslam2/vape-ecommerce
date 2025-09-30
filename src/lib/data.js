import { executeQuery } from "./db";

export async function fetchProductsByCategory(category) {
    console.log("fetchProductsByCategory called with:", category);
    try {
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
            [parseInt(category)]
        );
        console.log("products", products);
        const formattedProducts = products.map(product => ({
            ...product,
            images: product.images ? product.images.split(',') : []
        }));
        console.log("formattedProducts", formattedProducts.length);

        return formattedProducts;

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch products.');
    }
}


export async function fetchAllProducts() {
    try {
        const products = await executeQuery(
            `SELECT
      p.*,
      c.name AS category_name,
      GROUP_CONCAT(pi.image_url) AS images
   FROM products p
   LEFT JOIN categories c ON p.category_id = c.id
   LEFT JOIN product_images pi ON p.id = pi.product_id
   WHERE p.status = 1 
     AND LOWER(c.name) LIKE LOWER(?)
   GROUP BY p.id`,
            [`%%`]
        );

        const formattedProducts = products.map(product => ({
            ...product,
            images: product.images ? product.images.split(',') : []
        }));
        //console.log("formattedProducts", formattedProducts.length);

        return formattedProducts;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch products.');
    }
}