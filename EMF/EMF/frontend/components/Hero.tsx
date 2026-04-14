"use client";

import { motion } from "framer-motion";
import { ArrowRight, Gift, Star, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useCMSStore } from "@/store/cmsStore";

export default function Hero() {
  const { getSetting } = useCMSStore();
  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #fff 0%, #fff8f5 50%, #fff 100%)",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        paddingTop: 70,
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          top: -200,
          right: -200,
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,69,10,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -100,
          left: -100,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(232,69,10,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 60,
            alignItems: "center",
          }}
          className="hero-grid"
        >
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ marginBottom: 24 }}
            >
              <span className="section-badge">
                <Star size={12} fill="currentColor" />
                {getSetting("hero_badge", "Rated 5.0 by 200+ Clients")}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                color: "#0f0f0f",
                marginBottom: 20,
              }}
            >
              {getSetting("hero_headline", "Transform Your Body\nWithout Leaving\nHome")}
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              style={{
                fontSize: 18,
                color: "#6b7280",
                lineHeight: 1.7,
                marginBottom: 36,
                maxWidth: 480,
              }}
            >
              {getSetting("hero_subheadline", "Elite personal training brought to your doorstep. Customised workouts, personalised nutrition, and real accountability — all from the comfort of home.")}
            </motion.p>

            {/* Trust pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 36 }}
            >
              {[
                "200+ Clients Transformed",
                "Home & Online",
                "5★ Rated",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    background: "white",
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: 100,
                    padding: "6px 14px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#3d3d3d",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <CheckCircle size={14} color="#e8450a" />
                  {item}
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              style={{ display: "flex", gap: 14, flexWrap: "wrap" }}
            >
              <a href={getSetting("train_with_me_link", "#book")} className="btn-orange" style={{ fontSize: 16, padding: "16px 32px" }}>
                Train With Me <ArrowRight size={18} />
              </a>
              <a href="#lead-magnet" className="btn-outline" style={{ fontSize: 16, padding: "15px 28px" }}>
                <Gift size={18} /> Get Free Diet Plan
              </a>
            </motion.div>
          </motion.div>

          {/* Right — Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
            style={{ position: "relative" }}
            className="hero-image-col"
          >
            {/* Glow bg */}
            <div
              style={{
                position: "absolute",
                inset: -20,
                borderRadius: 32,
                background: "radial-gradient(ellipse at center, rgba(232,69,10,0.12) 0%, transparent 70%)",
              }}
            />

            {/* Main image */}
            <div
              style={{
                borderRadius: 28,
                overflow: "hidden",
                position: "relative",
                aspectRatio: "4/5",
                boxShadow: "0 24px 64px rgba(0,0,0,0.12)",
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=750&fit=crop&crop=top"
                alt="EMF Fitness personal trainer"
                fill
                style={{ objectFit: "cover" }}
                priority
              />
              {/* Gradient overlay at bottom */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "40%",
                  background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)",
                }}
              />
              {/* Slots badge */}
              <div
                style={{
                  position: "absolute",
                  bottom: 20,
                  left: 20,
                  right: 20,
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: 14,
                  padding: "12px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 10, height: 10, borderRadius: "50%",
                    background: "#22c55e",
                    boxShadow: "0 0 0 3px rgba(34,197,94,0.3)",
                    animation: "pulse 2s infinite",
                    flexShrink: 0,
                  }}
                />
                <div>
                  <div style={{ fontSize: 12, color: "white", fontWeight: 700, fontFamily: "Outfit, sans-serif" }}>
                    🔥 Only 5 Slots Left This Month
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>
                    Limited availability for new clients
                  </div>
                </div>
              </div>
            </div>

            {/* Floating stat cards */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute",
                top: 30,
                right: -20,
                background: "white",
                borderRadius: 16,
                padding: "14px 18px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                minWidth: 140,
              }}
            >
              <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "Outfit", color: "#e8450a" }}>200+</div>
              <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>Lives Transformed</div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              style={{
                position: "absolute",
                bottom: 100,
                left: -30,
                background: "white",
                borderRadius: 16,
                padding: "14px 18px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                minWidth: 140,
              }}
            >
              <div style={{ fontSize: 24, fontWeight: 800, fontFamily: "Outfit", color: "#e8450a" }}>4 yrs</div>
              <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>Training Experience</div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(34,197,94,0.3); }
          50% { box-shadow: 0 0 0 6px rgba(34,197,94,0.1); }
        }
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            text-align: center !important;
          }
          .hero-image-col {
            order: -1;
          }
        }
      `}</style>
    </section>
  );
}
