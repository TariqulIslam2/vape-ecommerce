"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const ProductSlider = ({ productData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsVisible = 4; // 4 ta dekhabo

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % productData.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev - 1 < 0 ? productData.length - 1 : prev - 1
    );
  };

  const getSlideStyles = (index) => {
    if (index === currentIndex) {
      return "scale-100 z-20 opacity-100";
    } else if (
      index === (currentIndex + 1) % productData.length ||
      index === (currentIndex - 1 + productData.length) % productData.length
    ) {
      return "scale-90 z-10 opacity-80";
    } else {
      return "scale-75 z-0 opacity-50 blur-sm";
    }
  };

  const visibleProducts = [];

  for (let i = 0; i < itemsVisible; i++) {
    const index = (currentIndex + i) % productData.length;
    visibleProducts.push({ ...productData[index], index });
  }

  return (
    <div className="bg-stone-100 dark:bg-gray-900 p-5 mb-10 relative overflow-hidden">
      <h1 className="text-2xl text-center font-bold my-6 text-gray-900 dark:text-gray-100">TRENDING</h1>

      <div className="relative flex justify-center items-center">
        {/* Slides */}
        <div className="relative w-full flex justify-center items-center h-[400px]">
          {visibleProducts.map((product, i) => (
            <div
              key={product.id}
              className={`relative transition-all duration-700 ease-in-out transform ${getSlideStyles(
                i === 1 ? currentIndex : (currentIndex + i) % productData.length
              )} mx-2`}
              style={{
                width: "220px",
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 btn btn-circle bg-green-600 dark:bg-green-800 text-white hover:bg-green-700 dark:hover:bg-green-900 z-30"
          aria-label="Previous slide"
          >
          ❮
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 btn btn-circle bg-green-600 dark:bg-green-800 text-white hover:bg-green-700 dark:hover:bg-green-900 z-30"
          aria-label="Next slide"
        >
          ❯
        </button>
      </div>
    </div>
  );
};

export default ProductSlider;
