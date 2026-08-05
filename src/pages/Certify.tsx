import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { courses } from "@/data/courses";
import { getLessonExtras } from "@/data/lessonExtras";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Timer, Award, ShieldCheck, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface Q {
  q: string;
  options: string[];
  answer: number;
}

const TEST_MINUTES = 15;
const MAX_QUESTIONS = 15;
const PASS_PCT = 70;

const shuffle = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const Certify = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const course = courses.find((c) => c.id === courseId);

  const pool = useMemo(() => {
    if (!course) return [] as Q[];
    const qs: Q[] = [];
    for (const l of course.lessons) {
      const ex = getLessonExtras(course.id, l.id);
      if (ex?.quiz) qs.push(...(ex.quiz as Q[]));
    }
    return qs;
  }, [course]);

  const [questions, setQuestions] = useState<Q[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(TEST_MINUTES * 60);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setName((user.user_metadata?.full_name as string) || user.email?.split("@")[0] || "");
  }, [user]);

  useEffect(() => {
    if (!started || finished) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          setFinished(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [started, finished]);

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-32 text-center">
          <p className="text-muted-foreground">Course not found.</p>
        </div>
      </div>
    );
  }

  const score = questions.reduce((a, q, i) => a + (answers[i] === q.answer ? 1 : 0), 0);
  const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const passed = pct >= PASS_PCT;

  const start = () => {
    setQuestions(shuffle(pool).slice(0, Math.min(MAX_QUESTIONS, pool.length)));
    setAnswers({});
    setSecondsLeft(TEST_MINUTES * 60);
    setFinished(false);
    setStarted(true);
  };

  const issue = async () => {
    if (!user) {
      toast.error("Sign in to claim your certificate.");
      navigate("/auth");
      return;
    }
    if (!name.trim()) {
      toast.error("Enter the name to print on the certificate.");
      return;
    }
    setSaving(true);
    const { data, error } = await supabase
      .from("certificates")
      .insert({
        user_id: user.id,
        course_id: course.id,
        course_name: course.fullName,
        learner_name: name.trim(),
        score,
        total: questions.length,
      })
      .select("id")
      .single();
    setSaving(false);
    if (error || !data) {
      toast.error("Could not issue certificate. Please try again.");
      return;
    }
    navigate(`/verify/${data.id}`);
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-20 max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            CERTIFICATION
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
            {course.icon} {course.fullName} <span className="text-gradient-primary">Exam</span>
          </h1>
          <p className="text-muted-foreground">
            {Math.min(MAX_QUESTIONS, pool.length)} questions · {TEST_MINUTES} minutes · pass mark {PASS_PCT}%
          </p>
        </div>

        {!started && (
          <div className="card-glass rounded-2xl p-8 text-center">
            <Award className="w-10 h-10 text-accent mx-auto mb-4" />
            <p className="text-muted-foreground mb-6">
              Questions are drawn from every lesson in this course. You can retake the exam as many times as you like.
            </p>
            {pool.length === 0 ? (
              <p className="text-sm text-destructive">No exam questions are available for this course yet.</p>
            ) : (
              <button
                onClick={start}
                className="px-8 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-bold glow-cyan"
              >
                Start exam
              </button>
            )}
            <div className="mt-4">
              <Link to={`/course/${course.id}`} className="text-sm text-muted-foreground hover:text-primary">
                ← Back to lessons
              </Link>
            </div>
          </div>
        )}

        {started && !finished && (
          <>
            <div className="sticky top-16 z-10 flex items-center justify-between card-glass rounded-xl px-4 py-3 mb-6">
              <span className="text-sm text-muted-foreground">
                Answered {Object.keys(answers).length}/{questions.length}
              </span>
              <span className={`flex items-center gap-2 font-bold ${secondsLeft < 60 ? "text-destructive" : "text-primary"}`}>
                <Timer className="w-4 h-4" /> {mm}:{ss}
              </span>
            </div>

            <div className="space-y-4">
              {questions.map((q, i) => (
                <div key={i} className="card-glass rounded-2xl p-5">
                  <div className="font-semibold mb-3">
                    <span className="text-primary mr-2">{i + 1}.</span>
                    {q.q}
                  </div>
                  <div className="grid gap-2">
                    {q.options.map((o, oi) => (
                      <button
                        key={oi}
                        onClick={() => setAnswers({ ...answers, [i]: oi })}
                        className={`text-left px-4 py-2.5 rounded-lg border text-sm transition-all ${
                          answers[i] === oi
                            ? "border-primary/60 bg-primary/10 text-foreground"
                            : "border-border text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setFinished(true)}
              className="w-full mt-6 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-bold glow-cyan"
            >
              Submit exam
            </button>
          </>
        )}

        {finished && (
          <div className="card-glass rounded-2xl p-8 text-center">
            <div className="text-5xl mb-4">{passed ? "🎉" : "📚"}</div>
            <h2 className="text-2xl font-extrabold mb-1">
              {passed ? "You passed!" : "Not quite yet"}
            </h2>
            <p className="text-muted-foreground mb-6">
              You scored {score}/{questions.length} ({pct}%). {passed ? "Claim your certificate below." : `You need ${PASS_PCT}% to pass — review the lessons and try again.`}
            </p>

            {passed && (
              <div className="max-w-sm mx-auto text-left mb-6">
                <label className="block text-xs text-muted-foreground mb-1">Name on certificate</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-foreground outline-none focus:border-primary"
                />
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-3">
              {passed && (
                <button
                  onClick={issue}
                  disabled={saving}
                  className="px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-bold glow-cyan disabled:opacity-60"
                >
                  {saving ? "Issuing…" : "Get my certificate"}
                </button>
              )}
              <button
                onClick={start}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              >
                <RotateCcw className="w-4 h-4" /> Retake exam
              </button>
              <Link
                to={`/course/${course.id}`}
                className="px-6 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              >
                Back to lessons
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Certify;
