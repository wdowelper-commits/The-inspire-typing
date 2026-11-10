import React from 'react';
import { Volume2, VolumeX, X, Mic, Play, Sparkles } from 'lucide-react';
import { useSettingsStore } from '../../stores/settingsStore';
import { voiceGuidance } from '../../lib/voiceGuidance';
import { Button } from '../ui/Button';

interface ReadAloudSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReadAloudSettingsModal: React.FC<ReadAloudSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    readAloudEnabled,
    toggleReadAloud,
    readAloudVolume,
    setReadAloudVolume,
    readAloudSpeed,
    setReadAloudSpeed,
    readAloudMode,
    setReadAloudMode,
    language,
  } = useSettingsStore();

  if (!isOpen) return null;

  const isUrdu = language.startsWith('urdu');

  const handleTestSpeech = () => {
    const sample = isUrdu
      ? 'اردو ٹائپنگ میں خوش آمدید۔ کلید ایف دبائیں، بائیں شہادت کی انگلی سے۔'
      : 'Welcome to Inspire Typing. Press key F with left index finger.';

    voiceGuidance.speak(sample, {
      volume: readAloudVolume,
      rate: readAloudSpeed,
      lang: isUrdu ? 'ur-PK' : 'en-US',
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-51 w-[90vw] max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden select-none">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Read Aloud / Voice Guidance
              </h3>
              <p className="text-[11px] text-slate-500 font-urdu-typing">
                صوتی رہنمائی اور کلیدی ہدایات
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Main Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <div className="text-xs font-bold text-slate-900">Voice Assistance</div>
              <p className="text-[11px] text-slate-500">
                Speaks keys, finger placements, and prompts
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={readAloudEnabled}
                onChange={toggleReadAloud}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>

          {/* Mode Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Guidance Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setReadAloudMode('basic')}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                  readAloudMode === 'basic'
                    ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Basic Guidance
                <span className="block text-[10px] font-normal text-slate-400 mt-0.5">
                  Key &amp; Finger Guidance
                </span>
              </button>
              <button
                type="button"
                onClick={() => setReadAloudMode('keys')}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                  readAloudMode === 'keys'
                    ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Letter by Letter
                <span className="block text-[10px] font-normal text-slate-400 mt-0.5">
                  Letters &amp; Punctuation
                </span>
              </button>
            </div>
          </div>

          {/* Volume Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                {readAloudVolume === 0 ? (
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                )}
                Volume
              </span>
              <span className="font-mono text-slate-500">{readAloudVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={readAloudVolume}
              onChange={(e) => setReadAloudVolume(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
          </div>

          {/* Speed Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Speech Speed</span>
              <span className="font-mono text-slate-500">{readAloudSpeed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={readAloudSpeed}
              onChange={(e) => setReadAloudSpeed(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 px-1">
              <span>0.5x Slow</span>
              <span>1.0x Normal</span>
              <span>2.0x Fast</span>
            </div>
          </div>

          {/* Test Voice Button */}
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center"
              icon={<Play className="w-3.5 h-3.5" />}
              onClick={handleTestSpeech}
            >
              Test Voice Sample
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <Button variant="primary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </>
  );
};
