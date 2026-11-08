import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Profile, LessonProgress, TestResult, UserBadge, UserStreak } from '../types';
import { DEFAULT_BADGES } from '../data/badges';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'your_supabase_project_url' &&
  !supabaseUrl.includes('placeholder')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Initial simulated leaderboard data
const SEED_LEADERBOARD: TestResult[] = [
  {
    id: 'tr-1',
    user_id: 'seed-user-1',
    display_name: 'Zainab Ahmed',
    avatar_url: null,
    language: 'english',
    duration_seconds: 60,
    wpm: 104,
    cpm: 520,
    accuracy: 99.2,
    mistakes: 2,
    characters_typed: 522,
    completed_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'tr-2',
    user_id: 'seed-user-2',
    display_name: 'Hamza Khan',
    avatar_url: null,
    language: 'urdu-phonetic',
    duration_seconds: 60,
    wpm: 92,
    cpm: 460,
    accuracy: 98.5,
    mistakes: 3,
    characters_typed: 463,
    completed_at: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'tr-3',
    user_id: 'seed-user-3',
    display_name: 'Sarah Jenkins',
    avatar_url: null,
    language: 'english',
    duration_seconds: 120,
    wpm: 88,
    cpm: 440,
    accuracy: 97.9,
    mistakes: 5,
    characters_typed: 885,
    completed_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'tr-4',
    user_id: 'seed-user-4',
    display_name: 'Bilal Farooq',
    avatar_url: null,
    language: 'urdu-phonetic',
    duration_seconds: 180,
    wpm: 81,
    cpm: 405,
    accuracy: 98.1,
    mistakes: 6,
    characters_typed: 1221,
    completed_at: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 'tr-5',
    user_id: 'seed-user-5',
    display_name: 'Ayesha Siddiqui',
    avatar_url: null,
    language: 'english',
    duration_seconds: 60,
    wpm: 76,
    cpm: 380,
    accuracy: 96.5,
    mistakes: 7,
    characters_typed: 387,
    completed_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'tr-6',
    user_id: 'seed-user-6',
    display_name: 'Tariq Mehmood',
    avatar_url: null,
    language: 'urdu-standard',
    duration_seconds: 60,
    wpm: 72,
    cpm: 360,
    accuracy: 95.8,
    mistakes: 8,
    characters_typed: 368,
    completed_at: new Date(Date.now() - 3600000 * 36).toISOString(),
  },
];

const STORAGE_KEYS = {
  TEST_RESULTS: 'inspire_typing_test_results',
  LESSON_PROGRESS: 'inspire_typing_lesson_progress',
  USER_BADGES: 'inspire_typing_user_badges',
  USER_STREAKS: 'inspire_typing_user_streaks',
  PROFILES: 'inspire_typing_profiles',
};

// Storage helper with fallback to localStorage
export const dataService = {
  async getLeaderboard(language?: string, duration?: number): Promise<TestResult[]> {
    if (supabase) {
      try {
        let query = supabase
          .from('test_results')
          .select('*, profiles(display_name, avatar_url)')
          .order('wpm', { ascending: false })
          .limit(50);

        if (language && language !== 'all') {
          query = query.eq('language', language);
        }
        if (duration && duration > 0) {
          query = query.eq('duration_seconds', duration);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          return data.map((item: any) => ({
            ...item,
            display_name: item.profiles?.display_name || item.display_name || 'Anonymous Typist',
            avatar_url: item.profiles?.avatar_url || item.avatar_url,
          }));
        }
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to local leaderboard', e);
      }
    }

    // Local fallback
    const local = localStorage.getItem(STORAGE_KEYS.TEST_RESULTS);
    const combined: TestResult[] = local ? [...JSON.parse(local), ...SEED_LEADERBOARD] : [...SEED_LEADERBOARD];

    return combined
      .filter((item) => {
        if (language && language !== 'all' && item.language !== language) return false;
        if (duration && duration > 0 && item.duration_seconds !== duration) return false;
        return true;
      })
      .sort((a, b) => b.wpm - a.wpm || b.accuracy - a.accuracy)
      .slice(0, 50);
  },

  async saveTestResult(result: Omit<TestResult, 'id'>): Promise<TestResult> {
    const newResult: TestResult = {
      ...result,
      id: 'tr-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    };

    if (supabase) {
      try {
        await supabase.from('test_results').insert([newResult]);
      } catch (e) {
        console.warn('Failed saving to Supabase, saved locally', e);
      }
    }

    const current = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEST_RESULTS) || '[]');
    current.unshift(newResult);
    localStorage.setItem(STORAGE_KEYS.TEST_RESULTS, JSON.stringify(current));

    return newResult;
  },

  async getUserTestResults(userId: string): Promise<TestResult[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('test_results')
          .select('*')
          .eq('user_id', userId)
          .order('completed_at', { ascending: false });

        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase fetch failed', e);
      }
    }

    const current: TestResult[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEST_RESULTS) || '[]');
    return current.filter((r) => r.user_id === userId);
  },

  async saveLessonProgress(progress: Omit<LessonProgress, 'id'>): Promise<LessonProgress> {
    const item: LessonProgress = {
      ...progress,
      id: `lp-${progress.user_id}-${progress.lesson_id}`,
    };

    if (supabase) {
      try {
        await supabase.from('lesson_progress').upsert([item]);
      } catch (e) {
        console.warn('Failed to upsert to Supabase', e);
      }
    }

    const current: LessonProgress[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.LESSON_PROGRESS) || '[]');
    const existingIndex = current.findIndex(
      (p) => p.user_id === progress.user_id && p.lesson_id === progress.lesson_id
    );

    if (existingIndex >= 0) {
      const prev = current[existingIndex];
      current[existingIndex] = {
        ...item,
        best_wpm: Math.max(prev.best_wpm || 0, item.best_wpm),
        best_accuracy: Math.max(prev.best_accuracy || 0, item.best_accuracy),
        attempts: (prev.attempts || 0) + 1,
      };
    } else {
      current.push(item);
    }

    localStorage.setItem(STORAGE_KEYS.LESSON_PROGRESS, JSON.stringify(current));
    return item;
  },

  async getUserLessonProgress(userId: string): Promise<LessonProgress[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('lesson_progress')
          .select('*')
          .eq('user_id', userId);
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase fetch failed', e);
      }
    }

    const current: LessonProgress[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.LESSON_PROGRESS) || '[]');
    return current.filter((p) => p.user_id === userId);
  },

  async getUserBadges(userId: string): Promise<UserBadge[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('user_badges')
          .select('*, badges(*)')
          .eq('user_id', userId);
        if (!error && data) return data;
      } catch (e) {
        console.warn('Supabase user badges fetch error', e);
      }
    }

    const current: UserBadge[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_BADGES) || '[]');
    return current.filter((b) => b.user_id === userId);
  },

  async awardBadge(userId: string, badgeId: string): Promise<UserBadge | null> {
    const badge = DEFAULT_BADGES.find((b) => b.id === badgeId);
    if (!badge) return null;

    const current: UserBadge[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_BADGES) || '[]');
    const existing = current.find((b) => b.user_id === userId && b.badge_id === badgeId);
    if (existing) return existing;

    const newBadge: UserBadge = {
      id: `ub-${userId}-${badgeId}`,
      user_id: userId,
      badge_id: badgeId,
      earned_at: new Date().toISOString(),
      badge,
    };

    if (supabase) {
      try {
        await supabase.from('user_badges').insert([newBadge]);
      } catch (e) {
        console.warn('Error saving badge to Supabase', e);
      }
    }

    current.push(newBadge);
    localStorage.setItem(STORAGE_KEYS.USER_BADGES, JSON.stringify(current));
    return newBadge;
  },

  async getUserStreak(userId: string): Promise<UserStreak> {
    const defaultStreak: UserStreak = {
      id: `streak-${userId}`,
      user_id: userId,
      current_streak: 1,
      longest_streak: 1,
      last_active_date: new Date().toISOString().split('T')[0],
    };

    const current: UserStreak[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_STREAKS) || '[]');
    const found = current.find((s) => s.user_id === userId);
    return found || defaultStreak;
  },

  async getPlatformStats(): Promise<{ totalUsers: number; lessonsCompleted: number; testsTaken: number }> {
    const tests: TestResult[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.TEST_RESULTS) || '[]');
    const lessons: LessonProgress[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.LESSON_PROGRESS) || '[]');
    return {
      totalUsers: 1420 + Math.floor(tests.length / 2),
      lessonsCompleted: 8940 + lessons.length,
      testsTaken: 12580 + tests.length,
    };
  },
};
