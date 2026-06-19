"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import MagneticButton from "@/components/ui/MagneticButton";
import { socials, profile, nav } from "@/lib/data";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "ok" | "error";
const HEADLINE = ["LET'S", "CONNECT"];
const YEAR = new Date().getFullYear();

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  // reactive only on fine pointers + when motion is allowed
  const [reactive, setReactive] = useState(false);
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setReactive(fine && !prefersReduced);
  }, [prefersReduced]);

  // mouse normalized to [-0.5, 0.5] relative to section center
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // smoothed springs — shared by ALL letter transforms (2 springs total)
  const smoothMX = useSpring(mouseX, { stiffness: 80, damping: 18, mass: 0.8 });
  const smoothMY = useSpring(mouseY, { stiffness: 80, damping: 18, mass: 0.8 });

  // glow blob position — moves via CSS transform (no gradient repaint)
  const cursorPX = useMotionValue(-500);
  const cursorPY = useMotionValue(-500);
  const glowX = useSpring(cursorPX, { stiffness: 140, damping: 22 });
  const glowY = useSpring(cursorPY, { stiffness: 140, damping: 22 });

  // 3D tilt for headline group only
  const headRotX = useTransform(smoothMY, [-0.5, 0.5], [6, -6]);
  const headRotY = useTransform(smoothMX, [-0.5, 0.5], [-10, 10]);

  useEffect(() => {
    if (!reactive) return;
    const el = sectionRef.current;
    if (!el) return;
    let raf = 0;
    let px = 0, py = 0, pw = 1, ph = 1;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      px = e.clientX - r.left;
      py = e.clientY - r.top;
      pw = r.width;
      ph = r.height;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          cursorPX.set(px);
          cursorPY.set(py);
          mouseX.set(px / pw - 0.5);
          mouseY.set(py / ph - 0.5);
          raf = 0;
        });
      }
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
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reactive, mouseX, mouseY, cursorPX, cursorPY]);

  // ──────── contact form ────────
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
    setFieldErrors({});
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        if (data?.errors) {
          setFieldErrors(data.errors as Record<string, string>);
          setMessage("Please fix the highlighted fields.");
        } else {
          setMessage(data?.detail || "Something went wrong.");
        }
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
      className="relative overflow-hidden py-32 md:py-44"
    >
      {/* glow blob — moves via transform; soft edge baked into gradient (no filter) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute z-0 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          x: glowX,
          y: glowY,
          background:
            "radial-gradient(circle, rgba(255,106,61,0.20) 0%, rgba(255,106,61,0.10) 22%, rgba(90,169,255,0.06) 45%, transparent 68%)",
          willChange: "transform",
        }}
      />

      {/* floating particles — CSS only, zero JS per frame */}
      <FloatingParticles />

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
        {/* ───── eyebrow ───── */}
        <div className="mb-8 flex items-center gap-4 font-mono text-[11px] tracking-[0.32em] uppercase text-ink-mute">
          <span className="text-orange">06</span>
          <span className="h-px w-12 bg-line-strong" />
          <span>Contact</span>
        </div>

        {/* ───── giant mouse-reactive headline ───── */}
        <motion.div className="relative [perspective:1400px]">
          <motion.h2
            style={reactive ? { rotateX: headRotX, rotateY: headRotY } : undefined}
            className="display-2xl font-accent select-none [transform-style:preserve-3d]"
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
                    reactive={reactive}
                    mouseX={smoothMX}
                    mouseY={smoothMY}
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
            Open to collaborations, research opportunities, and interesting
            problems worth solving. Every message gets a reply.
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
              <Field name="name" label="Your name" required autoComplete="name" error={fieldErrors.name} />
              <Field name="email" label="Email" type="email" required autoComplete="email" error={fieldErrors.email} />
            </div>
            <Field name="subject" label="Subject" hint="(optional)" error={fieldErrors.subject} />
            <Field name="message" label="Message" required textarea rows={5} error={fieldErrors.message} />

            <div className="flex flex-wrap items-center gap-5 pt-2">
              <MagneticButton
                type="submit"
                variant="primary"
                disabled={status === "sending"}
                className={cn(status === "sending" && "opacity-60")}
              >
                {status === "sending" ? (
                  <>
                    <span className="inline-block h-3 w-3 rounded-full border-2 border-bg/40 border-t-bg animate-spin" />
                    Sending…
                  </>
                ) : (
                  "Send Message →"
                )}
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

        {/* ───── footer band ───── */}
        <footer className="relative mt-28 overflow-hidden border-t border-line pt-14">
          {/* ghost wordmark */}
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-4 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-display font-black leading-none text-[20vw]"
            style={{
              WebkitTextStroke: "1px rgba(255,255,255,0.05)",
              color: "transparent",
            }}
          >
            {profile.shortName}
          </div>

          <div className="relative grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
            {/* availability + tagline */}
            <div>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-white/[0.03] px-4 py-2 font-mono text-[10px] tracking-[0.2em] uppercase text-ink-dim">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-60 motion-safe:animate-ping" />
                  <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                Available · {profile.location.split(",")[0]} · GMT+5:45
              </div>
              <p className="mt-5 max-w-xs text-sm text-ink-dim leading-relaxed">
                {profile.tagline}
              </p>
            </div>

            {/* nav column */}
            <div>
              <div className="mb-4 font-mono text-[10px] tracking-[0.3em] uppercase text-ink-mute">
                Navigate
              </div>
              <ul className="grid gap-2">
                {nav.map((n) => (
                  <li key={n.id}>
                    <a
                      href={`#${n.id}`}
                      className="text-sm text-ink-dim hover:text-ink transition-colors"
                    >
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* socials column */}
            <div>
              <div className="mb-4 font-mono text-[10px] tracking-[0.3em] uppercase text-ink-mute">
                Connect
              </div>
              <ul className="grid gap-2">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target={s.href.startsWith("http") ? "_blank" : undefined}
                      rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-sm text-ink-dim hover:text-ink transition-colors"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative mt-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-t border-line pt-8 font-mono text-[11px] tracking-[0.08em] uppercase text-ink-mute">
            <span>© {YEAR} {profile.name}</span>
            <span className="text-ink-mute/70">Built with Next.js · Framer Motion</span>
            <a href="#home" className="hover:text-ink transition-colors">
              Back to top ↑
            </a>
          </div>
        </footer>
      </div>
    </section>
  );
}

/* ─── per-letter motion — translate-only, gated on `reactive` ─── */
function ReactiveLetter({
  ch,
  index,
  accent,
  reactive,
  mouseX,
  mouseY,
}: {
  ch: string;
  index: number;
  accent: boolean;
  reactive: boolean;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  const intensity = 50 + index * 4;
  const x = useTransform(mouseX, [-0.5, 0.5], [-intensity, intensity]);
  const y = useTransform(mouseY, [-0.5, 0.5], [-intensity * 0.4, intensity * 0.4]);

  if (ch === " ") return <span className="inline-block w-[0.32em]">&nbsp;</span>;

  const glyph = ch === "'" ? <>&rsquo;</> : ch;
  const cls = cn("inline-block", accent ? "text-gradient-warm" : "text-ink");

  if (!reactive) return <span className={cls}>{glyph}</span>;

  return (
    <motion.span style={{ x, y }} className={cn(cls, "will-change-transform")}>
      {glyph}
    </motion.span>
  );
}

/* ─── floating particles — pure CSS, zero JS animations ─── */
const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  x: (i * 73) % 100,
  y: (i * 137) % 100,
  dur: 8 + ((i * 31) % 14),
  delay: ((i * 17) % 40) / 10,
  blue: i % 3 === 0,
}));

function FloatingParticles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {PARTICLES.map((p) => (
        <span
          key={p.id}
          className={cn("absolute rounded-full", p.blue ? "bg-blue/60" : "bg-orange/60")}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: 3,
            height: 3,
            boxShadow: p.blue
              ? "0 0 12px 2px rgba(90,169,255,0.5)"
              : "0 0 12px 2px rgba(255,106,61,0.5)",
            animation: `float ${p.dur}s ${p.delay}s ease-in-out infinite`,
          }}
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
  error,
}: {
  name: string;
  label: string;
  hint?: string;
  required?: boolean;
  type?: string;
  textarea?: boolean;
  rows?: number;
  autoComplete?: string;
  error?: string;
}) {
  const inputCls = cn(
    "w-full rounded-xl border bg-black/30 px-4 py-3 text-ink placeholder:text-ink-mute outline-none transition-all duration-300 focus:bg-black/45 focus:ring-2",
    error
      ? "border-red-400/60 focus:border-red-400 focus:ring-red-400/25"
      : "border-line-strong focus:border-orange focus:ring-orange/25"
  );
  return (
    <label className="grid gap-2">
      <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-ink-mute">
        {label} {hint && <span className="normal-case tracking-normal">{hint}</span>}
      </span>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          required={required}
          rows={rows}
          maxLength={5000}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${name}-error` : undefined}
          className={cn(inputCls, "resize-y min-h-[120px]")}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          maxLength={type === "email" ? 254 : 200}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${name}-error` : undefined}
          className={inputCls}
        />
      )}
      {error && (
        <span id={`${name}-error`} role="alert" className="font-mono text-[10px] text-red-400">
          {error}
        </span>
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
