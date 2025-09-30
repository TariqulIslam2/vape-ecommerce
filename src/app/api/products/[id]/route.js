// /api/products/[id]/route.js

import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db'; // adjust to your path
import path from "path";
import fs from "fs/promises";

export async function GET(req, { params }) {
    const { id } = params;

    try {
        const result = await executeQuery(`
      SELECT 
        p.*, 
        c.name AS category_name,
        GROUP_CONCAT(pi.image_url) AS images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      WHERE p.id = ?
      GROUP BY p.id
    `, [id]);

        if (result.length === 0) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        const product = {
            ...result[0],
            images: result[0].images ? result[0].images.split(',') : []
        };

        return NextResponse.json(product);
    } catch (error) {
        console.error("GET by ID Error:", error);
        return NextResponse.json(
            { message: "Error fetching product", error },
            { status: 500 }
        );
    }
}

// PUT: Update a single product by ID
export async function PUT(request, context) {
    const { params } = await context;
    const { id } = params;
    console.log(id);
    try {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await fs.mkdir(uploadDir, { recursive: true });

        const formData = await request.formData();

        // Gather product fields
        const productData = {
            name: formData.get('name'),
            discountPercentage: formData.get('discountPercentage') ? Number(formData.get('discountPercentage')) : null,
            priceSingleBox: formData.get('priceSingleBox') ? Number(formData.get('priceSingleBox')) : null,
            priceDoubleBox: formData.get('priceDoubleBox') ? Number(formData.get('priceDoubleBox')) : null,
            salePrice: formData.get('salePrice') ? Number(formData.get('salePrice')) : null,
            quantity: formData.get('quantity') ? Number(formData.get('quantity')) : null,
            brand: formData.get('brand'),
            slug: formData.get('slug'),
            category: formData.get('category') ? Number(formData.get('category')) : null,
            description: formData.get('description'),
            flavors: formData.get('flavors'),
            offers: formData.get('offers'),
            keywords: formData.get('keywords'),
            tags: formData.get('tags'),
            colors: formData.get('colors'),
            nicotines: formData.get('nicotines'),
            review: formData.get('review'),
        };

        // Validate required fields
        if (!productData.name || !productData.priceSingleBox || !productData.quantity || !productData.category) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // Update product row
        await executeQuery(
            `UPDATE products SET 
                product_name = ?, discount = ?, single_price = ?, box_price = ?, sale_price = ?, stock = ?, brand = ?,slug = ?, category_id = ?, description = ?, review = ?, flavors = ?, offers = ?, keywords = ?, tags = ?, colors = ?, nicotines = ?
            WHERE id = ?`,
            [
                productData.name,
                productData.discountPercentage,
                productData.priceSingleBox,
                productData.priceDoubleBox,
                productData.salePrice,
                productData.quantity,
                productData.brand,
                productData.slug,
                productData.category,
                productData.description,
                productData.review,
                productData.flavors,
                productData.offers,
                productData.keywords,
                productData.tags,
                productData.colors,
                productData.nicotines,
                id
            ]
        );

        // Handle images
        // 1. Remove all old images not in 'existingImages'
        const existingImages = formData.getAll('existingImages');
        const oldImages = await executeQuery("SELECT image_url FROM product_images WHERE product_id = ?", [id]);
        const oldImageUrls = oldImages.map(img => img.image_url);

        // Delete images that are not in existingImages
        for (const url of oldImageUrls) {
            if (!existingImages.includes(url)) {
                await executeQuery("DELETE FROM product_images WHERE product_id = ? AND image_url = ?", [id, url]);
                // Optionally, delete the file from disk:
                const filePath = path.join(process.cwd(), 'public', url.replace('/uploads/', 'uploads/'));
                try { await fs.unlink(filePath); } catch { }
            }
        }

        // 2. Add new images
        const images = formData.getAll('images');
        for (const image of images) {
            if (image instanceof Blob) {
                const buffer = Buffer.from(await image.arrayBuffer());
                const uniqueName = `${Date.now()}-${image.name.replace(/\s+/g, '-')}`;
                const filePath = path.join(uploadDir, uniqueName);
                await fs.writeFile(filePath, buffer);

                const imageUrl = `/uploads/${uniqueName}`;
                await executeQuery(
                    "INSERT INTO product_images (product_id, image_url) VALUES (?, ?)",
                    [id, imageUrl]
                );
            }
        }

        return NextResponse.json({ message: "Product updated successfully!" });
    } catch (error) {
        console.error("PUT Error:", error);
        return NextResponse.json({ message: "Error updating product", error }, { status: 500 });
    }
}
