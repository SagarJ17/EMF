"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, CheckCircle, Loader2 } from "lucide-react";
import { submitLeadMagnet } from "@/lib/api";
import { useCMSStore } from "@/store/cmsStore";

const GOALS = [
  "Fat Loss",
  "Muscle Gain",
  "Improve Fitness",
  "Post-injury Recovery",
  "General Health",
];

export default function LeadMagnet() {
  const { getSetting } = useCMSStore();
  const [form, setForm] = useState({ name: "", email: "", goal: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = "Enter your full name";
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
      const res = await submitLeadMagnet(form);
      setSuccess(res.message);
      
      // Trigger download using the configured CMS path (MinIO link or local public asset)
      const pdfUrl = getSetting("diet_pdf_url", "/sample-diet-plan.pdf");
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = "EMF-Fat-Loss-Blueprint.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="lead-magnet"
      style={{
        background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)",
        padding: "80px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative orange glow */}
      <div style={{
        position: "absolute", top: -100, right: -100, width: 500, height: 500,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(232,69,10,0.15) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="container" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }} className="lead-grid">
          
          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="section-badge" style={{ background: "rgba(232,69,10,0.15)", borderColor: "rgba(232,69,10,0.3)" }}>
              <Gift size={12} /> Free Gift
            </span>
            <h2 className="section-title" style={{ color: "white" }}>
              Get Your <span>Free</span>
              <br />Diet Plan
            </h2>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 17, lineHeight: 1.7, marginBottom: 32, maxWidth: 420 }}>
              Tell us your goal and we'll create a personalised nutrition framework tailored to your body and lifestyle — completely free.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                "Customised macro targets",
                "Meal timing recommendations",
                "Foods to eat & avoid",
                "Supplement guidance",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 12, color: "rgba(255,255,255,0.85)", fontSize: 15 }}>
                  <CheckCircle size={18} color="#e8450a" />
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 24,
              padding: "40px 36px",
              backdropFilter: "blur(12px)",
            }}>
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: "center", padding: 20 }}
                >
                  <div style={{
                    width: 72, height: 72, background: "rgba(34,197,94,0.15)",
                    border: "2px solid #22c55e", borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 20px"
                  }}>
                    <CheckCircle size={32} color="#22c55e" />
                  </div>
                  <h3 style={{ color: "white", fontFamily: "Outfit", fontWeight: 700, fontSize: 22, marginBottom: 12 }}>
                    You&apos;re all set! 🎉
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, lineHeight: 1.6 }}>{success}</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 style={{ color: "white", fontFamily: "Outfit", fontWeight: 700, fontSize: 22, marginBottom: 24 }}>
                    Claim Your Free Plan
                  </h3>

                  <div style={{ marginBottom: 18 }}>
                    <label className="form-label" style={{ color: "rgba(255,255,255,0.7)" }}>Your Name</label>
                    <input
                      className="form-input"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)", color: "white" }}
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    {errors.name && <p style={{ color: "#f87171", fontSize: 12, marginTop: 4 }}>{errors.name}</p>}
                  </div>

                  <div style={{ marginBottom: 18 }}>
                    <label className="form-label" style={{ color: "rgba(255,255,255,0.7)" }}>Email Address</label>
                    <input
                      className="form-input"
                      type="email"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)", color: "white" }}
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    {errors.email && <p style={{ color: "#f87171", fontSize: 12, marginTop: 4 }}>{errors.email}</p>}
                  </div>

                  <div style={{ marginBottom: 28 }}>
                    <label className="form-label" style={{ color: "rgba(255,255,255,0.7)" }}>Your Goal</label>
                    <select
                      className="form-input"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.1)", color: form.goal ? "white" : "rgba(255,255,255,0.4)" }}
                      value={form.goal}
                      onChange={(e) => setForm({ ...form, goal: e.target.value })}
                    >
                      <option value="" style={{ background: "#1a1a1a" }}>Select your goal</option>
                      {GOALS.map((g) => (
                        <option key={g} value={g} style={{ background: "#1a1a1a" }}>{g}</option>
                      ))}
                    </select>
                  </div>

                  {apiError && (
                    <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, color: "#f87171", fontSize: 14 }}>
                      {apiError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn-orange"
                    disabled={loading}
                    style={{ width: "100%", fontSize: 16, padding: "15px", opacity: loading ? 0.8 : 1 }}
                  >
                    {loading ? (
                      <><Loader2 size={18} className="animate-spin" /> Sending...</>
                    ) : (
                      <><Gift size={18} /> Get My Free Diet Plan</>
                    )}
                  </button>

                  <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, textAlign: "center", marginTop: 14 }}>
                    No spam. Your data is private and secure.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .lead-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}
