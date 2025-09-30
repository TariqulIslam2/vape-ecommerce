import nodemailer from "nodemailer";

// Create transporter with cPanel-compatible settings
const createTransporter = () => {
    return nodemailer.createTransporter({
        host: process.env.SMTP_HOST || "localhost",
        port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        // cPanel specific settings
        tls: {
            rejectUnauthorized: false,
        },
    });
};

// Send order confirmation email with PDF attachment
export async function sendOrderConfirmationEmail(orderData, pdfBuffer) {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: orderData.email,
            subject: `Order Confirmation - Invoice #${orderData.invoice_no}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Order Confirmation</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Vape Marina UAE</p>
          </div>
          
          <div style="padding: 20px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 15px;">Thank you for your order!</h2>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #667eea; margin-top: 0;">Order Details:</h3>
              <p><strong>Invoice #:</strong> ${orderData.invoice_no}</p>
              <p><strong>Order Date:</strong> ${new Date(orderData.order_date).toLocaleDateString()}</p>
              <p><strong>Total Amount:</strong> AED ${orderData.total_amount}</p>
              <p><strong>Payment Method:</strong> ${orderData.method || 'COD'}</p>
              <p><strong>Status:</strong> ${orderData.status + 1 === 2 ? 'Delivered' : orderData.status + 1 === 1 ? 'Accepted' : 'Pending'}</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #667eea; margin-top: 0;">Delivery Information:</h3>
              <p><strong>Name:</strong> ${orderData.first_name} ${orderData.last_name}</p>
              <p><strong>Address:</strong> ${orderData.street_address || 'N/A'}</p>
              <p><strong>City:</strong> ${orderData.city || 'N/A'}, ${orderData.state || 'N/A'}</p>
              <p><strong>Phone:</strong> ${orderData.phone || 'N/A'}</p>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              Your invoice is attached to this email. If you have any questions about your order, 
              please contact us at +971567404217 or reply to this email.
            </p>
            
            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #999; font-size: 12px;">
                Vape Marina UAE<br>
                Dubai, United Arab Emirates<br>
                +971567404217
              </p>
            </div>
          </div>
        </div>
      `,
            attachments: [
                {
                    filename: `invoice-${orderData.invoice_no}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf',
                },
            ],
        };

        const result = await transporter.sendMail(mailOptions);
        // console.log("Order confirmation email sent successfully:", result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error("Failed to send order confirmation email:", error);
        return { success: false, error: error.message };
    }
}

// Send order status update email
export async function sendOrderStatusUpdateEmail(orderData, newStatus) {
    try {
        const transporter = createTransporter();

        const statusText = newStatus + 1 === 2 ? 'Delivered' : newStatus + 1 === 1 ? 'Accepted' : 'Pending';

        const mailOptions = {
            from: process.env.SMTP_FROM || process.env.SMTP_USER,
            to: orderData.email,
            subject: `Order Status Update - Invoice #${orderData.invoice_no}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Order Status Update</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Vape Marina UAE</p>
          </div>
          
          <div style="padding: 20px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 15px;">Your order status has been updated!</h2>
            
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #667eea; margin-top: 0;">Order Information:</h3>
              <p><strong>Invoice #:</strong> ${orderData.invoice_no}</p>
              <p><strong>New Status:</strong> <span style="color: #059669; font-weight: bold;">${statusText}</span></p>
              <p><strong>Order Date:</strong> ${new Date(orderData.order_date).toLocaleDateString()}</p>
              <p><strong>Total Amount:</strong> AED ${orderData.total_amount}</p>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              We'll keep you updated on any further changes to your order status. 
              If you have any questions, please contact us at +971567404217.
            </p>
            
            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #999; font-size: 12px;">
                Vape Marina UAE<br>
                Dubai, United Arab Emirates<br>
                +971567404217
              </p>
            </div>
          </div>
        </div>
      `,
        };

        const result = await transporter.sendMail(mailOptions);
        // console.log("Order status update email sent successfully:", result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error("Failed to send order status update email:", error);
        return { success: false, error: error.message };
    }
} 