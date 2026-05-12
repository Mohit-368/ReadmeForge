import { useEffect, useRef, useState } from "react";
import type { ReadmeState, Screenshot } from "@/lib/readme/types";
import { TECHS, BADGES, TEMPLATES, TEMPLATE_BUTTONS, SECTIONS, LICENSES } from "@/lib/readme/data";

interface Props {
  state: ReadmeState;
  setState: React.Dispatch<React.SetStateAction<ReadmeState>>;
}

const labelCls = "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block";
const inputCls =
  "w-full rounded-md border border-border bg-background/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors";
const cardCls =
  "rounded-xl border border-border bg-surface/60 backdrop-blur-sm p-5 shadow-sm hover:border-border/80 transition-colors";

export default function EditorPanel({ state, setState }: Props) {
  const setField = <K extends keyof ReadmeState["fields"]>(k: K, v: ReadmeState["fields"][K]) =>
    setState((s) => ({ ...s, fields: { ...s.fields, [k]: v } }));

  const toggleTech = (t: string) =>
    setState((s) => ({ ...s, techs: s.techs.includes(t) ? s.techs.filter((x) => x !== t) : [...s.techs, t] }));

  const toggleBadge = (id: string) =>
    setState((s) => ({ ...s, badges: s.badges.includes(id) ? s.badges.filter((x) => x !== id) : [...s.badges, id] }));

  const applyTemplate = (id: keyof typeof TEMPLATES) => {
    const t = TEMPLATES[id];
    setState((s) => ({
      ...s,
      fields: { ...s.fields, projName: t.name, tagline: t.tag, description: t.desc, features: t.features },
      techs: Array.from(new Set([...s.techs, ...t.techs])),
    }));
  };

  const fileRef = useRef<HTMLInputElement>(null);
  const onFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const ss: Screenshot = { name: file.name, dataUrl: String(reader.result) };
        setState((s) => ({ ...s, screenshots: [...s.screenshots, ss] }));
      };
      reader.readAsDataURL(file);
    });
  };
  const removeShot = (i: number) =>
    setState((s) => ({ ...s, screenshots: s.screenshots.filter((_, idx) => idx !== i) }));

  const f = state.fields;
  const sectionOn = (id: string) => state.sections[id];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <aside className="space-y-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto scrollbar-thin lg:pr-2">
        <div>
          <h3 className={labelCls}>Templates</h3>
          <div className="grid grid-cols-2 gap-2">
            {TEMPLATE_BUTTONS.map((t) => (
              <button
                key={t.id}
                onClick={() => applyTemplate(t.id)}
                className="rounded-lg border border-border bg-surface/40 px-2.5 py-2 text-[12px] text-foreground/80 hover:border-primary/50 hover:text-foreground transition"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className={labelCls}>Sections</h3>
          <div className="space-y-1">
            {SECTIONS.map((s) => (
              <label
                key={s.id}
                className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-surface-2/60"
              >
                <span className="flex items-center gap-2">
                  <span>{s.icon}</span>
                  <span className="text-foreground/90">{s.label}</span>
                </span>
                <input
                  type="checkbox"
                  checked={!!state.sections[s.id]}
                  onChange={(e) =>
                    setState((st) => ({ ...st, sections: { ...st.sections, [s.id]: e.target.checked } }))
                  }
                  className="h-4 w-4 accent-primary"
                />
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* Editor sections */}
      <div className="space-y-5">
        {sectionOn("title") && (
          <Section num={1} title="Project Title & Badges">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Field label="Project Name *">
                <input className={inputCls} value={f.projName} onChange={(e) => setField("projName", e.target.value)} placeholder="AwesomeProject" />
              </Field>
              <Field label="Tagline">
                <input className={inputCls} value={f.tagline} onChange={(e) => setField("tagline", e.target.value)} placeholder="A blazing-fast tool for..." />
              </Field>
              <Field label="GitHub User">
                <input className={inputCls} value={f.ghUser} onChange={(e) => setField("ghUser", e.target.value)} placeholder="octocat" />
              </Field>
              <Field label="Repo Name">
                <input className={inputCls} value={f.repoSlug} onChange={(e) => setField("repoSlug", e.target.value)} placeholder="awesome-project" />
              </Field>
            </div>
            <Field label="Auto Badges — click to toggle">
              <div className="flex flex-wrap gap-1.5">
                {BADGES.map((b) => {
                  const active = state.badges.includes(b.id);
                  return (
                    <button key={b.id} onClick={() => toggleBadge(b.id)}
                      className={`rounded-full border px-3 py-1 text-xs transition ${active ? "border-primary bg-primary/15 text-primary" : "border-border bg-surface/40 text-muted-foreground hover:text-foreground"}`}>
                      {b.label}
                    </button>
                  );
                })}
              </div>
            </Field>
          </Section>
        )}

        {sectionOn("description") && (
          <Section num={2} title="Description">
            <Field label="Short Description">
              <textarea className={inputCls + " min-h-[90px]"} value={f.description} onChange={(e) => setField("description", e.target.value)} placeholder="What does your project do? What problem does it solve?" />
            </Field>
            <Field label="Live Demo URL (optional)">
              <input className={inputCls} value={f.demoUrl} onChange={(e) => setField("demoUrl", e.target.value)} placeholder="https://yourapp.com" />
            </Field>
          </Section>
        )}

        {sectionOn("features") && (
          <Section num={3} title="Features">
            <Field label='Use "### Category" for groups, "- item" for bullets'>
              <textarea className={inputCls + " min-h-[140px] font-mono text-xs"} value={f.features} onChange={(e) => setField("features", e.target.value)} placeholder="### 🔐 Authentication&#10;- Email OTP&#10;- Secure login" />
            </Field>
          </Section>
        )}

        {sectionOn("techstack") && (
          <Section num={4} title="Tech Stack" badge={`${state.techs.length} selected`}>
            <Field label="Click to select your stack">
              <div className="flex flex-wrap gap-1.5">
                {TECHS.map((t) => {
                  const active = state.techs.includes(t.label);
                  return (
                    <button key={t.label} onClick={() => toggleTech(t.label)}
                      className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs transition ${active ? "border-primary bg-primary/15 text-primary" : "border-border bg-surface/40 text-muted-foreground hover:text-foreground"}`}>
                      <span>{t.emoji}</span><span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </Field>
            <Field label="Or add custom (comma separated)">
              <input className={inputCls} value={f.customTech} onChange={(e) => setField("customTech", e.target.value)} placeholder="Celery, Redis, Nginx..." />
            </Field>
          </Section>
        )}

        {sectionOn("installation") && (
          <Section num={5} title="Installation">
            <Field label="Prerequisites">
              <input className={inputCls} value={f.prereqs} onChange={(e) => setField("prereqs", e.target.value)} placeholder="Python 3.10+, Node.js 18+" />
            </Field>
            <Field label="Install Commands (one per line)">
              <textarea className={inputCls + " min-h-[110px] font-mono text-xs"} value={f.installCmds} onChange={(e) => setField("installCmds", e.target.value)} placeholder="git clone ...&#10;cd repo&#10;npm install" />
            </Field>
            <Field label="Env Variables (optional)">
              <textarea className={inputCls + " min-h-[80px] font-mono text-xs"} value={f.envVars} onChange={(e) => setField("envVars", e.target.value)} placeholder="SECRET_KEY=...&#10;DATABASE_URL=..." />
            </Field>
          </Section>
        )}

        {sectionOn("usage") && (
          <Section num={6} title="Usage">
            <Field label="Run command / usage instructions">
              <textarea className={inputCls + " min-h-[80px] font-mono text-xs"} value={f.usageCmd} onChange={(e) => setField("usageCmd", e.target.value)} placeholder="npm run dev" />
            </Field>
          </Section>
        )}

        {sectionOn("structure") && (
          <Section num={7} title="Project Structure">
            <Field label="Paste your folder structure (indented with spaces)">
              <textarea className={inputCls + " min-h-[120px] font-mono text-xs"} value={f.rawStructure} onChange={(e) => setField("rawStructure", e.target.value)} placeholder="src/&#10;  components/&#10;  lib/&#10;package.json" />
            </Field>
          </Section>
        )}

        {sectionOn("screenshots") && (
          <Section num={8} title="Screenshots">
            <Field label="Live demo / video link (optional)">
              <input className={inputCls} value={f.videoUrl} onChange={(e) => setField("videoUrl", e.target.value)} placeholder="https://youtube.com/watch?v=..." />
            </Field>
            <Field label="Drag & drop screenshots">
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}
                className="cursor-pointer rounded-lg border-2 border-dashed border-border bg-surface/30 p-6 text-center text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground transition"
              >
                <div className="text-2xl mb-1">🖼️</div>
                Drop images here or click to browse
                <input ref={fileRef} type="file" multiple accept="image/*" className="hidden" onChange={(e) => onFiles(e.target.files)} />
              </div>
              {state.screenshots.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {state.screenshots.map((s, i) => (
                    <div key={i} className="relative group">
                      <img src={s.dataUrl} alt={s.name} className="rounded-md border border-border h-20 w-full object-cover" />
                      <button onClick={() => removeShot(i)} className="absolute top-1 right-1 rounded-full bg-destructive px-1.5 text-xs text-destructive-foreground opacity-0 group-hover:opacity-100 transition">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </Field>
            <Field label="Or add image URLs (Label | URL, one per line)">
              <textarea className={inputCls + " min-h-[60px] font-mono text-xs"} value={f.imageUrls} onChange={(e) => setField("imageUrls", e.target.value)} placeholder="Landing | https://..." />
            </Field>
          </Section>
        )}

        {sectionOn("api") && (
          <Section num={9} title="API Documentation">
            <Field label="Endpoints — METHOD /path | Description">
              <textarea className={inputCls + " min-h-[100px] font-mono text-xs"} value={f.apiDocs} onChange={(e) => setField("apiDocs", e.target.value)} placeholder="GET /users | List users" />
            </Field>
            <Field label="API Base URL (optional)">
              <input className={inputCls} value={f.apiBase} onChange={(e) => setField("apiBase", e.target.value)} placeholder="https://api.example.com/v1" />
            </Field>
          </Section>
        )}

        {sectionOn("contributing") && (
          <Section num={10} title="Contributing">
            <Field label="Custom contributing notes (optional)">
              <textarea className={inputCls + " min-h-[70px]"} value={f.contribNotes} onChange={(e) => setField("contribNotes", e.target.value)} placeholder="Any specific guidelines..." />
            </Field>
          </Section>
        )}

        {sectionOn("author") && (
          <Section num={11} title="License & Author">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Field label="License">
                <select className={inputCls} value={f.license} onChange={(e) => setField("license", e.target.value)}>
                  {LICENSES.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </Field>
              <Field label="Full Name">
                <input className={inputCls} value={f.authorName} onChange={(e) => setField("authorName", e.target.value)} placeholder="Your Name" />
              </Field>
              <Field label="GitHub Username">
                <input className={inputCls} value={f.authorGh} onChange={(e) => setField("authorGh", e.target.value)} placeholder="username" />
              </Field>
              <Field label="Email (optional)">
                <input className={inputCls} value={f.authorEmail} onChange={(e) => setField("authorEmail", e.target.value)} placeholder="you@email.com" />
              </Field>
              <Field label="LinkedIn (optional)">
                <input className={inputCls} value={f.authorLinkedin} onChange={(e) => setField("authorLinkedin", e.target.value)} placeholder="https://linkedin.com/in/you" />
              </Field>
              <Field label="Portfolio (optional)">
                <input className={inputCls} value={f.authorWebsite} onChange={(e) => setField("authorWebsite", e.target.value)} placeholder="https://yoursite.com" />
              </Field>
            </div>
          </Section>
        )}

        {sectionOn("support") && (
          <Section num={12} title="Support & Donation">
            <Field label="Custom support message (optional)">
              <textarea className={inputCls + " min-h-[60px]"} value={f.supportMsg} onChange={(e) => setField("supportMsg", e.target.value)} />
            </Field>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <Field label="Buy Me a Coffee user">
                <input className={inputCls} value={f.supportBmac} onChange={(e) => setField("supportBmac", e.target.value)} />
              </Field>
              <Field label="Ko-fi user">
                <input className={inputCls} value={f.supportKofi} onChange={(e) => setField("supportKofi", e.target.value)} />
              </Field>
              <Field label="Patreon user">
                <input className={inputCls} value={f.supportPatreon} onChange={(e) => setField("supportPatreon", e.target.value)} />
              </Field>
              <Field label="GitHub Sponsors user">
                <input className={inputCls} value={f.supportGhSponsors} onChange={(e) => setField("supportGhSponsors", e.target.value)} />
              </Field>
            </div>
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ num, title, badge, children }: { num: number; title: string; badge?: string; children: React.ReactNode }) {
  return (
    <section className={cardCls}>
      <header className="mb-4 flex items-center gap-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-xs font-bold text-primary">{num}</span>
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {badge && <span className="ml-auto rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{badge}</span>}
      </header>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className={labelCls}>{label}</span>
      {children}
    </div>
  );
}
