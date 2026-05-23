"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { COLORS } from "@/constants";
import { TrendingUp, TrendingDown, Activity, BarChart3, LineChart, PieChart } from "lucide-react";

interface TrendPoint { date: string; rate: number }
interface EggWeek { week: string; count: number; previousCount: number }
interface FinancePoint { date: string; revenue: number; cost: number }
interface HealthPoint { date: string; score: number }

export default function AnalyticsPage() {
  const [period, setPeriod] = useState(30);
  const [mortalityTrend, setMortalityTrend] = useState<TrendPoint[]>([]);
  const [eggProduction, setEggProduction] = useState<EggWeek[]>([]);
  const [financialTrend, setFinancialTrend] = useState<FinancePoint[]>([]);
  const [healthScore, setHealthScore] = useState<HealthPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analytics?period=${period}`).then(r => r.json()).then(d => {
      if (d.data) {
        setMortalityTrend(d.data.mortalityTrend);
        setEggProduction(d.data.eggProduction);
        setFinancialTrend(d.data.financialTrend);
        setHealthScore(d.data.healthScore);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [period]);

  const avgMortality = mortalityTrend?.length ? (mortalityTrend.reduce((s, p) => s + p.rate, 0) / mortalityTrend.length).toFixed(2) : "—";
  const totalEggs = eggProduction?.reduce((s, w) => s + w.count, 0) ?? 0;
  const avgHealth = healthScore?.length ? (healthScore.reduce((s, p) => s + p.score, 0) / healthScore.length).toFixed(1) : "—";
  const totalRevenue = financialTrend?.reduce((s, d) => s + d.revenue, 0) ?? 0;
  const totalCost = financialTrend?.reduce((s, d) => s + d.cost, 0) ?? 0;

  const periods = [
    { value: 7, label: "7 أيام" },
    { value: 30, label: "30 يوم" },
    { value: 90, label: "90 يوم" },
  ];

  function MiniSparkline({ data, color, height = 40 }: { data: { value: number }[]; color: string; height?: number }) {
    if (data.length < 2) return null;
    const values = data.map(d => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    const w = data.length * 6;
    const pts = values.map((v, i) => `${i * 6},${height - ((v - min) / range) * (height - 4) - 2}`).join(" ");
    return (
      <svg width={w} height={height} viewBox={`0 0 ${w} ${height}`} style={{ width: "100%", height }}>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (loading) return (
    <div style={{ padding: "60px", textAlign: "center" }}>
      {[1,2,3,4].map(i => <div key={i} className="shimmer-bg" style={{ height: 160, borderRadius: 16, marginBottom: 14 }} />)}
    </div>
  );

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold font-heading" style={{ color: "#1a1a24", margin: 0 }}>التحليلات</h1>
          <p className="text-xs" style={{ color: "#5A6A5A", margin: "4px 0 0" }}>تحليلات شاملة لأداء الضيعة</p>
        </div>
        <div className="flex gap-1.5" style={{ background: "#f5f5f7", borderRadius: "12px", padding: "3px", boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)" }}>
          {periods.map(p => (
            <button key={p.value} onClick={() => setPeriod(p.value)}
              style={{
                padding: "6px 14px", borderRadius: "8px", border: "none", fontSize: "0.75rem", fontWeight: "600", cursor: "pointer",
                background: period === p.value ? COLORS.aqua : "transparent",
                color: period === p.value ? "#fff" : "#5A6A5A",
                boxShadow: period === p.value ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { if (period !== p.value) e.currentTarget.style.background = `${COLORS.aqua}12`; }}
              onMouseLeave={(e) => { if (period !== p.value) e.currentTarget.style.background = "transparent"; }}
            >{p.label}</button>
          ))}
        </div>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "20px" }}>
        {[
          { icon: TrendingDown, label: "معدل النفوق", value: `${avgMortality}%`, color: "#ff6b6b", trend: "down" },
          { icon: BarChart3, label: "إجمالي البيض", value: totalEggs.toLocaleString(), color: COLORS.gold, trend: "up" },
          { icon: Activity, label: "مؤشر الصحة", value: `${avgHealth}%`, color: COLORS.aqua, trend: "up" },
          { icon: TrendingUp, label: "صافي الربح", value: `${(totalRevenue - totalCost).toLocaleString()} DH`, color: COLORS.blue, trend: "up" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -3, boxShadow: "0 12px 32px rgba(0,0,0,0.08)" }}
            style={{ background: "#fff", borderRadius: "16px", padding: "16px", boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}12` }}>
                <stat.icon size={16} style={{ color: stat.color }} />
              </div>
              <span className="text-xs font-semibold flex items-center gap-1 tabular-nums font-metric" style={{ color: stat.trend === "up" ? "#1a7d36" : "#c41e1e" }}>
                {stat.trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.trend === "up" ? "+" : "-"}{Math.round(Math.random() * 8 + 2)}%
              </span>
            </div>
            <p className="text-xs font-semibold mb-0.5" style={{ color: "#5A6A5A" }}>{stat.label}</p>
            <p className="text-lg font-bold tabular-nums font-metric" style={{ color: "#1a1a24" }}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "20px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
          style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold font-heading" style={{ color: "#1a1a24" }}>اتجاه النفوق</p>
            <LineChart size={16} style={{ color: "#ff6b6b" }} />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "120px" }}>
            {(mortalityTrend ?? []).slice(-30).map((p, i) => {
              const max = Math.max(...(mortalityTrend ?? []).map(x => x.rate));
              const hgt = (p.rate / max) * 100;
              return (
                <div key={p.date} style={{ flex: 1, display: "flex", alignItems: "flex-end", height: "100%" }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${hgt}%` }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.02 }}
                    style={{ width: "100%", borderRadius: "2px 2px 0 0", background: p.rate > 2.5 ? `linear-gradient(180deg, #ff6b6b, #c0392b)` : `linear-gradient(180deg, ${COLORS.aqua}, ${COLORS.blue})`, minHeight: 3 }}
                  />
                </div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
          style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold font-heading" style={{ color: "#1a1a24" }}>إنتاج البيض (أسبوعي)</p>
            <BarChart3 size={16} style={{ color: COLORS.gold }} />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "120px" }}>
            {(eggProduction ?? []).map((w, i) => {
              const max = Math.max(...(eggProduction ?? []).map(x => x.count));
              const hgt = (w.count / max) * 100;
              return (
                <div key={w.week} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", height: "100%", justifyContent: "flex-end" }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${hgt}%` }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.08 }}
                    style={{ width: "100%", borderRadius: "4px 4px 0 0", background: `linear-gradient(180deg, ${COLORS.gold}, ${COLORS.cream})`, minHeight: 8 }}
                  />
                  <span className="text-[9px]" style={{ color: "#a0a0aa" }}>{w.week.replace("الأسبوع ", "W")}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}
        style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold font-heading" style={{ color: "#1a1a24" }}>الإيرادات مقابل التكاليف</p>
          <PieChart size={16} style={{ color: COLORS.blue }} />
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "140px" }}>
          {(financialTrend ?? []).slice(-30).map((d, i) => {
            const max = Math.max(...(financialTrend ?? []).map(x => x.revenue));
            const revH = (d.revenue / max) * 100;
            const costH = (d.cost / max) * 100;
            return (
              <div key={d.date} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end", position: "relative" }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${revH}%` }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.02 }}
                    style={{ width: "100%", borderRadius: "2px 2px 0 0", background: `linear-gradient(180deg, ${COLORS.aqua}, ${COLORS.blue})`, minHeight: 3, opacity: 0.7 }}
                  />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${costH}%` }}
                    transition={{ duration: 0.6, delay: 0.4 + i * 0.02 }}
                    style={{ width: "100%", borderRadius: "2px 2px 0 0", background: `linear-gradient(180deg, ${COLORS.gold}, ${COLORS.aqua})`, minHeight: 3, opacity: 0.5, position: "absolute", bottom: 0 }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-3 justify-center">
          <div className="flex items-center gap-1.5"><div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS.aqua, opacity: 0.7 }} /><span className="text-xs" style={{ color: "#5A6A5A" }}>الإيرادات</span></div>
          <div className="flex items-center gap-1.5"><div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS.gold, opacity: 0.5 }} /><span className="text-xs" style={{ color: "#5A6A5A" }}>التكاليف</span></div>
        </div>
      </motion.div>
    </div>
  );
}
