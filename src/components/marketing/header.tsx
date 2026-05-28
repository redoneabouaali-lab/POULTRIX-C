"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COLORS } from "@/constants";
import { Cpu, Menu, X, Instagram, Facebook } from "lucide-react";
import Link from "next/link";

const navItems = [
  { label: "خدماتنا", href: "#services" },
  { label: "منتوجاتنا", href: "#products" },
  { label: "عن المنصة", href: "#about" },
  { label: "المدونة", href: "/dashboard/articles" },
  { label: "اتصل بنا", href: "#contact" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-500"
      style={{ background: scrolled ? "rgba(245,237,227,0.85)" : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none" }}
      dir="rtl"
    >
      <div className="mx-auto max-w-[1320px] px-4 md:px-6 pt-4">
        <nav className="glass-light rounded-full px-5 py-2.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 spring-hover">
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: `linear-gradient(135deg, ${COLORS.aqua}, ${COLORS.blue})`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Cpu size={14} style={{ color: "#000" }} />
            </div>
            <span className="text-base font-brand" style={{ color: "#1E2B22", letterSpacing: "-0.02em" }}>POULTRIX</span>
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-3.5 py-2 rounded-full text-sm font-medium spring-hover"
                style={{ color: "#5A6A5A" }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1">
              <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center spring-hover" style={{ color: "#7A8A7A" }}>
                <Instagram size={15} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center spring-hover" style={{ color: "#7A8A7A" }}>
                <Facebook size={15} />
              </a>
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden w-9 h-9 rounded-full flex items-center justify-center spring-hover"
              style={{ color: "#1E2B22" }}
              aria-label={isOpen ? "إغلاق القائمة" : "فتح القائمة"}
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden mx-4 mt-2 glass-card rounded-2xl p-3"
          >
            <div className="flex flex-col gap-0.5">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 rounded-xl text-sm font-medium spring-hover"
                    style={{ color: "#1E2B22" }}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
