import { executeQuery } from "@/lib/db";
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

// GET: Fetch single blog by ID
export async function GET(request, { params }) {
    try {
        const { id } = params;

        if (!id) {
            return NextResponse.json(
                { message: "Blog ID is required" },
                { status: 400 }
            );
        }

        const blogs = await executeQuery(
            `SELECT blog_posts.*, categories.name AS category_name 
             FROM blog_posts 
             LEFT JOIN categories ON blog_posts.category = categories.id 
             WHERE blog_posts.id = ?`,
            [id]
        );

        if (blogs.length === 0) {
            return NextResponse.json(
                { message: "Blog not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(blogs[0]);
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json(
            { message: "Error fetching blog", error },
            { status: 500 }
        );
    }
}

// PUT: Update blog with images
export async function PUT(request, { params }) {
    try {
        const { id } = params;

        if (!id) {
            return NextResponse.json(
                { message: "Blog ID is required" },
                { status: 400 }
            );
        }

        // Check if the request is multipart/form-data (for file uploads)
        const contentType = request.headers.get("content-type");

        if (contentType && contentType.includes("multipart/form-data")) {
            // Handle file upload update
            return await handleImageUpdate(request, id);
        } else {
            // Handle JSON data update
            return await handleDataUpdate(request, id);
        }
    } catch (error) {
        console.error("PUT Error:", error);
        return NextResponse.json(
            { message: "Error updating blog", error },
            { status: 500 }
        );
    }
}

async function handleDataUpdate(request, id) {
    const {
        title,
        short_info,
        slug,
        description,
        category,
        author,
        date,
        time,
        status,
        published,
        top,
        keywords,
        tags,
    } = await request.json();

    const updateFields = [];
    const values = [];

    if (title !== undefined) {
        updateFields.push("title = ?");
        values.push(title);
    }
    if (short_info !== undefined) {
        updateFields.push("excerpt = ?");
        values.push(short_info);
    }
    if (slug !== undefined) {
        updateFields.push("slug = ?");
        values.push(slug);
    }
    if (description !== undefined) {
        updateFields.push("content = ?");
        values.push(description);
    }
    if (category !== undefined) {
        updateFields.push("category = ?");
        values.push(category);
    }
    if (published !== undefined) {
        updateFields.push("published = ?");
        values.push(published);
    }

    if (updateFields.length === 0) {
        return NextResponse.json(
            { message: "No fields to update" },
            { status: 400 }
        );
    }

    values.push(id);

    const query = `UPDATE blog_posts SET ${updateFields.join(", ")} WHERE id = ?`;
    const result = await executeQuery(query, values);

    return NextResponse.json({
        message: "Blog updated",
        affectedRows: result.affectedRows,
    });
}

async function handleImageUpdate(request, id) {
    try {
        // Create upload directory
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await fs.mkdir(uploadDir, { recursive: true });

        // Parse form data
        const formData = await request.formData();
        const images = formData.getAll('images');

        // Process new images (only the first one since blog_posts.image is a single column)
        if (images.length > 0 && images[0] instanceof Blob) {
            const image = images[0];
            const buffer = Buffer.from(await image.arrayBuffer());
            const uniqueName = `${Date.now()}-${image.name.replace(/\s+/g, '-')}`;
            const filePath = path.join(uploadDir, uniqueName);
            await fs.writeFile(filePath, buffer);

            const imageUrl = `/uploads/${uniqueName}`;

            // Update the blog_posts table with the new image
            await executeQuery(
                "UPDATE blog_posts SET image = ? WHERE id = ?",
                [imageUrl, id]
            );
        }

        return NextResponse.json({
            message: "Blog image updated successfully",
        });
    } catch (error) {
        console.error("Image update error:", error);
        return NextResponse.json(
            { message: "Error updating blog image", error },
            { status: 500 }
        );
    }
} 