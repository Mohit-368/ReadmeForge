import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — ReadmeForge" },
      { name: "description", content: "Learn how ReadmeForge helps developers craft great README files in seconds." },
    ],
  }),
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">About ReadmeForge</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Great projects deserve great READMEs. ReadmeForge is a focused tool that helps you assemble a polished
        README.md without staring at a blank file.
      </p>

      <h2 className="mt-12 font-display text-2xl font-semibold">How it works</h2>
      <ol className="mt-4 space-y-3 text-foreground/90">
        <li><span className="text-primary font-semibold">1.</span> Pick a starting template (or start blank).</li>
        <li><span className="text-primary font-semibold">2.</span> Toggle the sections you want and fill in the fields.</li>
        <li><span className="text-primary font-semibold">3.</span> Watch the live Markdown preview update on the right.</li>
        <li><span className="text-primary font-semibold">4.</span> Copy the Markdown or download <code className="rounded bg-surface-2 px-1.5 py-0.5 text-sm">README.md</code>.</li>
      </ol>

      <h2 className="mt-12 font-display text-2xl font-semibold">Tech</h2>
      <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-muted-foreground md:grid-cols-3">
        {["React 19", "TypeScript", "Vite", "TanStack Router", "Tailwind v4", "Framer Motion"].map((t) => (
          <li key={t} className="rounded-lg border border-border bg-surface/40 px-3 py-2">{t}</li>
        ))}
      </ul>

      <div className="mt-12">
        <Link to="/generator" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground glow-cyan">
          Try the generator →
        </Link>
      </div>
    </div>
  );
}
