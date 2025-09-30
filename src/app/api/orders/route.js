import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db";
import nodemailer from "nodemailer";
// import { generateInvoicePDF } from "@/lib/pdfGenerator";
// import { sendOrderStatusUpdateEmail } from "@/lib/emailService";

// Get all orders
export async function GET(req) {
    try {
        // console.log("GET /api/orders - Starting request");

        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search") || "";
        const status = searchParams.get("status");
        const method = searchParams.get("method");
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        // console.log("Search params:", { search, status, method, startDate, endDate });

        let queryString = `SELECT * FROM orders WHERE 1=1`;
        const params = [];

        if (search) {
            queryString += ` AND CONCAT(first_name, ' ', last_name) LIKE ?`;
            params.push(`%${search}%`);
        }

        if (status) {
            queryString += ` AND status = ?`;
            params.push(status);
        }

        if (method) {
            queryString += ` AND method = ?`;
            params.push(method);
        }

        if (startDate && endDate) {
            queryString += ` AND order_date BETWEEN ? AND ?`;
            params.push(startDate, endDate);
        }

        // console.log("Executing query:", queryString);
        // console.log("Query params:", params);

        const results = await executeQuery(queryString + " ORDER BY order_date DESC", params);
        // console.log("Query results count:", results.length);

        return NextResponse.json(results);
    } catch (error) {
        console.error("GET /api/orders error:", error);
        console.error("Error stack:", error.stack);
        return NextResponse.json({
            error: "Failed to fetch orders",
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}

// Update status only
export async function PUT(req) {
    try {
        // console.log("PUT /api/orders - Starting request");

        const body = await req.json();
        // console.log("Request body:", body);

        const { id, status } = body;

        if (!id || status === undefined) {
            return NextResponse.json({ error: "ID and status are required" }, { status: 400 });
        }

        // console.log("Updating order:", { id, status });

        // Get current order data to check previous status
        const currentOrder = await executeQuery(
            `SELECT * FROM orders WHERE id = ?`,
            [id]
        );

        if (currentOrder.length === 0) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        const order = currentOrder[0];
        const previousStatus = order.status;
        // console.log("Current order:", order);

        // Update order status
        await executeQuery(
            `UPDATE orders SET status = ? WHERE id = ?`,
            [status, id]
        );

        // console.log("Order status updated successfully");

        // If status changed from 0 (Pending) to 1 (Accepted), send invoice email
        if (status === 1 && previousStatus === 0) {
            // console.log("Sending invoice email for accepted order...");
            try {
                // Get order items for the invoice
                const orderItems = await executeQuery(
                    `SELECT oi.*, p.product_name 
                     FROM order_items oi 
                     LEFT JOIN products p ON oi.product_id = p.id 
                     WHERE oi.order_id = ?`,
                    [id]
                );

                // Prepare order data for PDF
                const orderDataForPDF = {
                    ...order,
                    order_items: orderItems
                };

                // Generate PDF invoice
                // const pdfBuffer = await generateInvoicePDF(orderDataForPDF);
                // console.log("PDF generated successfully");

                // Check if email credentials are configured
                if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
                    console.warn("Email credentials not configured, skipping email send");
                    return NextResponse.json({ message: "Order status updated successfully (email not sent - credentials missing)" });
                }

                // console.log("Email credentials found, setting up transporter...");

                // Setup email transporter for custom domain
                const transporter = nodemailer.createTransport({
                    host: process.env.MAIL_HOST,
                    port: 465,
                    secure: true,
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASSWORD,
                    },
                    // cPanel specific settings
                    tls: {
                        rejectUnauthorized: false,
                    }
                });

                // console.log("Starting email sending process...");

                // Send email with PDF attachment
                const emailResult = await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: order.email,
                    subject: `Your Order has been Accepted! - Invoice Attached`,
                    text: "Your order has been accepted and is now being processed. Thank you for your purchase!",
                    html: `
                      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #28a745;">🎉 Order Accepted!</h2>
                        <p>Dear <strong>${order.first_name} ${order.last_name}</strong>,</p>
                        <p>Great news! Your order has been accepted and is now being processed.</p>

                        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                          <h3>Order Details:</h3>
                          <p><strong>Order Number:</strong> ${order.invoice_no}</p>
                          <p><strong>Order Date:</strong> ${new Date(order.order_date).toLocaleDateString()}</p>
                          <p><strong>Total Amount:</strong> ${order.total_amount} AED</p>
                          <p><strong>Payment Method:</strong> ${order.method}</p>
                        </div>
                        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
                            <thead>
                                <tr style="background-color: #f8f9fa;">
                                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Product</th>
                                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Quantity</th>
                                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Price</th>
                                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Color</th>
                                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Flavor</th>
                                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Offer</th>
                                    <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Nicotine</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${orderItems.map(item => `
                                    <tr style="border-bottom: 1px solid #dee2e6;">
                                        <td style="padding: 12px;">${item.product_name || '-'}</td>
                                        <td style="padding: 12px;">${item.quantity || '-'}</td>
                                        <td style="padding: 12px;">${item.price || '-'} AED</td>
                                        <td style="padding: 12px;">${item.color || '-'}</td>
                                        <td style="padding: 12px;">${item.flavor || '-'}</td>
                                        <td style="padding: 12px;">${item.offer || '-'}</td>
                                        <td style="padding: 12px;">${item.nicotine || '-'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>

                        <p>Please find your invoice attached to this email.</p>
                        <p>We will notify you once your order is ready for delivery.</p>

                        <p>Thank you for choosing us!</p>
                        <p>Best regards,<br>Vape Marina</p>
                      </div>
                    `,
                    // attachments: [
                    //     {
                    //         filename: `Invoice-${order.invoice_no}.pdf`,
                    //         content: pdfBuffer,
                    //         contentType: 'application/pdf'
                    //     }
                    // ]
                });

                // console.log("Email sent successfully! Message ID:", emailResult.messageId);

            } catch (emailError) {
                console.error("Failed to send invoice email:", emailError);
                console.error("Email error details:", emailError.message);
                // Don't fail the entire request if email fails
                return NextResponse.json({
                    message: "Order status updated successfully (email failed to send)",
                    emailError: process.env.NODE_ENV === 'development' ? emailError.message : undefined
                });
            }
        }

        return NextResponse.json({ message: "Order status updated successfully" });
    } catch (error) {
        console.error("PUT orders error:", error);
        console.error("Error stack:", error.stack);
        return NextResponse.json({
            error: "Failed to update status",
            details: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
