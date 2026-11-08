import React, { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Shield, Calendar, Award, Zap, Target } from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';
import { BadgesGrid } from '../components/dashboard/BadgesGrid';
import { useAuthStore } from '../stores/authStore';
import { dataService } from '../lib/supabase';
import { UserBadge, TestResult } from '../types';

export const ProfilePage: React.FC = () => {
  const { user, streak, setUserRole } = useAuthStore();
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      dataService.getUserBadges(user.id).then(setUserBadges);
      dataService.getUserTestResults(user.id).then(setTestResults);
    }
  }, [user]);

  const bestWpm = testResults.reduce((max, r) => Math.max(max, r.wpm), 0);
  const avgAccuracy =
    testResults.length > 0
      ? Math.round(testResults.reduce((s, r) => s + r.accuracy, 0) / testResults.length)
      : 100;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const updated = { ...user, display_name: displayName };
      localStorage.setItem('inspire_typing_current_user', JSON.stringify(updated));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  return (
    <PageWrapper maxWidth="normal">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <UserIcon className="w-8 h-8 text-blue-600" />
          Typist Profile &amp; Achievements
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Manage your display name, view unlocked credentials, and review testing history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 text-center">
            <div className="mx-auto flex justify-center mb-4">
              <Avatar name={user?.display_name} url={user?.avatar_url} size="xl" />
            </div>

            <h3 className="text-xl font-bold text-slate-900">{user?.display_name}</h3>
            <p className="text-xs text-slate-500">{user?.email}</p>

            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 uppercase">
              <Shield className="w-3.5 h-3.5" />
              Role: {user?.user_role}
            </div>

            {/* Quick Stats Strip */}
            <div className="grid grid-cols-3 gap-2 pt-6 mt-6 border-t border-slate-100 text-center">
              <div>
                <div className="text-xl font-black text-blue-600">{bestWpm}</div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Best WPM</div>
              </div>
              <div>
                <div className="text-xl font-black text-emerald-600">{avgAccuracy}%</div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Accuracy</div>
              </div>
              <div>
                <div className="text-xl font-black text-amber-500">{streak?.current_streak || 1}</div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Day Streak</div>
              </div>
            </div>
          </Card>

          {/* Edit Display Name Card */}
          <Card className="p-6">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
              Account Settings
            </h4>

            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your full name on certificates"
              />

              <Input
                label="Email Address"
                value={user?.email || ''}
                disabled
                helperText="Email linked to your Supabase account"
              />

              {savedSuccess && (
                <p className="text-xs font-bold text-emerald-600 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                  Profile updated successfully!
                </p>
              )}

              <Button type="submit" variant="primary" size="sm" className="w-full">
                Save Changes
              </Button>
            </form>
          </Card>
        </div>

        {/* Right Column: Badges & Honors */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Badge Collection ({userBadges.length} / 10 Earned)
              </h3>
            </div>
            <BadgesGrid userBadges={userBadges} />
          </Card>

          {/* Recent Evaluations History */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
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
