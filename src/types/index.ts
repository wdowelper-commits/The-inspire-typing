export type Language = 'english' | 'urdu-phonetic' | 'urdu-standard';

export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  display_name: string;
  email: string;
  avatar_url?: string | null;
  user_role: UserRole;
  created_at: string;
  updated_at?: string;
}

export interface Lesson {
  id: string;
  language: Language;
  lesson_number: number;
  sub_lesson_number: number;
  lesson_code: string; // e.g. "english-1-1"
  title: string;
  description: string;
  sort_order: number;
  created_at?: string;
}

export interface LessonText {
  id: string;
  lesson_id: string;
  content: string;
}

export interface LessonBundle {
  lesson: Lesson;
  text: LessonText;
}

export type LessonDataBundle = LessonBundle;

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  best_wpm: number;
  best_accuracy: number;
  attempts: number;
  last_attempted_at: string;
  completed_at?: string;
}

export interface TestResult {
  id: string;
  user_id: string;
  display_name?: string;
  avatar_url?: string | null;
  language: Language;
  duration_seconds: number;
  wpm: number;
  cpm: number;
  accuracy: number;
  mistakes: number;
  characters_typed: number;
  completed_at: string;
}

export type BadgeTriggerType =
  | 'wpm_threshold'
  | 'lesson_complete_all'
  | 'streak_days'
  | 'tests_count'
  | 'accuracy_threshold';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon_name: string;
  trigger_type: BadgeTriggerType;
  trigger_value: number;
  trigger_language?: Language | null;
  created_at?: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_id: string;
  earned_at: string;
  badge?: Badge;
}

export interface UserStreak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
  updated_at?: string;
}

export interface TestParagraph {
  id: string;
  language: Language;
  content: string;
  word_count: number;
  difficulty: 'easy' | 'medium' | 'hard';
  created_at?: string;
}

export interface TypingStats {
  wpm: number;
  cpm: number;
  accuracy: number;
  mistakes: number;
  charactersTyped: number;
  correctChars: number;
  elapsedSeconds: number;
  isComplete: boolean;
}

export interface CertificateData {
  recipientName: string;
  achievementTitle: string;
  language: string;
  wpm: number;
  accuracy: number;
  date: string;
  certificateId: string;
}
