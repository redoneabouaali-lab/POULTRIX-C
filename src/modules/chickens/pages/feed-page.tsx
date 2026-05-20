"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { COLORS } from "@/constants";
import { Wheat, AlertTriangle, TrendingUp, DollarSign, Warehouse, Package } from "lucide-react";

interface FeedStock {
  id: string; feedType: string; currentKg: number; minThreshold: number;
  costPerKg: number; supplier: string; unit: string;
}

interface Consumption {
  barnId: string; kgConsumed: number; cost: number; feedType: string;
}

interface HistoryEntry {
  date: string; totalKg: number; totalCost: number;
}

export default function FeedPage() {
  const [stock, setStock] = useState<FeedStock[]>([]);
  const [consumption, setConsumption] = useState<Consumption[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/feed").then(r => r.json()).then(d => {
      if (d.data) {
        setStock(d.data.feedStock);
        setConsumption(d.data.dailyConsumption);
        setHistory(d.data.history);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const totalStock = stock?.reduce((s, f) => s + f.currentKg, 0) ?? 0;
  const totalDailyCost = consumption?.reduce((s, c) => s + c.cost, 0) ?? 0;
  const avgCostPerKg = stock?.length ? stock.reduce((s, f) => s + f.costPerKg, 0) / stock.length : 0;

  if (loading) return (
    <div style={{ padding: "60px", textAlign: "center" }}>
      {[1,2,3].map(i => <div key={i} className="shimmer-bg" style={{ height: 80, borderRadius: 16, marginBottom: 12 }} />)}
    </div>
  );

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold font-heading" style={{ color: "#1a1a24", margin: 0 }}>إدارة العلف</h1>
          <p className="text-xs" style={{ color: "#5A6A5A", margin: "4px 0 0" }}>مراقبة مخزون العلف واستهلاكه</p>
        </div>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "20px" }}>
        {[
          { icon: Package, label: "إجمالي المخزون", value: `${totalStock.toLocaleString()} كغ`, color: COLORS.aqua },
          { icon: TrendingUp, label: "متوسط سعر الكغ", value: `${avgCostPerKg.toFixed(2)} DH`, color: COLORS.blue },
          { icon: DollarSign, label: "التكلفة اليومية", value: `${totalDailyCost.toLocaleString()} DH`, color: COLORS.gold },
          { icon: Warehouse, label: "الموردون", value: `${new Set((stock ?? []).map(s => s.supplier)).size}`, color: COLORS.cream },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
            style={{ background: "#fff", borderRadius: "16px", padding: "18px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}12` }}>
                <stat.icon size={18} style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-xs font-medium" style={{ color: "#5A6A5A", margin: 0 }}>{stat.label}</p>
                <p className="text-lg font-bold tabular-nums font-metric" style={{ color: "#1a1a24", margin: "2px 0 0" }}>{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "14px", marginBottom: "20px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
        >
          <p className="text-sm font-semibold mb-4" style={{ color: "#1a1a24" }}>مخزون العلف</p>
          {(stock ?? []).map((f, i) => {
            const cKg = f.currentKg ?? 0;
            const mTh = f.minThreshold ?? 1;
            const pct = Math.min(cKg / (mTh * 3) * 100, 100);
            const isLow = cKg < mTh * 1.5;
            return (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                style={{ padding: "12px 0", borderBottom: i < (stock?.length ?? 0) - 1 ? "1px solid #eeeef0" : "none" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Wheat size={14} style={{ color: isLow ? COLORS.gold : COLORS.aqua }} />
                    <span className="text-sm font-medium" style={{ color: "#1a1a24" }}>{f.feedType}</span>
                    {isLow && <AlertTriangle size={12} style={{ color: COLORS.gold }} />}
                  </div>
                  <span className="text-xs font-semibold tabular-nums font-metric" style={{ color: isLow ? "#d95c00" : "#1a7d36" }}>
                    {cKg.toLocaleString()} / {mTh.toLocaleString()} كغ
                  </span>
                </div>
                <div className="h-2 rounded-full" style={{ background: "#eeeef0" }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: isLow ? `linear-gradient(90deg, ${COLORS.gold}, #d95c00)` : `linear-gradient(90deg, ${COLORS.aqua}, ${COLORS.blue})` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(pct, 100)}%` }}
                    transition={{ duration: 1, delay: 0.6 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs" style={{ color: "#a0a0aa" }}>{f.supplier}</span>
                  <span className="text-xs tabular-nums font-metric" style={{ color: "#a0a0aa" }}>{(f.costPerKg ?? 0).toFixed(2)} DH/كغ</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
        >
          <p className="text-sm font-semibold mb-4" style={{ color: "#1a1a24" }}>الاستهلاك اليومي</p>
          {(consumption ?? []).map((c, i) => (
            <motion.div
              key={c.barnId}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.06 }}
              className="flex items-center justify-between py-2"
              style={{ borderBottom: i < (consumption?.length ?? 0) - 1 ? "1px solid #f5f5f7" : "none" }}
            >
              <span className="text-xs font-medium" style={{ color: "#5a5a64" }}>{c.barnId}</span>
              <div className="text-right">
                <span className="text-xs font-semibold tabular-nums font-metric" style={{ color: "#1a1a24" }}>{c.kgConsumed ?? 0} كغ</span>
                <span className="text-xs mr-2 tabular-nums font-metric" style={{ color: "#a0a0aa" }}>{(c.cost ?? 0)} DH</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
      >
        <p className="text-sm font-semibold mb-4" style={{ color: "#1a1a24" }}>اتجاه استهلاك العلف (آخر 14 يوم)</p>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "140px" }}>
          {(history ?? []).map((h, i) => {
            const maxKg = Math.max(1, ...(history ?? []).map(x => x.totalKg ?? 0));
            const hgt = ((h.totalKg ?? 0) / maxKg) * 100;
            return (
              <div key={h.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", height: "100%", justifyContent: "flex-end" }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${hgt}%` }}
                  transition={{ duration: 0.8, delay: 0.6 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  style={{ width: "100%", borderRadius: "4px 4px 0 0", background: `linear-gradient(180deg, ${COLORS.aqua}, ${COLORS.blue}88)`, minHeight: 8 }}
                />
                <span className="text-[9px] tabular-nums" style={{ color: "#a0a0aa" }}>{h.date.slice(5)}</span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
