import { useEffect, useState, useCallback } from "react";
import { courses } from "@/data/courses";

const COMPLETE_KEY = "codelearn_progress";
const PROFILE_KEY = "codelearn_skill_level";

type CompleteMap = Record<string, string[]>;

export type SkillLevel = "beginner" | "intermediate" | "advanced";

const read = (): CompleteMap => {
  try {
    return JSON.parse(localStorage.getItem(COMPLETE_KEY) || "{}");
  } catch {
    return {};
  }
};

export interface LocalCourseProgress {
  startedCourseIds: string[];
  completedCourseIds: string[];
  percentByCourse: Record<string, number>;
  skillLevel: SkillLevel;
  refresh: () => void;
}

/**
 * Reads locally-cached lesson progress (kept in sync with the cloud by progressSync)
 * and derives which courses are started / completed plus a per-course percentage.
 */
export const useLocalCourseProgress = (): LocalCourseProgress => {
  const [map, setMap] = useState<CompleteMap>(() => (typeof window === "undefined" ? {} : read()));
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(() => {
    if (typeof window === "undefined") return "beginner";
    const v = localStorage.getItem(PROFILE_KEY);
    return v === "intermediate" || v === "advanced" ? v : "beginner";
  });

  const refresh = useCallback(() => {
    setMap(read());
    const v = localStorage.getItem(PROFILE_KEY);
    setSkillLevel(v === "intermediate" || v === "advanced" ? v : "beginner");
  }, []);

  useEffect(() => {
    const handler = () => refresh();
    window.addEventListener("progress-synced", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("progress-synced", handler);
      window.removeEventListener("storage", handler);
    };
  }, [refresh]);

  const startedCourseIds: string[] = [];
  const completedCourseIds: string[] = [];
  const percentByCourse: Record<string, number> = {};

  Object.entries(map).forEach(([courseId, lessons]) => {
    const done = Array.isArray(lessons) ? lessons.length : 0;
    if (done === 0) return;
    startedCourseIds.push(courseId);
    const total = courses.find((c) => c.id === courseId)?.lessons.length ?? 0;
    if (total > 0) {
      const pct = Math.min(100, Math.round((done / total) * 100));
      percentByCourse[courseId] = pct;
      if (pct >= 100) completedCourseIds.push(courseId);
    }
  });

  return { startedCourseIds, completedCourseIds, percentByCourse, skillLevel, refresh };
};
