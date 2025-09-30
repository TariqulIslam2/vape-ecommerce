import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const users_id = searchParams.get("users_id") || "";
        // console.log(users_id);
        let queryString = `SELECT * FROM orders where users_id=? ORDER BY order_date DESC`;

        const results = await executeQuery(queryString, [users_id]);
        return NextResponse.json(results);
    } catch (error) {
        console.error("GET /api/orders/user-orders error:", error);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}