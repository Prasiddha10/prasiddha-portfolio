"use client";

import { useEffect, useState } from "react";
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
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = nav.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
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

  return (
    <>
      <motion.header
        initial={{ y: -32, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 1.6 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled ? "py-3" : "py-6"
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between px-5 md:px-10 transition-all duration-500",
            scrolled ? "glass-strong rounded-full mx-4 md:mx-10 py-2 pl-4 pr-2" : ""
          )}
        >
          <button
            onClick={() => go("home")}
            className="font-mono text-[12px] tracking-[0.25em] uppercase text-ink hover:text-orange transition-colors"
            data-cursor="hover"
          >
            {profile.shortName}
            <span className="text-orange">.</span>
          </button>

          <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
            {nav.map((n) => (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                data-cursor="hover"
                className={cn(
                  "relative rounded-full px-4 py-2 font-mono text-[11px] tracking-[0.18em] uppercase transition-colors duration-300",
                  active === n.id ? "text-ink" : "text-ink-mute hover:text-ink"
                )}
              >
                {active === n.id && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-white/10 border border-line-strong"
                    transition={{ type: "spring", stiffness: 280, damping: 26 }}
                  />
                )}
                {n.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:block">
            <button
              onClick={() => go("contact")}
              data-cursor="hover"
              className="rounded-full bg-white text-bg px-5 py-2 font-mono text-[11px] tracking-[0.18em] uppercase hover:bg-orange hover:text-white transition-colors"
            >
              Let's Talk
            </button>
          </div>

          {/* mobile burger */}
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
      </motion.header>

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
                  transition={{ delay: 0.06 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
