"use client";

import React, { useCallback, useMemo } from "react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import Link from "next/link";

const CartSidebar = () => {
  const { cart, addToCart, updateQuantity, removeFromCart, isCartOpen, setIsCartOpen } = useCart();

  const total = useMemo(
    () => cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0),
    [cart]
  );
  const freeShippingThreshold = 399;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - total);

  const recommendedProducts = useMemo(
    () => [
    
    ],
    []
  );

  const handleAddRecommended = useCallback((product: any) => {
    addToCart({ ...product, quantity: 1 });
  }, [addToCart]);

  const handleCheckout = useCallback(() => {
    setIsCartOpen(false);
    window.location.href = "/cart";
  }, [setIsCartOpen]);

  const getImageSrc = useCallback((item: any) => item.image || "/images/product-default.jpg", []);
  const isProductInCart = useCallback((productId: string) => cart.some(item => item.id === productId), [cart]);

  return (
    <>
    
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black backdrop-blur-sm z-50"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md md:max-w-lg bg-white/95 backdrop-blur-md shadow-2xl z-50 flex flex-col"
          >
           
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Your Cart ({cart.length})</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition"
              >
                <X size={22} />
              </button>
            </div>

       
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
            
              <div className="bg-blue-50 p-4 rounded-xl shadow-sm">
                <div className="flex justify-between mb-2 text-sm font-medium">
                  <span>₹{total}</span>
                  <span className="text-gray-600">
                    {amountToFreeShipping > 0 ? `₹${amountToFreeShipping} away from free shipping` : "Free shipping!"}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((total / freeShippingThreshold) * 100, 100)}%` }}
                  />
                </div>
              </div>

              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400 space-y-3">
                  <div className="text-6xl">🛒</div>
                  <p>Your cart is empty</p>
                <Link
    href="#"  
    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
>
    Shop Now
</Link>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-3 items-start bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={getImageSrc(item)}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.src = "/images/product-default.jpg")}
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{item.title}</h3>
                        <p className="text-green-600 font-bold">₹{item.price}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-gray-100 rounded-full">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                            className="w-8 h-8 flex justify-center items-center hover:bg-gray-200 rounded-l-full transition"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-3 py-1 text-sm font-medium">{item.quantity || 1}</span>
                          <button
                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                            className="w-8 h-8 flex justify-center items-center hover:bg-gray-200 rounded-r-full transition"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}

            
              {cart.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 text-lg">You may also like</h3>
                  {recommendedProducts.map(product => {
                    const inCart = isProductInCart(product.id);
                    const cartItem = cart.find(item => item.id === product.id);
                    return (
                      <div key={product.id} className="flex gap-3 items-center p-3 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={product.image || "/images/product-default.jpg"}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">{product.title}</h4>
                          <p className="text-green-600 font-bold text-sm">₹{product.price}</p>
                          {inCart && <p className="text-xs text-blue-600">In cart ({cartItem?.quantity})</p>}
                        </div>
                        {inCart ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(product.id, Math.max(1, (cartItem?.quantity || 1) - 1))}
                              className="w-6 h-6 bg-white border rounded-full flex justify-center items-center text-xs hover:bg-gray-100"
                            >−</button>
                            <span className="text-sm font-medium w-4 text-center">{cartItem?.quantity}</span>
                            <button
                              onClick={() => updateQuantity(product.id, (cartItem?.quantity || 1) + 1)}
                              className="w-6 h-6 bg-white border rounded-full flex justify-center items-center text-xs hover:bg-gray-100"
                            >+</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAddRecommended(product)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition"
                          >
                            ADD
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t p-5 bg-white/95 backdrop-blur-md">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-lg font-bold">₹{total}</span>
                </div>
                <p className="text-sm text-gray-500 mb-3 text-center">Tax included. Shipping calculated at checkout.</p>
                <div className="space-y-2">
                  <button
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Check Out
                  </button>
                  <Link
                    href="/cart"
                    onClick={() => setIsCartOpen(false)}
                    className="block w-full text-center border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
                  >
                    View Cart
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CartSidebar;
