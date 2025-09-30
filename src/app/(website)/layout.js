"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { FaWhatsapp } from 'react-icons/fa';
import UserDashboard from "./userdashboard/page";
import SessionClientProvider from "@/components/SessionClientProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackToTop from "@/components/BackToTop";
export default function Layout({ children }) {
  return (
    <SessionClientProvider>
      <div>
        <a
          href="https://wa.me/+971567404217"
          className="float"
          target="_blank"
          aria-label="Chat with us on WhatsApp"
          rel="noopener noreferrer"
        >
          <FaWhatsapp className="my-float" />
        </a>
        <BackToTop />
        <div className="lg:fixed top-0 w-full z-50">
          <Navbar />
        </div>
        <div className="lg:pt-[180px] min-h-screen">{children}</div>
        <Footer />
        <ToastContainer />
      </div>
    </SessionClientProvider>
  );
}
