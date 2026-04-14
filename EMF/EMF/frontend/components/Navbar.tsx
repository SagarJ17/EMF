"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Results", href: "#transformations" },
  { label: "BMI Check", href: "#bmi" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-black/5"
            : "bg-transparent"
        }`}
      >
        <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 70 }}>
            {/* Logo */}
            <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <div style={{
                width: 40, height: 40, background: "white", borderRadius: 10,
                position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <Image src="/emflogo.png" alt="EMF Fitness" fill style={{ objectFit: "cover" }} sizes="40px" priority />
              </div>
              <div style={{ lineHeight: 1.15 }}>
                <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 18, color: "#e8450a", letterSpacing: "-0.02em" }}>
                  EMF
                </div>
                <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: 12, color: "#3d3d3d", letterSpacing: "0.04em" }}>
                  Fitness
                </div>
              </div>
            </a>

            {/* Desktop Nav */}
            <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="hidden-mobile">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  style={{
                    fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: 14,
                    color: "#3d3d3d", textDecoration: "none", transition: "color 0.2s",
                    letterSpacing: "0.01em"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#e8450a")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#3d3d3d")}
                >
                  {link.label}
                </a>
              ))}
              <a href="#book" className="btn-orange" style={{ padding: "10px 22px", fontSize: 14 }}>
                Book Free Session
              </a>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: 8, color: "#0f0f0f", display: "none"
              }}
              className="show-mobile"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed", top: 70, left: 0, right: 0, zIndex: 49,
              background: "white", borderBottom: "1px solid rgba(0,0,0,0.08)",
              padding: "16px 24px 24px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block", padding: "14px 0",
                  fontFamily: "Outfit, sans-serif", fontWeight: 600, fontSize: 16,
                  color: "#0f0f0f", textDecoration: "none",
                  borderBottom: "1px solid rgba(0,0,0,0.06)"
                }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#book"
              onClick={() => setMenuOpen(false)}
              className="btn-orange"
              style={{ marginTop: 16, width: "100%", display: "flex" }}
            >
              Book Free Session
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}
