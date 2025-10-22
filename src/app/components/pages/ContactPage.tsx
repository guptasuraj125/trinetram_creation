"use client";

import React, { useRef, useState, FormEvent } from "react";
import emailjs from "@emailjs/browser";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion"; // <-- Import motion

const ContactPage: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);

  const sendEmail = (e: FormEvent) => {
    e.preventDefault();
    if (!form.current) return;

    setLoading(true);

    emailjs
      .sendForm(
        "service_iflg8tv",
        "template_7y50vdj",
        form.current,
        "lx6Vr1orTQ6jkx8I5"
      )
      .then(
        () => {
          setLoading(false);
          toast.success("Message sent successfully!");
          form.current?.reset();
        },
        () => {
          setLoading(false);
          toast.error("Failed to send. Try again.");
        }
      );
  };

  return (
    <div className="min-h-screen flex items-start justify-center mt-20 bg-white p-6 md:p-20">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex flex-col md:flex-row items-start w-full max-w-6xl gap-8 md:gap-20">
        {/* Form Section */}
        <div className="w-full md:w-2/5 max-w-md">
          {/* Header */}
          <div className="text-left mb-8">
            <h2 className="text-3xl text-[#3d2768] font-bold mb-2">GET IN TOUCH</h2>
            <p className="text-gray-600">
              24/7 We will answer your questions and problems
            </p>
          </div>

          <form ref={form} onSubmit={sendEmail} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  placeholder="Gupta Suraj"
                  required
                  className="w-full border-b text-gray-400 border-gray-300 p-2 focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  placeholder=""
                  required
                  className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="user_email"
                placeholder=""
                required
                className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                placeholder=""
                required
                className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Describe your issue</label>
              <textarea
                name="message"
                placeholder="......"
                required
                className="w-full border-b border-gray-300 p-2 h-20 resize-none focus:outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3d2768] text-white py-3 rounded hover:bg-gray-800 transition disabled:opacity-50 font-semibold"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>

        {/* Image Section - hidden on mobile with animation */}
        <div className="w-full md:w-2/5 ml-30 hidden md:flex justify-end">
          <motion.img
            src="/contactwalididi.png"
            alt="Contact Illustration"
            className="w-full max-w-md h-auto rounded-lg"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
