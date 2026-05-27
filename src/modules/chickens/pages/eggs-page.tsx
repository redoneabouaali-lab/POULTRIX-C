"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { COLORS } from "@/constants";
import { PageWrapper } from "@/components/ui/3d-card";
import { api } from "@/lib/api-client";
import { Plus, X, Loader, Egg, TrendingUp, TrendingDown, DollarSign, Calendar, Edit2, Trash2, BarChart3, ChevronDown } from "lucide-react";

const weekDays = ["الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"];

function getWeekDates(): string[] {
  const dates: string[] = [];
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + mondayOffset + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}

const weekDates = getWeekDates();
const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "ماي", "يونيو", "يوليو", "غشت", "شتنبر", "أكتوبر", "نونبر", "ديسمبر"];

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`;
}

function toDirham(n: number) {
  return n.toLocaleString() + " DH";
}

export default function EggsPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [flocks, setFlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ flockId: "", quantity: "", broken: "0", pricePerTray: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"daily" | "weekly" | "monthly">("weekly");

  useEffect(() => {
    Promise.all([
      api.get<any[]>("/api/egg-records"),
      api.get<any[]>("/api/flock"),
    ]).then(([recRes, flockRes]) => {
      if (recRes.data) setRecords(recRes.data);
      if (flockRes.data) setFlocks(flockRes.data);
      setLoading(false);
    });
  }, []);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayRecords = records.filter(r => r.recordDate === today);
    const todayTotal = todayRecords.reduce((s, r) => s + r.quantity, 0);
    const weekTotal = records.filter(r => weekDates.includes(r.recordDate)).reduce((s, r) => s + r.quantity, 0);
    const totalRevenue = records.filter(r => r.sold).reduce((s, r) => s + (r.totalRevenue || 0), 0);
    const brokenTotal = records.reduce((s, r) => s + (r.broken || 0), 0);
    const brokenPct = weekTotal > 0 ? ((brokenTotal / weekTotal) * 100).toFixed(1) : "0";
    return { todayTotal, weekTotal, totalRevenue, brokenTotal, brokenPct };
  }, [records]);

  const weeklyData = useMemo(() => {
    return weekDates.map(date => {
      const dayRecs = records.filter(r => r.recordDate === date);
      return { date, total: dayRecs.reduce((s, r) => s + r.quantity, 0) };
    });
  }, [records]);

  const maxWeekly = Math.max(...weeklyData.map(d => d.total), 1);

  const handleSubmit = async () => {
    if (!form.flockId || !form.quantity) return;
    setSaving(true);
    const payload = {
      flockId: form.flockId,
      quantity: Number(form.quantity),
      broken: Number(form.broken) || 0,
      pricePerTray: Number(form.pricePerTray) || 0,
      eggsPerTray: 30,
      notes: form.notes,
      recordDate: new Date().toISOString().split("T")[0],
      sold: true,
      trays: Math.round(Number(form.quantity) / 30 * 10) / 10,
      totalRevenue: Math.round(Number(form.quantity) / 30 * (Number(form.pricePerTray) || 0) * 100) / 100,
    };
    if (editing) {
      setRecords(p => p.map(r => r.id === editing.id ? { ...r, ...payload } : r));
    } else {
      const res = await api.post("/api/egg-records", payload);
      setRecords(p => [{ ...payload, id: res.data?.id || `egg-${Date.now()}` }, ...p]);
    }
    setShowModal(false); setEditing(null); setForm({ flockId: "", quantity: "", broken: "0", pricePerTray: "", notes: "" }); setSaving(false);
  };

  const handleEdit = (rec: any) => {
    setEditing(rec);
    setForm({ flockId: rec.flockId, quantity: String(rec.quantity), broken: String(rec.broken || "0"), pricePerTray: String(rec.pricePerTray || ""), notes: rec.notes || "" });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    setRecords(p => p.filter(r => r.id !== id));
  };

  const getFlockName = (id: string) => flocks.find(f => f.id === id)?.name || id;

  if (loading) return (
    <PageWrapper>
      <div style={{ padding: "60px", textAlign: "center" }}>
        {[1, 2, 3, 4, 5].map(i => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}
            className="shimmer-bg" style={{ height: 80, borderRadius: 16, marginBottom: 12 }} />
        ))}
      </div>
    </PageWrapper>
  );

  return (
    <PageWrapper>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold font-heading" style={{ color: "#1a1a24", margin: 0 }}>إدارة البيض</h1>
          <p className="text-xs" style={{ color: "#8a8a96", margin: "4px 0 0" }}>
            إنتاج اليوم: <span className="font-semibold" style={{ color: "#1a1a24" }}>{stats.todayTotal.toLocaleString()}</span> بيضة &bull; الأسبوع: <span className="font-semibold" style={{ color: "#1a1a24" }}>{stats.weekTotal.toLocaleString()}</span>
          </p>
        </div>
        <motion.button onClick={() => { setEditing(null); setForm({ flockId: "", quantity: "", broken: "0", pricePerTray: "", notes: "" }); setShowModal(true); }}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          style={{
            display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px",
            borderRadius: "12px", border: "none", background: `linear-gradient(135deg, ${COLORS.aqua}, ${COLORS.blue})`,
            color: "#000", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer",
            boxShadow: "0 2px 8px rgba(196,137,58,0.3)",
          }}
        >
          <Plus size={16} /> تسجيل الإنتاج
        </motion.button>
      </motion.div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}>
        {[
          { icon: Egg, label: "إنتاج اليوم", value: stats.todayTotal.toLocaleString(), sub: "بيضة", color: COLORS.aqua, change: "+4.2%" },
          { icon: Calendar, label: "إنتاج الأسبوع", value: stats.weekTotal.toLocaleString(), sub: "بيضة", color: "#007aff", change: "+2.1%" },
          { icon: TrendingDown, label: "البيض المكسور", value: `${stats.brokenPct}%`, sub: "من الإنتاج", color: "#ff9f0a", change: `-${stats.brokenPct}%` },
          { icon: DollarSign, label: "إجمالي الأرباح", value: toDirham(stats.totalRevenue), sub: "من البيض المباع", color: "#34c759", change: "+8.3%" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }} whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
            style={{ background: "#fff", borderRadius: "16px", padding: "18px", boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)" }}>
            <div className="flex items-center justify-between mb-2">
              <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: `${s.color}12`, border: `1px solid ${s.color}18` }}>
                <s.icon size={16} style={{ color: s.color }} />
              </div>
              <span className="text-xs font-semibold" style={{ color: "#34c759" }}>{s.change}</span>
            </div>
            <p className="text-xs" style={{ color: "#8a8a96", marginBottom: 4 }}>{s.label}</p>
            <p className="text-xl font-black tabular-nums font-metric" style={{ color: "#1a1a24", lineHeight: 1.2 }}>{s.value}</p>
            <p className="text-xs" style={{ color: "#b0b0b8", marginTop: 2 }}>{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        style={{ background: "#fff", borderRadius: "16px", padding: "24px", marginBottom: "20px", boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)" }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-sm font-semibold" style={{ color: "#1a1a24" }}>تحليل الإنتاج الأسبوعي</span>
            <p className="text-xs" style={{ color: "#8a8a96", marginTop: 2 }}>{formatDate(weekDates[0])} — {formatDate(weekDates[6])}</p>
          </div>
          <div className="flex items-center gap-1" style={{ background: "#f5f5f7", borderRadius: 10, padding: 3 }}>
            {(["weekly", "daily", "monthly"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{
                  padding: "6px 14px", borderRadius: 8, border: "none", fontSize: "0.75rem", fontWeight: 500, cursor: "pointer",
                  background: tab === t ? "#fff" : "transparent", color: tab === t ? "#1a1a24" : "#8a8a96",
                  boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.08)" : "none", transition: "all 0.15s",
                }}>
                {t === "weekly" ? "أسبوعي" : t === "daily" ? "يومي" : "شهري"}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "6px", height: "220px", padding: "0 4px" }}>
          {weeklyData.map((d, i) => {
            const hgt = maxWeekly > 0 ? (d.total / maxWeekly) * 100 : 0;
            const dayName = weekDays[i];
            return (
              <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%", justifyContent: "flex-end" }}>
                <motion.span initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.06 }}
                  className="text-xs font-semibold tabular-nums font-metric" style={{ color: COLORS.aqua }}>
                  {d.total.toLocaleString()}
                </motion.span>
                <motion.div initial={{ height: 0 }} animate={{ height: `${Math.max(hgt, 4)}%` }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  style={{ width: "100%", borderRadius: "6px 6px 0 0", background: `linear-gradient(180deg, ${COLORS.gold}, ${COLORS.gold}33)`, position: "relative" }}>
                  <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.06, type: "spring" as const, stiffness: 300, damping: 15 }}
                    style={{ position: "absolute", top: -3, left: "50%", transform: "translateX(-50%)", width: 8, height: 8, borderRadius: "50%", background: COLORS.gold, boxShadow: `0 0 10px ${COLORS.gold}, 0 0 20px ${COLORS.gold}40` }} />
                </motion.div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-[10px] font-medium" style={{ color: "#1a1a24" }}>{dayName}</span>
                  <span className="text-[9px]" style={{ color: "#b0b0b8" }}>{new Date(d.date).getDate()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Records Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #f0f0f2" }}>
          <span className="text-sm font-semibold" style={{ color: "#1a1a24" }}>سجل الإنتاج ({records.length})</span>
          <span className="text-xs" style={{ color: "#8a8a96" }}>آخر 7 أيام</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 650 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f0f0f2", background: "#fafafa" }}>
                {["التاريخ", "الدفعة", "الكمية", "الصواني", "المكسور", "سعر الصينية", "الإيراد", ""].map(h => (
                  <th key={h} style={{ textAlign: "right", padding: "10px 16px", fontSize: "0.7rem", fontWeight: "600", color: "#8a8a96", textTransform: "uppercase", letterSpacing: "0.3px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {records.slice(0, 20).map((r, i) => (
                  <motion.tr key={r.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: i * 0.02 }}
                    style={{ borderBottom: "1px solid #f5f5f7" }} whileHover={{ background: "#f8f9fb" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <span className="text-xs font-medium" style={{ color: "#5a5a64" }}>{formatDate(r.recordDate)}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span className="text-sm font-semibold" style={{ color: "#1a1a24" }}>{getFlockName(r.flockId)}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span className="text-sm font-semibold tabular-nums font-metric" style={{ color: "#007aff" }}>{r.quantity.toLocaleString()}</span>
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "#5a5a64" }}>{r.trays?.toFixed(1) || "—"}</td>
                    <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: r.broken ? "#ff9f0a" : "#b0b0b8" }}>{r.broken || "0"}</td>
                    <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "#5a5a64" }}>{r.pricePerTray ? toDirham(r.pricePerTray) : "—"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span className="text-sm font-semibold tabular-nums font-metric" style={{ color: "#34c759" }}>{r.totalRevenue ? toDirham(r.totalRevenue) : "—"}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleEdit(r)} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: "#8a8a96", borderRadius: 6 }}><Edit2 size={14} /></button>
                        <button onClick={() => handleDelete(r.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: "#ff4444", borderRadius: 6 }}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {records.length === 0 && (
                <tr><td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "#b0b0b8", fontSize: "0.85rem" }}>لا توجد سجلات إنتاج بعد. اضف أول تسجيل!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", padding: "16px" }}
            onClick={() => setShowModal(false)}
          >
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={e => e.stopPropagation()}
              style={{ background: "#fff", borderRadius: "20px", width: "100%", maxWidth: "440px", padding: "28px", boxShadow: "0 24px 48px rgba(0,0,0,0.15)" }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold" style={{ color: "#1a1a24", margin: 0 }}>{editing ? "تعديل التسجيل" : "تسجيل إنتاج البيض"}</h2>
                  <p className="text-xs" style={{ color: "#8a8a96", marginTop: 4 }}>{editing ? "تحديث بيانات الإنتاج" : "أدخل كمية البيض المنتجة اليوم"}</p>
                </div>
                <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8a8a96", padding: 4 }}><X size={20} /></button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>الدفعة *</label>
                  <select value={form.flockId} onChange={e => setForm(p => ({ ...p, flockId: e.target.value }))}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}>
                    <option value="">اختر الدفعة</option>
                    {flocks.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>عدد البيض *</label>
                    <input type="number" value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))} placeholder="0"
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>البيض المكسور</label>
                    <input type="number" value={form.broken} onChange={e => setForm(p => ({ ...p, broken: e.target.value }))} placeholder="0"
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>سعر الصينية (DH)</label>
                  <input type="number" value={form.pricePerTray} onChange={e => setForm(p => ({ ...p, pricePerTray: e.target.value }))} placeholder="0"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>ملاحظات</label>
                  <input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="اختياري"
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)}
                  style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid #e8e8ec", background: "#fff", color: "#5a5a64", fontSize: "0.85rem", fontWeight: 500, cursor: "pointer" }}>
                  إلغاء
                </button>
                <button onClick={handleSubmit} disabled={saving || !form.flockId || !form.quantity}
                  style={{ flex: 1, padding: "10px", borderRadius: "10px", border: "none", background: `linear-gradient(135deg, ${COLORS.aqua}, ${COLORS.blue})`, color: "#000", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", opacity: (saving || !form.flockId || !form.quantity) ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  {saving ? <Loader size={16} /> : <Plus size={16} />}
                  {saving ? "جاري الحفظ..." : editing ? "تحديث" : "تسجيل"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
