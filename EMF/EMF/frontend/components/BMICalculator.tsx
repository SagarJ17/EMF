"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, Loader2, ChevronDown } from "lucide-react";
import { calculateBMI, type BMIResponse } from "@/lib/api";

const ACTIVITY_OPTIONS = [
  { value: "sedentary", label: "Sedentary (little or no exercise)" },
  { value: "lightly_active", label: "Lightly active (1–3 days/week)" },
  { value: "moderately_active", label: "Moderately active (3–5 days/week)" },
  { value: "very_active", label: "Very active (6–7 days/week)" },
  { value: "extra_active", label: "Extra active (very hard exercise + physical job)" },
];

function getBMIColor(bmi: number): string {
  if (bmi < 18.5) return "#3b82f6";
  if (bmi < 25) return "#22c55e";
  if (bmi < 30) return "#f97316";
  return "#ef4444";
}

function BMIRing({ value, max = 40 }: { value: number; max?: number }) {
  const radius = 70;
  const circ = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  const offset = circ * (1 - pct);
  const color = getBMIColor(value);

  return (
    <div style={{ position: "relative", width: 180, height: 180, margin: "0 auto" }}>
      <svg width={180} height={180} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={90} cy={90} r={radius} className="bmi-ring-track" strokeWidth={12} />
        <motion.circle
          cx={90} cy={90} r={radius}
          className="bmi-ring-fill"
          strokeWidth={12}
          stroke={color}
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ fontFamily: "Outfit", fontWeight: 900, fontSize: 36, color, lineHeight: 1 }}
        >
          {value.toFixed(1)}
        </motion.div>
        <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, marginTop: 4 }}>BMI</div>
      </div>
    </div>
  );
}

export default function BMICalculator() {
  const [form, setForm] = useState({
    height_cm: "",
    weight_kg: "",
    gender: "male",
    activity_level: "moderately_active",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BMIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await calculateBMI({
        height_cm: parseFloat(form.height_cm),
        weight_kg: parseFloat(form.weight_kg),
        gender: form.gender as "male" | "female",
        activity_level: form.activity_level as Parameters<typeof calculateBMI>[0]["activity_level"],
      });
      setResult(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Calculation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="bmi" style={{ background: "#f9f9f9", padding: "80px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <span className="section-badge"><Calculator size={12} /> Smart Tool</span>
          <h2 className="section-title">
            Free <span>BMI & Nutrition</span> Calculator
          </h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Get your personalised BMI, daily calorie needs, and macro targets instantly.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }} className="bmi-grid">
          
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="card" style={{ padding: 36 }}>
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label className="form-label">Height (cm)</label>
                    <input
                      className="form-input"
                      type="number"
                      placeholder="e.g. 175"
                      min={100} max={250}
                      value={form.height_cm}
                      onChange={(e) => setForm({ ...form, height_cm: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="form-label">Weight (kg)</label>
                    <input
                      className="form-input"
                      type="number"
                      placeholder="e.g. 75"
                      min={20} max={400}
                      value={form.weight_kg}
                      onChange={(e) => setForm({ ...form, weight_kg: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label className="form-label">Gender</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {["male", "female"].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setForm({ ...form, gender: g })}
                        style={{
                          padding: "12px",
                          borderRadius: 10,
                          border: `2px solid ${form.gender === g ? "#e8450a" : "rgba(0,0,0,0.08)"}`,
                          background: form.gender === g ? "rgba(232,69,10,0.08)" : "white",
                          color: form.gender === g ? "#e8450a" : "#6b7280",
                          fontFamily: "Outfit",
                          fontWeight: 600,
                          fontSize: 14,
                          cursor: "pointer",
                          transition: "all 0.2s",
                          textTransform: "capitalize",
                        }}
                      >
                        {g === "male" ? "♂ Male" : "♀ Female"}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 28, position: "relative" }}>
                  <label className="form-label">Activity Level</label>
                  <select
                    className="form-input"
                    value={form.activity_level}
                    onChange={(e) => setForm({ ...form, activity_level: e.target.value })}
                    style={{ appearance: "none", paddingRight: 40 }}
                  >
                    {ACTIVITY_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} style={{ position: "absolute", right: 14, top: "60%", color: "#6b7280", pointerEvents: "none" }} />
                </div>

                {error && (
                  <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, padding: "10px 14px", marginBottom: 16, color: "#ef4444", fontSize: 14 }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-orange"
                  disabled={loading}
                  style={{ width: "100%", fontSize: 16 }}
                >
                  {loading ? <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Calculating...</> : <><Calculator size={18} /> Calculate My BMI</>}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Result */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <AnimatePresence mode="wait">
              {!result ? (
                <motion.div
                  key="placeholder"
                  exit={{ opacity: 0 }}
                  style={{
                    background: "white",
                    border: "1px solid rgba(0,0,0,0.06)",
                    borderRadius: 24,
                    padding: 40,
                    textAlign: "center",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
                  }}
                >
                  <div style={{ fontSize: 64, marginBottom: 16 }}>🏋️</div>
                  <h3 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 20, color: "#0f0f0f", marginBottom: 8 }}>
                    Your Results Await
                  </h3>
                  <p style={{ color: "#6b7280", fontSize: 14 }}>
                    Fill in your details on the left and hit Calculate to see your personalised BMI breakdown and nutrition targets.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="card"
                  style={{ padding: 32 }}
                >
                  {/* BMI Ring */}
                  <div style={{ marginBottom: 24 }}>
                    <BMIRing value={result.bmi_value} />
                    <div style={{ textAlign: "center", marginTop: 12 }}>
                      <span style={{
                        background: `${getBMIColor(result.bmi_value)}15`,
                        color: getBMIColor(result.bmi_value),
                        fontFamily: "Outfit", fontWeight: 700, fontSize: 15,
                        padding: "5px 16px", borderRadius: 100,
                      }}>
                        {result.category}
                      </span>
                    </div>
                  </div>

                  {/* Macros */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
                    {[
                      { label: "Calories", value: `${result.calorie_estimate}`, unit: "kcal/day" },
                      { label: "Protein", value: `${result.protein_grams}g`, unit: "per day" },
                      { label: "Carbs", value: result.carbs_range, unit: "per day" },
                    ].map((m) => (
                      <div key={m.label} style={{
                        background: "#f9f9f9", borderRadius: 12, padding: "14px 12px", textAlign: "center",
                      }}>
                        <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 18, color: "#e8450a" }}>{m.value}</div>
                        <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, marginTop: 2 }}>{m.label}</div>
                        <div style={{ fontSize: 10, color: "#9ca3af" }}>{m.unit}</div>
                      </div>
                    ))}
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 15, color: "#0f0f0f", marginBottom: 12 }}>
                      💡 Recommendations
                    </h4>
                    {result.recommendations.map((rec, i) => (
                      <div key={i} style={{
                        display: "flex", gap: 10, marginBottom: 8,
                        fontSize: 13, color: "#3d3d3d", lineHeight: 1.5,
                      }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#e8450a", flexShrink: 0, marginTop: 6 }} />
                        {rec}
                      </div>
                    ))}
                  </div>

                  <a href="#book" className="btn-orange" style={{ width: "100%", marginTop: 20, justifyContent: "center" }}>
                    Get Personalised Plan
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .bmi-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
