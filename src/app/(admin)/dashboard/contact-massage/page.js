"use client";
import React, { useEffect, useState } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import PageTitle from "@/components/admin/Typography/PageTitle";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";

const ContactMassage = () => {
    const [loading, setLoading] = useState(true);
    const [contactMassages, setContactMassages] = useState([]);
    const [error, setError] = useState(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const fetchContactMassages = async () => {
            try {
                const response = await fetch("/api/contactmessage");
                const data = await response.json();
                setContactMassages(data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };
        fetchContactMassages();
    }, []);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Pagination setup
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    const totalItems = contactMassages.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Get current page customers
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentContactMassage = contactMassages.slice(indexOfFirstItem, indexOfLastItem);


    const handlePublishToggle = async (id, currentStatus) => {
        try {
            const response = await fetch("/api/contactmessage", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id,
                    status: currentStatus ? 0 : 1,  // 0 for unread, 1 for read
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setContactMassages(prev =>
                    prev.map(contact => contact.id === id ? { ...contact, status: currentStatus ? 0 : 1 } : contact)
                );
                window.dispatchEvent(new Event("updateNotification"));
            } else {
                alert("Failed to update status: " + data.message);
            }
        } catch (error) {
            console.error("Status update error:", error);
            alert("Failed to update status: " + error.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/contactmessage?id=${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setContactMassages(prev => prev.filter(contact => contact.id !== id));
            } else {
                alert("Failed to delete contact: " + response.statusText);
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete contact: " + error.message);
        }
    };

    // State for selected rows
    return (
        <div className="bg-gray-50 dark:bg-gray-900 p-4 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <PageTitle>Contact Massage</PageTitle>

                <div className="flex justify-between mb-6">
                    <div className="flex space-x-2">
                        <button aria-label="Export" className="btn btn-outline border border-gray-300 dark:border-gray-700 flex items-center space-x-2 px-4 py-2 rounded bg-white dark:bg-gray-800 dark:text-gray-100">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                            </svg>
                            <span>Export</span>
                        </button>
                    </div>
                </div>

                {/* <div className="flex items-center space-x-2 mb-6">
                    <input
                        type="text"
                        placeholder="Search by Name/Email/Phone"
                        className="p-2 border border-gray-300  rounded flex-1 max-w-xs bg-white"
                    />

                    <button aria-label="Filter" className="bg-green-700 hover:bg-green-800 text-white px-8 py-2 rounded">
                        Filter
                    </button>

                    <button aria-label="Reset" className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-2 rounded">
                        Reset
                    </button>
                </div> */}

                <div className="bg-white dark:bg-gray-800 rounded-md shadow overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-white dark:bg-gray-800">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    id
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    name
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    email
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    phone
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Message
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Status
                                </th>

                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {currentContactMassage.map((contactMassage) => (
                                <tr key={contactMassage.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <span className="text-sm text-gray-900 dark:text-gray-100">
                                                {contactMassage.id}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {isMounted ? new Date(contactMassage.create_date).toLocaleDateString('en-GB') : contactMassage.create_date?.split('T')[0] || '-'}
                                    </td>

                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                        {contactMassage.name}
                                    </td>

                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                        {contactMassage.email}
                                    </td>

                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                        {contactMassage.phone}
                                    </td>
                                    <td className="px-4 py-3 max-w-[250px] break-words text-sm text-gray-900 dark:text-gray-100">
                                        {contactMassage.message}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                        <button
                                            aria-label="Toggle Status"      
                                            onClick={() => handlePublishToggle(contactMassage?.id, contactMassage.status)}
                                            className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${contactMassage.status
                                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                                }`}
                                        >
                                            {contactMassage.status ? (
                                                <FaToggleOn className="mr-1 h-4 w-4 text-green-600 dark:text-green-400" />
                                            ) : (
                                                <FaToggleOff className="mr-1 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                            )}
                                            {contactMassage.status ? "Read" : "Unread"}
                                        </button>{" "}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        <div className="flex space-x-2 justify-center">
                                            {/* <button className="text-gray-500 hover:text-blue-900 dark:hover:text-blue-400">
                                                <Edit size={18} />
                                            </button> */}
                                                <button aria-label="Delete Contact" className="text-gray-500 hover:text-red-900 dark:text-gray-300 dark:hover:text-red-400" onClick={() => handleDelete(contactMassage.id)}>
                                                <Trash2 size={18} />
                                            </button>
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

export default ContactMassage;