"use client";

import { useState, useEffect, useRef } from "react";
import {
  FaBars,
  FaHome,
  FaBell,
  FaSignOutAlt,
  FaUserCog,
  FaBoxOpen,
  FaListAlt,
  FaShoppingCart,
  FaUsers,
  FaUserTie,
  FaStore,
  FaEnvelope,
  FaEye,
  FaBlog,
} from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SessionProvider, signOut } from "next-auth/react";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState({
    pendingOrders: 0,
    unreadMessages: 0,
    pendingOrdersList: [],
    unreadMessagesList: []
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [avatarError, setAvatarError] = useState(false);
  const dropdownRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <FaHome />, link: "/dashboard" },
    { name: "Products", icon: <FaBoxOpen />, link: "/dashboard/products" },
    { name: "Categories", icon: <FaListAlt />, link: "/dashboard/categories" },
    { name: "Orders", icon: <FaShoppingCart />, link: "/dashboard/orders" },
    { name: "Customers", icon: <FaUsers />, link: "/dashboard/customers" },
    { name: "Our Staff", icon: <FaUserTie />, link: "/dashboard/ourStaff" },
    { name: "Blog", icon: <FaBlog />, link: "/dashboard/blog" },
    { name: "Contact Massage", icon: <FaEnvelope />, link: "/dashboard/contact-massage" },
    { name: "Online Store", icon: <FaStore />, link: "/" },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch notifications data

  useEffect(() => {
    fetchNotifications();
    window.addEventListener("updateNotification", fetchNotifications);
    // Set up polling to refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      // Fetch pending orders
      const ordersResponse = await fetch("/api/orders");
      const ordersData = await ordersResponse.json();
      // console.log(ordersData);
      const pendingOrders = ordersData.filter(order =>
        order.status === 'pending' || order.status === 0
      );

      // Fetch unread contact messages
      const messagesResponse = await fetch("/api/contactmessage");
      const messagesData = await messagesResponse.json();
      const unreadMessages = messagesData.filter(message =>
        message.status === 0
      );

      setNotifications({
        pendingOrders: pendingOrders.length,
        unreadMessages: unreadMessages.length,
        pendingOrdersList: pendingOrders.slice(0, 5), // Show latest 5
        unreadMessagesList: unreadMessages.slice(0, 5) // Show latest 5
      });

    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total notifications
  const totalNotifications = notifications.pendingOrders + notifications.unreadMessages;

  // Handle navigation
  const handleOrderClick = (orderId) => {
    router.push(`/dashboard/orders`);
    setIsNotificationOpen(false);
  };

  const handleMessageClick = (messageId) => {
    router.push(`/dashboard/contact-massage`);
    setIsNotificationOpen(false);
  };

  const handleViewAllOrders = () => {
    router.push("/dashboard/orders");
    setIsNotificationOpen(false);
  };

  const handleViewAllMessages = () => {
    router.push("/dashboard/contact-massage");
    setIsNotificationOpen(false);
  };

  // Mark message as read


  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <SessionProvider>
      <ProtectedRoute allowedRoles={[1, 2]}>
        <div className="flex h-screen overflow-hidden bg-base-100 dark:bg-gray-900">
          {/* Sidebar */}
          <div
            className={`flex flex-col bg-base-200 dark:bg-gray-800 shadow-md transition-all duration-300 ease-in-out ${sidebarOpen ? "w-64" : "w-16"
              }`}
          >
            <div className="flex items-center justify-center h-16 border-b border-base-300 dark:border-gray-700">
              <h1
                className={`text-xl font-bold transition-all duration-300 text-gray-900 dark:text-white ${sidebarOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
              >
                Vape Marina
              </h1>
            </div>

            {/* Sidebar Content */}
            <div className="flex flex-col h-full justify-between">
              {/* Menu */}
              <ul className="menu p-4 space-y-1">
                {menuItems.map((item, idx) => (
                  <li key={idx}>
                    <Link
                      href={item.link}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-cyan-800 hover:text-primary-content dark:hover:bg-cyan-600 dark:hover:text-white text-gray-800 dark:text-gray-200"
                    >
                      <span className="text-lg">{item.icon}</span>
                      {sidebarOpen && (
                        <span className="text-sm font-medium">{item.name}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Logout Button */}
              <div className="p-4">
                <button
                  aria-label="Logout"
                  onClick={handleLogout}
                  className="flex items-center bgColor gap-3 cursor-pointer rounded-lg px-3 py-2 w-full transition hover:bg-error hover:text-error-content dark:hover:bg-red-700 dark:hover:text-white text-gray-800 dark:text-gray-200"
                >
                  <FaSignOutAlt className="text-lg" />
                  {sidebarOpen && (
                    <span className="text-sm font-medium">Log Out</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Navbar */}
            <div className="navbar bg-base-100 dark:bg-gray-900 px-4 shadow-md border-b border-base-300 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <button
                  aria-label="Toggle sidebar"
                  className="btn btn-ghost btn-circle"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <FaBars className="text-lg" />
                </button>
              </div>

              <div className="ml-auto flex items-center gap-4">
                {/* Notification Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    aria-label="Toggle notifications"
                    className="btn btn-ghost btn-circle relative"
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  >
                    <FaBell className="text-lg text-gray-700 dark:text-gray-200" />
                    {totalNotifications > 0 && (
                      <>
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                          {totalNotifications > 99 ? '99+' : totalNotifications}
                        </span>
                      </>
                    )}
                  </button>

                  {isNotificationOpen && (
                    <div className="absolute right-0 top-12 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-hidden">
                      {/* Header */}
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                          Notifications
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          You have {totalNotifications} unread notifications
                        </p>
                      </div>

                      {/* Content */}
                      <div className="max-h-80 overflow-y-auto">
                        {loading ? (
                          <div className="p-4 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
                          </div>
                        ) : (
                          <>
                            {/* Pending Orders Section */}
                            {notifications.pendingOrders > 0 && (
                              <div className="p-2">
                                <div className="flex items-center justify-between px-2 py-1">
                                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                                    <FaShoppingCart className="mr-2 text-orange-500" />
                                    Pending Orders ({notifications.pendingOrders})
                                  </h4>
                                  <button
                                    onClick={handleViewAllOrders}
                                    aria-label="View all pending orders"
                                    className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                  >
                                    View All
                                  </button>
                                </div>

                                {notifications.pendingOrdersList.map((order) => (
                                  <div
                                    key={order.id}
                                    className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer rounded-lg mx-2 my-1"
                                    onClick={() => handleOrderClick(order.id)}
                                  >
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                                          Order #{order.invoice_no}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                          {order.first_name} {order.last_name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                          ${parseFloat(order.total_amount || 0).toFixed(2)}
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full">
                                          Pending
                                        </span>
                                        <p className="text-xs text-gray-400 mt-1 dark:text-gray-500">
                                          {isMounted ? new Date(order.order_date).toLocaleDateString() : order.order_date?.split('T')[0] || '-'}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Unread Messages Section */}
                            {notifications.unreadMessages > 0 && (
                              <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex items-center justify-between px-2 py-1">
                                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center">
                                    <FaEnvelope className="mr-2 text-blue-500" />
                                    Unread Messages ({notifications.unreadMessages})
                                  </h4>
                                  <button
                                    aria-label="View all unread messages"
                                    onClick={handleViewAllMessages}
                                    className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                  >
                                    View All
                                  </button>
                                </div>

                                {notifications.unreadMessagesList.map((message) => (
                                  <div
                                    key={message.id}
                                    className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer rounded-lg mx-2 my-1"
                                    onClick={() => handleMessageClick(message.id)}
                                  >
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                                          {message.name || message.first_name || 'Anonymous'}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                          {message.email}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                                          {message.message || message.subject}
                                        </p>
                                      </div>
                                      <div className="text-right flex flex-col items-end">
                                        <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                                          New
                                        </span>
                                        <p className="text-xs text-gray-400 mt-1 dark:text-gray-500">
                                          {isMounted ? new Date(message.create_date).toLocaleDateString() : message.create_date?.split('T')[0] || '-'}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* No notifications */}
                            {totalNotifications === 0 && (
                              <div className="p-8 text-center">
                                <FaBell className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                                  No notifications
                                </h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                  You're all caught up!
                                </p>
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Footer */}
                      {totalNotifications > 0 && (
                        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                          <div className="flex justify-between">
                            <button
                              aria-label="View all orders"
                              onClick={handleViewAllOrders}
                              className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              All Orders
                            </button>
                            <button
                              aria-label="View all messages"
                              onClick={handleViewAllMessages}
                              className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              All Messages
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Profile dropdown */}
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar placeholder"
                  >
                    <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden bg-neutral text-neutral-content dark:bg-gray-700 dark:text-white">
                      {avatarError ? (
                        <span className="text-sm font-bold">A</span>
                      ) : (
                        <img
                          src="/profile1.avif"
                          alt="User Avatar"
                          loading="eager"
                          fetchpriority="high"
                          decoding="async"
                          onError={() => setAvatarError(true)}
                        />
                      )}
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-200 dark:bg-gray-800 rounded-box w-56"
                  >
                    <li>
                      <button
                        onClick={handleLogout}
                        aria-label="Logout"
                        className="flex items-center gap-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <FaSignOutAlt /> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Page Content */}
            <main className="flex-1 p-6 overflow-auto bg-base-100 dark:bg-gray-900">{children}

              <ToastContainer />
            </main>

          </div>
        </div>
      </ProtectedRoute>
    </SessionProvider >
  );
}