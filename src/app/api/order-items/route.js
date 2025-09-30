import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";


export async function GET() {
    try {
        const orderItems = await executeQuery(`SELECT 
        oi.*,
        p.product_name,
        c.name AS category_name
      FROM 
        order_items oi
      JOIN 
        products p ON oi.product_id = p.id
      JOIN 
        categories c ON p.category_id = c.id`);
        // console.log("orderItems", orderItems);
        return NextResponse.json(orderItems);
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ message: "Error fetching order items", error }, { status: 500 });
    }
}