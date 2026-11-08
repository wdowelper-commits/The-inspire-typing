import React, { useState } from 'react';
import {
  Users,
  Search,
  Shield,
  CheckCircle2,
  XCircle,
  Eye,
  X,
  Trophy,
  Zap,
  Target,
  Calendar,
} from 'lucide-react';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Avatar } from '../../components/ui/Avatar';

interface AdminUserRecord {
  id: string;
  email: string;
  display_name: string;
  role: 'admin' | 'user';
  best_wpm: number;
  tests_count: number;
  status: 'active' | 'disabled';
  joined_date: string;
  accuracy: number;
  lessons_completed: number;
}

const INITIAL_USERS: AdminUserRecord[] = [
  {
    id: 'admin-umar',
    email: 'umar@inspirertyping.com',
    display_name: 'Umar (Lead Admin)',
    role: 'admin',
    best_wpm: 92,
    tests_count: 74,
    status: 'active',
    joined_date: '2024-01-01',
    accuracy: 99.1,
    lessons_completed: 36,
  },
  {
    id: 'usr-2',
    email: 'zainab.ahmed@example.com',
    display_name: 'Zainab Ahmed',
    role: 'user',
    best_wpm: 104,
    tests_count: 88,
    status: 'active',
    joined_date: '2024-02-14',
    accuracy: 99.2,
    lessons_completed: 34,
  },
  {
    id: 'usr-3',
    email: 'hamza.khan@example.com',
    display_name: 'Hamza Khan',
    role: 'user',
    best_wpm: 92,
    tests_count: 45,
    status: 'active',
    joined_date: '2024-03-01',
    accuracy: 98.5,
    lessons_completed: 28,
  },
  {
    id: 'usr-4',
    email: 'sarah.j@example.com',
    display_name: 'Sarah Jenkins',
    role: 'user',
    best_wpm: 88,
    tests_count: 61,
    status: 'active',
    joined_date: '2024-03-12',
    accuracy: 97.9,
    lessons_completed: 30,
  },
  {
    id: 'usr-5',
    email: 'bilal.f@example.com',
    display_name: 'Bilal Farooq',
    role: 'user',
    best_wpm: 81,
    tests_count: 34,
    status: 'active',
    joined_date: '2024-04-05',
    accuracy: 98.1,
    lessons_completed: 22,
  },
];

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<AdminUserRecord[]>(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [inspectedUser, setInspectedUser] = useState<AdminUserRecord | null>(null);

  const filtered = users.filter(
    (u) =>
      u.display_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === 'active' ? 'disabled' : 'active' } : u))
    );
  };

  const toggleRole = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u))
    );
  };

  return (
    <PageWrapper maxWidth="wide">
      <div className="flex flex-col md:flex-row gap-8">
        <AdminSidebar />

        <div className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Users className="w-7 h-7 text-blue-600" />
                User Management
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Inspect registered typists, audit permissions, view profile performance, and control access.
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">Typist</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4 text-center">Best WPM</th>
                    <th className="py-3 px-4 text-center">Tests Taken</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={u.display_name} size="sm" />
                          <div>
                            <span className="font-bold text-slate-900 block">{u.display_name}</span>
                            <span className="text-[11px] text-slate-400">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            u.role === 'admin'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center font-bold text-blue-600">{u.best_wpm}</td>

                      <td className="py-3 px-4 text-center text-slate-600 font-mono">{u.tests_count}</td>

                      <td className="py-3 px-4 text-slate-500">{u.joined_date}</td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold ${
                            u.status === 'active' ? 'text-emerald-600' : 'text-red-500'
                          }`}
                        >
                          {u.status === 'active' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                          {u.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setInspectedUser(u)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-100 font-bold inline-flex items-center gap-1 text-[11px]"
                          title="View Profile Stats"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Stats</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleRole(u.id)}
                          className="px-2 py-1 rounded-lg text-[11px] font-bold text-blue-600 hover:bg-blue-50"
                        >
                          {u.role === 'admin' ? 'Demote' : 'Make Admin'}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleStatus(u.id)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold ${
                            u.status === 'active'
                              ? 'text-rose-600 hover:bg-rose-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {u.status === 'active' ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* USER STATS MODAL */}
      {inspectedUser && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60"
            style={{ backdropFilter: 'none' }}
            onClick={() => setInspectedUser(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[51] bg-white rounded-2xl max-w-md w-[90vw] p-6 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <Avatar name={inspectedUser.display_name} size="md" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">{inspectedUser.display_name}</h3>
                  <p className="text-xs text-slate-400">{inspectedUser.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectedUser(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-blue-50 rounded-xl p-3 text-center border border-blue-100">
                <span className="text-2xl font-black text-blue-600">{inspectedUser.best_wpm}</span>
                <span className="text-[10px] uppercase font-bold text-blue-800 block">Best WPM</span>
              </div>
              <div className="bg-emerald-50 rounded-xl p-3 text-center border border-emerald-100">
                <span className="text-2xl font-black text-emerald-600">{inspectedUser.accuracy}%</span>
                <span className="text-[10px] uppercase font-bold text-emerald-800 block">Avg Accuracy</span>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center border border-purple-100">
                <span className="text-2xl font-black text-purple-600">{inspectedUser.tests_count}</span>
                <span className="text-[10px] uppercase font-bold text-purple-800 block">Tests Taken</span>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100">
                <span className="text-2xl font-black text-amber-600">{inspectedUser.lessons_completed}</span>
                <span className="text-[10px] uppercase font-bold text-amber-800 block">Lessons Finished</span>
              </div>
            </div>

            <div className="space-y-2 text-xs border-t border-slate-100 pt-3 text-slate-600">
              <div className="flex items-center justify-between">
                <span>Account Status:</span>
                <span className="font-bold capitalize text-slate-800">{inspectedUser.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Assigned Role:</span>
                <span className="font-bold uppercase text-blue-600">{inspectedUser.role}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Registration Date:</span>
                <span className="font-mono text-slate-700">{inspectedUser.joined_date}</span>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setInspectedUser(null)}>
                Close
              </Button>
            </div>
          </div>
        </>
      )}
    </PageWrapper>
  );
};
