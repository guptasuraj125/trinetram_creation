/* "use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";

const CheckoutPage = () => {
  const { cart, totalPrice } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleWhatsApp = () => {
    if (!name || !phone || !address) return alert("Fill all fields!");
    let message = `Order Details:\nName: ${name}\nPhone: ${phone}\nAddress: ${address}\n\nItems:\n`;
    cart.forEach((item) => {
      message += `${item.title} x ${item.quantity} = ₹${item.price * item.quantity}\n`;
    });
    message += `\nTotal: ₹${totalPrice.toFixed(2)}`;

    const url = `https://wa.me/yourphonenumber?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  if (cart.length === 0) return <p className="p-8">Cart is empty</p>;

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="flex flex-col gap-4 max-w-md">
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <textarea
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <button
          onClick={handleWhatsApp}
          className="bg-green-500 text-white py-2 rounded mt-2"
        >
          Send Order via WhatsApp
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
 */