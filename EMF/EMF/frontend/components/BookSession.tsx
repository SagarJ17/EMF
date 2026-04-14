"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Loader2, CheckCircle, MapPin, Clock } from "lucide-react";
import { submitBooking } from "@/lib/api";

const GOALS = ["Fat Loss", "Muscle Gain", "Improve Fitness", "Strength", "Mobility", "General Health"];
const TIMES = ["6:00 AM – 9:00 AM", "9:00 AM – 12:00 PM", "12:00 PM – 3:00 PM", "3:00 PM – 6:00 PM", "6:00 PM – 9:00 PM"];

export default function BookSession() {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", goal: "", preferred_time: "", location: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim() || form.name.length < 2) e.name = "Enter your full name";
    if (!form.phone.match(/^\+?[\d\s\-()]{7,}$/)) e.phone = "Enter a valid phone number";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email";
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
      const res = await submitBooking(form);
      setSuccess(res.message);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="book" style={{ background: "#f9f9f9", padding: "80px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }} className="book-grid">
          
          {/* Left — Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge"><Calendar size={12} /> Book Now</span>
            <h2 className="section-title">
              Book Your <span>Free</span> Session
            </h2>
            <p style={{ fontSize: 17, color: "#6b7280", lineHeight: 1.7, marginBottom: 36, maxWidth: 420 }}>
              Start with a completely free consultation session. We assess your fitness level, understand your goal, and design your programme — zero pressure.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { icon: CheckCircle, text: "100% free — no credit card required" },
                { icon: Clock, text: "45-minute introductory session" },
                { icon: MapPin, text: "At your home or online via video" },
                { icon: Calendar, text: "Book in under 2 minutes" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{
                    width: 40, height: 40, background: "rgba(232,69,10,0.1)",
                    borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Icon size={18} color="#e8450a" />
                  </div>
                  <p style={{ fontSize: 15, color: "#3d3d3d", fontWeight: 500, paddingTop: 8 }}>{text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Form */}
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
                  <div style={{
                    width: 80, height: 80,
                    background: "rgba(232,69,10,0.1)", border: "2px solid #e8450a",
                    borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 20px"
                  }}>
                    <CheckCircle size={36} color="#e8450a" />
                  </div>
                  <h3 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 22, color: "#0f0f0f", marginBottom: 12 }}>
                    Booking Confirmed! 🎉
                  </h3>
                  <p style={{ color: "#6b7280", fontSize: 15, lineHeight: 1.6 }}>{success}</p>
                  <div style={{
                    background: "rgba(232,69,10,0.08)", borderRadius: 12, padding: 16, marginTop: 20,
                  }}>
                    <p style={{ fontSize: 13, color: "#e8450a", fontWeight: 600 }}>
                      💬 We&apos;ll reach out on WhatsApp within 24 hours with your session details.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 20, color: "#0f0f0f", marginBottom: 24 }}>
                    Your Details
                  </h3>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <div>
                      <label className="form-label">Full Name *</label>
                      <input className="form-input" placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                      {errors.name && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.name}</p>}
                    </div>
                    <div>
                      <label className="form-label">Phone *</label>
                      <input className="form-input" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                      {errors.phone && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.phone}</p>}
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label className="form-label">Email *</label>
                    <input className="form-input" type="email" placeholder="john@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    {errors.email && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>{errors.email}</p>}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                    <div>
                      <label className="form-label">Your Goal</label>
                      <select className="form-input" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })}>
                        <option value="">Select goal</option>
                        {GOALS.map((g) => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="form-label">Preferred Time</label>
                      <select className="form-input" value={form.preferred_time} onChange={(e) => setForm({ ...form, preferred_time: e.target.value })}>
                        <option value="">Select time</option>
                        {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <label className="form-label">Your Location / Area</label>
                    <input className="form-input" placeholder="e.g. Andheri West, Mumbai" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
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
                    style={{ width: "100%", fontSize: 16, padding: "16px" }}
                  >
                    {loading
                      ? <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Booking...</>
                      : <><Calendar size={18} /> Book My Free Session</>}
                  </button>

                  <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", marginTop: 12 }}>
                    By submitting, you agree to be contacted via WhatsApp / phone.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .book-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
