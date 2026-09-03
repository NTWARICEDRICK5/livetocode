/**
 * Shared helper to open the AI Mentor with lesson-aware context.
 *
 * The mentor panel (TutorChat) listens for the `open-ai-mentor` event and uses
 * `context` as grounding for every reply in the session, plus `suggestions`
 * as the quick-question chips derived from the lesson's objectives/exercises.
 */
export interface MentorRequest {
  /** Question sent immediately on open. Omit to just open the panel. */
  prompt?: string;
  /** Lesson grounding: objectives, notes, exercises, current code. */
  context?: string;
  /** Lesson-specific quick questions shown as chips. */
  suggestions?: string[];
  /** Short label of what the learner is studying, shown in the header. */
  topic?: string;
}

export const askMentor = (req: MentorRequest) =>
  window.dispatchEvent(new CustomEvent<MentorRequest>("open-ai-mentor", { detail: req }));

/** Build a compact grounding block from a lesson's objectives and exercises. */
export const buildLessonContext = (input: {
  courseName: string;
  lessonTitle: string;
  objective?: string;
  bullets?: string[];
  exercises?: { title: string; prompt: string }[];
}) => {
  const hasGrounding = Boolean(input.objective) || Boolean(input.bullets?.length) || Boolean(input.exercises?.length);
  const lines = [
    `Course: ${input.courseName}`,
    `Current lesson: ${input.lessonTitle}`,
    input.objective ? `Lesson objective: ${input.objective}` : "",
    input.bullets?.length ? `Key points:\n${input.bullets.map((b) => `- ${b}`).join("\n")}` : "",
    input.exercises?.length
      ? `Exercises for this lesson:\n${input.exercises.map((e) => `- ${e.title}: ${e.prompt}`).join("\n")}`
      : "",
    hasGrounding
      ? "Answer only within the scope of this lesson. Use its objective and exercises as the source of truth, keep examples in the course's language, and end with one short practice question drawn from the exercises above."
      : `No written objectives or exercises are available for this lesson yet. Infer the lesson's scope from its title "${input.lessonTitle}" within the ${input.courseName} course, teach it from your own expertise in the course's language, keep the same Explain → Demo → Practice → Check structure, and end with one short practice question appropriate for this topic. Never tell the learner that lesson data is missing — just teach.`,
  ];
  return lines.filter(Boolean).join("\n");
};

/** Default lesson-scoped quick questions. */
export const lessonSuggestions = (lessonTitle: string, exercises?: { title: string }[]) =>
  [
    `Explain "${lessonTitle}" with a simple example`,
    `What are the most common mistakes in "${lessonTitle}"?`,
    exercises?.[0] ? `Give me a hint for "${exercises[0].title}"` : `Quiz me on "${lessonTitle}"`,
    `Give me one more practice task on "${lessonTitle}"`,
  ].filter(Boolean);
