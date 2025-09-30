"use client";
// import Image from "next/image";
import { useState } from "react";
import {
  FaCheck,
  FaHeart,
  FaSearch,
  FaShoppingCart,
  FaTrash,
} from "react-icons/fa";
import CartDrawer from "./CartDrawer";
import Link from "next/link";

const ProductCard = ({ product, showHeart = true }) => {
  // console.log("product", product);
  const [showOptions, setShowOptions] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [flavor, setFlavor] = useState("");
  const [offer, setOffer] = useState("");
  const [color, setColor] = useState("");
  const [nicotine, setNicotine] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

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
    { key: 'offers', label: 'Offer', state: offer, setState: setOffer },
    { key: 'colors', label: 'Colors', state: color, setState: setColor },
    { key: 'nicotines', label: 'Nicotines', state: nicotine, setState: setNicotine }
  ].filter(option => hasOption(option.key));

  const handleActionClick = () => {
    // First time clicking: show options panel if there are options available
    if (!showOptions && !addedToCart && availableOptions.length > 0) {
      setShowOptions(true);
      return;
    }

    // If no options available, add directly to cart
    if (availableOptions.length === 0) {
      const productToAdd = {
        ...product,
        quantity: 1,
      };
      addToCartDirectly(productToAdd);
      return;
    }

    // Check if all available options are selected
    const unselectedOptions = availableOptions.filter(option => !option.state);

    if (unselectedOptions.length > 0) {
      alert(`Please select: ${unselectedOptions.map(opt => opt.label).join(', ')}`);
      setShowOptions(true);
      return;
    }

    const productToAdd = {
      ...product,
      selectedFlavor: flavor,
      selectedOffer: offer,
      selectedColor: color,
      selectedNicotine: nicotine,
      quantity: 1,
    };

    addToCartDirectly(productToAdd);
  };

  const addToCartDirectly = (productToAdd) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    let existingIndex = -1;

    if (availableOptions.length === 0) {
      // If no options available, just match by product ID
      existingIndex = existingCart.findIndex(item => item.id === product.id);
    } else {
      // If options available, match by ID and selected options
      existingIndex = existingCart.findIndex(
        (item) => {
          if (item.id !== product.id) return false;

          // Check each available option
          return availableOptions.every(option => {
            const optionKey = option.key;
            const selectedKey = `selected${optionKey.charAt(0).toUpperCase() + optionKey.slice(1, -1)}`;

            if (optionKey === 'flavors') return item.selectedFlavor === flavor;
            if (optionKey === 'offers') return item.selectedOffer === offer;
            if (optionKey === 'colors') return item.selectedColor === color;
            if (optionKey === 'nicotines') return item.selectedNicotine === nicotine;

            return true;
          });
        }
      );
    }

    if (existingIndex !== -1) {
      existingCart[existingIndex].quantity += 1;
    } else {
      existingCart.push(productToAdd);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    setIsClicked(false);
    window.dispatchEvent(new Event("cartUpdated"));
    setShowDrawer(true);
    setAddedToCart(false);
    setShowOptions(false);
    setFlavor("");
    setOffer("");
    setColor("");
    setNicotine("");
  };

  const handleCloseOptions = () => {
    setShowOptions(false);
    setFlavor("");
    setOffer("");
    setColor("");
    setNicotine("");
  };

  const addToWishlist = (product) => {
    const existingWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    const isAlreadyInWishlist = existingWishlist.some(
      (item) => item.id === product.id
    );

    if (!isAlreadyInWishlist) {
      const updatedWishlist = [...existingWishlist, product];
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      //console.log("Added to wishlist!");
      window.dispatchEvent(new Event("wishlistUpdated"));
      setIsWishlisted(true);
    } else {
      setIsWishlisted(true);
      //console.log("Already in wishlist");
    }
  };
  // console.log("product in card", product);
  return (
    <div className="w-full h-full">
      <div className="group relative w-full h-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-xl transition duration-300 cursor-pointer flex flex-col">
        {/* Product Image */}
        <div className="relative overflow-hidden h-40 sm:h-48 md:h-72 flex-shrink-0">
          <Link href={`/shop/${product.slug}`} aria-label={`view of ${product?.product_name}`}>
            <div className="relative w-full h-full overflow-hidden">
              {/* Default Image */}
              <div className="absolute inset-0 transition-opacity duration-300 opacity-100 group-hover:opacity-0 text-center">
                {product?.images?.[0] && (
                  <img
                    src={product.images[0]}
                    aria-label={`${product?.product_name} in Dubai - Vape Marina`}
                    alt={`${product?.product_name} in Dubai - Vape Marina`}
                    loading="eager"
                    fetchpriority="high"
                    decoding="async"
                    className="object-cover text-center"
                  />
                )}
              </div>

              {/* Hover Image with scale effect */}
              <div className="absolute inset-0 text-center transition-transform transform duration-800 group-hover:scale-105 transition-opacity opacity-0 group-hover:opacity-100">
                {product?.images?.[1] && (
                  <img
                    src={product.images[1]}
                    aria-label={`${product?.product_name} in Dubai - Vape Marina`}
                    alt={`${product?.product_name} in Dubai - Vape Marina`}
                    loading="eager"
                    fetchpriority="high"
                    decoding="async"
                    className="object-cover text-center"
                  />
                )}
              </div>
            </div>

            {/* Discount Badge */}
            <div
              className="absolute top-2 left-2 bgColor dark:bg-sky-900 text-white text-xs font-bold rounded-full shadow z-10 flex items-center justify-center"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                fontSize: "0.65rem",
              }}
              aria-hidden="true"
            >
              {product?.discount}%
            </div>
          </Link>

          {/* Hover Icons */}
          <div className="absolute bgColor dark:bg-sky-900 px-2 py-3 top-2 right-2 flex flex-col gap-4 md:gap-6 z-10 opacity-100 group-hover:opacity-0 md:opacity-0 md:group-hover:opacity-100">
            <Link href={`/shop/${product.slug}`} aria-label={`Quick view of ${product?.product_name}`}>
              <div
                className="tooltip tooltip-left cursor-pointer transition-transform duration-200 hover:scale-110 hover:text-yellow-300 dark:hover:text-yellow-200"
                data-tip="Quick View"
              >
                <FaSearch size={14} className="text-white drop-shadow-sm" />
              </div>
            </Link>
            {showHeart && (
              <button
                className="tooltip tooltip-left cursor-pointer transition-transform duration-200 hover:scale-110 hover:text-pink-300 dark:hover:text-pink-200"
                data-tip="Add to wishlist"
                aria-label={`Add ${product?.product_name} to wishlist`}
                onClick={() => addToWishlist(product)}
              >
                {isWishlisted ? (
                  <FaCheck size={14} className="text-white drop-shadow-sm" />
                ) : (
                  <FaHeart size={14} className="text-white drop-shadow-sm" />
                )}
              </button>
            )}
          </div>

          {/* Option Selector Panel */}
          {showOptions && (
            <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 z-20 p-3 flex flex-col justify-start animate-fade-in">
              <div className="flex justify-end mb-1">
                <button
                  onClick={handleCloseOptions}
                  className="text-gray-700 dark:text-gray-200 font-bold text-xs"
                  aria-label="Close options panel"
                >
                  ✕ Close
                </button>
              </div>

              {/* Dynamically render available options */}
              {availableOptions.map((option, index) => (
                <div key={option.key} className="mb-2">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1 block">
                    {option.label}:
                  </label>
                  <select
                    className="w-full border border-gray-300 dark:border-gray-700 rounded p-1 text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    value={option.state}
                    onChange={(e) => option.setState(e.target.value)}
                    aria-label={`Select ${option.label}`}
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
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col items-center p-2 md:p-4 text-center min-h-[100px]">
          <Link href={`/shop/${product.slug}`} aria-label={`View details for ${product?.product_name}`}>
            <h3 className="text-xs md:text-sm font-semibold text-gray-800 dark:text-gray-100 leading-snug line-clamp-2">
              {product?.product_name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1 md:line-clamp-2">
              {product?.category_name}
            </p>
          </Link>
          <div className="mt-1 md:mt-2 font-bold text-gray-800 dark:text-gray-100 text-xs md:text-base">
            {product?.single_price ? product?.single_price : ""} {product?.box_price ? `-${product?.box_price}` : ""} د.إ
          </div>

          {/* Add to Cart Button */}
          <div className="mt-auto w-full">
            <button
              className="w-full bgColor dark:bg-sky-900 hover:bg-green-700 dark:hover:bg-green-800 text-white text-xs md:text-sm font-semibold py-1 md:py-2 rounded-lg transition duration-200 shadow-sm hover:shadow-md group relative"
              onClick={() => {
                setIsClicked(true);
                handleActionClick();
              }}
              aria-label={`Add ${product?.product_name} to cart`}
            >
              {/* Default Text (hide on hover unless clicked) */}
              <span
                className={`transition-opacity duration-200 ${isClicked ? "opacity-100" : "group-hover:opacity-0"
                  }`}
              >
                {isClicked
                  ? "ADD TO CART"
                  : addedToCart
                    ? "SELECT OPTIONS"
                    : showOptions
                      ? "ADD TO CART"
                      : availableOptions.length > 0
                        ? "SELECT OPTIONS"
                        : "ADD TO CART"}
              </span>

              {/* Cart Icon (only show on hover and not after click) */}
              {!isClicked && (
                <span className="absolute inset-0 flex items-center justify-center transition-all duration-600 ease-out opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
                  <FaShoppingCart size={14} className="md:text-base" />
                </span>
              )}
            </button>
          </div>
        </div>

        <CartDrawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} />
      </div>
    </div>
  );
};

export default ProductCard;