"use client";
import TopNavbar from "./TopNavbar";
import {
  FaBars,
  FaCartArrowDown,
  FaHeart,
  FaSearch,
  FaShoppingCart,
  FaUser,
} from "react-icons/fa";
import Link from "next/link";
import MobileNavbar from "./MobileNavbar";
import CartDrawer from "./CartDrawer";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { HeartIcon, ShoppingCartIcon, UserIcon } from "lucide-react";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const pathname = usePathname();

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSession();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };


  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const totalCount = cart?.reduce(
        (sum, item) => sum + (item.quantity || 1),
        0
      );
      const totalWishlistCount = wishlist?.reduce((sum, item) => sum + 1, 0);
      setCartCount(totalCount);
      setWishlistCount(totalWishlistCount);
    };

    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("wishlistUpdated", updateCartCount);
    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("wishlistUpdated", updateCartCount);
    };
  }, []);
  return (
    <div>
      <TopNavbar />
      <div className="sticky top-0 z-100 shadow-sm dark:bg-gray-950">
        {/* Top Navbar */}
        <div className="bg-stone-50 dark:bg-gray-900 py-3">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
            {/* Left: Logo */}
            <div className="w-full md:w-1/3 text-center md:text-left mb-2 md:mb-0">
              <h5 className="hidden md:block">
                <Image
                  src="/Vape-Marina-1.png" // Replace with your actual image path inside /public folder
                  alt="Vape marina Logo"
                  width={90} // Adjust width as needed
                  height={30} // Adjust height as needed
                  priority // Critical for LCP optimization
                  fetchPriority="high" // Resource hint // Optional: ensures image loads quickly for navbar
                />
              </h5>
            </div>

            {/* Middle: Search */}
            <div className="w-full md:w-1/3 flex justify-center mb-2 md:mb-0">
              <form className="w-full max-w-lg pb-3" onSubmit={handleSearch}>
                <div className="relative w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search your product"
                    className="w-full p-2 pr-10 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none bg-white dark:bg-gray-800 text-black dark:text-gray-100"
                  />
                  <button
                    type="submit"
                    aria-label="Search"
                    className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300"
                  >
                    <FaSearch className="text-gray-400 dark:text-gray-200" />
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Icons */}
            <div className="w-full md:w-1/3 flex justify-center md:justify-end">
              <ul className="flex items-center space-x-5 text-black dark:text-gray-100 text-lg">
                <li>
                  <Link
                    href="#"
                    onClick={() => {
                      pathname.includes("cart") ? "" : setShowDrawer(true);
                    }}
                    aria-label="Cart"
                  >
                    <div className="indicator">
                      <span className="indicator-item badge badge-sm bgColor dark:bg-sky-900 dark:text-gray-100">
                        {cartCount}
                      </span>
                      <ShoppingCartIcon className="text-3xl hover:scale-110 transition-all duration-300 hover:bg-gray-200 rounded-full p-1" />
                    </div>
                  </Link>
                </li>
                <li>
                  <Link href="/wishlist" aria-label="Wishlist">
                    <div className="indicator">
                      <span className="indicator-item badge badge-sm bgColor dark:bg-sky-900 dark:text-gray-100">
                        {wishlistCount}
                      </span>
                      <HeartIcon className="text-3xl hover:scale-110 transition-all duration-300 hover:bg-gray-200 rounded-full p-1" />
                    </div>
                  </Link>
                </li>
                {!session && (
                  <li>
                    <Link href="/dashboard" aria-label="Dashboard">
                      <div className="indicator">
                        <UserIcon className="text-3xl hover:scale-110 transition-all duration-300 hover:bg-gray-200 rounded-full p-1" />
                      </div>
                    </Link>
                    {/* dropdown... */}
                  </li>
                )}
                {session && (
                  <li>
                    <Link href="/userdashboard" aria-label="My Orders" className="btn bgColor px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition">
                      My Orders
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
        <CartDrawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} />
        {/* Main Navbar */}
        <MobileNavbar />
      </div>
    </div>
  );
};

export default Navbar;
