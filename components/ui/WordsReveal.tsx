"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: string;
  className?: string;
  as?: "p" | "h1" | "h2" | "h3" | "span" | "div";
  stagger?: number;
  delay?: number;
};

const word: Variants = {
  hidden: { opacity: 0, y: "60%", filter: "blur(10px)" },
  show: (i: number) => ({
    opacity: 1,
    y: "0%",
    filter: "blur(0px)",
    transition: {
      delay: i,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function WordsReveal({
  children,
  className,
  as = "p",
  stagger = 0.05,
  delay = 0,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const words = children.split(/(\s+)/);

  const Comp = motion[as] as typeof motion.div;

  return (
    <Comp ref={ref as React.Ref<HTMLDivElement>} className={cn(className)} aria-label={children}>
      {words.map((w, i) => {
        if (/^\s+$/.test(w)) return <span key={i}>{w}</span>;
        return (
          <span key={i} className="inline-block overflow-hidden align-bottom">
            <motion.span
              variants={word}
              custom={delay + i * stagger}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              className="inline-block will-change-transform"
            >
              {w}
            </motion.span>
          </span>
        );
      })}
    </Comp>
  );
}
