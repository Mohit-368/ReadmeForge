import { useMemo, useState } from "react";
import { computeQuality } from "@/lib/readme/quality";
import type { ReadmeState } from "@/lib/readme/types";

const TONE = {
  great: { text: "text-emerald-400", stroke: "stroke-emerald-400", bar: "bg-emerald-400", pill: "border-emerald-400/40 bg-emerald-400/10 text-emerald-400" },
  good:  { text: "text-lime-400",    stroke: "stroke-lime-400",    bar: "bg-lime-400",    pill: "border-lime-400/40 bg-lime-400/10 text-lime-400" },
  ok:    { text: "text-yellow-400",  stroke: "stroke-yellow-400",  bar: "bg-yellow-400",  pill: "border-yellow-400/40 bg-yellow-400/10 text-yellow-400" },
  low:   { text: "text-orange-400",  stroke: "stroke-orange-400",  bar: "bg-orange-400",  pill: "border-orange-400/40 bg-orange-400/10 text-orange-400" },
  bad:   { text: "text-red-400",     stroke: "stroke-red-400",     bar: "bg-red-400",     pill: "border-red-400/40 bg-red-400/10 text-red-400" },
};

export default function QualityScore({ state }: { state: ReadmeState }) {
  const r = useMemo(() => computeQuality(state), [state]);
  const [open, setOpen] = useState(true);
  const tone = TONE[r.tone];

  const radius = 30;
  const circ = 2 * Math.PI * radius;
  const dash = (r.score / 100) * circ;

  const failed = r.checks.filter((c) => !c.passed);

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-surface/60 backdrop-blur-sm shadow-sm">
      {/* Header */}
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-3 px-5 py-4 text-left">
        <span className="text-2xl">📊</span>
        <h3 className="font-display text-base font-semibold tracking-tight text-foreground">
          README Quality Score
        </h3>
        <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${tone.pill}`}>{r.score}</span>
        <span className={`ml-auto text-xs font-bold uppercase tracking-[0.2em] ${tone.text}`}>
          {r.status}
        </span>
        <span className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
      </button>

      {open && (
        <div className="border-t border-border px-5 py-5">
          {/* Score row */}
          <div className="flex items-center gap-5">
            <div className="relative h-20 w-20 shrink-0">
              <svg viewBox="0 0 72 72" className="h-20 w-20 -rotate-90">
                <circle cx="36" cy="36" r={radius} className="fill-none stroke-border" strokeWidth="6" />
                <circle
                  cx="36" cy="36" r={radius}
                  className={`fill-none ${tone.stroke} transition-all duration-700`}
                  strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={`${dash} ${circ}`}
                />
              </svg>
              <div className={`absolute inset-0 flex items-center justify-center font-display text-lg font-bold ${tone.text}`}>
                {r.score}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className={`font-display text-3xl font-bold ${tone.text}`}>{r.score}</span>
                <span className="text-2xl text-muted-foreground/60">/</span>
                <span className="font-display text-2xl text-muted-foreground">100</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{r.subtitle}</p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border/60">
                <div
                  className={`h-full ${tone.bar} transition-all duration-700`}
                  style={{ width: `${r.score}%` }}
                />
              </div>
            </div>
          </div>

          {/* Suggestions */}
          {failed.length > 0 ? (
            <>
              <h4 className="mt-6 mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Suggestions to Improve
              </h4>
              <ul className="space-y-2">
                {failed.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-start gap-3 rounded-lg border border-border bg-background/40 px-4 py-3 text-sm text-foreground/90"
                  >
                    <span className="text-xl leading-none">{c.icon}</span>
                    <span className="flex-1 leading-relaxed">{c.suggestion}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="mt-6 rounded-lg border border-emerald-400/30 bg-emerald-400/5 px-4 py-3 text-sm text-emerald-400">
              🎉 All checks passed — your README is complete!
            </div>
          )}

          <p className="mt-4 text-[11px] text-muted-foreground">
            {r.passedCount} of {r.totalCount} checks passed
          </p>
        </div>
      )}
    </section>
  );
}
