"use client";

import { motion, useReducedMotion } from "framer-motion";

const STEPS = [
  { label: "Crawl", caption: "Scrape messy product & document data at scale", accent: "#7cc0ff" },
  { label: "Extract", caption: "Structure into clean JSON · OCR ingest", accent: "#5aa9ff" },
  { label: "Embed", caption: "OpenAI embeddings → Qdrant vector store", accent: "#b794f4" },
  { label: "Retrieve", caption: "GPT-4o RAG · grounded, cited answers", accent: "#ff6a3d" },
];

export default function Pipeline() {
  const reduce = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      {/* ambient backdrop glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px]"
        style={{
          background:
            "radial-gradient(circle, rgba(90,169,255,0.10) 0%, rgba(255,106,61,0.05) 50%, transparent 72%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        {/* label */}
        <div className="mb-14 flex flex-col items-center text-center">
          <div className="mb-5 flex items-center gap-4 font-mono text-[11px] tracking-[0.32em] uppercase text-ink-mute">
            <span className="h-px w-12 bg-line-strong" />
            <span>How I build</span>
            <span className="h-px w-12 bg-line-strong" />
          </div>
          <h2 className="display-lg">
            The <span className="text-gradient-cool">RAG</span> pipeline,{" "}
            <span className="text-gradient-warm">end to end.</span>
          </h2>
          <p className="mt-5 max-w-xl text-ink-dim">
            The same four-stage system behind NepKanun — Nepal&apos;s first
            RAG-based legal assistant, scoring BERTScore F1 0.82.
          </p>
        </div>

        {/* pipeline rail */}
        <div className="relative">
          {/* connector — vertical on mobile */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[27px] top-6 bottom-6 w-px opacity-50 md:hidden"
            style={{ background: "linear-gradient(180deg, #5aa9ff 0%, #b794f4 55%, #ff6a3d 100%)" }}
          />
          {/* connector — horizontal on md+ */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-[27px] hidden h-px opacity-50 md:block"
            style={{ background: "linear-gradient(90deg, #5aa9ff 0%, #b794f4 55%, #ff6a3d 100%)" }}
          />

          <ol className="relative grid gap-10 md:grid-cols-4">
            {STEPS.map((s, i) => (
              <motion.li
                key={s.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-12% 0px" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
                className="relative flex items-start gap-5 md:flex-col md:items-start"
              >
                {/* node */}
                <div className="relative grid h-14 w-14 shrink-0 place-items-center">
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full opacity-30 blur-md"
                    style={{ background: s.accent }}
                  />
                  <span
                    className="relative grid h-14 w-14 place-items-center rounded-full border bg-bg font-mono text-[13px] font-semibold"
                    style={{ borderColor: s.accent, color: s.accent }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {!reduce && (
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-full border motion-safe:animate-ping"
                      style={{ borderColor: s.accent, opacity: 0.25, animationDuration: "2.6s" }}
                    />
                  )}
                </div>

                {/* copy */}
                <div className="pt-1 md:pt-5">
                  <div className="font-display text-xl font-bold tracking-tight">{s.label}</div>
                  <p className="mt-1.5 text-sm text-ink-dim leading-relaxed">{s.caption}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
