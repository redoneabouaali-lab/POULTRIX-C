"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { COLORS } from "@/constants";
import { api } from "@/lib/api-client";
import { useRealtime } from "@/hooks";
import {
  Bird, Egg, Beef, Wheat, HeartPulse, DollarSign,
  TrendingUp, TrendingDown, Bell, Package, ShoppingCart,
  ArrowLeft, LayoutDashboard, Activity,
} from "lucide-react";
import type { DashboardMetric, FlockSummary, FinancialSnapshot, BarnAlert } from "@/types";

const moduleLinks = [
  { icon: Bird, label: "الدجاج", href: "/dashboard/chickens", color: COLORS.aqua },
  { icon: Egg, label: "البيض", href: "/dashboard/eggs", color: COLORS.gold },
  { icon: Beef, label: "اللحم", href: "/dashboard/meat", color: COLORS.blue },
  { icon: Wheat, label: "العلف", href: "/dashboard/feed", color: COLORS.aqua },
  { icon: HeartPulse, label: "الصحة", href: "/dashboard/health", color: COLORS.gold },
  { icon: Package, label: "المخزون", href: "/dashboard/inventory", color: COLORS.blue },
  { icon: ShoppingCart, label: "المبيعات", href: "/dashboard/sales", color: COLORS.aqua },
  { icon: DollarSign, label: "المالية", href: "/dashboard/finance", color: COLORS.gold },
  { icon: LayoutDashboard, label: "التقارير", href: "/dashboard/reports", color: COLORS.blue },
  { icon: Activity, label: "التحليلات", href: "/dashboard/analytics", color: COLORS.aqua },
];

export default function OverviewPage() {
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [flock, setFlock] = useState<FlockSummary | null>(null);
  const [financial, setFinancial] = useState<FinancialSnapshot | null>(null);
  const [alerts, setAlerts] = useState<BarnAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { connected } = useRealtime();

  useEffect(() => {
    async function load() {
      try {
        const [dash, flockData, fin, alertData] = await Promise.all([
          api.get<DashboardMetric[]>("/api/dashboard"),
          api.get<FlockSummary>("/api/flock"),
          api.get<FinancialSnapshot>("/api/dashboard/financial"),
          api.get<BarnAlert[]>("/api/predictions/alerts"),
        ]);
        if (dash.data) setMetrics(dash.data);
        if (flockData.data) setFlock(flockData.data);
        if (fin.data) setFinancial(fin.data);
        if (alertData.data) setAlerts(alertData.data);
      } catch (e) { console.error("Overview load error", e); }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const highAlerts = alerts.filter(a => !a.acknowledged);

  return (
    <div className="min-h-[calc(100dvh-100px)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-xl font-bold" style={{ color: "#1E2B22", letterSpacing: "-0.02em" }}>
            نظرة عامة
          </h1>
          <p className="text-sm mt-1" style={{ color: "#7A8A7A" }}>
            نبض الضيعة في لمحة — جميع المؤشرات الرئيسية
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ background: connected ? `${COLORS.blue}10` : "#fff5eb", color: connected ? COLORS.blue : "#d95c00" }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: connected ? "#34c759" : "#ff3b30" }} />
            {connected ? "مباشر" : "غير متصل"}
          </div>
          <span className="text-xs" style={{ color: "#7A8A7A" }}>
            {new Date().toLocaleDateString("ar-MA", { weekday: "long", month: "long", day: "numeric" })}
          </span>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8"
      >
        {[
          { icon: Bird, label: "الطيور", value: flock ? flock.totalBirds.toLocaleString() : "—", color: COLORS.aqua },
          { icon: Egg, label: "البيض اليومي", value: "1,240", color: COLORS.gold },
          { icon: DollarSign, label: "الإيراد", value: financial ? `${financial.projectedRevenue.toFixed(0)} DH` : "—", color: COLORS.blue },
          { icon: HeartPulse, label: "صحة القطيع", value: flock ? `${flock.healthScore}%` : "—", color: COLORS.aqua },
          { icon: TrendingUp, label: "هامش الربح", value: financial ? `+${financial.profitMargin}%` : "—", color: COLORS.gold },
          { icon: Bell, label: "التنبيهات", value: String(highAlerts.length), color: highAlerts.length > 0 ? "#d95c00" : COLORS.blue },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + i * 0.04, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-xl p-4"
            style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${item.color}12` }}>
                <item.icon size={14} style={{ color: item.color }} />
              </div>
            </div>
            <p className="text-xs font-medium" style={{ color: "#7A8A7A" }}>{item.label}</p>
            <p className="text-lg font-bold tabular-nums font-metric mt-0.5" style={{ color: "#1E2B22" }}>{item.value}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Module Status Grid */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h2 className="text-sm font-bold mb-3" style={{ color: "#1E2B22" }}>الوحدات</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {moduleLinks.map((mod, i) => (
                <a
                  key={i}
                  href={mod.href}
                  className="group rounded-xl p-3.5 spring-transition hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: "#ffffff", border: "1px solid rgba(0,0,0,0.04)", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${mod.color}12` }}>
                      <mod.icon size={15} style={{ color: mod.color }} />
                    </div>
                    <span className="text-sm font-medium" style={{ color: "#1E2B22" }}>{mod.label}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2 mr-10">
                    <span className="text-xs" style={{ color: "#7A8A7A" }}>فتح</span>
                    <ArrowLeft size={10} style={{ color: "#7A8A7A" }} />
                  </div>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Flock + Financial Summary */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {flock && (
              <div className="rounded-xl p-5" style={{ background: "#ffffff", border: `1px solid ${COLORS.blue}12`, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${COLORS.blue}12` }}>
                    <Bird size={14} style={{ color: COLORS.blue }} />
                  </div>
                  <span className="text-sm font-semibold" style={{ color: "#1E2B22" }}>القطيع</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "إجمالي الطيور", value: flock.totalBirds.toLocaleString(), accent: false },
                    { label: "الحظائر النشطة", value: String(flock.activeBarns), accent: false },
                    { label: "متوسط العمر", value: `${flock.avgAge} يوم`, accent: false },
                    { label: "مؤشر الصحة", value: `${flock.healthScore}%`, accent: true },
                  ].map((item, i) => (
                    <div key={i} className="p-2.5 rounded-lg" style={{ background: "#f8f8fa" }}>
                      <p className="text-xs" style={{ color: "#7A8A7A" }}>{item.label}</p>
                      <p className="text-sm font-bold tabular-nums font-metric mt-0.5" style={{ color: item.accent ? COLORS.aqua : "#1E2B22" }}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {financial && (
              <div className="rounded-xl p-5" style={{ background: "#ffffff", border: `1px solid ${COLORS.gold}12`, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${COLORS.gold}12` }}>
                    <DollarSign size={14} style={{ color: COLORS.gold }} />
                  </div>
                  <span className="text-sm font-semibold" style={{ color: "#1E2B22" }}>المالية</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "العلف اليومي", value: `${financial.dailyFeedCost.toFixed(0)} DH` },
                    { label: "الماء اليومي", value: `${financial.dailyWaterCost.toFixed(0)} DH` },
                    { label: "الإيراد المتوقع", value: `${financial.projectedRevenue.toFixed(0)} DH` },
                    { label: "هامش الربح", value: `+${financial.profitMargin}%` },
                  ].map((item, i) => (
                    <div key={i} className="p-2.5 rounded-lg" style={{ background: "#f8f8fa" }}>
                      <p className="text-xs" style={{ color: "#7A8A7A" }}>{item.label}</p>
                      <p className="text-sm font-bold tabular-nums font-metric mt-0.5" style={{ color: COLORS.gold }}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Alerts */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-xl p-5" style={{ background: "#ffffff", border: `1px solid rgba(0,0,0,0.04)`, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bell size={14} style={{ color: COLORS.gold }} />
                <span className="text-sm font-semibold" style={{ color: "#1E2B22" }}>التنبيهات</span>
              </div>
              {highAlerts.length > 0 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-md" style={{ background: "#ff3b30", color: "#fff" }}>
                  {highAlerts.length}
                </span>
              )}
            </div>
            {highAlerts.length === 0 ? (
              <div className="p-3 rounded-lg text-xs" style={{ background: "#f0faf4", color: "#1a7d36" }}>
                كلشي مستقر — لا توجد تنبيهات
              </div>
            ) : (
              <div className="space-y-2">
                {highAlerts.slice(0, 4).map((alert) => (
                  <div key={alert.id} className="flex items-start gap-2 p-2.5 rounded-lg text-xs" style={{ background: alert.severity === "high" ? "#fff5eb" : "#f8f8fa", borderRight: `3px solid ${alert.severity === "high" ? "#ff9f0a" : COLORS.aqua}` }}>
                    <div className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0" style={{ background: alert.severity === "high" ? "#ff9f0a" : COLORS.aqua }} />
                    <span style={{ color: alert.severity === "high" ? "#d95c00" : "#5A6A5A" }}>{alert.message}</span>
                  </div>
                ))}
                {highAlerts.length > 4 && (
                  <a href="/dashboard/notifications" className="block text-xs font-medium text-center mt-2" style={{ color: COLORS.aqua }}>
                    عرض الكل ({highAlerts.length})
                  </a>
                )}
              </div>
            )}
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl p-5" style={{ background: "#ffffff", border: `1px solid rgba(0,0,0,0.04)`, boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} style={{ color: COLORS.aqua }} />
              <span className="text-sm font-semibold" style={{ color: "#1E2B22" }}>إحصائيات سريعة</span>
            </div>
            <div className="space-y-2.5">
              {metrics.slice(0, 4).map((m) => (
                <div key={m.id} className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: "#7A8A7A" }}>{m.label}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold tabular-nums font-metric" style={{ color: "#1E2B22" }}>{m.value}</span>
                    <span className="text-[10px]" style={{ color: m.change >= 0 ? "#1a7d36" : "#c41e1e" }}>
                      {m.change >= 0 ? "+" : ""}{m.change}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
