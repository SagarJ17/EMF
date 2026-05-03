"use client";

import { motion } from "framer-motion";
import { Home, Target, Clock, TrendingUp, Shield, Zap, MapPin } from "lucide-react";

import { useCMSStore } from "@/store/cmsStore";

export default function WhyEMF() {
  const { getSetting } = useCMSStore();
  
  const reasons = [
    {
      icon: Home,
      title: "Train at Home",
      desc: "No gym commute. No waiting for machines. Get a world-class workout delivered to your living room.",
      color: "#e8450a",
      linkTitle: "Watch Home Workouts",
      linkHref: getSetting("social_youtube", "https://youtube.com"),
    },
    {
      icon: MapPin,
      title: "Train at Centre",
      desc: "Prefer a professional setup? Train in a fully equipped fitness centre with expert guidance and zero distractions.",
      color: "#f97316",
      linkTitle: "See Our Centre",
      linkHref: getSetting("social_instagram", "https://www.instagram.com/emf.fitness?igsh=MTVhZTFjN2o1N2xhbQ=="),
    },
  ];

  return (
    <section id="why" className="section" style={{ background: "white" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: 60 }}
        >
          <span className="section-badge">About EMF Fitness</span>
          <h2 className="section-title">
            About <span>EMF Fitness</span>
          </h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            We&apos;re not another generic personal training service. We obsess over your results.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
          }}
          className="why-grid"
        >
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="card"
              style={{ padding: 28 }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "#e8450a";
                (e.currentTarget as HTMLElement).style.borderWidth = "1px";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,0,0,0.08)";
              }}
            >
              <div
                style={{
                  width: 52, height: 52,
                  background: `rgba(232,69,10,0.1)`,
                  borderRadius: 14,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <reason.icon size={24} color="#e8450a" />
              </div>
              <h3 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 19, color: "#0f0f0f", marginBottom: 10 }}>
                {reason.title}
              </h3>
              <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7, flex: 1 }}>{reason.desc}</p>
              
              <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                <a href={reason.linkHref} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: reason.color, textDecoration: "none" }}>
                  {reason.linkTitle} →
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .why-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .why-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
