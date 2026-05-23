"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ExternalLink, Clock, Sparkles, ArrowLeft } from "lucide-react";
import { articles, categories } from "@/modules/chickens/data/articles";
import { COLORS } from "@/constants";
import { cn } from "@/lib/utils";

/* ── Category colour palette ── */
const categoryColors: Record<string, { bg: string; text: string; ring: string; dot: string }> = {
  تربية: { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-300", ring: "ring-emerald-500/20", dot: "bg-emerald-500" },
  بيض:   { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-700 dark:text-amber-300", ring: "ring-amber-500/20", dot: "bg-amber-500" },
  تغذية: { bg: "bg-blue-50 dark:bg-blue-950/30", text: "text-blue-700 dark:text-blue-300", ring: "ring-blue-500/20", dot: "bg-blue-500" },
  صحة:   { bg: "bg-rose-50 dark:bg-rose-950/30", text: "text-rose-700 dark:text-rose-300", ring: "ring-rose-500/20", dot: "bg-rose-500" },
  لحم:   { bg: "bg-purple-50 dark:bg-purple-950/30", text: "text-purple-700 dark:text-purple-300", ring: "ring-purple-500/20", dot: "bg-purple-500" },
  إدارة: { bg: "bg-sky-50 dark:bg-sky-950/30", text: "text-sky-700 dark:text-sky-300", ring: "ring-sky-500/20", dot: "bg-sky-500" },
};

/* ── Motion variants ── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
} as const;

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.96, filter: "blur(2px)" },
  visible: {
    opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
    transition: { type: "spring" as const, damping: 28, stiffness: 190, mass: 0.75 },
  },
};

const factVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

export default function ArticlesPage() {
  const [filter, setFilter] = useState("");
  const [facts, setFacts] = useState<any[]>([]);
  const [factsLoading, setFactsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/facts")
      .then(r => r.json())
      .then(d => { setFacts(Array.isArray(d) ? d : []); setFactsLoading(false); })
      .catch(() => setFactsLoading(false));
  }, []);

  const filtered = filter ? articles.filter(a => a.category === filter) : articles;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10 rtl" dir="rtl">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3 flex-wrap">
          <h1
            className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
            style={{ color: COLORS.blue }}
          >
            المقالات
          </h1>
          <span
            className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: `${COLORS.blue}12`,
              color: COLORS.blue,
            }}
          >
            {articles.length} مقالة
          </span>
        </div>
        <p className="text-base md:text-lg leading-relaxed text-gray-500 dark:text-gray-400 max-w-2xl">
          كل ما تحتاج معرفته عن تربية الدجاج ورعايته — من اختيار السلالة إلى العناية الصحية والتغذية المثلى
        </p>
      </motion.div>

      {/* ── Category filters as premium pills ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-wrap gap-2.5"
      >
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setFilter("")}
          className={cn(
            "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
            "ring-1 ring-inset cursor-pointer",
            !filter
              ? "text-white shadow-md"
              : "bg-white dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 ring-gray-200 dark:ring-gray-700 hover:ring-gray-300 dark:hover:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-750"
          )}
          style={!filter ? {
            backgroundColor: COLORS.blue,
            boxShadow: `0 4px 14px ${COLORS.blue}33`,
          } : undefined}
        >
          الكل
        </motion.button>
        {categories.map((cat) => {
          const cc = categoryColors[cat] || { bg: "bg-gray-50", text: "text-gray-700", ring: "ring-gray-300", dot: "bg-gray-400" };
          return (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer",
                "ring-1 ring-inset",
                filter === cat
                  ? cn(cc.bg, cc.text, "ring-2 shadow-md")
                  : "bg-white dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 ring-gray-200 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
              )}
              style={filter === cat ? {
                boxShadow: `0 4px 14px ${COLORS.blue}1A`,
              } : undefined}
            >
              {cat}
            </motion.button>
          );
        })}
      </motion.div>

      {/* ── Article grid ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {filtered.map((article) => {
          const cc = categoryColors[article.category] || { bg: "bg-gray-50", text: "text-gray-700", ring: "ring-gray-300", dot: "bg-gray-400" };
          return (
            <motion.a
              key={article.id}
              variants={cardVariants}
              href={`/dashboard/articles/${article.id}`}
              className="block group"
            >
              <div
                className={cn(
                  "relative h-full rounded-2xl p-6 transition-all duration-500",
                  "bg-white dark:bg-gray-800/90",
                  "border border-gray-100/80 dark:border-gray-700/40",
                  "shadow-[0_2px_12px_rgba(0,0,0,0.04)]",
                  "hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)]",
                  "hover:-translate-y-1.5"
                )}
              >
                {/* Subtle hover gradient wash */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, ${COLORS.blue}08, transparent 60%)`,
                  }}
                />

                <div className="relative z-10 space-y-4">
                  {/* ── Category pill + read time ── */}
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.7rem] font-semibold tracking-wide",
                      cc.bg, cc.text, "ring-1", cc.ring
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", cc.dot)} />
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-[0.7rem] text-gray-400 dark:text-gray-500">
                      <Clock size={12} />
                      {article.readTime} دقائق
                    </span>
                  </div>

                  {/* ── Title ── */}
                  <h2
                    className="font-heading text-lg font-bold leading-snug transition-colors duration-300"
                    style={{ color: COLORS.blue }}
                  >
                    {article.title}
                  </h2>

                  {/* ── Excerpt ── */}
                  <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* ── Read more indicator (appears on hover) ── */}
                  <div className="flex items-center gap-1.5 text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] -translate-x-2 group-hover:translate-x-0" style={{ color: COLORS.blue }}>
                    اقرأ المقال
                    <ArrowLeft size={13} />
                  </div>
                </div>
              </div>
            </motion.a>
          );
        })}
      </motion.div>

      {/* ── Chicken Facts section ── */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.6 }}
        className="pt-8 mt-6"
        style={{ borderTop: `1px solid ${COLORS.blue}15` }}
      >
        {/* Section header */}
        <div className="flex items-center justify-between mb-7">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <Sparkles size={20} className="text-amber-500" />
              <h2
                className="font-heading text-2xl md:text-3xl font-bold tracking-tight"
                style={{ color: COLORS.blue }}
              >
                حقائق عن الدجاج
              </h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mr-8">
              حقائق مدهشة من مصادر علمية موثقة
            </p>
          </div>
          {!factsLoading && facts.length > 0 && (
            <span
              className="text-xs font-medium px-3.5 py-1.5 rounded-full"
              style={{
                backgroundColor: `${COLORS.blue}0D`,
                color: COLORS.blue,
              }}
            >
              {facts.length} حقيقة
            </span>
          )}
        </div>

        {/* Loading skeleton */}
        {factsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-2xl bg-gray-100 dark:bg-gray-800/60 animate-shimmer overflow-hidden"
                style={{
                  backgroundSize: "200% 100%",
                  backgroundImage: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)",
                }}
              />
            ))}
          </div>
        ) : facts.length === 0 ? null : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facts.slice(0, 10).map((fact, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={factVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                className={cn(
                  "group relative rounded-2xl p-5 transition-all duration-400",
                  "bg-white dark:bg-gray-800/90",
                  "border border-gray-100/80 dark:border-gray-700/40",
                  "hover:shadow-[0_8px_28px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_28px_rgba(0,0,0,0.2)]",
                  "hover:-translate-y-0.5"
                )}
              >
                {/* Number badge */}
                <div
                  className="absolute -top-3 -right-3 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md"
                  style={{ backgroundColor: COLORS.blue }}
                >
                  {i + 1}
                </div>

                <div className="space-y-3.5 pr-6">
                  {/* Pull-quote style text */}
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-200 font-medium">
                    &ldquo;{fact.text}&rdquo;
                  </p>

                  {/* Source + date row */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    {fact.date && (
                      <span className="text-[0.7rem] text-gray-400 dark:text-gray-500">
                        {fact.date}
                      </span>
                    )}
                    {fact.source && (
                      <a
                        href={fact.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[0.7rem] font-medium transition-colors duration-200 hover:underline"
                        style={{ color: COLORS.blue }}
                      >
                        <ExternalLink size={11} />
                        المصدر
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
    </div>
  );
}
