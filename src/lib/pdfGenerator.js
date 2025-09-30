import puppeteer from 'puppeteer-core';

// Fallback PDF generator using @react-pdf/renderer
async function generatePDFWithReactPDF(orderData) {
  try {
    const { Document, Page, Text, View, StyleSheet, Font } = await import('@react-pdf/renderer');

    // Register a default font
    Font.register({
      family: 'Helvetica',
      src: 'https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyC0IT4ttDfA.ttf'
    });

    const styles = StyleSheet.create({
      page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 30,
        fontFamily: 'Helvetica'
      },
      header: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        color: '#333'
      },
      section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
      },
      row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        borderBottomStyle: 'solid',
        alignItems: 'center',
        height: 24,
        textAlign: 'center',
        fontStyle: 'bold',
      },
      description: {
        width: '60%',
        textAlign: 'left',
        paddingRight: 10,
      },
      qty: {
        width: '10%',
        textAlign: 'right',
        paddingRight: 10,
      },
      rate: {
        width: '15%',
        textAlign: 'right',
        paddingRight: 10,
      },
      amount: {
        width: '15%',
        textAlign: 'right',
        paddingRight: 10,
      },
      total: {
        marginTop: 20,
        textAlign: 'right',
        fontSize: 16,
        fontWeight: 'bold'
      }
    });

    const MyDocument = () => (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text>Invoice #{orderData.invoice_no}</Text>
          </View>

          <View style={styles.section}>
            <Text>Bill To: {orderData.first_name} {orderData.last_name}</Text>
            <Text>Email: {orderData.email}</Text>
            <Text>Phone: {orderData.phone}</Text>
            <Text>Address: {orderData.street_address}, {orderData.city}, {orderData.state}</Text>
          </View>

          <View style={styles.section}>
            <Text>Order Date: {new Date(orderData.order_date).toLocaleDateString()}</Text>
            <Text>Status: {orderData.status === 0 ? 'Pending' : orderData.status === 1 ? 'Accepted' : 'Delivered'}</Text>
            <Text>Payment Method: {orderData.method || 'COD'}</Text>
          </View>

          {orderData.order_items && orderData.order_items.length > 0 && (
            <View style={styles.section}>
              <View style={styles.row}>
                <Text style={styles.description}>Item</Text>
                <Text style={styles.qty}>Qty</Text>
                <Text style={styles.rate}>Price</Text>
                <Text style={styles.amount}>Amount</Text>
              </View>

              {orderData.order_items.map((item, index) => (
                <View key={index} style={styles.row}>
                  <Text style={styles.description}>{item.product_name || 'Product'}</Text>
                  <Text style={styles.qty}>{item.quantity}</Text>
                  <Text style={styles.rate}>AED {parseFloat(item.price).toFixed(2)}</Text>
                  <Text style={styles.amount}>AED {(item.quantity * item.price).toFixed(2)}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.total}>
            <Text>Total: AED {orderData.total_amount}</Text>
          </View>
        </Page>
      </Document>
    );

    const { renderToBuffer } = await import('@react-pdf/renderer');
    const pdfBuffer = await renderToBuffer(<MyDocument />);
    return pdfBuffer;
  } catch (error) {
    console.error('React PDF generation error:', error);
    throw error;
  }
}

export async function generateInvoicePDF(orderData) {
  let browser;

  try {
    // Try different browser paths for different environments
    const browserPaths = [
      // Windows paths
      'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Users\\' + process.env.USERNAME + '\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
      'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
      'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      // Linux paths (for server environments)
      '/usr/bin/chromium-browser',
      '/usr/bin/chromium',
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      // Custom environment variable
      process.env.CHROME_PATH,
      // Let puppeteer find it automatically (only works with full puppeteer package)
      undefined
    ];

    let browserLaunched = false;

    for (const executablePath of browserPaths) {
      try {
        console.log(`Attempting to launch browser with path: ${executablePath || 'auto-detect'}`);

        browser = await puppeteer.launch({
          executablePath: executablePath,
          headless: 'new',
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--single-process',
            '--disable-extensions',
            '--disable-plugins',
            '--disable-images',
            '--disable-javascript',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding'
          ]
        });

        browserLaunched = true;
        console.log(`Browser launched successfully with path: ${executablePath || 'auto-detect'}`);
        break;
      } catch (error) {
        console.log(`Failed to launch browser with path ${executablePath}:`, error.message);
        continue;
      }
    }

    if (!browserLaunched) {
      // Try to use full puppeteer if available
      try {
        console.log('Attempting to use full puppeteer package...');
        const fullPuppeteer = await import('puppeteer');
        browser = await fullPuppeteer.default.launch({
          headless: 'new',
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--single-process',
            '--disable-extensions',
            '--disable-plugins',
            '--disable-images',
            '--disable-javascript',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding'
          ]
        });
        browserLaunched = true;
        console.log('Browser launched successfully with full puppeteer package');
      } catch (fullPuppeteerError) {
        console.log('Full puppeteer package not available:', fullPuppeteerError.message);
        console.log('Falling back to React PDF renderer...');
        return await generatePDFWithReactPDF(orderData);
      }
    }

    const page = await browser.newPage();

    // Create HTML content for the invoice
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice #${orderData.invoice_no}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background: #f5f5f5;
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .invoice-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 16px;
          }
          .header-content {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          .header-left {
            display: flex;
            align-items: center;
            gap: 16px;
          }
          .header-icon {
            width: 64px;
            height: 64px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .header-icon svg {
            width: 32px;
            height: 32px;
            fill: currentColor;
          }
          .header-title h1 {
            font-size: 32px;
            font-weight: bold;
            margin: 0;
          }
          .header-title p {
            color: #e9d5ff;
            margin: 4px 0 0 0;
          }
          .header-right {
            text-align: right;
          }
          .company-name {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 8px;
          }
          .company-details {
            color: #e9d5ff;
            font-size: 14px;
            line-height: 1.4;
          }
          .invoice-body {
            padding: 32px;
          }
          .invoice-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 32px;
            margin-bottom: 16px;
          }
          .bill-to h3, .invoice-info h3 {
            font-size: 18px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 8px;
          }
          .bill-to .customer-name {
            font-weight: 500;
            color: #1f2937;
            margin-bottom: 4px;
          }
          .bill-to .customer-details {
            color: #6b7280;
            line-height: 1.4;
          }
          .invoice-info {
            text-align: right;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            gap: 8px;
            margin-bottom: 8px;
          }
          .info-label {
            font-weight: 600;
            color: #1f2937;
          }
          .info-value {
            color: #6b7280;
            white-space: nowrap;
          }
          .status-badge {
            padding: 4px 12px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 500;
            white-space: nowrap;
          }
          .status-pending {
            background: #dbeafe;
            color: #1e40af;
          }
          .status-processing {
            background: #fef3c7;
            color: #d97706;
          }
          .status-completed {
            background: #d1fae5;
            color: #065f46;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 16px 0;
          }
          .items-table th {
            text-align: left;
            padding: 16px 8px;
            font-weight: 600;
            color: #1f2937;
            border-bottom: 2px solid #e5e7eb;
          }
          .items-table th:nth-child(3) {
            text-align: center;
          }
          .items-table th:nth-child(4),
          .items-table th:nth-child(5) {
            text-align: right;
          }
          .items-table td {
            padding: 16px 8px;
            border-bottom: 1px solid #f3f4f6;
            color: #6b7280;
          }
          .items-table td:nth-child(3) {
            text-align: center;
          }
          .items-table td:nth-child(4),
          .items-table td:nth-child(5) {
            text-align: right;
          }
          .item-name {
            color: #1f2937;
          }
          .item-details {
            font-size: 14px;
            margin-top: 4px;
          }
          .item-flavor {
            color: #6b7280;
          }
          .item-offer {
            color: #059669;
          }
          .item-color {
            color: #2563eb;
          }
          .item-nicotine {
            color: #dc2626;
          }
          .item-amount {
            color: #1f2937;
            font-weight: 500;
          }
          .order-notes {
            margin: 32px 0;
          }
          .order-notes h4 {
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 8px;
          }
          .order-notes p {
            color: #6b7280;
            font-size: 14px;
            line-height: 1.6;
          }
          .total-section {
            display: flex;
            justify-content: flex-end;
          }
          .total-container {
            width: 100%;
            max-width: 384px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            color: #6b7280;
            margin-bottom: 8px;
          }
          .total-amount {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 8px;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .total-label {
            font-size: 18px;
            font-weight: 600;
          }
          .total-value {
            font-size: 24px;
            font-weight: bold;
          }
          .delivery-info {
            margin-top: 32px;
            padding: 16px;
            background: #eff6ff;
            border-radius: 8px;
          }
          .delivery-info h4 {
            font-weight: 600;
            color: #1e3a8a;
            margin-bottom: 8px;
          }
          .delivery-info p {
            color: #1e40af;
            font-size: 14px;
          }
          .invoice-footer {
            background: #f9fafb;
            padding: 24px 32px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
          }
          .footer-text {
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 8px;
          }
          .footer-note {
            color: #9ca3af;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="invoice-header">
            <div class="header-content">
              <div class="header-left">
                <div class="header-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                  </svg>
                </div>
                <div class="header-title">
                  <h1>Invoice</h1>
                  <p>Vape Marina</p>
                </div>
              </div>
              <div class="header-right">
                <div class="company-name">Vape Marina UAE</div>
                <div class="company-details">
                  <div>Dubai, UAE</div>
                  <div>United Arab Emirates</div>
                  <div>+971567404217</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="invoice-body">
            <div class="invoice-details">
              <div class="bill-to">
                <h3>BILL TO:</h3>
                <div class="customer-name">${orderData.first_name} ${orderData.last_name}</div>
                <div class="customer-details">
                  <div>${orderData.street_address || 'N/A'}</div>
                  <div>${orderData.city || 'N/A'}, ${orderData.state || 'N/A'}</div>
                  <div>${orderData.phone || 'N/A'}</div>
                  <div>${orderData.email || 'N/A'}</div>
                </div>
              </div>
              
              <div class="invoice-info">
                <div class="info-row">
                  <span class="info-label">INVOICE #</span>
                  <span class="info-value">${orderData.invoice_no}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">DATE</span>
                  <span class="info-value">${orderData.order_date ? new Date(orderData.order_date).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
        : orderData.order_date?.split('T').join(' ') || '-'
      }</span>
                </div>
                <div class="info-row">
                  <span class="info-label">STATUS</span>
                  <span class="status-badge ${orderData.status + 1 === 2 ? 'status-completed' : orderData.status + 1 === 1 ? 'status-processing' : 'status-pending'}">
                    ${orderData.status + 1 === 2 ? 'Delivered' : orderData.status + 1 === 1 ? 'Accepted' : 'Pending'}
                  </span>
                </div>
                <div class="info-row">
                  <span class="info-label">PAYMENT</span>
                  <span class="info-value">${orderData.method || 'COD'}</span>
                </div>
              </div>
            </div>
            
            <table class="items-table">
              <thead>
                <tr>
                  <th>ITEMS</th>
                  <th>DESCRIPTION</th>
                  <th>QUANTITY</th>
                  <th>PRICE</th>
                  <th>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                ${orderData.order_items ? orderData.order_items.map((item, index) => `
                  <tr>
                    <td class="item-name">${index + 1}</td>
                    <td>
                      <div class="item-name">${item.product_name || 'Product'}</div>
                      <div class="item-details">
                        ${item.flavor ? `<div class="item-flavor">Flavor: ${item.flavor}</div>` : ''}
                        ${item.offer ? `<div class="item-offer">Offer: ${item.offer}</div>` : ''}
                        ${item.color ? `<div class="item-color">Color: ${item.color}</div>` : ''}
                        ${item.nicotine ? `<div class="item-nicotine">Nicotine: ${item.nicotine}</div>` : ''}
                      </div>
                    </td>
                    <td>${item.quantity}</td>
                    <td>AED ${parseFloat(item.price).toFixed(2)}</td>
                    <td class="item-amount">AED ${(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                `).join('') : '<tr><td colspan="5" style="text-align: center; padding: 30px; color: #666;">No items available</td></tr>'}
              </tbody>
            </table>
            
            ${orderData.order_notes ? `
              <div class="order-notes">
                <h4>NOTES:</h4>
                <p>${orderData.order_notes}</p>
              </div>
            ` : ''}
            
            <div class="total-section">
              <div class="total-container">
                <div class="total-row">
                  <span>Subtotal:</span>
                  <span>AED ${(orderData.total_amount - (orderData.delivery_charge || 0) - (orderData.tax_amount || 0)).toFixed(2)}</span>
                </div>
                <div class="total-row">
                  <span>Delivery Charge:</span>
                  <span>AED ${(orderData.delivery_charge || 0).toFixed(2)}</span>
                </div>
                ${(orderData.tax_amount || 0) > 0 ? `
                  <div class="total-row">
                    <span>Tax:</span>
                    <span>AED ${(orderData.tax_amount || 0).toFixed(2)}</span>
                  </div>
                ` : ''}
                <div class="total-amount">
                  <span class="total-label">TOTAL</span>
                  <span class="total-value">AED ${orderData.total_amount}</span>
                </div>
              </div>
            </div>
            
            ${orderData.live_location ? `
              <div class="delivery-info">
                <h4>Delivery Information:</h4>
                <p>Live Location: ${orderData.live_location}</p>
              </div>
            ` : ''}
          </div>
          
          <div class="invoice-footer">
            <p class="footer-text">Thank you for your business with Vape Marina!</p>
            <p class="footer-note">This invoice was generated electronically and is valid without signature.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await page.setContent(htmlContent);

    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    return pdf;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }
  }
} 