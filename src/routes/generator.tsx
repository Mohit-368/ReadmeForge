import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import EditorPanel from "@/components/readme/EditorPanel";
import PreviewPanel from "@/components/readme/PreviewPanel";
import QualityScore from "@/components/readme/QualityScore";
import { defaultState, loadState, saveState, clearState } from "@/lib/readme/storage";
import type { ReadmeState } from "@/lib/readme/types";

export const Route = createFileRoute("/generator")({
  component: GeneratorPage,
  head: () => ({
    meta: [
      { title: "Generator — ReadmeForge" },
      { name: "description", content: "Interactive README.md generator with live preview and Markdown export." },
    ],
  }),
});

function GeneratorPage() {
  const [state, setState] = useState<ReadmeState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadState();
    if (loaded) setState(loaded);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const t = setTimeout(() => saveState(state), 400);
    return () => clearTimeout(t);
  }, [state, hydrated]);

  const reset = () => {
    if (!confirm("Reset all fields to defaults?")) return;
    clearState();
    setState(defaultState());
  };

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">README Generator</h1>
          <p className="text-sm text-muted-foreground">Edit on the left, preview live on the right. Auto-saved locally.</p>
        </div>
        <button onClick={reset}
          className="rounded-md border border-border bg-surface/40 px-3 py-1.5 text-xs text-muted-foreground hover:border-destructive/50 hover:text-destructive transition">
          ↺ Reset all fields
        </button>
      </div>

      <div className="mb-6">
        <QualityScore state={state} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <EditorPanel state={state} setState={setState} />
        <PreviewPanel state={state} />
      </div>
    </div>
  );
}
