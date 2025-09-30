import { executeQuery } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt';
// GET: fetch all users
export async function GET() {
    try {
        const users = await executeQuery("SELECT * FROM users");
        return NextResponse.json(users);
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ message: "Error fetching users", error }, { status: 500 });
    }
}

// POST: create a new user
export async function POST(request) {
    try {
        const { name, email, password, contact, joining_date, role, status } = await request.json();

        if (!name || !email || !contact || !joining_date || !role || !password) {
            return NextResponse.json({ message: 'All required fields must be provided' }, { status: 400 });
        }

        // 🔐 Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // check compare password 
        // const isMatch = await bcrypt.compare(inputPassword, storedHashedPassword);
        // Store the hashed password instead of the raw one
        const result = await executeQuery(
            'INSERT INTO users (name, email, password, contact, joining_date, role, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, contact, joining_date, role, status ?? 1]
        );

        return NextResponse.json({ message: 'User created', id: result.insertId }, { status: 201 });

    } catch (error) {
        console.error('POST Error:', error);
        return NextResponse.json({ message: 'Error creating user', error }, { status: 500 });
    }
}

// PUT: update a user
export async function PUT(request) {
    try {
        const { id, name, email, password, contact, joining_date, role, status } = await request.json();

        if (!id) {
            return NextResponse.json({ message: "ID is required" }, { status: 400 });
        }
        // console.log(id, name, email, password, contact, joining_date, role, status);
        const fields = [];
        const values = [];


        if (name !== undefined) {
            fields.push("name = ?");
            values.push(name);
        }

        if (email !== undefined) {
            fields.push("email = ?");
            values.push(email);
        }

        if (contact !== undefined) {
            fields.push("contact = ?");
            values.push(contact);
        }

        if (joining_date !== undefined) {
            fields.push("joining_date = ?");
            values.push(joining_date);
        }
        if (password !== undefined) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            fields.push("password = ?");
            values.push(hashedPassword);
        }

        if (role !== undefined) {
            fields.push("role = ?");
            values.push(role);
        }

        if (status !== undefined) {
            fields.push("status = ?");
            values.push(status);
        }

        if (fields.length === 0) {
            return NextResponse.json({ message: "No valid fields to update" }, { status: 400 });
        }

        values.push(id);

        const query = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
        const result = await executeQuery(query, values);
        // console.log(result);

        return NextResponse.json({ message: "User updated", affectedRows: result.affectedRows });
    } catch (error) {
        console.error("PUT Error:", error);
        return NextResponse.json({ message: "Error updating user", error }, { status: 500 });
    }
}

// DELETE: delete user using id
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ message: "ID is required" }, { status: 400 });
        }

        const result = await executeQuery("DELETE FROM users WHERE id = ?", [id]);

        return NextResponse.json({ message: "User deleted", affectedRows: result.affectedRows });
    } catch (error) {
        console.error("DELETE Error:", error);
        return NextResponse.json({ message: "Error deleting user", error }, { status: 500 });
    }
}
