"use client";

import { useState, useEffect, useRef } from "react";
import {
  Trash2, Upload, Loader2, Play, Lock,
  Settings as SettingsIcon, Image as ImageIcon, Save, Eye,
  Instagram, Youtube, Phone, MessageCircle, BarChart, Download
} from "lucide-react";
import Image from "next/image";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import * as XLSX from "xlsx";

// ─────────────────────────────────────────────────────────────────────────────
// Admin Dashboard Shell
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("transformations");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  if (!loggedIn) {
    return (
      <div style={{ background: "#111827", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: "white", padding: 40, borderRadius: 24, width: "100%", maxWidth: 400, textAlign: "center" }}>
          <div style={{ width: 64, height: 64, background: "#fff5f0", borderRadius: 100, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <Lock size={28} color="#e8450a" />
          </div>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 24, marginBottom: 8 }}>Admin Portal</h2>
          <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 32 }}>Secure access required.</p>
          <form onSubmit={(e) => { e.preventDefault(); if (password === "EMF2026") setLoggedIn(true); else alert("Invalid Password"); }}>
            <input
              type="password"
              placeholder="Enter Master Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "1px solid #e5e7eb", marginBottom: 16, boxSizing: "border-box" }}
            />
            <button type="submit" className="btn-orange" style={{ width: "100%", padding: "14px" }}>Unlock Dashboard</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f3f4f6", minHeight: "100vh", paddingBottom: 60 }}>
      {/* Header */}
      <div style={{ background: "white", padding: "0 24px", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 10 }}>
        <div className="admin-header-wrap" style={{ maxWidth: 1400, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 36, height: 36, background: "#fff5f0", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "Outfit", fontWeight: 900, fontSize: 14, color: "#e8450a" }}>EMF</span>
            </div>
            <h1 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 20, margin: 0 }}>
              Admin <span style={{ color: "#e8450a" }}>CMS</span>
            </h1>
          </div>
          <div className="admin-nav-tabs" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
            {[
              { key: "transformations", icon: <ImageIcon size={14} />, label: "Transformations" },
              { key: "settings", icon: <SettingsIcon size={14} />, label: "Site Settings" },
              { key: "reports", icon: <BarChart size={14} />, label: "Reports" },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={activeTab === tab.key ? "btn-orange" : "btn-outline"}
                style={{ padding: "8px 18px", fontSize: 13, gap: 6, display: "flex", alignItems: "center" }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: activeTab === "settings" ? 1400 : 1200, margin: "0 auto", padding: "32px 24px" }}>
        {activeTab === "transformations" && <TransformationsTab apiUrl={apiUrl} />}
        {activeTab === "settings" && <SettingsTab apiUrl={apiUrl} />}
        {activeTab === "reports" && <ReportsTab apiUrl={apiUrl} />}
      </div>

      <style>{`
        .admin-grid { display: grid; gap: 32px; grid-template-columns: 1fr 2fr; }
        .transform-row { display: flex; padding: 16px; border: 1px solid #f3f4f6; margin-bottom: 12px; border-radius: 12px; align-items: center; gap: 16px; }
        
        @media (max-width: 900px) { 
          .admin-grid { grid-template-columns: 1fr; } 
          .settings-layout { grid-template-columns: 1fr !important; }
          .editor-panel { position: relative !important; top: 0 !important; max-height: none !important; margin-bottom: 32px; }
          .editor-scroll-area { overflow-y: visible !important; }
        }
        @media (max-width: 650px) {
          .admin-header-wrap { flex-direction: column; align-items: flex-start !important; padding: 16px 0; gap: 12px; }
          .admin-nav-tabs { width: 100%; padding-bottom: 8px; }
          .admin-nav-tabs button { flex: 1; justify-content: center; white-space: nowrap; }
          .transform-row { flex-direction: column; align-items: flex-start !important; }
          .transform-actions { width: 100%; justify-content: flex-end; border-top: 1px solid #eee; padding-top: 12px; margin-top: 8px; }
          .sandbox-hero-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .sandbox-about-stats { grid-template-columns: repeat(2, 1fr) !important; }
          .sandbox-about-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .report-card { padding: 20px !important; }
          .report-table-actions { flex-direction: column; width: 100%; align-items: stretch !important; }
          .report-table-actions input, .report-table-actions button { width: 100%; min-width: 0 !important; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Transformations Tab
// ─────────────────────────────────────────────────────────────────────────────
function TransformationsTab({ apiUrl }: { apiUrl: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [type, setType] = useState<"image" | "video">("image");
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [result, setResult] = useState("");
  const [quote, setQuote] = useState("");
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoSource, setVideoSource] = useState<"upload" | "youtube">("upload");
  const [youtubeURL, setYoutubeURL] = useState("");

  const fetchItems = () => {
    fetch(`${apiUrl}/transformations`).then(r => r.json()).then(setItems).finally(() => setLoading(false));
  };
  useEffect(() => { fetchItems(); }, []);

  const uploadFile = async (f: File, folder: string) => {
    const fd = new FormData(); fd.append("file", f);
    const r = await fetch(`${apiUrl}/upload?folder=${folder}`, { method: "POST", body: fd });
    return (await r.json()).url;
  };

  const submit = async (e: any) => {
    e.preventDefault();
    if (!name) return alert("Client Name is required.");
    if (!editingId && type === "image" && (!beforeFile || !afterFile)) return alert("Both Before and After photos are required.");
    if (!editingId && type === "video" && videoSource === "upload" && !videoFile) return alert("A video file is required.");
    if (type === "video" && videoSource === "youtube" && !youtubeURL) return alert("A YouTube link is required.");

    setSaving(true);
    try {
      let payload: any = { name, result, quote };
      if (type === "image") {
        if (beforeFile) payload.before_image = await uploadFile(beforeFile, "transformations");
        else if (editingId) payload.before_image = items.find(i => i.id === editingId)?.before_image;
        
        if (afterFile) payload.after_image = await uploadFile(afterFile, "transformations");
        else if (editingId) payload.after_image = items.find(i => i.id === editingId)?.after_image;
      } else {
        if (videoSource === "upload" && videoFile) payload.video = await uploadFile(videoFile, "transformations");
        else if (videoSource === "youtube") payload.video = youtubeURL;
        else if (editingId) payload.video = items.find(i => i.id === editingId)?.video;
      }
      
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `${apiUrl}/transformations/${editingId}` : `${apiUrl}/transformations`;
      
      await fetch(url, {
        method: method, headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      cancelEdit();
      fetchItems();
    } finally { setSaving(false); }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName(""); setResult(""); setQuote(""); setBeforeFile(null); setAfterFile(null); setVideoFile(null); setYoutubeURL("");
  };

  const startEdit = (t: any) => {
    setEditingId(t.id);
    setName(t.name);
    setResult(t.result);
    setQuote(t.quote || "");
    if (t.video) {
      setType("video");
      const isYt = t.video.includes("youtube.com") || t.video.includes("youtu.be");
      setVideoSource(isYt ? "youtube" : "upload");
      if (isYt) setYoutubeURL(t.video);
    } else {
      setType("image");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="admin-grid">
      {/* Form */}
      <div style={{ background: "white", padding: 32, borderRadius: 20, boxShadow: "0 2px 16px rgba(0,0,0,0.04)", height: "fit-content" }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 20, marginBottom: 24, borderBottom: "1px solid #eee", paddingBottom: 16 }}>
          {editingId ? "Edit Transformation" : "Add Transformation"}
        </h2>

        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          {(["image", "video"] as const).map(t => (
            <label key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer", fontWeight: type === t ? 700 : 400 }}>
              <input type="radio" checked={type === t} onChange={() => setType(t)} /> {t === "image" ? "📸 Photos Mode" : "🎥 Video Mode"}
            </label>
          ))}
        </div>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Client Name *</label>
            <input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. John Doe" style={{ width: "100%", padding: "10px 14px", border: "1px solid #ccc", borderRadius: 8, boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Result Claim</label>
            <input value={result} onChange={e => setResult(e.target.value)} placeholder="e.g. -12kg in 3 months" style={{ width: "100%", padding: "10px 14px", border: "1px solid #ccc", borderRadius: 8, boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Testimonial Quote</label>
            <textarea value={quote} onChange={e => setQuote(e.target.value)} rows={2} placeholder="e.g. EMF changed my life!" style={{ width: "100%", padding: "10px 14px", border: "1px solid #ccc", borderRadius: 8, boxSizing: "border-box" }} />
          </div>

            <div style={{ padding: 16, background: "#f9fafb", borderRadius: 12, border: "1px dashed #d1d5db" }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 12 }}>Media Source</p>
              {type === "image" ? (
                <>
                  <FileUploadLabel label="📸 Upload Before Photo" accept="image/*" file={beforeFile} onChange={setBeforeFile} />
                  <FileUploadLabel label="📸 Upload After Photo" accept="image/*" file={afterFile} onChange={setAfterFile} />
                </>
              ) : (
                <>
                  <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                    {(["upload", "youtube"] as const).map(src => (
                      <label key={src} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, cursor: "pointer" }}>
                        <input type="radio" checked={videoSource === src} onChange={() => setVideoSource(src)} /> 
                        {src === "upload" ? "Upload MP4" : "YouTube Link"}
                      </label>
                    ))}
                  </div>
                  {videoSource === "upload" ? (
                    <FileUploadLabel label="🎥 Upload Video (MP4)" accept="video/mp4" file={videoFile} onChange={setVideoFile} />
                  ) : (
                    <div>
                      <input 
                        value={youtubeURL} 
                        onChange={e => setYoutubeURL(e.target.value)} 
                        placeholder="e.g. https://www.youtube.com/watch?v=LXb3EKWsInQ" 
                        style={{ width: "100%", padding: "10px 14px", border: "1px solid #ccc", borderRadius: 8, boxSizing: "border-box", fontSize: 13 }} 
                      />
                    </div>
                  )}
                </>
              )}
            </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button disabled={saving} className="btn-orange" style={{ flex: 1, padding: "12px", display: "flex", justifyContent: "center", gap: 8 }}>
              {saving ? <><Loader2 size={18} className="animate-spin" /> {editingId ? "Updating..." : "Uploading..."}</> : <><Upload size={16} /> {editingId ? "Update Transformation" : "Save to Database"}</>}
            </button>
            {editingId && (
              <button type="button" onClick={cancelEdit} className="btn-outline" style={{ padding: "12px 24px" }}>Cancel</button>
            )}
          </div>
        </form>
      </div>

      {/* List */}
      <div style={{ background: "white", padding: 32, borderRadius: 20, boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 20, marginBottom: 24, borderBottom: "1px solid #eee", paddingBottom: 16 }}>
          Client Database ({items.length})
        </h2>
        {loading ? (
          <p style={{ color: "#9ca3af", fontSize: 14 }}>Loading...</p>
        ) : items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#9ca3af" }}>
            <ImageIcon size={40} style={{ margin: "0 auto 12px", display: "block", opacity: 0.3 }} />
            <p style={{ fontSize: 14 }}>No transformations yet. Add the first one!</p>
          </div>
        ) : items.map(t => (
          <div key={t.id} className="transform-row">
            {t.video ? (
              <div style={{ width: 52, height: 52, background: "#111", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Play size={18} color="white" />
              </div>
            ) : (
              <div style={{ width: 52, height: 52, position: "relative", borderRadius: 8, overflow: "hidden", background: "#eee", flexShrink: 0 }}>
                {t.after_image && <Image src={t.after_image} alt="" fill style={{ objectFit: "cover" }} unoptimized />}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 700, fontSize: 15, color: "#111827", margin: 0 }}>{t.name}</p>
              <p style={{ fontSize: 13, color: "#6b7280", margin: "2px 0 0" }}>{t.result}</p>
            </div>
            <span style={{ fontSize: 11, background: t.video ? "#eff6ff" : "#fff5f0", color: t.video ? "#3b82f6" : "#e8450a", padding: "3px 10px", borderRadius: 100, fontWeight: 700, flexShrink: 0 }}>
              {t.video ? "VIDEO" : "PHOTOS"}
            </span>
            <div className="transform-actions" style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button
                onClick={() => startEdit(t)}
                style={{ background: "#f3f4f6", border: "none", color: "#374151", padding: 10, borderRadius: 8, cursor: "pointer", display: "flex" }}
              >
                <span style={{ fontSize: 13, fontWeight: 600 }}>Edit</span>
              </button>
              <button
                onClick={async () => { if (confirm("Delete this entry?")) { await fetch(`${apiUrl}/transformations/${t.id}`, { method: "DELETE" }); fetchItems(); } }}
                style={{ background: "#fee2e2", border: "none", color: "#ef4444", padding: 10, borderRadius: 8, cursor: "pointer", display: "flex" }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// File Upload Helper
// ─────────────────────────────────────────────────────────────────────────────
function FileUploadLabel({ label, accept, file, onChange }: { label: string; accept: string; file: File | null; onChange: (f: File | null) => void }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer", color: "#e8450a", fontWeight: 600 }}>
        <Upload size={13} /> {label}
        <input type="file" style={{ display: "none" }} accept={accept} onChange={e => onChange(e.target.files?.[0] || null)} />
      </label>
      {file && <p style={{ fontSize: 11, color: "#16a34a", marginTop: 4 }}>✓ {file.name}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Settings Tab — Left editor + Right sandbox live preview
// ─────────────────────────────────────────────────────────────────────────────
function SettingsTab({ apiUrl }: { apiUrl: string }) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [heroVideoFile, setHeroVideoFile] = useState<File | null>(null);
  const [aboutImageFile, setAboutImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetch(`${apiUrl}/settings`).then(r => r.json()).then(setSettings);
  }, [apiUrl]);

  const update = (key: string, val: string) => setSettings(p => ({ ...p, [key]: val }));
  const g = (key: string, fallback: string) => settings[key] || fallback;

  const save = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    let dict = { ...settings };
    if (pdfFile) {
      const fd = new FormData(); fd.append("file", pdfFile);
      const res = await fetch(`${apiUrl}/upload?folder=pdfs`, { method: "POST", body: fd });
      dict.diet_pdf_url = (await res.json()).url;
    }
    if (heroVideoFile) {
      const fd = new FormData(); fd.append("file", heroVideoFile);
      const res = await fetch(`${apiUrl}/upload?folder=settings`, { method: "POST", body: fd });
      dict.hero_video_url = (await res.json()).url;
    }
    if (aboutImageFile) {
      const fd = new FormData(); fd.append("file", aboutImageFile);
      const res = await fetch(`${apiUrl}/upload?folder=settings`, { method: "POST", body: fd });
      dict.about_image_url = (await res.json()).url;
    }
    try {
      await fetch(`${apiUrl}/settings`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dict)
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "420px 1fr", gap: 24, alignItems: "start", minHeight: "calc(100vh - 120px)" }} className="settings-layout">
      {/* ── LEFT: Editor ─────────────────────────────────── */}
      <div className="editor-panel" style={{ background: "white", borderRadius: 20, boxShadow: "0 2px 16px rgba(0,0,0,0.04)", overflow: "hidden", position: "sticky", top: 80, maxHeight: "calc(100vh - 110px)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <SettingsIcon size={18} color="#e8450a" />
          <h2 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 18, margin: 0 }}>Page Editor</h2>
          <span style={{ marginLeft: "auto", fontSize: 11, color: "#9ca3af" }}>Edits reflect in sandbox →</span>
        </div>

        <div className="editor-scroll-area" style={{ overflowY: "auto", flex: 1, padding: "0 24px 24px" }}>
          <form onSubmit={save}>

            {/* ── Hero Section ─────────────────────────── */}
            <SectionHeader emoji="🏠" label="Hero Section" />
            <Field label="Badge Text" value={g("hero_badge", "Rated 5.0 by 200+ Clients")} onChange={v => update("hero_badge", v)} />
            <Field label="Main Headline" value={g("hero_headline", "Transform Your Body\nWithout Leaving\nHome")} onChange={v => update("hero_headline", v)} rows={3} />
            <Field label="Sub-headline" value={g("hero_subheadline", "Elite personal training brought to your doorstep.")} onChange={v => update("hero_subheadline", v)} rows={2} />
            <Field label="CTA Button Label" value={g("cta_button_label", "Train With Me")} onChange={v => update("cta_button_label", v)} />
            <Field label="CTA Button Link (URL or #anchor)" value={g("train_with_me_link", "#contact")} onChange={v => update("train_with_me_link", v)} />
            <Field label="Hero Trust Pills (separated by |)" value={g("hero_trust_pills", "200+ Clients Transformed|Home & Centre|5★ Rated")} onChange={v => update("hero_trust_pills", v)} />
            <Field label="Slots Banner Headline" value={g("hero_slots_headline", "🔥 Only 5 Slots Left This Month")} onChange={v => update("hero_slots_headline", v)} />
            <Field label="Slots Banner Subheadline" value={g("hero_slots_sub", "Limited availability for new clients")} onChange={v => update("hero_slots_sub", v)} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <StatField valKey="hero_float1_num" lblKey="hero_float1_label" valDef="200+" lblDef="Lives Transformed" settings={settings} update={update} />
              <StatField valKey="hero_float2_num" lblKey="hero_float2_label" valDef="4 yrs" lblDef="Training Experience" settings={settings} update={update} />
            </div>
            
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#6b7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Background Video (MP4)</label>
              <input type="file" accept="video/mp4" onChange={e => setHeroVideoFile(e.target.files?.[0] || null)} style={{ fontSize: 12, width: "100%", padding: 8, background: "#f9fafb", borderRadius: 8, border: "1px solid #e5e7eb", cursor: "pointer" }} />
              {settings.hero_video_url && <p style={{ fontSize: 10, color: "#9ca3af", marginTop: 4, wordBreak: "break-all" }}>Current: {settings.hero_video_url}</p>}
            </div>

            {/* ── About Section ────────────────────────── */}
            <SectionHeader emoji="👤" label="About Founder" />
            <Field label="Title Prefix (e.g. 'Hi, I'm')" value={g("about_title", "Hi, I'm")} onChange={v => update("about_title", v)} />
            <Field label="Founder Name" value={g("about_name", "Neeraj")} onChange={v => update("about_name", v)} />
            <Field label="Paragraph 1" value={g("about_p1", "")} onChange={v => update("about_p1", v)} rows={3} />
            <Field label="Paragraph 2" value={g("about_p2", "")} onChange={v => update("about_p2", v)} rows={3} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <StatField valKey="about_stat1_val" lblKey="about_stat1_lbl" valDef="200+" lblDef="Clients Transformed" settings={settings} update={update} />
              <StatField valKey="about_stat2_val" lblKey="about_stat2_lbl" valDef="10+" lblDef="Years Experience" settings={settings} update={update} />
              <StatField valKey="about_stat3_val" lblKey="about_stat3_lbl" valDef="1000+" lblDef="Sessions Delivered" settings={settings} update={update} />
              <StatField valKey="about_stat4_val" lblKey="about_stat4_lbl" valDef="100%" lblDef="Personalised Plans" settings={settings} update={update} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#6b7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Profile Image</label>
              <input type="file" accept="image/*" onChange={e => setAboutImageFile(e.target.files?.[0] || null)} style={{ fontSize: 12, width: "100%", padding: 8, background: "#f9fafb", borderRadius: 8, border: "1px solid #e5e7eb", cursor: "pointer" }} />
              {settings.about_image_url && <p style={{ fontSize: 10, color: "#9ca3af", marginTop: 4, wordBreak: "break-all" }}>Current: {settings.about_image_url}</p>}
            </div>

            {/* ── Socials & Contact ─────────────────────── */}
            <SectionHeader emoji="🔗" label="Socials & Contact" />
            <Field label="WhatsApp Number (digits only, e.g. 919819406259)" value={g("whatsapp_number", "919819406259")} onChange={v => update("whatsapp_number", v)} />
            <Field label="Contact Phone Label" value={g("contact_phone", "+91 9819406259")} onChange={v => update("contact_phone", v)} />
            <Field label="Instagram URL" value={g("social_instagram", "https://instagram.com")} onChange={v => update("social_instagram", v)} />
            <Field label="YouTube URL" value={g("social_youtube", "https://youtube.com")} onChange={v => update("social_youtube", v)} />
            <Field label="Footer Description" value={g("footer_blurb", "Experience high-end personal training crafted around you.")} onChange={v => update("footer_blurb", v)} rows={2} />

            <button
              type="submit"
              disabled={saving}
              className="btn-orange"
              style={{ width: "100%", padding: "14px", fontSize: 15, marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              {saving ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Saving...</> : saved ? <><span>✓</span> Saved & Applied!</> : <><Save size={16} /> Save All Changes</>}
            </button>
          </form>
        </div>
      </div>

      {/* ── RIGHT: Sandbox Preview ───────────────────────── */}
      <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 24px rgba(0,0,0,0.08)", border: "1px solid rgba(0,0,0,0.06)" }}>
        {/* Browser chrome mock */}
        <div style={{ background: "#1e1e2e", padding: "10px 16px", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", gap: 6 }}>
            {["#ff5f57", "#febc2e", "#28c840"].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />)}
          </div>
          <div style={{ flex: 1, background: "#2d2d3f", borderRadius: 6, padding: "4px 12px", marginLeft: 8 }}>
            <span style={{ fontSize: 11, color: "#9ca3af", fontFamily: "monospace" }}>
              emffitness.com — Live Preview
            </span>
          </div>
          <Eye size={14} color="#9ca3af" />
        </div>

        {/* Page sandbox */}
        <div style={{ background: "white", fontFamily: "Outfit, Inter, sans-serif" }}>

          {/* NAVBAR preview */}
          <div style={{ padding: "12px 24px", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "white", zIndex: 5 }}>
            <div style={{ width: 32, height: 32, background: "#fff5f0", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontWeight: 900, fontSize: 11, color: "#e8450a" }}>EMF</span>
            </div>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              {["Founder", "Results", "About"].map(l => <span key={l} style={{ fontSize: 11, color: "#3d3d3d", fontWeight: 600 }}>{l}</span>)}
              <span style={{ background: "#e8450a", color: "white", fontSize: 11, padding: "5px 12px", borderRadius: 8, fontWeight: 700 }}>
                {g("cta_button_label", "Book Trial Session")}
              </span>
            </div>
          </div>

          {/* HERO preview */}
          <div style={{ background: "linear-gradient(160deg, #fff 0%, #fff8f5 50%, #fff 100%)", padding: "40px 24px 32px" }}>
            <div className="sandbox-hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "center" }}>
              <div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(232,69,10,0.1)", color: "#e8450a", fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 100, border: "1px solid rgba(232,69,10,0.2)", marginBottom: 12 }}>
                  ⭐ {g("hero_badge", "Rated 5.0 by 200+ Clients")}
                </div>

                <h2 style={{ fontFamily: "Outfit", fontWeight: 900, fontSize: 20, lineHeight: 1.15, color: "#0f0f0f", marginBottom: 10, whiteSpace: "pre-line" }}>
                  {g("hero_headline", "Transform Your Body\nWithout Leaving\nHome")}
                </h2>
                <p style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.6, marginBottom: 16, maxWidth: 280 }}>
                  {g("hero_subheadline", "Elite personal training brought to your doorstep.")}
                </p>

                {/* Trust Pills Mock */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                  {g("hero_trust_pills", "200+ Clients Transformed|Home & Centre|5★ Rated")
                    .split("|")
                    .map(s => s.trim())
                    .filter(Boolean)
                    .map(item => (
                      <div key={item} style={{ background: "white", padding: "4px 10px", fontSize: 9, borderRadius: 100, border: "1px solid rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 4, fontWeight: 600 }}>
                        <span style={{ color: "#e8450a" }}>✓</span> {item}
                      </div>
                    ))}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ background: "#e8450a", color: "white", fontSize: 11, padding: "7px 14px", borderRadius: 8, fontWeight: 700 }}>
                    🏋️ {g("cta_button_label", "Train With Me")} →
                  </span>
                  <span style={{ border: "1.5px solid #e8450a", color: "#e8450a", fontSize: 11, padding: "6px 14px", borderRadius: 8, fontWeight: 700 }}>
                    🏆 See Results
                  </span>
                </div>
              </div>
              <div style={{ borderRadius: 16, overflow: "hidden", aspectRatio: "4/5", background: "linear-gradient(135deg, #1a1a1a, #2a2a2a)", position: "relative" }}>
                 <video src={heroVideoFile ? URL.createObjectURL(heroVideoFile) : settings.hero_video_url} loop autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                 
                 {/* Slots Badge Mock */}
                 <div style={{ position: "absolute", bottom: 8, left: 8, right: 8, background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", padding: "6px 8px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.4)" }}>
                   <div style={{ fontSize: 9, color: "white", fontWeight: 700 }}>{g("hero_slots_headline", "🔥 Only 5 Slots Left This Month")}</div>
                   <div style={{ fontSize: 8, color: "rgba(255,255,255,0.8)" }}>{g("hero_slots_sub", "Limited availability for new clients")}</div>
                 </div>
                 
                 {/* Floating Stats Mock */}
                 <div style={{ position: "absolute", top: 10, right: -10, background: "white", padding: "6px 8px", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                   <div style={{ fontSize: 12, fontWeight: 800, color: "#e8450a", lineHeight: 1 }}>{g("hero_float1_num", "200+")}</div>
                   <div style={{ fontSize: 7, color: "#6b7280", fontWeight: 600 }}>{g("hero_float1_label", "Lives Transformed")}</div>
                 </div>
                 <div style={{ position: "absolute", bottom: 40, left: -10, background: "white", padding: "6px 8px", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                   <div style={{ fontSize: 12, fontWeight: 800, color: "#e8450a", lineHeight: 1 }}>{g("hero_float2_num", "10 Years")}</div>
                   <div style={{ fontSize: 7, color: "#6b7280", fontWeight: 600 }}>{g("hero_float2_label", "Training Experience")}</div>
                 </div>
                 
              </div>
            </div>
          </div>

          {/* ABOUT preview */}
          <div style={{ padding: "28px 24px", background: "#f9f9f9", borderTop: "1px solid rgba(0,0,0,0.04)" }}>
            <div className="sandbox-about-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
              {[
                { v: g("about_stat1_val", "200+"), l: g("about_stat1_lbl", "Clients Transformed") },
                { v: g("about_stat2_val", "10+"), l: g("about_stat2_lbl", "Years Experience") },
                { v: g("about_stat3_val", "1000+"), l: g("about_stat3_lbl", "Sessions Delivered") },
                { v: g("about_stat4_val", "100%"), l: g("about_stat4_lbl", "Personalised Plans") },
              ].map((s, i) => (
                <div key={i} style={{ background: "white", borderRadius: 12, padding: "12px 8px", textAlign: "center", border: "1px solid rgba(0,0,0,0.06)" }}>
                  <div style={{ fontWeight: 800, fontSize: 16, color: "#e8450a", fontFamily: "Outfit" }}>{s.v}</div>
                  <div style={{ fontSize: 9, color: "#6b7280", marginTop: 2, lineHeight: 1.3 }}>{s.l}</div>
                </div>
              ))}
            </div>
            <div className="sandbox-about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "center" }}>
              <div style={{ borderRadius: 14, aspectRatio: "3/4", background: "linear-gradient(135deg, #d1d5db, #e5e7eb)", position: "relative", overflow: "hidden" }}>
                 {(aboutImageFile || settings.about_image_url) ? (
                   <img src={aboutImageFile ? URL.createObjectURL(aboutImageFile) : settings.about_image_url} alt="Founder" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                 ) : (
                   <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}><span style={{ fontSize: 28 }}>👤</span></div>
                 )}
              </div>
              <div>
                <span style={{ fontSize: 9, color: "#e8450a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>About The Founder</span>
                <h3 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 16, marginTop: 6, marginBottom: 8 }}>
                  {g("about_title", "Hi, I'm")} <span style={{ color: "#e8450a" }}>{g("about_name", "Neeraj Bhadauria")}</span>
                </h3>
                <p style={{ fontSize: 10, color: "#6b7280", lineHeight: 1.6, marginBottom: 6 }}>{g("about_p1", "With 4+ years of hands-on experience...")}</p>
                <p style={{ fontSize: 10, color: "#6b7280", lineHeight: 1.6 }}>{g("about_p2", "Every programme I build is 100% tailored...")}</p>
              </div>
            </div>
          </div>

          {/* FOOTER preview */}
          <div style={{ background: "#0f0f0f", padding: "24px", color: "white" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 14, color: "#e8450a", marginBottom: 6 }}>EMF Fitness</div>
                <p style={{ fontSize: 10, color: "#6b7280", maxWidth: 200, lineHeight: 1.6 }}>{g("footer_blurb", "Experience high-end personal training crafted around you.")}</p>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "white", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>Socials</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <a href={g("social_instagram", "#")} target="_blank" style={{ width: 28, height: 28, background: "rgba(255,255,255,0.08)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Instagram size={12} color="#6b7280" />
                  </a>
                  <a href={g("social_youtube", "#")} target="_blank" style={{ width: 28, height: 28, background: "rgba(255,255,255,0.08)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Youtube size={12} color="#6b7280" />
                  </a>
                  <a href={`https://wa.me/${g("whatsapp_number", "919819406259")}`} target="_blank" style={{ width: 28, height: 28, background: "rgba(255,255,255,0.08)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MessageCircle size={12} color="#6b7280" />
                  </a>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "white", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>Contact</div>
                <a href={`tel:${g("contact_phone", "+91 9819406259")}`} style={{ display: "flex", gap: 6, alignItems: "center", color: "#6b7280", fontSize: 10, textDecoration: "none" }}>
                  <Phone size={10} /> {g("contact_phone", "+91 9819406259")}
                </a>
              </div>
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 12, fontSize: 10, color: "#4b5563" }}>
              © {new Date().getFullYear()} EMF Fitness. All rights reserved.
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 1100px) {
          .settings-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Reusable field components
// ─────────────────────────────────────────────────────────────────────────────
function SectionHeader({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div style={{ marginTop: 24, marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid #f3f4f6" }}>
      <span style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 13, color: "#374151" }}>{emoji} {label}</span>
    </div>
  );
}

function Field({ label, value, onChange, rows }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  const base = { width: "100%", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, fontFamily: "Inter, sans-serif", boxSizing: "border-box" as const, outline: "none", transition: "border-color 0.2s" };
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#6b7280", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
      {rows ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows} style={{ ...base, resize: "vertical" }} />
      ) : (
        <input value={value} onChange={e => onChange(e.target.value)} style={base} />
      )}
    </div>
  );
}

function StatField({ valKey, lblKey, valDef, lblDef, settings, update }: { valKey: string; lblKey: string; valDef: string; lblDef: string; settings: Record<string, string>; update: (k: string, v: string) => void }) {
  const inputStyle = { width: "100%", padding: "7px 10px", border: "1px solid #e5e7eb", borderRadius: 6, fontSize: 12, boxSizing: "border-box" as const };
  return (
    <div style={{ marginBottom: 10 }}>
      <input value={settings[valKey] || ""} onChange={e => update(valKey, e.target.value)} placeholder={valDef} style={{ ...inputStyle, fontWeight: 700, marginBottom: 4 }} />
      <input value={settings[lblKey] || ""} onChange={e => update(lblKey, e.target.value)} placeholder={lblDef} style={inputStyle} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Reports Tab
// ─────────────────────────────────────────────────────────────────────────────
function ReportsTab({ apiUrl }: { apiUrl: string }) {
  const [data, setData] = useState({ table: [], chart: [] } as { table: any[], chart: any[] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${apiUrl}/reports`)
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [apiUrl]);

  const downloadExcel = () => {
    if (!data.table.length) return;
    const ws = XLSX.utils.json_to_sheet(data.table);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leads & Bookings");
    XLSX.writeFile(wb, "EMF_Fitness_Reports.xlsx");
  };

  if (loading) return <div style={{ textAlign: "center", padding: 40 }}><Loader2 className="animate-spin" size={32} style={{ margin: "0 auto", color: "#e8450a" }} /></div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* ── DOT GRAPH ── */}
      <div className="report-card" style={{ background: "white", padding: 32, borderRadius: 20, boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
        <h2 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 20, marginBottom: 24, borderBottom: "1px solid #eee", paddingBottom: 16 }}>
          Conversion Trends (Last 30 Days)
        </h2>
        <div style={{ width: "100%", height: 300, minWidth: 0, minHeight: 0 }}>
          <ResponsiveContainer width="99%" height="100%">
            <AreaChart data={data.chart} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e8450a" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#e8450a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="contacts" stroke="#e8450a" fillOpacity={1} fill="url(#colorLeads)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── DATATABLE ── */}
      <div className="report-card" style={{ background: "white", padding: 32, borderRadius: 20, boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #eee", flexWrap: "wrap", gap: 16 }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 20, margin: 0 }}>
            Incoming Contacts
          </h2>
          <div className="report-table-actions" style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <input 
              placeholder="Search leads..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                padding: "8px 14px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, minWidth: 200
              }}
            />
            <button onClick={downloadExcel} className="btn-outline" style={{ padding: "8px 16px", fontSize: 13, gap: 6, display: "flex", alignItems: "center" }}>
              <Download size={14} /> Download Excel
            </button>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
            <thead>
              <tr style={{ background: "#f9fafb", textAlign: "left", fontSize: 12, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <th style={{ padding: "12px 16px", borderBottom: "1px solid #e5e7eb" }}>ID</th>
                <th style={{ padding: "12px 16px", borderBottom: "1px solid #e5e7eb" }}>Date</th>
                <th style={{ padding: "12px 16px", borderBottom: "1px solid #e5e7eb" }}>Name / Contact</th>
                <th style={{ padding: "12px 16px", borderBottom: "1px solid #e5e7eb" }}>Message</th>
              </tr>
            </thead>
            <tbody>
              {data.table.filter(r => 
                r.name.toLowerCase().includes(search.toLowerCase()) || 
                r.email.toLowerCase().includes(search.toLowerCase()) || 
                r.phone.includes(search) || 
                (r.details && r.details.toLowerCase().includes(search.toLowerCase()))
              ).length === 0 ? (
                <tr><td colSpan={5} style={{ padding: 30, textAlign: "center", color: "#9ca3af" }}>No records found.</td></tr>
              ) : data.table
                .filter(r => 
                  r.name.toLowerCase().includes(search.toLowerCase()) || 
                  r.email.toLowerCase().includes(search.toLowerCase()) || 
                  r.phone.includes(search) || 
                  (r.details && r.details.toLowerCase().includes(search.toLowerCase()))
                )
                .map(r => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "14px 16px", fontSize: 12, fontWeight: 700, color: "#4b5563" }}>{r.id}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280" }}>{new Date(r.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: "14px 16px", fontSize: 13 }}>
                    <div style={{ fontWeight: 600, color: "#111827" }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: "#6b7280" }}>{r.email} | {r.phone}</div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: 13, color: "#4b5563", maxWidth: 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "block" }}>
                    {r.details || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
