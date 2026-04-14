"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Award, Users, Clock, Zap } from "lucide-react";
import { useCMSStore } from "@/store/cmsStore";

export default function About() {
  const { getSetting, loading } = useCMSStore();

  const stats = [
    { icon: Users, value: getSetting("about_stat1_val", "200+"), label: getSetting("about_stat1_lbl", "Clients Transformed") },
    { icon: Award, value: getSetting("about_stat2_val", "4+"), label: getSetting("about_stat2_lbl", "Years Experience") },
    { icon: Clock, value: getSetting("about_stat3_val", "1000+"), label: getSetting("about_stat3_lbl", "Sessions Delivered") },
    { icon: Zap, value: getSetting("about_stat4_val", "100%"), label: getSetting("about_stat4_lbl", "Personalised Plans") },
  ];

  return (
    <section id="about" className="section" style={{ background: "#f9f9f9" }}>
      <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px" }}>
        
        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
            marginBottom: 80,
          }}
          className="stats-grid"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              style={{
                background: "white",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: 20,
                padding: "28px 24px",
                textAlign: "center",
                boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{
                width: 48, height: 48, background: "rgba(232,69,10,0.1)",
                borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 14px"
              }}>
                <stat.icon size={22} color="#e8450a" />
              </div>
              <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 32, color: "#0f0f0f", marginBottom: 4 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 13, color: "#6b7280", fontWeight: 500 }}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main about content */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }} className="about-grid">
          
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ position: "relative" }}
          >
            <div style={{ borderRadius: 28, overflow: "hidden", aspectRatio: "3/4", position: "relative", boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}>
              <Image
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=800&fit=crop&crop=top"
                alt="EMF Fitness trainer"
                fill
                style={{ objectFit: "cover" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%)"
              }} />
            </div>
            {/* Orange accent border */}
            <div style={{
              position: "absolute", bottom: -12, right: -12,
              width: "60%", height: "60%",
              border: "3px solid #e8450a",
              borderRadius: 28, zIndex: -1,
            }} />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <span className="section-badge">About The Founder</span>
            <h2 className="section-title">
              {getSetting("about_title", "Hi, I'm ")} <span>{getSetting("about_name", "Neeraj Bhadauria")}</span>
            </h2>
            
            {loading ? (
               <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                  <div className="skeleton" style={{ height: 16, width: "100%" }} />
                  <div className="skeleton" style={{ height: 16, width: "90%" }} />
                  <div className="skeleton" style={{ height: 16, width: "95%" }} />
               </div>
            ) : (
               <>
                  <p style={{ fontSize: 16, color: "#6b7280", lineHeight: 1.8, marginBottom: 20 }}>
                    {getSetting("about_p1", "With 4+ years of hands-on experience in personal training, I founded EMF Fitness with one mission: to make elite fitness coaching accessible, affordable, and results-driven — without needing a gym.")}
                  </p>
                  <p style={{ fontSize: 16, color: "#6b7280", lineHeight: 1.8, marginBottom: 32 }}>
                    {getSetting("about_p2", "Every programme I build is 100% tailored to the individual — your body type, lifestyle, schedule, and goal. No cookie-cutter plans. No filler exercises. Just proven systems that deliver real results.")}
                  </p>
               </>
            )}

            {/* Certifications */}
            <h4 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 16, color: "#0f0f0f", marginBottom: 14 }}>
              Certifications &amp; Specialties
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 32 }}>
              {getSetting("about_certs", "Certified Personal Trainer (CPT)|Sports Nutrition Specialist|Strength & Conditioning Coach|Mobility & Corrective Exercise")
                .split("|")
                .map((cert) => (
                  <div key={cert} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#3d3d3d", fontWeight: 500 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#e8450a", flexShrink: 0 }} />
                    {cert}
                  </div>
              ))}
            </div>

            <a href="#book" className="btn-orange">Train With Me</a>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .about-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}
