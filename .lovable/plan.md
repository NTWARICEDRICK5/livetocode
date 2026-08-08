# CodeLearn — Platform Redesign & Expansion

Delivered in three phases. Each phase ships working, so nothing breaks mid-way.

## Phase 1 — Catalog, navigation, shell (this turn once approved)

**Scalable course model**
- Extend the course type with: `category`, `difficulty`, `prerequisites`, `skills`, `outcomes`, `modules` (module -> lessons), `status` ("full" | "outline"), `estimatedHours`.
- Keep the existing 7 courses (Python, C, C++, HTML, CSS, JavaScript, TypeScript) exactly as they are, wrapped into modules. No lesson content is lost or rewritten.
- Add ~45 new catalog entries (Java, C#, Go, Rust, PHP, Ruby, Kotlin, Swift, React, Next.js, Vue, Angular, Tailwind, Node, Django, FastAPI, Laravel, Spring Boot, SQL, PostgreSQL, MySQL, MongoDB, Redis, Git, GitHub, Linux, Networking, Docker, Kubernetes, Cloud, DevOps, Terraform, Data Science, NumPy, Pandas, ML, Deep Learning, Generative AI, LLMs, Cybersecurity, Ethical Hacking, Web Security, Cryptography, SOC, Defensive Security, Algorithms, Data Structures, System Design, Software Engineering) with full metadata, module/lesson outlines and outcomes. Outline lessons render a clear "Lesson content coming soon" state with the module objectives and links to the Playground.

**Courses page & navigation**
- New `/courses` catalog page: search, category filter, difficulty filter, sort, progress badges per card.
- Navbar split into public and authenticated variants:
  - Public: Home, Courses, Learning Paths, Projects, Playground, AI Mentor, Sign In, Get Started.
  - Signed in: Dashboard, Courses, Paths, Projects, Playground, AI Mentor, Progress, Profile menu.
- Global search dialog (Cmd/Ctrl+K) across courses, lessons, paths, projects.

**Recommended for You**
- Replace `relatedCourses.ts` usage with a recommendation engine scoring real catalog courses by current course, completed lessons, skill level, active path, prerequisites and progress. Used on course pages and the dashboard.

**Footer + UI polish**
- New developer-themed footer: Courses / Paths / Playground / Projects / AI Mentor / Dashboard, technologies, resources, socials, copyright, and the NTWARI Cedrick credit preserved.
- Subtle animated terminal line, drifting `</>` glyphs and a faint binary stream — all disabled under `prefers-reduced-motion`.
- Premium pass on tokens: refined dark surfaces, cyan/electric-blue accents, elevation scale, spacing and typography rhythm. All via semantic tokens in `index.css` / `tailwind.config.ts`.

## Phase 2 — Playground IDE

- Standalone `/playground`, removed from the lesson flow (lessons keep their inline practice editor and get an "Open in Playground" hand-off).
- Monaco Editor, lazy-loaded so it never affects other routes: syntax highlighting, autocomplete, formatting, multi-file tabs, themes matched to the design system.
- Run / Stop / Reset, output console with stdout, compile errors, runtime errors, execution time, and click-to-jump line-specific error markers.
- Save/load projects to the database per user, plus share links.
- Execution stays server-side in the sandboxed edge function (never in the app server): timeouts, output-size caps, code-length limits and per-user throttling on top of the isolated remote compiler.

## Phase 3 — Projects, paths, dashboard, AI Mentor

- **Projects**: `/projects` catalog and `/projects/:id` detail with difficulty, tech stack, estimated time, skills, prerequisites, step instructions, progress and completion — stored per user.
- **Learning paths**: expand to Software Engineer, Full-Stack, AI Engineer, Cybersecurity, Cloud, DevOps, Data Scientist, each staged beginner → intermediate → advanced → projects, wired to the new catalog.
- **Dashboard redesign**: Continue Learning, daily goal, weekly progress, streak, course progress, skill progress, recommended courses, projects, recent activity, learning stats, AI Mentor entry — laid out to answer "what should I learn or build next?".
- **AI Mentor upgrade**: mode selector (Explain, Hint, Debug, Review, Improve, Quiz Me, Practice, Mentor); context payload includes course, lesson, exercise, current editor code, last error, progress and skill level; system prompt tuned to teach rather than hand over answers. Handles 429/402 gateway errors with clear messages.

## Technical notes

- New DB tables in Phase 2/3: `playground_projects`, `project_progress` — RLS scoped to `auth.uid()` with explicit grants.
- Existing tables, auth, progress sync, gamification, certificates and notes are preserved and reused; work is refactor-first, not a rewrite.
- Route-level code splitting for Playground and Monaco; catalog data split by category so the bundle stays reasonable.
