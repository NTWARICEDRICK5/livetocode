import { catalog, type CatalogCourse, type Difficulty } from "@/data/catalog";

export interface RecommendInput {
  /** course the learner is on right now (optional) */
  currentCourseId?: string;
  /** course ids with at least one completed lesson */
  startedCourseIds?: string[];
  /** course ids fully completed */
  completedCourseIds?: string[];
  /** learner's declared skill level */
  skillLevel?: "beginner" | "intermediate" | "advanced";
  /** ids of courses in the learner's active learning path */
  pathCourseIds?: string[];
  /** free-form interests / skills the learner cares about */
  interests?: string[];
  limit?: number;
}

export interface Recommendation {
  course: CatalogCourse;
  score: number;
  reason: string;
}

/** Explicit "what naturally comes next" edges between catalog courses. */
const FOLLOW_UPS: Record<string, string[]> = {
  python: ["numpy", "pandas", "django", "fastapi", "data-science", "algorithms"],
  javascript: ["typescript", "react", "nodejs", "web-security", "algorithms"],
  typescript: ["react", "nextjs", "angular", "nodejs"],
  html: ["css", "javascript", "tailwind", "web-security"],
  css: ["tailwind", "javascript", "react"],
  c: ["cpp", "data-structures", "linux", "networking"],
  cpp: ["algorithms", "data-structures", "system-design"],
  react: ["nextjs", "typescript", "tailwind", "system-design"],
  nodejs: ["postgresql", "docker", "system-design", "redis"],
  sql: ["postgresql", "mysql", "mongodb", "data-science"],
  docker: ["kubernetes", "devops", "terraform"],
  git: ["github", "devops", "linux"],
  linux: ["networking", "docker", "cybersecurity"],
  networking: ["cybersecurity", "cloud", "soc"],
  cybersecurity: ["web-security", "ethical-hacking", "soc", "defensive-security"],
  "data-science": ["machine-learning", "pandas", "numpy"],
  "machine-learning": ["deep-learning", "generative-ai"],
  "deep-learning": ["llms", "generative-ai"],
  algorithms: ["data-structures", "system-design"],
  "data-structures": ["algorithms", "system-design"],
};

const DIFFICULTY_RANK: Record<Difficulty, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
};

const LEVEL_RANK = { beginner: 1, intermediate: 2, advanced: 3 } as const;

const norm = (s: string) => s.toLowerCase().trim();

export const recommendCourses = ({
  currentCourseId,
  startedCourseIds = [],
  completedCourseIds = [],
  skillLevel = "beginner",
  pathCourseIds = [],
  interests = [],
  limit = 6,
}: RecommendInput): Recommendation[] => {
  const current = catalog.find((c) => c.id === currentCourseId);
  const done = new Set(completedCourseIds);
  const started = new Set(startedCourseIds);
  const followUps = new Set(currentCourseId ? FOLLOW_UPS[currentCourseId] ?? [] : []);

  const knownSkills = new Set<string>();
  [...done, ...started].forEach((id) => {
    const c = catalog.find((x) => x.id === id);
    c?.skills.forEach((s) => knownSkills.add(norm(s)));
    if (c) knownSkills.add(norm(c.name));
  });

  const learnerRank = LEVEL_RANK[skillLevel] ?? 1;
  const interestSet = new Set(interests.map(norm));

  return catalog
    .filter((c) => c.id !== currentCourseId && !done.has(c.id))
    .map((c): Recommendation => {
      let score = 0;
      const reasons: string[] = [];

      if (followUps.has(c.id)) {
        score += 50;
        reasons.push(`A natural next step after ${current?.name}`);
      }

      if (pathCourseIds.includes(c.id)) {
        score += 40;
        reasons.push("Part of your learning path");
      }

      if (current && c.category === current.category) {
        score += 12;
        reasons.push(`More ${c.category}`);
      }

      if (c.prerequisites.length) {
        const met = c.prerequisites.filter((p) => knownSkills.has(norm(p))).length;
        if (met === c.prerequisites.length) {
          score += 22;
          reasons.push(`You already know ${c.prerequisites.join(" & ")}`);
        } else if (met === 0) {
          score -= 14;
        }
      } else {
        score += 6;
      }

      const gap = DIFFICULTY_RANK[c.difficulty] - learnerRank;
      if (gap === 0) {
        score += 16;
        reasons.push(`Matches your ${skillLevel} level`);
      } else if (gap === 1) {
        score += 8;
        reasons.push("A good stretch goal");
      } else if (gap > 1) {
        score -= 12;
      } else {
        score += 2;
      }

      if (c.skills.some((s) => interestSet.has(norm(s))) || interestSet.has(norm(c.name))) {
        score += 18;
        reasons.push("Matches your interests");
      }

      if (started.has(c.id)) {
        score += 26;
        reasons.push("You already started this");
      }

      if (c.status === "full") score += 10;

      return { course: c, score, reason: reasons[0] ?? "Popular with learners like you" };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};
