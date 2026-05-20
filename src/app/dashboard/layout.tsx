"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useAuth, UserButton } from "@clerk/nextjs";
import { COLORS } from "@/constants";
import ChatButton from "@/modules/ai/components/chat-button";
import { AIParticleField } from "@/components/ui/ai-effects";
import { LayoutDashboard, Bird, Egg, Beef, Wheat, Brain, Settings, Bell, DollarSign, TrendingUp, Cpu, BookOpen, Stethoscope, ChevronLeft, Menu } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "لوحة القيادة", href: "/dashboard" },
  { icon: Bird, label: "الدجاج", href: "/dashboard/chickens" },
  { icon: Egg, label: "البيض", href: "/dashboard/eggs" },
  { icon: Beef, label: "اللحم", href: "/dashboard/meat" },
  { icon: BookOpen, label: "سلالات الدجاج", href: "/dashboard/breeds" },
  { icon: BookOpen, label: "المقالات", href: "/dashboard/articles" },
  { icon: Wheat, label: "العلف", href: "/dashboard/feed" },
  { icon: Stethoscope, label: "AI البيطري", href: "/dashboard/ai-vet" },
  { icon: Brain, label: "التحليلات", href: "/dashboard/analytics" },
  { icon: DollarSign, label: "المالية", href: "/dashboard/finance" },
  { icon: Bell, label: "التنبيهات", href: "/dashboard/notifications" },
  { icon: TrendingUp, label: "التقارير", href: "/dashboard/reports" },
  { icon: Settings, label: "الإعدادات", href: "/dashboard/settings" },
];

function NavItem({ item, active, index }: { item: typeof navItems[0]; active: boolean; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.02, ease: [0.16, 1, 0.3, 1] }}
      style={{ padding: "0 10px", marginBottom: "1px" }}
    >
      <a
        href={item.href}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px",
          borderRadius: "8px", textDecoration: "none", fontSize: "0.8rem",
          fontWeight: active ? "600" : "400",
          position: "relative", overflow: "hidden",
          color: active ? "#fff" : hovered ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.4)",
          transition: "color 0.2s ease, background 0.2s ease",
          background: active ? "linear-gradient(135deg, rgba(196,137,58,0.1), rgba(45,85,65,0.05))" : hovered ? "rgba(255,255,255,0.04)" : "transparent",
        }}
      >
        {active && (
          <motion.div
            layoutId="sidebar-active"
            style={{
              position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
              width: "3px", height: "20px", borderRadius: "3px",
              background: `linear-gradient(180deg, ${COLORS.aqua}, ${COLORS.blue})`,
              boxShadow: `0 0 8px ${COLORS.aqua}40`,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        <item.icon size={16} style={{ color: active ? COLORS.aqua : hovered ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.2)", transition: "color 0.2s" }} />
        <span>{item.label}</span>
      </a>
    </motion.div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => { if (isLoaded && !isSignedIn) router.push("/login"); }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center" style={{ background: "#0a0a10" }}>
        <div className="flex gap-3">
          {[COLORS.aqua, COLORS.blue, COLORS.gold].map((c, i) => (
            <motion.span
              key={i}
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: c }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f5f5f7", minHeight: "100dvh" }}>
      <div style={{ display: "flex" }}>
        {/* Sidebar */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: "260px", minHeight: "100dvh",
            display: "flex", flexDirection: "column", flexShrink: 0,
            background: "linear-gradient(180deg, #15151f 0%, #1a1a28 100%)",
            borderRight: "1px solid rgba(255,255,255,0.04)",
            boxShadow: "4px 0 24px rgba(0,0,0,0.08)",
          }}
        >
          {/* Logo */}
          <div style={{ padding: "20px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <a href="/dashboard" className="flex items-center gap-3" style={{ textDecoration: "none" }}>
              <motion.div
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                style={{
                  width: "34px", height: "34px", borderRadius: "10px",
                  background: `linear-gradient(135deg, ${COLORS.aqua}, ${COLORS.blue})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: `0 2px 12px ${COLORS.aqua}30`,
                }}
              >
                <Cpu size={16} style={{ color: "#000" }} />
              </motion.div>
              <div>
                <span className="font-brand" style={{ fontSize: "1.05rem", color: "#fff", letterSpacing: "-0.03em" }}>POULTRIX</span>
                <p style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.2)", margin: 0, letterSpacing: "0.05em" }}>ذكاء الدواجن</p>
              </div>
            </a>
          </div>

          {/* Navigation */}
          <nav style={{ flex: 1, padding: "10px 0", overflowY: "auto" }}>
            <p style={{ padding: "8px 20px 6px", fontSize: "0.6rem", color: "rgba(255,255,255,0.15)", textTransform: "uppercase", letterSpacing: "0.12em" }}>الرئيسية</p>
            {navItems.slice(0, 5).map((item, i) => (
              <NavItem key={item.href} item={item} active={path === item.href} index={i} />
            ))}
            <p style={{ padding: "14px 20px 6px", fontSize: "0.6rem", color: "rgba(255,255,255,0.15)", textTransform: "uppercase", letterSpacing: "0.12em" }}>البيانات</p>
            {navItems.slice(5).map((item, i) => (
              <NavItem key={item.href} item={item} active={path === item.href} index={i + 5} />
            ))}
          </nav>

          {/* Profile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ padding: "14px", borderTop: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.02)" }}
          >
            <div className="flex items-center gap-3">
              {/* @ts-ignore */}
              <UserButton />
              <div>
                <p style={{ fontSize: "0.8rem", fontWeight: "600", color: "#fff", margin: 0 }}>الحساب</p>
                <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", margin: "1px 0 0" }}>الإعدادات</p>
              </div>
            </div>
          </motion.div>
        </motion.aside>

        {/* Main */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <AIParticleField className="opacity-[0.02]" />
          <motion.nav
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              padding: "0 24px", height: "56px", display: "flex", alignItems: "center",
              justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40,
              background: "rgba(245,245,247,0.8)", backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(0,0,0,0.04)",
            }}
          >
            <div className="flex items-center gap-3">
              <Menu size={16} style={{ color: "#5A6A5A", cursor: "pointer" }} />
              <span className="font-brand" style={{ fontSize: "0.85rem", color: "#1a1a24" }}>POULTRIX</span>
            </div>
            <div className="flex items-center gap-3">
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ width: 5, height: 5, borderRadius: "50%", background: "#34c759" }}
              />
              <span style={{ fontSize: "0.75rem", color: "#5A6A5A" }}>{new Date().toLocaleDateString("ar-MA", { weekday: "long", month: "long", day: "numeric" })}</span>
            </div>
          </motion.nav>

          <div style={{ padding: "24px", flex: 1 }}>
            <ChatButton />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
