"use client";
import React, { useEffect, useState } from "react";
import { ArrowLeft, Calendar, User, Tag, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import PageTitle from "@/components/admin/Typography/PageTitle";

export default function BlogViewPage() {
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const params = useParams();
    const router = useRouter();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/blogs/${params.id}`);

                if (!response.ok) {
                    throw new Error('Blog not found');
                }

                const data = await response.json();
                setBlog(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchBlog();
        }
    }, [params.id]);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this blog?")) return;

        try {
            const res = await fetch(`/api/blogs?id=${params.id}`, {
                method: "DELETE",
            });

            const data = await res.json();
            if (res.ok) {
                alert("Blog deleted successfully!");
                router.push("/dashboard/blog");
            } else {
                alert("Delete failed: " + data.message);
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("An error occurred.");
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-50 dark:bg-gray-900 p-4 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-50 dark:bg-gray-900 p-4 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Blog Not Found</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                        <Link href="/dashboard/blog">
                            <button className="btn btn-primary" aria-label="Back to Blogs">Back to Blogs</button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!blog) {
        return null;
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 p-4 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <Link href="/dashboard/blog">
                            <button className="btn btn-ghost btn-circle" aria-label="Back to Blogs">
                                <ArrowLeft size={20} />
                            </button>
                        </Link>
                        <PageTitle>Blog Details</PageTitle>
                    </div>

                    <div className="flex space-x-2">
                        <Link href={`/dashboard/blogs/${blog.id}/edit`}>
                            <button className="btn btn-primary flex items-center space-x-2" aria-label="Edit Blog">
                                <Edit size={16} />
                                <span>Edit Blog</span>
                            </button>
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="btn btn-error flex items-center space-x-2" aria-label="Delete Blog"
                        >
                            <Trash2 size={16} />
                            <span>Delete</span>
                        </button>
                    </div>
                </div>

                {/* Blog Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                            {/* Blog Image */}
                            {blog.image && (
                                <div className="relative h-64 md:h-80">
                                    <img
                                        src={blog.image}
                                        alt={blog.title}
                                        loading="eager"
                                        fetchpriority="high"
                                        decoding="async"
                                        className="w-full h-full object-cover"
                                        aria-label="Blog Image"
                                    />
                                </div>
                            )}

                            {/* Blog Content */}
                            <div className="p-6">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                    {blog.title}
                                </h1>

                                {/* Meta Information */}
                                <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center space-x-2">
                                        <Calendar size={16} />
                                        <span>
                                            {new Date(blog.published_date || blog.created_at).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <User size={16} />
                                        <span>{blog.author || 'Admin'}</span>
                                    </div>

                                    {blog.category_name && (
                                        <div className="flex items-center space-x-2">
                                            <Tag size={16} />
                                            <span>{blog.category_name}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center space-x-2">
                                        <Eye size={16} />
                                        <span>{blog.views || 0} views</span>
                                    </div>
                                </div>

                                {/* Excerpt */}
                                {blog.excerpt && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                            Short Info
                                        </h3>
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {blog.excerpt}
                                        </p>
                                    </div>
                                )}

                                {/* Content */}
                                {blog.content && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                            Content
                                        </h3>
                                        <div
                                            className="text-gray-700 dark:text-gray-300 leading-relaxed prose prose-lg max-w-none"
                                            dangerouslySetInnerHTML={{ __html: blog.content }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Blog Status */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Blog Status
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${blog.published === 1
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                        }`}>
                                        {blog.published === 1 ? 'Published' : 'Draft'}
                                    </span>
                                </div>

                                {/* <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Top Blog:</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${blog.top === 1
                                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                        }`}>
                                        {blog.top === 1 ? 'Yes' : 'No'}
                                    </span>
                                </div> */}

                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 dark:text-gray-400">Slug:</span>
                                    <span className="text-sm text-gray-900 dark:text-white font-mono">
                                        {blog.slug}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Blog Information */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Blog Information
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">ID:</span>
                                    <p className="text-gray-900 dark:text-white">{blog.id}</p>
                                </div>

                                <div>
                                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Created:</span>
                                    <p className="text-gray-900 dark:text-white">
                                        {new Date(blog.published_date).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>

                                {/* {blog.updated_at && (
                                    <div>
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Updated:</span>
                                        <p className="text-gray-900 dark:text-white">
                                            {new Date(blog.updated_at).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                )} */}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Quick Actions
                            </h3>
                            <div className="space-y-2">
                                <Link href={`/dashboard/blogs/${blog.id}/edit`}>
                                    <button className="w-full btn btn-outline btn-primary mb-3" aria-label="Edit Blog">
                                        <Edit size={16} className="mr-2" />
                                        Edit Blog
                                    </button>
                                </Link>

                                <Link href="/dashboard/blog">
                                    <button className="w-full btn btn-outline" aria-label="Back to Blogs">
                                        <ArrowLeft size={16} className="mr-2" />
                                        Back to Blogs
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 