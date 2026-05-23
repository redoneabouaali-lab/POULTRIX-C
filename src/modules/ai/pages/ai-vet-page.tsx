"use client";

import { useState, useRef } from "react";
import { motion } from "motion/react";
import { COLORS } from "@/constants";
import { Camera, Upload, AlertTriangle, CheckCircle, RefreshCw, AlertCircle, Cpu, Stethoscope } from "lucide-react";
import { PageWrapper } from "@/components/ui/3d-card";

const severityColors: Record<string, string> = { high: COLORS.gold, critical: COLORS.blue, low: COLORS.aqua };
const severityBgs: Record<string, string> = { high: "rgba(191, 122, 90, 0.15)", critical: "rgba(45, 85, 65, 0.15)", low: "rgba(196, 137, 58, 0.15)" };
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
    <PageWrapper>
    <div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: "24px" }}
      >
        <h1 className="font-heading" style={{ fontSize: "1.5rem", color: "#384551", margin: 0 }}>البيطري الذكي</h1>
        <p style={{ fontSize: "0.9rem", color: "#7a838b", margin: "4px 0 0" }}>شخص أمراض الدجاج بالذكاء الاصطناعي من خلال الصور</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}
      >
        {/* Upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Camera size={20} style={{ color: COLORS.aqua }} />
            <h2 className="font-subhead font-heading" style={{ fontSize: "1rem", color: "#384551", margin: 0 }}>صورة الدجاجة</h2>
          </div>

          <motion.div
            onClick={() => fileRef.current?.click()}
            whileHover={{ borderColor: COLORS.aqua, background: "#f8f9fa", scale: 1.01 }}
            style={{
              border: "2px dashed #e4e6e8", borderRadius: "12px", padding: "40px 20px",
              textAlign: "center", cursor: "pointer", marginBottom: "16px",
            }}
          >
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
            {preview ? (
              <motion.img
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                src={preview} alt="Preview"
                style={{ maxHeight: "200px", maxWidth: "100%", borderRadius: "8px" }}
              />
            ) : (
              <div>
                <Upload size={40} style={{ color: "#91979f", marginBottom: "8px" }} />
                <p style={{ fontSize: "0.9rem", color: "#7a838b", margin: 0 }}>اختر صورة الدجاجة</p>
                <p style={{ fontSize: "0.8rem", color: "#bdc1c5", margin: "4px 0 0" }}>JPG, PNG — مقاس 256×256 بكسل</p>
              </div>
            )}
          </motion.div>

          <motion.button
            onClick={diagnose} disabled={!file || loading}
            whileHover={!file || loading ? {} : { scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}
            whileTap={{ scale: 0.98 }}
            style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "none", fontSize: "0.9rem", fontWeight: "600",
              background: !file || loading ? "#e9eaec" : COLORS.blue, color: !file || loading ? "#91979f" : "#fff", cursor: !file || loading ? "not-allowed" : "pointer" }}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <RefreshCw size={16} />
                </motion.span>
                جاري التحليل...
              </span>
            ) : "تشخيص المرض"}
          </motion.button>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              style={{ marginTop: "16px", padding: "12px", borderRadius: "10px", background: `${COLORS.gold}15`, border: `1px solid ${COLORS.gold}40`, display: "flex", alignItems: "flex-start", gap: "8px", overflow: "hidden" }}
            >
              <AlertCircle size={16} style={{ color: COLORS.gold, flexShrink: 0, marginTop: "2px" }} />
              <p style={{ fontSize: "0.85rem", color: COLORS.gold, margin: 0 }}>{error}</p>
            </motion.div>
          )}
        </motion.div>

        {/* Result */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <Stethoscope size={20} style={{ color: COLORS.blue }} />
            <h2 className="font-subhead font-heading" style={{ fontSize: "1rem", color: "#384551", margin: 0 }}>نتيجة التشخيص</h2>
          </div>

          {!result && !loading && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ textAlign: "center", padding: "40px 0", color: "#bdc1c5" }}
            >
              <Cpu size={48} style={{ marginBottom: "12px", opacity: 0.3 }} />
              <p style={{ fontSize: "0.9rem", margin: 0 }}>ارفع صورة وشخص المرض</p>
            </motion.div>
          )}

          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              style={{ textAlign: "center", padding: "40px 0" }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ width: 32, height: 32, borderRadius: "50%", border: `3px solid ${COLORS.cream}`, borderTopColor: COLORS.aqua, margin: "0 auto 12px" }}
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ fontSize: "0.9rem", color: "#7a838b" }}
              >
                <span className="font-brand">POULTRIX</span> AI يحلل الصورة...
              </motion.p>
            </motion.div>
          )}

          {result && result.disease && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}
              >
                {result.prediction === "healthy" ? (
                  <CheckCircle size={28} style={{ color: COLORS.aqua }} />
                ) : (
                  <AlertTriangle size={28} style={{ color: COLORS.gold }} />
                )}
                <div>
                  <h3 className="font-heading" style={{ fontSize: "1.2rem", color: "#384551", margin: 0 }}>{result.disease.nameAr}</h3>
                  <span style={{ fontSize: "0.75rem", fontWeight: "600", padding: "3px 10px", borderRadius: "6px", background: severityBgs[result.disease.severity] || "#f0f1f2", color: severityColors[result.disease.severity] || "#7a838b" }}>
                    {severityLabels[result.disease.severity] || result.disease.severity}
                  </span>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{ fontSize: "0.85rem", color: "#4e5965", lineHeight: 1.7, marginBottom: "16px" }}
              >
                {result.disease.description}
              </motion.p>

              {/* Symptoms */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ marginBottom: "16px" }}
              >
                <p style={{ fontSize: "0.8rem", fontWeight: "600", color: "#384551", marginBottom: "8px" }}>الأعراض</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {result.disease.symptoms.map((s: string, i: number) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.35 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      style={{ fontSize: "0.8rem", padding: "4px 10px", borderRadius: "6px", background: `${COLORS.cream}`, color: "#4e5965", border: `1px solid ${COLORS.cream}` }}
                    >{s}</motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Treatment */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{ padding: "12px", borderRadius: "10px", background: `${COLORS.blue}08`, border: `1px solid ${COLORS.blue}20`, marginBottom: "12px" }}
              >
                <p style={{ fontSize: "0.8rem", fontWeight: "600", color: COLORS.blue, marginBottom: "4px" }}>العلاج</p>
                <p style={{ fontSize: "0.85rem", color: "#4e5965", margin: 0, lineHeight: 1.6 }}>{result.disease.treatment}</p>
              </motion.div>

              {/* Prevention */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                style={{ padding: "12px", borderRadius: "10px", background: `${COLORS.aqua}10`, border: `1px solid ${COLORS.aqua}30` }}
              >
                <p style={{ fontSize: "0.8rem", fontWeight: "600", color: COLORS.aqua, marginBottom: "4px" }}>الوقاية</p>
                <p style={{ fontSize: "0.85rem", color: "#7a5a2e", margin: 0, lineHeight: 1.6 }}>{result.disease.prevention}</p>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* How it works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginTop: "24px", background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)" }}
      >
        <p className="font-heading" style={{ fontSize: "0.9rem", fontWeight: "600", color: "#384551", marginBottom: "12px" }}>كيف يعمل؟</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {[
            { step: "1", title: "ارفع الصورة", desc: "صور دجاجتك بهاتفك وارفعها" },
            { step: "2", title: "AI يحلل", desc: "نموذج ذكاء اصطناعي مدرب على آلاف الصور" },
            { step: "3", title: "شوف النتيجة", desc: "احصل على التشخيص والعلاج فوراً" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4 }}
              style={{ textAlign: "center" }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.45 + i * 0.1, type: "spring" as const, stiffness: 200, damping: 15 }}
                style={{ width: "40px", height: "40px", borderRadius: "50%", background: COLORS.blue, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", fontWeight: "700", margin: "0 auto 8px", boxShadow: `0 2px 8px ${COLORS.blue}40` }}
              >{item.step}</motion.div>
              <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#384551", margin: "0 0 4px" }}>{item.title}</p>
              <p style={{ fontSize: "0.8rem", color: "#7a838b", margin: 0 }}>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
    </PageWrapper>
  );
}
