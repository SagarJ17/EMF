"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Play, X, Tv2, Camera, Video } from "lucide-react";
import { getVideos, type Video as VideoType } from "@/lib/api";

const PLATFORM_ICON: Record<string, React.ReactNode> = {
  youtube: <Tv2 size={14} color="#ff0000" />,
  instagram: <Camera size={14} color="#e1306c" />,
  manual: <Video size={14} color="#e8450a" />,
};

function extractYoutubeId(url: string): string | null {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function getEmbedUrl(video: VideoType): string {
  if (video.platform === "youtube") {
    const id = extractYoutubeId(video.url);
    return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : video.url;
  }
  return video.url;
}

function SkeletonCard() {
  return (
    <div className="card" style={{ overflow: "hidden" }}>
      <div className="skeleton" style={{ height: 200 }} />
      <div style={{ padding: "16px" }}>
        <div className="skeleton" style={{ height: 16, marginBottom: 8, width: "80%" }} />
        <div className="skeleton" style={{ height: 12, width: "40%" }} />
      </div>
    </div>
  );
}

export default function VideoSection() {
  const [videos, setVideos] = useState<VideoType[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<VideoType | null>(null);

  useEffect(() => {
    getVideos()
      .then(setVideos)
      .catch(() => setVideos([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="videos" style={{ background: "white", padding: "80px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <span className="section-badge"><Play size={12} fill="currentColor" /> Train With Me</span>
          <h2 className="section-title">
            See It In <span>Action</span>
          </h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Get a taste of the training style before you commit. Real sessions, real intensity.
          </p>
        </motion.div>

        <div
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}
          className="video-grid"
        >
          {loading
            ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : videos.map((video, i) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="card video-thumb"
                onClick={() => setActiveVideo(video)}
                style={{ cursor: "pointer", overflow: "hidden" }}
              >
                <div style={{ position: "relative", aspectRatio: "16/9" }}>
                  {video.thumbnail ? (
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      style={{ objectFit: "cover" }}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div style={{ background: "#0f0f0f", width: "100%", height: "100%" }} />
                  )}
                  {/* Dark overlay */}
                  <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)", transition: "opacity 0.2s" }} />
                  {/* Play button */}
                  <div className="play-btn" style={{ zIndex: 2 }}>
                    <Play size={20} color="#e8450a" fill="#e8450a" style={{ marginLeft: 2 }} />
                  </div>
                </div>
                <div style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    {PLATFORM_ICON[video.platform]}
                    <span style={{ fontSize: 11, color: "#9ca3af", fontWeight: 600, textTransform: "capitalize" }}>
                      {video.platform}
                    </span>
                  </div>
                  <h4 style={{ fontFamily: "Outfit", fontWeight: 600, fontSize: 14, color: "#0f0f0f", lineHeight: 1.4 }}>
                    {video.title}
                  </h4>
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Modal */}
      {activeVideo && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "rgba(0,0,0,0.9)", display: "flex",
            alignItems: "center", justifyContent: "center",
            padding: "24px",
          }}
          onClick={() => setActiveVideo(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ width: "100%", maxWidth: 900, position: "relative" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveVideo(null)}
              style={{
                position: "absolute", top: -44, right: 0,
                background: "rgba(255,255,255,0.1)", border: "none",
                borderRadius: 8, padding: "6px 10px", cursor: "pointer",
                color: "white", display: "flex", alignItems: "center", gap: 6, fontSize: 13,
              }}
            >
              <X size={16} /> Close
            </button>
            <div style={{ position: "relative", paddingBottom: "56.25%", borderRadius: 16, overflow: "hidden" }}>
              <iframe
                src={getEmbedUrl(activeVideo)}
                title={activeVideo.title}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) {
          .video-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .video-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
