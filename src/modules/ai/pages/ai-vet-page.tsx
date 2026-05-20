"use client";

import { useState, useRef } from "react";
import { Camera, Upload, AlertTriangle, CheckCircle, RefreshCw, AlertCircle, Cpu, Stethoscope } from "lucide-react";

const severityColors: Record<string, string> = { high: "#ff3e1d", critical: "#c62828", low: "#71dd37" };
const severityBgs: Record<string, string> = { high: "#ffebee", critical: "#fce4ec", low: "#e8f5e9" };
const severityLabels: Record<string, string> = { high: "عالي", critical: "خطير", low: "منخفض" };

export default function AIVetPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setFile(f); setPreview(URL.createObjectURL(f)); setResult(null); setError("");
  };

  const diagnose = async () => {
    if (!file) return;
    setLoading(true); setError(""); setResult(null);
    const form = new FormData(); form.append("image", file);
    try {
      const res = await fetch("/api/diagnose", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "فشل التشخيص"); if (data.offline) setError(data.error); }
      else { setResult(data); }
    } catch { setError("تعذر الاتصال بالخادم"); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 className="font-heading" style={{ fontSize: "1.5rem", color: "#384551", margin: 0 }}>البيطري الذكي</h1>
        <p style={{ fontSize: "0.9rem", color: "#7a838b", margin: "4px 0 0" }}>شخص أمراض الدجاج بالذكاء الاصطناعي من خلال الصور</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Upload */}
        <div style={{ background: "#fff", borderRadius: "10px", padding: "24px", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Camera size={20} style={{ color: "#696cff" }} />
            <h2 className="font-subhead" style={{ fontSize: "1rem", color: "#384551", margin: 0 }}>صورة الدجاجة</h2>
          </div>

          <div onClick={() => fileRef.current?.click()} style={{
            border: "2px dashed #e4e6e8", borderRadius: "10px", padding: "40px 20px",
            textAlign: "center", cursor: "pointer", transition: "all 0.2s", marginBottom: "16px",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#696cff"; e.currentTarget.style.background = "#f8f9fa"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e4e6e8"; e.currentTarget.style.background = ""; }}>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
            {preview ? (
              <img src={preview} alt="Preview" style={{ maxHeight: "200px", maxWidth: "100%", borderRadius: "8px" }} />
            ) : (
              <div>
                <Upload size={40} style={{ color: "#91979f", marginBottom: "8px" }} />
                <p style={{ fontSize: "0.9rem", color: "#7a838b", margin: 0 }}>اختر صورة الدجاجة</p>
                <p style={{ fontSize: "0.8rem", color: "#bdc1c5", margin: "4px 0 0" }}>JPG, PNG — مقاس 256×256 بكسل</p>
              </div>
            )}
          </div>

          <button onClick={diagnose} disabled={!file || loading}
            style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "none", fontSize: "0.9rem", fontWeight: "600",
              background: !file || loading ? "#e9eaec" : "#696cff", color: !file || loading ? "#91979f" : "#fff", cursor: !file || loading ? "not-allowed" : "pointer", transition: "all 0.2s" }}>
            {loading ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}><RefreshCw size={16} className="spin" /> جاري التحليل...</span> : "تشخيص المرض"}
          </button>

          {error && (
            <div style={{ marginTop: "16px", padding: "12px", borderRadius: "8px", background: "#ffebee", border: "1px solid #ffcdd2", display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <AlertCircle size={16} style={{ color: "#c62828", flexShrink: 0, marginTop: "2px" }} />
              <p style={{ fontSize: "0.85rem", color: "#c62828", margin: 0 }}>{error}</p>
            </div>
          )}
        </div>

        {/* Result */}
        <div style={{ background: "#fff", borderRadius: "10px", padding: "24px", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Stethoscope size={20} style={{ color: "#696cff" }} />
            <h2 className="font-subhead" style={{ fontSize: "1rem", color: "#384551", margin: 0 }}>نتيجة التشخيص</h2>
          </div>

          {!result && !loading && !error && (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#bdc1c5" }}>
              <Cpu size={48} style={{ marginBottom: "12px", opacity: 0.3 }} />
              <p style={{ fontSize: "0.9rem", margin: 0 }}>ارفع صورة وشخص المرض</p>
            </div>
          )}

          {loading && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <RefreshCw size={32} className="spin" style={{ color: "#696cff", marginBottom: "12px" }} />
              <p style={{ fontSize: "0.9rem", color: "#7a838b" }}><span className="font-brand">POULTRIX</span> AI يحلل الصورة...</p>
            </div>
          )}

          {result && result.disease && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                {result.prediction === "healthy" ? (
                  <CheckCircle size={28} style={{ color: "#71dd37" }} />
                ) : (
                  <AlertTriangle size={28} style={{ color: "#ff3e1d" }} />
                )}
                <div>
                  <h3 className="font-heading" style={{ fontSize: "1.2rem", color: "#384551", margin: 0 }}>{result.disease.nameAr}</h3>
                  <span style={{ fontSize: "0.75rem", fontWeight: "600", padding: "3px 10px", borderRadius: "6px", background: severityBgs[result.disease.severity] || "#f0f1f2", color: severityColors[result.disease.severity] || "#7a838b" }}>
                    {severityLabels[result.disease.severity] || result.disease.severity}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: "0.85rem", color: "#4e5965", lineHeight: 1.7, marginBottom: "16px" }}>{result.disease.description}</p>

              {/* Symptoms */}
              <div style={{ marginBottom: "16px" }}>
                <p style={{ fontSize: "0.8rem", fontWeight: "600", color: "#384551", marginBottom: "8px" }}>الأعراض</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {result.disease.symptoms.map((s: string, i: number) => (
                    <span key={i} style={{ fontSize: "0.8rem", padding: "4px 10px", borderRadius: "6px", background: "#f8f9fa", color: "#4e5965", border: "1px solid #e4e6e8" }}>{s}</span>
                  ))}
                </div>
              </div>

              {/* Treatment */}
              <div style={{ padding: "12px", borderRadius: "8px", background: "#f8f9fa", border: "1px solid #e4e6e8", marginBottom: "12px" }}>
                <p style={{ fontSize: "0.8rem", fontWeight: "600", color: "#384551", marginBottom: "4px" }}>العلاج</p>
                <p style={{ fontSize: "0.85rem", color: "#4e5965", margin: 0, lineHeight: 1.6 }}>{result.disease.treatment}</p>
              </div>

              {/* Prevention */}
              <div style={{ padding: "12px", borderRadius: "8px", background: "#e8f5e9", border: "1px solid #c8e6c9" }}>
                <p style={{ fontSize: "0.8rem", fontWeight: "600", color: "#2e7d32", marginBottom: "4px" }}>الوقاية</p>
                <p style={{ fontSize: "0.85rem", color: "#1b5e20", margin: 0, lineHeight: 1.6 }}>{result.disease.prevention}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* How it works */}
      <div style={{ marginTop: "24px", background: "#fff", borderRadius: "10px", padding: "20px", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
        <p style={{ fontSize: "0.9rem", fontWeight: "600", color: "#384551", marginBottom: "12px" }}>كيف يعمل؟</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {[
            { step: "1", title: "ارفع الصورة", desc: "صور دجاجتك بهاتفك وارفعها" },
            { step: "2", title: "AI يحلل", desc: "نموذج ذكاء اصطناعي مدرب على آلاف الصور" },
            { step: "3", title: "شوف النتيجة", desc: "احصل على التشخيص والعلاج فوراً" },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#696cff", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", fontWeight: "700", margin: "0 auto 8px" }}>{item.step}</div>
              <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#384551", margin: "0 0 4px" }}>{item.title}</p>
              <p style={{ fontSize: "0.8rem", color: "#7a838b", margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`.spin{animation:spin 1s linear infinite}@keyframes spin{100%{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
