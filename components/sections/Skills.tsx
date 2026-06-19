"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { skills, type SkillItem } from "@/lib/data";
import { cn } from "@/lib/utils";

function normalize(item: SkillItem): { name: string; primary: boolean } {
  return typeof item === "string"
    ? { name: item, primary: false }
    : { name: item.name, primary: !!item.primary };
}

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

        {/* focal micro-stat strip */}
        <div className="mb-12 flex flex-wrap gap-x-8 gap-y-3 font-mono text-[11px] tracking-[0.18em] uppercase text-ink-mute">
          <span><span className="text-blue">6</span> stacks</span>
          <span><span className="text-blue">30+</span> tools</span>
          <span><span className="text-orange">4</span> vector DBs</span>
          <span><span className="text-orange">RAG</span> · NLP focus</span>
        </div>

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
        {group.items.map((item, i) => {
          const { name, primary } = normalize(item);
          return (
            <SkillBadge
              key={name}
              item={name}
              primary={primary}
              delay={i * 0.04}
              accent={group.accent}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

function SkillBadge({
  item,
  primary,
  delay,
  accent,
}: {
  item: string;
  primary: boolean;
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
        "inline-flex select-none cursor-default items-center rounded-full border transition-colors duration-300",
        primary
          ? "px-4 py-2 font-mono text-[12px] font-medium tracking-[0.06em] text-ink"
          : "px-3.5 py-1.5 font-mono text-[11px] tracking-[0.08em] text-ink-dim",
        accent === "blue"
          ? primary
            ? "border-blue/40 hover:border-blue/60"
            : "border-line-strong hover:text-blue hover:border-blue/50"
          : primary
          ? "border-orange/40 hover:border-orange/60"
          : "border-line-strong hover:text-orange hover:border-orange/50"
      )}
    >
      {primary && (
        <span
          className={cn(
            "mr-2 h-1.5 w-1.5 rounded-full",
            accent === "blue" ? "bg-blue" : "bg-orange"
          )}
        />
      )}
      {item}
    </motion.span>
  );
}
