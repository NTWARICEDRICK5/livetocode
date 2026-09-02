export interface CourseExercise {
  title: string;
  prompt: string;
  hint: string;
}

export interface CourseProject {
  title: string;
  brief: string;
  steps: string[];
  skills: string[];
}

export interface CourseResource {
  label: string;
  url: string;
}

export interface CourseDetail {
  /** 1–2 sentence orientation shown at the top of the course page. */
  intro: string;
  /** lesson title -> one concrete sentence describing what the learner does/learns. */
  lessonNotes: Record<string, string>;
  exercises: CourseExercise[];
  projects: CourseProject[];
  resources: CourseResource[];
}

export type CourseDetailMap = Record<string, CourseDetail>;
