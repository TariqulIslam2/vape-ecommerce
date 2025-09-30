"use client";
import { useState, useRef, useMemo, useEffect } from "react";
import JoditEditor from "jodit-react";
import { Upload, X } from "lucide-react";
import { useRouter } from "next/navigation";



export default function AddBlogPage() {


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
    const router = useRouter();

    // Fetch categories (simulate API call or use your real API)
    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch("/api/category");
                const data = await res.json();
                setCategory(data.filter(item => item.status === 1));
            } catch (err) {
                setCategory([]);
            }
        }
        fetchCategories();
    }, []);

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

    const handleEditorChange = (newContent) => {
        setBlogData(prev => ({ ...prev, description: newContent }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // You can add validation here
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
        // Prepare form data
        const formData = new FormData();
        Object.entries(blogData).forEach(([key, value]) => {
            formData.append(key, value);
        });
        images.forEach(image => formData.append("images", image.file));
        // Submit to your API
        try {
            const response = await fetch("/api/blogs", {
                method: "POST",
                body: formData
            });
            const result = await response.json();
            if (response.ok) {
                alert("Blog added successfully!");
                router.push("/dashboard/blog");
            } else {
                alert(`Error: ${result.message || "Failed to add blog"}`);
            }
        } catch (error) {
            alert("An error occurred while submitting the form");
        }
    };

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Add Blog</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Blog Title */}
                <div>
                    <label className="block text-sm font-medium mb-1">Blog title *</label>
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
                                        type="button"
                                        aria-label="Remove Image"
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
                {/* Blog short info */}
                <div>
                    <label className="block text-sm font-medium mb-1">Blog short info *</label>
                    <input
                        type="text"
                        name="short_info"
                        className="input input-bordered w-full"
                        value={blogData.short_info}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                {/* Blog slug */}
                <div>
                    <label className="block text-sm font-medium mb-1">Blog slug *</label>
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
                    <label className="block text-sm font-medium mb-1">Category *</label>
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
                    <label className="block text-sm font-medium mb-1">Blog Description *</label>
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
                {/* Submit Button */}
                <div className="flex gap-4">
                    <button type="button" className="btn btn-outline flex-1" onClick={() => router.push("/(admin)/dashboard/blog")} aria-label="Cancel">Cancel</button>
                    <button type="submit" className="btn btn-success flex-1" aria-label="Add Blog">Add Blog</button>
                </div>
            </form>
        </div>
    );
}