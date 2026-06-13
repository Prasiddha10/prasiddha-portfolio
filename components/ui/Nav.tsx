"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { nav, profile } from "@/lib/data";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    __lenis?: { scrollTo: (target: string | HTMLElement | number, opts?: { offset?: number }) => void };
  }
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [loaded, setLoaded]     = useState(false);
  const [open, setOpen]         = useState(false);
  const [active, setActive]     = useState<string>("home");
  const [glowX, setGlowX]       = useState(0);
  const [glowY, setGlowY]       = useState(0);
  const [hovered, setHovered]   = useState(false);
  const [clicked, setClicked]   = useState(false);
  const clickTimer               = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  /* Entrance — slides in once, never hides */
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 500);
    return () => clearTimeout(t);
  }, []);

  /* Scroll — only adjusts background opacity */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Active section tracker */
  useEffect(() => {
    const sections = nav
      .map((n) => document.getElementById(n.id))
      .filter(Boolean) as HTMLElement[];
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { threshold: [0.25, 0.5, 0.75] }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const go = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -20 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* Click burst glow */
  const handleNavClick = () => {
    clearTimeout(clickTimer.current);
    setClicked(true);
    clickTimer.current = setTimeout(() => setClicked(false), 700);
  };

  const glowR   = clicked ? 520  : hovered ? 300  : 0;
  const glowA   = clicked ? 0.18 : hovered ? 0.09 : 0;
  const bgAlpha = scrolled ? 0.92 : 0.78;

  /* Gradient border: brighter on hover/click */
  const borderGrad = clicked
    ? "linear-gradient(135deg, rgba(110,193,255,0.7) 0%, rgba(183,148,244,0.5) 50%, rgba(255,106,61,0.3) 100%)"
    : hovered
    ? "linear-gradient(135deg, rgba(110,193,255,0.45) 0%, rgba(183,148,244,0.28) 50%, rgba(255,106,61,0.14) 100%)"
    : "linear-gradient(135deg, rgba(110,193,255,0.22) 0%, rgba(183,148,244,0.14) 50%, rgba(255,255,255,0.07) 100%)";

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: loaded ? 0 : -80, opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 pb-2 md:px-10"
      >
        {/* ── Gradient-border wrapper (p-px shows 1px of gradient as border) ── */}
        <div
          onMouseMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            setGlowX(e.clientX - r.left);
            setGlowY(e.clientY - r.top);
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={handleNavClick}
          className="rounded-2xl p-px cursor-default"
          style={{
            background: borderGrad,
            boxShadow: clicked
              ? "0 0 32px rgba(110,193,255,0.18), 0 16px 48px rgba(0,0,0,0.5)"
              : scrolled
              ? "0 12px 40px rgba(0,0,0,0.45)"
              : "0 8px 28px rgba(0,0,0,0.35)",
            transition: "background 0.35s ease, box-shadow 0.35s ease",
          }}
        >
          {/* ── Inner glass surface ── */}
          <div
            className="relative flex items-center justify-between rounded-[15px] px-5 py-3 md:px-6 overflow-hidden"
            style={{
              background:
                hovered || clicked
                  ? `radial-gradient(circle ${glowR}px at ${glowX}px ${glowY}px, rgba(110,193,255,${glowA}) 0%, transparent 65%), rgba(4,6,14,${bgAlpha})`
                  : `rgba(4,6,14,${bgAlpha})`,
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              transition: "background 0.25s ease",
            }}
          >
            {/* Top-edge highlight shimmer */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  "linear-gradient(to right, transparent 5%, rgba(110,193,255,0.45) 30%, rgba(183,148,244,0.35) 65%, transparent 95%)",
              }}
            />

            {/* ── Logo ── */}
            <button
              onClick={() => go("home")}
              className="font-mono text-[13px] tracking-[0.28em] uppercase text-ink hover:text-orange transition-colors duration-300"
              data-cursor="hover"
            >
              {profile.shortName}
              <span className="text-orange">.</span>
            </button>

            {/* ── Desktop nav items ── */}
            <nav className="hidden md:flex items-center gap-0.5" aria-label="Primary">
              {nav.map((n) => (
                <button
                  key={n.id}
                  onClick={() => go(n.id)}
                  data-cursor="hover"
                  className={cn(
                    "relative rounded-full px-4 py-2 font-mono text-[11.5px] tracking-[0.18em] uppercase transition-colors duration-300",
                    active === n.id ? "text-white" : "text-ink-mute hover:text-ink"
                  )}
                >
                  {active === n.id && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(110,193,255,0.26) 0%, rgba(183,148,244,0.18) 100%)",
                        border: "1px solid rgba(110,193,255,0.28)",
                        boxShadow: "0 0 22px rgba(110,193,255,0.22)",
                      }}
                      transition={{ type: "spring", stiffness: 280, damping: 26 }}
                    />
                  )}
                  {n.label}
                </button>
              ))}
            </nav>

            {/* ── CTA — orange gradient ── */}
            <div className="hidden md:block">
              <button
                onClick={() => go("contact")}
                data-cursor="hover"
                className="rounded-full px-5 py-2 font-mono text-[11px] tracking-[0.2em] uppercase font-medium text-white transition-all duration-300 hover:scale-[1.06] hover:shadow-[0_0_28px_rgba(255,106,61,0.55)]"
                style={{
                  background: "linear-gradient(135deg, #ff6a3d 0%, #ff9272 100%)",
                  boxShadow:
                    "0 4px 18px rgba(255,106,61,0.28), 0 0 0 1px rgba(255,255,255,0.12) inset",
                }}
              >
                Let&apos;s Talk
              </button>
            </div>

            {/* ── Mobile burger ── */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="md:hidden grid place-items-center h-10 w-10 rounded-full border border-line-strong"
              aria-label="Toggle menu"
              aria-expanded={open}
              data-cursor="hover"
            >
              <span className="relative block h-3 w-5">
                <span
                  className={cn(
                    "absolute left-0 top-0 block h-px w-5 bg-white transition-transform duration-300",
                    open ? "translate-y-1.5 rotate-45" : ""
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-3 block h-px w-5 bg-white transition-transform duration-300",
                    open ? "-translate-y-1.5 -rotate-45" : ""
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile overlay ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden glass-strong"
          >
            <div className="flex flex-col items-start gap-1 px-8 pt-28">
              {nav.map((n, i) => (
                <motion.button
                  key={n.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.06 * i,
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onClick={() => go(n.id)}
                  className="font-display text-4xl font-bold tracking-tight text-ink hover:text-orange"
                >
                  {n.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
