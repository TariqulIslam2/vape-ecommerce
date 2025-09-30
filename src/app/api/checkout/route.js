import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/db"; // Adjust to your actual DB handler
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
export async function POST(req) {
    try {
        const body = await req.json();
        //console.log(body);
        const {
            firstName,
            lastName,
            address,
            city,
            state,
            phone,
            email,
            notes,
            method,
            live_location,
            users_id,
            cartItems,
            shippingFee,
            total_amount,
            createAccount,
            password
        } = body;

        let userId = users_id || 1; // fallback if not creating account

        if (createAccount) {
            const name = `${firstName} ${lastName}`.trim();
            const joining_date = new Date();
            const role = 3;
            const status = 1;

            // Hash the password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Insert user
            const result = await executeQuery(
                'INSERT INTO users (name, email, password, contact, joining_date, role, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [name, email, hashedPassword, phone, joining_date, role, status]
            );
            userId = result.insertId;
        }

        // Generate invoice and current date
        const invoice_no = "INV-" + Date.now();
        const status = 0;

        // Insert into `order` table
        const orderResult = await executeQuery(
            `INSERT INTO orders (
                invoice_no, status,
                first_name, last_name, street_address, city, state,
                phone, email, order_notes, method, live_location, users_id,delivery_charge,total_amount
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                invoice_no, status,
                firstName, lastName, address, city, state,
                phone, email, notes, method, live_location, userId, shippingFee, total_amount
            ]
        );

        const order_id = orderResult.insertId;
        // console.log("order_id", order_id)
        // Insert each cart item into `order_items`
        for (const item of cartItems) {
            // console.log("item", item)
            await executeQuery(
                `
            INSERT INTO order_items (
              order_id, product_id, quantity,
              price, flavor, offer, color, nicotine
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
                [
                    order_id,
                    item.id,
                    item.quantity,
                    item.selectedOffer?.toLowerCase().includes("box") ? item.box_price : item.single_price,
                    item.selectedFlavor ?? null,
                    item.selectedOffer ?? null,
                    item.selectedColor ?? null,
                    item.selectedNicotine ?? null,
                ]
            );
        }

        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            console.warn("Email credentials not configured, skipping email send");
            return NextResponse.json({ message: "Order status updated successfully (email not sent - credentials missing)" });
        }

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
        const emailResult = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: "vapemarina25@gmail.com",  // Admin email
            subject: `🔔 New Pending Order - ${invoice_no}`,
            text: `A new pending order has been placed by ${firstName} ${lastName}.`,
            html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545;">⚠️ New Pending Order</h2>
        <p>A new order has been placed and is waiting for approval.</p>
        <div style="background:#f8f9fa; padding:10px; border-radius:6px; margin:10px 0;">
          <p><strong>Order Number:</strong> ${invoice_no}</p>
          <p><strong>Customer:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Total:</strong> ${total_amount} AED</p>
          <p><strong>Payment Method:</strong> ${method}</p>
        </div>
        <p>Please login to the admin panel and review the order for approval.</p>
        <p>Best regards,<br>System Bot</p>
      </div>
    `
        });



        return NextResponse.json({ message: "Order placed successfully", userId }, { status: 201 });
    } catch (error) {
        console.error("Checkout POST error:", error);
        return NextResponse.json({ error: "Order submission failed" }, { status: 500 });
    }
}
