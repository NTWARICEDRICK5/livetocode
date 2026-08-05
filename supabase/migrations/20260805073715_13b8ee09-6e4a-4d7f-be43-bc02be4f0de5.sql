CREATE TABLE public.certificates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id text NOT NULL,
  course_name text NOT NULL,
  learner_name text NOT NULL,
  score integer NOT NULL,
  total integer NOT NULL,
  issued_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.certificates TO authenticated;
GRANT SELECT ON public.certificates TO anon;
GRANT ALL ON public.certificates TO service_role;

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can verify a certificate"
ON public.certificates FOR SELECT
USING (true);

CREATE POLICY "Users create own certificates"
ON public.certificates FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE INDEX certificates_user_idx ON public.certificates (user_id);