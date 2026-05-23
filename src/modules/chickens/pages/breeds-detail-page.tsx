"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import { COLORS } from "@/constants";
import {
  ArrowRight, ExternalLink, Egg, MapPin, Thermometer,
  Heart, FileText, Globe, Bird,
} from "lucide-react";

export default function BreedDetailPage() {
  const { id } = useParams();
  const [breed, setBreed] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/breeds/${id}`).then(r => r.json()).then(d => { setBreed(d); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  /* ─── Loading Skeleton ─── */
  if (loading) return (
    <div dir="rtl" className="space-y-6">
      <div className="h-4 w-32 rounded-lg shimmer-bg" />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 rounded-2xl overflow-hidden">
          <div className="h-[350px] lg:h-[420px] shimmer-bg" />
        </div>
        <div className="lg:col-span-3 space-y-4">
          <div className="h-8 w-3/4 rounded-lg shimmer-bg" />
          <div className="h-4 w-1/2 rounded-lg shimmer-bg" />
          <div className="grid grid-cols-2 gap-3 mt-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 rounded-2xl shimmer-bg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  /* ─── Not Found ─── */
  if (!breed) return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      dir="rtl"
      className="flex items-center gap-2 justify-center py-20"
      style={{ color: "#5A6A5A" }}
    >
      <FileText size={18} />
      <span className="text-sm">لم يتم العثور على السلالة</span>
    </motion.div>
  );

  /* ─── Max egg number for progress bar scaling ─── */
  const MAX_EGGS = 350;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      dir="rtl"
      className="space-y-6"
    >
      {/* ═══ Back Button ═══ */}
      <motion.a
        href="/dashboard/breeds"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="inline-flex items-center gap-1.5 text-sm font-medium transition-all duration-300 group"
        style={{ color: COLORS.aqua, textDecoration: "none" }}
      >
        <ArrowRight
          size={14}
          className="transition-transform duration-300 group-hover:-translate-x-0.5"
        />
        <span className="border-b border-dotted border-transparent group-hover:border-current transition-all duration-300">
          العودة إلى السلالات
        </span>
      </motion.a>

      {/* ═══ Main Grid ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* ─── Left: Image ─── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 80, damping: 20 }}
          className="lg:col-span-2"
        >
          <div
            className="relative group rounded-2xl overflow-hidden"
            style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
          >
            {/* Image area */}
            <div
              className="relative h-[350px] lg:h-[420px] flex items-center justify-center p-8"
              style={{
                background: "linear-gradient(135deg, #f8f8fa 0%, #f0f0f2 100%)",
              }}
            >
              <img
                src={breed.imageUrl || "/fallback-chicken.svg"}
                alt={breed.nameAr}
                referrerPolicy="no-referrer"
                className="max-h-full max-w-full object-contain transition-all duration-700 ease-out group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/fallback-chicken.svg";
                }}
              />

              {/* Decorative corner accents */}
              <div
                className="absolute top-4 right-4 w-14 h-14 border-t-2 border-r-2 rounded-tr-2xl opacity-30 transition-opacity duration-500 group-hover:opacity-60"
                style={{ borderColor: COLORS.aqua }}
              />
              <div
                className="absolute bottom-4 left-4 w-14 h-14 border-b-2 border-l-2 rounded-bl-2xl opacity-30 transition-opacity duration-500 group-hover:opacity-60"
                style={{ borderColor: COLORS.aqua }}
              />
            </div>
          </div>
        </motion.div>

        {/* ─── Right: Info ─── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 80, damping: 20 }}
          className="lg:col-span-3 space-y-4"
        >
          {/* ── Name + Origin Header ── */}
          <div
            className="rounded-2xl p-5"
            style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
          >
            <div className="flex items-start justify-between mb-2">
              <h1
                className="text-2xl font-bold font-heading"
                style={{ color: "#1a1a24", margin: 0 }}
              >
                {breed.nameAr}
              </h1>
              {breed.nameEn && (
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0"
                  style={{ background: COLORS.cream, color: COLORS.blue }}
                >
                  {breed.nameEn}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: "#5A6A5A" }}>
              <MapPin size={15} style={{ color: COLORS.aqua }} />
              <span>{breed.originAr || "غير معروف"}</span>
            </div>
          </div>

          {/* ── Stats Grid ── */}
          <div className="grid grid-cols-2 gap-3">
            {/* Egg Color */}
            <div
              className="rounded-2xl p-4 transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: `${COLORS.aqua}12` }}
                >
                  <Egg size={15} style={{ color: COLORS.aqua }} />
                </div>
                <span className="text-xs font-medium" style={{ color: "#5A6A5A" }}>لون البيض</span>
              </div>
              <span className="text-sm font-semibold" style={{ color: "#1a1a24" }}>
                {breed.eggColorAr || "—"}
              </span>
            </div>

            {/* Egg Size */}
            <div
              className="rounded-2xl p-4 transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: `${COLORS.gold}12` }}
                >
                  <Thermometer size={15} style={{ color: COLORS.gold }} />
                </div>
                <span className="text-xs font-medium" style={{ color: "#5A6A5A" }}>حجم البيض</span>
              </div>
              <span className="text-sm font-semibold" style={{ color: "#1a1a24" }}>
                {breed.eggSizeAr || "—"}
              </span>
            </div>

            {/* Temperament */}
            <div
              className="rounded-2xl p-4 transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: `${COLORS.blue}12` }}
                >
                  <Heart size={15} style={{ color: COLORS.blue }} />
                </div>
                <span className="text-xs font-medium" style={{ color: "#5A6A5A" }}>الطباع</span>
              </div>
              <span className="text-sm font-semibold" style={{ color: "#1a1a24" }}>
                {breed.temperamentAr || "—"}
              </span>
            </div>

            {/* Annual Egg Count */}
            <div
              className="rounded-2xl p-4 transition-all duration-300 hover:-translate-y-0.5"
              style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: `${COLORS.aqua}12` }}
                >
                  <Bird size={15} style={{ color: COLORS.aqua }} />
                </div>
                <span className="text-xs font-medium" style={{ color: "#5A6A5A" }}>البيض سنوياً</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span
                  className="text-lg font-bold tabular-nums font-metric"
                  style={{ color: COLORS.blue }}
                >
                  {breed.eggNumber || "—"}
                </span>
                {breed.eggNumber && (
                  <span className="text-xs" style={{ color: "#5A6A5A" }}>بيضة</span>
                )}
              </div>
              {/* Animated progress bar */}
              {breed.eggNumber && (
                <div className="mt-2.5 h-1.5 rounded-full overflow-hidden" style={{ background: "#f0f0f2" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((breed.eggNumber / MAX_EGGS) * 100, 100)}%` }}
                    transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${COLORS.blue}, ${COLORS.blue}bb)`,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ═══ Description ═══ */}
      {(breed.descriptionAr || breed.description) && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl p-6"
          style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
        >
          <h2
            className="text-sm font-semibold mb-3 flex items-center gap-2"
            style={{ color: "#1a1a24" }}
          >
            <FileText size={16} style={{ color: COLORS.aqua }} />
            وصف السلالة
          </h2>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "#5a5a64", lineHeight: 1.9 }}
          >
            {breed.descriptionAr || breed.description}
          </p>
        </motion.div>
      )}

      {/* ═══ Sources ═══ */}
      {breed.sources && breed.sources.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl p-5"
          style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
        >
          <h3
            className="text-sm font-semibold mb-3 flex items-center gap-2"
            style={{ color: "#1a1a24" }}
          >
            <Globe size={15} style={{ color: COLORS.aqua }} />
            المصادر
          </h3>
          <div className="space-y-1.5">
            {breed.sources.map((src: string, i: number) => (
              <a
                key={i}
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs transition-all duration-200 group"
                style={{ color: COLORS.aqua, textDecoration: "none" }}
              >
                <ExternalLink
                  size={11}
                  className="shrink-0 transition-transform duration-200 group-hover:rotate-12"
                />
                <span
                  className="border-b border-dotted border-transparent group-hover:border-current transition-all duration-200 truncate max-w-[400px]"
                >
                  {src}
                </span>
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
