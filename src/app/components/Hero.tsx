"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const images = [
  "/trinetra1.jpg",
  "/trinetra2.jpg",
  "/trinetra3.jpg",
];

const HeroSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // ✅ Optimized slide change handlers
  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, []);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % images.length);
  }, []);

  // ✅ Auto-slide (lighter + no memory leaks)
  useEffect(() => {
    const timer = setInterval(nextSlide, 4000); // faster auto change
    return () => clearInterval(timer);
  }, [nextSlide]);

  // ✅ Touch-swipe gestures (mobile support)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (diff > 50) prevSlide();
    if (diff < -50) nextSlide();
    touchStartX.current = null;
  };

  return (
    <motion.section
      className="relative flex justify-center items-center w-full mt-36 sm:mt-40 overflow-hidden select-none"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div
        className="relative w-[95%] sm:w-[90%] lg:w-[85%] max-w-[1400px] h-[60vh] rounded-xl overflow-hidden shadow-lg"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* ✅ Optimized smooth transition */}
        <AnimatePresence custom={direction}>
          <motion.img
            key={current}
            src={images[current]}
            alt={`Slide ${current + 1}`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
            transition={{
              duration: 0.6,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
          />
        </AnimatePresence>

        {/* Left Arrow */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-4 z-10 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-white/60 hover:bg-white/90 backdrop-blur-sm rounded-full shadow-md transition-all active:scale-90"
          aria-label="Previous"
        >
          <FaChevronLeft className="text-gray-800 text-lg sm:text-xl" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={nextSlide}
          className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-4 z-10 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-white/60 hover:bg-white/90 backdrop-blur-sm rounded-full shadow-md transition-all active:scale-90"
          aria-label="Next"
        >
          <FaChevronRight className="text-gray-800 text-lg sm:text-xl" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 sm:bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3">
          {images.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrent(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${
                index === current
                  ? "bg-gray-900 scale-125"
                  : "bg-gray-400/70 hover:bg-gray-600"
              }`}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default HeroSlider;
