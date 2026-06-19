"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { experiences, type Experience as Exp } from "@/lib/data";

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const lineHeight = useTransform(scrollYProgress, [0.05, 0.85], ["0%", "100%"]);

  return (
    <section id="experience" className="relative py-32 md:py-44">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeader
          index="02"
          eyebrow="Experience"
          accent="cool"
          title={
            <>
              My <span className="text-gradient-cool">Journey</span>
            </>
          }
        />

        <div ref={ref} className="relative grid gap-16">
          {/* timeline rail */}
          <div className="pointer-events-none absolute left-[28px] md:left-[160px] top-2 bottom-2 w-px bg-line">
            <motion.div
              className="absolute inset-x-0 top-0 origin-top w-px"
              style={{
                height: lineHeight,
                background: "linear-gradient(180deg, #5aa9ff 0%, #ff6a3d 100%)",
              }}
            />
            {/* terminal orb — caps the rail */}
            <span
              aria-hidden
              className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-orange"
              style={{ boxShadow: "0 0 16px 3px rgba(255,106,61,0.6)" }}
            />
          </div>

          {experiences.map((exp, i) => (
            <TimelineRow key={exp.role + i} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineRow({ exp, index }: { exp: Exp; index: number }) {
  const r = useRef<HTMLDivElement>(null);
  const inView = useInView(r, { once: true, margin: "-10% 0px" });

  return (
    <motion.article
      ref={r}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
      className="relative grid grid-cols-[64px_1fr] md:grid-cols-[180px_1fr] gap-6 md:gap-10"
    >
      {/* dot */}
      <div className="relative">
        <div className="absolute left-[22px] md:left-[154px] top-2 grid h-3.5 w-3.5 place-items-center rounded-full bg-bg">
          {index === 0 && (
            <span className="absolute inset-0 rounded-full border-2 border-blue opacity-60 motion-safe:animate-ping" />
          )}
          <span
            className="h-3.5 w-3.5 rounded-full border-2 border-blue"
            style={{ boxShadow: "0 0 0 4px rgba(90,169,255,0.12)" }}
          />
        </div>
        <div className="font-mono text-[11px] tracking-[0.15em] uppercase text-ink-dim pt-1">
          {exp.year}
        </div>
        {index === 0 && (
          <div className="mt-1 inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.2em] uppercase text-blue">
            <span className="h-1 w-1 rounded-full bg-blue" /> Now
          </div>
        )}
      </div>

      {/* card */}
      <div className="group relative">
        <div className="glass rounded-2xl p-6 md:p-8 transition-all duration-500 group-hover:border-line-strong group-hover:-translate-y-1">
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
            <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
              {exp.role}
            </h3>
            <div className="font-mono text-xs text-blue tracking-[0.05em]">
              {exp.company}
              {exp.location ? ` · ${exp.location}` : ""}
            </div>
          </div>

          <p className="max-w-3xl text-ink-dim leading-relaxed">{exp.desc}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {exp.tags.map((t) => (
              <span
                key={t}
                className="font-mono text-[10px] tracking-[0.12em] uppercase px-3 py-1 rounded-full border border-line-strong text-ink-dim"
              >
                {t}
              </span>
            ))}
          </div>

          {/* hover glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(60% 80% at 0% 0%, rgba(90,169,255,0.15), transparent 60%), radial-gradient(50% 80% at 100% 100%, rgba(255,106,61,0.12), transparent 60%)",
            }}
          />
        </div>
      </div>
    </motion.article>
  );
}
