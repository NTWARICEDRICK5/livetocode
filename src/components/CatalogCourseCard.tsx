import { Link } from "react-router-dom";
import { Clock, Layers, ArrowRight, Sparkles } from "lucide-react";
import type { CatalogCourse } from "@/data/catalog";
import { lessonCount } from "@/data/catalog";

interface Props {
  course: CatalogCourse;
  progress?: number;
  reason?: string;
}

const difficultyStyles: Record<string, string> = {
  Beginner: "bg-primary/10 text-primary border-primary/25",
  Intermediate: "bg-accent/10 text-accent border-accent/25",
  Advanced: "bg-destructive/10 text-destructive border-destructive/25",
};

const CatalogCourseCard = ({ course, progress = 0, reason }: Props) => (
  <Link
    to={`/course/${course.id}`}
    className="group relative flex flex-col card-glass rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
  >
    <div className="flex items-start gap-3 mb-3">
      <span className="text-3xl leading-none" aria-hidden>
        {course.icon}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="font-bold text-foreground truncate">{course.name}</h3>
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground/70">{course.category}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
    </div>

    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{course.description}</p>

    {reason && (
      <p className="flex items-center gap-1.5 text-xs text-primary mb-3">
        <Sparkles className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate">{reason}</span>
      </p>
    )}

    <div className="mt-auto flex flex-wrap items-center gap-2 text-[11px]">
      <span className={`px-2 py-0.5 rounded-full border ${difficultyStyles[course.difficulty]}`}>
        {course.difficulty}
      </span>
      <span className="flex items-center gap-1 text-muted-foreground">
        <Clock className="w-3 h-3" /> {course.estimatedHours}h
      </span>
      <span className="flex items-center gap-1 text-muted-foreground">
        <Layers className="w-3 h-3" /> {lessonCount(course)} lessons
      </span>
      {course.status === "outline" && (
        <span className="px-2 py-0.5 rounded-full bg-secondary/70 border border-border text-muted-foreground">
          Curriculum
        </span>
      )}
    </div>

    {progress > 0 && (
      <div className="mt-3">
        <div className="h-1.5 rounded-full bg-secondary/70 overflow-hidden">
          <div className="h-full bg-gradient-primary rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">{progress}% complete</p>
      </div>
    )}
  </Link>
);

export default CatalogCourseCard;
