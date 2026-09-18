import { Link } from "react-router-dom";
import { FlaskConical, Terminal, Check, Lightbulb, Sparkles } from "lucide-react";
import type { CourseLab } from "@/data/courseLabTypes";
import { askMentor, buildLessonContext } from "@/lib/mentor";

const LEVEL_STYLES: Record<CourseLab["level"], string> = {
  Starter: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
  Core: "bg-primary/10 border-primary/30 text-primary",
  Challenge: "bg-amber-500/10 border-amber-500/30 text-amber-300",
};

interface Props {
  courseName: string;
  labs: CourseLab[];
}

const CourseLabs = ({ courseName, labs }: Props) => {
  if (!labs.length) {
    return <p className="text-sm text-muted-foreground">Labs for this course are being finalised.</p>;
  }

  return (
    <div className="space-y-4">
      {labs.map((lab, i) => (
        <div key={lab.title} className="card-glass rounded-2xl p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-bold flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-primary" />
              <span className="text-primary">Lab {i + 1}</span>
              {lab.title}
            </h3>
            <span className={`text-[11px] px-2.5 py-1 rounded-full border shrink-0 ${LEVEL_STYLES[lab.level]}`}>
              {lab.level}
            </span>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{lab.scenario}</p>

          <ol className="space-y-2 mb-4">
            {lab.tasks.map((t, ti) => (
              <li key={t} className="flex gap-2 text-sm text-muted-foreground">
                <span className="text-primary font-mono text-xs mt-0.5">{ti + 1}.</span>
                {t}
              </li>
            ))}
          </ol>

          {lab.starter && (
            <pre className="rounded-xl bg-secondary/50 border border-border/60 p-4 mb-4 overflow-x-auto text-xs leading-relaxed">
              <code className="font-mono text-foreground/90">{lab.starter}</code>
            </pre>
          )}

          <ul className="space-y-1.5 mb-3">
            {lab.successCriteria.map((c) => (
              <li key={c} className="flex gap-2 text-xs text-muted-foreground">
                <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                {c}
              </li>
            ))}
          </ul>

          <p className="flex gap-2 text-xs text-muted-foreground/90 mb-4">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
            {lab.hint}
          </p>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/playground"
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-gradient-primary text-primary-foreground font-semibold"
            >
              <Terminal className="w-3.5 h-3.5" /> Start lab in Playground
            </Link>
            <button
              onClick={() =>
                askMentor({
                  prompt: `I'm doing this ${courseName} lab: "${lab.title}". ${lab.scenario} Walk me through it step by step without giving the full solution first.`,
                  topic: lab.title,
                  context: buildLessonContext({
                    courseName,
                    lessonTitle: lab.title,
                    objective: lab.scenario,
                    bullets: [...lab.tasks, ...lab.successCriteria, lab.hint],
                  }),
                  suggestions: [
                    `What's the first step of "${lab.title}"?`,
                    `Explain the concepts behind "${lab.title}"`,
                    `Review my approach to "${lab.title}"`,
                    `Show a similar worked example`,
                  ],
                })
              }
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-secondary/60 border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" /> Guide me through this lab
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseLabs;
