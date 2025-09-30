"use client";
import Link from "next/link";
import { useState } from "react";
import { FaBars } from "react-icons/fa";
import { usePathname } from "next/navigation";
import Image from "next/image";

const MobileNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Debug: Log the current pathname
  // console.log("Current pathname:", pathname);


  const routes = {
    Home: "/",
    Shop: "/shop/",
    Myle: "/myle/",
    "Disposable Vape": "/disposable/",
    "E-Juice": "/e-juice/",
    "Nicotine Pouches": "/nicotine-pouches/",
    "IQOS Iluma": "/iqos-iluma/",
    "Heets & Terea": "/heets-and-terea/",
    "Juul & Pods System": "/juul/",
    "Vape Kits": "/vape-kits/"
  };



  const menuItems = [
    "Home",
    "Shop",
    "Disposable Vape",
    "E-Juice",
    "Myle",
    "Nicotine Pouches",
    "IQOS Iluma",
    "Heets & Terea",
    "Juul & Pods System",
    "Vape Kits"
  ];

  return (
    <div>
      <nav className="bg-stone-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center py-2">
            {/* Logo */}
            <Link href="/" className="flex items-center" aria-label="Home">

              <div className="md:hidden font-bold text-black">
                <div className="flex items-center gap-2 flex-row">
                  <Image
                    src="/Vape-Marina-2.png"
                    alt="Vape Marina Logo"
                    width={50}
                    height={50}
                    className="object-contain"
                    priority // Critical for LCP optimization
                    fetchPriority="high" // Resource hint

                  />
                  <span> Vape Marina</span>
                </div>





              </div>
            </Link>
            {/* Hamburger menu */}
            <button
              className="md:hidden text-black"
              aria-label="Toggle menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <FaBars />
            </button>

            {/* Menu Items */}
            <ul
              className={`w-full md:flex justify-center md:items-center md:space-x-1 ${menuOpen ? "" : "hidden"
                }`}
            >
              {menuItems.map((item) => {
                const isActive = pathname === routes[item] || pathname.startsWith(routes[item] + '/');

                return (
                  <li key={item}>
                    <Link
                      href={routes[item] || "#"}
                      aria-label={item}
                      className={`block w-full py-2 px-4 md:w-auto transition duration-200 ${isActive ? "bgColor hover:bgColor" : "text-black hover:bgColor"}`}
                      onClick={() => setMenuOpen(false)} // close menu on link click (optional)

                    >
                      {item}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default MobileNavbar;
