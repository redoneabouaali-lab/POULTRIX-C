"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { COLORS } from "@/constants";

export default function BreedsPage() {
  const [breeds, setBreeds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/breeds").then(r => r.json()).then(d => { setBreeds(d); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const filtered = breeds.filter(b =>
    (b.nameAr || "").includes(search) || (b.nameEn || "").toLowerCase().includes(search.toLowerCase()) || (b.originAr || "").includes(search)
  );

  // Staggered entrance for card grid
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.96 },
    visible: {
      opacity: 1, y: 0, scale: 1,
      transition: { type: "spring" as const, stiffness: 90, damping: 18, mass: 0.9 },
    },
  };

  return (
    <div dir="rtl" className="space-y-8">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl font-bold font-heading"
            style={{ color: COLORS.blue, margin: 0 }}
          >
            سلالات الدجاج
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-sm mt-1"
            style={{ color: "#5A6A5A" }}
          >
            {loading
              ? "جاري التحميل..."
              : search
                ? `${filtered.length} من أصل ${breeds.length} سلالة`
                : `${breeds.length} سلالة مختلفة`
            }
          </motion.p>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="relative"
        >
          <Search
            size={16}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-300"
            style={{ color: search ? COLORS.aqua : "#a0a0aa" }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="بحث عن سلالة..."
            className="pr-10 pl-4 py-2.5 rounded-xl text-sm transition-all duration-300 outline-none"
            style={{
              border: `1px solid ${search ? COLORS.aqua : "#e5e7eb"}`,
              background: "#fff",
              color: "#1a1a24",
              width: "240px",
              boxShadow: search ? `0 0 0 3px ${COLORS.aqua}15` : "none",
            }}
          />
        </motion.div>
      </div>

      {/* ─── Loading Skeleton ─── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden"
              style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
            >
              <div className="h-44 shimmer-bg" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 rounded-md shimmer-bg" />
                <div className="h-3 w-1/2 rounded-md shimmer-bg" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ─── Card Grid ─── */
        <motion.div
          key={search}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {filtered.map((breed) => (
            <motion.a
              key={breed.id}
              href={`/dashboard/breeds/${breed.id}`}
              variants={cardVariants}
              className="block group"
              style={{ textDecoration: "none" }}
            >
              <div
                className="rounded-2xl overflow-hidden transition-all duration-500 ease-out relative will-change-transform"
                style={{
                  background: "#fff",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.02)",
                }}
              >
                {/* ── Image ── */}
                <div className="relative h-44 overflow-hidden bg-[#f8f8fa]">
                  {/* Gradient overlay — appears on hover */}
                  <div
                    className="absolute inset-0 z-10 transition-opacity duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"
                    style={{
                      background: `linear-gradient(180deg, transparent 40%, ${COLORS.blue}08 100%)`,
                    }}
                  />

                  {/* Image container with scale on hover */}
                  <div className="w-full h-full flex items-center justify-center p-5 transition-transform duration-500 ease-out group-hover:scale-105">
                    <img
                      src={breed.imageUrl || "/fallback-chicken.svg"}
                      alt={breed.nameAr}
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/fallback-chicken.svg";
                      }}
                    />
                  </div>

                  {/* Egg count badge */}
                  {breed.eggNumber && (
                    <div className="absolute top-3 left-3 z-20">
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold tabular-nums backdrop-blur-sm"
                        style={{
                          background: `${COLORS.blue}14`,
                          color: COLORS.blue,
                          border: `1px solid ${COLORS.blue}18`,
                        }}
                      >
                        {breed.eggNumber}/سنة
                      </span>
                    </div>
                  )}
                </div>

                {/* ── Body ── */}
                <div className="p-4 space-y-2.5">
                  {/* Name + English name */}
                  <div className="flex items-center justify-between">
                    <span
                      className="font-bold text-sm transition-colors duration-300 group-hover:text-[#1a1a24]"
                      style={{ color: "#1a1a24" }}
                    >
                      {breed.nameAr}
                    </span>
                    {breed.nameEn && (
                      <span
                        className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ background: `${COLORS.cream}`, color: COLORS.blue }}
                      >
                        {breed.nameEn}
                      </span>
                    )}
                  </div>

                  {/* Origin + Egg Color */}
                  <div className="flex items-center gap-2 text-xs" style={{ color: "#5A6A5A" }}>
                    <span className="inline-flex items-center gap-1">
                      {breed.originAr || "غير معروف"}
                    </span>
                    <span style={{ color: "#d0d0d8" }}>|</span>
                    <span>{breed.eggColorAr || "—"}</span>
                  </div>

                  {/* Pills: Size + Temperament */}
                  <div className="flex items-center gap-2 pt-1">
                    {breed.eggSizeAr && (
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium"
                        style={{ background: `${COLORS.gold}12`, color: COLORS.gold }}
                      >
                        {breed.eggSizeAr}
                      </span>
                    )}
                    {breed.temperamentAr && (
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium"
                        style={{ background: `${COLORS.aqua}10`, color: COLORS.aqua }}
                      >
                        {breed.temperamentAr}
                      </span>
                    )}
                  </div>
                </div>

                {/* ── Hover glow border ── */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
                  style={{
                    boxShadow: `0 0 0 1px ${COLORS.aqua}18, 0 8px 32px ${COLORS.aqua}08`,
                  }}
                />
              </div>
            </motion.a>
          ))}
        </motion.div>
      )}

      {/* ─── Empty state ─── */}
      {!loading && filtered.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <p className="text-sm" style={{ color: "#a0a0aa" }}>
            لا توجد سلالات تطابق بحث &quot;{search}&quot;
          </p>
        </motion.div>
      )}
    </div>
  );
}
