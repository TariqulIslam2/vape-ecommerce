"use client";
import { useState, useRef, useMemo, useEffect } from "react";
import JoditEditor from "jodit-react";
import { Upload, X, ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditBlogPage() {
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [category, setCategory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [blogData, setBlogData] = useState({
        name: "",
        description: "",
        category: "",
        short_info: "",
        slug: ""
    });
    const editorRef = useRef(null);
    const router = useRouter();
    const params = useParams();

    // Fetch blog data and categories
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch categories
                const categoryRes = await fetch("/api/category");
                const categoryData = await categoryRes.json();
                setCategory(categoryData.filter(item => item.status === 1));

                // Fetch blog data
                const blogRes = await fetch(`/api/blogs/${params.id}`);
                if (!blogRes.ok) {
                    throw new Error('Blog not found');
                }
                const blogData = await blogRes.json();

                // Set blog data
                setBlogData({
                    name: blogData.title || "",
                    description: blogData.content || "",
                    category: blogData.category || "",
                    short_info: blogData.excerpt || "",
                    slug: blogData.slug || ""
                });

                // Set existing images if any
                if (blogData.image) {
                    setExistingImages([blogData.image]);
                }

            } catch (err) {
                console.error("Error fetching data:", err);
                alert("Error loading blog data");
                router.push("/dashboard/blog");
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchData();
        }
    }, [params.id, router]);

    const editorConfig = useMemo(() => ({
        height: 400,
        toolbar: true,
        spellcheck: true,
        language: "en",
        placeholder: "Start writing your blog content here...",
        buttons: [
            "bold", "italic", "underline", "|",
            "ul", "ol", "|",
            "font", "fontsize", "|",
            "align", "|",
            "link", "|",
            "undo", "redo"
        ],
        showCharsCounter: true,
        showWordsCounter: true,
        uploader: { insertImageAsBase64URI: true },
        disablePlugins: ["stat"],
        popup: { container: typeof document !== "undefined" ? document.body : null },
        dropdown: { container: typeof document !== "undefined" ? document.body : null },
        iframe: false,
        useSplitMode: false
    }), []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBlogData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length <= 1) {
            const newImages = files.map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }));
            setImages(prev => [...prev, ...newImages]);
        }
    };

    const removeImage = (index) => {
        setImages(prev => {
            const newImages = [...prev];
            URL.revokeObjectURL(newImages[index].preview);
            newImages.splice(index, 1);
            return newImages;
        });
    };

    const removeExistingImage = (index) => {
        setExistingImages(prev => {
            const newImages = [...prev];
            newImages.splice(index, 1);
            return newImages;
        });
    };

    const handleEditorChange = (newContent) => {
        setBlogData(prev => ({ ...prev, description: newContent }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        const errors = [];
        if (!blogData.name) errors.push("Blog title is required");
        if (!blogData.short_info) errors.push("Blog short info is required");
        if (!blogData.slug) errors.push("Blog slug is required");
        if (!blogData.description || blogData.description === "<p></p>") errors.push("Blog description is required");
        if (!blogData.category) errors.push("Category is required");
        // Note: We don't validate images here since existing images are preserved if no new ones are uploaded

        if (errors.length > 0) {
            alert(errors.join("\n"));
            return;
        }

        try {
            // First, update blog data
            const updateData = {
                id: params.id,
                title: blogData.name,
                short_info: blogData.short_info,
                slug: blogData.slug,
                description: blogData.description,
                category: blogData.category
            };

            const dataResponse = await fetch(`/api/blogs/${params.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateData)
            });

            if (!dataResponse.ok) {
                const dataResult = await dataResponse.json();
                throw new Error(dataResult.message || "Failed to update blog data");
            }

            // Then, update images if new images are uploaded
            if (images.length > 0) {
                const formData = new FormData();
                images.forEach(image => {
                    formData.append("images", image.file);
                });

                const imageResponse = await fetch(`/api/blogs/${params.id}`, {
                    method: "PUT",
                    body: formData
                });

                if (!imageResponse.ok) {
                    const imageResult = await imageResponse.json();
                    throw new Error(imageResult.message || "Failed to update blog image");
                }
            }

            alert("Blog updated successfully!");
            router.push("/dashboard/blog");
        } catch (error) {
            console.error("Update error:", error);
            alert(`Error: ${error.message || "An error occurred while updating the blog"}`);
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

    return (
        <div className="bg-gray-50 dark:bg-gray-900 p-4 min-h-screen">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <Link href="/dashboard/blog" aria-label="Back to Blogs">
                            <button className="btn btn-ghost btn-circle" aria-label="Back to Blogs">
                                <ArrowLeft size={20} />
                            </button>
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Blog</h1>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Blog Title */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                Blog Title *
                            </label>
                            <input
                                type="text"
                                name="name"
                                className="input input-bordered w-full"
                                value={blogData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Blog Images */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                Blog Images (Max 1)
                            </label>

                            {/* Existing Images */}
                            {existingImages.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">
                                        Current Images
                                    </h4>
                                    <div className="grid grid-cols-3 gap-4">
                                        {existingImages.map((image, index) => (
                                            <div key={`existing-${index}`} className="relative group">
                                                <img
                                                    src={image}
                                                    alt={`Existing ${index}`}
                                                    loading="eager"
                                                    fetchpriority="high"
                                                    decoding="async"
                                                    className="w-full h-24 object-cover rounded-lg border"
                                                />
                                                <button
                                                    type="button"
                                                    aria-label="Remove Existing Image"
                                                    onClick={() => removeExistingImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Upload New Images */}
                            <div className="border-2 border-dashed rounded-lg p-6 text-center mb-4">
                                <input
                                    type="file"
                                    multiple
                                    accept=".jpg,.jpeg,.png,.webp"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    id="image-upload"
                                    disabled={images.length >= 1}
                                />
                                <label htmlFor="image-upload" className="cursor-pointer">
                                    <Upload className="h-12 w-12 text-green-500 mx-auto mb-2" />
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {images.length >= 1 ? "Max image reached" : "Click to upload new images"}
                                    </p>
                                </label>
                            </div>

                            {/* New Images Preview */}
                            {images.length > 0 && (
                                <div className="grid grid-cols-3 gap-4">
                                    {images.map((image, index) => (
                                        <div key={`new-${index}`} className="relative group">
                                            <img
                                                src={image.preview}
                                                alt={`Preview ${index}`}
                                                loading="eager"
                                                fetchpriority="high"
                                                decoding="async"
                                                className="w-full h-24 object-cover rounded-lg border"
                                            />
                                            <button
                                                type="button"
                                                aria-label="Remove Image"
                                                    onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Blog Short Info */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                Blog Short Info *
                            </label>
                            <input
                                type="text"
                                name="short_info"
                                className="input input-bordered w-full"
                                value={blogData.short_info}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Blog Slug */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                Blog Slug *
                            </label>
                            <input
                                type="text"
                                name="slug"
                                className="input input-bordered w-full"
                                value={blogData.slug}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                Category *
                            </label>
                            <select
                                name="category"
                                className="select select-bordered w-full"
                                value={blogData.category}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Category</option>
                                {category.map(item => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Blog Description */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                                Blog Description *
                            </label>
                            <div className="border rounded-lg bg-white" style={{ overflow: "visible" }}>
                                <JoditEditor
                                    ref={editorRef}
                                    value={blogData.description}
                                    config={editorConfig}
                                    onBlur={handleEditorChange}
                                    onChange={handleEditorChange}
                                />
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-4 pt-4">
                            <Link href="/dashboard/blog" className="flex-1" aria-label="Cancel link">
                                <button type="button" className="btn btn-outline w-full" aria-label="Cancel">
                                    Cancel
                                </button>
                            </Link>
                            <button type="submit" className="btn btn-primary flex-1" aria-label="Update Blog">
                                Update Blog
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 