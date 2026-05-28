"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COLORS } from "@/constants";
import { api } from "@/lib/api-client";
import { Plus, X, Loader, ArrowUpDown, Search, Bird, TrendingDown, TrendingUp, Users } from "lucide-react";

const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "ماي", "يونيو", "يوليو", "غشت", "شتنبر", "أكتوبر", "نونبر", "ديسمبر"];
const fmtDate = (s: string) => { if (!s) return "—"; const d = new Date(s); return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`; };

export default function StockingPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [flocks, setFlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [flockFilter, setFlockFilter] = useState<string>("all");
  const [form, setForm] = useState({ flockId: "", birdsAdded: "0", birdsRemoved: "0", mortality: "0", notes: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([api.get<any[]>("/api/stocking"), api.get<any[]>("/api/flock")]).then(([a, b]) => {
      if (a.data) setRecords(a.data);
      if (b.data) setFlocks(b.data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let f = records;
    if (flockFilter !== "all") f = f.filter(r => r.flockId === flockFilter);
    return f.sort((a, b) => new Date(b.recordDate).valueOf() - new Date(a.recordDate).valueOf());
  }, [records, flockFilter]);

  const getFlockName = (id: string) => flocks.find(f => f.id === id)?.name || id;

  const stats = useMemo(() => {
    const totalAdded = records.reduce((s, r) => s + (r.birdsAdded || 0), 0);
    const totalRemoved = records.reduce((s, r) => s + (r.birdsRemoved || 0), 0);
    const totalMortality = records.reduce((s, r) => s + (r.mortality || 0), 0);
    const latest = records.reduce((latest, r) => new Date(r.recordDate) > new Date(latest.recordDate) ? r : latest, records[0]);
    const currentTotal = latest?.currentBirdCount || 0;
    return { totalAdded, totalRemoved, totalMortality, currentTotal };
  }, [records]);

  const handleSubmit = async () => {
    if (!form.flockId) return;
    setSaving(true);
    const added = Number(form.birdsAdded) || 0;
    const removed = Number(form.birdsRemoved) || 0;
    const mortality = Number(form.mortality) || 0;
    const last = records.filter(r => r.flockId === form.flockId).sort((a, b) => new Date(b.recordDate).valueOf() - new Date(a.recordDate).valueOf())[0];
    const prevCount = last?.currentBirdCount || 0;
    const currentBirdCount = prevCount + added - removed - mortality;
    const payload = { flockId: form.flockId, birdsAdded: added, birdsRemoved: removed, mortality, currentBirdCount, notes: form.notes, recordDate: new Date().toISOString().split("T")[0] };
    const res = await api.post("/api/stocking", payload);
    setRecords((p: any[]) => [{ ...payload, id: (res.data as any)?.id || `stk-${Date.now()}`, createdAt: new Date().toISOString() }, ...p]);
    setShowModal(false); setForm({ flockId: "", birdsAdded: "0", birdsRemoved: "0", mortality: "0", notes: "" });
    setSaving(false);
  };

  if (loading) return <div style={{ padding: "60px", textAlign: "center" }}>{[1, 2, 3, 4, 5].map(i => <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }} className="shimmer-bg" style={{ height: 80, borderRadius: 16, marginBottom: 12 }} />)}</div>;

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
        style={{ position: "relative", overflow: "hidden", borderRadius: "20px", marginBottom: "24px", background: "linear-gradient(135deg, #1a1a24 0%, #1a1e24 100%)" }}>
        <div style={{ position: "absolute", top: "-30%", left: "62%", transform: "translateX(-50%)", opacity: 0.35, pointerEvents: "none" }}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 0.35 }} transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}>
            <ArrowUpDown size={200} style={{ color: "#007aff" }} />
          </motion.div>
        </div>
        <div style={{ position: "relative", zIndex: 1, padding: "28px 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <div style={{ padding: "6px 12px", borderRadius: "20px", background: "rgba(0,122,255,0.1)" }}>
              <span className="text-[10px] font-semibold tracking-widest" style={{ color: "#007aff" }}>تتبع القطيع</span>
            </div>
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5, duration: 0.6 }}
              style={{ height: 2, flex: 1, background: "linear-gradient(90deg, rgba(0,122,255,0.27), transparent)", transformOrigin: "right" }} />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-2xl font-black" style={{ color: "#fff", margin: 0, letterSpacing: "-0.3px" }}>
                {stats.currentTotal.toLocaleString()}
                <span className="text-lg font-semibold" style={{ color: "#007aff", marginRight: 8 }}>طير حالي</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", marginTop: 6 }}>
                +{stats.totalAdded.toLocaleString()} مضاف &bull; -{stats.totalRemoved.toLocaleString()} مباع &bull; {stats.totalMortality.toLocaleString()} نفوق
              </motion.p>
            </div>
            <motion.button onClick={() => setShowModal(true)}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 22px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #007aff, #0056cc)", color: "#fff", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 16px rgba(0,122,255,0.35)", whiteSpace: "nowrap" }}>
              <Plus size={17} /> تسجيل جرد
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}>
        {[
          { label: "العدد الحالي", value: stats.currentTotal.toLocaleString(), sub: "طير في الضيعة", icon: Users, color: "#007aff", bg: "#007aff08", border: "#007aff15" },
          { label: "إجمالي المضاف", value: `+${stats.totalAdded.toLocaleString()}`, sub: "طير مضاف", icon: TrendingUp, color: "#34c759", bg: "#34c75908", border: "#34c75915" },
          { label: "إجمالي المباع", value: `-${stats.totalRemoved.toLocaleString()}`, sub: "طير تم بيعه", icon: TrendingDown, color: "#ff9f0a", bg: "#ff9f0a08", border: "#ff9f0a15" },
          { label: "النفوق", value: stats.totalMortality.toLocaleString(), sub: "طير نافق", icon: Bird, color: "#ff3b30", bg: "#ff3b3008", border: "#ff3b3015" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
            whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(0,0,0,0.08)" }}
            style={{ background: "#fff", borderRadius: "16px", padding: "18px", border: `1px solid ${s.border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.03)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${s.color}, transparent)` }} />
            <div className="flex items-center gap-2 mb-2">
              <s.icon size={13} style={{ color: s.color }} />
              <p className="text-xs" style={{ color: "#8a8a96", fontWeight: 500 }}>{s.label}</p>
            </div>
            <p className="text-xl font-black tabular-nums font-metric" style={{ color: s.color, lineHeight: 1.1 }}>{s.value}</p>
            <p className="text-[11px]" style={{ color: "#b0b0b8", marginTop: 4 }}>{s.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Flock filter */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ background: "#fff", borderRadius: "16px", padding: "12px 16px", marginBottom: "16px", border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 1px 3px rgba(0,0,0,0.03)", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        <span className="text-xs font-medium" style={{ color: "#8a8a96" }}>الدفعة:</span>
        <button onClick={() => setFlockFilter("all")}
          style={{ padding: "6px 14px", borderRadius: "10px", border: "none", background: flockFilter === "all" ? "#1a1a24" : "#f5f5f7", color: flockFilter === "all" ? "#fff" : "#5a5a64", fontSize: "0.75rem", fontWeight: 500, cursor: "pointer" }}>الكل</button>
        {flocks.map(f => (
          <button key={f.id} onClick={() => setFlockFilter(f.id)}
            style={{ padding: "6px 14px", borderRadius: "10px", border: "none", background: flockFilter === f.id ? "#007aff" : "#f5f5f7", color: flockFilter === f.id ? "#fff" : "#5a5a64", fontSize: "0.75rem", fontWeight: 500, cursor: "pointer" }}>{f.name}</button>
        ))}
      </motion.div>

      {/* Timeline view */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #f0f0f2" }}>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold" style={{ color: "#1a1a24" }}>سجل الجرد</span>
            <span style={{ padding: "2px 10px", borderRadius: "10px", background: "#007aff10", color: "#007aff", fontSize: "0.7rem", fontWeight: 600 }}>{filtered.length} تسجيل</span>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 750 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f0f0f2" }}>
                {["التاريخ", "الدفعة", "مضاف", "مباع", "نفوق", "التغير", "العدد الحالي", "ملاحظات"].map(h => (
                  <th key={h} style={{ textAlign: "right", padding: "10px 16px", fontSize: "0.7rem", fontWeight: "600", color: "#b0b0b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((r, i) => {
                  const net = (r.birdsAdded || 0) - (r.birdsRemoved || 0) - (r.mortality || 0);
                  return (
                    <motion.tr key={r.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }}
                      transition={{ delay: i * 0.015 }} style={{ borderBottom: "1px solid #f5f5f7" }} whileHover={{ background: "#f8f9fb" }}>
                      <td style={{ padding: "11px 16px", whiteSpace: "nowrap" }}><span className="text-xs" style={{ color: "#5a5a64" }}>{fmtDate(r.recordDate)}</span></td>
                      <td style={{ padding: "11px 16px" }}><span className="text-sm font-semibold" style={{ color: "#1a1a24" }}>{getFlockName(r.flockId)}</span></td>
                      <td style={{ padding: "11px 16px" }}>
                        {r.birdsAdded > 0 ? <span className="text-sm font-semibold" style={{ color: "#34c759" }}>+{r.birdsAdded.toLocaleString()}</span> : <span style={{ color: "#d0d0d8" }}>—</span>}
                      </td>
                      <td style={{ padding: "11px 16px" }}>
                        {r.birdsRemoved > 0 ? <span className="text-sm font-semibold" style={{ color: "#ff9f0a" }}>-{r.birdsRemoved.toLocaleString()}</span> : <span style={{ color: "#d0d0d8" }}>—</span>}
                      </td>
                      <td style={{ padding: "11px 16px" }}>
                        {r.mortality > 0 ? <span style={{ color: "#ff3b30", fontSize: "0.85rem", fontWeight: 600 }}>{r.mortality.toLocaleString()}</span> : <span style={{ color: "#d0d0d8" }}>—</span>}
                      </td>
                      <td style={{ padding: "11px 16px" }}>
                        {net !== 0 ? (
                          <span style={{ padding: "2px 8px", borderRadius: "6px", background: net > 0 ? "#34c75912" : "#ff3b3012", color: net > 0 ? "#34c759" : "#ff3b30", fontSize: "0.7rem", fontWeight: 600 }}>
                            {net > 0 ? `+${net.toLocaleString()}` : net.toLocaleString()}
                          </span>
                        ) : <span style={{ color: "#d0d0d8" }}>—</span>}
                      </td>
                      <td style={{ padding: "11px 16px" }}>
                        <span className="text-sm font-bold tabular-nums font-metric" style={{ color: "#007aff" }}>{r.currentBirdCount?.toLocaleString()}</span>
                      </td>
                      <td style={{ padding: "11px 16px", fontSize: "0.8rem", color: "#5a5a64", maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.notes || "—"}</td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
              {filtered.length === 0 && <tr><td colSpan={8} style={{ padding: "40px", textAlign: "center", color: "#b0b0b8", fontSize: "0.85rem" }}>لا توجد سجلات جرد</td></tr>}
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
              style={{ background: "#fff", borderRadius: "24px", width: "100%", maxWidth: "460px", padding: "0", boxShadow: "0 32px 64px rgba(0,0,0,0.2)", overflow: "hidden" }}>
              <div style={{ padding: "28px 28px 0", background: "linear-gradient(135deg, rgba(0,122,255,0.04), transparent)" }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: "#1a1a24", margin: 0 }}>تسجيل جرد القطيع</h2>
                    <p className="text-xs" style={{ color: "#8a8a96", marginTop: 4 }}>تحديث أعداد الطيور في الضيعة</p>
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
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                    <div>
                      <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>مضاف</label>
                      <input type="number" value={form.birdsAdded} onChange={e => setForm(p => ({ ...p, birdsAdded: e.target.value }))} placeholder="0"
                        style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1.5px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>مباع / منقول</label>
                      <input type="number" value={form.birdsRemoved} onChange={e => setForm(p => ({ ...p, birdsRemoved: e.target.value }))} placeholder="0"
                        style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1.5px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>نفوق</label>
                      <input type="number" value={form.mortality} onChange={e => setForm(p => ({ ...p, mortality: e.target.value }))} placeholder="0"
                        style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1.5px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
                    </div>
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
                  <button onClick={handleSubmit} disabled={saving || !form.flockId}
                    style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #007aff, #0056cc)", color: "#fff", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", opacity: (saving || !form.flockId) ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: "0 4px 12px rgba(0,122,255,0.3)" }}>
                    {saving ? <Loader size={16} /> : <Plus size={16} />}
                    {saving ? "..." : "تسجيل"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
