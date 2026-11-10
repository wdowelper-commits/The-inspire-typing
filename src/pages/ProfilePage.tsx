import React, { useState, useEffect, useRef } from 'react';
import {
  User as UserIcon,
  Shield,
  Award,
  Zap,
  Target,
  Upload,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar, PRESET_AVATARS } from '../components/ui/Avatar';
import { BadgesGrid } from '../components/dashboard/BadgesGrid';
import { useAuthStore } from '../stores/authStore';
import { dataService } from '../lib/supabase';
import { UserBadge, TestResult, LessonProgress } from '../types';

export const ProfilePage: React.FC = () => {
  const { user, streak, updateUserProfile } = useAuthStore();
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([]);
  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(user?.avatar_url || null);
  const [isUploading, setIsUploading] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.display_name);
      setSelectedAvatar(user.avatar_url || null);
      dataService.getUserBadges(user.id).then(setUserBadges);
      dataService.getUserTestResults(user.id).then(setTestResults);
      dataService.getUserLessonProgress(user.id).then(setLessonProgress);
    }
  }, [user]);

  const bestWpm = testResults.reduce((max, r) => Math.max(max, r.wpm), 0);
  const avgAccuracy =
    testResults.length > 0
      ? Math.round(testResults.reduce((s, r) => s + r.accuracy, 0) / testResults.length)
      : 100;
  const lessonsCompletedCount = lessonProgress.length;
  const totalTestsCount = testResults.length;

  // Validate display name: max 20 chars, alphanumeric + spaces only
  const handleDisplayNameChange = (val: string) => {
    setDisplayName(val);
    if (!val.trim()) {
      setNameError('Display name cannot be empty');
    } else if (val.length > 20) {
      setNameError('Display name must be 20 characters or fewer');
    } else if (!/^[a-zA-Z0-9 ]+$/.test(val)) {
      setNameError('Only alphanumeric characters and spaces are allowed');
    } else {
      setNameError(null);
    }
  };

  // Handle preset avatar selection
  const handleSelectPreset = (presetId: string) => {
    setSelectedAvatar(presetId);
  };

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, WebP, etc.)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Image size must be under 2MB');
      return;
    }

    setIsUploading(true);
    try {
      const publicUrl = await dataService.uploadAvatar(user.id, file);
      if (publicUrl) {
        setSelectedAvatar(publicUrl);
      }
    } catch (err) {
      console.error('Failed to upload image:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const trimmed = displayName.trim();
    if (!trimmed) {
      setNameError('Display name cannot be empty');
      return;
    }
    if (trimmed.length > 20) {
      setNameError('Display name must be 20 characters or fewer');
      return;
    }
    if (!/^[a-zA-Z0-9 ]+$/.test(trimmed)) {
      setNameError('Only alphanumeric characters and spaces are allowed');
      return;
    }

    setNameError(null);
    await updateUserProfile({
      display_name: trimmed,
      avatar_url: selectedAvatar,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <PageWrapper maxWidth="normal">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <UserIcon className="w-8 h-8 text-blue-600" />
          Typist Profile &amp; Achievements
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Customize your avatar, display name, and track your typing records.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Avatar & Profile Settings */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6">
            <div className="text-center mb-6">
              {/* Active Avatar Preview */}
              <div className="relative inline-block mb-3">
                <Avatar
                  name={displayName || user?.display_name}
                  url={selectedAvatar}
                  size="xl"
                  className="ring-4 ring-blue-100 shadow-md"
                />
              </div>

              <h3 className="text-xl font-bold text-slate-900">{displayName || user?.display_name}</h3>
              <p className="text-xs text-slate-500">{user?.email}</p>

              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 uppercase">
                <Shield className="w-3.5 h-3.5" />
                Role: {user?.user_role}
              </div>
            </div>

            {/* Custom Avatar Options */}
            <div className="border-t border-slate-100 pt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Choose Avatar Icon
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_AVATARS.map((preset) => {
                    const isSelected = selectedAvatar === preset.id;
                    const IconComp = preset.icon;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset.id)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full ${preset.bg} flex items-center justify-center text-white shadow-2xs mb-1`}
                        >
                          <IconComp className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600">{preset.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Upload Custom Image Button */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full text-xs flex items-center justify-center gap-2"
                  disabled={isUploading}
                  onClick={() => fileInputRef.current?.click()}
                  icon={<Upload className="w-3.5 h-3.5 text-slate-600" />}
                >
                  {isUploading ? 'Uploading to Supabase...' : 'Upload Custom Photo'}
                </Button>
                <p className="text-[10px] text-slate-400 text-center mt-1">
                  Supported formats: PNG, JPG, WebP (max 2MB)
                </p>
              </div>
            </div>

            {/* Display Name Edit Form */}
            <form onSubmit={handleSave} className="border-t border-slate-100 pt-5 mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Display Name
                </label>
                <Input
                  value={displayName}
                  onChange={(e) => handleDisplayNameChange(e.target.value)}
                  placeholder="e.g. MasterTypist"
                  maxLength={20}
                  className="w-full text-sm font-semibold"
                />
                <div className="flex justify-between items-center mt-1 text-[11px]">
                  {nameError ? (
                    <span className="text-red-600 flex items-center gap-1 font-semibold">
                      <AlertCircle className="w-3 h-3" /> {nameError}
                    </span>
                  ) : (
                    <span className="text-slate-400">Max 20 chars (letters, numbers, spaces)</span>
                  )}
                  <span className="text-slate-400 font-mono">{displayName.length}/20</span>
                </div>
              </div>

              {savedSuccess && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Profile saved successfully!
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full font-bold shadow-sm"
                disabled={Boolean(nameError)}
              >
                Save Changes
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Column: Stats Summary & Badges */}
        <div className="lg:col-span-7 space-y-6">
          {/* Stats Summary Card */}
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Typing Career Stats
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-center">
                <div className="text-2xl font-black text-blue-600">{totalTestsCount}</div>
                <div className="text-[10px] font-bold text-blue-700 uppercase mt-0.5">Total Tests</div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-center">
                <div className="text-2xl font-black text-emerald-600">{bestWpm}</div>
                <div className="text-[10px] font-bold text-emerald-700 uppercase mt-0.5">Best WPM</div>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-center">
                <div className="text-2xl font-black text-indigo-600">{lessonsCompletedCount}</div>
                <div className="text-[10px] font-bold text-indigo-700 uppercase mt-0.5">Lessons Done</div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-100 text-center">
                <div className="text-2xl font-black text-amber-500">{streak?.current_streak || 1}</div>
                <div className="text-[10px] font-bold text-amber-700 uppercase mt-0.5">Day Streak</div>
              </div>
            </div>
          </Card>

          {/* Badges Collection */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Badge Collection ({userBadges.length} / 10 Earned)
              </h3>
            </div>
            <BadgesGrid userBadges={userBadges} />
          </Card>

          {/* Recent Evaluations History */}
          <Card className="p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" /> Recent Test History
            </h3>

            {testResults.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No test results recorded yet.</p>
            ) : (
              <div className="space-y-2.5">
                {testResults.slice(0, 5).map((t, idx) => (
                  <div
                    key={t.id || idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 capitalize">
                        {t.duration_seconds / 60}m {t.language.replace('-', ' ')}
                      </span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {new Date(t.completed_at).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-black text-blue-600 text-sm">{t.wpm} WPM</span>
                      <span className="font-bold text-emerald-600">{t.accuracy}% Acc</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
};
