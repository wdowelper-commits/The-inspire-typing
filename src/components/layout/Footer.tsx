import React from 'react';
import { Link } from 'react-router-dom';
import { Keyboard, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white p-0.5 shadow-sm">
                <img
                  src="/logo.png"
                  alt="Inspire Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-lg font-black tracking-tight">Inspire Typing</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Type Faster. Work Smarter. The premier bilingual touch typing tutor for English and Urdu.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Typing Lessons</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/lessons/english" className="hover:text-white transition-colors">
                  English Lessons (36 Levels)
                </Link>
              </li>
              <li>
                <Link to="/lessons/urdu-phonetic" className="hover:text-white transition-colors">
                  Urdu Phonetic Lessons
                </Link>
              </li>
              <li>
                <Link to="/lessons/urdu-standard" className="hover:text-white transition-colors">
                  Urdu Standard (Nastaliq)
                </Link>
              </li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Tests &amp; Ranks</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/test" className="hover:text-white transition-colors">
                  1-Minute Typing Test
                </Link>
              </li>
              <li>
                <Link to="/test" className="hover:text-white transition-colors">
                  5-Minute Certification Test
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-white transition-colors">
                  Global Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Urdu Note */}
          <div className="font-urdu-typing text-right" dir="rtl">
            <h4 className="text-base font-bold text-white mb-2">اردو ٹائپنگ ٹیوٹر</h4>
            <p className="text-xs text-slate-400 leading-loose">
              فونیٹک اور معیاری کی بورڈ پر اردو ٹائپنگ کی تیز رفتار مشق کریں۔ بغیر لاگ ان کے تمام اسباق مفت دستیاب ہیں۔
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Inspire Typing. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for typists worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
