"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { education } from "@/lib/data";

export default function Education() {
  return (
    <section id="education" className="relative py-32 md:py-44">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeader
          index="05"
          eyebrow="Education"
          title={
            <>
              Where I <span className="text-gradient-cool">learned.</span>
            </>
          }
        />

        <ul className="divide-y divide-line border-y border-line">
          {education.map((e, i) => (
            <Row key={e.degree + i} entry={e} index={i} total={education.length} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function Row({
  entry,
  index,
}: {
  entry: (typeof education)[number];
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <motion.li
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.06 }}
      className="group relative grid grid-cols-1 md:grid-cols-[180px_1fr_auto] items-baseline gap-4 py-8 md:py-12 cursor-default"
      data-cursor="hover"
    >
      {/* hover scrub */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(40% 80% at 0% 50%, rgba(90,169,255,0.12), transparent 60%)",
        }}
      />

      <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink-mute">
        {entry.period}
      </div>

      <div className="relative">
        <h3 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight">
          <span className="block overflow-hidden">
            <motion.span
              className="inline-block"
              initial={{ y: "110%" }}
              animate={inView ? { y: "0%" } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
            >
              {entry.degree}
            </motion.span>
          </span>
        </h3>
        <p className="mt-2 text-ink-dim text-base md:text-lg">{entry.school}</p>
      </div>

      <div className="font-mono text-xs tracking-[0.12em] text-blue">{entry.detail}</div>
    </motion.li>
  );
}
