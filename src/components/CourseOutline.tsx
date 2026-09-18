import { useState } from "react";
import { Link } from "react-router-dom";
import TechIcon from "@/components/TechIcon";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecommendedForYou from "@/components/RecommendedForYou";
import type { CatalogCourse } from "@/data/catalog";
import { lessonCount } from "@/data/catalog";
import { getCourseDetail } from "@/data/courseDetails";
import {
  Clock,
  Layers,
  Target,
  ListChecks,
  Terminal,
  ArrowLeft,
  Check,
  BookOpen,
  Dumbbell,
  Hammer,
  Link2,
  Sparkles,
  ExternalLink,
  Lightbulb,
  FlaskConical,
  GraduationCap,
} from "lucide-react";
import Quiz from "@/components/Quiz";
import CourseLabs from "@/components/CourseLabs";
import { getCourseAssessment } from "@/data/courseAssessments";

type Tab = "curriculum" | "labs" | "quiz" | "exercises" | "projects" | "resources";

const TABS: { id: Tab; label: string; icon: typeof BookOpen }[] = [
  { id: "curriculum", label: "Lessons", icon: BookOpen },
  { id: "labs", label: "Labs", icon: FlaskConical },
  { id: "quiz", label: "Quiz", icon: GraduationCap },
  { id: "exercises", label: "Exercises", icon: Dumbbell },
  { id: "projects", label: "Projects", icon: Hammer },
  { id: "resources", label: "Resources", icon: Link2 },
];

import { askMentor, buildLessonContext, lessonSuggestions } from "@/lib/mentor";

const CourseOutline = ({ course }: { course: CatalogCourse }) => {
  const [tab, setTab] = useState<Tab>("curriculum");
  const [openLesson, setOpenLesson] = useState<string | null>(null);
  const detail = getCourseDetail(course.id);
  const assessment = getCourseAssessment(course.id);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-20">
        <Link to="/courses" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" /> All courses
        </Link>

        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <span className="w-16 h-16 rounded-2xl bg-secondary/60 border border-border flex items-center justify-center">
              <TechIcon name={course.id} className="w-9 h-9" />
            </span>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight">{course.name}</h1>
              <p className="text-sm text-muted-foreground">{course.category}</p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">{detail?.intro ?? course.description}</p>

          <div className="flex flex-wrap gap-2 mt-5 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary">{course.difficulty}</span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary/60 border border-border text-muted-foreground">
              <Clock className="w-3 h-3" /> {course.estimatedHours}h
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary/60 border border-border text-muted-foreground">
              <Layers className="w-3 h-3" /> {course.modules.length} modules · {lessonCount(course)} lessons
            </span>
            {detail && (
              <>
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary/60 border border-border text-muted-foreground">
                  <Dumbbell className="w-3 h-3" /> {detail.exercises.length} exercises
                </span>
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary/60 border border-border text-muted-foreground">
                  <Hammer className="w-3 h-3" /> {detail.projects.length} projects
                </span>
              </>
            )}
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-5">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                    tab === id
                      ? "bg-primary/15 border-primary/40 text-primary"
                      : "bg-secondary/40 border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
            </div>

            {tab === "curriculum" && (
              <div className="space-y-4">
                {course.modules.map((m, i) => (
                  <div key={m.title} className="card-glass rounded-2xl p-5">
                    <h2 className="font-bold mb-3">
                      <span className="text-primary mr-2">{String(i + 1).padStart(2, "0")}</span>
                      {m.title}
                    </h2>
                    <ul className="space-y-1">
                      {m.lessons.map((l) => {
                        const note = detail?.lessonNotes[l];
                        const isOpen = openLesson === `${m.title}:${l}`;
                        return (
                          <li key={l} className="border-b border-border/40 last:border-0 py-2">
                            <button
                              onClick={() => setOpenLesson(isOpen ? null : `${m.title}:${l}`)}
                              className="w-full text-left flex items-start justify-between gap-3 group"
                            >
                              <span className="text-sm text-foreground/90 group-hover:text-primary transition-colors">{l}</span>
                              <span className="text-[11px] text-muted-foreground shrink-0 mt-0.5">{isOpen ? "Hide" : "Details"}</span>
                            </button>
                            {isOpen && (
                              <div className="mt-2 pl-1 space-y-3">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {note ?? `Learn ${l.toLowerCase()} in the context of ${course.name}.`}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    onClick={() =>
                                      askMentor({
                                        prompt: `Teach me "${l}" in ${course.name}. Explain it, show a small code example, then give me one practice task.`,
                                        topic: l,
                                        context: buildLessonContext({
                                          courseName: course.name,
                                          lessonTitle: l,
                                          objective: note ?? `Learn ${l.toLowerCase()} in the context of ${course.name}.`,
                                          bullets: course.outcomes,
                                          exercises: detail?.exercises,
                                        }),
                                        suggestions: lessonSuggestions(l, detail?.exercises),
                                      })
                                    }
                                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/25 text-primary hover:bg-primary/20 transition-colors"
                                  >
                                    <Sparkles className="w-3.5 h-3.5" /> Learn with AI Mentor
                                  </button>
                                  <Link
                                    to="/playground"
                                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-secondary/60 border border-border text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    <Terminal className="w-3.5 h-3.5" /> Practice in Playground
                                  </Link>
                                </div>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {tab === "labs" && (
              <CourseLabs courseName={course.name} labs={assessment?.labs ?? []} />
            )}

            {tab === "quiz" && (
              <div className="space-y-4">
                {assessment?.quiz.length ? (
                  <>
                    <div className="card-glass rounded-2xl p-5">
                      <h3 className="font-bold mb-1 flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-primary" /> {course.name} knowledge check
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {assessment.quiz.length} questions · score 70% or higher to pass.
                      </p>
                    </div>
                    <Quiz questions={assessment.quiz} />
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">The quiz for this course is being finalised.</p>
                )}
              </div>
            )}

            {tab === "exercises" && (
              <div className="space-y-4">
                {(detail?.exercises ?? []).map((ex, i) => (
                  <div key={ex.title} className="card-glass rounded-2xl p-5">
                    <h3 className="font-bold mb-2">
                      <span className="text-primary mr-2">Exercise {i + 1}</span>
                      {ex.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">{ex.prompt}</p>
                    <p className="flex gap-2 text-xs text-muted-foreground/90 mb-4">
                      <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                      {ex.hint}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to="/playground"
                        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-gradient-primary text-primary-foreground font-semibold"
                      >
                        <Terminal className="w-3.5 h-3.5" /> Solve in Playground
                      </Link>
                      <button
                        onClick={() =>
                          askMentor({
                            prompt: `I'm working on this ${course.name} exercise: ${ex.title}. ${ex.prompt} Guide me step by step without giving the full solution first.`,
                            topic: ex.title,
                            context: buildLessonContext({
                              courseName: course.name,
                              lessonTitle: ex.title,
                              objective: ex.prompt,
                              bullets: [ex.hint],
                              exercises: detail?.exercises,
                            }),
                            suggestions: [
                              `Give me the first step for "${ex.title}"`,
                              `What concept does "${ex.title}" test?`,
                              `Check my approach to "${ex.title}"`,
                              `Show a worked example similar to "${ex.title}"`,
                            ],
                          })
                        }
                        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-secondary/60 border border-border text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5" /> Get a hint from AI Mentor
                      </button>
                    </div>
                  </div>
                ))}
                {!detail?.exercises.length && (
                  <p className="text-sm text-muted-foreground">Exercises for this course are being finalised.</p>
                )}
              </div>
            )}

            {tab === "projects" && (
              <div className="space-y-4">
                {(detail?.projects ?? []).map((p, i) => (
                  <div key={p.title} className="card-glass rounded-2xl p-5">
                    <h3 className="font-bold mb-2">
                      <span className="text-primary mr-2">Project {i + 1}</span>
                      {p.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.brief}</p>
                    <ol className="space-y-2 mb-4">
                      {p.steps.map((s, si) => (
                        <li key={s} className="flex gap-2 text-sm text-muted-foreground">
                          <span className="text-primary font-mono text-xs mt-0.5">{si + 1}.</span>
                          {s}
                        </li>
                      ))}
                    </ol>
                    <div className="flex flex-wrap gap-2">
                      {p.skills.map((s) => (
                        <span key={s} className="text-[11px] px-2.5 py-1 rounded-full bg-secondary/60 border border-border text-muted-foreground">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
                {!detail?.projects.length && (
                  <p className="text-sm text-muted-foreground">Projects for this course are being finalised.</p>
                )}
              </div>
            )}

            {tab === "resources" && (
              <div className="card-glass rounded-2xl p-5 space-y-3">
                {(detail?.resources ?? []).map((r) => (
                  <a
                    key={r.url}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 text-sm text-muted-foreground hover:text-primary transition-colors border-b border-border/40 last:border-0 pb-3 last:pb-0"
                  >
                    {r.label}
                    <ExternalLink className="w-4 h-4 shrink-0" />
                  </a>
                ))}
                {!detail?.resources.length && (
                  <p className="text-sm text-muted-foreground">Reference links coming shortly.</p>
                )}
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="card-glass rounded-2xl p-5">
              <h3 className="flex items-center gap-2 font-bold mb-3"><Target className="w-4 h-4 text-primary" /> What you'll learn</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {course.outcomes.map((o) => (
                  <li key={o} className="flex gap-2"><Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />{o}</li>
                ))}
              </ul>
            </div>

            <div className="card-glass rounded-2xl p-5">
              <h3 className="flex items-center gap-2 font-bold mb-3"><ListChecks className="w-4 h-4 text-primary" /> Skills & prerequisites</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {course.skills.map((s) => (
                  <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-secondary/60 border border-border text-muted-foreground">{s}</span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {course.prerequisites.length ? `Prerequisites: ${course.prerequisites.join(", ")}` : "No prerequisites — start today."}
              </p>
            </div>

            <div className="card-glass rounded-2xl p-5">
              <h3 className="flex items-center gap-2 font-bold mb-2"><Terminal className="w-4 h-4 text-primary" /> Practice now</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Work through the lessons, then build the projects. Your AI Mentor can explain any topic on this page.
              </p>
              <Link to="/playground" className="block text-center px-4 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold mb-2">
                Open Playground
              </Link>
              <button
                onClick={() =>
                  askMentor({
                    prompt: `I want to start learning ${course.name}. Give me a study plan based on this curriculum: ${course.modules.map((m) => m.title).join(", ")}.`,
                    topic: course.name,
                    context: buildLessonContext({
                      courseName: course.name,
                      lessonTitle: `${course.name} curriculum`,
                      objective: detail?.intro ?? course.description,
                      bullets: course.modules.map((m) => `${m.title}: ${m.lessons.join(", ")}`),
                      exercises: detail?.exercises,
                    }),
                    suggestions: lessonSuggestions(course.name, detail?.exercises),
                  })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-primary/30 text-primary text-sm font-semibold hover:bg-primary/10 transition-colors"
              >
                Ask AI Mentor for a plan
              </button>
            </div>
          </aside>
        </div>

        <RecommendedForYou currentCourseId={course.id} />
      </main>
      <Footer />
    </div>
  );
};

export default CourseOutline;
