"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, MessageCircle, Loader2, CheckCircle } from "lucide-react";
import { submitContact } from "@/lib/api";

const DEFAULT_MESSAGE = "I want to start personal/centre training";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: DEFAULT_MESSAGE,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim() || form.name.length < 2) e.name = "Please enter your full name";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.replace(/\s+/g, ''))) e.phone = "Please enter a valid 10-digit phone number";
    // Email is optional — only validate format if provided
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Enter a valid email address";
    }
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    setApiError(null);
    try {
      const payload = {
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        message: form.message || undefined,
      };
      const res = await submitContact(payload as any);
      setSuccess(res.message);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" style={{ background: "#f9f9f9", padding: "80px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <span className="section-badge">Get in Touch</span>
          <h2 className="section-title">
            Contact <span>Us</span>
          </h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Have a question before you commit? We&apos;re happy to help — reach out any way you prefer.
          </p>
        </motion.div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 48, alignItems: "start" }}
          className="contact-grid"
        >
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <div className="card" style={{ padding: 36 }}>
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: "center", padding: 20 }}
                >
                  <CheckCircle size={48} color="#22c55e" style={{ margin: "0 auto 16px", display: "block" }} />
                  <h3 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Message Sent!</h3>
                  <p style={{ color: "#6b7280", fontSize: 15 }}>{success}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Name (mandatory) + Phone (mandatory) */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} className="form-row">
                    <div>
                      <label className="form-label">
                        Name <span style={{ color: "#e8450a" }}>*</span>
                      </label>
                      <input
                        className="form-input"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                      />
                      {errors.name && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.name}</p>}
                    </div>
                    <div>
                      <label className="form-label">
                        Phone <span style={{ color: "#e8450a" }}>*</span>
                      </label>
                      <input
                        className="form-input"
                        placeholder="+91 98765 43210"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '') })}
                        type="tel"
                        maxLength={10}
                      />
                      {errors.phone && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Email (optional) */}
                  <div style={{ marginBottom: 16 }}>
                    <label className="form-label">
                      Email <span style={{ color: "#9ca3af", fontSize: 11, fontWeight: 500 }}>(optional)</span>
                    </label>
                    <input
                      className="form-input"
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    {errors.email && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.email}</p>}
                  </div>

                  {/* Message (optional, has default value) */}
                  <div style={{ marginBottom: 24 }}>
                    <label className="form-label">
                      Message <span style={{ color: "#9ca3af", fontSize: 11, fontWeight: 500 }}>(optional)</span>
                    </label>
                    <textarea
                      className="form-input"
                      rows={4}
                      placeholder={DEFAULT_MESSAGE}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      style={{ resize: "vertical", minHeight: 100 }}
                    />
                  </div>

                  {apiError && (
                    <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, color: "#ef4444", fontSize: 14 }}>
                      {apiError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn-orange"
                    disabled={loading}
                    style={{ width: "100%", fontSize: 16 }}
                  >
                    {loading
                      ? <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Sending...</>
                      : <><MessageCircle size={18} /> Send Message</>}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Info cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            {[
              {
                icon: Phone,
                label: "Call",
                value: "+91 9819406259",
                href: "tel:+919819406259",
              },
              {
                icon: MessageCircle,
                label: "WhatsApp",
                value: "Chat now for instant reply",
                href: "https://wa.me/919819406259?text=Hi%2C%20I%20want%20to%20start%20personal%20training%20with%20EMF%20Fitness",
              },
            ].map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <div
                  className="card"
                  style={{ padding: "20px 24px", display: "flex", gap: 16, alignItems: "center", transition: "all 0.2s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#e8450a"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,0,0,0.08)"; }}
                >
                  <div style={{
                    width: 48, height: 48, background: "rgba(232,69,10,0.1)",
                    borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <Icon size={20} color="#e8450a" />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: "#9ca3af", fontWeight: 600, marginBottom: 2 }}>{label}</div>
                    <div style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 15, color: "#0f0f0f" }}>{value}</div>
                  </div>
                </div>
              </a>
            ))}

            <div
              className="card"
              style={{
                padding: "20px 24px",
                background: "rgba(232,69,10,0.04)",
                borderColor: "rgba(232,69,10,0.15)",
              }}
            >
              <div style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <span>📍</span>
                  <div>
                    Home training available across Mumbai. Train at a professional fitness centre.
                  </div>
                </div>
              </div>
            </div>

            {/* Centre Address Box */}
            <div
              className="card"
              style={{
                padding: "20px 24px",
                background: "rgba(34,197,94,0.04)",
                borderColor: "rgba(34,197,94,0.15)",
                marginTop: -8,
              }}
            >
              <div style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <span>🏢</span>
                  <div>
                    <strong style={{ color: "#0f0f0f" }}>Centre Address:</strong>
                    <div style={{ marginTop: 4 }}>
                      Shop no. 1,2,3, Gulmohar CHS,LTD. <br /> 
                      Sitaram Patkar Rd, Piramal Nagar <br />
                      Goregaon West, Mumbai, MH-400104.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
