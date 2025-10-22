"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { productList } from "@/products";
import { useRouter } from "next/navigation"; // Next.js router

const ProductsPage = () => {
  const { addToCart } = useCart();
  const router = useRouter(); // ✅ initialize router
  const [visibleCount, setVisibleCount] = useState(8);

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 8, productList.length));
  };

  const visibleProducts = productList.slice(0, visibleCount);

  const getDiscountPercent = (original?: number, price?: number) => {
    if (!original || !price || original <= 0) return 0;
    return Math.round(((original - price) / original) * 100);
  };

  // When card is clicked → add to cart + navigate to /cart page
  const handleCardClick = (product: any) => {
    addToCart(product);
    router.push("/cart"); // ✅ navigate to cart page
  };

  return (
    <div className="flex flex-col items-center mt-16 px-4">
      <h2 className="text-4xl md:text-5xl font-bold text-center text-[#f79707] cursor-pointer hover:text-[#3d2768] mb-8 relative">
        Diva&apos;s Collection
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-[1300px]">
        {visibleProducts.map((p) => {
          const discount = getDiscountPercent(p.originalPrice, p.price);
          return (
            <div
              key={p.id}
              onClick={() => handleCardClick(p)} // full card click navigates to cart
              className="bg-white shadow-md rounded-lg overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-xl flex flex-col cursor-pointer"
            >
              <div className="overflow-hidden w-full h-48">
                <img
                  src={p.image || "/images/product-default.jpg"}
                  alt={p.title}
                  className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                  onError={(e) => (e.currentTarget.src = "/images/product-default.jpg")}
                />
              </div>

              <div className="p-3 flex flex-col flex-1 justify-between">
                <div className="flex flex-col items-center">
                  <h3 className="font-bold text-md text-center">{p.title}</h3>
                  <p className="text-gray-500 text-xs text-center mt-1 line-clamp-2">
                    {p.description || "No description available."}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    {p.originalPrice && (
                      <span className="text-gray-400 line-through text-xs">
                        ₹{p.originalPrice}
                      </span>
                    )}
                    <span className="text-red-500 font-bold text-sm">₹{p.price}</span>
                    {discount > 0 && (
                      <span className="text-green-600 text-xs font-semibold">{discount}% OFF</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation(); // prevent double trigger
                    addToCart(p);
                    router.push("/cart"); // also navigate to cart if button clicked
                  }}
                  className="mt-3 bg-[#F7660C] text-white px-4 py-2 rounded-lg transition-colors duration-300 hover:bg-[#3d2768] shadow-lg text-sm w-full"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {visibleCount < productList.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
          >
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
