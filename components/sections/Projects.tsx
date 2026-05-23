"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { projects, type Project } from "@/lib/data";
import { cn } from "@/lib/utils";

export default function Projects() {
  return (
    <section id="projects" className="relative py-32 md:py-44">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <SectionHeader
          index="03"
          eyebrow="Selected Work"
          title={
            <>
              <span className="text-gradient-warm">Projects</span> that ship.
            </>
          }
        />

        <div className="grid gap-6 md:grid-cols-6">
          {projects.map((p, i) => (
            <ProjectCard key={p.name} project={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  // hover spotlight follows mouse
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 200, damping: 25 });
  const sy = useSpring(my, { stiffness: 200, damping: 25 });
  const bg = useTransform(
    [sx, sy] as const,
    ([x, y]: number[]) =>
      `radial-gradient(280px circle at ${x}px ${y}px, ${
        project.accent === "blue" ? "rgba(90,169,255,0.18)" : "rgba(255,106,61,0.20)"
      }, transparent 60%)`
  );

  const span = project.featured ? "md:col-span-4" : "md:col-span-3";
  const ring = project.accent === "blue" ? "hover:border-blue/40" : "hover:border-orange/45";

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.06 }}
      onPointerMove={(e) => {
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-line bg-[#0c0d11]/60 backdrop-blur-md transition-all duration-500",
        ring,
        span,
        "hover:-translate-y-1"
      )}
      data-cursor="hover"
    >
      {/* spotlight */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: bg }}
      />

      {/* gradient corner */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl opacity-30 transition-opacity duration-500 group-hover:opacity-60",
          project.accent === "blue" ? "bg-blue/40" : "bg-orange/40"
        )}
      />

      <div className="relative flex flex-col gap-5 p-7 md:p-9 min-h-[280px]">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-ink-mute">
            {project.year}
          </span>
          {project.featured && (
            <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-orange flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-orange" /> Featured
            </span>
          )}
        </div>

        <h3 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight">
          {project.name}
        </h3>
        <p className="text-sm font-mono text-blue/90 tracking-wide">{project.blurb}</p>
        <p className="text-ink-dim leading-relaxed">{project.body}</p>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-4">
          <ul className="flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <li
                key={t}
                className="font-mono text-[10px] tracking-[0.12em] uppercase px-2.5 py-1 rounded-full border border-line-strong text-ink-dim"
              >
                {t}
              </li>
            ))}
          </ul>

          <div className="flex gap-2">
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="font-mono text-[11px] tracking-[0.18em] uppercase rounded-full px-4 py-2 bg-white text-bg hover:bg-orange hover:text-white transition-colors"
              >
                Live →
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="font-mono text-[11px] tracking-[0.18em] uppercase rounded-full px-4 py-2 border border-line-strong hover:border-white transition-colors"
              >
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
