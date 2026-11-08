import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Keyboard as KeyboardIcon,
  Globe,
  Menu,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  LayoutDashboard,
  LogOut,
  ShieldAlert,
  User as UserIcon,
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { Language } from '../../types';
import { isAICoachAvailable } from '../../lib/aiCoach';

export const Navbar: React.FC<{ onOpenAICoach?: () => void }> = ({ onOpenAICoach }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isGuest, signOut, setUserRole } = useAuthStore();
  const { language, setLanguage, soundEnabled, toggleSound } = useSettingsStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Lessons', path: `/lessons/${language}` },
    { label: 'Speed Test', path: '/test' },
    { label: 'Leaderboard', path: '/leaderboard' },
  ];

  const handleSelectLanguage = (newLang: Language) => {
    setLanguage(newLang);
    setLangDropdownOpen(false);
    // If currently on lessons page, route to that language
    if (location.pathname.startsWith('/lessons')) {
      navigate(`/lessons/${newLang}`);
    }
  };

  const getLanguageLabel = (l: Language) => {
    switch (l) {
      case 'urdu-phonetic':
        return 'اردو (Phonetic)';
      case 'urdu-standard':
        return 'اردو (Standard)';
      default:
        return 'English';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform bg-white">
              <img
                src="/logo.png"
                alt="Inspire Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-1">
                Inspire<span className="text-blue-600">Typing</span>
              </span>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest -mt-1">
                English &amp; اردو
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname.startsWith(link.path.split('/')[1]);
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-blue-600 bg-blue-50/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {isAICoachAvailable && onOpenAICoach && (
              <button
                type="button"
                onClick={onOpenAICoach}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors ml-2"
              >
                <Sparkles className="w-4 h-4 text-purple-600" />
                AI Coach
              </button>
            )}
          </nav>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            title={soundEnabled ? 'Mute Key Clicks' : 'Unmute Key Clicks'}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>{getLanguageLabel(language)}</span>
              <span className="text-[10px] text-slate-400">▼</span>
            </button>

            {langDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setLangDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => handleSelectLanguage('english')}
                  className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center justify-between ${
                    language === 'english' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>English (QWERTY)</span>
                  {language === 'english' && <span className="text-blue-600 font-bold">✓</span>}
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectLanguage('urdu-phonetic')}
                  className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center justify-between ${
                    language === 'urdu-phonetic'
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-urdu-typing text-sm">اردو فونیٹک</span>
                  {language === 'urdu-phonetic' && <span className="text-blue-600 font-bold">✓</span>}
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectLanguage('urdu-standard')}
                  className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center justify-between ${
                    language === 'urdu-standard'
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-urdu-typing text-sm">اردو معیاری (Nastaliq)</span>
                  {language === 'urdu-standard' && <span className="text-blue-600 font-bold">✓</span>}
                </button>
              </div>
            )}
          </div>

          {/* User Section - FIX 2: Prominent Sign Up & Login */}
          {isGuest || !user ? (
            <div className="hidden sm:flex items-center gap-2.5">
              <Link
                to="/login"
                className="bg-white hover:bg-blue-50 text-[#2563EB] border-2 border-[#2563EB] font-semibold text-sm px-5 py-2 rounded-[8px] transition-colors inline-flex items-center justify-center"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2 rounded-[8px] transition-colors shadow-sm inline-flex items-center justify-center"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-blue-400 transition-all"
              >
                <Avatar name={user.display_name} url={user.avatar_url} size="sm" />
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-900 truncate">{user.display_name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 text-blue-700 uppercase">
                      {user.user_role}
                    </span>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <LayoutDashboard className="w-4 h-4 text-slate-400" />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span>Profile &amp; Badges</span>
                  </Link>

                  {user.user_role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-blue-600 font-semibold hover:bg-blue-50"
                    >
                      <ShieldAlert className="w-4 h-4 text-blue-600" />
                      <span>Admin Panel</span>
                    </Link>
                  )}

                  <div className="border-t border-slate-100 my-1" />

                  {/* Convenient role switch helper for testing */}
                  <div className="px-4 py-1.5 flex items-center justify-between text-xs text-slate-500">
                    <span>Role mode:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setUserRole(user.user_role === 'admin' ? 'user' : 'admin');
                      }}
                      className="font-bold text-blue-600 hover:underline"
                    >
                      Switch to {user.user_role === 'admin' ? 'User' : 'Admin'}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      signOut();
                      setUserDropdownOpen(false);
                      navigate('/');
                    }}
                    className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-100"
            >
              {link.label}
            </Link>
          ))}

          {isAICoachAvailable && onOpenAICoach && (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAICoach();
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-base font-semibold text-purple-700 bg-purple-50 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              AI Typing Coach
            </button>
          )}

          {isGuest || !user ? (
            <div className="pt-3 border-t border-slate-200 flex flex-col gap-2.5">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-white hover:bg-blue-50 text-[#2563EB] border-2 border-[#2563EB] font-semibold text-sm py-2.5 rounded-[8px] transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm py-2.5 rounded-[8px] transition-colors shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-semibold text-slate-700"
              >
                Dashboard
              </Link>
              {user.user_role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-sm font-semibold text-blue-600"
                >
                  Admin Panel
                </Link>
              )}
              <button
                type="button"
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 text-sm font-semibold text-red-600"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
