import { executeQuery } from "@/lib/db";
import { NextResponse } from "next/server";


// GET: fetch all categories
export async function GET() {
  try {
    const categories = await executeQuery("SELECT * FROM categories");

    // Create response with cache control headers
    const response = NextResponse.json(categories);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error("GET Error:", error);
    const errorResponse = NextResponse.json({ message: "Error fetching categories", error }, { status: 500 });
    errorResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return errorResponse;
  }
}

// POST: create a new category
export async function POST(request) {
  try {
    const { name, description, status } = await request.json();

    if (!name || !description) {
      return NextResponse.json({ message: "Name and description are required" }, { status: 400 });
    }

    const result = await executeQuery(
      "INSERT INTO categories (name, description, status) VALUES (?, ?, ?)",
      [name, description || "", status]
    );

    return NextResponse.json({ message: "Category created", id: result.insertId }, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ message: "Error creating category", error }, { status: 500 });
  }
}

// PUT: update category using id from body
export async function PUT(request) {
  try {
    const { id, name, description, status } = await request.json();

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    // Build dynamic SQL query
    const fields = [];
    const values = [];

    if (name !== undefined) {
      fields.push("name = ?");
      values.push(name);
    }

    if (description !== undefined) {
      fields.push("description = ?");
      values.push(description);
    }

    if (status !== undefined) {
      fields.push("status = ?");
      values.push(status);
    }

    if (fields.length === 0) {
      return NextResponse.json({ message: "No valid fields to update" }, { status: 400 });
    }

    values.push(id); // For WHERE clause

    const query = `UPDATE categories SET ${fields.join(", ")} WHERE id = ?`;

    const result = await executeQuery(query, values);

    return NextResponse.json({ message: "Category updated", affectedRows: result.affectedRows });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ message: "Error updating category", error }, { status: 500 });
  }
}
// DELETE: delete category using id from body
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const result = await executeQuery("DELETE FROM categories WHERE id = ?", [id]);

    return NextResponse.json({ message: "Category deleted", affectedRows: result.affectedRows });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ message: "Error deleting category", error }, { status: 500 });
  }
}
