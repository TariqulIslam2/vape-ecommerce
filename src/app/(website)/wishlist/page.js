"use client";

import { useEffect, useState } from "react";
import CartDrawer from "@/components/CartDrawer";
import ProductCard from "@/components/ProductCard";
import { FaHeart, FaTrash } from "react-icons/fa";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Load wishlist from localStorage when page loads
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);
  }, []);

  const handleRemoveFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter((item) => item.id !== productId);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  return (
    <div className="min-h-screen bg-stone-100 p-6 pt-8 dark:bg-gray-900 dark:text-gray-100">
      <div className="mx-auto mt-10">
        <h1 className="text-3xl font-bold text-center mb-10 text-gray-800 dark:text-gray-100">
          ❤️ Your Wishlist
        </h1>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-8 auto-rows-fr">
            {wishlist.map((item) => (
              <div key={item.id} className="relative">
                <ProductCard product={item} showHeart={false} />

                {/* Updated Remove Button with Icon */}
                <button
                  onClick={() => handleRemoveFromWishlist(item.id)}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-900 p-2 rounded-full shadow-md transition transform hover:scale-110 z-10 border border-white dark:border-gray-800"
                  aria-label="Remove from wishlist"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center mt-20">
            <FaHeart className="text-6xl text-gray-400 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">Your wishlist is empty 💤</p>
          </div>
        )}
      </div>

      {/* Cart Drawer */}
      <CartDrawer />
    </div>
  );
};

export default WishlistPage;
