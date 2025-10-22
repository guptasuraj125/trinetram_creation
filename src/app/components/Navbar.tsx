"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  FaUser,
  FaShoppingCart,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";

const Navbar = () => {
  const { cart, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const { totalPrice, totalItems } = useMemo(() => {
    const totalPrice = cart.reduce(
      (acc, item) => acc + (item.quantity || 1) * item.price,
      0
    );
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    return { totalPrice, totalItems };
  }, [cart]);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("trinetramcreations@gmail.com");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Framer Motion Variants
  const shutterVariants: Variants = {
    hidden: { y: "-100%", opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    exit: { y: "100%", opacity: 0, transition: { duration: 0.5 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05 + 0.15, duration: 0.35 },
    }),
  };

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleBackButton = (e: PopStateEvent) => {
      e.preventDefault();
      setMobileMenuOpen(false);
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBackButton);

    return () => window.removeEventListener("popstate", handleBackButton);
  }, [mobileMenuOpen]);

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "#" },
    { label: "About Us", href: "#" },
    { label: "Gallery", href: "#" },
    { label: "Contact Us", href: "#" },
  ];

  return (
    <div className="fixed top-0 left-0 z-50 w-full bg-white">
      {/* Top Bar */}
      <div className="bg-[#3d2768] text-xs sm:text-sm py-2 sm:py-6 px-3 sm:px-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-[1400px] mx-auto">
          {/* Social Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {[
              {
                icon: FaInstagram,
                href: "https://www.instagram.com/trinetram_creation/",
                hover: "hover:text-pink-500",
              },
              { icon: FaFacebookF, href: "https://www.facebook.com/share/1CtxzQKVsZ/", hover: "hover:text-blue-600" },
              {
                icon: FaWhatsapp,
                href: `https://wa.me/918369026736?text=${encodeURIComponent(
                  "Hi Trinetram! I want to know about your products."
                )}`,
                hover: "hover:text-green-500",
              },
            ].map(({ icon: Icon, href, hover }, i) => (
              <a key={i} href={href} target="_blank" rel="noopener noreferrer">
                <Icon className={`text-lg sm:text-xl text-white ${hover} transition-transform duration-200 hover:scale-110`} />
              </a>
            ))}
          </div>

          {/* Marquee */}
          <div className="relative overflow-hidden w-full sm:w-auto">
            <div className="animate-marquee whitespace-nowrap font-bold text-white text-sm">
              ✨ Free Shipping above ₹399 | Festive Sale Upto 50% OFF! 🎉
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-2 text-white cursor-pointer" onClick={handleCopyEmail}>
            <FaEnvelope className="text-base" />
            <p className="font-semibold text-sm">trinetramcreations@gmail.com</p>
          </div>

          {showToast && (
            <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg animate-fadeIn z-50 text-center sm:text-base text-sm">
              Email copied successfully!
            </div>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex justify-between items-center max-w-[1450px] mx-auto py-3 px-4 sm:px-6">
          <Link href="/">
            <img
              src="/logo.png"
              alt="Brand Logo"
              className="h-10 sm:h-12 w-auto object-contain cursor-pointer"
            />
          </Link>

          <ul className="hidden md:flex items-center gap-8 font-medium text-black tracking-wide">
            {menuItems.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="cursor-pointer hover:text-[#EA9A1E] transition-all duration-300 hover:scale-105"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 border border-[#1D4ED8] rounded-md px-3 py-1.5 text-[#1D4ED8] hover:bg-[#1D4ED8] hover:text-white transition-colors">
              <FaUser /> <span>Account</span>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-[#F7660C] cursor-pointer text-white rounded-md px-3 sm:px-4 py-1.5 hover:bg-[#d32030] transition-colors"
            >
              <FaShoppingCart />
              <span className="hidden sm:inline">₹{totalPrice.toFixed(2)}</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>

            <button onClick={() => toggleMobileMenu()} className="md:hidden text-2xl text-[#1D4ED8]">
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Fullscreen Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="menu"
            variants={shutterVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[999] bg-[#3d2768] flex flex-col items-center justify-center font-bold text-black text-4xl sm:text-5xl"
          >
            <button
              onClick={() => toggleMobileMenu()}
              className="absolute top-6 right-6 text-black hover:text-[#EF233C] transition-all"
            >
              <X size={36} strokeWidth={2.5} />
            </button>

            <motion.ul className="flex flex-col items-center text-white gap-10 tracking-wide">
              {menuItems.map((item, i) => (
                <motion.li
                  key={item.label}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="hover:text-[#EA9A1E] transition-all duration-300 hover:scale-110 cursor-pointer"
                  onClick={() => {
                    toggleMobileMenu();
                  }}
                >
                  <Link href={item.href}>{item.label}</Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .animate-marquee {
          display: inline-block;
          animation: marquee 14s linear infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Navbar;
