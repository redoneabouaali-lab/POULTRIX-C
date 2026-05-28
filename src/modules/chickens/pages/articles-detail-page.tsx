"use client";

import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Bookmark } from "lucide-react";
import { articles } from "@/modules/chickens/data/articles";
import { COLORS } from "@/constants";
import { cn } from "@/lib/utils";

/* ── Category colour palette (mirrors list page) ── */
const categoryColors: Record<string, { bg: string; text: string; ring: string; dot: string }> = {
  تربية: { bg: "bg-emerald-50 dark:bg-emerald-950/30", text: "text-emerald-700 dark:text-emerald-300", ring: "ring-emerald-500/20", dot: "bg-emerald-500" },
  بيض:   { bg: "bg-amber-50 dark:bg-amber-950/30", text: "text-amber-700 dark:text-amber-300", ring: "ring-amber-500/20", dot: "bg-amber-500" },
  تغذية: { bg: "bg-blue-50 dark:bg-blue-950/30", text: "text-blue-700 dark:text-blue-300", ring: "ring-blue-500/20", dot: "bg-blue-500" },
  صحة:   { bg: "bg-rose-50 dark:bg-rose-950/30", text: "text-rose-700 dark:text-rose-300", ring: "ring-rose-500/20", dot: "bg-rose-500" },
  لحم:   { bg: "bg-purple-50 dark:bg-purple-950/30", text: "text-purple-700 dark:text-purple-300", ring: "ring-purple-500/20", dot: "bg-purple-500" },
  إدارة: { bg: "bg-sky-50 dark:bg-sky-950/30", text: "text-sky-700 dark:text-sky-300", ring: "ring-sky-500/20", dot: "bg-sky-500" },
};

export default function ArticleDetailPage() {
  const { id } = useParams();
  const article = articles.find(a => a.id === Number(id));
  const related = articles.filter(a => a.category === article?.category && a.id !== article?.id).slice(0, 3);

  if (!article) return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24 text-center"
    >
      <span className="text-5xl mb-4">🐔</span>
      <p className="text-lg font-medium" style={{ color: COLORS.blue }}>المقال غير موجود</p>
      <a
        href="/dashboard/articles"
        className="inline-flex items-center gap-1.5 text-sm font-medium mt-4 transition-colors hover:underline"
        style={{ color: COLORS.blue }}
      >
        <ArrowRight size={14} />
        العودة إلى المقالات
      </a>
    </motion.div>
  );

  const cc = categoryColors[article.category] || { bg: "bg-gray-50", text: "text-gray-700", ring: "ring-gray-300", dot: "bg-gray-400" };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10 rtl" dir="rtl">
      {/* ── Back button ── */}
      <motion.div
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <a
          href="/dashboard/articles"
          className="group inline-flex items-center gap-2 text-sm font-medium transition-all duration-300 hover:gap-3"
          style={{ color: COLORS.blue }}
        >
          <motion.span
            className="inline-flex items-center justify-center w-7 h-7 rounded-full transition-colors duration-300"
            style={{ backgroundColor: `${COLORS.blue}12` }}
            whileHover={{ x: 3 }}
          >
            <ArrowRight size={14} />
          </motion.span>
          العودة إلى المقالات
        </a>
      </motion.div>

      {/* ── Article content card ── */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-2xl p-8 md:p-10 transition-shadow duration-400"
        style={{
          backgroundColor: 'var(--card-bg, #ffffff)',
          border: '1px solid var(--card-border, rgba(0,0,0,0.06))',
          boxShadow: '0 2px 16px rgba(0,0,0,0.04)',
        }}
      >
        {/* ── Header meta ── */}
        <div className="space-y-5 mb-8">
          {/* Category + read time row */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className={cn(
              "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold",
              cc.bg, cc.text, "ring-1", cc.ring
            )}>
              <span className={cn("w-1.5 h-1.5 rounded-full", cc.dot)} />
              {article.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
              <Clock size={14} />
              {article.readTime} دقائق قراءة
            </span>
          </div>

          {/* Title */}
          <h1
            className="font-heading text-2xl md:text-3xl lg:text-4xl font-bold leading-tight tracking-tight"
            style={{ color: COLORS.blue }}
          >
            {article.title}
          </h1>

          {/* subtle divider */}
          <div className="w-16 h-0.5 rounded-full" style={{ backgroundColor: `${COLORS.blue}25` }} />
        </div>

        {/* ── Article content ── */}
        <div
          className="article-content space-y-4 max-w-none"
          style={{ fontSize: "1.05rem", lineHeight: 2, color: "#4e5965" }}
        >
          {article.content.split("\n").map((line, i) => {
            if (line.startsWith("## ")) {
              return (
                <h2
                  key={i}
                  className="font-heading text-xl md:text-2xl font-bold leading-snug"
                  style={{ color: COLORS.blue, marginTop: "2rem", marginBottom: "0.75rem" }}
                >
                  {line.replace("## ", "")}
                </h2>
              );
            }
            if (line.startsWith("- ")) {
              return (
                <li
                  key={i}
                  className="mr-6 mb-2 list-disc marker:text-gray-300"
                  style={{ color: "#4e5965" }}
                >
                  {line.replace("- ", "")}
                </li>
              );
            }
            if (line.trim() === "") {
              return <div key={i} className="h-3" />;
            }
            return (
              <p key={i} className="leading-[2]">
                {line}
              </p>
            );
          })}
        </div>
      </motion.article>

      {/* ── Related articles ── */}
      {related.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2
            className="font-heading text-xl md:text-2xl font-bold tracking-tight mb-6"
            style={{ color: COLORS.blue }}
          >
            مقالات ذات صلة
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.map((r, idx) => {
              const rcc = categoryColors[r.category] || { bg: "bg-gray-50", text: "text-gray-700", ring: "ring-gray-300", dot: "bg-gray-400" };
              return (
                <motion.a
                  key={r.id}
                  href={`/dashboard/articles/${r.id}`}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="block group"
                >
                  <div
                    className={cn(
                      "relative rounded-xl p-5 transition-all duration-400 h-full",
                      "bg-white dark:bg-gray-800/90",
                      "border border-gray-100/80 dark:border-gray-700/40",
                      "hover:shadow-[0_8px_28px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_8px_28px_rgba(0,0,0,0.2)]",
                      "hover:-translate-y-1"
                    )}
                  >
                    {/* Hover accent */}
                    <div
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                      style={{
                        background: `linear-gradient(135deg, ${COLORS.blue}06, transparent 60%)`,
                      }}
                    />

                    <div className="relative z-10 space-y-3">
                      {/* Category pill */}
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.65rem] font-semibold",
                        rcc.bg, rcc.text, "ring-1", rcc.ring
                      )}>
                        <span className={cn("w-1 h-1 rounded-full", rcc.dot)} />
                        {r.category}
                      </span>

                      {/* Title */}
                      <h3
                        className="font-heading text-sm font-bold leading-snug transition-colors duration-200"
                        style={{ color: COLORS.blue }}
                      >
                        {r.title}
                      </h3>

                      {/* Read time mini */}
                      <span className="flex items-center gap-1 text-[0.65rem] text-gray-400 dark:text-gray-500">
                        <Clock size={11} />
                        {r.readTime} دقائق
                      </span>
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </motion.section>
      )}
    </div>
  );
}
