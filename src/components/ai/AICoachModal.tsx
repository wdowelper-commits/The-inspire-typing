import React, { useState } from 'react';
import { Sparkles, Brain, CheckCircle, ArrowRight, Play, Loader2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { requestAICoachAnalysis, CoachAnalysisResponse } from '../../lib/aiCoach';
import { useSettingsStore } from '../../stores/settingsStore';
import { useNavigate } from 'react-router-dom';

export interface AICoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  recentWpm?: number;
  recentAccuracy?: number;
  onStartCustomDrill?: (text: string) => void;
}

export const AICoachModal: React.FC<AICoachModalProps> = ({
  isOpen,
  onClose,
  recentWpm = 45,
  recentAccuracy = 96,
  onStartCustomDrill,
}) => {
  const { language } = useSettingsStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [goal, setGoal] = useState('Reach 70 WPM with 98% accuracy');
  const [weakKeysInput, setWeakKeysInput] = useState('p, q, ;, Shift');
  const [result, setResult] = useState<CoachAnalysisResponse | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const weakKeys = weakKeysInput
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean);

      const resp = await requestAICoachAnalysis({
        language,
        wpm: recentWpm,
        accuracy: recentAccuracy,
        mistakes: 4,
        weakKeys,
        goal,
      });
      setResult(resp);
    } finally {
      setLoading(false);
    }
  };

  const handlePracticeDrill = () => {
    if (result?.generatedDrillText) {
      if (onStartCustomDrill) {
        onStartCustomDrill(result.generatedDrillText);
      } else {
        navigate('/test', { state: { customText: result.generatedDrillText } });
      }
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center shadow-inner">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
              AI Typing Coach &amp; Drill Generator
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 uppercase tracking-wider">
                High Thinking
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Deep cognitive diagnosis powered by Gemini with advanced reasoning for English &amp; Urdu typing.
            </p>
          </div>
        </div>

        {/* Input Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Current Benchmark
            </label>
            <div className="text-sm font-semibold text-slate-800 flex items-center gap-3">
              <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200">
                ⚡ {recentWpm} WPM
              </span>
              <span className="px-2.5 py-1 bg-white rounded-lg border border-slate-200">
                🎯 {recentAccuracy}% Acc
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Active Language
            </label>
            <span className="inline-block px-3 py-1 bg-white rounded-lg border border-slate-200 text-xs font-bold text-blue-600 capitalize">
              {language.replace('-', ' ')}
            </span>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Tricky Keys / Hesitation Points
            </label>
            <input
              type="text"
              value={weakKeysInput}
              onChange={(e) => setWeakKeysInput(e.target.value)}
              placeholder="e.g. p, q, Shift, Numbers, or Urdu letters"
              className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Your Target Goal
            </label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. Pass a 60 WPM employment typing test"
              className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <Button
          variant="primary"
          className="w-full bg-purple-600 hover:bg-purple-700 shadow-purple-500/20"
          disabled={loading}
          icon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          onClick={handleAnalyze}
        >
          {loading ? 'AI Analyzing with Deep Thinking...' : 'Generate AI Diagnosis & Custom Drill'}
        </Button>

        {/* Results view */}
        {result && (
          <div className="space-y-4 pt-3 border-t border-slate-200 animate-in fade-in">
            {/* Diagnosis */}
            <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4">
              <h4 className="text-xs font-bold text-purple-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-purple-600" />
                Coach Diagnosis
              </h4>
              <p className="text-sm text-slate-800 leading-relaxed font-medium">{result.diagnosis}</p>
            </div>

            {/* Insights & Drills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <h5 className="font-bold text-slate-900 mb-2">Key Technique Adjustments:</h5>
                <ul className="space-y-1.5 text-slate-600">
                  {result.keyInsights.map((ins, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-purple-600 font-bold">•</span>
                      <span>{ins}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <h5 className="font-bold text-slate-900 mb-2">Recommended Focus Drills:</h5>
                <ul className="space-y-1.5 text-slate-600">
                  {result.recommendedDrills.map((drill, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{drill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Generated Drill Text */}
            <div className="bg-slate-900 text-white p-4 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  Targeted Practice Paragraph
                </span>
                <span className="text-[10px] text-slate-400">Tailored to your weak keys</span>
              </div>
              <p
                className={`text-sm leading-relaxed ${
                  language.startsWith('urdu') ? 'font-urdu-typing text-right text-base' : 'font-mono-typing'
                }`}
                dir={language.startsWith('urdu') ? 'rtl' : 'ltr'}
              >
                {result.generatedDrillText}
              </p>

              <div className="mt-4 flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700"
                  icon={<Play className="w-4 h-4" />}
                  onClick={handlePracticeDrill}
                >
                  Practice This Drill Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
