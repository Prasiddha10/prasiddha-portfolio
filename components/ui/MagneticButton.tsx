"use client";

import { HTMLMotionProps, motion, useMotionValue, useSpring } from "framer-motion";
import { forwardRef, useRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "outline";

type CommonProps = {
  variant?: Variant;
  strength?: number;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps = CommonProps &
  Omit<HTMLMotionProps<"button">, "ref" | "children"> & {
    as?: "button";
    href?: never;
  };

type AnchorProps = CommonProps &
  Omit<HTMLMotionProps<"a">, "ref" | "children"> & {
    as: "a";
    href: string;
  };

type Props = ButtonProps | AnchorProps;

const styles: Record<Variant, string> = {
  primary:
    "bg-white text-bg hover:bg-orange hover:text-white border border-transparent",
  ghost:
    "bg-white/[0.04] text-ink border border-line-strong hover:bg-white/[0.08]",
  outline:
    "bg-transparent text-ink border border-line-strong hover:border-white",
};

const MagneticButton = forwardRef<HTMLElement, Props>(function MagneticButton(
  { variant = "primary", strength = 0.35, className, children, ...rest },
  fwd
) {
  const localRef = useRef<HTMLElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 240, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 240, damping: 18, mass: 0.4 });

  const onMove = (e: React.PointerEvent) => {
    const el = localRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * strength);
    y.set((e.clientY - r.top - r.height / 2) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "group relative inline-flex items-center gap-2 rounded-full px-6 py-3 font-mono text-[12px] tracking-[0.18em] uppercase transition-colors duration-300 will-change-transform disabled:opacity-50 disabled:cursor-not-allowed";

  const setRef = (node: HTMLElement | null) => {
    localRef.current = node;
    if (typeof fwd === "function") fwd(node);
    else if (fwd) (fwd as React.MutableRefObject<HTMLElement | null>).current = node;
  };

  const isAnchor = (rest as AnchorProps).as === "a";

  if (isAnchor) {
    const { as: _as, ...anchorRest } = rest as AnchorProps;
    return (
      <motion.a
        ref={setRef as React.Ref<HTMLAnchorElement>}
        style={{ x: sx, y: sy }}
        onPointerMove={onMove}
        onPointerLeave={reset}
        className={cn(base, styles[variant], className)}
        data-cursor="hover"
        {...anchorRest}
      >
        <span className="pointer-events-none">{children}</span>
      </motion.a>
    );
  }

  const { as: _as, ...buttonRest } = rest as ButtonProps;
  return (
    <motion.button
      ref={setRef as React.Ref<HTMLButtonElement>}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={cn(base, styles[variant], className)}
      data-cursor="hover"
      {...buttonRest}
    >
      <span className="pointer-events-none">{children}</span>
    </motion.button>
  );
});

export default MagneticButton;
