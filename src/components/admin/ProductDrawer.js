import React, { useEffect, useState } from "react";
import { X, Upload, Plus, Minus, Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight, Palette, Smile } from "lucide-react";

const ProductDrawer = ({ isOpen, onClose, onSuccess }) => {
  const [images, setImages] = useState([]);
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

  const [productData, setProductData] = useState({
    name: "",
    discountPercentage: "",
    priceSingleBox: "",
    priceDoubleBox: "",
    salePrice: "",
    quantity: "",
    brand: "",
    category: "",
    slug: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length <= 10) {
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

  const formatText = (command, value = null, field = 'description') => {
    const editor = document.querySelector(`[data-field="${field}"]`);
    if (editor) {
      editor.focus();
      document.execCommand(command, false, value);
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        setEditorFormat(prev => ({
          ...prev,
          [field]: {
            ...prev[field],
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            underline: document.queryCommandState('underline')
          }
        }));
      }
    }
  };

  const insertEmoji = (emoji, field) => {
    const editor = document.querySelector(`[data-field="${field}"]`);
    if (editor) {
      editor.focus();
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode(emoji));
        range.setStartAfter(editor.childNodes[editor.childNodes.length - 1]);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        if (field === 'description') {
          setDescription(editor.innerHTML);
        } else if (field === 'review') {
          setReview(editor.innerHTML);
        }
      }
    }
    setShowEmojiPicker(prev => ({ ...prev, [field]: false }));
  };

  const handleBulletStyle = (style, isOrdered, field = 'description') => {
    const editor = document.querySelector(`[data-field="${field}"]`);
    if (editor) {
      editor.focus();
      if (isOrdered) {
        document.execCommand('insertOrderedList', false, null);
        const ol = editor.querySelector('ol');
        if (ol) {
          ol.style.listStyleType = style;
        }
      } else {
        document.execCommand('insertUnorderedList', false, null);
        const ul = editor.querySelector('ul');
        if (ul) {
          ul.style.listStyleType = style;
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log("object");

    // Form validation
    const errors = [];
    if (!productData.name) errors.push("Product name is required");
    if (!productData.priceSingleBox) errors.push("Price for single box is required");
    if (!productData.quantity) errors.push("Stock quantity is required");
    if (!productData.category) errors.push("Category is required");
    if (!productData.slug) errors.push("Slug is required");
    if (images.length < 2) errors.push("At least two product images are required");

    if (errors.length > 0) {
      alert(errors.join("\n"));
      return;
    }

    // Prepare form data
    const formData = new FormData();

    // Append product data
    Object.entries(productData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Append arrays as JSON
    formData.append('flavors', flavors);
    formData.append('offers', offers);
    formData.append('keywords', keywords);
    formData.append('tags', tags);
    formData.append('colors', colors);
    formData.append('nicotines', nicotines);

    // Append description and review
    formData.append('description', description);
    formData.append('review', review);

    // Append images
    images.forEach(image => {
      formData.append('images', image.file);
    });

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert('Product added successfully!');
        resetForm();
        onClose();
        onSuccess();
      } else {
        alert(`Error: ${result.message || 'Failed to add product'}`);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred while submitting the form');
    }
  };

  const resetForm = () => {
    setImages([]);
    setFlavors("");
    setOffers("");
    setKeywords("");
    setTags("");
    setColors("");
    setNicotines("");
    setDescription("");
    setReview("");
    setProductData({
      name: "",
      discountPercentage: "",
      priceSingleBox: "",
      priceDoubleBox: "",
      salePrice: "",
      quantity: "",
      brand: "",
      category: ""
    });
  };

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
        className={`drawer drawer-end fixed inset-y-0 right-0 w-full md:w-3/4 lg:w-2/3 xl:w-1/2 bg-white dark:bg-gray-900 z-50 shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex flex-col h-screen max-h-screen">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 flex justify-between items-center">
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold dark:text-white">Add Product</h2>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Add your product and necessary information from here
              </p>
            </div>
            <button
              onClick={onClose}
              className="btn btn-sm btn-ghost btn-circle"
            >
              <X size={20} />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-grow overflow-auto p-6 min-h-0 dark:bg-gray-900">
            <div className="mb-6">
              <h3 className="text-md font-medium text-green-600 border-b border-green-600 pb-1 mb-6 inline-block dark:text-green-400 dark:border-green-400">
                Basic Info
              </h3>

              <div className="space-y-4">
                {/* Product Name */}
                <div>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                    Product Images (Max 10)
                  </label>

                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4 dark:border-gray-700 dark:bg-gray-800">
                    <input
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={images.length >= 10}
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="h-12 w-12 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {images.length >= 10
                          ? "Maximum 10 images reached"
                          : "Click to upload or drag images here"}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-400">
                        (.jpg, .jpeg, .webp, .png - {images.length}/10)
                      </p>
                    </label>
                  </div>

                  {/* Image Preview Grid */}
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

                {/* Pricing Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Single Box Price */}
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

                  {/* Double Box Price */}
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

                {/* Discount & Sale Price Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Discount Percentage */}
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

                  {/* Sale Price */}
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

                {/* Brand */}
                <div>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                    Slug *
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

                {/* Category */}
                <div>
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

                {/* Stock Quantity */}
                <div>
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

                {/* Flavors - Single Input */}
                <div>
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

                {/* Offers - Single Input */}
                <div>
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

                {/* Keywords - Single Input */}
                <div>
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

                {/* Product Tags - Single Input */}
                <div>
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

                {/* Colors - Single Input */}
                <div>
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

                {/* Nicotines - Single Input */}
                <div>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                    Product Description
                  </label>
                  {/* Editor Toolbar */}
                  <div className="border border-gray-300 rounded-t-lg p-2 bg-gray-50 flex gap-1 dark:bg-gray-800 dark:border-gray-700 relative">
                    <button
                      type="button"
                      onClick={() => formatText('bold', null, 'description')}
                      className={`btn btn-xs ${editorFormat.description.bold ? 'btn-active' : 'btn-ghost'}`}
                    >
                      <Bold size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => formatText('italic', null, 'description')}
                      className={`btn btn-xs ${editorFormat.description.italic ? 'btn-active' : 'btn-ghost'}`}
                    >
                      <Italic size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => formatText('underline', null, 'description')}
                      className={`btn btn-xs ${editorFormat.description.underline ? 'btn-active' : 'btn-ghost'}`}
                    >
                      <Underline size={14} />
                    </button>
                    <div className="divider divider-horizontal mx-1"></div>
                    <button
                      type="button"
                      onClick={() => formatText('justifyLeft', null, 'description')}
                      className="btn btn-xs btn-ghost"
                    >
                      <AlignLeft size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => formatText('justifyCenter', null, 'description')}
                      className="btn btn-xs btn-ghost"
                    >
                      <AlignCenter size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => formatText('justifyRight', null, 'description')}
                      className="btn btn-xs btn-ghost"
                    >
                      <AlignRight size={14} />
                    </button>
                    <select
                      onChange={(e) => handleBulletStyle(e.target.value, e.target.value === 'decimal' || e.target.value === 'lower-roman', 'description')}
                      className="select select-xs"
                      defaultValue=""
                    >
                      <option value="" disabled>Bullet Style</option>
                      <option value="decimal">1, 2, 3</option>
                      <option value="lower-roman">i, ii, iii</option>
                      <option value="disc">• Disc</option>
                      <option value="circle">○ Circle</option>
                      <option value="square">■ Square</option>
                    </select>
                    <div className="divider divider-horizontal mx-1"></div>
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(prev => ({ ...prev, description: !prev.description }))}
                      className="btn btn-xs btn-ghost"
                    >
                      <Smile size={14} />
                    </button>
                    {showEmojiPicker.description && (
                      <div className="absolute left-0 top-full mt-2 bg-white border border-gray-300 rounded-lg p-2 flex flex-wrap gap-2 dark:bg-gray-800 dark:border-gray-700 z-50 shadow-lg max-w-sm">
                        {[
                          // Shopping & Payment
                          '😊', '😄', '😂', '😍', '🥰', '😎', '😉', '😢', '😜', '😇',
                          '🤔', '😅', '😤', '😱', '🤗', '🥳', '🤩', '😭', '😡', '🙈',
                          // Gestures
                          '👍', '👏', '🙏', '🙌', '🤝', '👌', '✌️', '🤞', '👊', '👋',
                          // Hearts & Symbols
                          '❤️', '💔', '💖', '💯', '✨', '🌟', '⭐', '✅', '❌', '🔥',
                          // Celebrations & Objects
                          '🎉', '🎊', '🎁', '🎈', '🚀', '🛒', '📌', '📷', '💡', '📝',
                          // Animals & Food
                          '🐶', '🐱', '🍕', '🍔', '🍟', '🍎', '🍩', '☕', '🍀', '🌈',
                          '🛍️', '💳', '🏷️', '💰', '💵', '🪙', '📦', '🚚', '🧾',
                          // Packaging & Delivery
                          '📬', '📭', '📮', '🔖', '🛫', '🛬', '📤', '📥', '🗳️',
                          // Clothing & Fashion
                          '👕', '👚', '👖', '👗', '👠', '👟', '👜', '🎒', '👒', '🧢',
                          // Food Products
                          '🥤', '🍪', '🍫', '🍿', '🧃',
                          // Tech & Gadgets
                          '📱', '💻', '⌚', '🎧', '🎮', '🖨️', '🖱️', '🔌',
                          // Labels & Symbols
                          '🔒'
                        ].map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => insertEmoji(emoji, 'description')}
                            className="text-lg hover:scale-110 transition-transform"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                    <input
                      type="color"
                      onChange={(e) => formatText('foreColor', e.target.value, 'description')}
                      className="w-8 h-8 p-0 border-none"
                    />
                    <select
                      onChange={(e) => formatText('fontSize', e.target.value, 'description')}
                      className="select select-xs"
                      defaultValue="3"
                    >
                      <option value="1">Small</option>
                      <option value="3">Normal</option>
                      <option value="5">Large</option>
                      <option value="7">Extra Large</option>
                    </select>
                  </div>
                  {/* Editor Content */}
                  <div
                    contentEditable
                    data-field="description"
                    className="border border-t-0 border-gray-300 rounded-b-lg p-4 min-h-32 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    placeholder="Enter product description..."
                    onInput={(e) => setDescription(e.target.innerHTML)}
                    style={{ minHeight: '120px' }}
                  ></div>
                </div>

                {/* Product Review */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-200">
                    Product Review
                  </label>
                  {/* Review Editor Toolbar */}
                  <div className="border border-gray-300 rounded-t-lg p-2 bg-gray-50 flex gap-1 dark:bg-gray-800 dark:border-gray-700 relative">
                    <button
                      type="button"
                      onClick={() => formatText('bold', null, 'review')}
                      className={`btn btn-xs ${editorFormat.review.bold ? 'btn-active' : 'btn-ghost'}`}
                    >
                      <Bold size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => formatText('italic', null, 'review')}
                      className={`btn btn-xs ${editorFormat.review.italic ? 'btn-active' : 'btn-ghost'}`}
                    >
                      <Italic size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => formatText('underline', null, 'review')}
                      className={`btn btn-xs ${editorFormat.review.underline ? 'btn-active' : 'btn-ghost'}`}
                    >
                      <Underline size={14} />
                    </button>
                    <div className="divider divider-horizontal mx-1"></div>
                    <button
                      type="button"
                      onClick={() => formatText('justifyLeft', null, 'review')}
                      className="btn btn-xs btn-ghost"
                    >
                      <AlignLeft size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => formatText('justifyCenter', null, 'review')}
                      className="btn btn-xs btn-ghost"
                    >
                      <AlignCenter size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => formatText('justifyRight', null, 'review')}
                      className="btn btn-xs btn-ghost"
                    >
                      <AlignRight size={14} />
                    </button>
                    <select
                      onChange={(e) => handleBulletStyle(e.target.value, e.target.value === 'decimal' || e.target.value === 'lower-roman', 'review')}
                      className="select select-xs"
                      defaultValue=""
                    >
                      <option value="" disabled>Bullet Style</option>
                      <option value="decimal">1, 2, 3</option>
                      <option value="lower-roman">i, ii, iii</option>
                      <option value="disc">• Disc</option>
                      <option value="circle">○ Circle</option>
                      <option value="square">■ Square</option>
                    </select>
                    <div className="divider divider-horizontal mx-1"></div>
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(prev => ({ ...prev, review: !prev.review }))}
                      className="btn btn-xs btn-ghost"
                    >
                      <Smile size={14} />
                    </button>
                    {showEmojiPicker.review && (
                      <div className="absolute left-0 top-full mt-2 bg-white border border-gray-300 rounded-lg p-2 flex flex-wrap gap-2 dark:bg-gray-800 dark:border-gray-700 z-50 shadow-lg max-w-sm">
                        {[
                          // Shopping & Payment
                          '😊', '😄', '😂', '😍', '🥰', '😎', '😉', '😢', '😜', '😇',
                          '🤔', '😅', '😤', '😱', '🤗', '🥳', '🤩', '😭', '😡', '🙈',
                          // Gestures
                          '👍', '👏', '🙏', '🙌', '🤝', '👌', '✌️', '🤞', '👊', '👋',
                          // Hearts & Symbols
                          '❤️', '💔', '💖', '💯', '✨', '🌟', '⭐', '✅', '❌', '🔥',
                          // Celebrations & Objects
                          '🎉', '🎊', '🎁', '🎈', '🚀', '🛒', '📌', '📷', '💡', '📝',
                          // Animals & Food
                          '🐶', '🐱', '🍕', '🍔', '🍟', '🍎', '🍩', '☕', '🍀', '🌈',
                          '🛍️', '💳', '🏷️', '💰', '💵', '🪙', '📦', '🚚', '🧾',
                          // Packaging & Delivery
                          '📬', '📭', '📮', '🔖', '🛫', '🛬', '📤', '📥', '🗳️',
                          // Clothing & Fashion
                          '👕', '👚', '👖', '👗', '👠', '👟', '👜', '🎒', '👒', '🧢',
                          // Food Products
                          '🥤', '🍪', '🍫', '🍿', '🧃',
                          // Tech & Gadgets
                          '📱', '💻', '⌚', '🎧', '🎮', '🖨️', '🖱️', '🔌',
                          // Labels & Symbols
                          '🔒'
                        ].map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => insertEmoji(emoji, 'review')}
                            className="text-lg hover:scale-110 transition-transform"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}
                    <input
                      type="color"
                      onChange={(e) => formatText('foreColor', e.target.value, 'review')}
                      className="w-8 h-8 p-0 border-none"
                    />
                    <select
                      onChange={(e) => formatText('fontSize', e.target.value, 'review')}
                      className="select select-xs"
                      defaultValue="3"
                    >
                      <option value="1">Small</option>
                      <option value="3">Normal</option>
                      <option value="5">Large</option>
                      <option value="7">Extra Large</option>
                    </select>
                  </div>
                  {/* Editor Content */}
                  <div
                    contentEditable
                    data-field="review"
                    className="border border-t-0 border-gray-300 rounded-b-lg p-4 min-h-32 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                    placeholder="Enter product review..."
                    onInput={(e) => setReview(e.target.innerHTML)}
                    style={{ minHeight: '120px' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-between gap-4 dark:bg-gray-900 dark:border-gray-700">
            <button
              onClick={onClose}
              className="btn btn-outline flex-1 dark:btn-outline dark:border-gray-700 dark:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="btn btn-success text-white flex-1 dark:btn-success"
            >
              Add Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDrawer;