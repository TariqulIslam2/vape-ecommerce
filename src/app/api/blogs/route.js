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

// GET: Fetch all blogs
export async function GET() {
    try {
        const blogs = await executeQuery("SELECT blog_posts.*, categories.name AS category_name FROM  blog_posts LEFT JOIN categories ON blog_posts.category = categories.id ORDER BY blog_posts.id DESC");

        // Parse comma-separated images into arrays
        return NextResponse.json(blogs);
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json(
            { message: "Error fetching blogs", error },
            { status: 500 }
        );
    }
}

// POST: Create new blog with images
export async function POST(request) {
    //console.log("Hit product creation endpoint");

    try {
        // Create upload directory
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await fs.mkdir(uploadDir, { recursive: true });

        // Parse form data
        const formData = await request.formData();

        // Prepare blog data
        const blogData = {
            name: formData.get('name'),
            short_info: formData.get('short_info'),
            slug: formData.get('slug'),
            description: formData.get('description'),
            category: formData.get('category'),
            author: formData.get('author'),
            date: formData.get('date'),
            time: formData.get('time'),
        };

        // console.log("Extracted blog data:", blogData);


        // Validate required fields
        if (!blogData.name || !blogData.short_info ||
            !blogData.slug || !blogData.description || !blogData.category) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Start transaction


        // Process the slug to replace spaces with hyphens and make it URL-friendly
        const processedSlug = blogData.slug
            .trim() // Remove leading/trailing spaces
            .toLowerCase() // Convert to lowercase
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/[^\w-]+/g, ''); // Remove all non-word characters except hyphens

        const blogResult = await executeQuery(
            `INSERT INTO blog_posts (
        title, excerpt, slug, content, category, author_id
    ) VALUES (?, ?, ?, ?, ?, ?)`,
            [
                blogData.name,
                blogData.short_info,
                processedSlug, // Use the processed slug instead of the raw input
                blogData.description,
                blogData.category,
                1
            ]
        );

        const blogId = blogResult.insertId;
        // console.log("Created blog ID:", blogId);

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
                    "UPDATE blog_posts SET image = ? WHERE 	id = ?",
                    [imageUrl, blogId]
                );
            }
        }

        // Commit transaction


        return NextResponse.json(
            { message: "Blog created successfully", id: blogId },
            { status: 201 }
        );
    } catch (error) {
        // Rollback on error


        console.error("Blog creation failed:", error);
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

// PUT: Update blog
export async function PUT(request) {
    try {
        const {
            id,
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

        if (!id) {
            return NextResponse.json(
                { message: "Blog ID is required" },
                { status: 400 }
            );
        }

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


        // if (status !== undefined) {
        //     updateFields.push("status = ?");
        //     values.push(status);
        // }
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
    } catch (error) {
        console.error("PUT Error:", error);
        return NextResponse.json(
            { message: "Error updating blog", error },
            { status: 500 }
        );
    }
}

// DELETE: Delete blog
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { message: "Blog ID is required" },
                { status: 400 }
            );
        }

        // Start transaction


        // Delete images first
        // await executeQuery("DELETE FROM blog_images WHERE blog_id = ?", [id]);

        // Then delete blog
        const result = await executeQuery("DELETE FROM blog_posts WHERE id = ?", [id]);

        // Commit transaction


        return NextResponse.json({
            message: "Blog deleted",
            affectedRows: result.affectedRows,
        });
    } catch (error) {
        ;
        console.error("DELETE Error:", error);
        return NextResponse.json(
            { message: "Error deleting blog", error },
            { status: 500 }
        );
    }
}