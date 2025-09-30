"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// inside your component

// Drawer Close Handler

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const router = useRouter();

  //   useEffect(() => {
  //     if (router.pathname === "/cart") {
  //       //   setDrawerOpen(false); // or however you control the drawer
  //     }
  //   }, []);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cart")) || [];
    if (items.length === 0) {
      router.push("/");
    }
    else {
      setCartItems(items);
    }

  }, []);

  const updateQuantity = (index, amount) => {
    const updatedItems = [...cartItems];
    updatedItems[index].quantity += amount;
    if (updatedItems[index].quantity < 1) updatedItems[index].quantity = 1;
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (index) => {
    const updatedItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedItems);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const subtotal = cartItems?.reduce(
    (total, item) => total + (item.selectedOffer?.toLowerCase().includes("box") ? item.box_price : item.single_price) * item.quantity,
    0
  );

  return (
    <div className="max-w-7xl mx-auto p-4 mt-16 dark:bg-gray-950 dark:text-gray-100">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2">
          {/* Desktop view (hidden on mobile) */}
          <div className="hidden md:grid grid-cols-12 font-bold text-gray-700 border-b border-stone-300 pb-2 mb-4 text-sm uppercase dark:text-gray-200 dark:border-stone-700">
            <div className="col-span-6 text-center">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-center">Subtotal</div>
          </div>

          {/* Cart Products */}
          <div className="space-y-4">
            {cartItems?.map((item, index) => (
              <div key={index} className="border-b border-stone-300 py-4 dark:border-stone-700">
                {/* Desktop Grid View */}
                <div className="hidden md:grid grid-cols-12 items-center gap-2">
                  {/* Product Info */}
                  <div className="col-span-6 flex items-center gap-4">
                    <button
                      aria-label="Remove Item"
                      onClick={() => removeItem(index)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm dark:bg-red-900 dark:text-red-400 dark:hover:bg-red-700 dark:hover:text-white"
                    >
                      ✕
                    </button>
                    <img
                      aria-label="Product Image"
                      src={item.images[0]}
                      alt={item.product_name}
                      loading="eager"
                      fetchpriority="high"
                      decoding="async"
                      className="w-16 h-16 object-contain"
                    />
                    <div>
                      <p className="font-semibold dark:text-gray-100">{item.product_name}</p>
                      {
                        item.selectedFlavor && (
                          <p className="text-sm text-gray-500 dark:text-gray-300">
                            Flavors: {item.selectedFlavor}
                          </p>
                        )
                      }
                      {
                        item.selectedOffer && (
                          <p className="text-sm text-gray-500 dark:text-gray-300">
                            Offers: {item.selectedOffer}
                          </p>
                        )
                      }
                      {
                        item.selectedColor && (
                          <p className="text-sm text-gray-500 dark:text-gray-300">
                            Color: {item.selectedColor}
                          </p>
                        )
                      }
                      {
                        item.selectedNicotine && (
                          <p className="text-sm text-gray-500 dark:text-gray-300">
                            Nicotine: {item.selectedNicotine}
                          </p>
                        )
                      }

                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-2 text-center text-gray-600 dark:text-gray-200">
                    {item.selectedOffer?.toLowerCase().includes("box") ? item.box_price : item.single_price} د.إ
                  </div>

                  {/* Quantity */}
                  <div className="col-span-2 flex justify-center">
                    <div className="flex items-center   rounded-sm overflow-hidden ml-2 bg-gray-100 dark:bg-gray-800">
                      <button
                        aria-label="Decrease Quantity"
                        onClick={() => updateQuantity(index, -1)}
                        className="px-3 py-1 text-lg font-bold bgColor cursor-pointer text-gray-600 hover:bg-gray-200 transition dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        -
                      </button>
                      <div className="px-4 py-1 bg-white text-center text-gray-800 font-semibold min-w-[40px] dark:bg-gray-900 dark:text-gray-100">
                        {item.quantity}
                      </div>
                      <button
                        aria-label="Increase Quantity"
                        onClick={() => updateQuantity(index, 1)}
                        className="px-3 py-1 text-lg font-bold bgColor cursor-pointer text-gray-600 hover:bg-gray-200 transition dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="col-span-2 text-center text-green-600 font-semibold dark:text-green-400">
                    {item.selectedOffer?.toLowerCase().includes("box") ? item.box_price * item.quantity : item.single_price * item.quantity} د.إ
                  </div>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden flex gap-4">
                  <img
                    aria-label="Product Image"
                    src={item.images[0]}
                    alt={item.product_name}
                    loading="eager"
                    fetchpriority="high"
                    decoding="async"
                    className="w-20 h-20 object-contain"
                  />
                  <div className="flex-1 space-y-3 relative">
                    {/* Remove Button */}
                    <button
                      aria-label="Remove Item"
                      onClick={() => removeItem(index)}
                      className="absolute top-0 right-0 w-8 h-8 rounded-full bg-red-100 text-red-600 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm dark:bg-red-900 dark:text-red-400 dark:hover:bg-red-700 dark:hover:text-white"
                    >
                      ✕
                    </button>

                    {/* Product Name */}
                    <p className="font-semibold text-gray-800 dark:text-gray-100">{item.product_name}</p>

                    {/* Flavors and Offers */}
                    <div className="space-y-1">
                      {
                        item.selectedFlavor && (
                          <p className="text-sm text-gray-500 dark:text-gray-300">
                            Flavors: {item.selectedFlavor}
                          </p>
                        )
                      }
                      {
                        item.selectedOffer && (
                          <p className="text-sm text-gray-500 dark:text-gray-300">
                            Offers: {item.selectedOffer}
                          </p>
                        )
                      }
                      {
                        item.selectedColor && (
                          <p className="text-sm text-gray-500 dark:text-gray-300">
                            Color: {item.selectedColor}
                          </p>
                        )
                      }
                      {
                        item.selectedNicotine && (
                          <p className="text-sm text-gray-500 dark:text-gray-300">
                            Nicotine: {item.selectedNicotine}
                          </p>
                        )
                      }
                    </div>

                    {/* Price Section */}
                    <div className="flex items-center text-sm text-gray-600 border-b border-gray-300 pb-2 dark:text-gray-200 dark:border-gray-700">
                      <span className="w-20">Price:</span>
                      <span className="ml-2">{item.selectedOffer?.toLowerCase().includes("box") ? item.box_price : item.single_price} د.إ</span>
                    </div>

                    {/* Quantity Section */}
                    <div className="flex items-center text-sm text-gray-600 border-b border-gray-300 pb-2 dark:text-gray-200 dark:border-gray-700">
                      <span className="w-20">Quantity:</span>
                      <div className="flex items-center rounded overflow-hidden ml-2 bg-gray-100 dark:bg-gray-800">
                        <button
                          aria-label="Decrease Quantity"
                          onClick={() => updateQuantity(index, -1)}
                          className="px-3 py-1 text-lg font-bold text-gray-600 bgColor cursor-pointer hover:bg-gray-200 transition dark:text-gray-200 dark:hover:bg-gray-700"
                        >
                          -
                        </button>
                        <div className="px-4 py-1 bg-white text-center text-gray-800 font-semibold min-w-[40px] dark:bg-gray-900 dark:text-gray-100">
                          {item.quantity}
                        </div>
                        <button
                          aria-label="Increase Quantity"
                          onClick={() => updateQuantity(index, 1)}
                          className="px-3 py-1 text-lg font-bold text-gray-600 bgColor cursor-pointer hover:bg-gray-200 transition dark:text-gray-200 dark:hover:bg-gray-700"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Subtotal Section */}
                    <div className="flex items-center text-sm font-bold text-green-600 border-gray-300 pb-2 dark:text-green-400 dark:border-gray-700">
                      <span className="w-20">Subtotal:</span>
                      <span className="ml-2">
                        {item.selectedOffer?.toLowerCase().includes("box") ? item.box_price * item.quantity : item.single_price * item.quantity} د.إ
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Totals */}
        <div className="border border-stone-300 p-6 rounded shadow-xl h-fit sticky top-6 dark:border-stone-700 dark:bg-gray-900">
          <h2 className="text-xl font-bold mb-6 dark:text-gray-100">CART TOTALS</h2>
          <div className="flex justify-between mb-2">
            <p className="text-gray-600 dark:text-gray-200">Subtotal</p>
            <p className="text-gray-800 dark:text-gray-100">{subtotal} د.إ</p>
          </div>
          <div className="flex justify-between mb-6">
            <p className="text-gray-600 dark:text-gray-200">Shipping</p>
            <p className="text-green-600 cursor-pointer hover:underline dark:text-green-400">
              Calculate shipping
            </p>
          </div>
          <div className="flex justify-between text-lg font-bold mb-6">
            <p className="dark:text-gray-100">Total</p>
            <p className="text-green-600 dark:text-green-400">{subtotal} د.إ</p>
          </div>
          <Link href="/checkout" aria-label="Proceed to Checkout">
            <button aria-label="Proceed to Checkout" className="btn w-full bgColor text-white ">
              PROCEED TO CHECKOUT
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
