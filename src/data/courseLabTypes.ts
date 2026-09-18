import type { QuizQuestion } from "@/data/lessonExtras";

export interface CourseLab {
  /** Short lab title, e.g. "Build a CLI word counter". */
  title: string;
  /** Difficulty of this individual lab. */
  level: "Starter" | "Core" | "Challenge";
  /** Realistic scenario framing the lab in 1-2 sentences. */
  scenario: string;
  /** Ordered, checkable tasks the learner must complete. */
  tasks: string[];
  /** Language/tool id used for the editor label, e.g. "python", "bash", "sql". */
  language: string;
  /** Optional starter code or commands. */
  starter?: string;
  /** How the learner knows the lab is done. */
  successCriteria: string[];
  /** One nudge that unblocks without giving the answer away. */
  hint: string;
}

export interface CourseAssessment {
  labs: CourseLab[];
  quiz: QuizQuestion[];
}

export type CourseAssessmentMap = Record<string, CourseAssessment>;
