import { defineComponent, createLibrary } from "@openuidev/react-lang";
import { z } from "zod";
import React from "react";

/* ─── Helper ─── */
const h = React.createElement;
const s = (obj: Record<string, string>) => obj;

/* ─── Card ─── */

const Card = defineComponent({
  name: "Card",
  props: z.object({ children: z.any(), title: z.string().optional() }),
  description: "Rounded container with glass background. Use as root for any response.",
  component: ({ props, renderNode }) => h("div", { style: s({ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(16px)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.06)", padding: props.children ? "20px" : "0" }) },
    props.title ? h("h3", { style: s({ margin: "0 0 12px 0", fontSize: "15px", fontWeight: "700", color: "#fff" }) }, props.title) : null,
    renderNode(props.children)
  ),
});

/* ─── Metric ─── */

const Metric = defineComponent({
  name: "Metric",
  props: z.object({ label: z.string(), value: z.string(), change: z.string().optional(), color: z.string().optional() }),
  description: "Single KPI metric card. Use for mortality rate, feed efficiency, health score, profit margin.",
  component: ({ props }) => {
    const c = props.color || "#C4893A";
    return h("div", { style: s({ padding: "12px 16px", borderRadius: "12px", background: c + "10", border: "1px solid " + c + "20" }) },
      h("div", { style: s({ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }) }, props.label),
      h("div", { style: s({ fontSize: "22px", fontWeight: "800", color: "#fff" }) }, props.value),
      props.change ? h("div", { style: s({ fontSize: "11px", color: props.change.startsWith("+") ? "#BF7A5A" : "#C4893A", marginTop: "2px" }) }, props.change) : null
    );
  },
});

/* ─── Stack ─── */

const Stack = defineComponent({
  name: "Stack",
  props: z.object({ children: z.any(), gap: z.number().optional() }),
  description: "Vertical flexbox column. Stacks children from top to bottom with optional gap.",
  component: ({ props, renderNode }) => h("div", { style: s({ display: "flex", flexDirection: "column", gap: String(props.gap || 12) + "px" }) }, renderNode(props.children)),
});

/* ─── Row ─── */

const Row = defineComponent({
  name: "Row",
  props: z.object({ children: z.any(), gap: z.number().optional() }),
  description: "Horizontal flexbox row. Arranges children side by side with optional gap.",
  component: ({ props, renderNode }) => h("div", { style: s({ display: "flex", flexWrap: "wrap", gap: String(props.gap || 10) + "px" }) }, renderNode(props.children)),
});

/* ─── Text ─── */

const Text = defineComponent({
  name: "Text",
  props: z.object({ content: z.string(), size: z.string().optional() }),
  description: "Paragraph of text. Sizes: xs(12px), sm(13px), md(14px), lg(16px). Default md.",
  component: ({ props }) => {
    const sizes: Record<string, string> = { xs: "12px", sm: "13px", md: "14px", lg: "16px" };
    return h("p", { style: s({ fontSize: sizes[props.size || "md"], lineHeight: "1.7", color: "rgba(255,255,255,0.6)", margin: "0" }) }, props.content);
  },
});

/* ─── Badge ─── */

const Badge = defineComponent({
  name: "Badge",
  props: z.object({ label: z.string(), color: z.string().optional() }),
  description: "Small colored pill badge. Use for risk levels, status labels, tags.",
  component: ({ props }) => {
    const c = props.color || "#2D5541";
    return h("span", { style: s({ display: "inline-block", padding: "3px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: "600", background: c + "20", color: c, border: "1px solid " + c + "30" }) }, props.label);
  },
});

/* ─── Table ─── */

const Table = defineComponent({
  name: "Table",
  props: z.object({ headers: z.array(z.string()), rows: z.array(z.array(z.string())) }),
  description: "Data table with header row and body rows. Use for comparing barns or time periods.",
  component: ({ props }) => h("div", { style: s({ overflowX: "auto" }) },
    h("table", { style: s({ width: "100%", borderCollapse: "collapse", fontSize: "13px" }) },
      h("thead", null,
        h("tr", null, props.headers.map((hdr, i) => h("th", { key: i, style: s({ textAlign: "right", padding: "8px 10px", color: "rgba(255,255,255,0.5)", fontWeight: "600", borderBottom: "1px solid rgba(255,255,255,0.06)" }) }, hdr)))
      ),
      h("tbody", null,
        props.rows.map((row, i) => h("tr", { key: i },
          row.map((cell, j) => h("td", { key: j, style: s({ padding: "8px 10px", color: j === 0 ? "rgba(255,255,255,0.7)" : "#fff", fontWeight: j === 0 ? "600" : "400", borderBottom: "1px solid rgba(255,255,255,0.04)" }) }, cell))
        ))
      )
    )
  ),
});

/* ─── AlertItem ─── */

const AlertItem = defineComponent({
  name: "AlertItem",
  props: z.object({ message: z.string(), barn: z.string(), severity: z.string().optional() }),
  description: "Alert notification with barn ID and severity color. Severity: high(gold), medium(aqua), low(blue).",
  component: ({ props }) => {
    const colors: Record<string, string> = { high: "#BF7A5A", medium: "#C4893A", low: "#2D5541" };
    const c = colors[props.severity || "low"];
    return h("div", { style: s({ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "10px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.04)" }) },
      h("div", { style: s({ width: "6px", height: "6px", borderRadius: "50%", background: c, flexShrink: "0" }) }),
      h("div", null,
        h("div", { style: s({ fontSize: "13px", color: "rgba(255,255,255,0.7)" }) }, props.message),
        h("div", { style: s({ fontSize: "10px", color: "rgba(255,255,255,0.2)", marginTop: "2px" }) }, props.barn)
      )
    );
  },
});

/* ─── Library ─── */

export const poultrixLibrary = createLibrary({
  root: "Card",
  componentGroups: [
    { name: "Layout", components: ["Card", "Stack", "Row"] },
    { name: "Data Display", components: ["Metric", "Table", "Badge", "AlertItem"] },
    { name: "Content", components: ["Text"] },
  ],
  components: [Card, Stack, Row, Metric, Text, Badge, Table, AlertItem],
});
