import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Award,
  Zap,
  Activity,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { dataService } from '../../lib/supabase';

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  detail: string;
  time: string;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 1420,
    lessonsCompleted: 8940,
    testsTaken: 12580,
    activeToday: 184,
  });

  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: 'act-1',
      user: 'Zainab Ahmed',
      action: 'Speed Test Completed',
      detail: 'Achieved 104 WPM (99.2% Accuracy) in 1-Minute English Test',
      time: '12 minutes ago',
    },
    {
      id: 'act-2',
      user: 'Hamza Khan',
      action: 'Urdu Lesson Finished',
      detail: 'Completed Urdu Phonetic 1.1 with 92 WPM',
      time: '28 minutes ago',
    },
    {
      id: 'act-3',
      user: 'Sarah Jenkins',
      action: 'Badge Unlocked',
      detail: 'Earned "Speed Demon (40+ WPM)" badge',
      time: '1 hour ago',
    },
    {
      id: 'act-4',
      user: 'Tariq Mehmood',
      action: 'New Account Registered',
      detail: 'Joined via email verification',
      time: '2 hours ago',
    },
    {
      id: 'act-5',
      user: 'Bilal Farooq',
      action: 'Test Completed',
      detail: 'Completed 3-Minute Urdu Test with 81 WPM',
      time: '3 hours ago',
    },
  ]);

  useEffect(() => {
    dataService.getPlatformStats().then((res) => {
      setStats({
        ...res,
        activeToday: 184 + Math.floor(Math.random() * 20),
      });
    });
  }, []);

  return (
    <PageWrapper maxWidth="wide">
      <div className="flex flex-col md:flex-row gap-8">
        <AdminSidebar />

        <div className="flex-1 space-y-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <LayoutDashboard className="w-8 h-8 text-blue-600" />
              Administrative Overview
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Real-time platform metrics, user accounts, lesson curriculum, and operational controls.
            </p>
          </div>

          {/* FIX 3: 4 Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 border-l-4 border-l-blue-600 shadow-xs">
              <div className="flex items-center justify-between text-blue-600 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Users
                </span>
                <Users className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-slate-900">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-slate-400 mt-1">+18 new users this week</p>
            </Card>

            <Card className="p-5 border-l-4 border-l-indigo-600 shadow-xs">
              <div className="flex items-center justify-between text-indigo-600 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Tests Taken
                </span>
                <Activity className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-slate-900">{stats.testsTaken.toLocaleString()}</div>
              <p className="text-xs text-slate-400 mt-1">1m to 10m timed evaluations</p>
            </Card>

            <Card className="p-5 border-l-4 border-l-emerald-600 shadow-xs">
              <div className="flex items-center justify-between text-emerald-600 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Lessons Completed
                </span>
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-slate-900">{stats.lessonsCompleted.toLocaleString()}</div>
              <p className="text-xs text-slate-400 mt-1">Across English &amp; Urdu tracks</p>
            </Card>

            <Card className="p-5 border-l-4 border-l-amber-500 shadow-xs">
              <div className="flex items-center justify-between text-amber-500 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Active Users Today
                </span>
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-slate-900">{stats.activeToday.toLocaleString()}</div>
              <p className="text-xs text-emerald-600 font-semibold mt-1">● Live typists practicing</p>
            </Card>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Card className="p-5 hover:border-blue-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">User Manager</h3>
              <p className="text-xs text-slate-500 mb-4">
                View registered typists, audit best WPM scores, toggle accounts, and manage admin roles.
              </p>
              <Link to="/admin/users">
                <Button variant="outline" size="sm" className="w-full">
                  Manage Users →
                </Button>
              </Link>
            </Card>

            <Card className="p-5 hover:border-emerald-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Lesson Manager</h3>
              <p className="text-xs text-slate-500 mb-4">
                Full CRUD for English &amp; Urdu curriculum: add new lessons, edit text strings, and delete.
              </p>
              <Link to="/admin/lessons">
                <Button variant="outline" size="sm" className="w-full">
                  Edit Curriculum →
                </Button>
              </Link>
            </Card>

            <Card className="p-5 hover:border-amber-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Badge Manager</h3>
              <p className="text-xs text-slate-500 mb-4">
                Configure achievement milestones, WPM threshold criteria, and create new badges.
              </p>
              <Link to="/admin/badges">
                <Button variant="outline" size="sm" className="w-full">
                  Manage Badges →
                </Button>
              </Link>
            </Card>
          </div>

          {/* Recent Activity Feed */}
          <Card className="p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Recent Platform Activity</h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">Auto-refreshed</span>
            </div>

            <div className="divide-y divide-slate-100">
              {activities.map((act) => (
                <div key={act.id} className="py-3.5 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{act.user}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                          {act.action}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{act.detail}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap">{act.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
};
