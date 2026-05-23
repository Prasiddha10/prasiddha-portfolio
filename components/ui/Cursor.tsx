"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { damping: 28, stiffness: 320, mass: 0.4 });
  const sy = useSpring(y, { damping: 28, stiffness: 320, mass: 0.4 });

  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    setEnabled(true);

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const close = t?.closest("a, button, [role=button], input, textarea, [data-cursor='hover']");
      setHovering(!!close);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[100] -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
        style={{ x: sx, y: sy }}
      >
        <motion.span
          className="block rounded-full bg-white"
          animate={{
            width: hovering ? 56 : 10,
            height: hovering ? 56 : 10,
            opacity: hovering ? 0.85 : 1,
          }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[99] -translate-x-1/2 -translate-y-1/2"
        style={{ x, y }}
      >
        <span
          className="block h-1.5 w-1.5 rounded-full bg-orange"
          style={{ boxShadow: "0 0 18px 4px rgba(255,106,61,0.5)" }}
        />
      </motion.div>
    </>
  );
}
