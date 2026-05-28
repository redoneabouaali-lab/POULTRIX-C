"use client";

import { motion } from "framer-motion";
import { COLORS } from "@/constants";

export default function SectionDivider() {
  return (
    <div className="relative h-12 md:h-16 flex items-center justify-center overflow-hidden" aria-hidden="true">
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[200px] h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${COLORS.aqua}30, ${COLORS.gold}25, ${COLORS.aqua}30, transparent)`,
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ delay: 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute w-1.5 h-1.5 rounded-full"
        style={{ background: COLORS.aqua, boxShadow: `0 0 6px ${COLORS.aqua}50` }}
      />
    </div>
  );
}
