import { supabase } from "@/integrations/supabase/client";

const STAGE_KEY = "codelearn_stage_progress_v2";
const COMPLETE_KEY = "codelearn_progress";

type StageMap = Record<string, string[]>; // "course:lesson" -> stages
type CompleteMap = Record<string, string[]>; // course -> lesson[]

const loadLocal = <T,>(k: string): T => { try { return JSON.parse(localStorage.getItem(k) || "{}"); } catch { return {} as T; } };
const saveLocal = (k: string, v: any) => localStorage.setItem(k, JSON.stringify(v));

export async function pullProgress(userId: string) {
  const { data, error } = await supabase
    .from("lesson_progress")
    .select("course_id, lesson_id, completed_stages, completed")
    .eq("user_id", userId);
  if (error || !data) return;

  const stages = loadLocal<StageMap>(STAGE_KEY);
  const complete = loadLocal<CompleteMap>(COMPLETE_KEY);
  for (const row of data) {
    stages[`${row.course_id}:${row.lesson_id}`] = row.completed_stages || [];
    if (row.completed) {
      complete[row.course_id] = Array.from(new Set([...(complete[row.course_id] || []), row.lesson_id]));
    }
  }
  saveLocal(STAGE_KEY, stages);
  saveLocal(COMPLETE_KEY, complete);
  window.dispatchEvent(new Event("progress-synced"));
}

export async function upsertProgress(userId: string, courseId: string, lessonId: string, stages: string[], completed: boolean) {
  await supabase.from("lesson_progress").upsert(
    { user_id: userId, course_id: courseId, lesson_id: lessonId, completed_stages: stages, completed },
    { onConflict: "user_id,course_id,lesson_id" }
  );
}
