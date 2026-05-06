import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { courses } from "@/data/courses";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CodeBlock from "@/components/CodeBlock";
import RelatedCourseCard from "@/components/RelatedCourseCard";
import { relatedCourses } from "@/data/relatedCourses";
import { ChevronLeft, ChevronRight, BookOpen, Clock, ArrowLeft, CheckCircle2, Play } from "lucide-react";

const CoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [activeLesson, setActiveLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());

  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center mt-20">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-3xl font-bold mb-4">Course Not Found</h1>
          <Link to="/" className="text-primary hover:underline">← Back to Home</Link>
        </div>
      </div>
    );
  }

  const lesson = course.lessons[activeLesson];

  const markComplete = () => {
    const updated = new Set(completedLessons);
    updated.add(activeLesson);
    setCompletedLessons(updated);
  };

  const goNext = () => {
    markComplete();
    if (activeLesson < course.lessons.length - 1) {
      setActiveLesson(activeLesson + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goPrev = () => {
    if (activeLesson > 0) {
      setActiveLesson(activeLesson - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const progress = Math.round((completedLessons.size / course.lessons.length) * 100);

  // Map markdown-like content to styled text
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**") && line.includes(":")) {
        const text = line.replace(/\*\*/g, "");
        return <p key={i} className="font-bold text-foreground mb-1">{text}</p>;
      }
      if (line.startsWith("- ")) {
        const parts = line.substring(2);
        return (
          <li key={i} className="ml-4 text-muted-foreground flex items-start gap-2 mb-1">
            <span className="text-primary mt-1 flex-shrink-0">•</span>
            <span dangerouslySetInnerHTML={{
              __html: parts.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>')
                         .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-secondary text-primary font-mono text-xs">$1</code>')
            }} />
          </li>
        );
      }
      if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ") || line.startsWith("4. ")) {
        return (
          <li key={i} className="ml-4 text-muted-foreground mb-1">
            <span dangerouslySetInnerHTML={{
              __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>')
                         .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-secondary text-primary font-mono text-xs">$1</code>')
            }} />
          </li>
        );
      }
      if (line === "") return <div key={i} className="h-3" />;
      return (
        <p key={i} className="text-muted-foreground leading-relaxed mb-1"
          dangerouslySetInnerHTML={{
            __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
                       .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-secondary text-primary font-mono text-xs">$1</code>')
          }}
        />
      );
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16 flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar */}
        <aside className="lg:w-72 xl:w-80 flex-shrink-0 border-r border-border/50 bg-card/30">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-4">
            {/* Course info */}
            <div className="mb-6">
              <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
                <ArrowLeft className="w-4 h-4" />
                All Courses
              </Link>

              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold mb-3"
                style={{ background: course.color }}
              >
                {course.icon}
              </div>
              <h2 className="font-bold text-lg text-foreground">{course.fullName}</h2>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  {course.lessons.length} lessons
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {course.duration}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Lesson list */}
            <nav className="space-y-1">
              {course.lessons.map((l, idx) => (
                <button
                  key={l.id}
                  onClick={() => { setActiveLesson(idx); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className={`w-full text-left px-3 py-3 rounded-lg text-sm transition-all flex items-center gap-3 ${
                    activeLesson === idx
                      ? "bg-primary/15 text-primary border border-primary/30"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    completedLessons.has(idx)
                      ? "bg-green-500/20 text-green-400"
                      : activeLesson === idx
                      ? "bg-primary/20 text-primary"
                      : "bg-secondary text-muted-foreground"
                  }`}>
                    {completedLessons.has(idx) ? "✓" : idx + 1}
                  </div>
                  <span className="line-clamp-2">{l.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto px-6 py-10">
            {/* Lesson header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <span className="text-primary font-semibold">{course.name}</span>
                <span>/</span>
                <span>Lesson {activeLesson + 1} of {course.lessons.length}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground mb-3">
                {lesson.title}
              </h1>
              <p className="text-muted-foreground text-lg">{lesson.description}</p>
            </div>

            {/* Content */}
            <div className="mb-8 card-glass rounded-2xl p-6 md:p-8">
              <div className="prose-custom space-y-1">
                {renderContent(lesson.content)}
              </div>
            </div>

            {/* Code example */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-primary/20 text-primary flex items-center justify-center text-sm">{"</>"}</span>
                Code Example
              </h3>
              <CodeBlock code={lesson.code} output={lesson.output} language={course.name} />
            </div>

            {/* Try it yourself - live editor */}
            {(() => {
              const slugMap: Record<string, string> = {
                python: "python",
                c: "c",
                cpp: "cpp",
                javascript: "javascript",
                html: "html-css-js",
                css: "html-css-js",
              };
              const slug = slugMap[course.id];
              if (!slug) return null;
              return (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-primary/20 text-primary flex items-center justify-center text-sm">
                        <Play className="w-3.5 h-3.5" />
                      </span>
                      Try It Yourself
                    </h3>
                    <Link
                      to="/playground"
                      className="text-xs text-primary hover:underline font-semibold"
                    >
                      Open full playground →
                    </Link>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-border/50 shadow-xl">
                    <iframe
                      src={`https://onecompiler.com/embed/${slug}?hideLanguageSelection=true&hideTitle=true&theme=dark`}
                      title={`${course.name} live editor`}
                      className="w-full h-[520px] bg-[hsl(220_25%_5%)] border-0"
                      allow="clipboard-write"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    💡 Edit the code and hit <span className="text-primary font-semibold">Run</span> to see your output instantly.
                  </p>
                </div>
              );
            })()}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-border/50">
              <button
                onClick={goPrev}
                disabled={activeLesson === 0}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-border/80 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <button
                onClick={markComplete}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  completedLessons.has(activeLesson)
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : "bg-secondary text-muted-foreground hover:text-foreground border border-border"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                {completedLessons.has(activeLesson) ? "Completed!" : "Mark Complete"}
              </button>

              <button
                onClick={goNext}
                disabled={activeLesson === course.lessons.length - 1}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {activeLesson === course.lessons.length - 1 ? "Finished! 🎉" : "Next Lesson"}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* All topics */}
            <div className="mt-12 card-glass rounded-2xl p-6">
              <h3 className="font-bold text-foreground mb-4">Topics Covered in {course.name}</h3>
              <div className="flex flex-wrap gap-2">
                {course.topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-3 py-1.5 rounded-lg bg-secondary/60 text-muted-foreground text-sm font-mono border border-border/50"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border/50">
                <h4 className="font-semibold text-foreground mb-3">Why Learn {course.name}?</h4>
                <div className="grid grid-cols-2 gap-2">
                  {course.whyLearn.map((reason) => (
                    <div key={reason} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="text-primary">✓</span>
                      {reason}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default CoursePage;
