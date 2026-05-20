"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { COLORS } from "@/constants";
import { PageWrapper, StatCard, TiltCard } from "@/components/ui/3d-card";
import { Egg, TrendingUp, TrendingDown, BarChart3, DollarSign, Calendar } from "lucide-react";

const days = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];
const production = [1180, 1240, 1210, 1280, 1320, 1260, 1200];
const maxVal = Math.max(...production);
const totalWeek = production.reduce((a, b) => a + b, 0);

function AnimatedBar({ value, max, label, delay, color }: { value: number; max: number; label: string; delay: number; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const hgt = (value / max) * 100;
  return (
    <div ref={ref} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%", justifyContent: "flex-end" }}>
      <motion.span
        initial={{ opacity: 0, y: -5 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: delay + 0.2 }}
        className="text-xs font-semibold tabular-nums font-metric" style={{ color: "#007aff" }}
      >
        {value}
      </motion.span>
      <motion.div
        initial={{ height: 0 }}
        animate={inView ? { height: `${hgt}%` } : {}}
        transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: "100%", borderRadius: "6px 6px 0 0", minHeight: 8, background: `linear-gradient(180deg, ${color}, ${color}66)` }}
      />
      <span className="text-[10px]" style={{ color: "#a0a0aa" }}>{label}</span>
    </div>
  );
}

export default function EggsPage() {
  return (
    <PageWrapper>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold font-heading" style={{ color: "#1a1a24", margin: 0 }}>إدارة البيض</h1>
          <p className="text-xs" style={{ color: "#5A6A5A", margin: "4px 0 0" }}>إنتاج اليوم: 1,240 بيضة &bull; الأسبوع: {totalWeek.toLocaleString()}</p>
        </div>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "24px" }}>
        <StatCard icon={Egg} label="الإنتاج اليومي" value="1,240" color="#007aff" change="+4.2%" index={0} />
        <StatCard icon={Calendar} label="الإنتاج الأسبوعي" value={totalWeek.toLocaleString()} color="#34c759" change="+2.1%" index={1} />
        <StatCard icon={TrendingDown} label="البيض المكسور" value="28" color="#ff9f0a" change="-1.2%" index={2} />
        <StatCard icon={DollarSign} label="أرباح البيض" value="18,240 DH" color="#03c3ec" change="+8.3%" index={3} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
      >
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm font-semibold" style={{ color: "#1a1a24" }}>الإنتاج الأسبوعي</span>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-3"
          >
            <span className="text-xs" style={{ color: "#5A6A5A" }}>الأسبوع الماضي: 8,420</span>
            <span className="text-xs font-semibold" style={{ color: "#34c759" }}>+3.2%</span>
          </motion.div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "6px", height: "200px" }}>
          {production.map((v, i) => (
            <AnimatedBar
              key={i}
              value={v}
              max={maxVal}
              label={days[i]}
              delay={0.3 + i * 0.06}
              color="#007aff"
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginTop: "20px" }}
      >
        {[
          { label: "متوسط الإنتاج اليومي", value: "1,247", sub: "بيضة", color: COLORS.aqua },
          { label: "نسبة الإنتاج", value: "78%", sub: "من السعة القصوى", color: COLORS.blue },
          { label: "جودة البيض", value: "94%", sub: "درجة الجودة", color: COLORS.gold },
        ].map((s, i) => (
          <TiltCard key={i} tiltDegree={5}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.06 }}
              style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
            >
              <p className="text-xs font-medium mb-2" style={{ color: "#5A6A5A" }}>{s.label}</p>
              <p className="text-2xl font-black tabular-nums font-metric" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs mt-1" style={{ color: "#a0a0aa" }}>{s.sub}</p>
            </motion.div>
          </TiltCard>
        ))}
      </motion.div>
    </PageWrapper>
  );
}
