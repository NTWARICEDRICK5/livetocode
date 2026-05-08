import { useEffect, useMemo, useRef, useState } from "react";
import { Play, RotateCcw, CheckCircle2, Lightbulb } from "lucide-react";

interface PracticeEditorProps {
  courseId: string;
  instructions: string;
  starter: string;
  solution: string;
  expectedOutputContains?: string;
  onSolved?: () => void;
}

// Map course ids to Wandbox compilers (HTML/CSS run in iframe, JS runs in-browser)
const WANDBOX: Record<string, string> = {
  python: "cpython-3.13.8",
  c: "gcc-head-c",
  cpp: "gcc-head",
};

const buildHtmlDoc = (code: string, courseId: string) => {
  // For HTML lessons the code is full markup; for CSS it usually contains <style> + markup.
  // We just inject as-is.
  if (courseId === "html" || courseId === "css") {
    return code;
  }
  // For JS DOM-style lessons in javascript, allow raw HTML+script too.
  return code;
};

const PracticeEditor = ({
  courseId,
  instructions,
  starter,
  solution,
  expectedOutputContains,
  onSolved,
}: PracticeEditorProps) => {
  const [code, setCode] = useState(starter);
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [solved, setSolved] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const isWeb = courseId === "html" || courseId === "css" || (courseId === "javascript" && /<\w+/.test(starter));

  useEffect(() => {
    setCode(starter);
    setOutput("");
    setSolved(false);
    setShowSolution(false);
  }, [starter]);

  const runWeb = () => {
    const doc = buildHtmlDoc(code, courseId);
    const iframe = iframeRef.current;
    if (!iframe) return;
    iframe.srcdoc = doc;
    setOutput("(rendered in preview)");
    checkSolved(code);
  };

  const runPiston = async () => {
    const cfg = PISTON[courseId];
    if (!cfg) return;
    setRunning(true);
    setOutput("Running...");
    try {
      const res = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: cfg.language,
          version: cfg.version,
          files: [{ name: cfg.filename, content: code }],
        }),
      });
      const data = await res.json();
      const out = (data.run?.stdout || "") + (data.run?.stderr ? `\n${data.run.stderr}` : "");
      setOutput(out || "(no output)");
      checkSolved(out);
    } catch (e: any) {
      setOutput("Error: " + (e?.message || "failed to run"));
    } finally {
      setRunning(false);
    }
  };

  const checkSolved = (against: string) => {
    if (!expectedOutputContains) return;
    if (against.includes(expectedOutputContains)) {
      setSolved(true);
      onSolved?.();
    }
  };

  const run = () => (isWeb ? runWeb() : runPiston());

  const reset = () => {
    setCode(starter);
    setOutput("");
    setSolved(false);
  };

  return (
    <div className="space-y-4">
      <div className="card-glass rounded-xl p-4 border border-primary/20 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-sm text-foreground">
          <span className="font-semibold text-primary">Task: </span>
          {instructions}
        </p>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
        className="w-full h-56 font-mono text-sm bg-[hsl(220_25%_5%)] text-foreground border border-border/50 rounded-xl p-4 resize-y focus:outline-none focus:border-primary/50"
      />

      <div className="flex flex-wrap gap-2">
        <button
          onClick={run}
          disabled={running}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold disabled:opacity-50"
        >
          <Play className="w-4 h-4" /> {running ? "Running..." : "Run"}
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-4 h-4" /> Reset
        </button>
        <button
          onClick={() => setShowSolution((s) => !s)}
          className="px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground"
        >
          {showSolution ? "Hide" : "Show"} solution
        </button>
        {solved && (
          <span className="ml-auto flex items-center gap-1.5 text-green-400 text-sm font-semibold">
            <CheckCircle2 className="w-4 h-4" /> Solved!
          </span>
        )}
      </div>

      {isWeb ? (
        <div className="rounded-xl overflow-hidden border border-border/50">
          <div className="px-3 py-2 bg-[hsl(220_25%_7%)] text-xs text-muted-foreground border-b border-border/50">
            Live preview
          </div>
          <iframe
            ref={iframeRef}
            title="practice preview"
            className="w-full h-64 bg-white"
            sandbox="allow-scripts allow-modals"
          />
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden border border-border/50">
          <div className="px-3 py-2 bg-[hsl(220_25%_7%)] text-xs text-muted-foreground border-b border-border/50">
            Output
          </div>
          <pre className="bg-[hsl(220_25%_3%)] text-green-400 font-mono text-sm p-4 min-h-[6rem] whitespace-pre-wrap">{output}</pre>
        </div>
      )}

      {showSolution && (
        <div className="rounded-xl overflow-hidden border border-border/50">
          <div className="px-3 py-2 bg-[hsl(220_25%_7%)] text-xs text-muted-foreground border-b border-border/50">
            Reference solution
          </div>
          <pre className="bg-[hsl(220_25%_5%)] text-foreground font-mono text-sm p-4 whitespace-pre-wrap">{solution}</pre>
        </div>
      )}
    </div>
  );
};

export default PracticeEditor;
