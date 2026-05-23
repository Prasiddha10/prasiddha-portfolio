"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function BackgroundFX() {
  const { scrollYProgress } = useScroll();
  const yWarm = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const yCool = useTransform(scrollYProgress, [0, 1], ["0%", "-25%"]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden noise">
      {/* deep base */}
      <div className="absolute inset-0 bg-bg" />

      {/* subtle grid */}
      <div className="absolute inset-0 grid-bg opacity-60 [mask-image:radial-gradient(80%_60%_at_50%_40%,black,transparent)]" />

      {/* warm aurora */}
      <motion.div
        style={{ y: yWarm }}
        className="absolute -top-40 -right-40 h-[60rem] w-[60rem] rounded-full opacity-60"
      >
        <div
          className="h-full w-full rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(255,106,61,0.32), rgba(255,106,61,0.10) 50%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* cool aurora */}
      <motion.div
        style={{ y: yCool }}
        className="absolute -bottom-40 -left-40 h-[60rem] w-[60rem] rounded-full opacity-70"
      >
        <div
          className="h-full w-full rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(90,169,255,0.28), rgba(90,169,255,0.08) 50%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* vignette */}
      <div className="absolute inset-0 [background:radial-gradient(120%_80%_at_50%_50%,transparent_55%,rgba(0,0,0,0.7))]" />
    </div>
  );
}
