## Goal
Transform CodeLearn into a W3Schools-style learning system following the **Explain → Demonstrate → Practice → Test → Apply** cycle, with reference docs, quizzes, certification, and an AI tutor chatbot.

## Scope

1. **Restructure all lessons** into the 5-stage cycle
2. **Reference docs section** for each language (tags/functions/properties)
3. **Quizzes & exercises** per lesson (MCQ + fill-in-the-blank code)
4. **Certification mode** (final timed test + shareable certificate)
5. **AI Tutor chatbot** (Lovable Cloud + AI Gateway)

This is large — I'll ship it in **3 phases** so you can review each before the next.

---

## Phase 1 — Foundation + Lesson Cycle + Quizzes

**New lesson data shape** (`src/data/courses.ts` extended)
Each lesson gets:
```
{ explain, demo (code+output), practice (starter+solution), quiz[], apply (challenge) }
```
Existing content moves into `explain` + `demo` so nothing is lost.

**New components**
- `LessonStageTabs.tsx` — tabbed UI: Explain · Demonstrate · Practice · Test · Apply
- `Quiz.tsx` — MCQ runner with score, instant feedback, retry
- `PracticeEditor.tsx` — small inline editor (reuses Playground engine: HTML/CSS/JS iframe + Piston for Py/C/C++/JS) with "Check solution" button
- `ApplyChallenge.tsx` — open-ended challenge that opens in full Playground with starter code
- `LessonProgress.tsx` — per-stage completion checklist

**CoursePage.tsx** — replaces current single-content view with `LessonStageTabs`. Mark Complete only enables when all stages done.

**Progress storage** — `localStorage` key `codelearn_progress_v2` (per-course → per-lesson → per-stage).

---

## Phase 2 — Reference Docs + Certification

**Reference section** (`/reference/:lang`)
- New `src/data/references.ts` — list of items per language (HTML tags, CSS properties, JS methods, Python builtins, C/C++ keywords) with: name, syntax, description, example, browser/version notes
- `ReferencePage.tsx` — searchable, filterable sidebar list + detail pane with live "Try it" mini editor
- Navbar gets **Reference** dropdown

**Certification**
- `/certify/:courseId` — timed test (20 questions, 20 min), draws from lesson quizzes + extra cert-only items
- Pass ≥70% → generates certificate
- `Certificate.tsx` — printable/downloadable PDF-style certificate with learner name, course, date, score, unique ID, signed by NTWARI Cedrick
- Stored in DB so it has a verifiable shareable URL `/verify/:certId`

---

## Phase 3 — AI Tutor (Lovable Cloud + AI Gateway)

- Enable **Lovable Cloud** (DB for progress sync, certificates, auth) + **AI Gateway**
- Edge function `chat-tutor` — streaming SSE, system prompt enforces the Explain→Demo→Practice→Test→Apply teaching cycle and current lesson context
- Floating `TutorChat.tsx` button on every page; opens drawer with markdown rendering, language-aware code blocks, "Insert into editor" action on lesson/playground pages
- Auth: email/password + Google sign-in, so progress and certs persist across devices

---

## Technical details

- New tables (Phase 3): `profiles`, `user_roles`, `lesson_progress`, `quiz_attempts`, `certificates`, `tutor_conversations`, `tutor_messages` — all RLS-protected, roles in separate table per security best practice
- Quiz/reference content authored in TS data files (no DB needed for content itself)
- All new UI uses existing semantic tokens (cyan accents, glassmorphism cards) — no design drift
- Practice/Apply editors reuse the existing Piston + iframe engine from Playground
- Certificate PDF rendered client-side via `html2canvas` + `jspdf` (or print stylesheet fallback)

---

## What I'll deliver in this turn

**Phase 1 only.** It's already substantial (data model migration + 5-stage lesson UI + quizzes for every lesson). After you confirm Phase 1 looks good, I'll do Phase 2, then Phase 3.

Reply **"go"** to start Phase 1, or tell me to reorder/drop anything.
