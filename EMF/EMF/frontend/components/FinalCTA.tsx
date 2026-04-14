"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section
      id="final-cta"
      style={{
        background: "linear-gradient(135deg, #ff5a1f 0%, #c23a08 100%)",
        padding: "96px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorations */}
      <div style={{
        position: "absolute", top: -80, right: -80,
        width: 320, height: 320, borderRadius: "50%",
        background: "rgba(255,255,255,0.06)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: -60, left: -60,
        width: 256, height: 256, borderRadius: "50%",
        background: "rgba(255,255,255,0.04)", pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16, fontFamily: "Outfit" }}>
            Your Transformation Starts Now
          </p>
          <h2 style={{
            fontFamily: "Outfit", fontWeight: 900,
            fontSize: "clamp(36px, 5vw, 60px)",
            color: "white", lineHeight: 1.1,
            marginBottom: 20, letterSpacing: "-0.03em",
          }}>
            Start Your Fitness Journey Today
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 18, lineHeight: 1.7, marginBottom: 44, maxWidth: 560, margin: "0 auto 44px" }}>
            Over 200 people have already transformed their bodies with EMF Fitness. 
            Your first session is completely free — no commitment, no risk.
          </p>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <motion.a
              href="#book"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "white", color: "#e8450a",
                fontFamily: "Outfit", fontWeight: 800, fontSize: 17,
                padding: "17px 38px", borderRadius: 14,
                textDecoration: "none",
                boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                transition: "box-shadow 0.2s",
              }}
            >
              Book Free Trial <ArrowRight size={20} />
            </motion.a>

            <motion.a
              href="https://wa.me/919876543210?text=Hi%2C%20I%20want%20to%20start%20personal%20training%20with%20EMF%20Fitness"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.15)", color: "white",
                fontFamily: "Outfit", fontWeight: 700, fontSize: 17,
                padding: "16px 32px", borderRadius: 14,
                textDecoration: "none",
                border: "2px solid rgba(255,255,255,0.3)",
                backdropFilter: "blur(8px)",
              }}
            >
              💬 WhatsApp Chat
            </motion.a>
          </div>

          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginTop: 24 }}>
            No gym needed. No long contracts. Just results.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
