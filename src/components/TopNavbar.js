import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTelegramPlane } from "react-icons/fa";

const TopNavbar = () => {
  return (
    <div className="bgColor py-3 text-white dark:bg-sky-900 dark:text-gray-100">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <h2 className="text-sm sm:text-base">
          Delivery is provided within 2 hours in Dubai, Sharjah and Ajman
        </h2>
        <div className="flex gap-4 text-white text-xl dark:text-gray-100">
          <Link
            href="https://www.facebook.com/people/Vape-Marina/61578896596480/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black dark:hover:text-white"
            aria-label="Facebook"
          >
            <FaFacebookF />
          </Link>
          <Link
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black dark:hover:text-white"
            aria-label="Instagram"
          >
            <FaInstagram />
          </Link>
          <Link
            href="https://telegram.org"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black dark:hover:text-white"
            aria-label="Telegram"
          >
            <FaTelegramPlane />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
