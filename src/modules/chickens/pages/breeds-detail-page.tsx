"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { COLORS } from "@/constants";
import {
  ArrowRight, ExternalLink, Egg, MapPin, Thermometer,
  Heart, FileText, Globe, Bird, Search, Clock,
} from "lucide-react";
import { Skeleton } from "@/components/lightswind/skeleton";

export default function BreedDetailPage() {
  const { id } = useParams();
  const [breed, setBreed] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [enrichState, setEnrichState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [enrichedContent, setEnrichedContent] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/breeds/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setBreed(d);
        setLoading(false);
        if (d?.nameEn) {
          setEnrichState("loading");
          fetch("/api/breeds/enrich", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nameEn: d.nameEn, nameAr: d.nameAr, sources: d.sources }),
          })
            .then((r) => r.json())
            .then((ed) => {
              if (ed.descriptionAr) {
                setEnrichedContent(ed);
                setEnrichState("success");
                if (ed.imageUrl && ed.imageUrl !== d.imageUrl) {
                  setBreed((prev: any) => prev ? { ...prev, imageUrl: ed.imageUrl } : prev);
                }
              } else {
                setEnrichState("error");
              }
            })
            .catch(() => setEnrichState("error"));
        }
      })
      .catch(() => setLoading(false));
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

      {/* ═══ Enrichment Loader ═══ */}
      {enrichState === "loading" && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl p-10 text-center"
          style={{
            background: "linear-gradient(135deg, #f8f8fa 0%, #f0f0f2 100%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 3px rgba(0,0,0,0.03)",
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center"
            style={{ background: `${COLORS.aqua}15` }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            >
              <Search size={28} style={{ color: COLORS.aqua }} />
            </motion.div>
          </motion.div>

          <h3
            className="text-xl font-bold font-heading mb-2"
            style={{ color: "#1a1a24" }}
          >
            {breed.nameAr || "جاري البحث"}
          </h3>

          <motion.div
            className="h-1 w-24 mx-auto rounded-full mb-4"
            style={{ background: `linear-gradient(90deg, ${COLORS.aqua}, ${COLORS.gold})` }}
          />

          <motion.p
            className="text-sm font-medium"
            style={{ color: "#5a6a5a" }}
          >
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              يقوم الذكاء الاصطناعي بجلب معلومات شاملة عن السلالة من المصادر العالمية
            </motion.span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex items-center justify-center gap-1.5 mt-5"
            style={{ color: "#a0a0aa" }}
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: COLORS.aqua }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0 }}
            />
            <motion.span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: COLORS.aqua }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            />
            <motion.span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: COLORS.aqua }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
            />
          </motion.div>
        </motion.div>
      )}

      {/* ═══ Enriched / Original Description ═══ */}
      <AnimatePresence mode="wait">
        {(enrichState === "success" && enrichedContent) ? (
          <motion.div
            key="enriched"
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl overflow-hidden"
            style={{ background: "#fff", boxShadow: "0 0 0 1px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.04)" }}
          >
            {/* Description section */}
            <div className="p-7">
              <div className="flex items-center justify-between mb-4">
                <h2
                  className="text-base font-bold font-heading flex items-center gap-2.5"
                  style={{ color: "#1a1a24" }}
                >
                  <span
                    className="w-2 h-2 rounded-full inline-block shrink-0"
                    style={{ background: COLORS.aqua }}
                  />
                  وصف السلالة
                </h2>
                <a
                  href={enrichedContent.sourceUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium transition-opacity hover:opacity-60"
                  style={{ color: COLORS.aqua, textDecoration: "none" }}
                >
                  <ExternalLink size={11} />
                  {enrichedContent.source || "مصدر"}
                </a>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.p
                  className="text-sm leading-[2]"
                  style={{ color: "#5a5a64" }}
                >
                  {enrichedContent.descriptionAr}
                </motion.p>
              </motion.div>
            </div>

            {/* Facts grid */}
            {enrichedContent.enrichedFields && Object.keys(enrichedContent.enrichedFields).length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.4 }}
                className="grid grid-cols-2 sm:grid-cols-3 gap-px"
                style={{ background: "#f0f0f2" }}
              >
                {Object.entries(enrichedContent.enrichedFields).map(
                  ([key, val], i) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.06, duration: 0.3 }}
                      className="p-4"
                      style={{ background: "#fff" }}
                    >
                      <span
                        className="text-[10px] font-medium uppercase tracking-wider block mb-1"
                        style={{ color: "#a0a0aa" }}
                      >
                        {key}
                      </span>
                      <span
                        className="text-sm font-semibold block"
                        style={{ color: "#1a1a24" }}
                      >
                        {String(val)}
                      </span>
                    </motion.div>
                  )
                )}
              </motion.div>
            )}
          </motion.div>
        ) : (breed.descriptionAr || breed.description) && enrichState !== "loading" ? (
          <motion.div
            key="original"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl p-6"
            style={{ background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: "#1a1a24" }}>
                <FileText size={16} style={{ color: COLORS.aqua }} />
                {lang === "ar" ? "وصف السلالة" : "Breed Description"}
              </h2>
              {breed.descriptionAr && breed.description && (
                <button
                  onClick={() => setLang(lang === "ar" ? "en" : "ar")}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.65rem] font-medium spring-transition hover:scale-105 active:scale-95"
                  style={{
                    background: lang === "ar" ? `${COLORS.aqua}12` : "#f0f0f0",
                    color: lang === "ar" ? COLORS.aqua : "#5A6A5A",
                    border: `1px solid ${lang === "ar" ? `${COLORS.aqua}30` : "#e0e0e0"}`,
                  }}
                >
                  <Globe size={11} />
                  {lang === "ar" ? "English" : "العربية"}
                </button>
              )}
            </div>
            <motion.p
              key={lang}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm leading-relaxed"
              style={{ color: "#5a5a64", lineHeight: 1.9 }}
            >
              {lang === "ar" ? (breed.descriptionAr || breed.description) : (breed.description || breed.descriptionAr)}
            </motion.p>
          </motion.div>
        ) : null}
      </AnimatePresence>

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
