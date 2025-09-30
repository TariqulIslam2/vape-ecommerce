"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";

const CartDrawer = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    // Cleanup in case component unmounts while open
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(storedCart);
      calculateSubtotal(storedCart);
    }
  }, [isOpen]);

  const calculateSubtotal = (items) => {
    const total = items?.reduce((sum, item) => {
      return sum + (item.selectedOffer?.toLowerCase().includes("box") ? item.box_price : item.single_price) * (item.quantity || 1);
    }, 0);
    setSubtotal(total);
  };

  const handleDelete = (indexToRemove) => {
    const updatedCart = cartItems.filter((_, i) => i !== indexToRemove);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateSubtotal(updatedCart);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  if (!isOpen) return null;

  return (
    <div className="drawer drawer-end z-50 fixed inset-0 font-sans">
      {/* BACKDROP */}
      <div
        className="drawer-overlay fixed inset-0 bg-stone-900 opacity-75"
        onClick={onClose}
      ></div>

      {/* DRAWER PANEL */}
      <div className="w-96 bg-base-100 h-full fixed right-0 top-0 shadow-2xl  flex flex-col transition-transform duration-300">
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-base-300">
          <h2 className="text-xl font-bold tracking-wide text-gray-800">
            🛒 Your Cart
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 text-2xl transition"
          >
            &times;
          </button>
        </div>

        {/* CART ITEMS */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {cartItems?.length > 0 ? (
            cartItems?.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-3 bg-base-200 rounded-lg shadow-sm"
              >
                <img
                  aria-label="Product Image"
                  src={item?.images[0] || "/placeholder.webp"}
                  alt={item?.product_name}
                  loading="eager"
                  fetchpriority="high"
                  decoding="async"
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-semibold">{item.product_name
                    }</h3>
                    <button
                      aria-label="Remove item"
                      onClick={() => handleDelete(index)}
                      className="text-red-500 hover:text-red-700 transition text-sm"
                      title="Remove item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  {
                    item.selectedFlavor && (
                      <p className="text-sm text-gray-500">
                        Flavor:{" "}
                        <span className="font-medium">{item.selectedFlavor}</span>
                      </p>
                    )
                  }
                  {
                    item.selectedOffer && (
                      <p className="text-sm text-gray-500">
                        Offer:{" "}
                        <span className="font-medium">{item.selectedOffer}</span>
                      </p>
                    )
                  }
                  {
                    item.selectedColor && (
                      <p className="text-sm text-gray-500">
                        Color:{" "}
                        <span className="font-medium">{item.selectedColor}</span>
                      </p>
                    )
                  }

                  {
                    item.selectedNicotine && (
                      <p className="text-sm text-gray-500">
                        Nicotine:{" "}
                        <span className="font-medium">{item.selectedNicotine}</span>
                      </p>
                    )
                  }

                  <p className="text-sm font-semibold text-gray-700 mt-1">
                    {item.quantity || 1} × {item.selectedOffer?.toLowerCase().includes("box") ? item.box_price : item.single_price} د.إ
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-20 text-base">
              Your cart is empty 💤
            </div>
          )}
        </div>

        {/* SUBTOTAL + ACTION BUTTONS */}
        <div className="border-t border-base-300 px-5 py-4 space-y-4">
          <div className="flex justify-between text-lg font-semibold text-gray-800">
            <span>Subtotal:</span>
            <span>{subtotal.toFixed(2)} د.إ</span>
          </div>
          {
            cartItems?.length > 0 && (
              <Link href="/cart" aria-label="View Cart">
                <button aria-label="View Cart" className="btn btn-outline w-full mb-3" onClick={onClose}>
                  View Cart
                </button>
              </Link>
            )
          }
          {
            cartItems?.length > 0 && (
              <Link href="/checkout" aria-label="Checkout">
                {" "}
                <button aria-label="Checkout" className="btn bgColor w-full" onClick={onClose}>
                  Checkout
                </button>
              </Link>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
