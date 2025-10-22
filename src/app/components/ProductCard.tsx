"use client";

import React, { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import toast, { Toaster } from "react-hot-toast";

interface ProductCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  description,
  price,
  originalPrice,
  image,
}) => {
  const { addToCart, cart } = useCart();
  const [added, setAdded] = useState(false);

  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const handleAdd = useCallback(() => {
    addToCart({ id, title, description, price, image });
    setAdded(true);
    toast.success(`${title} added to cart!`, { duration: 1500 });
    setTimeout(() => setAdded(false), 1200);
  }, [addToCart, id, title, description, price, image]);

  const inCart = cart.some((item) => item.id === id);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-all flex flex-col"
    >
      <Toaster position="top-center" />
      <img
        src={image}
        alt={title}
        loading="lazy"
        onError={(e) =>
          (e.currentTarget.src = "/images/product-default.jpg")
        }
        className="w-full h-48 object-cover"
      />

      <div className="p-3 flex flex-col flex-1 justify-between">
        <h3 className="font-bold text-md text-center">{title}</h3>
        <p className="text-gray-500 text-xs text-center mt-1 line-clamp-2">
          {description}
        </p>

        <div className="flex justify-center items-center gap-2 mt-2">
          {originalPrice && (
            <span className="text-gray-400 line-through text-xs">
              ₹{originalPrice}
            </span>
          )}
          <span className="text-red-500 font-bold text-sm">₹{price}</span>
          {discountPercent > 0 && (
            <span className="text-green-600 text-xs font-semibold">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        <button
          onClick={handleAdd}
          disabled={added || inCart}
          className={`mt-3 text-white px-4 py-2 rounded-lg transition duration-300 shadow-lg text-sm w-full
            ${added || inCart
              ? "bg-green-500 hover:bg-green-600"
              : "bg-[#F7660C] hover:bg-[#3d2768]"}`}
        >
          {added || inCart ? "Added!" : "Add to Cart"}
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
