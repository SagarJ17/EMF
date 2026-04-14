"use client";

export default function StickyMobileCTA() {
  const waUrl =
    "https://wa.me/919876543210?text=Hi%2C%20I%20want%20to%20start%20personal%20training%20with%20EMF%20Fitness";

  return (
    <div className="sticky-cta" id="sticky-mobile-cta">
      <a
        href="#book"
        id="sticky-book-btn"
        style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          gap: 8, background: "linear-gradient(135deg, #ff5a1f, #c23a08)",
          color: "white", fontFamily: "Outfit", fontWeight: 700, fontSize: 15,
          padding: "13px 16px", borderRadius: 12, textDecoration: "none",
          boxShadow: "0 4px 16px rgba(232,69,10,0.3)",
        }}
      >
        📅 Book Free Session
      </a>
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        id="sticky-wa-btn"
        style={{
          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
          gap: 8, background: "#25d366",
          color: "white", fontFamily: "Outfit", fontWeight: 700, fontSize: 15,
          padding: "13px 16px", borderRadius: 12, textDecoration: "none",
          boxShadow: "0 4px 16px rgba(37,211,102,0.3)",
        }}
      >
        💬 WhatsApp
      </a>
    </div>
  );
}
