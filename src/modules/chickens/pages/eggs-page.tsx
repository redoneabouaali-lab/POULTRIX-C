"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { COLORS } from "@/constants";
import { PageWrapper } from "@/components/ui/3d-card";
import { api } from "@/lib/api-client";
import { Plus, X, Loader, TrendingDown, DollarSign, Calendar, Edit2, Trash2 } from "lucide-react";

const weekDays = ["الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"];
function getWeekDates() { const t = new Date(); const o = t.getDay() === 0 ? -6 : 1 - t.getDay(); return Array.from({ length: 7 }, (_, i) => { const d = new Date(t); d.setDate(t.getDate() + o + i); return d.toISOString().split("T")[0]; }); }
const weekDates = getWeekDates();
const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "ماي", "يونيو", "يوليو", "غشت", "شتنبر", "أكتوبر", "نونبر", "ديسمبر"];
const fmtDate = (s: string) => { const d = new Date(s); return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`; };
const toDH = (n: number) => n.toLocaleString() + " DH";

function EggIcon({ size = 180 }: { size?: number }) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 120 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="eggGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#C4893A" stopOpacity="0.12" />
          <stop offset="50%" stopColor="#C4893A" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#C4893A" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="eggShine" x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M60 5C35 5 10 45 10 85C10 115 32 145 60 145C88 145 110 115 110 85C110 45 85 5 60 5Z" fill="url(#eggGrad)" stroke="#C4893A" strokeWidth="0.5" strokeOpacity="0.2" />
      <path d="M60 5C35 5 10 45 10 85C10 115 32 145 60 145C88 145 110 115 110 85C110 45 85 5 60 5Z" fill="url(#eggShine)" />
      <path d="M45 40C38 55 35 70 35 85" stroke="#C4893A" strokeWidth="0.5" strokeOpacity="0.15" strokeLinecap="round" />
      <path d="M75 40C82 55 85 70 85 85" stroke="#C4893A" strokeWidth="0.5" strokeOpacity="0.15" strokeLinecap="round" />
      <ellipse cx="60" cy="95" rx="18" ry="6" fill="#C4893A" fillOpacity="0.06" />
    </svg>
  );
}

function Sparkle({ style }: { style?: any }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
      style={{ position: "absolute", width: 4, height: 4, borderRadius: "50%", background: COLORS.gold, boxShadow: `0 0 8px ${COLORS.gold}, 0 0 16px ${COLORS.gold}40`, ...style }} />
  );
}

export default function EggsPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [flocks, setFlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ flockId: "", quantity: "", broken: "0", pricePerTray: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([api.get<any[]>("/api/egg-records"), api.get<any[]>("/api/flock")]).then(([a, b]) => {
      if (a.data) setRecords(a.data);
      if (b.data) setFlocks(b.data);
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayRecs = records.filter(r => r.recordDate === today);
    const todayTotal = todayRecs.reduce((s, r) => s + r.quantity, 0);
    const weekRecs = records.filter(r => weekDates.includes(r.recordDate));
    const weekTotal = weekRecs.reduce((s, r) => s + r.quantity, 0);
    const totalRev = records.filter(r => r.sold).reduce((s, r) => s + (r.totalRevenue || 0), 0);
    const brokenTotal = weekRecs.reduce((s, r) => s + (r.broken || 0), 0);
    const brokenPct = weekTotal > 0 ? ((brokenTotal / weekTotal) * 100).toFixed(1) : "0";
    return { todayTotal, weekTotal, totalRev, brokenTotal, brokenPct };
  }, [records]);

  const weeklyData = useMemo(() => weekDates.map(d => ({ date: d, total: records.filter(r => r.recordDate === d).reduce((s, r) => s + r.quantity, 0) })), [records]);
  const maxW = Math.max(...weeklyData.map(d => d.total), 1);

  const handleSubmit = async () => {
    if (!form.flockId || !form.quantity) return;
    setSaving(true);
    const q = Number(form.quantity);
    const payload = { flockId: form.flockId, quantity: q, broken: Number(form.broken) || 0, pricePerTray: Number(form.pricePerTray) || 0, eggsPerTray: 30, notes: form.notes, recordDate: new Date().toISOString().split("T")[0], sold: true, trays: Math.round(q / 30 * 10) / 10, totalRevenue: Math.round(q / 30 * (Number(form.pricePerTray) || 0) * 100) / 100 };
    if (editing) { setRecords(p => p.map(r => r.id === editing.id ? { ...r, ...payload } : r)); }
    else { const res = await api.post("/api/egg-records", payload); setRecords(p => [{ ...payload, id: (res.data as any)?.id || `egg-${Date.now()}` }, ...p]); }
    setShowModal(false); setEditing(null); setForm({ flockId: "", quantity: "", broken: "0", pricePerTray: "", notes: "" }); setSaving(false);
  };

  const getFlockName = (id: string) => flocks.find(f => f.id === id)?.name || id;

  if (loading) return <PageWrapper><div style={{ padding: "60px", textAlign: "center" }}>{[1, 2, 3, 4, 5].map(i => <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }} className="shimmer-bg" style={{ height: 80, borderRadius: 16, marginBottom: 12 }} />)}</div></PageWrapper>;

  return (
    <PageWrapper>
      {/* Hero Section with floating egg */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
        style={{ position: "relative", overflow: "hidden", borderRadius: "20px", marginBottom: "24px", background: "linear-gradient(135deg, #1a1a24 0%, #2a2a34 100%)" }}>
        <div style={{ position: "absolute", top: "-40%", left: "60%", transform: "translateX(-50%)", opacity: 0.6, pointerEvents: "none" }}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 0.6 }} transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}>
            <EggIcon size={220} />
          </motion.div>
        </div>
        <Sparkle style={{ top: "20%", left: "65%" }} />
        <Sparkle style={{ top: "35%", left: "75%" }} />
        <Sparkle style={{ top: "50%", left: "70%" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "28px 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <div style={{ padding: "6px 12px", borderRadius: "20px", background: "rgba(255,255,255,0.08)" }}>
              <span className="text-[10px] font-semibold tracking-widest" style={{ color: COLORS.gold }}>إدارة البيض</span>
            </div>
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5, duration: 0.6 }}
              style={{ height: 2, flex: 1, background: `linear-gradient(90deg, ${COLORS.gold}44, transparent)`, transformOrigin: "right" }} />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-2xl font-black" style={{ color: "#fff", margin: 0, letterSpacing: "-0.3px" }}>
                {stats.todayTotal.toLocaleString()}
                <span className="text-lg font-semibold" style={{ color: COLORS.gold, marginRight: 8 }}>بيضة اليوم</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", marginTop: 6 }}>
                إنتاج الأسبوع: <span style={{ color: "#fff", fontWeight: 600 }}>{stats.weekTotal.toLocaleString()}</span> بيضة &bull; {stats.brokenPct}% مكسور
              </motion.p>
            </div>
            <motion.button onClick={() => { setEditing(null); setForm({ flockId: "", quantity: "", broken: "0", pricePerTray: "", notes: "" }); setShowModal(true); }}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 22px", borderRadius: "12px", border: "none", background: `linear-gradient(135deg, ${COLORS.gold}, #a06e2e)`, color: "#fff", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 16px rgba(196,137,58,0.35)", whiteSpace: "nowrap" }}>
              <Plus size={17} /> تسجيل الإنتاج
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}>
        {[
          { label: "إجمالي الإنتاج", value: stats.weekTotal.toLocaleString(), sub: "بيضة هذا الأسبوع", color: COLORS.gold, bg: `${COLORS.gold}08`, border: `${COLORS.gold}15` },
          { label: "المتوسط اليومي", value: Math.round(stats.weekTotal / 7).toLocaleString(), sub: "بيضة/يوم", color: "#007aff", bg: "#007aff08", border: "#007aff15" },
          { label: "البيض المكسور", value: `${stats.brokenPct}%`, sub: "من الإنتاج", color: "#ff9f0a", bg: "#ff9f0a08", border: "#ff9f0a15" },
          { label: "صافي الأرباح", value: toDH(stats.totalRev), sub: "من البيض المباع", color: "#34c759", bg: "#34c75908", border: "#34c75915" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
            whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.08)" }}
            style={{ background: "#fff", borderRadius: "16px", padding: "18px", border: `1px solid ${s.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.03)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${s.color}, transparent)` }} />
            <p className="text-xs" style={{ color: "#8a8a96", marginBottom: 6, fontWeight: 500 }}>{s.label}</p>
            <p className="text-xl font-black tabular-nums font-metric" style={{ color: s.color, lineHeight: 1.1 }}>{s.value}</p>
            <p className="text-[11px]" style={{ color: "#b0b0b8", marginTop: 4 }}>{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div ref={chartRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        style={{ background: "#fff", borderRadius: "16px", padding: "24px", marginBottom: "20px", border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 1px 3px rgba(0,0,0,0.03)", position: "relative", overflow: "hidden" }}>
        {/* subtle egg watermark */}
        <div style={{ position: "absolute", bottom: -30, right: -20, opacity: 0.03, pointerEvents: "none" }}>
          <EggIcon size={160} />
        </div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-sm font-semibold" style={{ color: "#1a1a24" }}>اتجاهات الإنتاج</span>
            <p className="text-xs" style={{ color: "#8a8a96", marginTop: 2 }}>{fmtDate(weekDates[0])} — {fmtDate(weekDates[6])}</p>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="flex items-center gap-1.5" style={{ background: "#f5f5f7", borderRadius: 10, padding: 4 }}>
            <span className="text-xs font-medium" style={{ color: "#8a8a96", padding: "4px 6px" }}>الأسبوع الماضي: 8,420</span>
            <span className="text-xs font-semibold" style={{ color: "#34c759" }}>+3.2%</span>
          </motion.div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "8px", height: "200px", padding: "0 4px" }}>
          {weeklyData.map((d, i) => {
            const h = maxW > 0 ? (d.total / maxW) * 100 : 0;
            return (
              <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", height: "100%", justifyContent: "flex-end", position: "relative" }}>
                <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
                  className="text-[10px] font-bold tabular-nums font-metric" style={{ color: COLORS.aqua, letterSpacing: "-0.3px" }}>{d.total.toLocaleString()}</motion.span>
                <motion.div initial={{ height: 0 }} animate={{ height: `${Math.max(h, 3)}%` }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  style={{ width: "100%", borderRadius: "4px 4px 0 0", background: `linear-gradient(180deg, ${COLORS.gold}, ${COLORS.gold}22)`, position: "relative", minHeight: 3 }}>
                  <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35 + i * 0.05, type: "spring" as const, stiffness: 400, damping: 12 }}
                    style={{ position: "absolute", top: -3, left: "50%", transform: "translateX(-50%)", width: 6, height: 6, borderRadius: "50%", background: COLORS.gold, boxShadow: `0 0 12px ${COLORS.gold}, 0 0 24px ${COLORS.gold}30` }} />
                </motion.div>
                <span className="text-[9px] font-medium" style={{ color: "#1a1a24" }}>{weekDays[i].slice(0, 3)}</span>
                <span className="text-[8px]" style={{ color: "#b0b0b8" }}>{new Date(d.date).getDate()}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #f0f0f2" }}>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold" style={{ color: "#1a1a24" }}>سجل الإنتاج</span>
            <span style={{ padding: "2px 10px", borderRadius: "10px", background: `${COLORS.gold}10`, color: COLORS.gold, fontSize: "0.7rem", fontWeight: 600 }}>{records.length} تسجيل</span>
          </div>
          <span className="text-xs" style={{ color: "#8a8a96" }}>آخر 7 أيام</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 650 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f0f0f2" }}>
                {["التاريخ", "الدفعة", "الكمية", "الصواني", "المكسور", "السعر", "الإيراد", ""].map(h => (
                  <th key={h} style={{ textAlign: "right", padding: "10px 16px", fontSize: "0.7rem", fontWeight: "600", color: "#b0b0b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {records.slice(0, 20).map((r, i) => (
                  <motion.tr key={r.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: i * 0.015 }} style={{ borderBottom: "1px solid #f5f5f7" }} whileHover={{ background: "#f8f9fb" }}>
                    <td style={{ padding: "11px 16px" }}><span className="text-xs" style={{ color: "#5a5a64" }}>{fmtDate(r.recordDate)}</span></td>
                    <td style={{ padding: "11px 16px" }}><span className="text-sm font-semibold" style={{ color: "#1a1a24" }}>{getFlockName(r.flockId)}</span></td>
                    <td style={{ padding: "11px 16px" }}><span className="text-sm font-bold tabular-nums font-metric" style={{ color: "#007aff" }}>{r.quantity.toLocaleString()}</span></td>
                    <td style={{ padding: "11px 16px", fontSize: "0.85rem", color: "#5a5a64" }}>{r.trays?.toFixed(1) || "—"}</td>
                    <td style={{ padding: "11px 16px", fontSize: "0.85rem", color: r.broken ? "#ff9f0a" : "#d0d0d8" }}>{r.broken || "0"}</td>
                    <td style={{ padding: "11px 16px", fontSize: "0.85rem", color: "#5a5a64" }}>{r.pricePerTray ? toDH(r.pricePerTray) : "—"}</td>
                    <td style={{ padding: "11px 16px" }}><span className="text-sm font-semibold tabular-nums font-metric" style={{ color: "#34c759" }}>{r.totalRevenue ? toDH(r.totalRevenue) : "—"}</span></td>
                    <td style={{ padding: "11px 16px" }}>
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setEditing(r); setForm({ flockId: r.flockId, quantity: String(r.quantity), broken: String(r.broken || "0"), pricePerTray: String(r.pricePerTray || ""), notes: r.notes || "" }); setShowModal(true); }}
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: "#b0b0b8", borderRadius: 6, transition: "color 0.15s" }}><Edit2 size={13} /></button>
                        <button onClick={() => setRecords(p => p.filter(x => x.id !== r.id))}
                          style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: "#e0e0e0", borderRadius: 6, transition: "color 0.15s" }}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {records.length === 0 && <tr><td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "#b0b0b8", fontSize: "0.85rem" }}>لا توجد سجلات بعد. سجل أول إنتاج!</td></tr>}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)", padding: "16px" }}
            onClick={() => setShowModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={e => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: "24px", width: "100%", maxWidth: "440px", padding: "0", boxShadow: "0 32px 64px rgba(0,0,0,0.2)", overflow: "hidden" }}>
              <div style={{ padding: "28px 28px 0", background: `linear-gradient(135deg, ${COLORS.gold}06, transparent)` }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: "#1a1a24", margin: 0 }}>{editing ? "تعديل التسجيل" : "تسجيل جديد"}</h2>
                    <p className="text-xs" style={{ color: "#8a8a96", marginTop: 4 }}>{editing ? "تحديث بيانات الإنتاج" : "أدخل كمية البيض المنتجة اليوم"}</p>
                  </div>
                  <button onClick={() => setShowModal(false)} style={{ width: 36, height: 36, borderRadius: "50%", background: "#f5f5f7", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#8a8a96" }}>
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div style={{ padding: "20px 28px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>الدفعة *</label>
                    <select value={form.flockId} onChange={e => setForm(p => ({ ...p, flockId: e.target.value }))}
                      style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1.5px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}>
                      <option value="">اختر الدفعة</option>
                      {flocks.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>عدد البيض *</label>
                      <input type="number" value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))} placeholder="0"
                        style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1.5px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>المكسور</label>
                      <input type="number" value={form.broken} onChange={e => setForm(p => ({ ...p, broken: e.target.value }))} placeholder="0"
                        style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1.5px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>سعر الصينية (DH)</label>
                    <input type="number" value={form.pricePerTray} onChange={e => setForm(p => ({ ...p, pricePerTray: e.target.value }))} placeholder="0"
                      style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1.5px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>ملاحظات</label>
                    <input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="اختياري"
                      style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1.5px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowModal(false)}
                    style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1.5px solid #e8e8ec", background: "#fff", color: "#5a5a64", fontSize: "0.85rem", fontWeight: 500, cursor: "pointer" }}>إلغاء</button>
                  <button onClick={handleSubmit} disabled={saving || !form.flockId || !form.quantity}
                    style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "none", background: `linear-gradient(135deg, ${COLORS.gold}, #a06e2e)`, color: "#fff", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", opacity: (saving || !form.flockId || !form.quantity) ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: `0 4px 12px ${COLORS.gold}30` }}>
                    {saving ? <Loader size={16} /> : <Plus size={16} />}
                    {saving ? "..." : editing ? "تحديث" : "تسجيل"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
