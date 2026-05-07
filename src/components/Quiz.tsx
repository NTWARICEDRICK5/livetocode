import { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, Trophy } from "lucide-react";
import type { QuizQuestion } from "@/data/lessonExtras";

interface QuizProps {
  questions: QuizQuestion[];
  onPass?: () => void;
}

const Quiz = ({ questions, onPass }: QuizProps) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = Object.entries(answers).filter(
    ([i, a]) => questions[Number(i)].answer === a
  ).length;
  const total = questions.length;
  const percent = total ? Math.round((score / total) * 100) : 0;
  const passed = percent >= 70;

  const submit = () => {
    setSubmitted(true);
    if (percent >= 70) onPass?.();
  };

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="space-y-5">
      {questions.map((q, i) => {
        const picked = answers[i];
        const isRight = submitted && picked === q.answer;
        const isWrong = submitted && picked !== undefined && picked !== q.answer;
        return (
          <div
            key={i}
            className="card-glass rounded-xl p-5 border border-border/50"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-bold flex-shrink-0">
                {i + 1}
              </div>
              <p className="font-semibold text-foreground">{q.q}</p>
            </div>
            <div className="grid gap-2 ml-10">
              {q.options.map((opt, oi) => {
                const selected = picked === oi;
                const correct = submitted && oi === q.answer;
                const wrong = submitted && selected && oi !== q.answer;
                return (
                  <button
                    key={oi}
                    disabled={submitted}
                    onClick={() => setAnswers((a) => ({ ...a, [i]: oi }))}
                    className={`text-left px-3 py-2.5 rounded-lg text-sm border transition-all flex items-center gap-2
                      ${correct ? "border-green-500/60 bg-green-500/10 text-green-300"
                        : wrong ? "border-red-500/60 bg-red-500/10 text-red-300"
                        : selected ? "border-primary/50 bg-primary/10 text-foreground"
                        : "border-border/50 bg-secondary/40 text-muted-foreground hover:text-foreground hover:border-border"}`}
                  >
                    <span className="font-mono text-xs opacity-70">{String.fromCharCode(65 + oi)}.</span>
                    <span className="flex-1">{opt}</span>
                    {correct && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                    {wrong && <XCircle className="w-4 h-4 text-red-400" />}
                  </button>
                );
              })}
            </div>
            {submitted && q.explain && (
              <p className="ml-10 mt-3 text-xs text-muted-foreground italic">{q.explain}</p>
            )}
          </div>
        );
      })}

      <div className="flex items-center justify-between gap-3 pt-2">
        {!submitted ? (
          <button
            disabled={Object.keys(answers).length !== total}
            onClick={submit}
            className="px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold disabled:opacity-30"
          >
            Submit Quiz
          </button>
        ) : (
          <>
            <div className={`flex items-center gap-2 font-semibold ${passed ? "text-green-400" : "text-yellow-400"}`}>
              <Trophy className="w-5 h-5" />
              Score: {score}/{total} ({percent}%) — {passed ? "Passed!" : "Try again to pass (70%)"}
            </div>
            <button
              onClick={reset}
              className="px-4 py-2 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Retry
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Quiz;
