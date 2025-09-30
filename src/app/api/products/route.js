import { executeQuery } from "@/lib/db";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";



// Disable body parsing for file uploads
export const config = {
    api: {
        bodyParser: false,
    },
};

// GET: Fetch all products
export async function GET() {
    try {
        const products = await executeQuery(`
     SELECT 
        p.*, 
        c.name AS category_name, 
        GROUP_CONCAT(pi.image_url) AS images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      GROUP BY p.id
    `);

        // Parse comma-separated images into arrays
        const formattedProducts = products.map(product => ({
            ...product,
            images: product.images ? product.images.split(',') : []
        }));
        //console.log("formattedProducts", formattedProducts.length);
        return NextResponse.json(formattedProducts);
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json(
            { message: "Error fetching products", error },
            { status: 500 }
        );
    }
}

// POST: Create new product with images
export async function POST(request) {
    //console.log("Hit product creation endpoint");

    try {
        // Create upload directory
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await fs.mkdir(uploadDir, { recursive: true });

        // Parse form data
        const formData = await request.formData();

        // Prepare product data
        const productData = {
            name: formData.get('name'),
            discount_percentage: formData.get('discountPercentage'),
            price_single_box: formData.get('priceSingleBox'),
            price_double_box: formData.get('priceDoubleBox'),
            sale_price: formData.get('salePrice'),
            quantity: formData.get('quantity'),
            brand: formData.get('brand'),
            category: formData.get('category'),
            slug: formData.get('slug'),
            description: formData.get('description'),
            flavors: formData.get('flavors'),
            offers: formData.get('offers'),
            keywords: formData.get('keywords'),
            tags: formData.get('tags'),
            colors: formData.get('colors'),
            nicotines: formData.get('nicotines'),
            review: formData.get('review'),
        };

        //console.log("Extracted product data:", productData);

        // Validate required fields
        if (!productData.name || !productData.price_single_box ||
            !productData.quantity || !productData.category) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Start transaction

        const processedSlug = productData.slug
            .trim() // Remove leading/trailing spaces
            .toLowerCase() // Convert to lowercase
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/[^\w-]+/g, ''); // Remove all non-word characters except hyphens


        // Insert product
        const productResult = await executeQuery(
            `INSERT INTO products (
                product_name, discount, single_price, box_price,
                sale_price, stock, brand, category_id,slug, description,review, flavors,
                offers, keywords, tags,colors,nicotines,status,published
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`,
            [
                productData.name,
                parseInt(productData.discount_percentage),
                parseInt(productData.price_single_box),
                parseInt(productData.price_double_box),
                parseInt(productData.sale_price),
                parseInt(productData.quantity),
                productData.brand,
                productData.category,
                processedSlug,
                productData.description,
                productData.review,
                productData.flavors,
                productData.offers,
                productData.keywords,
                productData.tags,
                productData.colors,
                productData.nicotines,
                1,
                1
            ]
        );

        const productId = productResult.insertId;
        // console.log("Created product ID:", productId);

        // Process images
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
                    [productId, imageUrl]
                );
            }
        }

        // Commit transaction


        return NextResponse.json(
            { message: "Product created successfully", id: productId },
            { status: 201 }
        );
    } catch (error) {
        // Rollback on error


        console.error("Product creation failed:", error);
        return NextResponse.json(
            {
                message: "Internal server error",
                error: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
    }
}

// PUT: Update product
export async function PUT(request) {
    try {
        const {
            id,
            name,
            discountPercentage,
            priceSingleBox,
            priceDoubleBox,
            salePrice,
            quantity,
            brand,
            category,
            slug,
            description,
            flavors,
            offers,
            keywords,
            tags,
            status,
            published,
            top
        } = await request.json();


        if (!id) {
            return NextResponse.json(
                { message: "Product ID is required" },
                { status: 400 }
            );
        }

        const updateFields = [];
        const values = [];

        if (name !== undefined) {
            updateFields.push("name = ?");
            values.push(name);
        }
        if (discountPercentage !== undefined) {
            updateFields.push("discount_percentage = ?");
            values.push(discountPercentage);
        }
        if (priceSingleBox !== undefined) {
            updateFields.push("price_single_box = ?");
            values.push(priceSingleBox);
        }
        if (priceDoubleBox !== undefined) {
            updateFields.push("price_double_box = ?");
            values.push(priceDoubleBox);
        }
        if (salePrice !== undefined) {
            updateFields.push("sale_price = ?");
            values.push(salePrice);
        }
        if (quantity !== undefined) {
            updateFields.push("quantity = ?");
            values.push(quantity);
        }
        if (brand !== undefined) {
            updateFields.push("brand = ?");
            values.push(brand);
        }
        if (category !== undefined) {
            updateFields.push("category = ?");
            values.push(category);
        }
        if (slug !== undefined) {
            updateFields.push("slug = ?");
            values.push(slug);
        }
        if (description !== undefined) {
            updateFields.push("description = ?");
            values.push(description);
        }
        if (flavors !== undefined) {
            updateFields.push("flavors = ?");
            values.push(flavors);
        }
        if (offers !== undefined) {
            updateFields.push("offers = ?");
            values.push(offers);
        }
        if (keywords !== undefined) {
            updateFields.push("keywords = ?");
            values.push(keywords);
        }
        if (tags !== undefined) {
            updateFields.push("tags = ?");
            values.push(tags);
        }
        if (status !== undefined) {
            updateFields.push("status = ?");
            values.push(status);
        }
        if (published !== undefined) {
            updateFields.push("published = ?");
            values.push(published);
        }
        if (top !== undefined) {
            updateFields.push("top = ?");
            values.push(top);
        }


        if (updateFields.length === 0) {
            return NextResponse.json(
                { message: "No fields to update" },
                { status: 400 }
            );
        }

        values.push(id);

        const query = `UPDATE products SET ${updateFields.join(", ")} WHERE id = ?`;
        console.log("query", query, "values", values);
        const result = await executeQuery(query, values);

        return NextResponse.json({
            message: "Product updated",
            affectedRows: result.affectedRows,
        });
    } catch (error) {
        console.error("PUT Error:", error);
        return NextResponse.json(
            { message: "Error updating product", error },
            { status: 500 }
        );
    }
}

// DELETE: Delete product
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { message: "Product ID is required" },
                { status: 400 }
            );
        }

        // Start transaction


        // Delete images first
        await executeQuery("DELETE FROM product_images WHERE product_id = ?", [id]);

        // Then delete product
        const result = await executeQuery("DELETE FROM products WHERE id = ?", [id]);

        // Commit transaction


        return NextResponse.json({
            message: "Product deleted",
            affectedRows: result.affectedRows,
        });
    } catch (error) {
        ;
        console.error("DELETE Error:", error);
        return NextResponse.json(
            { message: "Error deleting product", error },
            { status: 500 }
        );
    }
}