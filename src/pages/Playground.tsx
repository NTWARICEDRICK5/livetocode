import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Play, Sparkles } from "lucide-react";

interface PlaygroundLang {
  id: string;
  label: string;
  icon: string;
  color: string;
  slug: string; // OneCompiler slug
}

const languages: PlaygroundLang[] = [
  { id: "python", label: "Python", icon: "🐍", color: "#3776AB", slug: "python" },
  { id: "c", label: "C", icon: "⚙️", color: "#A8B9CC", slug: "c" },
  { id: "cpp", label: "C++", icon: "⚡", color: "#00599C", slug: "cpp" },
  { id: "javascript", label: "JavaScript", icon: "✨", color: "#F7DF1E", slug: "javascript" },
  { id: "html", label: "HTML/CSS/JS", icon: "🌐", color: "#E34F26", slug: "html-css-js" },
];

const Playground = () => {
  const [active, setActive] = useState<PlaygroundLang>(languages[0]);

  const embedUrl = `https://onecompiler.com/embed/${active.slug}?hideLanguageSelection=true&hideTitle=true&theme=dark&codeChangeEvent=true`;

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
              Run Your <span className="text-gradient-primary">Own Code</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Write, edit and execute code directly in the browser — no installation needed.
            </p>
          </div>

          {/* Language tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {languages.map((lang) => {
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

          {/* Editor */}
          <div className="card-glass rounded-2xl overflow-hidden border border-border/50 shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2.5 bg-[hsl(220_25%_5%)] border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="ml-3 text-xs text-muted-foreground font-mono flex items-center gap-1.5">
                  <Play className="w-3 h-3 text-primary" />
                  {active.label} editor
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground/70">Powered by OneCompiler</span>
            </div>
            <iframe
              key={active.id}
              src={embedUrl}
              title={`${active.label} playground`}
              className="w-full h-[640px] bg-[hsl(220_25%_5%)] border-0"
              allow="clipboard-write"
            />
          </div>

          {/* Tip */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            💡 Tip: write code on the left, click <span className="text-primary font-semibold">Run</span> to see the output instantly.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Playground;
