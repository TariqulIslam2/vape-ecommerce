"use client";
import React, { useEffect, useState } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";

import PageTitle from "@/components/admin/Typography/PageTitle";
import { FaToggleOff, FaToggleOn } from "react-icons/fa";
// import Image from "next/image";
import Link from "next/link";
import dynamic from 'next/dynamic';

const BlogDrawer = dynamic(() => import("@/components/admin/BlogDrawer"), {
    ssr: false,
    loading: () => <div>Loading...</div>
});
// import EditProductModal from '@/components/admin/EditProductModal';

export default function BlogPage() {
    // Sample product data - expanded to demonstrate pagination
    const [blogs, setBlogs] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [category, setCategory] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/category");

                const data = await res.json();
                const filteredData = data.filter(item => item.status === 1);
                setCategory(filteredData);

            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await fetch("/api/blogs");
                const data = await res.json();

                setBlogs(data);
                setRefresh(false)
            } catch (err) {
                console.error("Failed to fetch blogs:", err);
            }
        };

        fetchBlogs();
    }, [refresh]);
    const [showDrawer, setShowDrawer] = useState(false);
    // console.log(blogs)

    const openDrawer = () => {
        setShowDrawer(true);
    };
    // Pagination setup
    const [currentPage, setCurrentPage] = useState(1);
    const [searchCategory, setSearchCategory] = useState('');
    const [priceOrder, setPriceOrder] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 15;
    const totalItems = blogs.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const filteredBlogs = blogs?.filter((blog) => {
        const lowerSearch = searchTerm.toLowerCase();

        const matchesSearch =
            (blog.title?.toLowerCase() || '').includes(lowerSearch)


        const matchesCategory =
            searchCategory === '' || blog.category?.toString() === searchCategory;

        return matchesSearch && matchesCategory;
    })


    // Get current page blogs
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBlogs = filteredBlogs?.slice(indexOfFirstItem, indexOfLastItem);
    // console.log(currentBlogs);
    // State for selected rows
    const [selectedItems, setSelectedItems] = useState([]);

    const toggleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedItems(blogs?.map((blog) => blog.id));
        } else {
            setSelectedItems([]);
        }
    };

    const toggleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter((item) => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const handlePublishToggle = async (id, published) => {
        const numericStatus = published ? 1 : 0;
        // console.log(id, published)
        try {
            const res = await fetch("/api/blogs", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, published: numericStatus, status: numericStatus }),
            });

            const data = await res.json();
            // console.log("Update response:", data);

            if (res.ok) {
                setBlogs((prev) =>
                    prev.map((blog) =>
                        blog.id === id
                            ? { ...blog, published: numericStatus, status: numericStatus }
                            : blog
                    )
                );
            } else {
                alert("Failed to update status: " + data.message);
            }
        } catch (error) {
            console.error("Status update error:", error);
            alert("Something went wrong.");
        }
    };

    const handleTopToggle = async (id, top) => {
        const numericTop = top ? 1 : 0;
        // console.log(id, top)
        try {
            const res = await fetch("/api/blogs", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, top: numericTop }),
            });

            const data = await res.json();
            // console.log("Update response:", data);

            if (res.ok) {
                setBlogs((prev) =>
                    prev.map((blog) =>
                        blog.id === id
                            ? { ...blog, top: numericTop }
                            : blog
                    )
                );
            } else {
                alert("Failed to update top: " + data.message);
            }
        } catch (error) {
            console.error("Top update error:", error);
            alert("Something went wrong.");
        }

    }

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this blog?")) return;

        try {
            const res = await fetch(`/api/blogs?id=${id}`, {
                method: "DELETE",
            });

            const data = await res.json();
            if (res.ok) {
                alert("Deleted successfully!");
                setRefresh(true)
                // optionally refresh or re-fetch categories
            } else {
                alert("Delete failed: " + data.message);
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("An error occurred.");
        }
    };

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    // console.log(selectedProduct);
    return (
        <div className="bg-gray-50 dark:bg-gray-900 p-4 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <PageTitle>Blogs</PageTitle>

                <div className="mb-4 flex justify-end">
                    <Link href="/dashboard/blog/add">
                        <button className="btn btn-success text-white" aria-label="Add Blog">Add Blog</button>
                    </Link>
                </div>

                <div className="flex justify-between mb-6">
                    <div className="flex space-x-2">
                        <button className="btn btn-outline border border-gray-300 dark:border-gray-700 flex items-center space-x-2 px-4 py-2 rounded bg-white dark:bg-gray-800 dark:text-gray-200" aria-label="Export">
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
                                    className="dark:stroke-gray-200"
                                />
                            </svg>
                            <span>Export</span>
                        </button>
                    </div>

                    <div className="flex space-x-2">
                        {/* <button className="btn btn-outline border border-gray-300 flex items-center space-x-2 px-4 py-2 rounded bg-gray-100">
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
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              <span>Bulk Action</span>
            </button> */}

                        {/* <button className="btn bg-red-500 hover:bg-red-600 text-white flex items-center space-x-2 px-6 py-2 rounded">
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v10M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
                />
              </svg>
              <span>Delete</span>
            </button> */}

                        {/* <button
                            onClick={() => openDrawer()}
                            className="btn bg-green-500 hover:bg-green-600 text-white flex items-center space-x-2 px-6 py-2 rounded dark:bg-green-600 dark:hover:bg-green-700"
                        >
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
                                    d="M12 4v16m8-8H4"
                                    className="dark:stroke-gray-200"
                                />
                            </svg>
                            <span>Add Blog</span>
                        </button> */}
                    </div>
                </div>

                <div className="flex items-center space-x-2 mb-6">
                    <input
                        type="text"
                        placeholder="Search Blog"
                        className="p-2 border border-gray-300 dark:border-gray-700 rounded flex-1 max-w-xs bg-white dark:bg-gray-800 dark:text-gray-200"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <select className="p-2 border border-gray-300 dark:border-gray-700 rounded flex-1 max-w-xs bg-white dark:bg-gray-800 dark:text-gray-200" onChange={(e) => setSearchCategory(e.target.value)}>
                        <option key={0} value="">Category</option>
                        {
                            category.map((item, index) => <option key={index} value={item.name}>{item.name}</option>)
                        }
                    </select>



                    <button onClick={() => {
                        setSearchTerm("")
                        setPriceOrder("")
                        setSearchCategory("")
                    }} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-2 rounded dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200">
                        Reset
                    </button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-md shadow overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-white dark:bg-gray-800">
                            <tr>

                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Slug
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    View
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Published
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {currentBlogs?.map((blog) => (
                                <tr key={blog.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">

                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                        <div className="flex items-start space-x-2 max-w-[300px]">
                                            {blog?.image && (
                                                <img
                                                    src={blog?.image}
                                                    alt={blog.title}
                                                    width={50}
                                                    height={50}
                                                    loading="eager"
                                                    fetchpriority="high"
                                                    decoding="async"
                                                    className="flex-shrink-0"
                                                />
                                            )}
                                            <span className="break-words">{blog.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                        {blog.category_name}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                        {blog.slug}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                        {new Date(blog.published_date)
                                            .toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric'
                                            })}
                                    </td>



                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <button className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100" aria-label="View Blog">
                                            <Link href={`/dashboard/blogs/${blog.id}`}>
                                                <Eye size={18} />
                                            </Link>
                                        </button>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="relative inline-flex items-center cursor-pointer">
                                            <button
                                                onClick={() => handlePublishToggle(blog?.id, blog.published === 0)}
                                                className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${blog.published === 1
                                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                                    }`}
                                            >
                                                {blog.published === 1 ? (
                                                    <FaToggleOn className="mr-1 h-4 w-4 text-green-600 dark:text-green-400" />
                                                ) : (
                                                    <FaToggleOff className="mr-1 h-4 w-4 text-gray-500 dark:text-gray-400" />
                                                )}
                                                {blog.published === 1 ? "Published" : "Draft"}
                                            </button>
                                        </div>
                                    </td>

                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        <div className="flex space-x-2">
                                            <Link href={`/dashboard/blogs/${blog.id}/edit`}>
                                                <button
                                                    className="text-blue-600 hover:text-blue-900" aria-label="Edit Blog"
                                                >
                                                    <Edit size={18} />
                                                </button>

                                            </Link>

                                            <button onClick={() => handleDelete(blog?.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200" aria-label="Delete Blog" >
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
                                        aria-label="Previous Page"
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
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
                                                className="dark:fill-gray-200"
                                            />
                                        </svg>
                                    </button>

                                    {/* Generate page numbers dynamically */}
                                    {[...Array(Math.min(totalPages, 5))].map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentPage(index + 1)}
                                            className={`${currentPage === index + 1
                                                ? "bg-green-500 text-white dark:bg-green-600"
                                                : "bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
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
                                                    ? "bg-green-500 text-white dark:bg-green-600"
                                                    : "bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
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
                                                className="dark:fill-gray-200"
                                            />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <BlogDrawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} onSuccess={() => setRefresh(true)} />

        </div>
    );
}
