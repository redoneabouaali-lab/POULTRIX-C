"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold font-heading" style={{ color: "#1a1a24", margin: 0 }}>سلالات الدجاج</h1>
          <p className="text-xs" style={{ color: "#5A6A5A", margin: "4px 0 0" }}>{breeds.length} سلالة مختلفة</p>
        </div>
        <div style={{ position: "relative" }}>
          <Search size={15} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#a0a0aa" }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث عن سلالة..."
            style={{ padding: "9px 36px 9px 14px", borderRadius: "10px", border: "1px solid #eeeef0", background: "#fff", fontSize: "0.8rem", color: "#1a1a24", width: "220px", outline: "none" }} />
        </div>
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="shimmer-bg" style={{ height: "220px", borderRadius: "14px" }} />
          ))}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
          {filtered.map((breed) => (
            <a key={breed.id} href={`/dashboard/breeds/${breed.id}`} style={{ textDecoration: "none" }}>
              <div
                className="spring-transition"
                style={{ background: "#fff", borderRadius: "14px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.02)" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
              >
                <div style={{ height: "150px", background: "#f8f8fa", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
                  <img src={breed.imageUrl || "/fallback-chicken.svg"} alt={breed.nameAr} referrerPolicy="no-referrer" style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/fallback-chicken.svg";
                    }}
                  />
                </div>
                  <div style={{ padding: "14px" }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold" style={{ fontSize: "0.95rem", color: "#1a1a24" }}>{breed.nameAr}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md tabular-nums font-metric" style={{ background: `${breed.eggNumber ? "#e9f8ed" : "#f8f8fa"}`, color: breed.eggNumber ? "#1a7d36" : "#a0a0aa" }}>
                        {breed.eggNumber ? `${breed.eggNumber}/سنة` : "—"}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: "#5A6A5A", margin: 0 }}>
                      {breed.originAr || "غير معروف"} &bull; {breed.eggColorAr || "—"}
                    </p>
                    <p className="text-xs" style={{ color: "#a0a0aa", margin: "4px 0 0" }}>
                      حجم البيض: {breed.eggSizeAr || "—"} {breed.temperamentAr ? `&bull; ${breed.temperamentAr}` : ""}
                    </p>
                  </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
