"use client"
import React, { useEffect, useState } from "react";
import { getSession, signOut } from "next-auth/react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
const UserDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedOrderProducts, setSelectedOrderProducts] = useState([]);
    const [modalLoading, setModalLoading] = useState(false);
    const [modalOrderId, setModalOrderId] = useState(null);
    useEffect(() => {

        const fetchOrders = async () => {
            const session = await getSession();
            //console.log(session);
            if (!session?.user?.id) {
                setOrders([]);
                setLoading(false);
                return;
            }
            const res = await fetch(`/api/orders/user-orders?users_id=${session.user.id}`);
            const data = await res.json();
            //console.log("UserDashboard", data);
            setOrders(data);
            setLoading(false);
        };
        fetchOrders();
    }, []);
    const handleLogout = () => {
        signOut({ callbackUrl: "/" });
    };
    // Handle view order products
    const handleViewOrder = async (orderId) => {
        setShowModal(true);
        setModalLoading(true);
        setModalOrderId(orderId);
        try {
            const res = await fetch(`/api/orders/user-orders/${orderId}`);
            // console.log("res", res);
            const data = await res.json();
            // console.log(data);
            setSelectedOrderProducts(data.items);
        } catch (err) {
            setSelectedOrderProducts([]);
        }
        setModalLoading(false);
    };
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrderProducts([]);
        setModalOrderId(null);
    };
    return (
        <ProtectedRoute allowedRoles={[3]}>
            <div className="min-h-screen flex flex-col items-center justify-start mt-5 bg-gray-50 dark:bg-gray-900">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-7xl">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Welcome to Your Dashboard</h1>
                        <button
                            aria-label="Logout"
                            onClick={handleLogout}
                            className="ml-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                        >
                            Logout
                        </button>
                    </div>
                    <p className="mb-6 text-gray-600 dark:text-gray-300">Here you can view your order information and manage your account.</p>
                    <div className="border-t pt-4 mt-4 w-full">
                        {loading ? (
                            <p className="text-gray-500 dark:text-gray-400">Loading orders...</p>
                        ) : orders.length === 0 ? (
                            <p className="text-gray-500 dark:text-gray-400">No orders found.</p>
                        ) : (
                            <div className="w-full overflow-x-auto">
                                <table className="min-w-[600px] min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {orders?.map(order => (
                                            <tr key={order.id}>
                                                <td className="px-4 py-2">{order.invoice_no}</td>
                                                <td className="px-4 py-2">
                                                    {order.order_date ? new Date(order.order_date).toLocaleString('en-GB', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: true
                                                    }) : order.order_date?.replace('T', ' ').slice(0, 19) || '-'}
                                                </td>
                                                <td className="px-4 py-2">{order.status === 0 ? 'Pending' : order.status === 1 ? 'Accepted' : order.status === 2 ? 'Delivered' : order.status === 3 ? 'Cancelled' : 'Unknown'}</td>
                                                <td className="px-4 py-2">${order.total_amount}</td>
                                                <td className="px-4 py-2">
                                                    <button
                                                        aria-label="View Order"
                                                        onClick={() => handleViewOrder(order.id)}
                                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
                {/* Modal for order products */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-xs sm:max-w-md md:max-w-3xl mx-2 sm:mx-4 p-2 sm:p-4 md:p-6 relative overflow-y-auto max-h-[90vh]">
                            <button
                                onClick={handleCloseModal}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                                aria-label="Close"
                            >
                                &times;
                            </button>
                            <h2 className="text-xl font-bold mb-4">Order Products</h2>
                            {modalLoading ? (
                                <p>Loading...</p>
                            ) : selectedOrderProducts.length === 0 ? (
                                <p>No products found for this order.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                                        <thead>
                                            <tr>
                                                <th className="px-4 py-2 text-left">Product</th>
                                                <th className="px-4 py-2 text-left">Quantity</th>
                                                <th className="px-4 py-2 text-left">Price</th>
                                                <th className="px-4 py-2 text-left">Color</th>
                                                <th className="px-4 py-2 text-left">Flavor</th>
                                                <th className="px-4 py-2 text-left">Offer</th>
                                                <th className="px-4 py-2 text-left">Nicotine</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedOrderProducts.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="px-4 py-2">{item.product_name}</td>
                                                    <td className="px-4 py-2">{item.quantity}</td>
                                                    <td className="px-4 py-2">${item.price}</td>
                                                    <td className="px-4 py-2">{item.color ? item.color : '-'}</td>
                                                    <td className="px-4 py-2">{item.flavor ? item.flavor : '-'}</td>
                                                    <td className="px-4 py-2">{item.offer ? item.offer : '-'}</td>
                                                    <td className="px-4 py-2">{item.nicotine ? item.nicotine : '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
};
export default UserDashboard;