import { generateInvoicePDF } from './src/lib/pdfGenerator.js';

// Test data
const testOrderData = {
    invoice_no: 'INV-001',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    street_address: '123 Main St',
    city: 'New York',
    state: 'NY',
    order_date: new Date().toISOString(),
    status: 1,
    method: 'Credit Card',
    total_amount: 150.00,
    order_items: [
        {
            product_name: 'Test Product 1',
            quantity: 2,
            price: 50.00,
            flavor: 'Mint',
            color: 'Blue'
        },
        {
            product_name: 'Test Product 2',
            quantity: 1,
            price: 50.00,
            nicotine: '3mg'
        }
    ]
};

async function testPDFGeneration() {
    try {
        console.log('Testing PDF generation...');
        const pdfBuffer = await generateInvoicePDF(testOrderData);
        console.log('PDF generated successfully!');
        console.log('PDF size:', pdfBuffer.length, 'bytes');

        // Save the PDF to a file for inspection
        const fs = await import('fs');
        fs.writeFileSync('test-invoice.pdf', pdfBuffer);
        console.log('PDF saved as test-invoice.pdf');

    } catch (error) {
        console.error('PDF generation failed:', error);
        
    }
}

testPDFGeneration(); 