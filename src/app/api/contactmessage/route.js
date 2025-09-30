import { executeQuery } from "@/lib/db";
import { NextResponse } from "next/server";

// GET: Fetch all contacts
export async function GET() {
    try {
        const contacts = await executeQuery("SELECT * FROM contacts ORDER BY id DESC");
        return NextResponse.json(contacts);
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ message: "Error fetching contacts", error }, { status: 500 });
    }
}

// POST: Create a new contact
export async function POST(request) {
    try {
        const { name, phone, email, message } = await request.json();

        if (!name || !phone || !email || !message) {
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }

        const result = await executeQuery(
            "INSERT INTO contacts (name, phone, email, message) VALUES (?, ?, ?, ?)",
            [name, phone, email, message]
        );

        return NextResponse.json({ message: "Contact created", id: result.insertId }, { status: 201 });
    } catch (error) {
        console.error("POST Error:", error);
        return NextResponse.json({ message: "Error creating contact", error }, { status: 500 });
    }
}

// PUT: Update contact
export async function PUT(request) {
    try {
        const { id, name, phone, email, message, status } = await request.json();

        if (!id) {
            return NextResponse.json({ message: "ID is required" }, { status: 400 });
        }

        const fields = [];
        const values = [];

        if (name !== undefined) {
            fields.push("name = ?");
            values.push(name);
        }

        if (phone !== undefined) {
            fields.push("phone = ?");
            values.push(phone);
        }

        if (email !== undefined) {
            fields.push("email = ?");
            values.push(email);
        }

        if (message !== undefined) {
            fields.push("message = ?");
            values.push(message);
        }

        if (status !== undefined) {
            fields.push("status = ?");
            values.push(status);
        }

        if (fields.length === 0) {
            return NextResponse.json({ message: "No valid fields to update" }, { status: 400 });
        }

        values.push(id); // for WHERE clause

        const query = `UPDATE contacts SET ${fields.join(", ")} WHERE id = ?`;

        const result = await executeQuery(query, values);

        return NextResponse.json({ message: "Contact updated", affectedRows: result.affectedRows });
    } catch (error) {
        console.error("PUT Error:", error);
        return NextResponse.json({ message: "Error updating contact", error }, { status: 500 });
    }
}

// DELETE: Delete contact
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ message: "ID is required" }, { status: 400 });
        }

        const result = await executeQuery("DELETE FROM contacts WHERE id = ?", [id]);

        return NextResponse.json({ message: "Contact deleted", affectedRows: result.affectedRows });
    } catch (error) {
        console.error("DELETE Error:", error);
        return NextResponse.json({ message: "Error deleting contact", error }, { status: 500 });
    }
}
