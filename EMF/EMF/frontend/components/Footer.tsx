"use client";

import { motion } from "framer-motion";
import { Instagram, Youtube, Phone, Mail } from "lucide-react";
import Image from "next/image";
import { useCMSStore } from "@/store/cmsStore";

export default function Footer() {
  const { getSetting } = useCMSStore();
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "#0f0f0f", padding: "60px 0 32px" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        
        {/* Top row */}
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: 40, marginBottom: 48 }} className="footer-grid">
          
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40,
                background: "white", borderRadius: 10, display: "flex",
                alignItems: "center", justifyContent: "center", position: "relative",
                overflow: "hidden"
              }}>
                <Image src="/emflogo.png" alt="EMF Fitness" fill style={{ objectFit: "cover" }} sizes="40px" />
              </div>
              <div style={{ lineHeight: 1.15 }}>
                <div style={{ fontFamily: "Outfit, sans-serif", fontWeight: 800, fontSize: 18, color: "#e8450a", letterSpacing: "-0.02em" }}>
                  EMF <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 400 }}>Fitness</span>
                </div>
              </div>
            </div>
            <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7, maxWidth: 260, marginBottom: 20 }}>
              {getSetting("footer_blurb", "Elite personal training at home and online. Transforming lives one session at a time.")}
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <a href={getSetting("social_instagram", "https://instagram.com")} target="_blank" aria-label="Instagram" style={{
                width: 38, height: 38, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "all 0.2s", color: "#6b7280", textDecoration: "none"
              }} onMouseEnter={(e) => { e.currentTarget.style.color = "#e8450a"; e.currentTarget.style.borderColor = "rgba(232,69,10,0.3)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
                <Instagram size={17} />
              </a>
              <a href={getSetting("social_youtube", "https://youtube.com")} target="_blank" aria-label="YouTube" style={{
                width: 38, height: 38, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "all 0.2s", color: "#6b7280", textDecoration: "none"
              }} onMouseEnter={(e) => { e.currentTarget.style.color = "#e8450a"; e.currentTarget.style.borderColor = "rgba(232,69,10,0.3)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
                <Youtube size={17} />
              </a>
              <a href={getSetting("social_whatsapp", "https://wa.me/something")} target="_blank" aria-label="WhatsApp" style={{
                width: 38, height: 38, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "all 0.2s", color: "#6b7280", textDecoration: "none"
              }} onMouseEnter={(e) => { e.currentTarget.style.color = "#e8450a"; e.currentTarget.style.borderColor = "rgba(232,69,10,0.3)"; }} onMouseLeave={(e) => { e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h5 style={{ fontFamily: "Outfit", fontWeight: 700, color: "white", fontSize: 14, marginBottom: 16, letterSpacing: "0.04em" }}>SERVICES</h5>
            {["Home Training", "Online Coaching", "Fat Loss", "Strength Training", "Mobility"].map((link) => (
              <a key={link} href="#services" style={{ display: "block", color: "#6b7280", fontSize: 14, marginBottom: 10, textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#e8450a")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
              >
                {link}
              </a>
            ))}
          </div>

          <div>
            <h5 style={{ fontFamily: "Outfit", fontWeight: 700, color: "white", fontSize: 14, marginBottom: 16, letterSpacing: "0.04em" }}>TOOLS</h5>
            {["BMI Calculator", "Free Diet Plan", "Book Session", "Reviews"].map((link) => (
              <a key={link} href={`#${link.toLowerCase().replace(/ /g, "-")}`} style={{ display: "block", color: "#6b7280", fontSize: 14, marginBottom: 10, textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#e8450a")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
              >
                {link}
              </a>
            ))}
          </div>

          <div>
            <h5 style={{ fontFamily: "Outfit", fontWeight: 700, color: "white", fontSize: 14, marginBottom: 16, letterSpacing: "0.04em" }}>CONTACT</h5>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <a href="tel:+919876543210" style={{ display: "flex", gap: 10, alignItems: "center", color: "#6b7280", fontSize: 14, textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#e8450a")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
              >
                <Phone size={14} /> +91 98765 43210
              </a>
              <a href="mailto:hello@emffitness.com" style={{ display: "flex", gap: 10, alignItems: "center", color: "#6b7280", fontSize: 14, textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#e8450a")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
              >
                <Mail size={14} /> hello@emffitness.com
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <p style={{ color: "#4b5563", fontSize: 13 }}>
            © {year} EMF Fitness. All rights reserved.
          </p>
          <p style={{ color: "#4b5563", fontSize: 13 }}>
            Built with 🧡 for real results.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
