import { useMemo } from "react";
import { catalog } from "@/data/catalog";
import { recommendCourses } from "@/lib/recommend";
import CatalogCourseCard from "@/components/CatalogCourseCard";
import { useLocalCourseProgress } from "@/hooks/useLocalCourseProgress";

interface Props {
  currentCourseId?: string;
  title?: string;
  subtitle?: string;
  limit?: number;
}

const RecommendedForYou = ({
  currentCourseId,
  title = "Recommended for You",
  subtitle,
  limit = 6,
}: Props) => {
  const { startedCourseIds, completedCourseIds, skillLevel, percentByCourse } = useLocalCourseProgress();

  const recs = useMemo(
    () =>
      recommendCourses({
        currentCourseId,
        startedCourseIds,
        completedCourseIds,
        skillLevel,
        limit,
      }),
    [currentCourseId, startedCourseIds, completedCourseIds, skillLevel, limit]
  );

  if (recs.length === 0) return null;

  const current = catalog.find((c) => c.id === currentCourseId);

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-extrabold text-foreground mb-2">
        {title.split(" ").slice(0, -1).join(" ")}{" "}
        <span className="text-gradient-primary">{title.split(" ").slice(-1)}</span>
      </h2>
      <p className="text-muted-foreground mb-6">
        {subtitle ??
          (current
            ? `Chosen from the CodeLearn catalog based on ${current.name}, your progress and your skill level.`
            : "Chosen from the CodeLearn catalog based on your progress, prerequisites and skill level.")}
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recs.map((r) => (
          <CatalogCourseCard
            key={r.course.id}
            course={r.course}
            reason={r.reason}
            progress={percentByCourse[r.course.id] ?? 0}
          />
        ))}
      </div>
    </section>
  );
};

export default RecommendedForYou;
