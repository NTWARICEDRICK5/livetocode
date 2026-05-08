import { useEffect, useMemo, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Play, Sparkles, Save, Share2, Trash2, Star, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

type RunnerKind = "iframe" | "wandbox" | "browser-js";

interface PlaygroundLang {
  id: string;
  label: string;
  icon: string;
  wandboxCompiler?: string;
  starter: string;
  runner: RunnerKind;
}

const LANGS: PlaygroundLang[] = [
  {
    id: "python",
    label: "Python",
    icon: "🐍",
    pistonLang: "python",
    pistonVersion: "3.10.0",
    runner: "piston",
    starter: `# Write Python here\nname = "Learner"\nprint(f"Hello, {name}! Welcome to CodeLearn.")\nfor i in range(1, 4):\n    print("Line", i)\n`,
  },
  {
    id: "c",
    label: "C",
    icon: "⚙️",
    pistonLang: "c",
    pistonVersion: "10.2.0",
    runner: "piston",
    starter: `#include <stdio.h>\n\nint main(void) {\n    printf("Hello from C!\\n");\n    for (int i = 1; i <= 3; i++) {\n        printf("Line %d\\n", i);\n    }\n    return 0;\n}\n`,
  },
  {
    id: "cpp",
    label: "C++",
    icon: "⚡",
    pistonLang: "c++",
    pistonVersion: "10.2.0",
    runner: "piston",
    starter: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello from C++!" << endl;\n    for (int i = 1; i <= 3; i++) cout << "Line " << i << endl;\n    return 0;\n}\n`,
  },
  {
    id: "javascript",
    label: "JavaScript",
    icon: "✨",
    pistonLang: "javascript",
    pistonVersion: "18.15.0",
    runner: "piston",
    starter: `// Write JavaScript here\nconst name = "Learner";\nconsole.log(\`Hello, \${name}!\`);\n[1,2,3].forEach(n => console.log("Line", n));\n`,
  },
  {
    id: "html",
    label: "HTML",
    icon: "🌐",
    runner: "iframe",
    starter: `<!doctype html>\n<html>\n  <head><title>My Page</title></head>\n  <body style="font-family:sans-serif;padding:24px;background:#0f172a;color:#e2e8f0">\n    <h1>Hello from HTML 👋</h1>\n    <p>Edit this code and click <b>Run</b>.</p>\n  </body>\n</html>\n`,
  },
  {
    id: "css",
    label: "CSS",
    icon: "🎨",
    runner: "iframe",
    starter: `/* CSS is wrapped into a demo HTML page automatically */\nbody { font-family: sans-serif; padding: 24px; background:#0b1220; color:#e2e8f0; }\nh1 { color:#22d3ee; }\n.card { padding:16px; border-radius:12px; background:#111827; box-shadow:0 10px 30px rgba(34,211,238,.2); }\n`,
  },
  {
    id: "webdemo",
    label: "HTML + CSS + JS",
    icon: "🧪",
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

// URL-safe base64
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
  const [code, setCode] = useState<string>(LANGS[0].starter);
  const [output, setOutput] = useState<string>("");
  const [running, setRunning] = useState(false);
  const [runs, setRuns] = useState<SavedRun[]>(loadRuns);
  const [iframeSrc, setIframeSrc] = useState<string>("");
  const lineRef = useRef<HTMLDivElement>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  // Load shared link / saved code on first mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get("lang");
    const shared = params.get("code");
    if (lang) {
      const found = LANGS.find((l) => l.id === lang);
      if (found) {
        setActive(found);
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

  // When active language changes, restore last code for that language (if any)
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("code")) return;
    const last = localStorage.getItem(`codelearn_pg_last_${active.id}`);
    setCode(last ?? active.starter);
    setOutput("");
    setIframeSrc("");
  }, [active.id]);

  // Persist current draft per language
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
      } else {
        const res = await fetch("https://emkc.org/api/v2/piston/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language: active.pistonLang,
            version: active.pistonVersion,
            files: [{ content: code }],
          }),
        });
        const data = await res.json();
        const stdout = data?.run?.stdout ?? "";
        const stderr = data?.run?.stderr ?? "";
        const compile = data?.compile?.stderr ?? "";
        const combined = [compile, stdout, stderr].filter(Boolean).join("\n").trim();
        setOutput(combined || "(no output)");
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
      // only one best per language
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

  const bestForActive = runs.find((r) => r.langId === active.id && r.best);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              LIVE CODE PLAYGROUND
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
              Run, Save & <span className="text-gradient-primary">Share</span> Your Code
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Write code, run it instantly, save your best solutions and share them with a link.
            </p>
          </div>

          {/* Language tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {LANGS.map((lang) => {
              const isActive = active.id === lang.id;
              return (
                <button
                  key={lang.id}
                  onClick={() => setActive(lang)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                    isActive
                      ? "bg-primary/15 border-primary/50 text-primary glow-cyan"
                      : "bg-secondary/40 border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                  }`}
                >
                  <span className="text-lg">{lang.icon}</span>
                  {lang.label}
                </button>
              );
            })}
          </div>

          {/* Action bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleRun}
                disabled={running}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 disabled:opacity-60"
              >
                {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                {running ? "Running..." : "Run"}
              </button>
              <button
                onClick={() => handleSave(false)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-secondary/40 text-foreground hover:border-primary/50"
              >
                <Save className="w-4 h-4" /> Save run
              </button>
              <button
                onClick={() => handleSave(true)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-yellow-500/40 bg-yellow-500/10 text-yellow-300 hover:border-yellow-500"
              >
                <Star className="w-4 h-4" /> Save as best
              </button>
              <button
                onClick={() => handleShare()}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-secondary/40 text-foreground hover:border-primary/50"
              >
                <Share2 className="w-4 h-4" /> Share link
              </button>
              {bestForActive && (
                <button
                  onClick={() => handleShare(bestForActive.langId, bestForActive.code, "best solution")}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-yellow-500/40 bg-yellow-500/10 text-yellow-300 hover:border-yellow-500"
                  title="Share your saved best solution"
                >
                  <Star className="w-4 h-4" /> Share best
                </button>
              )}
            </div>
            <button
              onClick={() => {
                setCode(active.starter);
                setOutput("");
                setIframeSrc("");
              }}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Reset to starter
            </button>
          </div>

          {/* Editor + Output */}
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Editor */}
            <div className="card-glass rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
              <div className="flex items-center justify-between px-4 py-2.5 bg-[hsl(220_25%_5%)] border-b border-border/50">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-3 text-xs text-muted-foreground font-mono">
                    {active.label} editor · {lineCount} lines
                  </span>
                </div>
              </div>
              <div className="flex bg-[hsl(220_25%_5%)]">
                <div
                  ref={lineRef}
                  className="select-none text-right py-4 px-3 font-mono text-xs text-muted-foreground/60 bg-[hsl(220_25%_4%)] border-r border-border/30 leading-relaxed"
                  aria-hidden
                >
                  {Array.from({ length: lineCount }).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <textarea
                  ref={taRef}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck={false}
                  className="flex-1 bg-transparent text-foreground font-mono text-sm leading-relaxed p-4 outline-none resize-none min-h-[480px]"
                  onKeyDown={(e) => {
                    if (e.key === "Tab") {
                      e.preventDefault();
                      const ta = e.currentTarget;
                      const s = ta.selectionStart;
                      const v = ta.value;
                      const next = v.slice(0, s) + "  " + v.slice(ta.selectionEnd);
                      setCode(next);
                      requestAnimationFrame(() => {
                        ta.selectionStart = ta.selectionEnd = s + 2;
                      });
                    }
                  }}
                />
              </div>
            </div>

            {/* Output */}
            <div className="card-glass rounded-2xl overflow-hidden border border-border/50 shadow-2xl flex flex-col">
              <div className="flex items-center justify-between px-4 py-2.5 bg-[hsl(220_25%_5%)] border-b border-border/50">
                <span className="text-xs text-muted-foreground font-mono flex items-center gap-1.5">
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
                  className="w-full flex-1 min-h-[480px] bg-white"
                />
              ) : (
                <pre className="flex-1 min-h-[480px] m-0 p-4 bg-[hsl(220_25%_3%)] text-sm font-mono text-green-400 whitespace-pre-wrap overflow-auto">
                  {output || "▍ Output will appear here after you click Run."}
                </pre>
              )}
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
                Nothing saved yet. Click <span className="text-foreground font-semibold">Save run</span> or{" "}
                <span className="text-yellow-300 font-semibold">Save as best</span> to keep your work.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                {runs.map((r) => {
                  const lang = LANGS.find((l) => l.id === r.langId);
                  return (
                    <div
                      key={r.id}
                      className="card-glass border border-border/40 rounded-xl p-4 flex flex-col gap-2"
                    >
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
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(r.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <pre className="text-xs font-mono bg-[hsl(220_25%_4%)] border border-border/30 rounded p-2 overflow-hidden max-h-24 whitespace-pre-wrap">
                        {r.code.slice(0, 200)}
                        {r.code.length > 200 ? "…" : ""}
                      </pre>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => {
                            const l = LANGS.find((x) => x.id === r.langId);
                            if (l) {
                              setActive(l);
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
            💡 Python, C, C++ and JavaScript run via the Piston API. HTML & CSS render live in your browser.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Playground;
