"use client";

import { motion } from "framer-motion";
import { Cpu, Bird, Shield, TrendingUp, Database, Cloud, Smartphone, BarChart3 } from "lucide-react";
import { SlidingLogoMarquee } from "@/components/lightswind/sliding-logo-marquee";
import { COLORS } from "@/constants";

const brandItems = [
  { id: "1", content: <BrandItem Icon={Cpu} label="ذكاء اصطناعي" color={COLORS.aqua} /> },
  { id: "2", content: <BrandItem Icon={Bird} label="دواجن" color={COLORS.blue} /> },
  { id: "3", content: <BrandItem Icon={Shield} label="مراقبة" color={COLORS.gold} /> },
  { id: "4", content: <BrandItem Icon={TrendingUp} label="أرباح" color={COLORS.blue} /> },
  { id: "5", content: <BrandItem Icon={Database} label="بيانات" color={COLORS.gold} /> },
  { id: "6", content: <BrandItem Icon={Cloud} label="سحابة" color={COLORS.aqua} /> },
  { id: "7", content: <BrandItem Icon={Smartphone} label="تطبيق" color={COLORS.aqua} /> },
  { id: "8", content: <BrandItem Icon={BarChart3} label="تحليلات" color={COLORS.blue} /> },
];

function BrandItem({ Icon, label, color }: { Icon: any; label: string; color: string }) {
  return (
    <div className="flex items-center gap-3 px-6 py-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <span className="text-sm font-semibold" style={{ color: "#1E2B22" }}>{label}</span>
    </div>
  );
}

export default function BrandTrustSection() {
  return (
    <section dir="rtl" className="py-10 md:py-14" style={{ background: "#FAF7F2", borderTop: "1px solid rgba(0,0,0,0.04)", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1320px] mx-auto px-4 md:px-6"
      >
        <div className="text-center mb-6">
          <span className="text-xs font-bold tracking-[0.15em]" style={{ color: "#7A8A7A" }}>تقنيات المنصة</span>
        </div>
        <SlidingLogoMarquee
          items={brandItems}
          speed={30}
          pauseOnHover={true}
          gap="1rem"
          height="70px"
          showControls={false}
          backgroundColor="!transparent"
        />
      </motion.div>
    </section>
  );
}