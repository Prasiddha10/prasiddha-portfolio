"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import MagneticButton from "@/components/ui/MagneticButton";
import { profile } from "@/lib/data";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 grid place-items-center">
      <div className="h-40 w-40 rounded-full bg-gradient-to-br from-orange/40 to-blue/40 blur-3xl animate-pulse" />
    </div>
  ),
});

const NAME_LINES = ["PRASIDDHA", "KOIRALA"];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yBgText = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const sceneY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  // GSAP cinematic intro timeline (runs once after loader removes)
  useEffect(() => {
    if (!rootRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 1.55 });

      tl.from(".hero-eyebrow", { y: -12, opacity: 0, duration: 1 }, 0)
        .from(
          ".hero-bg-line",
          {
            y: 60,
            opacity: 0,
            filter: "blur(20px)",
            scale: 1.06,
            duration: 1.4,
            stagger: 0.12,
          },
          0.05
        )
        .from(".hero-status", { y: 14, opacity: 0, duration: 0.8 }, 0.4)
        .from(".hero-tagline", { y: 18, opacity: 0, filter: "blur(8px)", duration: 1.1 }, 0.6)
        .from(".hero-cta > *", { y: 18, opacity: 0, duration: 0.7, stagger: 0.08 }, 0.85)
        .from(".hero-scroll", { y: 10, opacity: 0, duration: 0.8 }, 1.1);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-[100svh] w-full overflow-hidden"
    >
      <div ref={rootRef} className="relative h-full w-full">
        {/* ─── huge background name ─── */}
        <motion.div
          style={{ y: yBgText, opacity }}
          className="pointer-events-none absolute inset-0 z-[1] flex flex-col items-center justify-center gap-[0.05em]"
        >
          {NAME_LINES.map((line, i) => (
            <div
              key={line}
              className="hero-bg-line font-display font-black tracking-[-0.06em] leading-[0.85] text-[16vw] md:text-[14vw] lg:text-[13vw] whitespace-nowrap select-none"
              style={{
                WebkitTextStroke: "1px rgba(255,255,255,0.16)",
                color: "transparent",
                textShadow:
                  i === 0
                    ? "0 0 80px rgba(90,169,255,0.25)"
                    : "0 0 80px rgba(255,106,61,0.22)",
              }}
            >
              {line}
            </div>
          ))}
        </motion.div>

        {/* ─── 3D scene layer ─── */}
        <motion.div
          style={{ scale: sceneScale, y: sceneY }}
          className="absolute inset-0 z-[2]"
        >
          <HeroScene />
        </motion.div>

        {/* ─── top eyebrow ─── */}
        <div className="hero-eyebrow pointer-events-none absolute left-1/2 top-[14vh] z-[3] -translate-x-1/2 flex items-center gap-3 font-mono text-[10px] tracking-[0.5em] uppercase text-ink-mute">
          <span className="h-px w-8 bg-line-strong" />
          <span>AI Engineer · Researcher</span>
          <span className="h-px w-8 bg-line-strong" />
        </div>

        {/* ─── center stack ─── */}
        <div className="relative z-[3] mx-auto flex min-h-[100svh] max-w-7xl flex-col items-center justify-end gap-7 px-6 pb-[14vh] text-center">
          <h1 className="sr-only">
            {profile.name} — {profile.role}
          </h1>

          <div className="hero-status glass rounded-full px-5 py-2 font-mono text-[11px] tracking-[0.25em] uppercase text-ink-dim flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-orange animate-ping opacity-60" />
              <span className="relative h-2 w-2 rounded-full bg-orange" />
            </span>
            Open to collaborations
          </div>

          <p className="hero-tagline max-w-2xl font-display text-lg md:text-xl leading-relaxed text-ink-dim">
            {profile.tagline}
          </p>

          <div className="hero-cta flex flex-wrap items-center justify-center gap-3">
            <NeonButton href="#projects" variant="primary">
              View Projects
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path
                  d="M3 7h8m0 0L7 3m4 4l-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </NeonButton>
            <NeonButton href="#contact" variant="ghost">
              Contact Me
            </NeonButton>
          </div>
        </div>

        {/* ─── scroll cue ─── */}
        <div className="hero-scroll pointer-events-none absolute bottom-6 left-1/2 z-[3] -translate-x-1/2 flex flex-col items-center gap-2 font-mono text-[10px] tracking-[0.4em] uppercase text-ink-mute">
          <span>scroll</span>
          <div className="relative h-12 w-px overflow-hidden bg-white/10">
            <motion.div
              className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-transparent to-white"
              animate={{ y: ["-100%", "200%"] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Neon CTA — magnetic + glow border ───────── */
function NeonButton({
  href,
  variant,
  children,
}: {
  href: string;
  variant: "primary" | "ghost";
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {/* animated gradient ring */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-[2px] rounded-full opacity-70 blur-md transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            variant === "primary"
              ? "conic-gradient(from 0deg, #ff6a3d, #ff8a5b, #5aa9ff, #ff6a3d)"
              : "conic-gradient(from 180deg, transparent 40%, rgba(255,255,255,0.6), transparent 60%)",
          maskImage: "radial-gradient(circle, black 70%, transparent 71%)",
        }}
      />
      <MagneticButton as="a" href={href} variant={variant} className="relative">
        {children}
      </MagneticButton>
    </div>
  );
}
