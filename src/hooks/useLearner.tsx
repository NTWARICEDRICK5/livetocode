import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  ActivityRow,
  AchievementInput,
  levelProgress,
  streaksFrom,
  syncAchievements,
} from "@/lib/gamification";
import { courses } from "@/data/courses";

export interface LearnerProfile {
  id: string;
  display_name: string | null;
  full_name: string | null;
  username: string | null;
  email: string | null;
  avatar_url: string | null;
  country: string | null;
  preferred_language: string;
  time_zone: string | null;
  bio: string | null;
  skill_level: string;
  learning_goal: string | null;
  daily_goal_minutes: number;
  weekly_goal_minutes: number;
  preferred_study_time: string | null;
  created_at: string;
}

export interface ProgressRow {
  course_id: string;
  lesson_id: string;
  completed: boolean;
  completed_stages: string[];
  updated_at: string;
}

const startOfDay = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

export function useLearner() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [activity, setActivity] = useState<ActivityRow[]>([]);
  const [progress, setProgress] = useState<ProgressRow[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [notesCount, setNotesCount] = useState(0);
  const [certCount, setCertCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const [p, a, pr, ac, nc, cc] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      supabase
        .from("learning_activity")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1000),
      supabase
        .from("lesson_progress")
        .select("course_id, lesson_id, completed, completed_stages, updated_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false }),
      supabase.from("achievements").select("code").eq("user_id", user.id),
      supabase.from("notes").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase
        .from("certificates")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id),
    ]);

    setProfile((p.data as unknown as LearnerProfile) ?? null);
    setActivity((a.data as ActivityRow[]) ?? []);
    setProgress((pr.data as ProgressRow[]) ?? []);
    setAchievements(((ac.data as { code: string }[]) ?? []).map((r) => r.code));
    setNotesCount(nc.count ?? 0);
    setCertCount(cc.count ?? 0);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!authLoading) load();
  }, [authLoading, load]);

  useEffect(() => {
    const h = () => load();
    window.addEventListener("xp-earned", h);
    window.addEventListener("progress-synced", h);
    return () => {
      window.removeEventListener("xp-earned", h);
      window.removeEventListener("progress-synced", h);
    };
  }, [load]);

  // Derived stats
  const xp = activity.reduce((s, r) => s + (r.xp || 0), 0);
  const level = levelProgress(xp);
  const streak = streaksFrom(activity);
  const minutesTotal = activity.reduce((s, r) => s + (r.minutes || 0), 0);
  const today = startOfDay().getTime();
  const minutesToday = activity
    .filter((r) => new Date(r.created_at).getTime() >= today)
    .reduce((s, r) => s + (r.minutes || 0), 0);
  const weekAgo = today - 6 * 86400000;
  const minutesWeek = activity
    .filter((r) => new Date(r.created_at).getTime() >= weekAgo)
    .reduce((s, r) => s + (r.minutes || 0), 0);
  const monthAgo = today - 29 * 86400000;
  const minutesMonth = activity
    .filter((r) => new Date(r.created_at).getTime() >= monthAgo)
    .reduce((s, r) => s + (r.minutes || 0), 0);

  const quizRows = activity.filter((r) => r.kind === "quiz" && r.score !== null);
  const quizAverage = quizRows.length
    ? Math.round(quizRows.reduce((s, r) => s + (r.score || 0), 0) / quizRows.length)
    : 0;

  const completedLessons = progress.filter((r) => r.completed);
  const coursesTouched = new Set(progress.map((r) => r.course_id)).size;
  const coursesCompleted = courses.filter((c) => {
    const done = completedLessons.filter((r) => r.course_id === c.id).length;
    return c.lessons.length > 0 && done >= c.lessons.length;
  }).length;

  // Continue learning: most recent touched lesson that isn't complete, else last touched
  const last = progress.find((r) => !r.completed) ?? progress[0] ?? null;
  const continueLearning = last
    ? (() => {
        const course = courses.find((c) => c.id === last.course_id);
        if (!course) return null;
        const lesson = course.lessons.find((l) => l.id === last.lesson_id) ?? course.lessons[0];
        const done = completedLessons.filter((r) => r.course_id === course.id).length;
        return {
          course,
          lesson,
          percent: Math.round((done / course.lessons.length) * 100),
        };
      })()
    : null;

  // Daily activity buckets for charts (last 14 days)
  const daily = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today - (13 - i) * 86400000);
    const rows = activity.filter((r) => {
      const t = new Date(r.created_at);
      return t.toDateString() === d.toDateString();
    });
    return {
      date: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      minutes: rows.reduce((s, r) => s + (r.minutes || 0), 0),
      xp: rows.reduce((s, r) => s + (r.xp || 0), 0),
    };
  });

  const achievementInput: AchievementInput = {
    xp,
    lessons: completedLessons.length,
    quizzes: activity.filter((r) => r.kind === "quiz").length,
    projects: activity.filter((r) => r.kind === "project").length,
    certificates: certCount,
    notes: notesCount,
    streak: streak.current,
    coursesTouched,
  };

  // Unlock achievements as stats change
  useEffect(() => {
    if (!user || loading) return;
    syncAchievements(user.id, achievementInput, achievements).then((newly) => {
      if (newly.length) setAchievements((prev) => [...prev, ...newly]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading, xp, completedLessons.length, streak.current, notesCount, certCount]);

  return {
    user,
    loading: loading || authLoading,
    profile,
    activity,
    progress,
    achievements,
    reload: load,
    stats: {
      xp,
      level,
      streak,
      minutesTotal,
      minutesToday,
      minutesWeek,
      minutesMonth,
      quizAverage,
      lessonsCompleted: completedLessons.length,
      coursesTouched,
      coursesCompleted,
      certificates: certCount,
      notes: notesCount,
      projects: activity.filter((r) => r.kind === "project").length,
    },
    continueLearning,
    daily,
  };
}
