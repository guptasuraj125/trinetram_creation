"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";
import { Trash2, Plus, Minus, MapPin, User, Phone, Home, Star, Shield, Truck } from "lucide-react";

const ZOOM_SCALE = 2;

const CartPage = () => {
  const { cart, updateQuantity, clearCart } = useCart();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZoomActive, setIsZoomActive] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const imageContainerRef = useRef(null);

  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [locationString, setLocationString] = useState("");
  const [mapsLink, setMapsLink] = useState("");

  const productImages = useMemo(() => {
    if (!cart || cart.length === 0) return [];
    const first = cart[0];
    const imgs = [];
    if (first.image) imgs.push(first.image);
    if (first.image2) imgs.push(first.image2);
    if (first.image3) imgs.push(first.image3);
    return imgs;
  }, [cart]);

  useEffect(() => {
    if (productImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [productImages.length]);

  const total = useMemo(() => (cart || []).reduce((a, i) => a + i.price * (i.quantity || 1), 0), [cart]);

  const handleMouseMove = useCallback((e) => {
    const container = imageContainerRef.current;
    if (!container || !isImageLoaded) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      setIsZoomActive(false);
      return;
    }

    requestAnimationFrame(() => setZoomPosition({ x, y }));
    setIsZoomActive(true);
  }, [isImageLoaded]);

  const handleImageLoad = () => setIsImageLoaded(true);
  const handleMouseLeave = () => setIsZoomActive(false);

  const handleCheckout = () => {
    if (!userName || !phone || !address) return;
    let msg = `*Trinetram - New Order*\n\n`;
    msg += `*Customer Details:*\n`;
    msg += `• Name: ${userName}\n`;
    msg += `• Phone: ${phone}\n`;
    msg += `• Address: ${address}\n`;
    if (locationString) {
      if (mapsLink) msg += `• Location: ${locationString} (${mapsLink})\n`;
      else msg += `• Location: ${locationString}\n`;
    }
    msg += `\n*Order Items:*\n────────────────────\n`;
    (cart || []).forEach((item, idx) => {
      const qty = item.quantity || 1;
      const subtotal = item.price * qty;
      msg += `${idx + 1}. Product: ${item.title}\n   ID: ${item.id}\n   Price: ₹${item.price}\n   Quantity: ${qty}\n   Subtotal: ₹${subtotal}\n────────────────────\n`;
    });
    msg += `*Total Amount:* ₹${total}\n────────`;
    const encoded = encodeURIComponent(msg);
    const whatsapp = `https://wa.me/919372340493?text=${encoded}`;
    window.open(whatsapp, "_blank");
  };

  if (!cart) return null;

  return (
    <>
      <div className="min-h-screen bg-gray-50 -mt-10">
        <div className="bg-white border-b border-gray-200 ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-600 text-white p-2 mt-7 rounded-lg">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold mt-7 text-gray-900">Shopping Cart</h1>
                  <p className="text-gray-600 text-sm">{cart.length} items • Secure checkout</p>
                </div>
              </div>
              <div className="text-right bg-green-50 pt-6 border border-green-200">
                <p className="text-sm text-gray-600 font-medium">Total Amount</p>
                <p className="text-2xl font-bold text-green-600">₹{total}</p>
                <p className="text-xs text-green-600">Free Delivery</p>
              </div>
            </div>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your Cart is Empty</h2>
              <p className="text-gray-500">Add some products to get started</p>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto p-4 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Product Gallery */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      Product Images
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span className="hidden sm:inline">Hover to zoom</span>
                    </div>
                  </div>
                  <div className="relative flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8">
                    <div className="flex sm:flex-col gap-2 sm:gap-3 order-2 sm:order-1 w-full sm:w-20 overflow-x-auto sm:overflow-x-visible">
                      {productImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setCurrentImageIndex(index);
                            setIsImageLoaded(false);
                          }}
                          className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 border-2 rounded-lg overflow-hidden transition-all ${
                            currentImageIndex === index
                              ? "border-blue-500 shadow-md"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <img
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>
                    <div
                      className="flex-1 order-1 sm:order-2 relative bg-white border border-gray-200 rounded-lg overflow-hidden aspect-square w-full max-w-2xl mx-auto cursor-zoom-in"
                      style={{ minHeight: 400 }}
                      ref={imageContainerRef}
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                    >
                      {productImages.length > 0 ? (
                        <>
                          <img
                            src={productImages[currentImageIndex]}
                            alt={`Product ${currentImageIndex + 1}`}
                            className="max-w-full max-h-full w-auto h-auto pointer-events-none transition-opacity duration-300"
                            style={{ 
                              background: "white",
                              opacity: isImageLoaded ? 1 : 0 
                            }}
                            loading="eager"
                            onLoad={handleImageLoad}
                            onError={(e) => {
                              e.currentTarget.src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%239ca3af'%3EImage not available%3C/text%3E%3C/svg%3E";
                              setIsImageLoaded(true);
                            }}
                          />
                          
                          {!isImageLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                              <div className="text-center text-gray-500">
                                <div className="animate-pulse">Loading image...</div>
                              </div>
                            </div>
                          )}

                          {isZoomActive && isImageLoaded && (
                            <div
                              className="absolute border-2 border-blue-400 pointer-events-none"
                              style={{
                                left: `${zoomPosition.x - 60}px`,
                                top: `${zoomPosition.y - 60}px`,
                                width: 120,
                                height: 120,
                                background: "rgba(255,255,255,0.25)",
                                borderRadius: 8,
                                boxShadow: "0 2px 8px 0 rgba(30,80,200,0.10)",
                                zIndex: 10,
                              }}
                            />
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
                          <div className="text-center text-gray-500">
                            <div className="text-4xl mb-2">📷</div>
                            <p className="text-sm">No images available</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {productImages.length > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                      <div className="flex gap-1">
                        {productImages.map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-all ${
                              currentImageIndex === index ? "bg-blue-500" : "bg-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {currentImageIndex + 1} / {productImages.length}
                      </span>
                    </div>
                  )}
                </div>

                {/* Cart Items */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Cart Items ({cart.length})
                    </h3>
                    <button
                      onClick={() => {
                        clearCart();
                        toast.success("Cart cleared successfully!");
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 text-sm"
                    >
                      <Trash2 size={16} />
                      <span className="hidden sm:block">Clear All</span>
                    </button>
                  </div>
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-gray-100">
                        <div className="flex-shrink-0 relative">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                          </div>
                          <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-1 rounded">{item.quantity || 1}</div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1 leading-tight">{item.title}</h4>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                              <Star className="w-3 h-3 fill-current mr-1" />
                              <span>4.3</span>
                            </div>
                            <div className="hidden sm:flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              <Shield className="w-3 h-3 mr-1" />
                              <span>Assured</span>
                            </div>
                          </div>
                          <p className="text-lg font-bold text-green-600">₹{item.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-8 sm:w-12 text-center text-sm font-semibold text-gray-800">{item.quantity || 1}</span>
                            <button
                              onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors border-l border-gray-300"
                            >
                              {/* Dotted + Icon */}
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 3V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2"/>
                                <path d="M13 8H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2"/>
                              </svg>
                            </button>
                          </div>
                          <button
                            onClick={() => updateQuantity(item.id, 0)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Customer Info and Order Summary */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Delivery Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white text-sm sm:text-base"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Enter your phone number"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white text-sm sm:text-base"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address *</label>
                      <div className="relative">
                        <Home className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <textarea
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Enter complete delivery address"
                          rows={3}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-colors bg-white text-sm sm:text-base"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={locationString}
                          onChange={(e) => setLocationString(e.target.value)}
                          placeholder="Your location will be auto-detected"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white text-sm sm:text-base"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 sticky top-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                      <span>Subtotal ({cart.length} items)</span>
                      <span>₹{total}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                      <span>Delivery Charges</span>
                      <span className="text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                      <span>Taxes & Charges</span>
                      <span>Included</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-bold text-gray-900">
                        <span>Total Amount</span>
                        <span className="text-green-600">₹{total}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleCheckout}
                      disabled={!userName || !phone || !address}
                      className="w-full bg-green-600 text-white py-3 sm:py-4 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-sm sm:text-base"
                    >
                      <span className="text-lg">📱</span>
                      <span>Send Quotation via WhatsApp</span>
                    </button>

                    <div className="text-center">
                      <p className="text-xs text-gray-500">
                        🔒 Secure checkout • You'll be redirected to WhatsApp
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Zoom Preview - Optimized Width */}
        <div className="hidden lg:block">
          {isZoomActive && isImageLoaded && productImages.length > 0 && (
            <div className="fixed right-4 top-1/2 mt-10 -translate-y-1/2 w-[38vw] h-[90vh] bg-white border border-gray-300 rounded-xl shadow-2xl overflow-hidden z-50">
              <div
                className="w-full h-full bg-no-repeat bg-center transition-all duration-75 ease-out"
                style={{
                  backgroundImage: `url(${productImages[currentImageIndex]})`,
                  backgroundSize: `${ZOOM_SCALE * 100}%`,
                  backgroundPosition: `${(zoomPosition.x / (imageContainerRef.current?.offsetWidth || 1)) * 100}% ${
                    (zoomPosition.y / (imageContainerRef.current?.offsetHeight || 1)) * 100
                  }%`,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default React.memo(CartPage);