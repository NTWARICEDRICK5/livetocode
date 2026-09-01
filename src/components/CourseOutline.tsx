import TechIcon from "@/components/TechIcon";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RecommendedForYou from "@/components/RecommendedForYou";
import type { CatalogCourse } from "@/data/catalog";
import { lessonCount } from "@/data/catalog";
import { Clock, Layers, Target, ListChecks, Terminal, ArrowLeft, Check } from "lucide-react";

const CourseOutline = ({ course }: { course: CatalogCourse }) => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container mx-auto px-4 pt-28 pb-20">
      <Link to="/courses" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="w-4 h-4" /> All courses
      </Link>

      <header className="mb-10">
        <div className="flex items-center gap-4 mb-4">
          <span className="w-16 h-16 rounded-2xl bg-secondary/60 border border-border flex items-center justify-center"><TechIcon name={course.id} className="w-9 h-9" /></span>
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">{course.name}</h1>
            <p className="text-sm text-muted-foreground">{course.category}</p>
          </div>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl">{course.description}</p>

        <div className="flex flex-wrap gap-2 mt-5 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/25 text-primary">{course.difficulty}</span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary/60 border border-border text-muted-foreground">
            <Clock className="w-3 h-3" /> {course.estimatedHours}h
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary/60 border border-border text-muted-foreground">
            <Layers className="w-3 h-3" /> {course.modules.length} modules · {lessonCount(course)} lessons
          </span>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {course.modules.map((m, i) => (
            <div key={m.title} className="card-glass rounded-2xl p-5">
              <h2 className="font-bold mb-3">
                <span className="text-primary mr-2">{String(i + 1).padStart(2, "0")}</span>
                {m.title}
              </h2>
              <ul className="space-y-2">
                {m.lessons.map((l) => (
                  <li key={l} className="flex items-center justify-between gap-3 text-sm text-muted-foreground border-b border-border/40 last:border-0 pb-2 last:pb-0">
                    <span>{l}</span>
                    <span className="text-[11px] text-muted-foreground/60 shrink-0">Coming soon</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
              Interactive lessons for this curriculum are being written. Meanwhile, experiment in the Playground
              or ask the AI Mentor about any topic above.
            </p>
            <Link to="/playground" className="block text-center px-4 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold">
              Open Playground
            </Link>
          </div>
        </aside>
      </div>

      <RecommendedForYou currentCourseId={course.id} />
    </main>
    <Footer />
  </div>
);

export default CourseOutline;
