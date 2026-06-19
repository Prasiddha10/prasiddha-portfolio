"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef } from "react";
import { profile } from "@/lib/data";

const EASE = [0.22, 1, 0.36, 1] as const;
const NEON_BLUE = "#7cc0ff";
const CHIPS = ["Python", "NLP", "LLMs", "PyTorch", "Next.js"] as const;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // ─── cursor parallax (drives glow) ───
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 22 });
  const smy = useSpring(my, { stiffness: 60, damping: 22 });
  const glowX = useTransform(smx, [-1, 1], ["-22%", "22%"]);
  const glowY = useTransform(smy, [-1, 1], ["-22%", "22%"]);

  useEffect(() => {
    if (reduce) return;
    const el = sectionRef.current;
    if (!el) return;
    let raf = 0;
    let nx = 0, ny = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          mx.set(nx);
          my.set(ny);
          raf = 0;
        });
      }
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      el.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [mx, my, reduce]);

  // ─── scroll-driven transition to next section ───
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY       = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const charY       = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const charOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const charScale   = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const bgOverlayOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-[100svh] w-full overflow-hidden"
    >
      {/* ── deep space background ── */}
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at 65% 45%, #0c1226 0%, #070a18 45%, #020308 100%)",
        }}
      />

      {/* ── mouse-follow glow (moves via transform — cheap) ── */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center"
      >
        <motion.div
          className="h-[120vmax] w-[120vmax] rounded-full"
          style={{
            x: glowX,
            y: glowY,
            willChange: "transform",
            background:
              "radial-gradient(circle at 50% 50%, rgba(124,192,255,0.13) 0%, rgba(255,106,177,0.05) 30%, transparent 55%)",
          }}
        />
      </motion.div>

      {/* ── grain + scroll overlay ── */}
      <GrainNoise />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          opacity: bgOverlayOpacity,
          willChange: "opacity",
          background:
            "linear-gradient(180deg, rgba(8,12,22,0) 0%, rgba(20,28,48,1) 100%)",
        }}
      />

      {/* ── ANIMATED VISUAL — orbital rings; visible from md, subtle on tablet ── */}
      <motion.div
        style={{
          y: charY,
          scale: charScale,
          opacity: charOpacity,
          willChange: "transform",
        }}
        className="pointer-events-none absolute inset-y-0 right-0 z-[3] hidden w-[44%] items-center justify-center opacity-70 md:flex lg:w-[48%] lg:opacity-100"
      >
        <OrbitalVisual reduce={!!reduce} />
      </motion.div>

      {/* ── text content ── */}
      <motion.div
        style={{ opacity: textOpacity, y: textY, willChange: "transform" }}
        className="relative z-[5] flex min-h-[100svh] w-full flex-col justify-center px-6 py-28 md:px-10 xl:px-24"
      >
        <h1 className="sr-only">{profile.name} — {profile.role}</h1>

        {/* label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
          className="mb-6 flex items-center gap-3 font-mono text-[11px] tracking-[0.32em] uppercase text-ink-mute"
        >
          <span className="h-px w-8 bg-line-strong" />
          <span>AI Engineer · Researcher</span>
        </motion.div>

        {/* name + role */}
        <motion.div
          initial={{ x: -180, opacity: 0, scale: 0.98 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 1.1, ease: EASE }}
          aria-hidden
          className="select-none"
        >
          <div
            className="font-display font-black leading-[0.86] tracking-[-0.045em] text-[clamp(52px,8vw,124px)]"
            style={{
              color: NEON_BLUE,
              textShadow: "0 1px 24px rgba(124,192,255,0.22)",
            }}
          >
            PRASIDDHA
          </div>
          <div
            className="mt-2 font-display font-light leading-[0.9] tracking-[0.02em] text-[clamp(22px,3.2vw,52px)]"
            style={{ color: "rgba(255,255,255,0.82)" }}
          >
            {profile.role}
          </div>
        </motion.div>

        {/* tagline */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 1.0, ease: EASE }}
          className="mt-6 max-w-md font-display text-[15px] leading-relaxed text-ink-dim md:text-[17px]"
        >
          {profile.tagline}
        </motion.p>

        {/* tech chips */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease: EASE }}
          className="mt-5 flex flex-wrap gap-2"
        >
          {CHIPS.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/[0.09] bg-white/[0.04] px-3 py-1 font-mono text-[10px] tracking-[0.14em] uppercase text-ink-mute"
            >
              {t}
            </span>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8, ease: EASE }}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          {/* Primary — glowing gradient pill with sheen sweep */}
          <a
            href="#projects"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-8 py-3.5 font-display text-[13px] font-semibold tracking-wide text-white transition-transform duration-200 ease-out hover:scale-[1.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/60"
            style={{
              background:
                "linear-gradient(135deg, #4f9eff 0%, #6EC1FF 42%, #b794f4 100%)",
              boxShadow:
                "0 0 0 1px rgba(255,255,255,0.18) inset, 0 8px 36px rgba(124,192,255,0.32), 0 2px 8px rgba(0,0,0,0.45)",
            }}
          >
            {/* sheen */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-[20deg] bg-white/25 blur-md -translate-x-[200%] transition-transform duration-700 ease-out group-hover:translate-x-[420%]"
            />
            <span className="relative">View Projects</span>
            <span className="relative flex h-6 w-6 items-center justify-center rounded-full bg-white/25 text-[13px] transition-transform duration-200 group-hover:translate-x-0.5">
              →
            </span>
          </a>

          {/* Secondary — gradient-border glass pill */}
          <div
            className="rounded-full p-px"
            style={{
              background:
                "linear-gradient(135deg, rgba(124,192,255,0.55) 0%, rgba(183,148,244,0.3) 50%, rgba(255,255,255,0.08) 100%)",
            }}
          >
            <a
              href="#contact"
              className="group inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 font-display text-[13px] font-medium tracking-wide text-white/80 transition-transform duration-200 ease-out hover:text-white hover:scale-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue/60"
              style={{ background: "rgba(4,6,14,0.88)" }}
            >
              Contact Me
              <span className="text-[15px] leading-none text-white/40 transition-all duration-200 group-hover:text-white/90 group-hover:translate-x-0.5">
                ↗
              </span>
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* ── scroll indicator ── */}
      <motion.div
        style={{ opacity: textOpacity }}
        className="pointer-events-none absolute bottom-6 left-1/2 z-[6] -translate-x-1/2 flex flex-col items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-ink-mute"
      >
        <span>scroll</span>
        <div className="relative h-12 w-px overflow-hidden bg-white/10">
          <motion.div
            className="absolute inset-x-0 top-0 h-1/2"
            style={{
              background: `linear-gradient(180deg, transparent, ${NEON_BLUE})`,
            }}
            animate={reduce ? false : { y: ["-100%", "200%"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: NEON_BLUE, boxShadow: `0 0 12px ${NEON_BLUE}` }}
        />
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   ORBITAL VISUAL — pure transform animation (GPU-composited).
   Glowing core with three tilted orbital rings, each carrying an
   orbiting node. Honors prefers-reduced-motion.
   ───────────────────────────────────────────────────────────── */
function OrbitalVisual({ reduce }: { reduce: boolean }) {
  const rings = [
    { size: 460, dur: 26, dir: 1,  tilt: 68, node: "#7cc0ff" },
    { size: 340, dur: 18, dir: -1, tilt: 74, node: "#5aa9ff" },
    { size: 230, dur: 12, dir: 1,  tilt: 80, node: "#ff6a3d" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 1.2, ease: EASE }}
      className="relative flex h-[min(82vmin,560px)] w-[min(82vmin,560px)] items-center justify-center"
      style={{ perspective: 900 }}
    >
      {/* ambient glow */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-full blur-[70px]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(90,169,255,0.18) 0%, rgba(255,106,61,0.07) 45%, transparent 70%)",
        }}
      />

      {/* glowing core */}
      <motion.div
        className="absolute h-24 w-24 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 38% 34%, #d6ecff 0%, #7cc0ff 36%, #5aa9ff 64%, #2c5aa0 100%)",
          boxShadow:
            "0 0 60px 6px rgba(90,169,255,0.5), 0 0 120px 24px rgba(90,169,255,0.16)",
        }}
        animate={reduce ? false : { scale: [1, 1.06, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* orbital rings */}
      {rings.map((r, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            transform: `rotateX(${r.tilt}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <motion.div
            className="rounded-full border"
            style={{
              width: r.size,
              height: r.size,
              borderColor: "rgba(255,255,255,0.10)",
              borderWidth: 1,
              willChange: "transform",
            }}
            animate={reduce ? false : { rotate: r.dir * 360 }}
            transition={{ duration: r.dur, repeat: Infinity, ease: "linear" }}
          >
            <span
              className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background: r.node,
                boxShadow: `0 0 16px 3px ${r.node}`,
              }}
            />
          </motion.div>
        </div>
      ))}
    </motion.div>
  );
}

/* ─── Film-grain overlay — baked into a tiled data-URI ─── */
const GRAIN_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

function GrainNoise() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[3] opacity-[0.07] mix-blend-overlay"
      style={{ backgroundImage: GRAIN_URI, backgroundRepeat: "repeat" }}
    />
  );
}
