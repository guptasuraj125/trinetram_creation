"use client";

import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "@studio-freight/lenis";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ContactPage from "./components/pages/ContactPage";
import CartSidebar from "./components/CartSidebar";

const ProductsPage = dynamic(() => import("./components/pages/ProductsPage"), { ssr: false });
const Hero = dynamic(() => import("./components/Hero"), { ssr: false });

const COLORS = ["#FF69B4", "#00FF7F", "#1E90FF", "#FFD700", "#FF8C00"];

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  life: number;
}

const ParticleDot = memo(({ x, y, size, color }: Particle) => (
  <div
    className="absolute rounded-full pointer-events-none"
    style={{
      top: y,
      left: x,
      width: size,
      height: size,
      backgroundColor: color,
      zIndex: 9998,
    }}
  />
));
ParticleDot.displayName = "ParticleDot";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const lastSpawn = useRef(0);
  const particleId = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  // Loader
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleLoaderExit = () => setShowContent(true);

  // Particle spawn (desktop only)
  const spawnParticles = useCallback((x: number, y: number, count = 3) => {
    if (isMobile) return; // skip for mobile
    const now = performance.now();
    if (now - lastSpawn.current < 80) return;
    lastSpawn.current = now;

    const newParticles: Particle[] = Array.from({ length: count }).map(() => ({
      id: ++particleId.current,
      x,
      y,
      size: 3 + Math.random() * 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      vx: (Math.random() - 0.5) * 2,
      vy: -Math.random() * 2 - 1,
      life: 60 + Math.random() * 20,
    }));

    setParticles((prev) => [...prev, ...newParticles].slice(-80)); // limit for low-end
  }, [isMobile]);

  // Particle animation loop
  useEffect(() => {
    if (isMobile) return; // skip for mobile
    const animate = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.04, life: p.life - 1 }))
          .filter((p) => p.life > 0)
      );
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [isMobile]);

  // Mouse particles
  useEffect(() => {
    if (isMobile) return; // skip for mobile
    const move = (e: MouseEvent) => spawnParticles(e.clientX, e.clientY);
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [spawnParticles, isMobile]);

  // Fireworks effect
  useEffect(() => {
    if (loading || isMobile) return;
    const id = setInterval(() => {
      const x = Math.random() * window.innerWidth * 0.9;
      const y = window.innerHeight - 40;
      spawnParticles(x, y, 10);
    }, 3000);
    return () => clearInterval(id);
  }, [loading, spawnParticles, isMobile]);

  // Smooth scroll: Lenis for desktop, native for mobile
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isMobile) {
      document.documentElement.style.scrollBehavior = "smooth";
      return;
    }

    const lenis = new Lenis({
      duration: 1.0,
      smooth: true,
      smoothTouch: false,
      lerp: 0.15,
      easing: (t: number) => 1 - Math.pow(2, -12 * t),
    });

    let frame: number | null = null;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [isMobile]);

  return (
    <>
      {/* Loader */}
      <AnimatePresence onExitComplete={handleLoaderExit}>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 flex items-center justify-center bg-black z-[9999]"
          >
            <img
              src="/logo2.png"
              alt="Logo"
              className="h-32 w-32 sm:h-36 sm:w-36 rounded-full shadow-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      {showContent && (
        <div className="relative min-h-screen bg-white text-gray-900 overflow-hidden">
          <Navbar />
          <main className="flex flex-col w-full overflow-hidden">
            <Hero />
            <ProductsPage />
            <ContactPage />
          </main>
          <Footer />
          <CartSidebar />

          {/* Confetti / particles layer for desktop */}
          {!isMobile && (
            <div className="fixed inset-0 pointer-events-none">
              {particles.map((p) => (
                <ParticleDot key={p.id} {...p} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
