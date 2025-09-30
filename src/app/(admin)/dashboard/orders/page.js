"use client";
import React, { useEffect, useState } from "react";
import { View } from "lucide-react";

import PageTitle from "@/components/admin/Typography/PageTitle";
import { FiDownload, FiCalendar } from "react-icons/fi";
import Link from "next/link";

const Orderspage = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('');
  const [method, setMethod] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [refresh, setRefresh] = useState(false); // Add refresh state
  const [isMounted, setIsMounted] = useState(false);
  // console.log("orders", orders);
  useEffect(() => {
    fetchOrders();
    setIsMounted(true);
  }, [refresh]);

  const fetchOrders = async () => {
    const query = {
      search: searchTerm,
      status,
      method,
      startDate,
      endDate,
    };

    const params = new URLSearchParams(query);
    const res = await fetch(`/api/orders?${params.toString()}`);
    const data = await res.json();
    // console.log(data);
    setOrders(data);
  };
  // console.log(orders);
  const handleFilter = () => {
    fetchOrders();
  };

  const handleReset = () => {
    setSearchTerm('');
    setStatus('');

    setMethod('');
    setStartDate('');
    setEndDate('');
    fetchOrders();
  };

  const handleDownload = () => {
    const headers = ['ID', 'Customer', 'Status', 'Method', 'Date', 'Amount'];
    const rows = orders.map(order => [
      order.invoice_no,
      order.first_name + " " + order.last_name,
      order.status,
      order.method,
      isMounted ? new Date(order.order_date).toLocaleDateString('en-GB') : order.order_date?.split('T')[0] || '-',
      order.total_amount,
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'orders.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  const handleStatusChange = (orderId, newStatus) => {
    fetch('/api/orders', {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: orderId, status: newStatus }),
    })
      .then((res) => res.json())
      .then((data) => {
        // Optionally update local state if needed
        // console.log("Status updated:", data);
        setRefresh(!refresh);
        window.dispatchEvent(new Event("updateNotification"));
      })
      .catch((error) => {
        console.error("Failed to update status:", error);
      });
  };
  const [showDrawer, setShowDrawer] = useState(false);

  const openDrawer = () => {
    setShowDrawer(true);
  };
  // Pagination setup
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const totalItems = orders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get current page orders
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders?.slice(indexOfFirstItem, indexOfLastItem);

  // State for selected rows

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <PageTitle>Orders</PageTitle>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by Customer Name"
            className="input input-bordered w-full bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="select select-bordered w-full bg-white dark:bg-gray-800 text-black dark:text-gray-100"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Status</option>
            <option value="0">Pending</option>
            <option value="1">Accepted</option>
            <option value="2">Delivered</option>
            <option value="3">Cancelled</option>
          </select>


          <select
            className="select select-bordered w-full bg-white dark:bg-gray-800 text-black dark:text-gray-100"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option value="">Method</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="COD">Cash on Delivery</option>
          </select>

          <button
            className="btn btn-success w-full text-white flex items-center justify-center gap-2 dark:bg-green-700 dark:hover:bg-green-800"
            onClick={handleDownload}
            aria-label="Download All Orders"
          >
            <FiDownload className="h-5 w-5" />
            <span>Download All Orders</span>
          </button>
        </div>

        {/* Date Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 mb-4">
          <div>
            <label className="text-sm font-medium mb-1 block dark:text-gray-200">Start Date</label>
            <input
              type="date"
              className="input input-bordered w-full bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-200"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block dark:text-gray-200">End Date</label>
            <input
              type="date"
              className="input input-bordered w-full bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-200"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block opacity-0">Action</label>
            <button
              className="btn bg-green-700 w-full text-white dark:bg-green-800 dark:hover:bg-green-900"
              onClick={handleFilter}
              aria-label="Filter"
            >
              Filter
            </button>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block opacity-0">Action</label>
            <button
              className="btn btn-outline w-full text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
              onClick={handleReset}
              aria-label="Reset"
            >
              Reset
            </button>
          </div>
        </div>



        {/* Date Filters */}

        <div className="bg-white dark:bg-gray-800 rounded-md shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-white dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  INVOICE NO
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ORDER TIME
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  METHOD
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  AMOUNT
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  STATUS
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {currentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {order.invoice_no}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {isMounted
                      ? new Date(order.order_date).toLocaleString('en-GB', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })
                      : order.order_date?.replace('T', ' ').slice(0, 19) || '-'}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {order.first_name} {order.last_name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {order.method}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {order.total_amount}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 2
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : order.status === 1
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : order.status === 3
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        }`}
                    >
                      {order.status === 0 ? "Pending" : order.status === 1 ? "Accepted" : order.status === 2 ? "Delivered" : "Cancelled"}
                    </span>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <select
                      className="select select-bordered w-full bg-white dark:bg-gray-800 focus:outline-none text-black dark:text-gray-100"
                      value={order.status} // controlled component
                      onChange={(e) => handleStatusChange(order.id, Number(e.target.value))}
                    >
                      <option key={0} value={0}>Pending</option>
                      <option key={1} value={1}>Accepted</option>
                      <option key={2} value={2}>Delivered</option>
                      <option key={3} value={3}>Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <div className="flex justify-center">
                      {order?.invoice_no && (
                        <Link href={`/dashboard/orders/${order.id}`} aria-label="View Order">
                          <button className="text-gray-500 hover:text-blue-900 dark:text-gray-300 dark:hover:text-blue-400" aria-label="View Order">
                            <View size={25} />
                          </button>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                aria-label="Previous Page"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                aria-label="Next Page"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  Showing{" "}
                  <span className="font-medium">
                    {indexOfFirstItem + 1}-
                    {Math.min(indexOfLastItem, totalItems)}
                  </span>{" "}
                  of <span className="font-medium">{totalItems}</span>
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    aria-label="Previous Page"
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Generate page numbers dynamically */}
                  {[...Array(Math.min(totalPages, 5))].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`${currentPage === index + 1
                        ? "bg-green-500 text-white dark:bg-green-700 dark:text-white"
                        : "bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        } relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium`}
                        aria-label="Page Number"
                    >
                      {index + 1}
                    </button>
                  ))}

                  {/* Show the last page if there are more than 5 pages */}
                  {totalPages > 5 && (
                    <>
                      {totalPages > 6 && (
                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                          ...
                        </span>
                      )}
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className={`${currentPage === totalPages
                          ? "bg-green-500 text-white dark:bg-green-700 dark:text-white"
                          : "bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                          } relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm font-medium`}
                          aria-label="Last Page"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    aria-label="Next Page"
                    >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orderspage;
