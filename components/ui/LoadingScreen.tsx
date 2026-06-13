"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { profile } from "@/lib/data";

export default function LoadingScreen() {
  const [done, setDone] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    // simulate a real load while assets settle; finish on next paint after document is ready
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const elapsed = performance.now() - start;
      const target = document.readyState === "complete" ? 100 : Math.min(85, elapsed / 18);
      setPct((prev) => prev + (target - prev) * 0.12);
      if (elapsed > 1800 && document.readyState === "complete") {
        setPct(100);
        setTimeout(() => setDone(true), 350);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-bg"
        >
          {/* glow burst — radial orb that expands from nothing */}
          <div className="relative mb-12 h-28 w-28">
            {/* outer expanding halo */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 2.8, 1.6], opacity: [0, 0.75, 0.32] }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], times: [0, 0.45, 1] }}
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(110,193,255,0.9) 0%, rgba(255,106,61,0.55) 45%, transparent 72%)",
                filter: "blur(18px)",
              }}
            />
            {/* mid conic ring */}
            <motion.div
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{ scale: [0.2, 1.4, 1], opacity: [0, 1, 0.55] }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1, times: [0, 0.5, 1] }}
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "conic-gradient(from 0deg, rgba(255,106,61,0.95), rgba(90,169,255,0.95), rgba(255,106,61,0.95))",
                filter: "blur(4px)",
              }}
            />
            {/* bright core */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.3, 0.9], opacity: [0, 1, 0.85] }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
              className="absolute inset-[22%] rounded-full"
              style={{
                background: "radial-gradient(circle, #ffffff 0%, rgba(110,193,255,0.9) 50%, transparent 100%)",
                filter: "blur(2px)",
              }}
            />
            {/* spinning orbit ring — dashed, outside the orb */}
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: 360 }}
              transition={{
                scale:   { delay: 0.9, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                opacity: { delay: 0.9, duration: 0.4 },
                rotate:  { delay: 0.9, duration: 3.5, repeat: Infinity, ease: "linear" },
              }}
              className="absolute -inset-5 rounded-full"
              style={{
                border: "1px dashed rgba(110,193,255,0.35)",
              }}
            />
            {/* LOAD label — sits at top of orbit ring */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.5 }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-[0.35em] uppercase text-ink-dim"
            >
              LOAD
            </motion.div>
          </div>

          {/* huge name */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="font-display text-4xl md:text-6xl font-extrabold tracking-tight"
          >
            <span className="text-gradient-mixed">{profile.shortName}</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mt-3 font-mono text-[11px] tracking-[0.3em] uppercase text-ink-mute"
          >
            {profile.role}
          </motion.p>

          {/* progress bar */}
          <div className="mt-12 h-px w-64 overflow-hidden bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-[var(--color-orange)] to-[var(--color-blue)]"
              style={{ width: `${pct}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
          <div className="mt-2 font-mono text-[10px] tracking-[0.3em] text-ink-mute">
            {Math.floor(pct).toString().padStart(3, "0")}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
