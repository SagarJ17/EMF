"use client";

import { useState, useEffect } from "react";
import { Trash2, Upload, Loader2, Play, Lock, Settings as SettingsIcon, Image as ImageIcon, Video, Star, Activity, Youtube } from "lucide-react";
import Image from "next/image";

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
              style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "1px solid #e5e7eb", marginBottom: 16 }}
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
      <div style={{ background: "white", padding: "24px", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <h1 style={{ fontFamily: "Outfit", fontWeight: 800, fontSize: 28 }}>
            EMF <span style={{ color: "#e8450a" }}>CMS</span>
          </h1>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button onClick={() => setActiveTab("transformations")} className={activeTab === "transformations" ? "btn-orange" : "btn-outline"} style={{ padding: "8px 16px", fontSize: 13, gap: 6, display: "flex", alignItems: "center" }}>
              <ImageIcon size={14} /> Transformations
            </button>
            <button onClick={() => setActiveTab("media")} className={activeTab === "media" ? "btn-orange" : "btn-outline"} style={{ padding: "8px 16px", fontSize: 13, gap: 6, display: "flex", alignItems: "center" }}>
              <Video size={14} /> Media & Reviews
            </button>
            <button onClick={() => setActiveTab("services")} className={activeTab === "services" ? "btn-orange" : "btn-outline"} style={{ padding: "8px 16px", fontSize: 13, gap: 6, display: "flex", alignItems: "center" }}>
              <Activity size={14} /> Training Services
            </button>
            <button onClick={() => setActiveTab("settings")} className={activeTab === "settings" ? "btn-orange" : "btn-outline"} style={{ padding: "8px 16px", fontSize: 13, gap: 6, display: "flex", alignItems: "center" }}>
              <SettingsIcon size={14} /> Site Settings
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
        {activeTab === "transformations" && <TransformationsTab apiUrl={apiUrl} />}
        {activeTab === "media" && <MediaTab apiUrl={apiUrl} />}
        {activeTab === "services" && <ServicesTab apiUrl={apiUrl} />}
        {activeTab === "settings" && <SettingsTab apiUrl={apiUrl} />}
      </div>

      <style>{`
        .admin-grid { display: grid; gap: 32px; grid-template-columns: 1fr 2fr; }
        .settings-grid { display: grid; gap: 16px; grid-template-columns: 1fr 1fr; }
        @media (max-width: 900px) { .admin-grid { grid-template-columns: 1fr; } }
        @media (max-width: 600px) { .settings-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}

// ------ TRANSFORMATIONS TAB ------
function TransformationsTab({ apiUrl }: { apiUrl: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [type, setType] = useState<"image" | "video">("image");

  const [name, setName] = useState("");
  const [result, setResult] = useState("");
  const [quote, setQuote] = useState("");
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const fetchItems = () => {
    fetch(`${apiUrl}/transformations`).then(r => r.json()).then(setItems).finally(() => setLoading(false));
  };
  useEffect(() => { fetchItems(); }, []);

  const uploadFile = async (f: File, folder: str) => {
    const fd = new FormData(); fd.append("file", f);
    const r = await fetch(`${apiUrl}/upload?folder=${folder}`, { method: "POST", body: fd });
    return (await r.json()).url;
  };

  const submit = async (e: any) => {
    e.preventDefault();
    if (!name) return alert("Client Name is required.");
    
    if (type === "image" && (!beforeFile || !afterFile)) {
       return alert("You selected Image Mode. Both Before and After photos are required.");
    }
    if (type === "video" && !videoFile) {
       return alert("You selected Video Mode. A video file is required.");
    }

    setSaving(true);
    try {
      let payload: any = { name, result, quote };
      
      if (type === "image") {
         payload.before_image = await uploadFile(beforeFile!, "transformations");
         payload.after_image = await uploadFile(afterFile!, "transformations");
      } else {
         payload.video = await uploadFile(videoFile!, "transformations");
      }

      await fetch(`${apiUrl}/transformations`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      setName(""); setResult(""); setQuote(""); setBeforeFile(null); setAfterFile(null); setVideoFile(null);
      fetchItems();
    } finally { setSaving(false); }
  };

  return (
    <div className="admin-grid">
       <div style={{ background: "white", padding: 32, borderRadius: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.03)", height: "fit-content" }}>
         <h2 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 20, marginBottom: 24, borderBottom: "1px solid #eee", paddingBottom: 16 }}>
            Add Transformation
         </h2>

         <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
           <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
             <input type="radio" checked={type === "image"} onChange={() => setType("image")} /> Photos Mode
           </label>
           <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
             <input type="radio" checked={type === "video"} onChange={() => setType("video")} /> Video Mode
           </label>
         </div>

         <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
           <div>
             <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Client Name *</label>
             <input required value={name} onChange={e => setName(e.target.value)} type="text" style={{ width: "100%", padding: "10px 14px", border: "1px solid #ccc", borderRadius: 8 }} placeholder="e.g. John Doe" />
           </div>
           
           <div>
             <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Result Claim</label>
             <input value={result} onChange={e => setResult(e.target.value)} type="text" style={{ width: "100%", padding: "10px 14px", border: "1px solid #ccc", borderRadius: 8 }} placeholder="e.g. -12kg in 3 months" />
           </div>

           <div>
             <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Testimonial Quote</label>
             <textarea value={quote} onChange={e => setQuote(e.target.value)} rows={3} style={{ width: "100%", padding: "10px 14px", border: "1px solid #ccc", borderRadius: 8 }} placeholder="e.g. EMF changed my life!" />
           </div>

           <div style={{ padding: 16, background: "#f9fafb", borderRadius: 12, border: "1px dashed #d1d5db" }}>
             <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 12 }}>Media Upload (MinIO)</p>
             
             {type === "image" ? (
               <>
                 <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer", marginBottom: 8, color: "#e8450a" }}>
                   <Upload size={14} /> Upload Before Photo
                   <input type="file" style={{ display: "none" }} accept="image/*" onChange={e => setBeforeFile(e.target.files?.[0] || null)} />
                 </label>
                 {beforeFile && <p style={{ fontSize: 11, color: "green", marginBottom: 12 }}>Selected: {beforeFile.name}</p>}

                 <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer", marginBottom: 8, color: "#e8450a" }}>
                   <Upload size={14} /> Upload After Photo
                   <input type="file" style={{ display: "none" }} accept="image/*" onChange={e => setAfterFile(e.target.files?.[0] || null)} />
                 </label>
                 {afterFile && <p style={{ fontSize: 11, color: "green", marginBottom: 8 }}>Selected: {afterFile.name}</p>}
               </>
             ) : (
                <>
                 <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer", marginBottom: 8, color: "#3b82f6" }}>
                   <Upload size={14} /> Upload Video File (MP4)
                   <input type="file" style={{ display: "none" }} accept="video/mp4" onChange={e => setVideoFile(e.target.files?.[0] || null)} />
                 </label>
                 {videoFile && <p style={{ fontSize: 11, color: "green", marginBottom: 8 }}>Selected: {videoFile.name}</p>}
               </>
             )}
           </div>

           <button disabled={saving} className="btn-orange" style={{ padding: "12px", display: "flex", justifyContent: "center", gap: 8 }}>
              {saving ? <Loader2 size={18} className="animate-spin" /> : "Save to Database"}
           </button>
         </form>
       </div>

       <div style={{ background: "white", padding: 32, borderRadius: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
          <h2 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 20, marginBottom: 24, borderBottom: "1px solid #eee", paddingBottom: 16 }}>
            Client Database
          </h2>
          {loading ? <p style={{ color: "#9ca3af", fontSize: 14 }}>Loading database...</p> : items.length === 0 ? <p style={{ color: "#9ca3af", fontSize: 14 }}>No transformations found...</p> : items.map(t => (
            <div key={t.id} style={{ display: "flex", padding: 16, border: "1px solid #f3f4f6", marginBottom: 16, borderRadius: 12, alignItems: "center", gap: 16 }}>
              {t.video ? (
                 <div style={{ width: 48, height: 48, background: "black", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                     <Play size={16} color="white" />
                 </div>
              ) : (
                 <div style={{ width: 48, height: 48, position: "relative", borderRadius: 8, overflow: "hidden", background: "#eee", flexShrink: 0 }}>
                   {t.after_image && <Image src={t.after_image} alt="" fill style={{ objectFit: "cover" }} unoptimized={t.after_image?.includes("localhost")} />}
                 </div>
              )}
              <div style={{ flex: 1 }}>
                 <p style={{ fontWeight: 600, fontSize: 15, color: "#111827", margin: 0 }}>{t.name}</p>
                 <p style={{ fontSize: 13, color: "#6b7280", margin: "2px 0 0 0" }}>{t.result}</p>
              </div>
              <button 
                 onClick={async () => { if(confirm("Delete this entry?")){ await fetch(`${apiUrl}/transformations/${t.id}`, {method: "DELETE"}); fetchItems();} }} 
                 style={{ background: "#fee2e2", border: "none", color: "#ef4444", padding: 10, borderRadius: 8, cursor: "pointer", display: "flex" }}
              >
                <Trash2 size={16}/>
              </button>
            </div>
          ))}
       </div>
    </div>
  );
}

// ------ MEDIA & REVIEWS TAB ------
function MediaTab({ apiUrl }: { apiUrl: string }) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [ytLoading, setYtLoading] = useState(false);
  
  const [ytUrl, setYtUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [channelUrl, setChannelUrl] = useState("");
  
  const [rName, setRName] = useState("");
  const [rComment, setRComment] = useState("");
  const [rRating, setRRating] = useState(5);

  const fetchData = () => {
    fetch(`${apiUrl}/reviews`).then(r => r.json()).then(setReviews);
    fetch(`${apiUrl}/videos`).then(r => r.json()).then(setVideos);
  };
  useEffect(() => { fetchData(); }, []);

  const addVideo = async (e: any) => {
    e.preventDefault();
    if (!ytUrl || !videoTitle) return;
    const match = ytUrl.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    const thumb = match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : "";
    await fetch(`${apiUrl}/videos`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: videoTitle, url: ytUrl, platform: "youtube", thumbnail: thumb })
    });
    setYtUrl(""); setVideoTitle(""); fetchData();
  };

  const autoFetchChannel = async (e: any) => {
     e.preventDefault();
     setYtLoading(true);
     try {
       const res = await fetch(`/api/youtube?url=${encodeURIComponent(channelUrl)}`);
       const data = await res.json();
       if(data.error) throw new Error(data.error);

       for (const v of data.videos) {
          await fetch(`${apiUrl}/videos`, {
             method: "POST", headers: { "Content-Type": "application/json" },
             body: JSON.stringify({ title: v.title, url: v.url, platform: "youtube", thumbnail: v.thumbnail })
          });
       }
       alert(`Successfully fetched ${data.videos.length} videos!`);
       setChannelUrl(""); fetchData();
     } catch (err: any) {
       alert("Failed to parse channel. Ensure it is a valid url like youtube.com/@Handle");
     } finally {
       setYtLoading(false);
     }
  };

  const addReview = async (e: any) => {
    e.preventDefault();
    let img = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face";
    await fetch(`${apiUrl}/reviews`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: rName, rating: rRating, comment: rComment, image_url: img })
    });
    setRName(""); setRComment(""); setRRating(5); fetchData();
  };

  return (
    <div className="admin-grid">
       <div style={{ background: "white", padding: 32, borderRadius: 20 }}>
         <h2 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 20, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}><Video size={20} color="#e8450a"/> Video Gallery Tracker</h2>
         
         <div style={{ padding: 16, background: "#fff5f0", borderRadius: 12, marginBottom: 24, border: "1px dashed #e8450a" }}>
            <h4 style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}><Youtube size={14}/> Auto-Fetch from Channel</h4>
            <form onSubmit={autoFetchChannel} style={{ display: "flex", gap: 8 }}>
               <input value={channelUrl} onChange={e=>setChannelUrl(e.target.value)} type="text" required placeholder="https://youtube.com/@YourHandle" style={{ flex: 1, padding: "8px 12px", border: "1px solid #ccc", borderRadius: 8, fontSize: 13 }} />
               <button disabled={ytLoading} className="btn-orange" style={{ padding: "8px 16px", fontSize: 13 }}>{ytLoading ? "Parsing..." : "Sync Latest"}</button>
            </form>
         </div>

         <h4 style={{ fontWeight: 700, fontSize: 13, marginBottom: 12, color: "#6b7280" }}>OR Single Video Upload</h4>
         <form onSubmit={addVideo} style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
           <input value={videoTitle} onChange={e=>setVideoTitle(e.target.value)} required type="text" placeholder="Custom Video Title" style={{ width: "100%", padding: "10px 14px", border: "1px solid #ccc", borderRadius: 8 }} />
           <input value={ytUrl} onChange={e=>setYtUrl(e.target.value)} required type="text" placeholder="Youtube URL (https://...)" style={{ width: "100%", padding: "10px 14px", border: "1px solid #ccc", borderRadius: 8 }} />
           <button className="btn-outline" style={{ padding: 12 }}>Inject Single Video</button>
         </form>

         {videos.map(v => (
            <div key={v.id} style={{ display: "flex", padding: 12, border: "1px solid #eee", marginBottom: 8, borderRadius: 8, alignItems: "center", gap: 12 }}>
              <div style={{ width: 60, height: 40, background: "#eee", borderRadius: 4, overflow: "hidden", position: "relative" }}>
                 {v.thumbnail && <Image src={v.thumbnail} alt="" fill style={{ objectFit: "cover" }} />}
              </div>
              <div style={{ flex: 1, fontSize: 13 }}><b>{v.title}</b></div>
              <button onClick={async () => { await fetch(`${apiUrl}/videos/${v.id}`, {method: "DELETE"}); fetchData(); }} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}><Trash2 size={16}/></button>
            </div>
         ))}
       </div>

       <div style={{ background: "white", padding: 32, borderRadius: 20 }}>
         <h2 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 20, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}><Star size={20} color="#e8450a"/> Client Reviews (Wall of Love)</h2>
         <form onSubmit={addReview} style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
           
           <input value={rName} onChange={e=>setRName(e.target.value)} required type="text" placeholder="Client Name" style={{ width: "100%", padding: "10px 14px", border: "1px solid #ccc", borderRadius: 8 }} />
           
           {/* Star Selector */}
           <div style={{ display: "flex", gap: 4, padding: "4px 0" }}>
             {[1,2,3,4,5].map(s => (
                <Star key={s} size={24} onClick={() => setRRating(s)} fill={s <= rRating ? "#fbbf24" : "none"} color={s <= rRating ? "#fbbf24" : "#cbd5e1"} style={{ cursor: "pointer", transition: "all 0.2s" }} />
             ))}
           </div>

           <textarea value={rComment} onChange={e=>setRComment(e.target.value)} required placeholder="Awesome program..." rows={3} style={{ width: "100%", padding: "10px 14px", border: "1px solid #ccc", borderRadius: 8 }} />
           <button className="btn-outline" style={{ padding: 12 }}>Post Review</button>
         </form>

         {reviews.map(r => (
            <div key={r.id} style={{ display: "flex", padding: 12, border: "1px solid #eee", marginBottom: 8, borderRadius: 8, alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, fontSize: 13 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <b>{r.name}</b>
                  <div style={{ display: "flex" }}>{[...Array(r.rating)].map((_, i)=><Star key={i} size={12} fill="#fbbf24" color="#fbbf24"/>)}</div>
                </div>
                <p style={{ margin: "4px 0 0", color: "#6b7280", maxHeight: 40, overflow: "hidden" }}>{r.comment}</p>
              </div>
              <button onClick={async () => { await fetch(`${apiUrl}/reviews/${r.id}`, {method: "DELETE"}); fetchData(); }} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}><Trash2 size={16}/></button>
            </div>
         ))}
       </div>
    </div>
  );
}

// ------ SERVICES TAB ------
function ServicesTab({ apiUrl }: { apiUrl: string }) {
  const [cards, setCards] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [features, setFeatures] = useState("");
  const [iconName, setIconName] = useState("Activity");

  useEffect(() => {
    fetch(`${apiUrl}/settings`).then(r => r.json()).then(s => {
       if(s.services_cards) {
         try { setCards(JSON.parse(s.services_cards)); } catch {}
       }
    });
  }, [apiUrl]);

  const saveToPostgres = async (arr: any[]) => {
    setSaving(true);
    await fetch(`${apiUrl}/settings`, {
       method: "POST", headers: { "Content-Type": "application/json" },
       body: JSON.stringify({ services_cards: JSON.stringify(arr) })
    });
    setSaving(false);
  };

  const addCard = async (e: any) => {
    e.preventDefault();
    if(!title || !desc) return;
    const newArr = [...cards, { 
      title, price, desc, 
      features: features.split(",").map(i => i.trim()).filter(i => i), 
      iconName 
    }];
    setCards(newArr);
    await saveToPostgres(newArr);
    setTitle(""); setPrice(""); setDesc(""); setFeatures("");
  };

  return (
    <div className="admin-grid">
       <div style={{ background: "white", padding: 32, borderRadius: 20 }}>
         <h2 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 20, marginBottom: 24 }}>Assemble Service Package</h2>
         <form onSubmit={addCard} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
           <input value={title} onChange={e=>setTitle(e.target.value)} required placeholder="Package Name (e.g. Fat Loss)" style={{ width: "100%", padding: "10px 14px", border: "1px solid #ccc", borderRadius: 8 }} />
           <input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Pricing (e.g. Starting ₹2,999/mo)" style={{ width: "100%", padding: "10px 14px", border: "1px solid #ccc", borderRadius: 8 }} />
           <textarea value={desc} onChange={e=>setDesc(e.target.value)} required rows={3} placeholder="Package description..." style={{ width: "100%", padding: "10px 14px", border: "1px solid #ccc", borderRadius: 8 }} />
           <textarea value={features} onChange={e=>setFeatures(e.target.value)} rows={3} placeholder="Feature 1, Feature 2, Feature 3 (Comma separated)" style={{ width: "100%", padding: "10px 14px", border: "1px solid #ccc", borderRadius: 8 }} />
           
           <div>
             <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Lucide Icon Name</label>
             <select value={iconName} onChange={e=>setIconName(e.target.value)} style={{ width: "100%", padding: "10px 14px", border: "1px solid #ccc", borderRadius: 8 }}>
                <option value="Home">Home</option>
                <option value="Monitor">Monitor (Online)</option>
                <option value="Flame">Flame (Fat Loss)</option>
                <option value="Dumbbell">Dumbbell (Strength)</option>
                <option value="Activity">Activity (Metrics)</option>
             </select>
           </div>
           
           <button disabled={saving} className="btn-orange" style={{ padding: "12px" }}>
              {saving ? "Deploying..." : "Add Package"}
           </button>
         </form>
       </div>

       <div style={{ background: "white", padding: 32, borderRadius: 20 }}>
         <h2 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 20, marginBottom: 24 }}>Active Packages</h2>
         {cards.length === 0 ? <p style={{ color: "#6b7280", fontSize: 14 }}>No custom packages configured. Site is defaulting to Fallback Array.</p> : cards.map((c, idx) => (
            <div key={idx} style={{ padding: 16, border: "1px solid #f3f4f6", borderRadius: 12, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
               <div>
                 <strong style={{ fontSize: 15, color: "#111827" }}>{c.title}</strong>
                 <p style={{ margin: "4px 0", fontSize: 13, color: "#e8450a", fontWeight: "bold" }}>{c.price}</p>
                 <p style={{ margin: "4px 0", fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>{c.desc}</p>
                 <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {c.features?.map((f: string, i: number) => (
                      <span key={i} style={{ background: "#f3f4f6", padding: "4px 8px", borderRadius: 4, fontSize: 11, color: "#374151" }}>{f}</span>
                    ))}
                 </div>
               </div>
               <button onClick={async () => { 
                 const newArr = cards.filter((_, i) => i !== idx);
                 setCards(newArr); await saveToPostgres(newArr);
               }} style={{ background: "#fee2e2", border: "none", color: "#ef4444", padding: 8, borderRadius: 8, cursor: "pointer" }}>
                 <Trash2 size={16} />
               </button>
            </div>
         ))}
       </div>
    </div>
  );
}

// ------ SETTINGS TAB ------
function SettingsTab({ apiUrl }: { apiUrl: string }) {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  useEffect(() => {
    fetch(`${apiUrl}/settings`).then(r => r.json()).then(setSettings);
  }, [apiUrl]);

  const update = (key: string, val: string) => setSettings(p => ({ ...p, [key]: val }));

  const save = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    let dict = { ...settings };

    if (pdfFile) {
      const fd = new FormData(); fd.append("file", pdfFile);
      const res = await fetch(`${apiUrl}/upload?folder=pdfs`, { method: "POST", body: fd });
      dict.diet_pdf_url = (await res.json()).url;
    }

    try {
      await fetch(`${apiUrl}/settings`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dict)
      });
      alert("\u2713 Settings globally deployed!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ background: "white", padding: 40, borderRadius: 20 }}>
      <h2 style={{ fontFamily: "Outfit", fontWeight: 700, fontSize: 24, marginBottom: 8 }}>Global Site Settings</h2>
      <p style={{ color: "#6b7280", marginBottom: 32 }}>These structural elements mimic exactly the layout flow of the Live Application to prevent misconfiguration.</p>
      
      <form onSubmit={save} style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        
        {/* HERO SECTION MIMIC */}
        <div style={{ border: "2px solid #f3f4f6", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ background: "#f9fafb", padding: "16px 24px", borderBottom: "1px solid #f3f4f6", fontWeight: "bold" }}>1. Hero Conversion Area</div>
          <div style={{ padding: 24, display: "grid", gap: 16 }}>
             <input placeholder="Hero Main Headline" value={settings.hero_headline || "Transform Your Body / Without Leaving / Home"} onChange={e => update("hero_headline", e.target.value)} style={{ padding: "12px", border: "1px solid #ccc", borderRadius: 8, fontSize: 16, fontWeight: 700 }} />
             <input placeholder="Hero Subheadline" value={settings.hero_subheadline || ""} onChange={e => update("hero_subheadline", e.target.value)} style={{ padding: "12px", border: "1px solid #ccc", borderRadius: 8 }} />
             <div className="settings-grid">
               <input placeholder="'Train With Me' Button Output (URL or #book anchor)" value={settings.train_with_me_link || ""} onChange={e => update("train_with_me_link", e.target.value)} style={{ padding: "12px", border: "1px solid #ccc", borderRadius: 8 }} />
             </div>
          </div>
        </div>

        {/* LEAD MAGNET MIMIC */}
        <div style={{ border: "2px solid #f3f4f6", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ background: "#f9fafb", padding: "16px 24px", borderBottom: "1px solid #f3f4f6", fontWeight: "bold" }}>2. Lead Acquisition (Free Diet Plan)</div>
          <div style={{ padding: 24, background: "#fff5f0" }}>
             <p style={{ fontSize: 13, marginBottom: 12, color: "#e8450a", fontWeight: "bold", display: "flex", alignItems: "center", gap: 6 }}><Upload size={16}/> Upload Database Strategy PDF</p>
             <input type="file" accept="application/pdf" onChange={e => setPdfFile(e.target.files?.[0] || null)} style={{ fontSize: 13, background: "white", padding: 12, borderRadius: 8, width: "100%" }} />
             <p style={{ fontSize: 11, marginTop: 8, color: "#6b7280" }}>Current MinIO Bound URL: {settings.diet_pdf_url || "Default Resource"}</p>
          </div>
        </div>

        {/* ABOUT FOUNDER MIMIC */}
        <div style={{ border: "2px solid #f3f4f6", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ background: "#f9fafb", padding: "16px 24px", borderBottom: "1px solid #f3f4f6", fontWeight: "bold" }}>3. About Developer Metrics</div>
          <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
             <input placeholder="Founder Name Box" value={settings.about_name || "Neeraj Bhadauria"} onChange={e => update("about_name", e.target.value)} style={{ padding: "12px", border: "1px solid #ccc", borderRadius: 8 }} />
             <textarea rows={2} placeholder="Paragraph 1 Block" value={settings.about_p1 || ""} onChange={e => update("about_p1", e.target.value)} style={{ padding: "12px", border: "1px solid #ccc", borderRadius: 8 }} />
             <textarea rows={2} placeholder="Paragraph 2 Block" value={settings.about_p2 || ""} onChange={e => update("about_p2", e.target.value)} style={{ padding: "12px", border: "1px solid #ccc", borderRadius: 8 }} />
             
             <div className="settings-grid" style={{ background: "#f9fafb", padding: 16, borderRadius: 12 }}>
                <div><label style={{ fontSize: 11, color: "#6b7280" }}>Clients Transformed Metric</label><br/><input value={settings.about_stat1_val || ""} style={{ width: "25%", padding: "8px", border: "1px solid #ccc", borderRadius: 8, marginRight: 8 }} onChange={e=>update("about_stat1_val", e.target.value)}/><input value={settings.about_stat1_lbl || "Clients Transformed"} style={{ width: "70%", padding: "8px", border: "1px solid #ccc", borderRadius: 8 }} onChange={e=>update("about_stat1_lbl", e.target.value)}/></div>
                <div><label style={{ fontSize: 11, color: "#6b7280" }}>Years Experience Metric</label><br/><input value={settings.about_stat2_val || ""} style={{ width: "25%", padding: "8px", border: "1px solid #ccc", borderRadius: 8, marginRight: 8 }} onChange={e=>update("about_stat2_val", e.target.value)}/><input value={settings.about_stat2_lbl || "Years Experience"} style={{ width: "70%", padding: "8px", border: "1px solid #ccc", borderRadius: 8 }} onChange={e=>update("about_stat2_lbl", e.target.value)}/></div>
                <div><label style={{ fontSize: 11, color: "#6b7280" }}>Sessions Delivered Metric</label><br/><input value={settings.about_stat3_val || ""} style={{ width: "25%", padding: "8px", border: "1px solid #ccc", borderRadius: 8, marginRight: 8 }} onChange={e=>update("about_stat3_val", e.target.value)}/><input value={settings.about_stat3_lbl || "Sessions Delivered"} style={{ width: "70%", padding: "8px", border: "1px solid #ccc", borderRadius: 8 }} onChange={e=>update("about_stat3_lbl", e.target.value)}/></div>
                <div><label style={{ fontSize: 11, color: "#6b7280" }}>Custom Core Metric 4</label><br/><input value={settings.about_stat4_val || ""} style={{ width: "25%", padding: "8px", border: "1px solid #ccc", borderRadius: 8, marginRight: 8 }} onChange={e=>update("about_stat4_val", e.target.value)}/><input value={settings.about_stat4_lbl || "Personalised Plans"} style={{ width: "70%", padding: "8px", border: "1px solid #ccc", borderRadius: 8 }} onChange={e=>update("about_stat4_lbl", e.target.value)}/></div>
             </div>
             <textarea rows={2} placeholder="Certifications & Specialties (separate by pipeline | symbol)" value={settings.about_certs || ""} onChange={e => update("about_certs", e.target.value)} style={{ padding: "12px", border: "1px solid #ccc", borderRadius: 8 }} />
          </div>
        </div>

        {/* FOOTER MIMIC */}
        <div style={{ border: "2px solid #f3f4f6", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ background: "#f9fafb", padding: "16px 24px", borderBottom: "1px solid #f3f4f6", fontWeight: "bold" }}>4. Site Footer Links</div>
          <div style={{ padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
             <input placeholder="Footer Description Text" value={settings.footer_blurb || ""} onChange={e => update("footer_blurb", e.target.value)} style={{ padding: "12px", border: "1px solid #ccc", borderRadius: 8, gridColumn: "1 / -1" }} />
             <input placeholder="Instagram External URL" value={settings.social_instagram || ""} onChange={e => update("social_instagram", e.target.value)} style={{ padding: "12px", border: "1px solid #ccc", borderRadius: 8 }} />
             <input placeholder="YouTube External URL" value={settings.social_youtube || ""} onChange={e => update("social_youtube", e.target.value)} style={{ padding: "12px", border: "1px solid #ccc", borderRadius: 8 }} />
             <input placeholder="WhatsApp External URL (wa.me/...)" value={settings.social_whatsapp || ""} onChange={e => update("social_whatsapp", e.target.value)} style={{ padding: "12px", border: "1px solid #ccc", borderRadius: 8 }} />
          </div>
        </div>

        <button disabled={saving} className="btn-orange" style={{ padding: "18px", fontSize: 18, marginTop: 16, boxShadow: "0 10px 25px -5px rgba(232, 69, 10, 0.4)" }}>
          {saving ? "Deploying Site Updates..." : "Save All Master Settings"}
        </button>

      </form>
    </div>
  );
}
