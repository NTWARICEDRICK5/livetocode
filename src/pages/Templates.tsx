import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { templates, templateCategories, type Template } from "@/data/templates";
import { Copy, Check, Eye, Code2, LayoutTemplate } from "lucide-react";

const TemplatesPage = () => {
  const [category, setCategory] = useState<string>("All");
  const [selected, setSelected] = useState<Template>(templates[0]);
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  const list = useMemo(
    () => (category === "All" ? templates : templates.filter((t) => t.category === category)),
    [category]
  );

  const copy = async () => {
    await navigator.clipboard.writeText(selected.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-20">
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
            <LayoutTemplate className="w-3.5 h-3.5" />
            HTML &amp; CSS TEMPLATES
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
            Ready-made <span className="text-gradient-primary">Website Templates</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Study real, complete layouts. Preview them live, read the code, copy it, and remix it in the Playground.
          </p>
        </header>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {templateCategories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                category === c
                  ? "bg-primary/15 border-primary/50 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-6">
          <aside className="space-y-3">
            {list.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelected(t)}
                className={`w-full text-left card-glass rounded-xl p-4 transition-all hover:-translate-y-0.5 ${
                  selected.id === t.id ? "border-primary/60 glow-cyan" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">{t.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                    {t.level}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{t.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {t.tags.map((tag) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary">
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </aside>

          <section className="card-glass rounded-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
              <div className="flex gap-1">
                <button
                  onClick={() => setTab("preview")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${
                    tab === "preview" ? "bg-secondary text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <Eye className="w-4 h-4" /> Preview
                </button>
                <button
                  onClick={() => setTab("code")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm ${
                    tab === "code" ? "bg-secondary text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <Code2 className="w-4 h-4" /> Code
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={copy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-secondary/70 text-muted-foreground hover:text-foreground"
                >
                  {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied" : "Copy"}
                </button>
                <a
                  href={`/playground?lang=webdemo&code=${encodeURIComponent(btoa(unescape(encodeURIComponent(selected.code))))}`}
                  className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-gradient-primary text-primary-foreground"
                >
                  Open in Playground
                </a>
              </div>
            </div>

            {tab === "preview" ? (
              <iframe
                title={selected.name}
                srcDoc={selected.code}
                sandbox="allow-scripts allow-modals"
                className="w-full h-[70vh] bg-white"
              />
            ) : (
              <pre className="code-block m-0 p-4 text-xs overflow-auto h-[70vh] whitespace-pre">
                {selected.code}
              </pre>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TemplatesPage;
