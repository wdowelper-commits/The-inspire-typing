import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Zap,
  Play,
  Globe,
  Award,
} from 'lucide-react';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
import { Language, LessonProgress } from '../types';
import { ENGLISH_LESSONS } from '../data/englishLessons';
import { URDU_PHONETIC_LESSONS } from '../data/urduPhoneticLessons';
import { URDU_STANDARD_LESSONS } from '../data/urduStandardLessons';
import { useAuthStore } from '../stores/authStore';
import { useSettingsStore } from '../stores/settingsStore';
import { dataService } from '../lib/supabase';

export const LessonsPage: React.FC = () => {
  const { language: routeLang } = useParams<{ language?: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { language: storeLang, setLanguage } = useSettingsStore();

  const currentLang: Language =
    (routeLang as Language) || storeLang || 'english';

  const [expandedLesson, setExpandedLesson] = useState<number>(1);
  const [progressList, setProgressList] = useState<LessonProgress[]>([]);

  useEffect(() => {
    if (routeLang && routeLang !== storeLang) {
      setLanguage(routeLang as Language);
    }
  }, [routeLang, storeLang, setLanguage]);

  useEffect(() => {
    if (user) {
      dataService.getUserLessonProgress(user.id).then(setProgressList);
    }
  }, [user]);

  const getLessonsBundle = () => {
    switch (currentLang) {
      case 'urdu-phonetic':
        return URDU_PHONETIC_LESSONS;
      case 'urdu-standard':
        return URDU_STANDARD_LESSONS;
      default:
        return ENGLISH_LESSONS;
    }
  };

  const allLessons = getLessonsBundle();

  // Group the 36 sub-lessons into 12 parent lessons
  const lessonGroups = Array.from({ length: 12 }, (_, i) => {
    const lessonNum = i + 1;
    const subLessons = allLessons.filter((b) => b.lesson.lesson_number === lessonNum);
    return {
      lessonNumber: lessonNum,
      title: subLessons[0]?.lesson.title.split(':')[0] || `Lesson ${lessonNum}`,
      subLessons,
    };
  });

  const completedSet = new Set(
    progressList.filter((p) => p.completed).map((p) => p.lesson_id)
  );

  const bestWpmMap = new Map(progressList.map((p) => [p.lesson_id, p.best_wpm]));

  const completedCount = allLessons.filter((b) => completedSet.has(b.lesson.id)).length;

  const tabs = [
    { id: 'english', label: 'English QWERTY', count: 36 },
    { id: 'urdu-phonetic', label: 'اردو (Phonetic)', count: 36 },
    { id: 'urdu-standard', label: 'اردو معیاری (Nastaliq)', count: 36 },
  ];

  const handleTabChange = (id: string) => {
    setLanguage(id as Language);
    navigate(`/lessons/${id}`);
  };

  const isUrdu = currentLang.startsWith('urdu');

  return (
    <PageWrapper>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <BookOpen className="w-8 h-8 text-blue-600" />
              Typing Lessons Curriculum
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              36 comprehensive levels taking you from home row fundamentals to high-cadence mastery.
            </p>
          </div>

          {/* Progress Pill */}
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              {completedCount}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Progress: {completedCount} / 36
              </div>
              <div className="text-[11px] text-slate-500">
                {Math.round((completedCount / 36) * 100)}% track completed
              </div>
            </div>
          </div>
        </div>

        {/* Language Tabs */}
        <div className="mt-6">
          <Tabs tabs={tabs} activeTab={currentLang} onChange={handleTabChange} />
        </div>
      </div>

      {/* Accordion Lessons List */}
      <div className="space-y-4">
        {lessonGroups.map((group) => {
          const isExpanded = expandedLesson === group.lessonNumber;
          const groupCompleted = group.subLessons.every((s) => completedSet.has(s.lesson.id));

          return (
            <Card
              key={group.lessonNumber}
              className={`overflow-hidden transition-all duration-200 border ${
                groupCompleted ? 'border-emerald-300 bg-white' : 'border-slate-200'
              }`}
            >
              {/* Accordion Header */}
              <button
                type="button"
                onClick={() => setExpandedLesson(isExpanded ? 0 : group.lessonNumber)}
                className="w-full px-6 py-4.5 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${
                      groupCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : isExpanded
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {groupCompleted ? '✓' : group.lessonNumber}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <span>Lesson {group.lessonNumber}</span>
                      <span className="text-slate-400 font-normal">•</span>
                      <span className="text-slate-600 text-sm font-semibold">{group.title}</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      3 sub-lessons (1.{1} – 1.{3})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
                    {group.subLessons.filter((s) => completedSet.has(s.lesson.id)).length}/3 completed
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Sub-lessons Body */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/40">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {group.subLessons.map((bundle) => {
                      const isSubCompleted = completedSet.has(bundle.lesson.id);
                      const bestWpm = bestWpmMap.get(bundle.lesson.id);

                      return (
                        <div
                          key={bundle.lesson.id}
                          className="bg-white rounded-xl p-4 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 uppercase">
                                {bundle.lesson.lesson_number}.{bundle.lesson.sub_lesson_number}
                              </span>
                              {isSubCompleted && (
                                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Done
                                </span>
                              )}
                            </div>

                            <h4 className="font-bold text-sm text-slate-900 leading-snug mb-1">
                              {bundle.lesson.title}
                            </h4>
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                              {bundle.lesson.description}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                            {bestWpm ? (
                              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                <Zap className="w-3.5 h-3.5 text-blue-600" />
                                {bestWpm} WPM
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400">Not started</span>
                            )}

                            <Button
                              size="sm"
                              variant={isSubCompleted ? 'outline' : 'primary'}
                              icon={<Play className="w-3.5 h-3.5" />}
                              onClick={() => navigate(`/lessons/${currentLang}/${bundle.lesson.lesson_code}`)}
                            >
                              {isSubCompleted ? 'Practice' : 'Start'}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </PageWrapper>
  );
};
