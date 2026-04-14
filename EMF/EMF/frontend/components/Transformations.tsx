"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Quote } from "lucide-react";

const transformations = [
  {
    before: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=500&fit=crop",
    after: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=500&fit=crop&crop=top",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    name: "Rahul S.",
    result: "-12 kg in 3 months",
    quote: "Changed my life completely.",
  },
  {
    before: "https://images.unsplash.com/photo-1609899537878-48715235bbf0?w=400&h=500&fit=crop",
    after: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=400&h=500&fit=crop",
    name: "Priya M.",
    result: "-8 kg + toned",
    quote: "Best investment in myself.",
  },
  {
    before: "https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=400&h=500&fit=crop",
    after: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&h=500&fit=crop",
    name: "Arjun N.",
    result: "+7 kg lean muscle",
    quote: "Results that speak for themselves.",
  },
];

function SkeletonTransformation() {
  return (
    <div className="card" style={{ padding: 24, width: "100%", minWidth: 320, maxWidth: 360, flexShrink: 0, scrollSnapAlign: "start" }}>
      <div className="skeleton" style={{ width: "100%", aspectRatio: "4/5", borderRadius: 12, marginBottom: 20 }} />
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div>
          <div className="skeleton" style={{ height: 20, width: 120, marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 24, width: 140, borderRadius: 100 }} />
        </div>
        <div className="skeleton" style={{ height: 24, width: 24, borderRadius: "50%" }} />
      </div>
      <div className="skeleton" style={{ height: 14, width: "90%", marginBottom: 6 }} />
      <div className="skeleton" style={{ height: 14, width: "60%" }} />
    </div>
  );
}

export default function Transformations() {
  const [data, setData] = useState(transformations);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    fetch(`${apiUrl}/transformations`)
      .then((res) => {
         if (!res.ok) throw new Error("Failed to fetch transformations");
         return res.json();
      })
      .then((fetchedData) => {
         if (fetchedData && fetchedData.length > 0) {
           const formatted = fetchedData.map((d: any) => ({
             before: d.before_image,
             after: d.after_image,
             video: d.video,
             name: d.name,
             result: d.result,
             quote: d.quote,
           }));
           setData(formatted);
         }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="transformations" style={{ background: "#f9f9f9", padding: "80px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: 60 }}
        >
          <span className="section-badge">Real Results</span>
          <h2 className="section-title">
            Client <span>Transformations</span>
          </h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Real people. Real effort. Real results. No filters, no tricks.
          </p>
        </motion.div>

        <div
          style={{ 
            display: "flex", overflowX: "auto", gap: 28, 
            scrollSnapType: "x mandatory", paddingBottom: 24, margin: "0 -24px", padding: "0 24px 24px"
          }}
          className="hide-scrollbar"
        >
          {loading
            ? Array(4).fill(0).map((_, i) => <SkeletonTransformation key={i} />)
            : data.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card"
              style={{ overflow: "hidden", minWidth: 320, maxWidth: 360, flexShrink: 0, scrollSnapAlign: "start" }}
            >
              {/* Before/After images or Video */}
              {t.video ? (
                <div style={{ position: "relative", aspectRatio: "4/5", background: "black" }}>
                  <video
                    src={t.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div style={{
                    position: "absolute", top: 8, left: 8,
                    background: "#e8450a", color: "white",
                    fontSize: 11, fontWeight: 700, padding: "3px 10px",
                    borderRadius: 100, fontFamily: "Outfit",
                  }}>VIDEO</div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", position: "relative" }}>
                  <div style={{ position: "relative", aspectRatio: "4/5", background: "#111827" }}>
                    <Image src={t.before!} alt={`Before - ${t.name}`} fill style={{ objectFit: "contain" }} unoptimized={t.before?.includes("localhost") || t.before?.includes("127.0.0.1")} priority={i < 2} />
                    <div style={{
                      position: "absolute", top: 8, left: 8,
                      background: "rgba(0,0,0,0.7)", color: "white",
                      fontSize: 11, fontWeight: 700, padding: "3px 10px",
                      borderRadius: 100, fontFamily: "Outfit",
                    }}>BEFORE</div>
                  </div>
                  <div style={{ position: "relative", aspectRatio: "4/5", background: "#111827" }}>
                    <Image src={t.after!} alt={`After - ${t.name}`} fill style={{ objectFit: "contain" }} unoptimized={t.after?.includes("localhost") || t.after?.includes("127.0.0.1")} priority={i < 2} />
                    <div style={{
                      position: "absolute", top: 8, right: 8,
                      background: "#e8450a", color: "white",
                      fontSize: 11, fontWeight: 700, padding: "3px 10px",
                      borderRadius: 100, fontFamily: "Outfit",
                    }}>AFTER</div>
                  </div>
                  {/* Divider line */}
                  <div style={{
                    position: "absolute", top: 0, bottom: 0, left: "50%",
                    width: 2, background: "white", transform: "translateX(-50%)",
                  }} />
                </div>
              )}

              {/* Info */}
              <div style={{ padding: "20px 22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 17, color: "#0f0f0f" }}>{t.name}</div>
                    <div style={{
                      display: "inline-block", marginTop: 4,
                      background: "rgba(232,69,10,0.1)", color: "#e8450a",
                      fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 100,
                    }}>
                      {t.result}
                    </div>
                  </div>
                  <Quote size={20} color="#e8450a" opacity={0.4} />
                </div>
                <p style={{ fontSize: 14, color: "#6b7280", fontStyle: "italic" }}>&ldquo;{t.quote}&rdquo;</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginTop: 48 }}
        >
          <a href="#book" className="btn-orange">Start Your Transformation</a>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .transform-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .transform-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
