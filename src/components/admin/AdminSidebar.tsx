import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, Award, ArrowLeft, ShieldAlert, Settings } from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const links = [
    { label: 'Overview', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'User Manager', path: '/admin/users', icon: <Users className="w-4 h-4" /> },
    { label: 'Lesson Manager', path: '/admin/lessons', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Badge Manager', path: '/admin/badges', icon: <Award className="w-4 h-4" /> },
    { label: 'Site Settings', path: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-full md:w-64 bg-white rounded-2xl border border-slate-200 p-4 shadow-xs h-fit space-y-6">
      <div className="flex items-center gap-2.5 px-3 py-2 bg-blue-50/70 rounded-xl text-blue-900 border border-blue-200">
        <div className="w-7 h-7 rounded-lg overflow-hidden bg-white border border-blue-200 p-0.5 shrink-0 flex items-center justify-center">
          <img src="/logo.png" alt="Inspire Logo" className="w-full h-full object-contain" />
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider">Admin Control</h4>
          <p className="text-[11px] text-blue-700">Inspire All Solution</p>
        </div>
      </div>

      <nav className="space-y-1">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-slate-100">
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public App</span>
        </Link>
      </div>
    </aside>
  );
};
