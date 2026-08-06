
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS username text UNIQUE,
  ADD COLUMN IF NOT EXISTS full_name text,
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS preferred_language text NOT NULL DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS time_zone text,
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS skill_level text NOT NULL DEFAULT 'beginner',
  ADD COLUMN IF NOT EXISTS learning_goal text,
  ADD COLUMN IF NOT EXISTS daily_goal_minutes integer NOT NULL DEFAULT 20,
  ADD COLUMN IF NOT EXISTS weekly_goal_minutes integer NOT NULL DEFAULT 120,
  ADD COLUMN IF NOT EXISTS preferred_study_time text;

CREATE TABLE IF NOT EXISTS public.learning_activity (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL,
  course_id text,
  lesson_id text,
  label text,
  xp integer NOT NULL DEFAULT 0,
  minutes integer NOT NULL DEFAULT 0,
  score integer,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.learning_activity TO authenticated;
GRANT ALL ON public.learning_activity TO service_role;
ALTER TABLE public.learning_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own activity" ON public.learning_activity
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS learning_activity_user_created_idx ON public.learning_activity (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code text NOT NULL,
  unlocked_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, code)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.achievements TO authenticated;
GRANT ALL ON public.achievements TO service_role;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own achievements" ON public.achievements
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Untitled note',
  content text NOT NULL DEFAULT '',
  course_id text,
  lesson_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notes TO authenticated;
GRANT ALL ON public.notes TO service_role;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own notes" ON public.notes
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER notes_updated BEFORE UPDATE ON public.notes
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE TABLE IF NOT EXISTS public.bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL,
  ref_id text NOT NULL,
  title text NOT NULL,
  url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, kind, ref_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookmarks TO authenticated;
GRANT ALL ON public.bookmarks TO service_role;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own bookmarks" ON public.bookmarks
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
