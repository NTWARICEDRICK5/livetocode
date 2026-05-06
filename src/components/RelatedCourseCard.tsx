import { ExternalLink } from "lucide-react";
import type { RelatedCourse } from "@/data/relatedCourses";

const RelatedCourseCard = ({ course }: { course: RelatedCourse }) => {
  return (
    <a
      href={course.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block card-glass rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_0_30px_hsl(185_100%_50%/0.15)]"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform"
          style={{ background: course.color }}
        >
          {course.icon}
        </div>
        <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-secondary/60 text-muted-foreground font-semibold">
          {course.category}
        </span>
      </div>

      <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors flex items-center gap-1.5">
        {course.name}
        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{course.description}</p>

      <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs">
        <span
          className={`font-semibold ${
            course.level === "Beginner"
              ? "text-green-400"
              : course.level === "Intermediate"
              ? "text-amber-400"
              : "text-red-400"
          }`}
        >
          {course.level}
        </span>
        <span className="text-muted-foreground">
          Builds on:{" "}
          <span className="text-primary font-mono">{course.related.join(", ")}</span>
        </span>
      </div>
    </a>
  );
};

export default RelatedCourseCard;
