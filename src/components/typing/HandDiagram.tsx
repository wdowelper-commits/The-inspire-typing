import React from 'react';
import { FingerId, FINGER_CONFIGS } from './Keyboard';

interface HandDiagramProps {
  activeFingerId?: FingerId | null;
  nextKey?: string;
  isUrdu?: boolean;
  requiresShift?: boolean;
}

export const HandDiagram: React.FC<HandDiagramProps> = ({
  activeFingerId,
  nextKey,
  isUrdu = false,
  requiresShift = false,
}) => {
  const getFingerState = (fingerId: FingerId) => {
    const isActive =
      activeFingerId === fingerId ||
      (activeFingerId === 'thumbs' && fingerId === 'thumbs');
    const config = FINGER_CONFIGS[fingerId];

    return {
      isActive,
      color: config.dotColor,
      nameEn: config.nameEn,
      nameUr: config.tooltipUr,
    };
  };

  const activeConfig = activeFingerId ? FINGER_CONFIGS[activeFingerId] : null;

  return (
    <div className="w-full mb-1.5 flex items-center justify-between bg-slate-950/80 border border-slate-800/90 rounded-xl px-2.5 sm:px-4 py-1 sm:py-1.5 shadow-md select-none">
      {/* Left Hand Container */}
      <div className="flex items-center gap-2">
        <svg
          viewBox="0 0 170 160"
          className="w-14 sm:w-16 h-9 sm:h-11 transition-transform shrink-0"
          style={{ overflow: 'visible' }}
          aria-label="Left Hand Finger Guide"
        >
          {/* Palm and Wrist Background */}
          <path
            d="M 32 150 C 30 130 32 108 42 90 C 44 86 52 86 58 88 C 70 88 84 88 98 88 C 114 88 126 92 134 100 C 146 116 138 136 128 150 Z"
            fill="#1E293B"
            fillOpacity="0.45"
            stroke="#334155"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Left Pinky (#8B5CF6) */}
          <g
            className={`transition-all duration-200 ${
              getFingerState('left-pinky').isActive
                ? 'scale-110 origin-bottom'
                : 'opacity-40 hover:opacity-75'
            }`}
            style={{
              filter: getFingerState('left-pinky').isActive
                ? `drop-shadow(0 0 8px ${getFingerState('left-pinky').color})`
                : 'none',
            }}
          >
            <rect x="22" y="74" width="13" height="24" rx="4" fill="#8B5CF6" fillOpacity={getFingerState('left-pinky').isActive ? 1 : 0.4} stroke="#8B5CF6" strokeWidth="1.5" />
            <rect x="23" y="54" width="11" height="18" rx="3.5" fill="#8B5CF6" fillOpacity={getFingerState('left-pinky').isActive ? 1 : 0.4} stroke="#8B5CF6" strokeWidth="1.5" />
            <rect x="24" y="38" width="9" height="14" rx="4" fill="#8B5CF6" fillOpacity={getFingerState('left-pinky').isActive ? 1 : 0.4} stroke="#8B5CF6" strokeWidth="1.5" />
          </g>

          {/* Left Ring (#3B82F6) */}
          <g
            className={`transition-all duration-200 ${
              getFingerState('left-ring').isActive
                ? 'scale-110 origin-bottom'
                : 'opacity-40 hover:opacity-75'
            }`}
            style={{
              filter: getFingerState('left-ring').isActive
                ? `drop-shadow(0 0 8px ${getFingerState('left-ring').color})`
                : 'none',
            }}
          >
            <rect x="42" y="66" width="14" height="26" rx="4" fill="#3B82F6" fillOpacity={getFingerState('left-ring').isActive ? 1 : 0.4} stroke="#3B82F6" strokeWidth="1.5" />
            <rect x="43" y="44" width="12" height="20" rx="4" fill="#3B82F6" fillOpacity={getFingerState('left-ring').isActive ? 1 : 0.4} stroke="#3B82F6" strokeWidth="1.5" />
            <rect x="44" y="24" width="10" height="18" rx="4.5" fill="#3B82F6" fillOpacity={getFingerState('left-ring').isActive ? 1 : 0.4} stroke="#3B82F6" strokeWidth="1.5" />
          </g>

          {/* Left Middle (#06B6D4) */}
          <g
            className={`transition-all duration-200 ${
              getFingerState('left-middle').isActive
                ? 'scale-110 origin-bottom'
                : 'opacity-40 hover:opacity-75'
            }`}
            style={{
              filter: getFingerState('left-middle').isActive
                ? `drop-shadow(0 0 8px ${getFingerState('left-middle').color})`
                : 'none',
            }}
          >
            <rect x="64" y="64" width="15" height="28" rx="4" fill="#06B6D4" fillOpacity={getFingerState('left-middle').isActive ? 1 : 0.4} stroke="#06B6D4" strokeWidth="1.5" />
            <rect x="65" y="40" width="13" height="22" rx="4" fill="#06B6D4" fillOpacity={getFingerState('left-middle').isActive ? 1 : 0.4} stroke="#06B6D4" strokeWidth="1.5" />
            <rect x="66.5" y="14" width="10" height="24" rx="4.5" fill="#06B6D4" fillOpacity={getFingerState('left-middle').isActive ? 1 : 0.4} stroke="#06B6D4" strokeWidth="1.5" />
          </g>

          {/* Left Index (#10B981) */}
          <g
            className={`transition-all duration-200 ${
              getFingerState('left-index').isActive
                ? 'scale-110 origin-bottom'
                : 'opacity-40 hover:opacity-75'
            }`}
            style={{
              filter: getFingerState('left-index').isActive
                ? `drop-shadow(0 0 8px ${getFingerState('left-index').color})`
                : 'none',
            }}
          >
            <rect x="88" y="68" width="15" height="26" rx="4" fill="#10B981" fillOpacity={getFingerState('left-index').isActive ? 1 : 0.4} stroke="#10B981" strokeWidth="1.5" />
            <rect x="89.5" y="46" width="12" height="20" rx="4" fill="#10B981" fillOpacity={getFingerState('left-index').isActive ? 1 : 0.4} stroke="#10B981" strokeWidth="1.5" />
            <rect x="91" y="26" width="9" height="18" rx="4.5" fill="#10B981" fillOpacity={getFingerState('left-index').isActive ? 1 : 0.4} stroke="#10B981" strokeWidth="1.5" />
          </g>

          {/* Left Thumb */}
          <g
            className={`transition-all duration-200 ${
              getFingerState('thumbs').isActive
                ? 'scale-110 origin-bottom-left'
                : 'opacity-40 hover:opacity-75'
            }`}
            style={{
              filter: getFingerState('thumbs').isActive
                ? 'drop-shadow(0 0 8px #38BDF8)'
                : 'none',
            }}
          >
            <path
              d="M 112 108 C 122 100 134 92 144 88 C 150 86 156 92 152 98 C 144 108 134 120 124 130 Z"
              fill={getFingerState('thumbs').isActive ? '#0284C7' : '#334155'}
              fillOpacity={getFingerState('thumbs').isActive ? 1 : 0.4}
              stroke={getFingerState('thumbs').isActive ? '#38BDF8' : '#475569'}
              strokeWidth="1.5"
            />
          </g>
        </svg>

        <div className="hidden md:flex flex-col">
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
            Left Hand
          </span>
          <span className="text-[10px] text-slate-400 font-urdu-typing">
            بایاں ہاتھ
          </span>
        </div>
      </div>

      {/* Center Target Info: Next Key + Finger Guide */}
      <div className="flex flex-col items-center justify-center px-2 text-center">
        {/* Next Key Row */}
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[11px] font-medium text-slate-400">
            {isUrdu ? 'اگلی کلید:' : 'Next Key:'}
          </span>
          <span className="inline-flex items-center justify-center min-w-[24px] h-5.5 px-2 rounded-md bg-blue-600 text-white font-mono font-bold text-xs uppercase shadow-xs">
            {nextKey === 'space' ? 'Space Bar' : nextKey || '—'}
          </span>
          {requiresShift && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
              + Shift
            </span>
          )}
        </div>

        {/* Finger Prompt */}
        {activeConfig ? (
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-200">
            <span
              className="w-2 h-2 rounded-full shrink-0 animate-pulse shadow-xs"
              style={{ backgroundColor: activeConfig.dotColor }}
            />
            <span>Use {activeConfig.nameEn} finger</span>
            <span className="text-slate-500">•</span>
            <span
              className="font-urdu-typing text-xs font-bold"
              style={{ color: activeConfig.dotColor }}
            >
              {activeConfig.tooltipUr}
            </span>
          </div>
        ) : (
          <span className="text-[11px] text-slate-400">
            {isUrdu ? 'انگلیوں کی رہنمائی فعال ہے' : 'Touch Typing Ready'}
          </span>
        )}
      </div>

      {/* Right Hand Container */}
      <div className="flex items-center gap-2">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
            Right Hand
          </span>
          <span className="text-[10px] text-slate-400 font-urdu-typing">
            دایاں ہاتھ
          </span>
        </div>

        <svg
          viewBox="0 0 170 160"
          className="w-14 sm:w-16 h-9 sm:h-11 transition-transform shrink-0"
          style={{ overflow: 'visible' }}
          aria-label="Right Hand Finger Guide"
        >
          {/* Palm and Wrist Background */}
          <path
            d="M 138 150 C 140 130 138 108 128 90 C 126 86 118 86 112 88 C 100 88 86 88 72 88 C 56 88 44 92 36 100 C 24 116 32 136 42 150 Z"
            fill="#1E293B"
            fillOpacity="0.45"
            stroke="#334155"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Right Thumb */}
          <g
            className={`transition-all duration-200 ${
              getFingerState('thumbs').isActive
                ? 'scale-110 origin-bottom-right'
                : 'opacity-40 hover:opacity-75'
            }`}
            style={{
              filter: getFingerState('thumbs').isActive
                ? 'drop-shadow(0 0 8px #38BDF8)'
                : 'none',
            }}
          >
            <path
              d="M 58 108 C 48 100 36 92 26 88 C 20 86 14 92 18 98 C 26 108 36 120 46 130 Z"
              fill={getFingerState('thumbs').isActive ? '#0284C7' : '#334155'}
              fillOpacity={getFingerState('thumbs').isActive ? 1 : 0.4}
              stroke={getFingerState('thumbs').isActive ? '#38BDF8' : '#475569'}
              strokeWidth="1.5"
            />
          </g>

          {/* Right Index (#F59E0B) */}
          <g
            className={`transition-all duration-200 ${
              getFingerState('right-index').isActive
                ? 'scale-110 origin-bottom'
                : 'opacity-40 hover:opacity-75'
            }`}
            style={{
              filter: getFingerState('right-index').isActive
                ? `drop-shadow(0 0 8px ${getFingerState('right-index').color})`
                : 'none',
            }}
          >
            <rect x="67" y="68" width="15" height="26" rx="4" fill="#F59E0B" fillOpacity={getFingerState('right-index').isActive ? 1 : 0.4} stroke="#F59E0B" strokeWidth="1.5" />
            <rect x="68.5" y="46" width="12" height="20" rx="4" fill="#F59E0B" fillOpacity={getFingerState('right-index').isActive ? 1 : 0.4} stroke="#F59E0B" strokeWidth="1.5" />
            <rect x="70" y="26" width="9" height="18" rx="4.5" fill="#F59E0B" fillOpacity={getFingerState('right-index').isActive ? 1 : 0.4} stroke="#F59E0B" strokeWidth="1.5" />
          </g>

          {/* Right Middle (#EF4444) */}
          <g
            className={`transition-all duration-200 ${
              getFingerState('right-middle').isActive
                ? 'scale-110 origin-bottom'
                : 'opacity-40 hover:opacity-75'
            }`}
            style={{
              filter: getFingerState('right-middle').isActive
                ? `drop-shadow(0 0 8px ${getFingerState('right-middle').color})`
                : 'none',
            }}
          >
            <rect x="91" y="64" width="15" height="28" rx="4" fill="#EF4444" fillOpacity={getFingerState('right-middle').isActive ? 1 : 0.4} stroke="#EF4444" strokeWidth="1.5" />
            <rect x="92" y="40" width="13" height="22" rx="4" fill="#EF4444" fillOpacity={getFingerState('right-middle').isActive ? 1 : 0.4} stroke="#EF4444" strokeWidth="1.5" />
            <rect x="93.5" y="14" width="10" height="24" rx="4.5" fill="#EF4444" fillOpacity={getFingerState('right-middle').isActive ? 1 : 0.4} stroke="#EF4444" strokeWidth="1.5" />
          </g>

          {/* Right Ring (#EC4899) */}
          <g
            className={`transition-all duration-200 ${
              getFingerState('right-ring').isActive
                ? 'scale-110 origin-bottom'
                : 'opacity-40 hover:opacity-75'
            }`}
            style={{
              filter: getFingerState('right-ring').isActive
                ? `drop-shadow(0 0 8px ${getFingerState('right-ring').color})`
                : 'none',
            }}
          >
            <rect x="114" y="66" width="14" height="26" rx="4" fill="#EC4899" fillOpacity={getFingerState('right-ring').isActive ? 1 : 0.4} stroke="#EC4899" strokeWidth="1.5" />
            <rect x="115" y="44" width="12" height="20" rx="4" fill="#EC4899" fillOpacity={getFingerState('right-ring').isActive ? 1 : 0.4} stroke="#EC4899" strokeWidth="1.5" />
            <rect x="116" y="24" width="10" height="18" rx="4.5" fill="#EC4899" fillOpacity={getFingerState('right-ring').isActive ? 1 : 0.4} stroke="#EC4899" strokeWidth="1.5" />
          </g>

          {/* Right Pinky (#64748B) */}
          <g
            className={`transition-all duration-200 ${
              getFingerState('right-pinky').isActive
                ? 'scale-110 origin-bottom'
                : 'opacity-40 hover:opacity-75'
            }`}
            style={{
              filter: getFingerState('right-pinky').isActive
                ? `drop-shadow(0 0 8px ${getFingerState('right-pinky').color})`
                : 'none',
            }}
          >
            <rect x="135" y="74" width="13" height="24" rx="4" fill="#64748B" fillOpacity={getFingerState('right-pinky').isActive ? 1 : 0.4} stroke="#64748B" strokeWidth="1.5" />
            <rect x="136" y="54" width="11" height="18" rx="3.5" fill="#64748B" fillOpacity={getFingerState('right-pinky').isActive ? 1 : 0.4} stroke="#64748B" strokeWidth="1.5" />
            <rect x="137" y="38" width="9" height="14" rx="4" fill="#64748B" fillOpacity={getFingerState('right-pinky').isActive ? 1 : 0.4} stroke="#64748B" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
};
