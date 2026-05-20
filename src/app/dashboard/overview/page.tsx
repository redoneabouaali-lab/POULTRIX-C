"use client";

import { COLORS } from "@/constants";
import { Cpu, BarChart3, TrendingUp, ShieldCheck, DollarSign } from "lucide-react";

export default function OverviewPage() {
  const metrics = [
    { icon: BarChart3, label: "معدل النفوق", value: "2.3%", change: "-12%", color: COLORS.aqua },
    { icon: TrendingUp, label: "كفاءة العلف", value: "1.68", change: "-5%", color: COLORS.gold },
    { icon: ShieldCheck, label: "صحة القطيع", value: "96.4%", change: "+3%", color: COLORS.blue },
    { icon: DollarSign, label: "هامش الربح", value: "+34.2%", change: "+8%", color: COLORS.cream },
  ];

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(165deg, #C4893A 0%, #2D5541 30%, #F5EDE3 65%, #BF7A5A 100%)", backgroundAttachment: "fixed" }}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${COLORS.aqua}20` }}>
            <Cpu size={20} style={{ color: COLORS.aqua }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">نظرة عامة</h1>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>لوحة القيادة الرئيسية</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <div key={i} className="rounded-xl p-5" style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: `${m.color}15` }}>
                <m.icon size={18} style={{ color: m.color }} />
              </div>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{m.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{m.value}</p>
              <p className="text-xs font-medium mt-1" style={{ color: m.change.startsWith("-") ? COLORS.aqua : COLORS.gold }}>{m.change}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

