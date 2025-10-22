"use client";

import React from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#3d2768] text-gray-300 pt-16 relative overflow-hidden">
      {/* Decorative Top Gradient Bar */}
      <div className="absolute top-0 left-0 w-full h-1
       "></div>

      {/* Main Footer Grid */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Logo & Description */}
        <div className="flex flex-col gap-4">
          <img src="/logo.png" alt="Trinetram Logo" className="h-20 w-60 mb-2" />
          <p className="text-gray-400 text-sm leading-relaxed">
            Trinetram brings divine elegance to your home. Premium festive decor & essentials for every occasion.
          </p>
          <div className="flex gap-3 mt-2">
            {[FaFacebookF, FaInstagram, FaWhatsapp].map((Icon, i) => (
              <a
                key={i}
                href="#"
                target="_blank"
                className="text-gray-300 hover:text-red-400 p-2 bg-gray-800 rounded-full transition transform hover:scale-110 duration-300"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Shop Links */}
        <div className="flex flex-col gap-3">
          <h3 className="text-white font-bold text-lg mb-2">Shop</h3>
          {["Home", "Products", "About Us", "Gallery", "Contact Us"].map((link) => (
            <Link
              key={link}
              href={link === "Home" ? "/" : `/${link.toLowerCase().replace(/\s/g, "")}`}
              className="hover:text-yellow-400 transition-colors duration-300"
            >
              {link}
            </Link>
          ))}
        </div>

        {/* Support Links */}
        <div className="flex flex-col gap-3">
          <h3 className="text-white font-bold text-lg mb-2">Support</h3>
          {["FAQ", "Shipping", "Returns", "Terms & Conditions", "Privacy Policy"].map((link) => (
            <Link
              key={link}
              href="#"
              className="hover:text-yellow-400 transition-colors duration-300"
            >
              {link}
            </Link>
          ))}
        </div>

        {/* Contact & Newsletter */}
        <div className="flex flex-col gap-3">
          <h3 className="text-white font-bold text-lg mb-2">Contact & Subscribe</h3>
          <p>
            Email: <a href="mailto:support@trinetram.com" className="hover:text-yellow-400 transition-colors">trinetramcreations@gmail.com</a>
          </p>
          <p>
            Phone: <a href="tel:+9180943209486" className="hover:text-yellow-400 transition-colors">+91 80943 209486</a>
          </p>
          <p>Address: , Bholenath Nagar , Thane-400612 , India</p>

          {/* Newsletter */}
          <div className="mt-4">
            <p className="text-gray-400  text-sm mb-2">Subscribe to our newsletter</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="p-2 rounded-l border-white w-full text-white "
              />
              <button className="bg-yellow-400 text-gray-900 px-4 rounded-r hover:bg-yellow-500 transition transform hover:scale-105 duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Optional Map */}
  {/*     <div className="mt-12 w-full h-48 md:h-64">
        <iframe
          className="w-full h-full rounded-lg border-0"
          loading="lazy"
          src="https://www.google.com/maps/embed?...">
        </iframe>
      </div> */}

      {/* Bottom Bar with Shoutout */}
      <div className="border-t border-gray-700 mt-12 py-6 text-center text-gray-500 text-sm flex flex-col md:flex-row items-center justify-center gap-2">
        <span>&copy; {new Date().getFullYear()} Trinetram. All rights reserved.</span>
        <span className=" text-gray-500  ">• Made with ❤️ by Suraj Gupta</span>
      </div>
    </footer>
  );
};

export default Footer;
