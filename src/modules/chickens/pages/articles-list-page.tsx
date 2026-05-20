"use client";

import { useState } from "react";
import { articles, categories } from "@/modules/chickens/data/articles";

export default function ArticlesPage() {
  const [filter, setFilter] = useState("");

  const filtered = filter ? articles.filter(a => a.category === filter) : articles;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <h1 className="font-heading" style={{ fontSize: "1.5rem", color: "#384551", margin: 0 }}>المقالات</h1>
          <p style={{ fontSize: "0.9rem", color: "#7a838b", margin: "4px 0 0" }}>{articles.length} مقالة عن تربية الدجاج</p>
        </div>
      </div>

      {/* Category filters */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        <button onClick={() => setFilter("")} style={{
          padding: "6px 16px", borderRadius: "20px", border: "none", fontSize: "0.8rem", fontWeight: "600",
          background: !filter ? "#696cff" : "#f0f1f2", color: !filter ? "#fff" : "#7a838b", cursor: "pointer", transition: "all 0.2s",
        }}>الكل</button>
        {categories.map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)} style={{
            padding: "6px 16px", borderRadius: "20px", border: "none", fontSize: "0.8rem", fontWeight: "600",
            background: filter === cat ? "#696cff" : "#f0f1f2", color: filter === cat ? "#fff" : "#7a838b", cursor: "pointer", transition: "all 0.2s",
          }}>{cat}</button>
        ))}
      </div>

      {/* Article grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
        {filtered.map((article) => (
          <a key={article.id} href={`/dashboard/articles/${article.id}`} style={{ textDecoration: "none" }}>
            <div style={{ background: "#fff", borderRadius: "10px", padding: "20px", boxShadow: "0 2px 6px rgba(0,0,0,0.04)", transition: "all 0.3s" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                <span style={{ fontSize: "0.7rem", fontWeight: "600", padding: "3px 10px", borderRadius: "6px", background: "#e8eaf6", color: "#696cff" }}>{article.category}</span>
                <span style={{ fontSize: "0.75rem", color: "#91979f" }}>{article.readTime} دقائق</span>
              </div>
              <h2 className="font-heading" style={{ fontSize: "1rem", color: "#384551", margin: "0 0 8px", lineHeight: 1.4 }}>{article.title}</h2>
              <p style={{ fontSize: "0.85rem", color: "#7a838b", margin: 0, lineHeight: 1.6 }}>{article.excerpt}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
