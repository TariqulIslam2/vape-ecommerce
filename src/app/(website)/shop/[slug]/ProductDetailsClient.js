"use client";

import { useState } from "react";
import {
    FaHeart,
    FaFacebook,
    FaTwitter,
    FaLinkedin,
    FaWhatsapp,
} from "react-icons/fa";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";

const ProductDetailsClient = ({ product, relatedProducts }) => {
    const [selected, setSelected] = useState(0);
    const [zoom, setZoom] = useState(false);
    const [origin, setOrigin] = useState({ x: "50%", y: "50%" });
    const [flavor, setFlavor] = useState("");
    const [offer, setOffer] = useState("");
    const [color, setColor] = useState("");
    const [nicotine, setNicotine] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [showDrawer, setShowDrawer] = useState(false);
    const [activeTab, setActiveTab] = useState("Description");

    // Helper function to check if option exists and has values
    const hasOption = (optionName) => {
        const option = product[optionName];
        if (!option) return false;
        const parsedOption = Array.isArray(option)
            ? option
            : typeof option === "string"
                ? option.split(",").map(s => s.trim()).filter(Boolean)
                : [];
        return parsedOption.length > 0;
    };

    // Get available options
    const availableOptions = [
        { key: 'flavors', label: 'Flavors', state: flavor, setState: setFlavor },
        { key: 'offers', label: 'Offers', state: offer, setState: setOffer },
        { key: 'colors', label: 'Colors', state: color, setState: setColor },
        { key: 'nicotines', label: 'Nicotines', state: nicotine, setState: setNicotine }
    ].filter(option => hasOption(option.key));

    const handleMouseMove = (e) => {
        const { left, top, width, height } =
            e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setOrigin({ x: `${x}%`, y: `${y}%` });
        setZoom(true);
    };

    const handleMouseLeave = () => {
        setZoom(false);
        setOrigin({ x: "50%", y: "50%" });
    };

    const addToCart = () => {
        // Check if all available options are selected
        const unselectedOptions = availableOptions.filter(option => !option.state);

        if (unselectedOptions.length > 0) {
            alert(`Please select: ${unselectedOptions.map(opt => opt.label).join(', ')}`);
            return;
        }

        const newItem = {
            ...product,
            selectedFlavor: flavor,
            selectedOffer: offer,
            selectedColor: color,
            selectedNicotine: nicotine,
            quantity,
        };

        const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

        let itemExists;

        if (availableOptions.length === 0) {
            // If no options available, just match by product ID
            itemExists = existingCart.find(item => item.id === newItem.id);
        } else {
            // If options available, match by ID and selected options
            itemExists = existingCart.find(
                (item) =>
                    item.id === newItem.id &&
                    item.selectedFlavor === newItem.selectedFlavor &&
                    item.selectedOffer === newItem.selectedOffer &&
                    item.selectedColor === newItem.selectedColor &&
                    item.selectedNicotine === newItem.selectedNicotine
            );
        }

        if (itemExists) {
            itemExists.quantity += quantity;
        } else {
            existingCart.push(newItem);
        }

        localStorage.setItem("cart", JSON.stringify(existingCart));
        window.dispatchEvent(new Event("cartUpdated"));
        setShowDrawer(true);
    };

    const addToWishlist = () => {
        const newItem = {
            ...product,
            flavors: product.flavors,
            offers: product.offers,
            colors: product.colors,
            nicotines: product.nicotines,
        };

        const existingWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        const itemExists = existingWishlist.find((item) => item.id === newItem.id);

        if (!itemExists) {
            existingWishlist.push(newItem);
            localStorage.setItem("wishlist", JSON.stringify(existingWishlist));
            window.dispatchEvent(new Event("wishlistUpdated"));
            alert("Added to wishlist!");
        } else {
            alert("Already in wishlist.");
        }
    };

    return (
        <>
            <div className="mt-4 font-poppins">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-wrap -mx-4">
                        {/* Left side */}
                        <div className="w-full md:w-1/2 px-4 mb-8">
                            <div className="flex flex-col md:flex-row items-start justify-center p-6 gap-6">
                                <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible w-full md:w-auto">
                                    {product.images && product.images.length > 0 ? (
                                        product.images?.map((img, idx) => (
                                            <div
                                                key={idx}
                                                className={`min-w-[70px] md:w-[70px] md:h-[70px] border rounded-sm overflow-hidden cursor-pointer ${selected === idx ? "border-blue-500" : "border-gray-300"
                                                    }`}
                                                onClick={() => setSelected(idx)}
                                                aria-label={`Thumbnail ${idx + 1}`}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Thumbnail ${idx + 1}`}
                                                    width={70}
                                                    loading="eager"
                                                    fetchpriority="high"
                                                    decoding="async"
                                                    height={70}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <p>No images available</p>
                                    )}
                                </div>
                                <div className="relative flex-1 overflow-hidden group w-full max-w-md bg-transparent">
                                    <div
                                        className="w-full h-full"
                                        onMouseMove={handleMouseMove}
                                        onMouseLeave={handleMouseLeave}
                                        aria-label="Main Product"
                                    >
                                        {product.images && product.images.length > 0 ? (
                                            <img
                                                src={product?.images[selected]}
                                                alt="Main Product"
                                                width={900}
                                                loading="eager"
                                                fetchpriority="high"
                                                decoding="async"
                                                height={800}
                                                className={`w-full h-auto transition-transform duration-300 ease-in-out ${zoom ? "scale-150" : "scale-100"
                                                    }`}
                                                style={{ transformOrigin: `${origin.x} ${origin.y}` }}
                                            />
                                        ) : (
                                            <div>No image available</div>
                                        )}

                                        <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                            {product?.discount}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="w-full md:w-1/2 px-4 space-y-6">
                            <h1 className="text-2xl md:text-4xl font-bold text-gray-800 font-poppins">
                                {product?.product_name}
                            </h1>
                            <p className="text-green-600 text-md font-semibold">
                                {product?.single_price ? product?.single_price : ""} {product?.box_price ? `-${product?.box_price}` : ""} د.إ
                            </p>

                            {/* Dynamic Options Rendering */}
                            {availableOptions.map((option, index) => (
                                <div key={option.key} className="mb-2">
                                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1 block">
                                        {option.label}:
                                    </label>
                                    <select
                                        className="w-xs border border-gray-300 dark:border-gray-700 rounded p-1 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                        value={option.state}
                                        onChange={(e) => option.setState(e.target.value)}
                                    >
                                        <option value="">Choose an option</option>
                                        {(
                                            Array.isArray(product[option.key])
                                                ? product[option.key]
                                                : typeof product[option.key] === "string"
                                                    ? product[option.key].split(",").map(s => s.trim()).filter(Boolean)
                                                    : []
                                        ).map((item, i) => (
                                            <option key={i} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}

                            {/* Quantity + Cart */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center rounded-sm overflow-hidden ml-2 bg-gray-100">
                                    <button
                                        aria-label="Decrease Quantity"
                                        onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                                        className="px-3 py-1 text-lg font-bold cursor-pointer text-gray-600 hover:bg-gray-200"
                                    >
                                        -
                                    </button>
                                    <div className="px-4 py-1 bg-white text-center text-gray-800 font-semibold min-w-[40px]">
                                        {quantity}
                                    </div>
                                    <button
                                        aria-label="Increase Quantity"
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-3 py-1 text-lg font-bold cursor-pointer text-gray-600 hover:bg-gray-200"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    aria-label="Add to Cart"
                                    className="btn bgColor hover:bg-green-600 text-white"
                                    onClick={addToCart}
                                >
                                    Add to Cart
                                </button>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-gray-600">
                                <button
                                    aria-label="Add to Wishlist"
                                    className="flex items-center gap-2 hover:text-black"
                                    onClick={addToWishlist}
                                >
                                    <FaHeart className="w-4 h-4" /> Add to wishlist
                                </button>
                            </div>

                            <div className="text-sm text-gray-600 space-y-1">
                                <p>
                                    <span className="font-semibold">SKU:</span>{" "}
                                    {product?.sku || "N/A"}
                                </p>
                                <p>
                                    <span className="font-semibold">Category:</span>{" "}
                                    {product?.category_name}
                                </p>
                                <p>
                                    <span className="font-semibold">Tags:</span>{" "}
                                    {product?.tags ? (
                                        (Array.isArray(product.tags)
                                            ? product.tags
                                            : typeof product.tags === "string"
                                                ? product.tags.split(",").map(s => s.trim()).filter(Boolean)
                                                : []
                                        ).map((tag, idx) => (
                                            <span key={idx}>{tag}{idx !== (Array.isArray(product.tags) ? product.tags.length - 1 : (typeof product.tags === "string" ? product.tags.split(",").length - 1 : 0)) ? ", " : ""}</span>
                                        ))
                                    ) : "N/A"}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-gray-600 font-semibold">Share:</span>
                                <div className="flex gap-2 text-gray-500">
                                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://vapmarina.ae/shop/${product?.slug}`)}`} aria-label="Facebook">
                                        <FaFacebook />
                                    </a>
                                    <a href="#" aria-label="Twitter">
                                        <FaTwitter />
                                    </a>
                                    <a href="#" aria-label="Linkedin">
                                        <FaLinkedin />
                                    </a>
                                    <a href="#" aria-label="Whatsapp">
                                        <FaWhatsapp />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="container mx-auto px-4 pb-10">
                    <div className="max-w-7xl mx-auto">
                        {/* Tab Buttons */}
                        <div className="border-b border-gray-300 mb-6">
                            <div className="flex gap-4 flex-wrap justify-center">
                                {["Description", "Reviews", "Shipping Info"].map((tab) => (
                                    <button
                                        key={tab}
                                        aria-label={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 text-md font-semibold rounded-t-md transition-all duration-300 ${activeTab === tab
                                            ? "bg-green-600 text-white shadow-md"
                                            : "bg-gray-100 text-gray-600 hover:bg-white hover:text-black"
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <div className="bg-white p-4 rounded-md shadow-sm text-gray-700 text-sm transition-opacity duration-300">
                            {activeTab === "Description" && <div
                                className="text-gray-600 leading-relaxed font-poppins pl-3 sm:pl-4 py-2  prose prose-sm max-w-2xl text-sm sm:text-base"
                                dangerouslySetInnerHTML={{ __html: product?.description }}
                                style={{
                                    '--tw-prose-headings': 'rgb(55 65 81)',
                                    '--tw-prose-body': 'rgb(75 85 99)',
                                    '--tw-prose-bold': 'rgb(31 41 55)',
                                    '--tw-prose-links': 'rgb(59 130 246)'
                                }}
                            />}
                            {activeTab === "Reviews" && (product?.review ? <div
                                className="text-gray-600 leading-relaxed   pl-3 sm:pl-4 py-2  prose prose-sm max-w-2xl text-sm sm:text-base"
                                dangerouslySetInnerHTML={{ __html: product?.review }}
                                style={{
                                    '--tw-prose-headings': 'rgb(55 65 81)',
                                    '--tw-prose-body': 'rgb(75 85 99)',
                                    '--tw-prose-bold': 'rgb(31 41 55)',
                                    '--tw-prose-links': 'rgb(59 130 246)'
                                }}
                            />

                                :
                                <p>No reviews yet. Be the first to review this product!</p>
                            )}

                            {activeTab === "Shipping Info" && (
                                <p>
                                    Delivery is provided within 2 hours in Dubai, Sharjah and Ajman. In addition, fast delivery is provided in other cities in the UAE.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className=" container mx-auto px-5 py-4">
                    <h1
                        className="text-3xl text-black text-center px-3 my-6 font-bold  py-8
"
                    >
                        We found other products you might like!
                    </h1>
                    <div>
                        {" "}
                        {relatedProducts?.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-8 auto-rows-fr">
                                {relatedProducts?.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <CartDrawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} />
            </div>
        </>
    );
};

export default ProductDetailsClient;
