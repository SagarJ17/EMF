"use client";

import { motion } from "framer-motion";
import { Home, Monitor, Flame, Dumbbell, Activity } from "lucide-react";
import { useCMSStore } from "@/store/cmsStore";

const ICON_MAP: Record<string, any> = { Home, Monitor, Flame, Dumbbell, Activity };

const DEFAULT_SERVICES = [
  {
    icon: Home,
    title: "Home Training",
    tag: "Most Popular",
    tagColor: "#e8450a",
    price: "Starting ₹2,999/mo",
    desc: "I come to you. High-intensity, expert-guided personal training sessions delivered at your home — minimal or zero equipment needed.",
    features: ["3–5 sessions per week", "Full equipment-free programming", "Form coaching in real time", "Progress tracking"],
    iconName: "Home"
  },
  {
    icon: Monitor,
    title: "Online Coaching",
    tag: "Flexible",
    tagColor: "#3b82f6",
    price: "Starting ₹1,499/mo",
    desc: "Elite coaching delivered through your phone. Video tutorials, WhatsApp check-ins, and weekly plan updates — anywhere in the world.",
    features: ["Custom workout & diet plan", "Weekly video check-ins", "WhatsApp daily support", "Macro & nutrition tracking"],
    iconName: "Monitor"
  },
  {
    icon: Flame,
    title: "Fat Loss Programme",
    tag: "12-Week Transform",
    tagColor: "#f97316",
    price: "Starting ₹3,999",
    desc: "Structured 12-week fat loss system combining training + nutrition + lifestyle habits for lasting transformation.",
    features: ["Personalised calorie targets", "Progressive training plan", "Weekly body composition review", "Accountability system"],
    iconName: "Flame"
  },
  {
    icon: Dumbbell,
    title: "Strength Training",
    tag: "Build Muscle",
    tagColor: "#8b5cf6",
    price: "Starting ₹2,499/mo",
    desc: "Structured progressive overload programming to build serious strength and lean muscle — at home or with minimal gear.",
    features: ["Periodised strength blocks", "Compound + isolation work", "Deload weeks included", "Strength benchmarks"],
    iconName: "Dumbbell"
  },
  {
    icon: Activity,
    title: "Mobility & Recovery",
    tag: "Feel Stronger",
    tagColor: "#22c55e",
    price: "Starting ₹999/mo",
    desc: "Targeted mobility and flexibility sessions to reduce pain, improve posture, and unlock better athletic performance.",
    features: ["Joint health focus", "Posture correction", "Pre/post-workout routines", "Injury prevention work"],
    iconName: "Activity"
  },
];

export default function Services() {
  const { getSetting, loading } = useCMSStore();
  const servicesStr = getSetting("services_cards", "");

  let activeServices = DEFAULT_SERVICES;
  try {
    if (servicesStr) activeServices = JSON.parse(servicesStr);
  } catch (e) { }

  return (
    <section id="services" style={{ background: "white", padding: "80px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: 60 }}
        >
          <span className="section-badge">What We Offer</span>
          <h2 className="section-title">
            Training <span>Services</span>
          </h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Choose the plan that fits your lifestyle. All programmes are fully customised to you.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="services-grid">
          {loading ? (
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="card skeleton" style={{ height: 320, borderRadius: 24 }} />
            ))
          ) : activeServices.map((service: any, i: number) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="card"
              style={{
                padding: 28,
                position: "relative",
                gridColumn: i === 4 ? "2" : "auto",
              }}

            >
              {/* Tag */}
              <div style={{
                position: "absolute", top: 20, right: 20,
                background: `${service.tagColor}15`,
                color: service.tagColor,
                fontSize: 11, fontWeight: 700, padding: "3px 10px",
                borderRadius: 100, fontFamily: "Outfit", letterSpacing: "0.04em",
              }}>
                {service.tag}
              </div>

              {/* Icon */}
              <div style={{
                width: 52, height: 52,
                background: "rgba(232,69,10,0.08)",
                borderRadius: 14,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 18,
              }}>
                {(() => {
                  const IconComp = ICON_MAP[service.iconName || "Activity"] || Activity;
                  return <IconComp size={24} color="#e8450a" />;
                })()}
              </div>

              <h3 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 20, color: "#0f0f0f", marginBottom: 6 }}>
                {service.title}
              </h3>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#e8450a", marginBottom: 14, fontFamily: "Outfit" }}>
                {service.price}
              </div>
              <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7, marginBottom: 20 }}>{service.desc}</p>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px" }}>
                {service.features.map((f: string) => (
                  <li key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 13, color: "#3d3d3d", fontWeight: 500 }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#e8450a", flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="#book"
                className="btn-outline"
                style={{ width: "100%", fontSize: 14, padding: "11px 20px" }}
              >
                Book Now
              </a>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .services-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .services-grid { grid-template-columns: 1fr !important; }
        }
        .card.services-card:nth-child(5) { grid-column: auto !important; }
      `}</style>
    </section>
  );
}
