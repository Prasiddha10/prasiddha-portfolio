"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { skills } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function Skills() {
  return (
    <section id="skills" className="relative py-32 md:py-44">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeader
          index="04"
          eyebrow="Toolkit"
          title={
            <>
              My <span className="text-gradient-warm">Expertise</span>
            </>
          }
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skills.map((group, gi) => (
            <SkillGroup key={group.category} group={group} index={gi} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillGroup({
  group,
  index,
}: {
  group: (typeof skills)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const accent = group.accent === "blue" ? "text-blue" : "text-orange";
  const ring =
    group.accent === "blue"
      ? "hover:border-blue/30"
      : "hover:border-orange/30";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
      className={cn(
        "group relative rounded-3xl border border-line bg-white/[0.02] p-7 transition-all duration-500 hover:-translate-y-1 hover:bg-white/[0.04]",
        ring
      )}
    >
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-display text-xl font-bold tracking-tight">
          {group.category}
        </h3>
        <span className={cn("font-mono text-[10px] tracking-[0.3em] uppercase", accent)}>
          0{index + 1}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {group.items.map((item, i) => (
          <SkillBadge key={item} item={item} delay={i * 0.04} accent={group.accent} />
        ))}
      </div>
    </motion.div>
  );
}

function SkillBadge({
  item,
  delay,
  accent,
}: {
  item: string;
  delay: number;
  accent: "orange" | "blue";
}) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      whileHover={{ scale: 1.08, y: -2 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay }}
      className={cn(
        "inline-flex select-none cursor-default items-center rounded-full border px-3.5 py-1.5 font-mono text-[11px] tracking-[0.08em] transition-colors duration-300",
        accent === "blue"
          ? "border-line-strong text-ink-dim hover:text-blue hover:border-blue/50"
          : "border-line-strong text-ink-dim hover:text-orange hover:border-orange/50"
      )}
      data-cursor="hover"
    >
      {item}
    </motion.span>
  );
}
