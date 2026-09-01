import TechIcon from "@/components/TechIcon";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPath } from "@/data/paths";
import { courses } from "@/data/courses";
import { useLearner } from "@/hooks/useLearner";
import { ArrowRight, Briefcase, CheckCircle2, Circle, Compass } from "lucide-react";

const PathDetail = () => {
  const { pathId } = useParams();
  const path = getPath(pathId);
  const { progress } = useLearner();

  if (!path) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-32 pb-24 text-center">
          <h1 className="text-3xl font-extrabold mb-4">Path not found</h1>
          <Link to="/paths" className="text-primary font-semibold">
            Back to all paths
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const stepState = path.steps.map((s) => {
    const course = courses.find((c) => c.id === s.courseId);
    if (!course) return { step: s, course: undefined, pct: 0 };
    const done = progress.filter((r) => r.course_id === course.id && r.completed).length;
    return { step: s, course, pct: Math.round((done / course.lessons.length) * 100) };
  });

  const linked = stepState.filter((s) => s.course);
  const overall = linked.length
    ? Math.round(linked.reduce((a, s) => a + s.pct, 0) / linked.length)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-20">
        <Link
          to="/paths"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <Compass className="w-4 h-4" /> All paths
        </Link>

        <header className="card-glass rounded-2xl p-6 md:p-8 mb-10">
          <div className="flex items-start gap-4 mb-4">
            <span className="w-16 h-16 rounded-2xl bg-secondary/60 border border-border flex items-center justify-center"><TechIcon name={path.id} className="w-9 h-9" /></span>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{path.name}</h1>
              <p className="text-muted-foreground mt-1">{path.tagline}</p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-3xl mb-5">{path.description}</p>
          <div className="flex flex-wrap items-center gap-2 mb-5 text-xs">
            <span className="px-2.5 py-1 rounded-full bg-secondary/60 border border-border">
              {path.level}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-secondary/60 border border-border">
              {path.duration}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/60 border border-border">
              <Briefcase className="w-3 h-3 text-primary" /> {path.careers.join(" · ")}
            </span>
          </div>
          <div className="max-w-md">
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div className="h-full bg-gradient-primary transition-all" style={{ width: `${overall}%` }} />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {overall}% of the courses in this path completed
            </div>
          </div>
        </header>

        <h2 className="text-xl font-bold mb-5">Roadmap</h2>
        <ol className="space-y-4">
          {stepState.map(({ step, course, pct }, i) => (
            <li key={step.title} className="card-glass rounded-2xl p-5 flex gap-4">
              <div className="flex flex-col items-center">
                {pct === 100 ? (
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                ) : (
                  <Circle className="w-6 h-6 text-muted-foreground/50" />
                )}
                {i < stepState.length - 1 && <div className="flex-1 w-px bg-border mt-2" />}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-primary">STAGE {i + 1}</span>
                  {course && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary/60 border border-border">
                      {pct}% complete
                    </span>
                  )}
                  {!course && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary/40 border border-border text-muted-foreground">
                      Guided by the AI Mentor
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-lg">{step.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{step.summary}</p>
                <ul className="flex flex-wrap gap-2 mb-4">
                  {step.outcomes.map((o) => (
                    <li
                      key={o}
                      className="text-xs px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary"
                    >
                      {o}
                    </li>
                  ))}
                </ul>
                {course ? (
                  <Link
                    to={`/course/${course.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-primary text-primary-foreground"
                  >
                    {pct > 0 ? "Continue" : "Start"} {course.name} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <Link
                    to="/playground"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                  >
                    Practise in the Playground <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>
      </main>
      <Footer />
    </div>
  );
};

export default PathDetail;
