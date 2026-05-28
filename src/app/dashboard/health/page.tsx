"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COLORS } from "@/constants";
import { api } from "@/lib/api-client";
import { Plus, X, Loader, HeartPulse, Syringe, Search, Activity, Skull, Eye, Pill, Filter } from "lucide-react";

const eventTypes = [
  { value: "vaccination", label: "تطعيم", icon: Syringe, color: "#007aff" },
  { value: "disease", label: "مرض", icon: Activity, color: "#ff3b30" },
  { value: "inspection", label: "تفتيش", icon: Eye, color: "#34c759" },
  { value: "medication", label: "دواء", icon: Pill, color: "#ff9f0a" },
  { value: "mortality", label: "نفوق", icon: Skull, color: "#8e8e93" },
];

const monthNames = ["يناير", "فبراير", "مارس", "أبريل", "ماي", "يونيو", "يوليو", "غشت", "شتنبر", "أكتوبر", "نونبر", "ديسمبر"];
const fmtDate = (s: string) => { if (!s) return "—"; const d = new Date(s); return `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`; };
const toDH = (n: number) => (n || 0).toLocaleString() + " DH";

function HealthCross({ size = 180 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="crossGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff3b30" stopOpacity="0.08" />
          <stop offset="50%" stopColor="#ff3b30" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ff3b30" stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <rect x="10" y="10" width="100" height="100" rx="20" fill="url(#crossGrad)" stroke="#ff3b30" strokeWidth="0.5" strokeOpacity="0.15" />
      <rect x="45" y="25" width="30" height="70" rx="6" fill="#ff3b30" fillOpacity="0.06" />
      <rect x="25" y="45" width="70" height="30" rx="6" fill="#ff3b30" fillOpacity="0.06" />
    </svg>
  );
}

export default function HealthPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [flocks, setFlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ eventType: "vaccination", flockId: "", description: "", birdsAffected: "", mortalityCount: "0", cost: "", performedBy: "", treatment: "", nextFollowUp: "", notes: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([api.get<any[]>("/api/health-events"), api.get<any[]>("/api/flock")]).then(([a, b]) => {
      if (a.data) setEvents(a.data);
      if (b.data) setFlocks(b.data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    let f = events;
    if (filterType !== "all") f = f.filter(e => e.eventType === filterType);
    if (search) f = f.filter(e => (e.description || "").includes(search) || (e.performedBy || "").includes(search));
    return f.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
  }, [events, filterType, search]);

  const getFlockName = (id: string) => flocks.find(f => f.id === id)?.name || id;

  const handleSubmit = async () => {
    if (!form.description) return;
    setSaving(true);
    const payload = { eventType: form.eventType, flockId: form.flockId || undefined, description: form.description, birdsAffected: Number(form.birdsAffected) || undefined, mortalityCount: Number(form.mortalityCount) || 0, cost: Number(form.cost) || 0, performedBy: form.performedBy || "المربّي", treatment: form.treatment || undefined, nextFollowUp: form.nextFollowUp || undefined, notes: form.notes || undefined, eventDate: new Date().toISOString().split("T")[0] };
    const res = await api.post("/api/health-events", payload);
    setEvents(p => [{ ...payload, id: (res.data as any)?.id || `hlth-${Date.now()}`, createdAt: new Date().toISOString() }, ...p]);
    setShowModal(false);
    setForm({ eventType: "vaccination", flockId: "", description: "", birdsAffected: "", mortalityCount: "0", cost: "", performedBy: "", treatment: "", nextFollowUp: "", notes: "" });
    setSaving(false);
  };

  const stats = useMemo(() => {
    const total = events.length;
    const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
    const recent = events.filter(e => new Date(e.eventDate) >= weekAgo);
    const vaccinations = events.filter(e => e.eventType === "vaccination").length;
    const mortality = events.reduce((s, e) => s + (e.mortalityCount || 0), 0);
    const totalCost = events.reduce((s, e) => s + (e.cost || 0), 0);
    return { total, recent: recent.length, vaccinations, mortality, totalCost };
  }, [events]);

  const EventIcon = ({ type }: { type: string }) => {
    const t = eventTypes.find(e => e.value === type);
    const Icon = t?.icon || Activity;
    return <Icon size={14} style={{ color: t?.color || "#8e8e93" }} />;
  };

  const typeBadge = (type: string) => {
    const t = eventTypes.find(e => e.value === type);
    if (!t) return <span>{type}</span>;
    return (
      <span className="flex items-center gap-1.5" style={{ padding: "3px 10px", borderRadius: "8px", background: `${t.color}10`, color: t.color, fontSize: "0.75rem", fontWeight: 600, whiteSpace: "nowrap" }}>
        <t.icon size={12} />
        {t.label}
      </span>
    );
  };

  if (loading) return <div style={{ padding: "60px", textAlign: "center" }}>{[1, 2, 3, 4, 5].map(i => <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }} className="shimmer-bg" style={{ height: 80, borderRadius: 16, marginBottom: 12 }} />)}</div>;

  return (
    <div>
      {/* Hero */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
        style={{ position: "relative", overflow: "hidden", borderRadius: "20px", marginBottom: "24px", background: "linear-gradient(135deg, #1a1a24 0%, #2a1a1a 100%)" }}>
        <div style={{ position: "absolute", top: "-30%", left: "65%", transform: "translateX(-50%)", opacity: 0.5, pointerEvents: "none" }}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 0.5 }} transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}>
            <HealthCross size={200} />
          </motion.div>
        </div>
        <div style={{ position: "relative", zIndex: 1, padding: "28px 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <div style={{ padding: "6px 12px", borderRadius: "20px", background: "rgba(255,59,48,0.1)" }}>
              <span className="text-[10px] font-semibold tracking-widest" style={{ color: "#ff3b30" }}>الصحة البيطرية</span>
            </div>
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.5, duration: 0.6 }}
              style={{ height: 2, flex: 1, background: "linear-gradient(90deg, rgba(255,59,48,0.27), transparent)", transformOrigin: "right" }} />
          </div>
          <div className="flex items-end justify-between">
            <div>
              <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="text-2xl font-black" style={{ color: "#fff", margin: 0, letterSpacing: "-0.3px" }}>
                {stats.total}
                <span className="text-lg font-semibold" style={{ color: "#ff3b30", marginRight: 8 }}>حدث صحي</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", marginTop: 6 }}>
                {stats.vaccinations} تطعيم &bull; {stats.mortality} نفوق &bull; {toDH(stats.totalCost)} تكاليف
              </motion.p>
            </div>
            <motion.button onClick={() => setShowModal(true)}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 22px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #ff3b30, #d62d20)", color: "#fff", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 16px rgba(255,59,48,0.35)", whiteSpace: "nowrap" }}>
              <Plus size={17} /> تسجيل حدث
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}>
        {[
          { label: "إجمالي الأحداث", value: stats.total.toString(), sub: "مسجلة", color: "#007aff", bg: "#007aff08", border: "#007aff15" },
          { label: "آخر 7 أيام", value: stats.recent.toString(), sub: "حدث هذا الأسبوع", color: "#ff3b30", bg: "#ff3b3008", border: "#ff3b3015" },
          { label: "إجمالي النفوق", value: stats.mortality.toString(), sub: "طير", color: "#8e8e93", bg: "#8e8e9308", border: "#8e8e9315" },
          { label: "التكاليف", value: toDH(stats.totalCost), sub: "مجموع المصاريف", color: "#ff9f0a", bg: "#ff9f0a08", border: "#ff9f0a15" },
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

      {/* Filter bar */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ background: "#fff", borderRadius: "16px", padding: "16px 20px", marginBottom: "16px", border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 1px 3px rgba(0,0,0,0.03)", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "4px", flex: 1, flexWrap: "wrap" }}>
          <button onClick={() => setFilterType("all")}
            style={{ padding: "6px 14px", borderRadius: "10px", border: "none", background: filterType === "all" ? "#1a1a24" : "#f5f5f7", color: filterType === "all" ? "#fff" : "#5a5a64", fontSize: "0.75rem", fontWeight: 500, cursor: "pointer", transition: "all 0.15s" }}>الكل</button>
          {eventTypes.map(t => (
            <button key={t.value} onClick={() => setFilterType(t.value)}
              style={{ padding: "6px 14px", borderRadius: "10px", border: "none", display: "flex", alignItems: "center", gap: "5px", background: filterType === t.value ? t.color : "#f5f5f7", color: filterType === t.value ? "#fff" : "#5a5a64", fontSize: "0.75rem", fontWeight: 500, cursor: "pointer", transition: "all 0.15s" }}>
              <t.icon size={12} /> {t.label}
            </button>
          ))}
        </div>
        <div style={{ position: "relative", minWidth: 180 }}>
          <Search size={14} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "#b0b0b8", pointerEvents: "none" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..."
            style={{ width: "100%", padding: "8px 14px 8px 36px", borderRadius: "10px", border: "1.5px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.8rem", outline: "none", boxSizing: "border-box" }} />
        </div>
      </motion.div>

      {/* Events distribution mini-chart */}
      {events.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ background: "#fff", borderRadius: "16px", padding: "20px", marginBottom: "16px", border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
          <span className="text-sm font-semibold" style={{ color: "#1a1a24", display: "block", marginBottom: 14 }}>توزيع الأحداث حسب النوع</span>
          <div style={{ display: "flex", gap: "6px", height: "48px", alignItems: "flex-end" }}>
            {eventTypes.map(t => {
              const count = events.filter(e => e.eventType === t.value).length;
              const max = Math.max(...eventTypes.map(x => events.filter(e => e.eventType === x.value).length), 1);
              const pct = (count / max) * 100;
              return (
                <div key={t.value} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <motion.div initial={{ height: 0 }} animate={{ height: `${Math.max(pct, 4)}%` }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    style={{ width: "100%", borderRadius: "4px 4px 0 0", background: t.color, minHeight: 4 }} />
                  <span className="text-[10px] font-bold" style={{ color: t.color }}>{count}</span>
                  <span className="text-[8px]" style={{ color: "#b0b0b8" }}>{t.label}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{ background: "#fff", borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #f0f0f2" }}>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold" style={{ color: "#1a1a24" }}>سجل الأحداث الصحية</span>
            <span style={{ padding: "2px 10px", borderRadius: "10px", background: "#ff3b3010", color: "#ff3b30", fontSize: "0.7rem", fontWeight: 600 }}>{filtered.length} حدث</span>
          </div>
          <span className="text-xs" style={{ color: "#8a8a96" }}>مرتب حسب التاريخ</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 750 }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f0f0f2" }}>
                {["التاريخ", "النوع", "الوصف", "الدفعة", "المتضررون", "النفوق", "التكلفة", "الطبيب", "المتابعة"].map(h => (
                  <th key={h} style={{ textAlign: "right", padding: "10px 16px", fontSize: "0.7rem", fontWeight: "600", color: "#b0b0b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.map((e, i) => (
                  <motion.tr key={e.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: i * 0.015 }} style={{ borderBottom: "1px solid #f5f5f7" }} whileHover={{ background: "#f8f9fb" }}>
                    <td style={{ padding: "11px 16px" }}><span className="text-xs" style={{ color: "#5a5a64" }}>{fmtDate(e.eventDate)}</span></td>
                    <td style={{ padding: "11px 16px" }}>{typeBadge(e.eventType)}</td>
                    <td style={{ padding: "11px 16px" }}><span className="text-sm font-semibold" style={{ color: "#1a1a24" }}>{e.description}</span></td>
                    <td style={{ padding: "11px 16px", fontSize: "0.85rem", color: "#5a5a64" }}>{e.flockId ? getFlockName(e.flockId) : "—"}</td>
                    <td style={{ padding: "11px 16px", fontSize: "0.85rem", color: "#007aff" }}>{e.birdsAffected?.toLocaleString() || "—"}</td>
                    <td style={{ padding: "11px 16px", fontSize: "0.85rem", color: e.mortalityCount ? "#ff3b30" : "#d0d0d8", fontWeight: e.mortalityCount ? 600 : 400 }}>{e.mortalityCount || "0"}</td>
                    <td style={{ padding: "11px 16px", fontSize: "0.85rem", color: e.cost ? "#ff9f0a" : "#d0d0d8" }}>{e.cost ? toDH(e.cost) : "—"}</td>
                    <td style={{ padding: "11px 16px", fontSize: "0.85rem", color: "#5a5a64" }}>{e.performedBy || "—"}</td>
                    <td style={{ padding: "11px 16px", fontSize: "0.8rem", color: e.nextFollowUp ? "#34c759" : "#d0d0d8", fontWeight: e.nextFollowUp ? 500 : 400 }}>{e.nextFollowUp ? fmtDate(e.nextFollowUp) : "—"}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {filtered.length === 0 && <tr><td colSpan={9} style={{ padding: "40px", textAlign: "center", color: "#b0b0b8", fontSize: "0.85rem" }}>لا توجد أحداث صحية مسجلة</td></tr>}
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
              style={{ background: "#fff", borderRadius: "24px", width: "100%", maxWidth: "480px", padding: "0", boxShadow: "0 32px 64px rgba(0,0,0,0.2)", overflow: "hidden" }}>
              <div style={{ padding: "28px 28px 0", background: "linear-gradient(135deg, rgba(255,59,48,0.04), transparent)" }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: "#1a1a24", margin: 0 }}>حدث صحي جديد</h2>
                    <p className="text-xs" style={{ color: "#8a8a96", marginTop: 4 }}>سجل تطعيم، مرض، تفتيش، دواء، أو نفوق</p>
                  </div>
                  <button onClick={() => setShowModal(false)} style={{ width: 36, height: 36, borderRadius: "50%", background: "#f5f5f7", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#8a8a96" }}>
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div style={{ padding: "20px 28px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>نوع الحدث *</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "6px" }}>
                      {eventTypes.map(t => (
                        <button key={t.value} onClick={() => setForm(p => ({ ...p, eventType: t.value }))}
                          style={{ padding: "8px 4px", borderRadius: "10px", border: `1.5px solid ${form.eventType === t.value ? t.color : "#e8e8ec"}`, background: form.eventType === t.value ? `${t.color}08` : "#f8f8fa", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, transition: "all 0.15s" }}>
                          <t.icon size={16} style={{ color: form.eventType === t.value ? t.color : "#8a8a96" }} />
                          <span className="text-[10px] font-medium" style={{ color: form.eventType === t.value ? t.color : "#5a5a64" }}>{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>الوصف *</label>
                    <input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="وصف الحدث"
                      style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1.5px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>الدفعة</label>
                    <select value={form.flockId} onChange={e => setForm(p => ({ ...p, flockId: e.target.value }))}
                      style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1.5px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}>
                      <option value="">اختر الدفعة (اختياري)</option>
                      {flocks.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                    <div>
                      <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>الطيور المتضررة</label>
                      <input type="number" value={form.birdsAffected} onChange={e => setForm(p => ({ ...p, birdsAffected: e.target.value }))} placeholder="0"
                        style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1.5px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>النفوق</label>
                      <input type="number" value={form.mortalityCount} onChange={e => setForm(p => ({ ...p, mortalityCount: e.target.value }))} placeholder="0"
                        style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1.5px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>التكلفة (DH)</label>
                      <input type="number" value={form.cost} onChange={e => setForm(p => ({ ...p, cost: e.target.value }))} placeholder="0"
                        style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1.5px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div>
                      <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>الطبيب / المنفذ</label>
                      <input value={form.performedBy} onChange={e => setForm(p => ({ ...p, performedBy: e.target.value }))} placeholder="د. أحمد"
                        style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1.5px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
                    </div>
                    <div>
                      <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>موعد المتابعة</label>
                      <input type="date" value={form.nextFollowUp} onChange={e => setForm(p => ({ ...p, nextFollowUp: e.target.value }))}
                        style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1.5px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium" style={{ color: "#5a5a64", marginBottom: 6, display: "block" }}>العلاج / الملاحظات</label>
                    <input value={form.treatment} onChange={e => setForm(p => ({ ...p, treatment: e.target.value }))} placeholder="مثلاً: مضاد حيوي في ماء الشرب"
                      style={{ width: "100%", padding: "11px 14px", borderRadius: "12px", border: "1.5px solid #e8e8ec", background: "#f8f8fa", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowModal(false)}
                    style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1.5px solid #e8e8ec", background: "#fff", color: "#5a5a64", fontSize: "0.85rem", fontWeight: 500, cursor: "pointer" }}>إلغاء</button>
                  <button onClick={handleSubmit} disabled={saving || !form.description}
                    style={{ flex: 1, padding: "12px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #ff3b30, #d62d20)", color: "#fff", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", opacity: (saving || !form.description) ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: "0 4px 12px rgba(255,59,48,0.3)" }}>
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
