"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { COLORS } from "@/constants";
import { DollarSign, TrendingUp, TrendingDown, PieChart, BarChart3, Target, Activity, ArrowUpRight } from "lucide-react";

interface FinancialData {
  dailyFeedCost: number; dailyWaterCost: number; projectedRevenue: number; profitMargin: number;
  costPerBird: number; breakEvenPrice: number; roi: number;
  feedCostPercentage: number; laborCost: number; medicationCost: number; utilitiesCost: number;
  revenueHistory: { date: string; amount: number }[];
  expenseBreakdown: { category: string; amount: number; percentage: number }[];
  budgetVsActual: { month: string; budgeted: number; actual: number; variance: number }[];
  projections: { month: string; projectedRevenue: number; projectedCost: number }[];
}

export default function FinancePage() {
  const [data, setData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/financial").then(r => r.json()).then(d => {
      if (d.data) setData(d.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ padding: "60px", textAlign: "center" }}>
      {[1,2,3,4,5,6].map(i => <div key={i} className="shimmer-bg" style={{ height: 100, borderRadius: 16, marginBottom: 12 }} />)}
    </div>
  );

  if (!data) return (
    <div className="flex items-center justify-center" style={{ padding: "80px", color: "#5A6A5A" }}>
      <p className="text-sm">لا توجد بيانات مالية متاحة</p>
    </div>
  );

  const totalCost = (data.dailyFeedCost ?? 0) + (data.dailyWaterCost ?? 0) + (data.laborCost ?? 0) + (data.medicationCost ?? 0) + (data.utilitiesCost ?? 0);
  const dailyProfit = (data.projectedRevenue ?? 0) / 30 - totalCost;

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold font-heading" style={{ color: "#1a1a24", margin: 0 }}>المركز المالي</h1>
          <p className="text-xs" style={{ color: "#5A6A5A", margin: "4px 0 0" }}>نظرة شاملة على الوضع المالي لضيعتك</p>
        </div>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "20px" }}>
        {[
          { icon: DollarSign, label: "الإيراد اليومي", value: `${(data.projectedRevenue / 30).toFixed(0)} DH`, color: COLORS.aqua, change: "+8.3%" },
          { icon: TrendingDown, label: "التكلفة اليومية", value: `${totalCost.toFixed(0)} DH`, color: "#ff6b6b", change: "-2.1%" },
          { icon: Target, label: "هامش الربح", value: `${data.profitMargin}%`, color: COLORS.gold, change: `+${data.profitMargin.toFixed(1)}%` },
          { icon: Activity, label: "العائد على الاستثمار", value: `${data.roi}%`, color: COLORS.blue, change: `+${data.roi.toFixed(1)}%` },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -2 }}
            style={{ background: "#fff", borderRadius: "16px", padding: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}12` }}>
                <stat.icon size={16} style={{ color: stat.color }} />
              </div>
              <span className="text-xs font-semibold" style={{ color: stat.change.startsWith("+") ? "#1a7d36" : "#c41e1e" }}>{stat.change}</span>
            </div>
            <p className="text-xs font-medium mb-0.5" style={{ color: "#5A6A5A" }}>{stat.label}</p>
            <p className="text-lg font-bold tabular-nums font-metric" style={{ color: "#1a1a24" }}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "20px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
        >
          <p className="text-sm font-semibold mb-4" style={{ color: "#1a1a24" }}>تفاصيل المصروفات</p>
          {(data.expenseBreakdown ?? []).map((e, i) => (
            <motion.div
              key={e.category}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              style={{ marginBottom: 12 }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium" style={{ color: "#5a5a64" }}>{e.category}</span>
                <span className="text-xs font-semibold tabular-nums font-metric" style={{ color: "#1a1a24" }}>{e.percentage}% ({e.amount.toFixed(0)} DH)</span>
              </div>
              <div className="h-2 rounded-full" style={{ background: "#eeeef0" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${e.percentage}%` }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full"
                  style={{ background: [COLORS.aqua, COLORS.blue, COLORS.gold, COLORS.cream, "#ff6b6b"][i] }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
        >
          <p className="text-sm font-semibold mb-4" style={{ color: "#1a1a24" }}>المؤشرات الرئيسية</p>
          {[
            { label: "تكلفة كل طير", value: `${data.costPerBird.toFixed(2)} DH`, desc: "متوسط تكلفة تربية الطير الواحد" },
            { label: "سعر التعادل", value: `${data.breakEvenPrice.toFixed(2)} DH`, desc: "سعر الكغ لتحقيق نقطة التعادل" },
            { label: "هامش الربح", value: `${data.profitMargin}%`, desc: "نسبة الربح مقارنة بالإيرادات" },
            { label: "الربح اليومي", value: `${dailyProfit.toFixed(0)} DH`, desc: "صافي الربح اليومي المقدر" },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              style={{ padding: "10px 0", borderBottom: i < 3 ? "1px solid #f5f5f7" : "none" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium" style={{ color: "#5a5a64" }}>{kpi.label}</p>
                  <p className="text-xs" style={{ color: "#a0a0aa" }}>{kpi.desc}</p>
                </div>
                <span className="text-base font-bold tabular-nums font-metric" style={{ color: "#1a1a24" }}>{kpi.value}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "20px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold" style={{ color: "#1a1a24" }}>الميزانية مقابل الفعلي</p>
            <BarChart3 size={16} style={{ color: COLORS.aqua }} />
          </div>
          {(data.budgetVsActual ?? []).map((b, i) => (
            <div key={b.month} style={{ marginBottom: 10 }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium" style={{ color: "#5a5a64" }}>{b.month}</span>
                <span className="text-xs font-semibold tabular-nums font-metric" style={{ color: b.variance >= 0 ? "#1a7d36" : "#c41e1e" }}>
                  {b.variance >= 0 ? "+" : ""}{b.variance.toFixed(0)} DH
                </span>
              </div>
              <div className="flex gap-1 h-4 items-center">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(b.budgeted / Math.max(...(data.budgetVsActual ?? []).map(x => x.budgeted))) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                  className="h-3 rounded-sm" style={{ background: COLORS.aqua, opacity: 0.7 }}
                />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(b.actual / Math.max(...(data.budgetVsActual ?? []).map(x => x.budgeted))) * 100}%` }}
                  transition={{ duration: 0.8, delay: 0.35 + i * 0.1 }}
                  className="h-3 rounded-sm" style={{ background: COLORS.gold, opacity: 0.5 }}
                />
              </div>
            </div>
          ))}
          <div className="flex gap-3 mt-2 justify-center">
            <div className="flex items-center gap-1"><div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS.aqua, opacity: 0.7 }} /><span className="text-xs" style={{ color: "#5A6A5A" }}>الميزانية</span></div>
            <div className="flex items-center gap-1"><div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS.gold, opacity: 0.5 }} /><span className="text-xs" style={{ color: "#5A6A5A" }}>الفعلي</span></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold" style={{ color: "#1a1a24" }}>التوقعات المالية</p>
            <TrendingUp size={16} style={{ color: COLORS.gold }} />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "120px" }}>
            {(data.projections ?? []).map((p, i) => {
              const max = Math.max(...(data.projections ?? []).map(x => x.projectedRevenue));
              const revH = (p.projectedRevenue / max) * 100;
              const costH = (p.projectedCost / max) * 100;
              return (
                <div key={p.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${revH}%` }}
                    transition={{ duration: 0.6, delay: 0.35 + i * 0.1 }}
                    style={{ width: "100%", borderRadius: "4px 4px 0 0", background: `linear-gradient(180deg, ${COLORS.aqua}, ${COLORS.blue})`, minHeight: 10 }}
                  />
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${costH}%` }}
                    transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                    style={{ width: "100%", borderRadius: "4px 4px 0 0", background: `linear-gradient(180deg, ${COLORS.gold}, ${COLORS.cream})`, minHeight: 10, marginTop: 2 }}
                  />
                  <span className="text-[9px] mt-1" style={{ color: "#a0a0aa" }}>{p.month}</span>
                </div>
              );
            })}
          </div>
          <div className="flex gap-3 mt-3 justify-center">
            <div className="flex items-center gap-1"><div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS.aqua }} /><span className="text-xs" style={{ color: "#5A6A5A" }}>الإيرادات المتوقعة</span></div>
            <div className="flex items-center gap-1"><div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS.gold }} /><span className="text-xs" style={{ color: "#5A6A5A" }}>التكاليف المتوقعة</span></div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold" style={{ color: "#1a1a24" }}>حاسبة نقطة التعادل</p>
          <Target size={16} style={{ color: COLORS.gold }} />
        </div>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <p className="text-xs font-medium mb-1" style={{ color: "#5A6A5A" }}>سعر البيع الحالي</p>
            <p className="text-2xl font-black tabular-nums font-metric" style={{ color: "#1a1a24" }}>22.00 DH</p>
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium mb-1" style={{ color: "#5A6A5A" }}>سعر التعادل</p>
            <p className="text-2xl font-black tabular-nums font-metric" style={{ color: data.breakEvenPrice < 22 ? "#1a7d36" : "#c41e1e" }}>{data.breakEvenPrice.toFixed(2)} DH</p>
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium mb-1" style={{ color: "#5A6A5A" }}>الهامش فوق التعادل</p>
            <p className="text-2xl font-black tabular-nums font-metric" style={{ color: "#1a7d36" }}>+{(22 - data.breakEvenPrice).toFixed(2)} DH</p>
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium mb-1" style={{ color: "#5A6A5A" }}>الربح السنوي المقدر</p>
            <p className="text-2xl font-black tabular-nums font-metric" style={{ color: COLORS.aqua }}>{(dailyProfit * 365).toLocaleString()} DH</p>
          </div>
        </div>
        <div className="h-3 rounded-full mt-4" style={{ background: "#eeeef0" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((data.breakEvenPrice / 22) * 100, 100)}%` }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full flex items-center justify-center"
            style={{ background: `linear-gradient(90deg, ${COLORS.gold}, ${COLORS.aqua})` }}
          >
            <span className="text-[9px] font-bold text-black">نقطة التعادل</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
