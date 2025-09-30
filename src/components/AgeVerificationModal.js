"use client";
import { useEffect, useState } from "react";

const AgeVerificationModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Hide mobile navigation if exists
    const mobileNav = document.querySelector('.mobile-nav');
    if (mobileNav) mobileNav.style.display = 'none';

    // Prevent scrolling
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const isVerified = localStorage.getItem("ageVerified");
    if (!isVerified) {
      setTimeout(() => {
        setShowModal(true);
      }, 300);
    } else {
      // Restore mobile nav if verified
      if (mobileNav) mobileNav.style.display = '';
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
    }
  }, []);

  const handleClose = () => {
    setFadeOut(true);
    localStorage.setItem("ageVerified", "true");

    // Restore mobile nav
    const mobileNav = document.querySelector('.mobile-nav');
    if (mobileNav) mobileNav.style.display = '';

    // Restore scrolling
    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";

    setTimeout(() => {
      setShowModal(false);
    }, 300);
  };

  const handleNo = () => {
    setFadeOut(true);
    setTimeout(() => {
      window.location.href = "https://www.google.com";
    }, 300);
  };

  if (!showModal) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-300 ${fadeOut ? "opacity-0" : "opacity-100"}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        touchAction: 'none' // Prevent scrolling on mobile
      }}
    >
      {/* Fixed backdrop */}
      <div
        className="absolute inset-0 bg-stone-900 bg-opacity-90 dark:bg-black/90 backdrop-blur-sm"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
      ></div>

      {/* Modal content - responsive sizing */}
      <div
        className={`relative bg-white dark:bg-gray-900 border border-stone-200 dark:border-gray-700 rounded-xl shadow-xl p-4 mx-4 w-full max-w-[95vw] sm:max-w-md transition-all duration-300 ${fadeOut ? "opacity-0 scale-95" : "opacity-100 scale-100"
          }`}
        style={{
          maxHeight: '90vh',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch' // Smooth scrolling on iOS
        }}
      >
        <div className="relative z-10">
          {/* Icon - smaller on mobile */}
          <div className="mx-auto w-14 h-14 sm:w-20 sm:h-20 rounded-full bgColor dark:bg-sky-900 flex items-center justify-center shadow mb-4 sm:mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 sm:h-10 sm:w-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-stone-900 dark:text-gray-100 mb-1 sm:mb-2 text-center">
            Age Verification
          </h2>
          <div className="w-12 sm:w-16 h-1 bgColor dark:bg-sky-900 mx-auto mb-3 sm:mb-4 rounded-full"></div>

          <p className="text-sm sm:text-base text-stone-700 dark:text-gray-200 mb-6 sm:mb-8 font-medium text-center">
            This website contains age-restricted content. Are you at least 18
            years old?
          </p>

          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row justify-center gap-3 sm:gap-4">
            <button
              className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base rounded-lg bgColor dark:bg-sky-900 text-white font-medium transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-stone-500 focus:ring-opacity-50 focus:outline-none"
              onClick={handleClose}
              aria-label="Yes, I am 18+"
            >
              Yes, I am 18+
            </button>

            <button
              className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base rounded-lg bg-gray-100 dark:bg-gray-800 text-stone-700 dark:text-gray-200 font-medium border border-stone-200 dark:border-gray-700 transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-stone-500 focus:ring-opacity-50 focus:outline-none"
              onClick={handleNo}
              aria-label="No, take me away"
            >
              No, take me away
            </button>
          </div>

          <p className="text-xs text-stone-500 dark:text-gray-400 mt-4 sm:mt-6 italic text-center">
            By entering, you acknowledge our Terms of Service and Privacy
            Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgeVerificationModal;