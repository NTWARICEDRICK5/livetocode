import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Code2, PenTool, ClipboardCheck, Rocket, CheckCircle2, Play } from "lucide-react";
import CodeBlock from "@/components/CodeBlock";
import { useAuth } from "@/hooks/useAuth";
import { upsertProgress } from "@/lib/progressSync";
import Quiz from "@/components/Quiz";
import PracticeEditor from "@/components/PracticeEditor";
import { getLessonExtras } from "@/data/lessonExtras";

type Stage = "explain" | "demo" | "practice" | "test" | "apply";

const STAGES: { id: Stage; label: string; icon: any }[] = [
  { id: "explain", label: "Explain", icon: BookOpen },
  { id: "demo", label: "Demonstrate", icon: Code2 },
  { id: "practice", label: "Practice", icon: PenTool },
  { id: "test", label: "Test", icon: ClipboardCheck },
  { id: "apply", label: "Apply", icon: Rocket },
];

interface Props {
  courseId: string;
  courseName: string;
  lessonId: string;
  explainContent: React.ReactNode;
  demoCode: string;
  demoOutput?: string;
  onAllStagesDone?: () => void;
}

const STORAGE_KEY = "codelearn_stage_progress_v2";

function loadAll(): Record<string, Stage[]> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}
function saveAll(d: Record<string, Stage[]>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
}

const LessonStageTabs = ({
  courseId,
  courseName,
  lessonId,
  explainContent,
  demoCode,
  demoOutput,
  onAllStagesDone,
}: Props) => {
  const key = `${courseId}:${lessonId}`;
  const extras = getLessonExtras(courseId, lessonId);
  const [active, setActive] = useState<Stage>("explain");
  const [done, setDone] = useState<Set<Stage>>(new Set());

  // Load completed stages
  useEffect(() => {
    const all = loadAll();
    setDone(new Set(all[key] || []));
    setActive("explain");
  }, [key]);

  const markDone = (s: Stage) => {
    setDone((prev) => {
      if (prev.has(s)) return prev;
      const next = new Set(prev);
      next.add(s);
      const all = loadAll();
      all[key] = Array.from(next);
      saveAll(all);
      // Check if all 5 done
      if (next.size === STAGES.length) onAllStagesDone?.();
      return next;
    });
  };

  // Auto-mark explain/demo on view
  useEffect(() => {
    if (active === "explain") markDone("explain");
    if (active === "demo") markDone("demo");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <div>
      {/* Stage tab strip */}
      <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-secondary/40 border border-border/50 mb-6">
        {STAGES.map((s) => {
          const Icon = s.icon;
          const isActive = active === s.id;
          const isDone = done.has(s.id);
          const disabled = !extras && (s.id === "practice" || s.id === "test" || s.id === "apply");
          return (
            <button
              key={s.id}
              disabled={disabled}
              onClick={() => setActive(s.id)}
              className={`flex-1 min-w-[110px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all
                ${isActive ? "bg-gradient-primary text-primary-foreground shadow"
                  : isDone ? "text-green-400 hover:bg-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"}
                ${disabled ? "opacity-30 cursor-not-allowed" : ""}`}
              title={disabled ? "Coming soon for this lesson" : s.label}
            >
              {isDone && !isActive ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Stage content */}
      <div>
        {active === "explain" && (
          <div className="card-glass rounded-2xl p-6 md:p-8">
            <div className="prose-custom space-y-1">{explainContent}</div>
          </div>
        )}

        {active === "demo" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Read the example below carefully. You'll write something similar in <span className="text-primary font-semibold">Practice</span>.
            </p>
            <CodeBlock code={demoCode} output={demoOutput} language={courseName} />
          </div>
        )}

        {active === "practice" && extras && (
          <PracticeEditor
            courseId={courseId}
            instructions={extras.practice.instructions}
            starter={extras.practice.starter}
            solution={extras.practice.solution}
            expectedOutputContains={extras.practice.expectedOutputContains}
            onSolved={() => markDone("practice")}
          />
        )}

        {active === "test" && extras && (
          <Quiz questions={extras.quiz} onPass={() => markDone("test")} />
        )}

        {active === "apply" && extras && (
          <div className="card-glass rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="text-xl font-extrabold text-foreground mb-1">{extras.apply.title}</h3>
              <p className="text-muted-foreground">{extras.apply.description}</p>
            </div>
            <pre className="bg-[hsl(220_25%_5%)] text-foreground font-mono text-sm p-4 rounded-lg border border-border/50 whitespace-pre-wrap">
              {extras.apply.starter}
            </pre>
            <div className="flex flex-wrap gap-2">
              <Link
                to={`/playground?lang=${encodeURIComponent(courseId)}&code=${btoa(unescape(encodeURIComponent(extras.apply.starter)))}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold"
              >
                <Play className="w-4 h-4" /> Open in Playground
              </Link>
              <button
                onClick={() => markDone("apply")}
                className={`px-4 py-2 rounded-lg border text-sm font-semibold ${
                  done.has("apply")
                    ? "border-green-500/40 text-green-400 bg-green-500/10"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {done.has("apply") ? "Marked as done" : "I built it — mark done"}
              </button>
            </div>
          </div>
        )}

        {active !== "explain" && active !== "demo" && !extras && (
          <div className="card-glass rounded-2xl p-8 text-center text-muted-foreground">
            Practice content for this lesson is coming soon.
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonStageTabs;
