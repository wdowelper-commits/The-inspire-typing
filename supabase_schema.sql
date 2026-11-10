-- ==============================================================================
-- INSPIRE TYPING - COMPLETE SUPABASE DATABASE SETUP & SCHEMA
-- Run this entire script in Supabase Dashboard -> SQL Editor -> New Query -> Run
--
-- ADMIN SETUP:
-- To set admin: UPDATE profiles SET user_role='admin' WHERE email='admin@inspiretyping.com';
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. CREATE TABLES
-- ==============================================================================

-- 2.1 PROFILES (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  user_role TEXT NOT NULL DEFAULT 'user' CHECK (user_role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_role ON public.profiles(user_role);

-- 2.2 LESSONS
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language TEXT NOT NULL CHECK (language IN ('english', 'urdu-phonetic', 'urdu-standard')),
  lesson_number INTEGER NOT NULL,
  sub_lesson_number INTEGER NOT NULL,
  lesson_code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_lessons_lang_num ON public.lessons(language, lesson_number, sub_lesson_number);
CREATE INDEX IF NOT EXISTS idx_lessons_code ON public.lessons(lesson_code);

-- 2.3 LESSON_TEXTS
CREATE TABLE IF NOT EXISTS public.lesson_texts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lesson_texts_lesson_id ON public.lesson_texts(lesson_id);

-- 2.4 TEST_PARAGRAPHS
CREATE TABLE IF NOT EXISTS public.test_paragraphs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  language TEXT NOT NULL CHECK (language IN ('english', 'urdu-phonetic', 'urdu-standard')),
  content TEXT NOT NULL,
  word_count INTEGER NOT NULL DEFAULT 0,
  difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_test_paragraphs_lang ON public.test_paragraphs(language);
CREATE INDEX IF NOT EXISTS idx_test_paragraphs_lang_diff ON public.test_paragraphs(language, difficulty);

-- 2.5 LESSON_PROGRESS
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  best_wpm INTEGER DEFAULT 0,
  best_accuracy NUMERIC(5,2) DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 0,
  last_attempted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_lesson_progress_user_lesson ON public.lesson_progress(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON public.lesson_progress(user_id);

-- 2.6 TEST_RESULTS
CREATE TABLE IF NOT EXISTS public.test_results (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  language TEXT NOT NULL CHECK (language IN ('english', 'urdu-phonetic', 'urdu-standard')),
  duration_seconds INTEGER NOT NULL,
  wpm INTEGER NOT NULL,
  cpm INTEGER NOT NULL,
  accuracy NUMERIC(5,2) NOT NULL,
  mistakes INTEGER NOT NULL DEFAULT 0,
  characters_typed INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_test_results_leaderboard ON public.test_results(language, duration_seconds, wpm DESC, accuracy DESC);
CREATE INDEX IF NOT EXISTS idx_test_results_user ON public.test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_test_results_completed_at ON public.test_results(completed_at DESC);

-- 2.7 BADGES
CREATE TABLE IF NOT EXISTS public.badges (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  trigger_type TEXT NOT NULL,
  trigger_value INTEGER NOT NULL DEFAULT 0,
  trigger_language TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.8 USER_BADGES
CREATE TABLE IF NOT EXISTS public.user_badges (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_badges_user_badge ON public.user_badges(user_id, badge_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON public.user_badges(user_id);

-- 2.9 USER_STREAKS
CREATE TABLE IF NOT EXISTS public.user_streaks (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 1,
  longest_streak INTEGER NOT NULL DEFAULT 1,
  last_active_date DATE DEFAULT CURRENT_DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.10 SITE_SETTINGS
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 3. FUNCTIONS & TRIGGERS
-- ==============================================================================

-- 3.1 Update updated_at Column Helper
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles
DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for lesson_texts
DROP TRIGGER IF EXISTS trigger_lesson_texts_updated_at ON public.lesson_texts;
CREATE TRIGGER trigger_lesson_texts_updated_at
  BEFORE UPDATE ON public.lesson_texts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger for user_streaks
DROP TRIGGER IF EXISTS trigger_user_streaks_updated_at ON public.user_streaks;
CREATE TRIGGER trigger_user_streaks_updated_at
  BEFORE UPDATE ON public.user_streaks
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 3.2 Auto-create profile & streak when auth.users signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email, user_role)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'display_name',
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.email,
    'user'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_streaks (id, user_id, current_streak, longest_streak, last_active_date)
  VALUES (
    'streak-' || NEW.id::text,
    NEW.id,
    1,
    1,
    CURRENT_DATE
  )
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_paragraphs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 4.1 Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 4.2 Lessons & Lesson Texts (Public Read, Admin Write)
CREATE POLICY "Lessons viewable by everyone"
  ON public.lessons FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage lessons"
  ON public.lessons FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'admin')
  );

CREATE POLICY "Lesson texts viewable by everyone"
  ON public.lesson_texts FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage lesson texts"
  ON public.lesson_texts FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'admin')
  );

-- 4.3 Test Paragraphs
CREATE POLICY "Test paragraphs viewable by everyone"
  ON public.test_paragraphs FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage test paragraphs"
  ON public.test_paragraphs FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'admin')
  );

-- 4.4 Lesson Progress
CREATE POLICY "Users can view own progress"
  ON public.lesson_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.lesson_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.lesson_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- 4.5 Test Results (Public read for Leaderboard, Authenticated or Anonymous can insert)
CREATE POLICY "Test results are viewable by everyone for leaderboard"
  ON public.test_results FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert test results"
  ON public.test_results FOR INSERT
  WITH CHECK (true);

-- 4.6 Badges
CREATE POLICY "Badges are viewable by everyone"
  ON public.badges FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage badges"
  ON public.badges FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'admin')
  );

-- 4.7 User Badges
CREATE POLICY "User badges viewable by everyone"
  ON public.user_badges FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own badges"
  ON public.user_badges FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 4.8 User Streaks
CREATE POLICY "Users can view and manage own streaks"
  ON public.user_streaks FOR ALL
  USING (auth.uid() = user_id);

-- 4.9 Site Settings
CREATE POLICY "Site settings viewable by everyone"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage site settings"
  ON public.site_settings FOR ALL
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND user_role = 'admin')
  );

-- ==============================================================================
-- 5. STORAGE BUCKET FOR AVATARS
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ==============================================================================
-- 6. DEFAULT BADGES SEED DATA
-- ==============================================================================
INSERT INTO public.badges (id, name, description, icon_name, trigger_type, trigger_value, trigger_language)
VALUES
  ('badge-first-keystroke', 'First Keystroke', 'Complete your very first typing lesson', 'Target', 'lesson_complete_all', 1, NULL),
  ('badge-speed-demon', 'Speed Demon', 'Reach 40 WPM on any typing test', 'Zap', 'wpm_threshold', 40, NULL),
  ('badge-fast-fingers', 'Fast Fingers', 'Achieve 60 WPM speed with great consistency', 'Flame', 'wpm_threshold', 60, NULL),
  ('badge-typing-pro', 'Typing Pro', 'Surpass 80 WPM professional typing speed', 'Award', 'wpm_threshold', 80, NULL),
  ('badge-accuracy-master', 'Accuracy Master', 'Complete a typing test with 98% or higher accuracy', 'ShieldCheck', 'accuracy_threshold', 98, NULL),
  ('badge-urdu-maestro', 'Urdu Maestro', 'Master all 36 Urdu touch typing lessons', 'Trophy', 'lesson_complete_all', 36, 'urdu-phonetic'),
  ('badge-english-expert', 'English Expert', 'Master all 36 English touch typing lessons', 'Sparkles', 'lesson_complete_all', 36, 'english'),
  ('badge-7-day-streak', '7-Day Streak', 'Practice typing for 7 consecutive days', 'Clock', 'streak_days', 7, NULL),
  ('badge-30-day-streak', '30-Day Streak', 'Dedicate 30 consecutive days to typing mastery', 'Calendar', 'streak_days', 30, NULL),
  ('badge-century-club', 'Century Club', 'Complete 100 typing tests or lessons', 'Medal', 'tests_count', 100, NULL)
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 7. INITIAL LEADERBOARD SEED DATA
-- ==============================================================================
INSERT INTO public.test_results (id, display_name, language, duration_seconds, wpm, cpm, accuracy, mistakes, characters_typed, completed_at)
VALUES
  ('seed-tr-1', 'Zainab Ahmed', 'english', 60, 104, 520, 99.2, 2, 522, now() - interval '4 hours'),
  ('seed-tr-2', 'Hamza Khan', 'urdu-phonetic', 60, 92, 460, 98.5, 3, 463, now() - interval '8 hours'),
  ('seed-tr-3', 'Sarah Jenkins', 'english', 120, 88, 440, 97.9, 5, 885, now() - interval '12 hours'),
  ('seed-tr-4', 'Bilal Farooq', 'urdu-phonetic', 180, 81, 405, 98.1, 6, 1221, now() - interval '18 hours'),
  ('seed-tr-5', 'Ayesha Siddiqui', 'english', 60, 76, 380, 96.5, 7, 387, now() - interval '24 hours'),
  ('seed-tr-6', 'Tariq Mehmood', 'urdu-standard', 60, 72, 360, 95.8, 8, 368, now() - interval '36 hours')
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 8. INITIAL SITE SETTINGS SEED DATA
-- ==============================================================================
INSERT INTO public.site_settings (key, value)
VALUES
  ('maintenance_mode', 'false'),
  ('announcement_text', '')
ON CONFLICT (key) DO NOTHING;

