import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "ReadmeForge — Generate professional READMEs in seconds" },
      { name: "description", content: "Build, preview, and export beautiful GitHub README.md files with a modular interactive editor." },
    ],
  }),
});

function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute top-1/3 -left-40 h-[400px] w-[400px] rounded-full bg-accent/20 blur-[120px]" />
        <div className="absolute top-1/2 -right-40 h-[400px] w-[400px] rounded-full bg-cyan-glow/20 blur-[120px]" />
      </div>

      <section className="mx-auto max-w-7xl px-4 pt-20 pb-24 md:pt-28 md:pb-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="mx-auto flex max-w-fit items-center gap-2 rounded-full border border-border bg-surface/40 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-glow animate-pulse" />
          v2.0 — Now built with React + TypeScript
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="mx-auto mt-6 max-w-5xl text-center font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
          GitHub <span className="text-gradient">README.md</span><br /> maker, refined.
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-center text-base text-muted-foreground md:text-lg">
          A modular, interactive README generator. Pick sections, drop in your stack, preview in real time, and export production-ready Markdown.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link to="/generator" className="group relative inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg glow-cyan transition hover:scale-[1.02]">
            Open the Generator
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>
          <Link to="/about" className="rounded-full border border-border bg-surface/40 px-6 py-3 text-sm font-semibold text-foreground/90 backdrop-blur hover:border-primary/40 transition">
            How it works
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}
          className="mx-auto mt-24 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { icon: "⚡", title: "Live Preview", desc: "See rendered Markdown update instantly as you type." },
            { icon: "🧩", title: "Modular Sections", desc: "Toggle 12+ sections on/off — features, API docs, license, and more." },
            { icon: "🚀", title: "8 Templates", desc: "Web App, ML, API, CLI, Mobile, Library, Hackathon, Open Source." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-surface/40 p-6 backdrop-blur-sm hover:border-primary/30 transition">
              <div className="text-2xl">{f.icon}</div>
              <h3 className="mt-3 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
