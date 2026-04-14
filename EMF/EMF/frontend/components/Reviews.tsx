"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";
import { getReviews, type Review } from "@/lib/api";

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {Array(5).fill(0).map((_, i) => (
        <Star
          key={i}
          size={16}
          fill={i < rating ? "#f59e0b" : "none"}
          color={i < rating ? "#f59e0b" : "#d1d5db"}
        />
      ))}
    </div>
  );
}

function SkeletonReview() {
  return (
    <div className="card" style={{ padding: 28 }}>
      <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
        <div className="skeleton" style={{ width: 52, height: 52, borderRadius: "50%", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div className="skeleton" style={{ height: 14, width: "60%", marginBottom: 8 }} />
          <div className="skeleton" style={{ height: 12, width: "40%" }} />
        </div>
      </div>
      <div className="skeleton" style={{ height: 12, marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 12, marginBottom: 8, width: "80%" }} />
      <div className="skeleton" style={{ height: 12, width: "60%" }} />
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getReviews()
      .then(setReviews)
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="reviews" style={{ background: "white", padding: "80px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <span className="section-badge"><Star size={12} fill="currentColor" /> Reviews</span>
          <h2 className="section-title">
            What Clients <span>Say</span>
          </h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Real feedback from real people who trusted EMF Fitness with their transformation.
          </p>

          {/* Summary bar */}
          {!loading && reviews.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 12,
                background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)",
                borderRadius: 100, padding: "8px 20px", marginTop: 16,
              }}
            >
              <StarRating rating={5} />
              <span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 16 }}>
                5.0 / 5.0
              </span>
              <span style={{ color: "#6b7280", fontSize: 14 }}>from {reviews.length}+ reviews</span>
            </motion.div>
          )}
        </motion.div>

        <div
          style={{ 
            display: "flex", overflowX: "auto", gap: 32, 
            scrollSnapType: "x mandatory", margin: "0 -24px", padding: "0 24px 24px" 
          }}
          className="hide-scrollbar"
        >
          {loading ? (
             <div style={{ width: "100%", flexShrink: 0, scrollSnapAlign: "start", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }} className="reviews-grid">
               {Array(6).fill(0).map((_, i) => <SkeletonReview key={i} />)}
             </div>
          ) : (
            Array.from({ length: Math.ceil(reviews.length / 6) }, (_, i) => reviews.slice(i * 6, i * 6 + 6)).map((group, groupIndex) => (
              <div 
                key={groupIndex}
                style={{ width: "100%", flexShrink: 0, scrollSnapAlign: "start", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, alignContent: "flex-start" }} 
                className="reviews-grid"
              >
                {group.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card"
                style={{ padding: 28 }}
              >
                {/* Stars */}
                <StarRating rating={review.rating} />

                {/* Comment */}
                <p style={{
                  fontSize: 14, color: "#3d3d3d", lineHeight: 1.75,
                  margin: "16px 0", fontStyle: "italic",
                }}>
                  &ldquo;{review.comment}&rdquo;
                </p>

                {/* Reviewer */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: 16 }}>
                  {review.image_url ? (
                    <div style={{ width: 44, height: 44, borderRadius: "50%", overflow: "hidden", flexShrink: 0, position: "relative" }}>
                      <Image src={review.image_url} alt={review.name} fill style={{ objectFit: "cover" }} />
                    </div>
                  ) : (
                    <div style={{
                      width: 44, height: 44, borderRadius: "50%",
                      background: "rgba(232,69,10,0.1)", flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "Outfit", fontWeight: 700, color: "#e8450a", fontSize: 18,
                    }}>
                      {review.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 15, color: "#0f0f0f" }}>{review.name}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>EMF Fitness Client</div>
                  </div>
                  <div style={{
                    marginLeft: "auto",
                    background: "rgba(232,69,10,0.08)", color: "#e8450a",
                    fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 100,
                    fontFamily: "Outfit",
                  }}>
                    Verified
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )))}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .reviews-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .reviews-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
