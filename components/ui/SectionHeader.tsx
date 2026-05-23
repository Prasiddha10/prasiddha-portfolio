"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  className?: string;
};

export default function SectionHeader({ index, eyebrow, title, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <div ref={ref} className={cn("mb-16 flex flex-col gap-6", className)}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-center gap-4 font-mono text-[11px] tracking-[0.32em] uppercase text-ink-mute"
      >
        <span className="text-orange">{index}</span>
        <span className="h-px w-12 bg-line-strong" />
        <span>{eyebrow}</span>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="font-display text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.95]"
      >
        {title}
      </motion.h2>
    </div>
  );
}
