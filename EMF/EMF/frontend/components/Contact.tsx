"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MessageSquare, Loader2, CheckCircle } from "lucide-react";
import { submitContact } from "@/lib/api";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim() || form.name.length < 2) e.name = "Enter your name";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email";
    if (!form.message.trim() || form.message.length < 10) e.message = "Message must be at least 10 characters";
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
      const res = await submitContact(form);
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

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 48, alignItems: "start" }} className="contact-grid">
          
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            {[
              {
                icon: Phone,
                label: "Call / WhatsApp",
                value: "+91 98765 43210",
                href: "tel:+919876543210",
              },
              {
                icon: Mail,
                label: "Email",
                value: "hello@emffitness.com",
                href: "mailto:hello@emffitness.com",
              },
              {
                icon: MessageSquare,
                label: "WhatsApp",
                value: "Chat now for instant reply",
                href: "https://wa.me/919876543210?text=Hi%2C%20I%20want%20to%20start%20personal%20training%20with%20EMF%20Fitness",
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
              style={{ padding: "20px 24px", background: "rgba(232,69,10,0.04)", borderColor: "rgba(232,69,10,0.15)" }}
            >
              <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.7 }}>
                📍 <strong style={{ color: "#0f0f0f" }}>Operating Hours:</strong> Mon–Sat, 6 AM – 9 PM
                <br />
                Home training available across Mumbai. Online coaching worldwide.
              </p>
            </div>
          </motion.div>

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
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <div>
                      <label className="form-label">Name *</label>
                      <input className="form-input" placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                      {errors.name && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.name}</p>}
                    </div>
                    <div>
                      <label className="form-label">Phone</label>
                      <input className="form-input" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <label className="form-label">Email *</label>
                    <input className="form-input" type="email" placeholder="john@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    {errors.email && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.email}</p>}
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label className="form-label">Message *</label>
                    <textarea
                      className="form-input"
                      rows={5}
                      placeholder="Write your message here..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      style={{ resize: "vertical", minHeight: 120 }}
                    />
                    {errors.message && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.message}</p>}
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
                      : <><MessageSquare size={18} /> Send Message</>}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
