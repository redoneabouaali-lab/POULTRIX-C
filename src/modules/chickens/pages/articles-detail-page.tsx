"use client";

import { useParams } from "next/navigation";
import { ArrowRight, Clock, Bookmark } from "lucide-react";
import { articles } from "@/modules/chickens/data/articles";

export default function ArticleDetailPage() {
  const { id } = useParams();
  const article = articles.find(a => a.id === Number(id));
  const related = articles.filter(a => a.category === article?.category && a.id !== article?.id).slice(0, 3);

  if (!article) return <div style={{ padding: "40px", textAlign: "center", color: "#ff3e1d" }}>المقال غير موجود</div>;

  return (
    <div>
      <a href="/dashboard/articles" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.85rem", color: "#696cff", textDecoration: "none", marginBottom: "20px" }}>
        <ArrowRight size={14} /> العودة إلى المقالات
      </a>

      <article style={{ background: "#fff", borderRadius: "10px", padding: "32px", boxShadow: "0 2px 6px rgba(0,0,0,0.04)", marginBottom: "24px" }}>
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: "600", padding: "4px 12px", borderRadius: "6px", background: "#e8eaf6", color: "#696cff" }}>{article.category}</span>
            <span style={{ fontSize: "0.8rem", color: "#91979f", display: "flex", alignItems: "center", gap: "4px" }}><Clock size={14} /> {article.readTime} دقائق قراءة</span>
          </div>
          <h1 className="font-heading" style={{ fontSize: "1.6rem", color: "#384551", margin: 0, lineHeight: 1.3 }}>{article.title}</h1>
        </div>

        <div style={{ fontSize: "0.95rem", color: "#4e5965", lineHeight: 1.9, maxWidth: "720px" }}>
          {article.content.split("\n").map((line, i) => {
            if (line.startsWith("## ")) return <h2 key={i} className="font-subhead" style={{ fontSize: "1.2rem", color: "#384551", marginTop: "28px", marginBottom: "12px" }}>{line.replace("## ", "")}</h2>;
            if (line.startsWith("- ")) return <li key={i} style={{ marginBottom: "4px", color: "#4e5965" }}>{line.replace("- ", "")}</li>;
            if (line.trim() === "") return <br key={i} />;
            return <p key={i} style={{ marginBottom: "8px", color: "#4e5965" }}>{line}</p>;
          })}
        </div>
      </article>

      {/* Related articles */}
      {related.length > 0 && (
        <div>
          <h2 className="font-subhead" style={{ fontSize: "1.1rem", color: "#384551", marginBottom: "12px" }}>مقالات ذات صلة</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {related.map((r) => (
              <a key={r.id} href={`/dashboard/articles/${r.id}`} style={{ textDecoration: "none" }}>
                <div style={{ background: "#fff", borderRadius: "10px", padding: "16px", boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: "600", padding: "2px 8px", borderRadius: "4px", background: "#e8eaf6", color: "#696cff" }}>{r.category}</span>
                  <h3 style={{ fontSize: "0.85rem", fontWeight: "600", color: "#384551", margin: "8px 0 0", lineHeight: 1.4 }}>{r.title}</h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
