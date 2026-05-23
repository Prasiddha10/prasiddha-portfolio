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
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-bg"
        >
          {/* gradient ring */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-10"
          >
            <div
              className="h-24 w-24 rounded-full blur-2xl opacity-70"
              style={{
                background:
                  "conic-gradient(from 0deg, rgba(255,106,61,0.9), rgba(90,169,255,0.9), rgba(255,106,61,0.9))",
              }}
            />
            <motion.div
              className="absolute inset-0 grid place-items-center font-mono text-[10px] tracking-[0.3em] text-ink-dim"
              animate={{ rotate: 360 }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "linear" }}
            >
              <span>LOAD</span>
            </motion.div>
          </motion.div>

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
