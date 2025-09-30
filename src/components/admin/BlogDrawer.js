"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import { X, Upload } from "lucide-react";
import JoditEditor from "jodit-react";

const BlogDrawer = ({ isOpen, onClose, onSuccess }) => {
    const [mounted, setMounted] = useState(false);
    const [images, setImages] = useState([]);
    const [category, setCategory] = useState([]);
    const [blogData, setBlogData] = useState({
        name: "",
        description: "",
        category: "",
        short_info: "",
        slug: ""
    });

    const editorRef = useRef(null);

    // Jodit editor config
    const editorConfig = useMemo(() => ({
        height: 400,
        theme: "default",
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

        // 🔹 Force all UI to render outside modal
        popup: {
            container: typeof document !== "undefined" ? document.body : null
        },
        dropdown: {
            container: typeof document !== "undefined" ? document.body : null
        },

        // 🔹 Prevent clipping issues
        iframe: false,
        useSplitMode: false
    }), []);



    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/category");
                const data = await res.json();
                setCategory(data.filter(item => item.status === 1));
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        };
        fetchCategories();
    }, []);

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

    const handleEditorChange = (newContent) => {
        setBlogData(prev => ({ ...prev, description: newContent }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = [];
        if (!blogData.name) errors.push("Blog title is required");
        if (!blogData.short_info) errors.push("Blog short info is required");
        if (!blogData.slug) errors.push("Blog slug is required");
        if (!blogData.description || blogData.description === "<p></p>") errors.push("Blog description is required");
        if (!blogData.category) errors.push("Category is required");
        if (images.length < 1) errors.push("At least one blog image is required");

        if (errors.length > 0) {
            alert(errors.join("\n"));
            return;
        }

        const formData = new FormData();
        Object.entries(blogData).forEach(([key, value]) => {
            formData.append(key, value);
        });
        images.forEach(image => formData.append("images", image.file));

        try {
            const response = await fetch("/api/blogs", {
                method: "POST",
                body: formData
            });

            const result = await response.json();
            if (response.ok) {
                alert("Blog added successfully!");
                resetForm();
                onClose();
                onSuccess();
            } else {
                alert(`Error: ${result.message || "Failed to add blog"}`);
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("An error occurred while submitting the form");
        }
    };

    const resetForm = () => {
        images.forEach(image => URL.revokeObjectURL(image.preview));
        setImages([]);
        setBlogData({
            name: "",
            description: "",
            category: "",
            short_info: "",
            slug: ""
        });
    };

    if (!mounted) return null;

    return (
        <div className="relative">
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-stone-900 opacity-75 z-40 dark:bg-stone-900 dark:opacity-80"
                    onClick={onClose}
                ></div>
            )}

            {/* Drawer */}
            <div
                className={`drawer drawer-end fixed inset-y-0 right-0 w-full md:w-3/4 lg:w-2/3 xl:w-1/2 bg-white dark:bg-gray-900 z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex flex-col h-screen max-h-screen">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold dark:text-white">Add Blog</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-300">
                                Add your blog and necessary information from here
                            </p>
                        </div>
                        <button onClick={onClose} className="btn btn-sm btn-ghost btn-circle">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex-grow overflow-auto p-6 min-h-0 dark:bg-gray-900">
                        <h3 className="text-md font-medium text-green-600 border-b border-green-600 pb-1 mb-6 inline-block dark:text-green-400 dark:border-green-400">
                            Basic Info
                        </h3>

                        <div className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Blog title *</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="input input-bordered w-full dark:bg-gray-800 dark:text-white"
                                    value={blogData.name}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Image */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Blog Images (Max 1)</label>
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
                                        <p className="text-sm">
                                            {images.length >= 1 ? "Max image reached" : "Click to upload"}
                                        </p>
                                    </label>
                                </div>
                                {images.length > 0 && (
                                    <div className="grid grid-cols-3 gap-4">
                                        {images.map((image, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={image.preview}
                                                    alt={`Preview ${index}`}
                                                    loading="eager"
                                                    fetchpriority="high"
                                                    decoding="async"
                                                    className="w-full h-24 object-cover rounded-lg border"
                                                />
                                                <button
                                                    onClick={() => removeImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Short info */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Blog short info *</label>
                                <input
                                    type="text"
                                    name="short_info"
                                    className="input input-bordered w-full dark:bg-gray-800 dark:text-white"
                                    value={blogData.short_info}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Slug */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Blog slug *</label>
                                <input
                                    type="text"
                                    name="slug"
                                    className="input input-bordered w-full dark:bg-gray-800 dark:text-white"
                                    value={blogData.slug}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Category *</label>
                                <select
                                    name="category"
                                    className="select select-bordered w-full dark:bg-gray-800 dark:text-white"
                                    value={blogData.category}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Category</option>
                                    {category.map(item => (
                                        <option key={item.id} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Blog Description *</label>
                                <div
                                    className="border rounded-lg bg-white dark:bg-gray-900"
                                    style={{ overflow: "visible" }}
                                >
                                    <JoditEditor
                                        ref={editorRef}
                                        value={blogData.description}
                                        config={editorConfig}
                                        onBlur={newContent =>
                                            setBlogData(prev => ({ ...prev, description: newContent }))
                                        }
                                        onChange={handleEditorChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t bg-white dark:bg-gray-900">
                        <div className="flex gap-4">
                            <button onClick={onClose} className="btn btn-outline flex-1">
                                Cancel
                            </button>
                            <button onClick={handleSubmit} className="btn btn-success flex-1">
                                Add Blog
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDrawer;
