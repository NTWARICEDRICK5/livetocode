import { Link } from "react-router-dom";
import { BookOpen, Clock, ChevronRight } from "lucide-react";

interface CourseCardProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  lessons: number;
  duration: string;
  level: string;
  topics: string[];
}

const CourseCard = ({ id, name, description, icon, color, lessons, duration, level, topics }: CourseCardProps) => {
  return (
    <Link to={`/course/${id}`} className="group block">
      <div className="card-glass rounded-2xl p-6 h-full transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_0_30px_hsl(185_100%_50%/0.15)]">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg transition-transform duration-300 group-hover:scale-110"
            style={{ background: color, boxShadow: `0 4px 20px ${color}40` }}
          >
            {icon}
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            level === 'Beginner' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
            level === 'Intermediate' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
            'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {level}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {description}
        </p>

        {/* Topics */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {topics.slice(0, 3).map((topic) => (
            <span key={topic} className="text-xs px-2 py-1 rounded-md bg-secondary/60 text-muted-foreground font-mono">
              {topic}
            </span>
          ))}
          {topics.length > 3 && (
            <span className="text-xs px-2 py-1 rounded-md bg-secondary/60 text-muted-foreground">
              +{topics.length - 3} more
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              {lessons} lessons
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {duration}
            </span>
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
            Start <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
