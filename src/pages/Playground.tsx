import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Play, Sparkles, Save, Share2, Trash2, Star, Loader2, Check, Files, Code2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { runRemoteCode, type RemoteCodeLanguage } from "@/lib/codeRunner";
import { SNIPPETS } from "@/data/playgroundSnippets";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type RunnerKind = "iframe" | "remote" | "browser-js";

interface PlaygroundLang {
  id: string;
  label: string;
  icon: string;
  filename: string;
  starter: string;
  runner: RunnerKind;
}

const LANGS: PlaygroundLang[] = [
  {
    id: "python",
    label: "Python",
    icon: "🐍",
    filename: "main.py",
    runner: "remote",
    starter: `# Write Python here\nname = "Learner"\nprint(f"Hello, {name}! Welcome to CodeLearn.")\nfor i in range(1, 4):\n    print("Line", i)\n`,
  },
  {
    id: "c",
    label: "C",
    icon: "⚙️",
    filename: "main.c",
    runner: "remote",
    starter: `#include <stdio.h>\n\nint main(void) {\n    printf("Hello from C!\\n");\n    for (int i = 1; i <= 3; i++) {\n        printf("Line %d\\n", i);\n    }\n    return 0;\n}\n`,
  },
  {
    id: "cpp",
    label: "C++",
    icon: "⚡",
    filename: "main.cpp",
    runner: "remote",
    starter: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello from C++!" << endl;\n    for (int i = 1; i <= 3; i++) cout << "Line " << i << endl;\n    return 0;\n}\n`,
  },
  {
    id: "javascript",
    label: "JavaScript",
    icon: "✨",
    filename: "script.js",
    runner: "browser-js",
    starter: `// Write JavaScript here\nconst name = "Learner";\nconsole.log(\`Hello, \${name}!\`);\n[1,2,3].forEach(n => console.log("Line", n));\n`,
  },
  {
    id: "html",
    label: "HTML",
    icon: "🌐",
    filename: "index.html",
    runner: "iframe",
    starter: `<!doctype html>\n<html>\n  <head><title>My Page</title></head>\n  <body style="font-family:sans-serif;padding:24px;background:#0f172a;color:#e2e8f0">\n    <h1>Hello from HTML 👋</h1>\n    <p>Edit this code and click <b>Run</b>.</p>\n  </body>\n</html>\n`,
  },
  {
    id: "css",
    label: "CSS",
    icon: "🎨",
    filename: "styles.css",
    runner: "iframe",
    starter: `/* CSS is wrapped into a demo HTML page automatically */\nbody { font-family: sans-serif; padding: 24px; background:#0b1220; color:#e2e8f0; }\nh1 { color:#22d3ee; }\n.card { padding:16px; border-radius:12px; background:#111827; box-shadow:0 10px 30px rgba(34,211,238,.2); }\n`,
  },
  {
    id: "webdemo",
    label: "Web Demo",
    icon: "🧪",
    filename: "demo.html",
    runner: "iframe",
    starter: `<!doctype html>\n<html>\n<head>\n<style>\n  body { font-family: sans-serif; background:#0b1220; color:#e2e8f0; padding:24px; }\n  button { background:#22d3ee; color:#0b1220; border:0; padding:10px 16px; border-radius:8px; font-weight:700; cursor:pointer; }\n</style>\n</head>\n<body>\n  <h1>Counter Demo</h1>\n  <p>Count: <span id="c">0</span></p>\n  <button onclick="document.getElementById('c').innerText = ++window._n || (window._n=1)">+1</button>\n</body>\n</html>\n`,
  },
];

interface SavedRun {
  id: string;
  langId: string;
  code: string;
  output: string;
  createdAt: number;
  best?: boolean;
  title?: string;
}

const STORAGE_KEY = "codelearn_playground_runs_v1";

const loadRuns = (): SavedRun[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};
const saveRuns = (runs: SavedRun[]) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(runs));

const encode = (s: string) =>
  btoa(unescape(encodeURIComponent(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const decode = (s: string) => {
  try {
    const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
    return decodeURIComponent(escape(atob(b64)));
  } catch {
    return "";
  }
};

const Playground = () => {
  const [active, setActive] = useState<PlaygroundLang>(LANGS[0]);
  const [openTabs, setOpenTabs] = useState<string[]>([LANGS[0].id]);
  const [code, setCode] = useState<string>(LANGS[0].starter);
  const [output, setOutput] = useState<string>("");
  const [running, setRunning] = useState(false);
  const [runs, setRuns] = useState<SavedRun[]>(loadRuns);
  const [iframeSrc, setIframeSrc] = useState<string>("");
  const [cursor, setCursor] = useState<{ line: number; col: number }>({ line: 1, col: 1 });
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get("lang");
    const shared = params.get("code");
    if (lang) {
      const found = LANGS.find((l) => l.id === lang);
      if (found) {
        setActive(found);
        setOpenTabs((t) => (t.includes(found.id) ? t : [...t, found.id]));
        if (shared) {
          const c = decode(shared);
          if (c) {
            setCode(c);
            toast.success("Loaded shared code");
            return;
          }
        }
      }
    }
  }, []);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("code")) return;
    const last = localStorage.getItem(`codelearn_pg_last_${active.id}`);
    setCode(last ?? active.starter);
    setOutput("");
    setIframeSrc("");
  }, [active.id]);

  useEffect(() => {
    localStorage.setItem(`codelearn_pg_last_${active.id}`, code);
  }, [code, active.id]);

  const lineCount = useMemo(() => code.split("\n").length, [code]);

  const buildIframeDoc = (): string => {
    if (active.id === "html" || active.id === "webdemo") return code;
    if (active.id === "css") {
      return `<!doctype html><html><head><style>${code}</style></head><body>
        <h1>CSS Preview</h1>
        <div class="card">
          <p>This is a sample paragraph styled by your CSS.</p>
          <button>A button</button>
        </div>
      </body></html>`;
    }
    return code;
  };

  const runJsInBrowser = (src: string): string => {
    const logs: string[] = [];
    const fmt = (a: any) => {
      if (typeof a === "string") return a;
      try { return JSON.stringify(a); } catch { return String(a); }
    };
    const sandbox = {
      log: (...args: any[]) => logs.push(args.map(fmt).join(" ")),
      error: (...args: any[]) => logs.push("[error] " + args.map(fmt).join(" ")),
      warn: (...args: any[]) => logs.push("[warn] " + args.map(fmt).join(" ")),
      info: (...args: any[]) => logs.push(args.map(fmt).join(" ")),
    };
    try {
      // eslint-disable-next-line no-new-func
      const fn = new Function("console", `"use strict";\n${src}`);
      const result = fn(sandbox);
      if (result !== undefined) logs.push(fmt(result));
    } catch (e: any) {
      logs.push("Error: " + (e?.message ?? String(e)));
    }
    return logs.join("\n") || "(no output)";
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput("");
    try {
      if (active.runner === "iframe") {
        const doc = buildIframeDoc();
        const blob = new Blob([doc], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        setIframeSrc(url);
        setOutput("✓ Rendered in preview");
      } else if (active.runner === "browser-js") {
        setOutput(runJsInBrowser(code));
      } else {
        const result = await runRemoteCode(active.id as RemoteCodeLanguage, code);
        setOutput(result.output || "(no output)");
      }
    } catch (e: any) {
      setOutput("Error: " + (e?.message ?? "Failed to run"));
      toast.error("Run failed");
    } finally {
      setRunning(false);
    }
  };

  const handleSave = (best = false) => {
    const run: SavedRun = {
      id: Math.random().toString(36).slice(2),
      langId: active.id,
      code,
      output,
      createdAt: Date.now(),
      best,
    };
    let next = [run, ...runs];
    if (best) {
      next = next.map((r) =>
        r.langId === active.id && r.id !== run.id ? { ...r, best: false } : r,
      );
    }
    next = next.slice(0, 50);
    setRuns(next);
    saveRuns(next);
    toast.success(best ? "Saved as your best solution ⭐" : "Run saved");
  };

  const handleDelete = (id: string) => {
    const next = runs.filter((r) => r.id !== id);
    setRuns(next);
    saveRuns(next);
  };

  const buildShareUrl = (langId: string, c: string) => {
    const base = `${window.location.origin}${window.location.pathname}`;
    return `${base}?lang=${langId}&code=${encode(c)}`;
  };

  const handleShare = async (langId = active.id, c = code, label = "current code") => {
    const url = buildShareUrl(langId, c);
    try {
      await navigator.clipboard.writeText(url);
      toast.success(`Share link copied (${label})`);
    } catch {
      toast.message("Copy this link", { description: url });
    }
  };

  const switchLang = (lang: PlaygroundLang) => {
    setActive(lang);
    setOpenTabs((t) => (t.includes(lang.id) ? t : [...t, lang.id]));
  };

  const closeTab = (id: string) => {
    setOpenTabs((tabs) => {
      const next = tabs.filter((t) => t !== id);
      if (active.id === id) {
        const fallback = LANGS.find((l) => l.id === (next[next.length - 1] ?? LANGS[0].id))!;
        setActive(fallback);
        if (next.length === 0) {
          return [fallback.id];
        }
      }
      return next.length ? next : [active.id];
    });
  };

  const insertSnippet = (snippet: string) => {
    const ta = taRef.current;
    if (!ta) {
      setCode((c) => c + "\n" + snippet);
      return;
    }
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const next = code.slice(0, start) + snippet + code.slice(end);
    setCode(next);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + snippet.length;
      ta.selectionStart = ta.selectionEnd = pos;
    });
  };

  const updateCursor = () => {
    const ta = taRef.current;
    if (!ta) return;
    const pos = ta.selectionStart;
    const before = ta.value.slice(0, pos);
    const lines = before.split("\n");
    setCursor({ line: lines.length, col: lines[lines.length - 1].length + 1 });
  };

  const bestForActive = runs.find((r) => r.langId === active.id && r.best);
  const snippets = SNIPPETS[active.id] ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              VS CODE-STYLE PLAYGROUND
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
              Code, Run & <span className="text-gradient-primary">Share</span> in any language
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Pick a language, drop in snippets, hit Run. Python, C and C++ run in the cloud — JS, HTML and CSS run live in your browser.
            </p>
          </div>

          {/* IDE shell */}
          <div className="rounded-2xl overflow-hidden border border-border/50 shadow-2xl bg-[hsl(220_25%_5%)]">
            <div className="flex" style={{ minHeight: 560 }}>
              {/* Activity bar (left) */}
              <div className="w-12 bg-[hsl(220_25%_3%)] border-r border-border/40 flex flex-col items-center py-3 gap-2">
                <div className="p-2 rounded text-primary bg-primary/10" title="Explorer">
                  <Files className="w-5 h-5" />
                </div>
                <div className="p-2 rounded text-muted-foreground hover:text-foreground" title="Snippets">
                  <Code2 className="w-5 h-5" />
                </div>
              </div>

              {/* Sidebar / Explorer */}
              <div className="w-52 bg-[hsl(220_25%_4%)] border-r border-border/40 py-3 px-2 hidden md:block">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 mb-2">Languages</div>
                <ul className="space-y-0.5">
                  {LANGS.map((l) => {
                    const isActive = active.id === l.id;
                    return (
                      <li key={l.id}>
                        <button
                          onClick={() => switchLang(l)}
                          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-sm transition-colors ${
                            isActive
                              ? "bg-primary/15 text-primary"
                              : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                          }`}
                        >
                          <span className="text-base">{l.icon}</span>
                          <span className="truncate">{l.filename}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Main editor area */}
              <div className="flex-1 flex flex-col min-w-0">
                {/* Tab bar */}
                <div className="flex items-center bg-[hsl(220_25%_4%)] border-b border-border/40 overflow-x-auto">
                  {openTabs.map((id) => {
                    const l = LANGS.find((x) => x.id === id);
                    if (!l) return null;
                    const isActive = active.id === id;
                    return (
                      <div
                        key={id}
                        className={`flex items-center gap-2 px-3 py-2 text-xs border-r border-border/40 cursor-pointer ${
                          isActive
                            ? "bg-[hsl(220_25%_5%)] text-foreground border-t-2 border-t-primary"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                        onClick={() => switchLang(l)}
                      >
                        <span>{l.icon}</span>
                        <span className="font-mono">{l.filename}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); closeTab(id); }}
                          className="ml-1 opacity-60 hover:opacity-100"
                          aria-label="Close tab"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-[hsl(220_25%_5%)] border-b border-border/40">
                  <button
                    onClick={handleRun}
                    disabled={running}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-60"
                  >
                    {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    {running ? "Running…" : "Run"}
                  </button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border bg-secondary/40 text-sm text-foreground hover:border-primary/50">
                        <Plus className="w-3.5 h-3.5" /> Snippet
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-72 max-h-80 overflow-y-auto">
                      <DropdownMenuLabel>{active.label} snippets</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {snippets.length === 0 ? (
                        <div className="px-2 py-3 text-xs text-muted-foreground">No snippets for this language yet.</div>
                      ) : snippets.map((s) => (
                        <DropdownMenuItem
                          key={s.name}
                          onClick={() => insertSnippet(s.code)}
                          className="flex flex-col items-start gap-0.5 cursor-pointer"
                        >
                          <span className="font-mono text-xs text-primary">{s.name}</span>
                          <span className="text-[11px] text-muted-foreground">{s.description}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <button
                    onClick={() => handleSave(false)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border bg-secondary/40 text-sm hover:border-primary/50"
                  >
                    <Save className="w-3.5 h-3.5" /> Save
                  </button>
                  <button
                    onClick={() => handleSave(true)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-yellow-500/40 bg-yellow-500/10 text-sm text-yellow-300 hover:border-yellow-500"
                  >
                    <Star className="w-3.5 h-3.5" /> Best
                  </button>
                  <button
                    onClick={() => handleShare()}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border bg-secondary/40 text-sm hover:border-primary/50"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </button>
                  {bestForActive && (
                    <button
                      onClick={() => handleShare(bestForActive.langId, bestForActive.code, "best solution")}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-yellow-500/40 bg-yellow-500/10 text-sm text-yellow-300 hover:border-yellow-500"
                    >
                      <Star className="w-3.5 h-3.5" /> Share best
                    </button>
                  )}
                  <div className="ml-auto" />
                  <button
                    onClick={() => { setCode(active.starter); setOutput(""); setIframeSrc(""); }}
                    className="text-xs text-muted-foreground hover:text-foreground underline"
                  >
                    Reset
                  </button>
                </div>

                {/* Editor + Output split */}
                <div className="grid lg:grid-cols-2 flex-1 min-h-[460px]">
                  {/* Editor */}
                  <div className="flex bg-[hsl(220_25%_5%)] border-r border-border/40">
                    <div
                      className="select-none text-right py-3 px-2 font-mono text-[11px] text-muted-foreground/60 bg-[hsl(220_25%_4%)] border-r border-border/30 leading-[1.55]"
                      aria-hidden
                    >
                      {Array.from({ length: lineCount }).map((_, i) => (
                        <div key={i}>{i + 1}</div>
                      ))}
                    </div>
                    <textarea
                      ref={taRef}
                      value={code}
                      onChange={(e) => { setCode(e.target.value); updateCursor(); }}
                      onKeyUp={updateCursor}
                      onClick={updateCursor}
                      spellCheck={false}
                      className="flex-1 bg-transparent text-foreground font-mono text-[13px] leading-[1.55] p-3 outline-none resize-none min-h-[460px]"
                      onKeyDown={(e) => {
                        if (e.key === "Tab") {
                          e.preventDefault();
                          const ta = e.currentTarget;
                          const s = ta.selectionStart;
                          const v = ta.value;
                          const next = v.slice(0, s) + "  " + v.slice(ta.selectionEnd);
                          setCode(next);
                          requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = s + 2; });
                        }
                        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                          e.preventDefault();
                          handleRun();
                        }
                      }}
                    />
                  </div>

                  {/* Output / Preview */}
                  <div className="flex flex-col bg-[hsl(220_25%_3%)]">
                    <div className="flex items-center justify-between px-3 py-2 bg-[hsl(220_25%_4%)] border-b border-border/40">
                      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                        {active.runner === "iframe" ? "Live preview" : "Console output"}
                      </span>
                      {output && active.runner !== "iframe" && (
                        <span className="text-[10px] text-green-400 inline-flex items-center gap-1">
                          <Check className="w-3 h-3" /> done
                        </span>
                      )}
                    </div>
                    {active.runner === "iframe" ? (
                      <iframe
                        key={iframeSrc}
                        src={iframeSrc || "about:blank"}
                        title="Preview"
                        sandbox="allow-scripts allow-modals"
                        className="flex-1 w-full min-h-[420px] bg-white"
                      />
                    ) : (
                      <pre className="flex-1 min-h-[420px] m-0 p-3 text-[13px] font-mono text-green-400 whitespace-pre-wrap overflow-auto">
                        {output || "▍ Output will appear here after you click Run.   (Ctrl/⌘+Enter to run)"}
                      </pre>
                    )}
                  </div>
                </div>

                {/* Status bar */}
                <div className="flex items-center justify-between px-3 py-1.5 bg-primary/15 border-t border-border/40 text-[11px] font-mono text-foreground/80">
                  <div className="flex items-center gap-3">
                    <span>{active.icon} {active.label}</span>
                    <span className="opacity-60">{active.filename}</span>
                  </div>
                  <div className="flex items-center gap-3 opacity-80">
                    <span>Ln {cursor.line}, Col {cursor.col}</span>
                    <span>{lineCount} lines</span>
                    <span>UTF-8</span>
                    <span>{active.runner === "remote" ? "Cloud runner" : active.runner === "browser-js" ? "Browser JS" : "Live preview"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Saved runs */}
          <div className="mt-10">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-2xl font-bold">Your saved runs</h2>
              <span className="text-xs text-muted-foreground">{runs.length} saved (this device)</span>
            </div>
            {runs.length === 0 ? (
              <p className="text-sm text-muted-foreground card-glass border border-border/40 rounded-xl p-6">
                Nothing saved yet. Click <span className="text-foreground font-semibold">Save</span> or{" "}
                <span className="text-yellow-300 font-semibold">Best</span> to keep your work.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                {runs.map((r) => {
                  const lang = LANGS.find((l) => l.id === r.langId);
                  return (
                    <div key={r.id} className="card-glass border border-border/40 rounded-xl p-4 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{lang?.icon}</span>
                          <span className="font-semibold">{lang?.label ?? r.langId}</span>
                          {r.best && (
                            <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-yellow-300 border border-yellow-500/40 bg-yellow-500/10 px-1.5 py-0.5 rounded">
                              <Star className="w-3 h-3" /> Best
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</span>
                      </div>
                      <pre className="text-xs font-mono bg-[hsl(220_25%_4%)] border border-border/30 rounded p-2 overflow-hidden max-h-24 whitespace-pre-wrap">
                        {r.code.slice(0, 200)}{r.code.length > 200 ? "…" : ""}
                      </pre>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            const l = LANGS.find((x) => x.id === r.langId);
                            if (l) {
                              switchLang(l);
                              setTimeout(() => setCode(r.code), 0);
                              setOutput(r.output);
                              toast.success("Loaded into editor");
                            }
                          }}
                          className="text-xs px-2 py-1 rounded border border-border hover:border-primary/50"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => handleShare(r.langId, r.code, "saved run")}
                          className="text-xs px-2 py-1 rounded border border-border hover:border-primary/50 inline-flex items-center gap-1"
                        >
                          <Share2 className="w-3 h-3" /> Share
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="text-xs px-2 py-1 rounded border border-destructive/40 text-destructive hover:bg-destructive/10 inline-flex items-center gap-1 ml-auto"
                        >
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8">
            💡 Tip: press <kbd className="px-1.5 py-0.5 rounded border border-border bg-secondary/40">Ctrl/⌘ + Enter</kbd> to run code.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Playground;
