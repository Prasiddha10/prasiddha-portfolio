"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  accent?: "warm" | "cool";
  className?: string;
};

export default function SectionHeader({
  index,
  eyebrow,
  title,
  accent = "warm",
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const accentColor = accent === "cool" ? "text-blue" : "text-orange";

  return (
    <div ref={ref} className={cn("relative mb-16 flex flex-col gap-6", className)}>
      {/* large faint ghost numeral */}
      <span
        aria-hidden
        className="pointer-events-none absolute -top-10 right-0 select-none font-display font-black leading-none text-white/[0.03] text-[120px] md:text-[180px]"
      >
        {index}
      </span>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex items-center gap-4 font-mono text-[11px] tracking-[0.32em] uppercase text-ink-mute"
      >
        <span className={accentColor}>{index}</span>
        <span className="h-px w-12 bg-line-strong" />
        <span>{eyebrow}</span>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="relative display-xl"
      >
        {title}
      </motion.h2>
    </div>
  );
}
