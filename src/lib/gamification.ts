import { supabase } from "@/integrations/supabase/client";

export type ActivityKind =
  | "lesson"
  | "quiz"
  | "exercise"
  | "project"
  | "lab"
  | "course"
  | "certificate"
  | "study";

export const XP_RULES: Record<ActivityKind, number> = {
  lesson: 20,
  quiz: 50,
  exercise: 75,
  project: 150,
  lab: 200,
  course: 1000,
  certificate: 300,
  study: 0,
};

export interface ActivityRow {
  id: string;
  kind: string;
  course_id: string | null;
  lesson_id: string | null;
  label: string | null;
  xp: number;
  minutes: number;
  score: number | null;
  created_at: string;
}

/** Level curve: level n starts at (n-1)^2 * 100 XP. */
export const levelFromXp = (xp: number) => Math.floor(Math.sqrt(Math.max(xp, 0) / 100)) + 1;
export const xpForLevel = (level: number) => Math.pow(Math.max(level - 1, 0), 2) * 100;

export const levelProgress = (xp: number) => {
  const level = levelFromXp(xp);
  const start = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const span = Math.max(next - start, 1);
  return {
    level,
    start,
    next,
    needed: Math.max(next - xp, 0),
    percent: Math.min(100, Math.round(((xp - start) / span) * 100)),
  };
};

const dayKey = (d: Date | string) => {
  const date = typeof d === "string" ? new Date(d) : d;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;
};

export const streaksFrom = (rows: ActivityRow[]) => {
  const days = Array.from(new Set(rows.map((r) => dayKey(r.created_at)))).sort();
  if (days.length === 0) return { current: 0, longest: 0, days: [] as string[] };

  let longest = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = new Date(days[i - 1]);
    const cur = new Date(days[i]);
    const diff = Math.round((cur.getTime() - prev.getTime()) / 86400000);
    run = diff === 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }

  const today = dayKey(new Date());
  const yesterday = dayKey(new Date(Date.now() - 86400000));
  const last = days[days.length - 1];
  let current = 0;
  if (last === today || last === yesterday) {
    current = 1;
    for (let i = days.length - 1; i > 0; i--) {
      const diff = Math.round(
        (new Date(days[i]).getTime() - new Date(days[i - 1]).getTime()) / 86400000
      );
      if (diff === 1) current++;
      else break;
    }
  }
  return { current, longest, days };
};

export const ACHIEVEMENTS: {
  code: string;
  title: string;
  description: string;
  icon: string;
  test: (s: AchievementInput) => boolean;
}[] = [
  { code: "first-lesson", title: "First Lesson", description: "Complete your very first lesson", icon: "🎯", test: (s) => s.lessons >= 1 },
  { code: "first-quiz", title: "First Quiz", description: "Pass your first quiz", icon: "🧠", test: (s) => s.quizzes >= 1 },
  { code: "first-project", title: "First Project", description: "Finish your first project", icon: "🛠️", test: (s) => s.projects >= 1 },
  { code: "first-certificate", title: "First Certificate", description: "Earn your first certificate", icon: "📜", test: (s) => s.certificates >= 1 },
  { code: "streak-7", title: "7-Day Streak", description: "Learn 7 days in a row", icon: "🔥", test: (s) => s.streak >= 7 },
  { code: "streak-30", title: "30-Day Streak", description: "Learn 30 days in a row", icon: "🌟", test: (s) => s.streak >= 30 },
  { code: "xp-100", title: "100 XP", description: "Earn your first 100 XP", icon: "⚡", test: (s) => s.xp >= 100 },
  { code: "xp-500", title: "500 XP", description: "Earn 500 XP", icon: "💫", test: (s) => s.xp >= 500 },
  { code: "xp-1000", title: "1000 XP", description: "Earn 1000 XP", icon: "🏆", test: (s) => s.xp >= 1000 },
  { code: "ten-lessons", title: "Getting Serious", description: "Complete 10 lessons", icon: "📚", test: (s) => s.lessons >= 10 },
  { code: "note-taker", title: "Note Taker", description: "Write your first note", icon: "📝", test: (s) => s.notes >= 1 },
  { code: "explorer", title: "Explorer", description: "Start learning in 3 different courses", icon: "🧭", test: (s) => s.coursesTouched >= 3 },
];

export interface AchievementInput {
  xp: number;
  lessons: number;
  quizzes: number;
  projects: number;
  certificates: number;
  notes: number;
  streak: number;
  coursesTouched: number;
}

export async function logActivity(
  userId: string,
  kind: ActivityKind,
  opts: {
    courseId?: string;
    lessonId?: string;
    label?: string;
    minutes?: number;
    score?: number;
    xp?: number;
  } = {}
) {
  const xp = opts.xp ?? XP_RULES[kind] ?? 0;
  const { error } = await supabase.from("learning_activity").insert({
    user_id: userId,
    kind,
    course_id: opts.courseId ?? null,
    lesson_id: opts.lessonId ?? null,
    label: opts.label ?? null,
    minutes: opts.minutes ?? 0,
    score: opts.score ?? null,
    xp,
  });
  if (error) return;
  window.dispatchEvent(new CustomEvent("xp-earned", { detail: { xp, kind } }));
}

/** Insert any newly-earned achievements; returns the codes unlocked now. */
export async function syncAchievements(userId: string, input: AchievementInput, existing: string[]) {
  const earned = ACHIEVEMENTS.filter((a) => a.test(input) && !existing.includes(a.code));
  if (earned.length === 0) return [];
  await supabase
    .from("achievements")
    .upsert(earned.map((a) => ({ user_id: userId, code: a.code })), { onConflict: "user_id,code" });
  return earned.map((a) => a.code);
}
