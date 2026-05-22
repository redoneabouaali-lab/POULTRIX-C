"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { COLORS } from "@/constants";
import { ArrowRight, ExternalLink, Egg, MapPin, Thermometer, Heart, FileText } from "lucide-react";

export default function BreedDetailPage() {
  const { id } = useParams();
  const [breed, setBreed] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/breeds/${id}`).then(r => r.json()).then(d => { setBreed(d); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ padding: "60px", textAlign: "center" }}>
      <div className="shimmer-bg" style={{ width: 200, height: 20, borderRadius: 6, margin: "0 auto 12px" }} />
      <div className="shimmer-bg" style={{ width: 140, height: 14, borderRadius: 6, margin: "0 auto" }} />
    </div>
  );

  if (!breed) return (
    <div className="flex items-center gap-2" style={{ padding: "60px", textAlign: "center", color: "#5A6A5A", justifyContent: "center" }}>
      <FileText size={16} />
      <span className="text-sm">لم يتم العثور على السلالة</span>
    </div>
  );

  return (
    <div>
      <a href="/dashboard/breeds" className="inline-flex items-center gap-1.5 spring-transition hover:opacity-70" style={{ fontSize: "0.8rem", color: COLORS.aqua, textDecoration: "none", marginBottom: "20px" }}>
        <ArrowRight size={13} /> العودة إلى السلالات
      </a>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.02)", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "300px" }}>
          {breed.imageUrl ? (
            <img src={breed.imageUrl} alt={breed.nameAr} referrerPolicy="no-referrer" style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "contain" }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/fallback-chicken.svg";
              }}
            />
          ) : (
            <img src="/fallback-chicken.svg" alt={breed.nameAr} style={{ maxWidth: "100%", maxHeight: "300px", objectFit: "contain" }} />
          )}
        </div>

        <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.02)" }}>
          <h1 className="font-heading" style={{ fontSize: "1.5rem", color: "#1a1a24", margin: "0 0 20px" }}>{breed.nameAr}</h1>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "20px" }}>
            {[
              { icon: MapPin, label: "المنشأ", value: breed.originAr || "غير معروف" },
              { icon: Egg, label: "لون البيض", value: breed.eggColorAr || "—" },
              { icon: Thermometer, label: "حجم البيض", value: breed.eggSizeAr || "—" },
              { icon: Heart, label: "الطباع", value: breed.temperamentAr || "—" },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex items-center gap-1.5 mb-1">
                  <item.icon size={13} style={{ color: COLORS.aqua }} />
                  <span className="text-xs font-medium" style={{ color: "#5A6A5A" }}>{item.label}</span>
                </div>
                <span className="text-sm font-semibold" style={{ color: "#1a1a24" }}>{item.value}</span>
              </div>
            ))}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Egg size={13} style={{ color: COLORS.aqua }} />
                <span className="text-xs font-medium" style={{ color: "#5A6A5A" }}>البيض سنوياً</span>
              </div>
              <span className="text-sm font-semibold tabular-nums" style={{ color: "#1a1a24" }}>
                {breed.eggNumber ? `${breed.eggNumber} بيضة` : "—"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {(breed.descriptionAr || breed.description) && (
        <div style={{ background: "#fff", borderRadius: "16px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.02)", marginTop: "16px" }}>
          <h2 className="text-sm font-semibold mb-3" style={{ color: "#1a1a24" }}>وصف السلالة</h2>
          <p className="text-sm" style={{ color: "#5a5a64", lineHeight: 1.8 }}>{breed.descriptionAr || breed.description}</p>
        </div>
      )}

      {breed.sources && breed.sources.length > 0 && (
        <div style={{ background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.03), 0 4px 12px rgba(0,0,0,0.02)", marginTop: "14px" }}>
          <p className="text-sm font-semibold mb-2" style={{ color: "#1a1a24" }}>المصادر</p>
          {breed.sources.map((src: string, i: number) => (
            <a key={i} href={src} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 spring-transition hover:opacity-70" style={{ fontSize: "0.8rem", color: COLORS.aqua, textDecoration: "none", marginBottom: "3px", display: "block" }}>
              <ExternalLink size={11} /> {src}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
