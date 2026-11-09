import React from 'react';
import { FingerId, FINGER_CONFIGS } from './Keyboard';
import { LeftHand } from './LeftHand';
import { RightHand } from './RightHand';

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
  const activeConfig = activeFingerId ? FINGER_CONFIGS[activeFingerId] : null;

  return (
    <div className="w-full mb-1.5 flex items-center justify-between bg-slate-950/85 border border-slate-800/90 rounded-xl px-2 sm:px-4 py-1 sm:py-1.5 shadow-md select-none">
      {/* Left Hand Container */}
      <div className="flex items-center gap-2">
        <LeftHand
          activeFingerId={activeFingerId}
          className="w-16 sm:w-20 h-10 sm:h-12 transition-transform shrink-0"
        />

        <div className="hidden lg:flex flex-col">
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
            Left Hand
          </span>
          <span className="text-[10px] text-slate-400 font-urdu-typing">
            بایاں ہاتھ
          </span>
        </div>
      </div>

      {/* Center Target Info: Next Key + Finger Guide */}
      <div className="flex flex-col items-center justify-center px-1 sm:px-2 text-center">
        {/* Next Key Row */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5">
          <span className="text-[10px] sm:text-[11px] font-medium text-slate-400">
            {isUrdu ? 'اگلی کلید:' : 'Next Key:'}
          </span>
          <span className="inline-flex items-center justify-center min-w-[24px] h-5 sm:h-5.5 px-2 rounded-md bg-blue-600 text-white font-mono font-bold text-xs uppercase shadow-xs">
            {nextKey === 'space' ? 'Space Bar' : nextKey || '—'}
          </span>
          {requiresShift && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] sm:text-[10px] font-bold">
              + Shift
            </span>
          )}
        </div>

        {/* Finger Prompt */}
        {activeConfig ? (
          <div className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-semibold text-slate-200">
            <span
              className="w-2 h-2 rounded-full shrink-0 animate-pulse shadow-xs"
              style={{ backgroundColor: activeConfig.dotColor }}
            />
            <span className="truncate">Use {activeConfig.nameEn} finger</span>
            <span className="text-slate-500">•</span>
            <span
              className="font-urdu-typing text-xs font-bold"
              style={{ color: activeConfig.dotColor }}
            >
              {activeConfig.tooltipUr}
            </span>
          </div>
        ) : (
          <span className="text-[10px] sm:text-[11px] text-slate-400">
            {isUrdu ? 'انگلیوں کی رہنمائی فعال ہے' : 'Touch Typing Ready'}
          </span>
        )}
      </div>

      {/* Right Hand Container */}
      <div className="flex items-center gap-2">
        <div className="hidden lg:flex flex-col items-end">
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
            Right Hand
          </span>
          <span className="text-[10px] text-slate-400 font-urdu-typing">
            دایاں ہاتھ
          </span>
        </div>

        <RightHand
          activeFingerId={activeFingerId}
          className="w-16 sm:w-20 h-10 sm:h-12 transition-transform shrink-0"
        />
      </div>
    </div>
  );
};
export { LeftHand } from './LeftHand';
export { RightHand } from './RightHand';
