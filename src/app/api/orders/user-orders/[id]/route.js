import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";
export async function GET(request, { params }) {
    const { id } = params;
    try {
        // Get the order by ID
        const orderQuery = `
            SELECT * FROM orders
            WHERE id = ?
        `;
        const rows = await executeQuery(orderQuery, [id]);
        const order = rows[0];
        if (!order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }
        // Get order items for this order
        const itemsQuery = `
            SELECT oi.*, p.product_name
            FROM order_items oi
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        `;
        const itemsRows = await executeQuery(itemsQuery, [id]);
        return NextResponse.json({
            order,
            items: itemsRows
        });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}