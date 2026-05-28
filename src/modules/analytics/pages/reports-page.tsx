"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { COLORS } from "@/constants";
import { FileText, Download, BarChart3, Heart, Bird, DollarSign, FileSpreadsheet, File as FilePdf } from "lucide-react";

const reportTypes = [
  { id: "production", icon: BarChart3, label: "تقرير الإنتاج", desc: "إنتاج البيض واللحم", color: COLORS.aqua },
  { id: "financial", icon: DollarSign, label: "تقرير مالي", desc: "الإيرادات والتكاليف والأرباح", color: COLORS.gold },
  { id: "health", icon: Heart, label: "تقرير صحي", desc: "مؤشرات الصحة والأمراض", color: "#34c759" },
  { id: "flock", icon: Bird, label: "تقرير القطيع", desc: "حالة القطيع والنمو", color: COLORS.blue },
];

const periods = ["هذا الأسبوع", "هذا الشهر", "هذا الربع"];

const formats = [
  { id: "html", icon: FileText, label: "HTML", desc: "عرض في المتصفح" },
  { id: "pdf", icon: FilePdf, label: "PDF", desc: "طباعة وحفظ" },
  { id: "xlsx", icon: FileSpreadsheet, label: "Excel", desc: "بيانات قابلة للتحرير" },
];

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState("production");
  const [selectedPeriod, setSelectedPeriod] = useState("هذا الشهر");
  const [selectedFormat, setSelectedFormat] = useState("html");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const recentReports = [
    { name: "تقرير الإنتاج — ماي 2026", date: "2026-05-14", type: "production" },
    { name: "تقرير مالي — أبريل 2026", date: "2026-04-30", type: "financial" },
  ];

  const downloadUrl = (type: string, period: string, format: string) => {
    if (format === "xlsx") return `/api/reports/export-xlsx?type=${type}&period=${encodeURIComponent(period)}`;
    return `/api/reports/export?type=${type}&period=${encodeURIComponent(period)}`;
  };

  const handleDownload = (type: string, period: string, format: string) => {
    window.open(downloadUrl(type, period, format), "_blank");
  };

  const handleGenerateOrDownload = () => {
    if (generated) {
      handleDownload(selectedType, selectedPeriod, selectedFormat);
      return;
    }
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2000);
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold font-heading" style={{ color: "#1a1a24", margin: 0 }}>التقارير</h1>
          <p className="text-xs" style={{ color: "#5A6A5A", margin: "4px 0 0" }}>توليد وتحميل تقارير الضيعة</p>
        </div>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}>
        {reportTypes.map((rt, i) => (
          <motion.button
            key={rt.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => { setSelectedType(rt.id); setGenerated(false); }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{
              background: selectedType === rt.id ? "#fff" : "#f8f8fa",
              borderRadius: "16px", padding: "16px", border: selectedType === rt.id ? `2px solid ${rt.color}` : "2px solid transparent",
              cursor: "pointer", textAlign: "right", boxShadow: selectedType === rt.id ? "0 0 0 1px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06)" : "none",
            }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: `${rt.color}12` }}>
              <rt.icon size={16} style={{ color: rt.color }} />
            </div>
            <p className="text-sm font-semibold" style={{ color: "#1a1a24", margin: 0 }}>{rt.label}</p>
            <p className="text-xs" style={{ color: "#5A6A5A", margin: "4px 0 0" }}>{rt.desc}</p>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)", marginBottom: "20px" }}
      >
        <p className="text-sm font-semibold mb-4" style={{ color: "#1a1a24" }}>توليد تقرير جديد</p>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-medium" style={{ color: "#5a5a64" }}>الفترة:</span>
          <div className="flex gap-1.5">
            {periods.map(p => (
              <button key={p} onClick={() => setSelectedPeriod(p)}
                style={{
                  padding: "6px 14px", borderRadius: "8px", border: "none", fontSize: "0.75rem", fontWeight: "600", cursor: "pointer",
                  background: selectedPeriod === p ? COLORS.aqua : "#f5f5f7",
                  color: selectedPeriod === p ? "#000" : "#5A6A5A",
                  transition: "all 0.2s",
                }}
              >{p}</button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-medium" style={{ color: "#5a5a64" }}>الصيغة:</span>
          <div className="flex gap-1.5">
            {formats.map(f => (
              <button key={f.id} onClick={() => setSelectedFormat(f.id)}
                style={{
                  padding: "6px 14px", borderRadius: "8px", border: "none", fontSize: "0.75rem", fontWeight: "600", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "5px",
                  background: selectedFormat === f.id ? COLORS.aqua : "#f5f5f7",
                  color: selectedFormat === f.id ? "#000" : "#5A6A5A",
                  transition: "all 0.2s",
                }}
              >
                <f.icon size={14} />
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <motion.button onClick={handleGenerateOrDownload} disabled={generating}
          whileHover={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: "10px 24px", borderRadius: "10px", border: "none", fontSize: "0.85rem", fontWeight: "600",
            background: generating ? "#ccc" : `linear-gradient(135deg, ${COLORS.aqua}, ${COLORS.blue})`,
            color: generating ? "#888" : "#000",
            cursor: generating ? "not-allowed" : "pointer",
            transition: "all 0.3s",
            display: "flex", alignItems: "center", gap: "8px",
          }}
        >
          {generating ? (
            <motion.span initial={{ opacity: 0.6 }} animate={{ opacity: 1 }} transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}>
              جاري التوليد...
            </motion.span>
          ) : generated ? (
            <><Download size={16} /> تحميل التقرير</>
          ) : (
            <><FileText size={16} /> توليد التقرير</>
          )}
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)" }}
      >
        <p className="text-sm font-semibold mb-4" style={{ color: "#1a1a24" }}>آخر التقارير</p>
        {recentReports.length === 0 ? (
          <p className="text-sm py-8 text-center" style={{ color: "#a0a0aa" }}>لا توجد تقارير بعد. قم بتوليد أول تقرير لك.</p>
        ) : (
          recentReports.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center justify-between py-3"
              style={{ borderBottom: i < recentReports.length - 1 ? "1px solid #f5f5f7" : "none" }}
            >
              <div className="flex items-center gap-3">
                <FileText size={16} style={{ color: COLORS.aqua }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: "#1a1a24" }}>{r.name}</p>
                  <p className="text-xs" style={{ color: "#a0a0aa" }}>{r.date}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                {formats.map(f => (
                  <button key={f.id} onClick={() => handleDownload(r.type, "هذا الشهر", f.id)}
                    style={{
                      padding: "5px 10px", borderRadius: "8px", border: "1px solid #eeeef0",
                      background: "#fff", cursor: "pointer", fontSize: "0.7rem",
                      color: "#5a5a64", display: "flex", alignItems: "center", gap: "3px",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = COLORS.aqua; e.currentTarget.style.color = "#000"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#eeeef0"; e.currentTarget.style.color = "#5a5a64"; }}
                  >
                    <f.icon size={12} /> {f.label}
                  </button>
                ))}
              </div>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}
