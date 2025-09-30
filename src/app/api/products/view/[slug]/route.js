import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db'; // adjust to your path
import path from "path";
import fs from "fs/promises";

export async function GET(req, { params }) {
    const { slug } = params;

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