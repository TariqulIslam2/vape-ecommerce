"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  "/banner1.jpg",
  "/banner1.png",
  "/banner2.png",
  "/banner3.png",
  "/banner4.png",
  "/banner5.png",
  "/banner6.png",
  "/banner7.png",
  "/banner8.png",
];

const CarouselBanner = () => {
  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={{
          nextEl: ".next-btn",
          prevEl: ".prev-btn",
        }}
        autoplay={{
          delay: 3000, // 3 seconds
          disableOnInteraction: false, // keeps autoplay after manual control
        }}
        loop={true}
        className="w-full h-full"
      >
        {slides.map((src, index) => (
          <SwiperSlide key={index}>
            <Image
              src={src}
              alt={`Slide ${index}`}
              fill="true"
              className="object-cover"
              priority // Critical for LCP optimization
              fetchPriority="high" // Resource hint
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Controls */}
      <div className="absolute bottom-4 right-4 flex space-x-3 z-10">
        <button
          className="prev-btn bg-white p-2 rounded-full shadow dark:bg-gray-800 dark:text-gray-100"
          aria-label="Previous slide"
          title="Previous slide"
        >
          <ChevronLeft aria-hidden="true" aria-label="Previous slide" />
        </button>

        <button
          className="next-btn bg-white p-2 rounded-full shadow dark:bg-gray-800 dark:text-gray-100"
          aria-label="Next slide"
          title="Next slide"
        >
          <ChevronRight aria-hidden="true" aria-label="Next slide" />
        </button>
      </div>

    </div>
  );
};

export default CarouselBanner;
