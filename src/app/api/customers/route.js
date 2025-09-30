import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";

export async function GET(req) {
    try {

        let queryString = `SELECT * FROM users where role=3 ORDER BY joining_date DESC`;

        const results = await executeQuery(queryString, []);
        // console.log(results);
        return NextResponse.json(results);
    } catch (error) {
        console.error("GET /api/customers error:", error);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}