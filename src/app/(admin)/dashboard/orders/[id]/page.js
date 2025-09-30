'use client'
import { notFound, useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';



export default function InvoicePage() {
    const { id } = useParams();
    // console.log("invoiceNo", id);


    const [orderData, setorderData] = useState({});
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const fetchSingleProduct = async () => {
            const res = await fetch(`/api/orders/${parseInt(id)}`);
            const data = await res.json();
            // console.log("data", data);
            setorderData(data);
        };
        fetchSingleProduct();
    }, [id]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!orderData) {
        notFound();
    }
    // console.log("orderData", orderData);
    const { order, items } = orderData;

    // Calculate totals
    const subtotal = items?.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryCharge = order?.delivery_charge;
    const totalAmount = order?.total_amount;
    const taxAmount = totalAmount - subtotal - deliveryCharge;

    // Format date
    const formatDate = (dateString) => {
        return isMounted
            ? new Date(dateString).toLocaleString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            })
            : dateString?.split('T').join(' ') || '-';
    };


    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `Invoice-${order?.invoice_no}`,
        pageStyle: `
      @page {
        size: A4;
        margin: 0;
      }
      @media print {
        body { 
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
          margin: 0;
          padding: 0;
        }
        .invoice-footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          width: 100%;
        }
        .invoice-content {
          padding-bottom: 80px; /* Add space to prevent content overlap */
        }
      }
    `
    });




    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div ref={componentRef} className="max-w-4xl mx-auto bg-white ">
                {/* Header */}
                <div className="bgColor from-purple-600 to-purple-800 text-white p-4">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold">Invoice</h1>
                                <p className="text-purple-100 mt-1">Vape Marina</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-semibold">Vape Marina UAE</div>
                            <div className="text-purple-100 text-sm mt-2">
                                <div>Dubai, UAE</div>
                                <div>United Arab Emirates</div>
                                <div>+971567404217</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Invoice Details */}
                <div className="p-8">
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-8 mb-1">
                        {/* Bill To */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">BILL TO:</h3>
                            <div className="text-gray-600 space-y-1">
                                <div className="font-medium text-gray-800">
                                    {order?.first_name} {order?.last_name}
                                </div>
                                <div>{order?.street_address}</div>
                                <div>{order?.city}, {order?.state}</div>
                                <div>{order?.phone}</div>
                                <div>{order?.email}</div>
                            </div>
                        </div>

                        {/* Invoice Info */}
                        <div className="text-right">
                            <div className="space-y-2">
                                <div className="flex justify-between gap-2">
                                    <span className="font-semibold text-gray-800">INVOICE #</span>
                                    <span className="text-gray-600 whitespace-nowrap">{order?.invoice_no}</span>
                                </div>
                                <div className="flex justify-between gap-2">
                                    <span className="font-semibold text-gray-800">DATE</span>
                                    <span className="text-gray-600 whitespace-nowrap">{formatDate(order?.order_date)}</span>
                                </div>
                                <div className="flex justify-between gap-2">
                                    <span className="font-semibold text-gray-800">STATUS</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${order?.status === 2 ? 'bg-green-100 text-green-800' :
                                        order?.status === 1 ? 'bg-yellow-100 text-yellow-800' :
                                            order?.status === 0 ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                        }`}>
                                        {order?.status === 2 ? 'Delivered' : order?.status === 0 ? 'Pending' : order?.status === 1 ? 'Accepted' : 'Cancelled'}
                                    </span>
                                </div>
                                <div className="flex justify-between gap-2">
                                    <span className="font-semibold text-gray-800">PAYMENT</span>
                                    <span className="text-gray-600 whitespace-nowrap">{order?.method || 'COD'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="overflow-x-auto mb-4">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-200">
                                    <th className="text-left py-4 px-2 font-semibold text-gray-800">ITEMS</th>
                                    <th className="text-left py-4 px-2 font-semibold text-gray-800">DESCRIPTION</th>
                                    <th className="text-center py-4 px-2 font-semibold text-gray-800">QUANTITY</th>
                                    <th className="text-right py-4 px-2 font-semibold text-gray-800">PRICE</th>
                                    <th className="text-right py-4 px-2 font-semibold text-gray-800">AMOUNT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items?.map((item, index) => (
                                    <tr key={item.id} className="border-b border-gray-100">
                                        <td className="py-4 px-2 text-gray-800">
                                            {index + 1}
                                        </td>
                                        <td className="py-4 px-2 text-gray-600">
                                            <div>{item.product_name}</div>
                                            {item.flavor && (
                                                <div className="text-sm text-gray-500">Flavor: {item.flavor}</div>
                                            )}
                                            {item.offer && (
                                                <div className="text-sm text-green-600">Offer: {item.offer}</div>
                                            )}
                                            {item.color && (
                                                <div className="text-sm text-blue-600">Color: {item.color}</div>
                                            )}
                                            {item.nicotine && (
                                                <div className="text-sm text-red-600">Nicotine: {item.nicotine}</div>
                                            )}
                                        </td>
                                        <td className="py-4 px-2 text-center text-gray-600">
                                            {item.quantity}
                                        </td>
                                        <td className="py-4 px-2 text-right text-gray-600">
                                            AED {parseFloat(item.price).toFixed(2)}
                                        </td>
                                        <td className="py-4 px-2 text-right text-gray-800 font-medium">
                                            AED {(item.price * item.quantity).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Order Notes */}
                    {order?.order_notes && (
                        <div className="mb-8">
                            <h4 className="font-semibold text-gray-800 mb-2">NOTES:</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {order?.order_notes}
                            </p>
                        </div>
                    )}

                    {/* Total Section */}
                    <div className="flex justify-end">
                        <div className="w-full max-w-sm">
                            <div className="space-y-2 mb-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal:</span>
                                    <span>AED {subtotal?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Charge:</span>
                                    <span>AED {deliveryCharge?.toFixed(2)}</span>
                                </div>
                                {taxAmount > 0 && (
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax:</span>
                                        <span>AED {taxAmount?.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="bgColor from-purple-600 to-purple-800 text-white p-2 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold">TOTAL</span>
                                    <span className="text-2xl font-bold">
                                        AED {totalAmount?.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Info */}
                    {order?.live_location && (
                        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-2">Delivery Information:</h4>
                            <p className="text-blue-800 text-sm">
                                Live Location: {order?.live_location}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="invoice-footer bg-gray-50 px-8 py-6 border-t">
                    <div className="text-center">
                        <p className="text-gray-600 text-sm mb-2">
                            Thank you for your business with Vape Marina!
                        </p>
                        <p className="text-gray-500 text-xs">
                            This invoice was generated electronically and is valid without signature.
                        </p>
                    </div>
                </div>
            </div>

            {/* Print Button */}
            <div className="max-w-4xl mx-auto mt-6 text-center">
                <button
                    aria-label="Print Invoice"  
                    onClick={handlePrint}
                    className="bgColor cursor-pointer  text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 print:hidden"
                >
                    Print Invoice
                </button>
            </div>

            {/* Print Styles */}

        </div>
    );
}