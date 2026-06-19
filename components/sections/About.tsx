"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { profile } from "@/lib/data";

const STATEMENT = [
  "I'M PASSIONATE",
  "ABOUT BUILDING",
  "PRODUCTS AND",
  "CONSTANTLY",
  "LEARNING.",
  "EVERY DAY I'M",
  "EXPLORING NEW",
  "IDEAS IN AI, NLP",
  "& ROBOTICS.",
];

const LIT_UNTIL = 4; // first 5 lines pop in warm gradient

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stripRef, { once: true, margin: "-15% 0px" });

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yOrb = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  return (
    <section id="about" ref={ref} className="relative py-32 md:py-44">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeader
          index="01"
          eyebrow="About"
          title={
            <>
              About <span className="text-gradient-warm">me.</span>
            </>
          }
        />

        <div ref={stripRef} className="relative">
          <motion.div
            style={{ y: yOrb }}
            aria-hidden
            className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full blur-3xl opacity-50"
          >
            <div className="h-full w-full rounded-full bg-gradient-to-br from-orange/40 to-blue/20" />
          </motion.div>

          <h3 className="relative font-display text-[10vw] md:text-[6.4vw] leading-[1.02] font-extrabold tracking-tight">
            {STATEMENT.map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  initial={{ y: "110%", opacity: 0 }}
                  animate={inView ? { y: "0%", opacity: 1 } : {}}
                  transition={{ delay: i * 0.08, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  className={`inline-block ${
                    i <= LIT_UNTIL
                      ? "text-gradient-warm"
                      : i >= 7
                      ? "text-gradient-cool"
                      : "text-white/40"
                  }`}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h3>

          <div className="mt-24 grid gap-10 md:grid-cols-3 border-t border-line pt-12">
            <Meta label="Currently" title={profile.role} sub="8 months · Kathmandu, Nepal" />
            <Meta label="Focus" title="NLP · RAG · Low-resource Nepali" sub="OCR pipelines, embeddings, evaluation" />
            <Meta label="Completed Bachelor's in" title="B.Tech in AI" sub="Kathmandu University · Pioneer Batch · CGPA 3.54" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Meta({ label, title, sub }: { label: string; title: string; sub: string }) {
  const r = useRef<HTMLDivElement>(null);
  const inView = useInView(r, { once: true, margin: "-15% 0px" });
  return (
    <motion.div
      ref={r}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-mute mb-3">
        {label}
      </div>
      <div className="font-display text-xl font-semibold text-ink">{title}</div>
      <div className="mt-1 text-sm text-ink-dim">{sub}</div>
    </motion.div>
  );
}
