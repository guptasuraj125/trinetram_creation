"use client";

import React, { useState } from "react";
import { useCart } from "@/app/context/CartContext"; // your context
import { useRouter } from "next/navigation";

interface Props {
  params: { id: string };
}

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
}

const products: Product[] = [
  {
    id: "1",
    title: "Diva Diya 1",
    price: 120,
    image: "/products/diya1.png",
    description: "Beautiful handcrafted diya for decoration",
  },
  {
    id: "2",
    title: "Diva Diya 2",
    price: 150,
    image: "/products/diya2.png",
    description: "Elegant design for festivals and home decor",
  },
];

const ProductPage: React.FC<Props> = ({ params }) => {
  const { cart, addToCart } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === params.id);

  if (!product) return <p>Product not found</p>;

  const handleAddToCart = () => {
    addToCart({ ...product, quantity });
    alert("Added to cart!");
    router.push("/cart"); // go to cart page
  };

  const handleWhatsApp = () => {
    const message = `Hi, I want to order:\n\nProduct: ${product.title}\nQuantity: ${quantity}\nPrice: ₹${product.price * quantity}\n`;
    const whatsappUrl = `https://wa.me/yourphonenumber?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen p-8">
      <div className="flex gap-10">
        <img src={product.image} alt={product.title} className="w-64 h-64 object-contain" />
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <p>{product.description}</p>
          <p className="text-xl font-semibold">₹{product.price}</p>

          <div className="flex items-center gap-2">
            <label>Quantity:</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border rounded px-2 py-1 w-20"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="bg-[#EF233C] text-white px-4 py-2 rounded hover:bg-[#d32030]"
            >
              Add to Cart
            </button>

            <button
              onClick={handleWhatsApp}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Order via WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
