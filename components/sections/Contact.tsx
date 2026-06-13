"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import MagneticButton from "@/components/ui/MagneticButton";
import { socials, profile } from "@/lib/data";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "ok" | "error";
const HEADLINE = ["LET'S", "CONNECT"];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  // mouse normalized to [-0.5, 0.5] relative to section center
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // smoothed copies for the headline rotation (slower, softer)
  const smoothMX = useSpring(mouseX, { stiffness: 80, damping: 18, mass: 0.8 });
  const smoothMY = useSpring(mouseY, { stiffness: 80, damping: 18, mass: 0.8 });

  // raw cursor position in section (px) for the glow blob
  const cursorPX = useMotionValue(-500);
  const cursorPY = useMotionValue(-500);
  const glowX = useSpring(cursorPX, { stiffness: 140, damping: 22 });
  const glowY = useSpring(cursorPY, { stiffness: 140, damping: 22 });
  const glow = useMotionTemplate`radial-gradient(420px circle at ${glowX}px ${glowY}px, rgba(255,106,61,0.22), rgba(90,169,255,0.08) 40%, transparent 70%)`;

  // group perspective tilt
  const headRotX = useTransform(smoothMY, [-0.5, 0.5], [8, -8]);
  const headRotY = useTransform(smoothMX, [-0.5, 0.5], [-12, 12]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      cursorPX.set(x);
      cursorPY.set(y);
      mouseX.set(x / r.width - 0.5);
      mouseY.set(y / r.height - 0.5);
    };
    const onLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
      cursorPX.set(-500);
      cursorPY.set(-500);
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [mouseX, mouseY, cursorPX, cursorPY]);

  // ──────── contact form ────────
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      subject: String(fd.get("subject") || "").trim(),
      message: String(fd.get("message") || "").trim(),
    };
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        const detail = data?.errors
          ? Object.values(data.errors as Record<string, string>).join(" · ")
          : data?.detail || "Something went wrong.";
        setMessage(detail);
        return;
      }
      setStatus("ok");
      setMessage(data?.message || "Thanks — your message has been received.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden py-24"
    >
      {/* mouse-follow glow */}
      <motion.div
        aria-hidden
        style={{ background: glow }}
        className="pointer-events-none absolute inset-0 z-0"
      />

      {/* floating particles */}
      <FloatingParticles />

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10">
        {/* ───── eyebrow ───── */}
        <div className="mb-8 flex items-center gap-4 font-mono text-[11px] tracking-[0.32em] uppercase text-ink-mute">
          <span className="text-orange">06</span>
          <span className="h-px w-12 bg-line-strong" />
          <span>Contact</span>
        </div>

        {/* ───── giant mouse-reactive headline ───── */}
        <motion.div
          className="relative [perspective:1400px] [transform-style:preserve-3d]"
        >
          <motion.h2
            style={{ rotateX: headRotX, rotateY: headRotY, fontFamily: "var(--font-anton), Impact, system-ui, sans-serif" }}
            className="select-none font-normal tracking-[-0.02em] leading-[0.86] text-[clamp(72px,18vw,260px)] [transform-style:preserve-3d]"
            aria-label={HEADLINE.join(" ")}
          >
            {HEADLINE.map((word, wi) => (
              <span key={wi} className="block whitespace-nowrap">
                {[...word].map((ch, ci) => (
                  <ReactiveLetter
                    key={`${wi}-${ci}`}
                    ch={ch}
                    index={wi * 8 + ci}
                    accent={wi === 1}
                    mouseX={mouseX}
                    mouseY={mouseY}
                  />
                ))}
              </span>
            ))}
          </motion.h2>

          {/* small floating tag */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
            className="mt-10 max-w-xl text-ink-dim text-lg"
          >
            Open to collaborations on NLP, RAG systems, low-resource language
            tooling, and applied AI research. Reach out , I will resond to each message.
          </motion.div>
        </motion.div>

        {/* ───── form + socials ───── */}
        <div className="mt-24 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            onSubmit={onSubmit}
            className="glass rounded-3xl p-7 md:p-10 grid gap-5"
            noValidate
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field name="name" label="Your name" required autoComplete="name" />
              <Field name="email" label="Email" type="email" required autoComplete="email" />
            </div>
            <Field name="subject" label="Subject" hint="(optional)" />
            <Field name="message" label="Message" required textarea rows={5} />

            <div className="flex flex-wrap items-center gap-5 pt-2">
              <MagneticButton
                type="submit"
                variant="primary"
                disabled={status === "sending"}
                className={cn(status === "sending" && "opacity-60")}
              >
                {status === "sending" ? "Sending…" : "Send Message →"}
              </MagneticButton>
              <span
                role="status"
                aria-live="polite"
                className={cn(
                  "font-mono text-xs tracking-[0.08em]",
                  status === "ok" && "text-emerald-400",
                  status === "error" && "text-red-400",
                  status === "idle" && "text-ink-mute"
                )}
              >
                {message}
              </span>
            </div>
          </motion.form>

          <div className="grid gap-4">
            {socials.map((s, i) => (
              <SocialCard key={s.label} social={s} index={i} />
            ))}
          </div>
        </div>

        <footer className="mt-24 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-line pt-8 font-mono text-[11px] tracking-[0.08em] uppercase text-ink-mute">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <a href="#home" data-cursor="hover" className="hover:text-ink transition-colors">
            Back to top ↑
          </a>
        </footer>
      </div>
    </section>
  );
}

/* ─────────── per-letter motion ─────────── */
function ReactiveLetter({
  ch,
  index,
  accent,
  mouseX,
  mouseY,
}: {
  ch: string;
  index: number;
  accent: boolean;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  // Wave: stiffness decreases as index grows -> each letter lags a bit more
  const stiffness = Math.max(60, 180 - index * 9);
  const damping = 14 + index * 0.6;
  const sx = useSpring(mouseX, { stiffness, damping, mass: 0.6 });
  const sy = useSpring(mouseY, { stiffness, damping, mass: 0.6 });

  // displacement (px) — wider on outer letters for stretch feel
  const intensity = 80 + index * 4;
  const x = useTransform(sx, [-0.5, 0.5], [-intensity, intensity]);
  const y = useTransform(sy, [-0.5, 0.5], [-intensity * 0.55, intensity * 0.55]);
  // independent 3D rotation
  const rotY = useTransform(sx, [-0.5, 0.5], [-24, 24]);
  const rotX = useTransform(sy, [-0.5, 0.5], [16, -16]);
  // elastic stretch — scale slightly increases with mouse distance from center
  const scale = useTransform([sx, sy], (latest) => {
    const a = latest as number[];
    const dx = a[0];
    const dy = a[1];
    const dist = Math.sqrt(dx * dx + dy * dy);
    return 1 + Math.min(0.16, dist * 0.45);
  });

  if (ch === " ") return <span className="inline-block w-[0.32em]">&nbsp;</span>;
  if (ch === "'") {
    return (
      <motion.span
        style={{ x, y, rotateX: rotX, rotateY: rotY, scale }}
        className={cn(
          "inline-block will-change-transform [transform-style:preserve-3d]",
          accent ? "text-gradient-warm" : "text-ink"
        )}
      >
        &rsquo;
      </motion.span>
    );
  }

  return (
    <motion.span
      style={{ x, y, rotateX: rotX, rotateY: rotY, scale }}
      className={cn(
        "inline-block will-change-transform [transform-style:preserve-3d]",
        accent ? "text-gradient-warm" : "text-ink"
      )}
    >
      {ch}
    </motion.span>
  );
}

/* ─────────── floating particles (CSS-only, dot field) ─────────── */
function FloatingParticles() {
  // generate 30 stable positions on first render
  const particles = useRef(
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: (i * 73) % 100,
      y: (i * 137) % 100,
      d: 8 + ((i * 31) % 14),
      delay: ((i * 17) % 40) / 10,
      blue: i % 3 === 0,
    }))
  ).current;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className={cn(
            "absolute rounded-full blur-[1px]",
            p.blue ? "bg-blue/60" : "bg-orange/60"
          )}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: 3,
            height: 3,
            boxShadow: p.blue
              ? "0 0 12px 2px rgba(90,169,255,0.5)"
              : "0 0 12px 2px rgba(255,106,61,0.5)",
          }}
          animate={{ y: [0, -22, 0], opacity: [0.25, 0.85, 0.25] }}
          transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
        />
      ))}
    </div>
  );
}

/* ─────────── form field ─────────── */
function Field({
  name,
  label,
  hint,
  required,
  type = "text",
  textarea = false,
  rows = 4,
  autoComplete,
}: {
  name: string;
  label: string;
  hint?: string;
  required?: boolean;
  type?: string;
  textarea?: boolean;
  rows?: number;
  autoComplete?: string;
}) {
  const inputCls =
    "w-full rounded-xl border border-line-strong bg-black/30 px-4 py-3 text-ink placeholder:text-ink-mute outline-none transition-all duration-300 focus:border-orange focus:bg-black/45 focus:ring-2 focus:ring-orange/25";
  return (
    <label className="grid gap-2">
      <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-mute">
        {label} {hint && <span className="normal-case tracking-normal">{hint}</span>}
      </span>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          rows={rows}
          maxLength={5000}
          className={cn(inputCls, "resize-y min-h-[120px]")}
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          maxLength={type === "email" ? 254 : 200}
          className={inputCls}
        />
      )}
    </label>
  );
}

/* ─────────── social card ─────────── */
function SocialCard({
  social,
  index,
}: {
  social: (typeof socials)[number];
  index: number;
}) {
  return (
    <motion.a
      href={social.href}
      target={social.href.startsWith("http") ? "_blank" : undefined}
      rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
      data-cursor="hover"
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
      whileHover={{ y: -3 }}
      className="group relative flex items-center justify-between rounded-2xl border border-line bg-white/[0.02] px-6 py-5 transition-colors duration-500 hover:border-orange/45"
    >
      <div>
        <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-mute mb-1">
          {social.label}
        </div>
        <div className="font-display text-base md:text-lg text-ink group-hover:text-gradient-warm">
          {social.handle}
        </div>
      </div>
      <span
        aria-hidden
        className="grid h-10 w-10 place-items-center rounded-full border border-line-strong text-ink-dim group-hover:border-orange group-hover:text-orange group-hover:rotate-[-30deg] transition-all duration-500"
      >
        →
      </span>
    </motion.a>
  );
}
