import { useMemo, useState } from "react";
import { generateMarkdown, renderMarkdownToHtml } from "@/lib/readme/generate";
import type { ReadmeState } from "@/lib/readme/types";

export default function PreviewPanel({ state }: { state: ReadmeState }) {
  const [tab, setTab] = useState<"rendered" | "raw">("rendered");
  const [copied, setCopied] = useState(false);
  const md = useMemo(() => generateMarkdown(state), [state]);
  const html = useMemo(() => renderMarkdownToHtml(md), [md]);

  const copy = async () => {
    await navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="sticky top-24 flex h-[calc(100vh-7rem)] flex-col rounded-xl border border-border bg-surface/60 backdrop-blur-sm overflow-hidden shadow-lg">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface-2/40 px-4 py-2">
        <div className="flex gap-1">
          {(["rendered", "raw"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`rounded-md px-3 py-1 text-xs uppercase tracking-wider transition ${tab === t ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              {t === "rendered" ? "Preview" : "Markdown"}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={copy} className="rounded-md border border-border bg-background/40 px-3 py-1 text-xs hover:border-primary/50 transition">
            {copied ? "✓ Copied" : "Copy"}
          </button>
          <button onClick={download} className="rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground hover:opacity-90 transition">
            ⬇ Download .md
          </button>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {tab === "rendered" ? (
          <div className="prose-readme p-6" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <pre className="p-4 text-xs font-mono text-foreground/90 whitespace-pre-wrap break-words">{md}</pre>
        )}
      </div>
    </div>
  );
}
