"use client";

import { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Flame, ArrowRight } from "lucide-react";

const TOTAL_SLOTS = 5;
const TAKEN_SLOTS = 4;

export default function UrgencySection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (inView) {
      setTimeout(() => setWidth((TAKEN_SLOTS / TOTAL_SLOTS) * 100), 300);
    }
  }, [inView]);

  return (
    <section
      id="urgency"
      style={{
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)",
        padding: "80px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 600, height: 300,
        background: "radial-gradient(ellipse, rgba(232,69,10,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }} ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(232,69,10,0.15)", border: "1px solid rgba(232,69,10,0.3)",
            borderRadius: 100, padding: "8px 18px", marginBottom: 24,
          }}>
            <Flame size={16} color="#e8450a" />
            <span style={{ color: "#e8450a", fontSize: 13, fontWeight: 700, fontFamily: "Outfit" }}>
              Limited Availability — April 2026
            </span>
          </div>

          <h2 style={{
            fontFamily: "Outfit", fontWeight: 900, fontSize: "clamp(32px, 4vw, 52px)",
            color: "white", lineHeight: 1.1, marginBottom: 16,
          }}>
            Only <span style={{ color: "#e8450a" }}>1 Slot Left</span> This Month
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 17, lineHeight: 1.7, marginBottom: 40 }}>
            We keep client numbers small to ensure every person gets elite-level attention. 
            Don&apos;t miss your chance to join this month&apos;s cohort.
          </p>

          {/* Progress */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>Slots filled this month</span>
              <span style={{ color: "#e8450a", fontFamily: "Outfit", fontWeight: 700, fontSize: 13 }}>
                {TAKEN_SLOTS} / {TOTAL_SLOTS} taken
              </span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${width}%` }} />
            </div>

            {/* Slot indicators */}
            <div style={{ display: "flex", gap: 8, marginTop: 14, justifyContent: "center" }}>
              {Array(TOTAL_SLOTS).fill(0).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{ delay: i * 0.1 + 0.5 }}
                  style={{
                    width: 40, height: 40, borderRadius: 10,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, fontFamily: "Outfit",
                    background: i < TAKEN_SLOTS
                      ? "linear-gradient(135deg, #ff5a1f, #c23a08)"
                      : "rgba(255,255,255,0.08)",
                    color: i < TAKEN_SLOTS ? "white" : "rgba(255,255,255,0.3)",
                    border: i < TAKEN_SLOTS ? "none" : "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {i < TAKEN_SLOTS ? "✓" : i + 1}
                </motion.div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#book" className="btn-orange" style={{ fontSize: 16, padding: "16px 36px" }}>
              Claim My Slot <ArrowRight size={18} />
            </a>
            <a
              href="https://wa.me/919876543210?text=Hi%2C%20I%20want%20to%20start%20personal%20training%20with%20EMF%20Fitness"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 12, padding: "15px 28px",
                color: "white", fontFamily: "Outfit", fontWeight: 700, fontSize: 16,
                textDecoration: "none", transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
              }}
            >
              💬 Chat on WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
