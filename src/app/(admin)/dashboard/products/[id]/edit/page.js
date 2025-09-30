"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { X, Upload, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Smile } from "lucide-react";

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params?.id;
    // console.log("Hittting");
    const [images, setImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [category, setCategory] = useState([]);
    const [flavors, setFlavors] = useState("");
    const [offers, setOffers] = useState("");
    const [keywords, setKeywords] = useState("");
    const [tags, setTags] = useState("");
    const [colors, setColors] = useState("");
    const [nicotines, setNicotines] = useState("");
    const [description, setDescription] = useState("");
    const [review, setReview] = useState("");
    const [editorFormat, setEditorFormat] = useState({
        description: { bold: false, italic: false, underline: false, align: 'left' },
        review: { bold: false, italic: false, underline: false, align: 'left' }
    });
    const [showEmojiPicker, setShowEmojiPicker] = useState({ description: false, review: false });
    const editorRef = useRef({ description: null, review: null });
    const selectionRef = useRef({ description: null, review: null });
    const [productData, setProductData] = useState({
        id: '',
        name: "",
        discountPercentage: "",
        priceSingleBox: "",
        priceDoubleBox: "",
        salePrice: "",
        quantity: "",
        brand: "",
        category: "",
        slug: ""
    });

    useEffect(() => {
        if (!productId) return;
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${productId}`);
                const product = await res.json();
                // console.log(product);
                setProductData({
                    id: product.id,
                    name: product.product_name || "",
                    discountPercentage: product.discount || "",
                    priceSingleBox: product.single_price || "",
                    priceDoubleBox: product.box_price || "",
                    salePrice: product.sale_price || "",
                    quantity: product.stock || "",
                    brand: product.brand || "",
                    category: product.category_id || "",
                    slug: product.slug || ""
                });
                setExistingImages(product.images || []);
                setFlavors(product.flavors || "");
                setOffers(product.offers || "");
                setKeywords(product.keywords || "");
                setTags(product.tags || "");
                setColors(product.colors || "");
                setNicotines(product.nicotines || "");
                setDescription(product.description || "");
                setReview(product.review || "");
                // Set editor content only once after product is loaded
                if (editorRef.current.description) editorRef.current.description.innerHTML = product.description || "";
                if (editorRef.current.review) editorRef.current.review.innerHTML = product.review || "";
            } catch (err) {
                alert("Failed to fetch product");
            }
        };
        fetchProduct();
    }, [productId]);

    // console.log(productData);



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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (existingImages.length + images.length + files.length <= 10) {
            const newImages = files.map(file => ({ file, preview: URL.createObjectURL(file) }));
            setImages(prev => [...prev, ...newImages]);
        }
    };

    const removeImage = (index, isExisting) => {
        if (isExisting) {
            setExistingImages(prev => prev.filter((_, i) => i !== index));
        } else {
            setImages(prev => {
                const newImages = [...prev];
                URL.revokeObjectURL(newImages[index].preview);
                newImages.splice(index, 1);
                return newImages;
            });
        }
    };

    // Save current selection
    const saveSelection = (field) => {
        const sel = window.getSelection();
        if (sel.rangeCount > 0) {
            selectionRef.current[field] = sel.getRangeAt(0);
        }
    };

    // Restore saved selection
    const restoreSelection = (field) => {
        if (selectionRef.current[field]) {
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(selectionRef.current[field]);
        }
    };

    // Format text with saved selection
    const formatText = (command, value = null, field = 'description') => {
        if (editorRef.current[field]) {
            editorRef.current[field].focus();
            restoreSelection(field);
            document.execCommand(command, false, value);
            // Font size fix: map fontSize to CSS
            if (command === 'fontSize') {
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    let node = selection.anchorNode;
                    while (node && node.nodeType !== 1) node = node.parentNode;
                    // Find <font> tag
                    if (node && node.tagName === 'FONT') {
                        // Map value to CSS size
                        const sizeMap = { '1': '12px', '3': '16px', '5': '24px', '7': '32px' };
                        node.style.fontSize = sizeMap[value] || '16px';
                    }
                }
            }
            updateFormatState(field);
        }
    };

    // Update format state
    const updateFormatState = (field) => {
        setEditorFormat(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                bold: document.queryCommandState('bold'),
                italic: document.queryCommandState('italic'),
                underline: document.queryCommandState('underline')
            }
        }));
    };

    // Insert emoji at cursor position
    const insertEmoji = (emoji, field) => {
        if (editorRef.current[field]) {
            editorRef.current[field].focus();
            restoreSelection(field);
            document.execCommand('insertText', false, emoji);
            setShowEmojiPicker(prev => ({ ...prev, [field]: false }));
            if (field === 'description') {
                setDescription(editorRef.current[field].innerHTML);
            } else {
                setReview(editorRef.current[field].innerHTML);
            }
        }
    };

    // Handle bullet styles
    const handleBulletStyle = (style, field) => {
        if (editorRef.current[field]) {
            editorRef.current[field].focus();
            restoreSelection(field);
            const isOrdered = style === 'decimal' || style === 'lower-roman';
            if (isOrdered) {
                document.execCommand('insertOrderedList');
            } else {
                document.execCommand('insertUnorderedList');
            }
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                let node = selection.anchorNode;
                while (node && node.nodeType !== 1) node = node.parentNode;
                // Walk up to OL/UL
                while (node && !['OL', 'UL'].includes(node.tagName)) node = node.parentNode;
                if (node && ['OL', 'UL'].includes(node.tagName)) {
                    node.style.listStyleType = style;
                }
            }
        }
    };
    console.log(productData)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = [];
        if (!productData.name) errors.push("Product name is required");
        if (!productData.priceSingleBox) errors.push("Price for single box is required");
        if (!productData.quantity) errors.push("Stock quantity is required");
        if (!productData.category) errors.push("Category is required");
        if (!productData.slug) errors.push("Slug is required");
        if (existingImages.length + images.length === 0) errors.push("At least one product image is required");
        if (errors.length > 0) { alert(errors.join("\n")); return; }
        const formData = new FormData();
        Object.entries(productData).forEach(([key, value]) => { formData.append(key, value); });
        formData.append('flavors', flavors);
        formData.append('offers', offers);
        formData.append('keywords', keywords);
        formData.append('tags', tags);
        formData.append('colors', colors);
        formData.append('nicotines', nicotines);
        formData.append('description', description);
        formData.append('review', review);
        existingImages.forEach(url => formData.append('existingImages', url));
        images.forEach(image => { formData.append('images', image.file); });
        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                body: formData,
            });
            const result = await response.json();
            if (response.ok) {
                alert('Product updated successfully!');
                router.push('/dashboard/products');
            } else {
                alert(`Error: ${result.message || 'Failed to update product'}`);
            }
        } catch (error) {
            console.error('Update error:', error);
            alert('An error occurred while updating the product');
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
                <h2 className="text-2xl font-semibold mb-2 dark:text-white">Edit Product</h2>
                <p className="text-sm text-gray-500 mb-6 dark:text-gray-300">Edit your product and necessary information from here</p>
                <form onSubmit={handleSubmit}>
                    {/* Product Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Product Name"
                            className="input input-bordered w-full dark:bg-gray-800 dark:text-white dark:border-gray-700"
                            value={productData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Product Images */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                            Product Images (Max 10)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4 dark:border-gray-700 dark:bg-gray-800">
                            <input
                                type="file"
                                multiple
                                accept=".jpg,.jpeg,.png,.webp"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="image-upload"
                                disabled={existingImages.length + images.length >= 10}
                            />
                            <label htmlFor="image-upload" className="cursor-pointer">
                                <Upload className="h-12 w-12 text-green-500 mx-auto mb-2" />
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {existingImages.length + images.length >= 10
                                        ? "Maximum 10 images reached"
                                        : "Click to upload or drag images here"}
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-400">
                                    (.jpg, .jpeg, .webp, .png - {existingImages.length + images.length}/10)
                                </p>
                            </label>
                        </div>
                        {/* Existing Images */}
                        {existingImages.length > 0 && (
                            <div className="grid grid-cols-3 gap-4 mb-2">
                                {existingImages.map((url, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={url}
                                            loading="eager"
                                            fetchpriority="high"
                                            decoding="async"
                                            alt={`Existing ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-lg border dark:border-gray-700"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index, true)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* New Images */}
                        {images.length > 0 && (
                            <div className="grid grid-cols-3 gap-4">
                                {images.map((image, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={image.preview}
                                            loading="eager"
                                            fetchpriority="high"
                                            decoding="async"
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-lg border dark:border-gray-700"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index, false)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pricing Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                                Price (Single) *
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <span className="text-gray-500 dark:text-gray-400">$</span>
                                </div>
                                <input
                                    type="number"
                                    name="priceSingleBox"
                                    placeholder="0.00"
                                    className="input input-bordered w-full pl-8 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                                    min="0"
                                    step="0.01"
                                    value={productData.priceSingleBox}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                                Price (Box)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <span className="text-gray-500 dark:text-gray-400">$</span>
                                </div>
                                <input
                                    type="number"
                                    name="priceDoubleBox"
                                    placeholder="0.00"
                                    className="input input-bordered w-full pl-8 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                                    min="0"
                                    step="0.01"
                                    value={productData.priceDoubleBox}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                                Discount Percentage
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    name="discountPercentage"
                                    placeholder="0"
                                    className="input input-bordered w-full pr-8 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                                    min="0"
                                    max="100"
                                    value={productData.discountPercentage}
                                    onChange={handleInputChange}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <span className="text-gray-500 dark:text-gray-400">%</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                                Sale Price
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <span className="text-gray-500 dark:text-gray-400">$</span>
                                </div>
                                <input
                                    type="number"
                                    name="salePrice"
                                    placeholder="0.00"
                                    className="input input-bordered w-full pl-8 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                                    min="0"
                                    step="0.01"
                                    value={productData.salePrice}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                            Brand
                        </label>
                        <input
                            type="text"
                            name="brand"
                            placeholder="Enter brand name"
                            className="input input-bordered w-full dark:bg-gray-800 dark:text-white dark:border-gray-700"
                            value={productData.brand}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                            Slug
                        </label>
                        <input
                            type="text"
                            name="slug"
                            placeholder="Enter slug name"
                            className="input input-bordered w-full dark:bg-gray-800 dark:text-white dark:border-gray-700"
                            value={productData.slug}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                            Category *
                        </label>
                        <select
                            name="category"
                            className="select select-bordered w-full dark:bg-gray-800 dark:text-white dark:border-gray-700"
                            value={productData.category}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="" disabled>Select Category</option>
                            {category.map((item, index) => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                            Stock Quantity *
                        </label>
                        <input
                            type="number"
                            name="quantity"
                            placeholder="0"
                            className="input input-bordered w-full dark:bg-gray-800 dark:text-white dark:border-gray-700"
                            min="0"
                            value={productData.quantity}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    {/* Flavors, Offers, Keywords, Tags, Colors, Nicotines */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                            Flavors (flavor1,flavor2,flavor3)
                        </label>
                        <input
                            type="text"
                            value={flavors}
                            onChange={e => setFlavors(e.target.value)}
                            placeholder="Enter flavor"
                            className="input input-bordered w-full dark:bg-gray-800 dark:text-white dark:border-gray-700"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                            Offers (offer1,offer2,offer3)
                        </label>
                        <input
                            type="text"
                            value={offers}
                            onChange={e => setOffers(e.target.value)}
                            placeholder="Enter offer"
                            className="input input-bordered w-full dark:bg-gray-800 dark:text-white dark:border-gray-700"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                            Keywords (keyword1,keyword2,keyword3)
                        </label>
                        <input
                            type="text"
                            value={keywords}
                            onChange={e => setKeywords(e.target.value)}
                            placeholder="Enter keyword"
                            className="input input-bordered w-full dark:bg-gray-800 dark:text-white dark:border-gray-700"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                            Product Tags (tag1,tag2,tag3)
                        </label>
                        <input
                            type="text"
                            value={tags}
                            onChange={e => setTags(e.target.value)}
                            placeholder="Enter tag"
                            className="input input-bordered w-full dark:bg-gray-800 dark:text-white dark:border-gray-700"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                            Colors (color1,color2,color3)
                        </label>
                        <input
                            type="text"
                            value={colors}
                            onChange={e => setColors(e.target.value)}
                            placeholder="Enter color"
                            className="input input-bordered w-full dark:bg-gray-800 dark:text-white dark:border-gray-700"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                            Nicotines (nicotine1,nicotine2,nicotine3)
                        </label>
                        <input
                            type="text"
                            value={nicotines}
                            onChange={e => setNicotines(e.target.value)}
                            placeholder="Enter nicotine level"
                            className="input input-bordered w-full dark:bg-gray-800 dark:text-white dark:border-gray-700"
                        />
                    </div>
                    {/* Product Description */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                            Product Description
                        </label>
                        {/* Editor Toolbar */}
                        <div className="border border-gray-300 rounded-t-lg p-2 bg-gray-50 flex gap-1 dark:bg-gray-800 dark:border-gray-700 relative">
                            <button type="button" onClick={() => formatText('bold', null, 'description')} className={`btn btn-xs ${editorFormat.description.bold ? 'btn-active' : 'btn-ghost'}`}><Bold size={14} /></button>
                            <button type="button" onClick={() => formatText('italic', null, 'description')} className={`btn btn-xs ${editorFormat.description.italic ? 'btn-active' : 'btn-ghost'}`}><Italic size={14} /></button>
                            <button type="button" onClick={() => formatText('underline', null, 'description')} className={`btn btn-xs ${editorFormat.description.underline ? 'btn-active' : 'btn-ghost'}`}><Underline size={14} /></button>
                            <div className="divider divider-horizontal mx-1"></div>
                            <button type="button" onClick={() => formatText('justifyLeft', null, 'description')} className="btn btn-xs btn-ghost"><AlignLeft size={14} /></button>
                            <button type="button" onClick={() => formatText('justifyCenter', null, 'description')} className="btn btn-xs btn-ghost"><AlignCenter size={14} /></button>
                            <button type="button" onClick={() => formatText('justifyRight', null, 'description')} className="btn btn-xs btn-ghost"><AlignRight size={14} /></button>
                            <select onChange={e => handleBulletStyle(e.target.value, 'description')}><option value="" disabled>Bullet Style</option><option value="decimal">1, 2, 3</option><option value="lower-roman">i, ii, iii</option><option value="disc">• Disc</option><option value="circle">○ Circle</option><option value="square">■ Square</option></select>
                            <div className="divider divider-horizontal mx-1"></div>
                            <button type="button" onClick={() => setShowEmojiPicker(prev => ({ ...prev, description: !prev.description }))}><Smile size={14} /></button>
                            {showEmojiPicker.description && (
                                <div className="absolute left-0 top-full mt-2 bg-white border border-gray-300 rounded-lg p-2 flex flex-wrap gap-2 dark:bg-gray-800 dark:border-gray-700 z-50 shadow-lg max-w-sm">
                                    {["😊", "😄", "😂", "😍", "🥰", "😎", "😉", "😢", "😜", "😇", "🤔", "😅", "😤", "😱", "🤗", "🥳", "🤩", "😭", "😡", "🙈", "👍", "👏", "🙏", "🙌", "🤝", "👌", "✌️", "🤞", "👊", "👋", "❤️", "💔", "💖", "💯", "✨", "🌟", "⭐", "✅", "❌", "🔥", "🎉", "🎊", "🎁", "🎈", "🚀", "🛒", "📌", "📷", "💡", "📝", "🐶", "🐱", "🍕", "🍔", "🍟", "🍎", "🍩", "☕", "🍀", "🌈", "🛍️", "💳", "🏷️", "💰", "💵", "🪙", "📦", "🚚", "🧾", "📬", "📭", "📮", "🔖", "🛫", "🛬", "📤", "📥", "🗳️", "👕", "👚", "👖", "👗", "👠", "👟", "👜", "🎒", "👒", "🧢", "🥤", "🍪", "🍫", "🍿", "🧃", "📱", "💻", "⌚", "🎧", "🎮", "🖨️", "🖱️", "🔌", "🔒"].map(emoji => (<button key={emoji} type="button" onClick={() => insertEmoji(emoji, 'description')} className="text-lg hover:scale-110 transition-transform">{emoji}</button>))}
                                </div>
                            )}
                            <input type="color" onChange={e => formatText('foreColor', e.target.value, 'description')} className="w-8 h-8 p-0 border-none" />
                            <select onChange={e => formatText('fontSize', e.target.value, 'description')}><option value="1">Small</option><option value="3">Normal</option><option value="5">Large</option><option value="7">Extra Large</option></select>
                        </div>
                        <div
                            contentEditable
                            ref={el => editorRef.current.description = el}
                            data-field="description"
                            className="border border-t-0 border-gray-300 rounded-b-lg p-4 min-h-32 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                            placeholder="Enter product description..."
                            onInput={e => setDescription(e.currentTarget.innerHTML)}
                            onBlur={() => saveSelection('description')}
                            onKeyUp={() => updateFormatState('description')}
                            onMouseUp={() => saveSelection('description')}
                        ></div>
                    </div>
                    {/* Product Review */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                            Product Review
                        </label>
                        <div className="border border-gray-300 rounded-t-lg p-2 bg-gray-50 flex gap-1 dark:bg-gray-800 dark:border-gray-700 relative">
                            <button type="button" onClick={() => formatText('bold', null, 'review')} className={`btn btn-xs ${editorFormat.review.bold ? 'btn-active' : 'btn-ghost'}`}><Bold size={14} /></button>
                            <button type="button" onClick={() => formatText('italic', null, 'review')} className={`btn btn-xs ${editorFormat.review.italic ? 'btn-active' : 'btn-ghost'}`}><Italic size={14} /></button>
                            <button type="button" onClick={() => formatText('underline', null, 'review')} className={`btn btn-xs ${editorFormat.review.underline ? 'btn-active' : 'btn-ghost'}`}><Underline size={14} /></button>
                            <div className="divider divider-horizontal mx-1"></div>
                            <button type="button" onClick={() => formatText('justifyLeft', null, 'review')} className="btn btn-xs btn-ghost"><AlignLeft size={14} /></button>
                            <button type="button" onClick={() => formatText('justifyCenter', null, 'review')} className="btn btn-xs btn-ghost"><AlignCenter size={14} /></button>
                            <button type="button" onClick={() => formatText('justifyRight', null, 'review')} className="btn btn-xs btn-ghost"><AlignRight size={14} /></button>
                            <select onChange={e => handleBulletStyle(e.target.value, 'review')}><option value="" disabled>Bullet Style</option><option value="decimal">1, 2, 3</option><option value="lower-roman">i, ii, iii</option><option value="disc">• Disc</option><option value="circle">○ Circle</option><option value="square">■ Square</option></select>
                            <div className="divider divider-horizontal mx-1"></div>
                            <button type="button" onClick={() => setShowEmojiPicker(prev => ({ ...prev, review: !prev.review }))}><Smile size={14} /></button>
                            {showEmojiPicker.review && (
                                <div className="absolute left-0 top-full mt-2 bg-white border border-gray-300 rounded-lg p-2 flex flex-wrap gap-2 dark:bg-gray-800 dark:border-gray-700 z-50 shadow-lg max-w-sm">
                                    {["😊", "😄", "😂", "😍", "🥰", "😎", "😉", "😢", "😜", "😇", "🤔", "😅", "😤", "😱", "🤗", "🥳", "🤩", "😭", "😡", "🙈", "👍", "👏", "🙏", "🙌", "🤝", "👌", "✌️", "🤞", "👊", "👋", "❤️", "💔", "💖", "💯", "✨", "🌟", "⭐", "✅", "❌", "🔥", "🎉", "🎊", "🎁", "🎈", "🚀", "🛒", "📌", "📷", "💡", "📝", "🐶", "🐱", "🍕", "🍔", "🍟", "🍎", "🍩", "☕", "🍀", "🌈", "🛍️", "💳", "🏷️", "💰", "💵", "🪙", "📦", "🚚", "🧾", "📬", "📭", "📮", "🔖", "🛫", "🛬", "📤", "📥", "🗳️", "👕", "👚", "👖", "👗", "👠", "👟", "👜", "🎒", "👒", "🧢", "🥤", "🍪", "🍫", "🍿", "🧃", "📱", "💻", "⌚", "🎧", "🎮", "🖨️", "🖱️", "🔌", "🔒"].map(emoji => (<button key={emoji} type="button" onClick={() => insertEmoji(emoji, 'review')} className="text-lg hover:scale-110 transition-transform">{emoji}</button>))}
                                </div>
                            )}
                            <input type="color" onChange={e => formatText('foreColor', e.target.value, 'review')} className="w-8 h-8 p-0 border-none" />
                            <select onChange={e => formatText('fontSize', e.target.value, 'review')}><option value="1">Small</option><option value="3">Normal</option><option value="5">Large</option><option value="7">Extra Large</option></select>
                        </div>
                        <div
                            contentEditable
                            ref={el => editorRef.current.review = el}
                            data-field="review"
                            className="border border-t-0 border-gray-300 rounded-b-lg p-4 min-h-32 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                            placeholder="Enter product review..."
                            onInput={e => setReview(e.currentTarget.innerHTML)}
                            onBlur={() => saveSelection('review')}
                            onKeyUp={() => updateFormatState('review')}
                            onMouseUp={() => saveSelection('review')}
                        ></div>
                    </div>
                    {/* Submit button */}
                    <button type="submit" className="btn bg-green-600 hover:bg-green-700 text-white mt-6">Save Changes</button>
                </form>
            </div>
        </div>
    );
} 