"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Quote, Play, ChevronLeft, ChevronRight } from "lucide-react";

// ── Sample data (shown when API returns nothing) ─────────────────────────────
const SAMPLE_TRANSFORMATIONS = [
  {
    before: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=500&fit=crop",
    after: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=500&fit=crop&crop=top",
    name: "Rahul S.",
    result: "-12 kg in 3 months",
    quote: "Changed my life completely. Best investment I ever made.",
  },
  {
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    name: "Priya M.",
    result: "-8 kg + toned",
    quote: "Best investment in myself. Love the results.",
  },
  {
    before: "https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=400&h=500&fit=crop",
    after: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&h=500&fit=crop",
    name: "Arjun N.",
    result: "+7 kg lean muscle",
    quote: "Results that speak for themselves. 100% recommend.",
  },
  {
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    name: "Sneha R.",
    result: "-6 kg in 6 weeks",
    quote: "Never thought I'd feel this fit. The programme is incredible.",
  },
  {
    before: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&h=500&fit=crop",
    after: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=400&h=500&fit=crop",
    name: "Vikram P.",
    result: "-15 kg, 4 months",
    quote: "Discipline + right guidance = real transformation.",
  },
  {
    before: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=500&fit=crop",
    after: "https://images.unsplash.com/photo-1583454155184-870a1f63aebc?w=400&h=500&fit=crop",
    name: "Meera K.",
    result: "Full body toning",
    quote: "Posture improved, energy is through the roof!",
  },
];

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      style={{
        background: "white",
        borderRadius: 20,
        overflow: "hidden",
        minWidth: 300,
        maxWidth: 320,
        flexShrink: 0,
        scrollSnapAlign: "start",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
      }}
    >
      <div className="skeleton" style={{ width: "100%", aspectRatio: "3/4" }} />
      <div style={{ padding: "20px 22px" }}>
        <div className="skeleton" style={{ height: 18, width: "55%", marginBottom: 10, borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 14, width: "80%", marginBottom: 6, borderRadius: 6 }} />
        <div className="skeleton" style={{ height: 14, width: "60%", borderRadius: 6 }} />
      </div>
    </div>
  );
}

// ── Lazy video with skeleton ──────────────────────────────────────────────────
function LazyVideo({ src, poster }: { src: string; poster?: string }) {
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ position: "relative", width: "100%", height: "100%", background: "#111" }}
    >
      {/* Skeleton shimmer until ready */}
      {!ready && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, #1a1a1a 25%, #2d2d2d 50%, #1a1a1a 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Play size={20} color="rgba(255,255,255,0.4)" />
          </div>
        </div>
      )}

      {inView && (
        src.includes("youtube.com") || src.includes("youtu.be") ? (
          <iframe
            src={src.includes("watch?v=") ? src.replace("watch?v=", "embed/") : src.includes("/shorts/") ? src.replace("/shorts/", "/embed/") : src.replace("youtu.be/", "www.youtube.com/embed/")}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setReady(true)}
            style={{
              width: "100%",
              height: "100%",
              border: "none",
              display: "block",
              opacity: 1
            }}
          />
        ) : (
          <video
            src={src}
            poster={poster}
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            onLoadedData={() => setReady(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              opacity: 1, // Fix opacity stuck issue
            }}
          />
        )
      )}
    </div>
  );
}

// ── Lazy image with skeleton ──────────────────────────────────────────────────
function LazyImg({ src, alt, isLocal }: { src: string; alt: string; isLocal?: boolean }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "#eee" }}>
      {!loaded && <div className="skeleton" style={{ position: "absolute", inset: 0, borderRadius: 0 }} />}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 50vw, 200px"
        style={{ objectFit: "cover", opacity: loaded ? 1 : 0, transition: "opacity 0.4s" }}
        unoptimized={isLocal}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function Transformations() {
  const [data, setData] = useState(SAMPLE_TRANSFORMATIONS);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    fetch(`${apiUrl}/transformations`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((fetched) => {
        if (fetched && fetched.length > 0) {
          const formatted = fetched.map((d: any) => ({
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
      .catch(() => { /* silently use sample data */ })
      .finally(() => setLoading(false));
  }, []);

  // Uniform card dimensions
  const CARD_STYLE: React.CSSProperties = {
    background: "white",
    borderRadius: 20,
    overflow: "hidden",
    minWidth: 300,
    maxWidth: 320,
    flexShrink: 0,
    scrollSnapAlign: "start",
    border: "1px solid rgba(0,0,0,0.06)",
    boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
    transition: "box-shadow 0.3s, transform 0.3s",
  };

  // Every card media area has the same fixed aspect ratio
  const MEDIA_ASPECT: React.CSSProperties = {
    width: "100%",
    aspectRatio: "3/4",
    overflow: "hidden",
    position: "relative",
    flexShrink: 0,
  };

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

        <div style={{ position: "relative" }}>
          {/* Slider Controls */}
          {!loading && data.length > 3 && (
            <>
              <button
                onClick={() => scrollRef.current?.scrollBy({ left: -320, behavior: "smooth" })}
                style={{
                  position: "absolute", left: -20, top: "40%", transform: "translateY(-50%)", zIndex: 10,
                  width: 44, height: 44, background: "white", borderRadius: "50%",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center",
                  border: "1px solid #f3f4f6", cursor: "pointer"
                }}
              >
                <ChevronLeft size={24} color="#e8450a" />
              </button>
              <button
                onClick={() => scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" })}
                style={{
                  position: "absolute", right: -20, top: "40%", transform: "translateY(-50%)", zIndex: 10,
                  width: 44, height: 44, background: "white", borderRadius: "50%",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center",
                  border: "1px solid #f3f4f6", cursor: "pointer"
                }}
              >
                <ChevronRight size={24} color="#e8450a" />
              </button>
            </>
          )}

          {/* Horizontal scroll slider */}
          <div
            ref={scrollRef}
            style={{
              display: "flex",
              gap: 20,
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              padding: "0 8px 24px",
              scrollPaddingLeft: 8,
              WebkitOverflowScrolling: "touch",
            }}
            className="hide-scrollbar"
          >
          {loading
            ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : data.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                style={CARD_STYLE}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.14)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 16px rgba(0,0,0,0.04)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                {/* ── Uniform media block ─────────────── */}
                <div style={MEDIA_ASPECT}>
                  {t.video ? (
                    <>
                      <LazyVideo src={t.video} />
                      {/* VIDEO badge */}
                      <div style={{
                        position: "absolute", top: 10, left: 10, zIndex: 10,
                        background: "#e8450a", color: "white",
                        fontSize: 10, fontWeight: 800, padding: "3px 10px",
                        borderRadius: 100, fontFamily: "Outfit", letterSpacing: "0.06em",
                      }}>▶ VIDEO</div>
                    </>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", height: "100%", position: "relative" }}>
                      {/* Before */}
                      <div style={{ position: "relative", overflow: "hidden" }}>
                        {t.before && (
                          <LazyImg
                            src={t.before}
                            alt={`Before - ${t.name}`}
                            isLocal={t.before?.includes("localhost") || t.before?.includes("127.0.0.1")}
                          />
                        )}
                        <div style={{
                          position: "absolute", top: 8, left: 8, zIndex: 5,
                          background: "rgba(0,0,0,0.65)", color: "white",
                          fontSize: 10, fontWeight: 800, padding: "3px 10px",
                          borderRadius: 100, fontFamily: "Outfit", letterSpacing: "0.06em",
                        }}>BEFORE</div>
                      </div>
                      {/* After */}
                      <div style={{ position: "relative", overflow: "hidden" }}>
                        {t.after && (
                          <LazyImg
                            src={t.after}
                            alt={`After - ${t.name}`}
                            isLocal={t.after?.includes("localhost") || t.after?.includes("127.0.0.1")}
                          />
                        )}
                        <div style={{
                          position: "absolute", top: 8, right: 8, zIndex: 5,
                          background: "#e8450a", color: "white",
                          fontSize: 10, fontWeight: 800, padding: "3px 10px",
                          borderRadius: 100, fontFamily: "Outfit", letterSpacing: "0.06em",
                        }}>AFTER</div>
                      </div>
                      {/* Divider */}
                      <div style={{
                        position: "absolute", top: 0, bottom: 0, left: "50%",
                        width: 2, background: "white", transform: "translateX(-50%)", zIndex: 4,
                      }} />
                    </div>
                  )}
                </div>

                {/* ── Info ──────────────────────────────── */}
                <div style={{ padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 16, color: "#0f0f0f", marginBottom: 4 }}>{t.name}</div>
                      {t.result && (
                        <div style={{
                          display: "inline-block",
                          background: "rgba(232,69,10,0.1)", color: "#e8450a",
                          fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 100,
                        }}>
                          {t.result}
                        </div>
                      )}
                    </div>
                    <Quote size={18} color="#e8450a" opacity={0.35} />
                  </div>
                  {t.quote && (
                    <p style={{ fontSize: 13, color: "#6b7280", fontStyle: "italic", lineHeight: 1.55, margin: 0 }}>
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginTop: 40 }}
        >
          <a href="#contact" className="btn-orange">Start Your Transformation</a>
        </motion.div>
      </div>
    </section>
  );
}
