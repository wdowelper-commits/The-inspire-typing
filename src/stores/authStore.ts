import { create } from 'zustand';
import { Profile, UserRole, UserStreak } from '../types';
import { supabase, dataService } from '../lib/supabase';

interface AuthState {
  user: Profile | null;
  streak: UserStreak | null;
  loading: boolean;
  isGuest: boolean;
  signIn: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password?: string, displayName?: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setGuestMode: () => void;
  setUserRole: (role: UserRole) => void;
  updateUserProfile: (updates: Partial<Profile>) => Promise<void>;
  refreshStreak: () => Promise<void>;
}

const LOCAL_USER_KEY = 'inspire_typing_current_user';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: (() => {
    try {
      const saved = localStorage.getItem(LOCAL_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })(),
  streak: null,
  loading: false,
  isGuest: !Boolean(localStorage.getItem(LOCAL_USER_KEY)),

  signIn: async (emailInput: string, passwordInput?: string) => {
    set({ loading: true });
    try {
      const email = (emailInput || '').trim().toLowerCase();
      const password = passwordInput || '';

      if (supabase) {
        // Authenticate strictly via Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          set({ loading: false });
          return { success: false, error: error.message };
        }

        if (data.user) {
          // Verify user role from the profiles table
          let userRole: UserRole = 'user';
          let displayName =
            data.user.user_metadata?.display_name ||
            data.user.user_metadata?.full_name ||
            email.split('@')[0];
          let avatarUrl = data.user.user_metadata?.avatar_url || null;

          try {
            const { data: profileRow } = await supabase
              .from('profiles')
              .select('user_role, display_name, avatar_url')
              .eq('id', data.user.id)
              .maybeSingle();

            if (profileRow) {
              if (profileRow.user_role === 'admin') {
                userRole = 'admin';
              }
              if (profileRow.display_name) {
                displayName = profileRow.display_name;
              }
              if (profileRow.avatar_url) {
                avatarUrl = profileRow.avatar_url;
              }
            }
          } catch (profileErr) {
            console.warn('Could not query profiles table for role:', profileErr);
          }

          const profile: Profile = {
            id: data.user.id,
            email: data.user.email || email,
            display_name: displayName,
            avatar_url: avatarUrl,
            user_role: userRole,
            created_at: data.user.created_at,
          };

          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
          const streak = await dataService.getUserStreak(profile.id);
          set({ user: profile, streak, isGuest: false, loading: false });
          return { success: true };
        }
      }

      // Offline / Local development fallback when Supabase is not configured
      const profile: Profile = {
        id: 'usr-' + btoa(email || 'user').substring(0, 10),
        email,
        display_name: email.split('@')[0].replace('.', ' ').replace(/^\w/, (c) => c.toUpperCase()) || 'Typist',
        user_role: 'user',
        created_at: new Date().toISOString(),
      };

      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
      const streak = await dataService.getUserStreak(profile.id);
      set({ user: profile, streak, isGuest: false, loading: false });
      return { success: true };
    } catch (err: any) {
      set({ loading: false });
      return { success: false, error: err.message || 'Login failed' };
    }
  },

  signUp: async (email: string, password?: string, displayName?: string) => {
    set({ loading: true });
    try {
      const name = displayName || email.split('@')[0];

      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: password || '',
          options: {
            data: {
              display_name: name,
            },
          },
        });

        if (error) {
          set({ loading: false });
          return { success: false, error: error.message };
        }

        if (data.user) {
          const profile: Profile = {
            id: data.user.id,
            email: data.user.email || email,
            display_name: name,
            user_role: 'user',
            created_at: data.user.created_at,
          };

          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
          const streak = await dataService.getUserStreak(profile.id);
          set({ user: profile, streak, isGuest: false, loading: false });
          return { success: true };
        }
      }

      // Offline / Local development fallback
      const profile: Profile = {
        id: 'usr-' + Date.now().toString(36),
        email,
        display_name: name,
        user_role: 'user',
        created_at: new Date().toISOString(),
      };

      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
      const streak = await dataService.getUserStreak(profile.id);
      set({ user: profile, streak, isGuest: false, loading: false });
      return { success: true };
    } catch (err: any) {
      set({ loading: false });
      return { success: false, error: err.message || 'Sign up failed' };
    }
  },

  signInWithGoogle: async () => {
    if (supabase) {
      try {
        await supabase.auth.signInWithOAuth({ provider: 'google' });
        return;
      } catch {
        // Fallback
      }
    }
    // Simulation for preview
    const googleProfile: Profile = {
      id: 'google-usr-' + Date.now().toString(36),
      email: 'learner@gmail.com',
      display_name: 'Google Learner',
      user_role: 'user',
      created_at: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(googleProfile));
    set({ user: googleProfile, isGuest: false });
  },

  signOut: async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // Ignore
      }
    }
    localStorage.removeItem(LOCAL_USER_KEY);
    set({ user: null, streak: null, isGuest: true });
  },

  setGuestMode: () => {
    set({ user: null, isGuest: true });
  },

  setUserRole: (role: UserRole) => {
    const current = get().user;
    if (current) {
      const updated = { ...current, user_role: role };
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));
      set({ user: updated });
    }
  },

  updateUserProfile: async (updates: Partial<Profile>) => {
    const current = get().user;
    if (current) {
      const updated: Profile = { ...current, ...updates };
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));
      set({ user: updated });
      if (updates.display_name || updates.avatar_url !== undefined) {
        await dataService.updateProfile(current.id, {
          display_name: updates.display_name,
          avatar_url: updates.avatar_url ?? undefined,
        });
      }
    }
  },

  refreshStreak: async () => {
    const current = get().user;
    if (current) {
      const streak = await dataService.getUserStreak(current.id);
      set({ streak });
    }
  },
}));
