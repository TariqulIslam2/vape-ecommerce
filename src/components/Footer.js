"use client";
import Link from "next/link";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { useSession } from "next-auth/react";

const Footer = () => {
  const { data: session } = useSession();
  return (
    <div>
      <footer className="footer sm:footer-horizontal bg-black dark:bg-gray-900 text-neutral-content dark:text-gray-200 p-10 flex flex-col sm:flex-row sm:justify-around sm:items-start gap-8">
        {/* Contact Info */}
        <nav>
          <p className="text-white dark:text-gray-100 text-xl font-bold mb-4">
            OUR CONTACT INFORMATION
          </p>
          <p className="flex items-start gap-2 mb-2">
            <FaMapMarkerAlt className="mt-1" />
            China A12 - International City China Cluster - Dubai - United Arab
            Emirates
          </p>
          <p className="flex items-center gap-2 mb-2">
            <FaPhoneAlt />
            Phone: +971567404217
          </p>
          <p className="flex items-center gap-2">
            <FaEnvelope />
            Gmail: vapemarina25@gmail.com
          </p>
        </nav>

        {/* Useful Links */}
        <nav>
          <h1 className="text-white dark:text-gray-100 text-xl font-bold mb-4">USEFUL LINKS</h1>
          <p className="font-semibold mb-2">
            Vape Marina  – Best Online Vape Shop in Dubai UAE!
          </p>
          <Link href="/about" className="link link-hover" aria-label="About Us">
            About us
          </Link>
          <Link href="/contact" className="link link-hover" aria-label="Contact Us">
            Contact Us
          </Link>
          <Link href="/cart" className="link link-hover" aria-label="Cart">
            Cart
          </Link>
          <Link href="/faq" className="link link-hover" aria-label="FAQ">
            FAQ
          </Link>
          <Link href="/shop" className="link link-hover" aria-label="Shop">
            Shop
          </Link>
          <Link href="/policy" className="link link-hover" aria-label="Policy">
            Policy
          </Link>
          <Link href="/term" className="link link-hover" aria-label="Terms">
            Terms
          </Link>
          <Link href="/blog" className="link link-hover" aria-label="Blog">
            Blog
          </Link>
          {session && (
            <Link href="/userdashboard" className="link link-hover" aria-label="My Orders">
              My Orders
            </Link>
          )}
        </nav>

        {/* Featured Categories */}
        <nav>
          <h2 className="text-white dark:text-gray-100 text-xl font-bold mb-4">
            FEATURED CATEGORIES

          </h2>
          <Link href="/myle" className="link link-hover" aria-label="MYLE">MYLE</Link>
          <Link href="/disposable" className="link link-hover" aria-label="Disposable Vape">Disposable Vape</Link>
          <Link href="/e-juice" className="link link-hover" aria-label="E-Juice">E-Juice</Link>
          <Link href="/nicotine-pouches" className="link link-hover" aria-label="Nicotine Pouches">Nicotine Pouches</Link>
          <Link href="/iqos-iluma" className="link link-hover" aria-label="IQOS Iluma">IQOS Iluma</Link>
          <Link href="/heets-and-terea" className="link link-hover" aria-label="Heets & Terea">Heets & Terea</Link>
          <Link href="/juul" className="link link-hover" aria-label="Juul & Pods System">Juul & Pods System</Link>
          <Link href="/vape-kits" className="link link-hover" aria-label="Vape Kits">Vape Kits</Link>

        </nav>
      </footer>

      {/* Bottom Bar */}
      <div className="text-center bg-black dark:bg-gray-900 text-sm py-4 border-t border-gray-700 dark:border-gray-800">
        <p className="text-white dark:text-gray-200">
          2025 © Copyright by{" "}
          <span className="text-blue-400 dark:text-blue-300"> Vape Marina </span>
        </p>
      </div>
    </div>
  );
};

export default Footer;
