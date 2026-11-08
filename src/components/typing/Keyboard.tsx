import React from 'react';
import { Language } from '../../types';
import {
  KEYBOARD_ROWS,
  URDU_PHONETIC_MAP,
  URDU_STANDARD_MAP,
} from '../../lib/urduKeyboardMap';
import { useSettingsStore } from '../../stores/settingsStore';
import { HandDiagram } from './HandDiagram';

export interface KeyboardProps {
  nextKey?: string;
  requiresShift?: boolean;
  language: Language;
  showFingerGuide?: boolean;
}

export type FingerId =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky'
  | 'thumbs';

export interface FingerConfig {
  id: FingerId;
  nameEn: string;
  nameUr: string;
  tooltipUr: string;
  dotColor: string;
  borderColor: string;
  textColor: string;
}

// FIX 5: Exact specified finger-to-color mapping
export const FINGER_CONFIGS: Record<FingerId, FingerConfig> = {
  'left-pinky': {
    id: 'left-pinky',
    nameEn: 'Left Pinky',
    nameUr: 'بائیں خنصر (چھوٹی انگلی)',
    tooltipUr: 'بائیں خنصر',
    dotColor: '#8B5CF6', // purple
    borderColor: 'border-purple-500',
    textColor: 'text-purple-400',
  },
  'left-ring': {
    id: 'left-ring',
    nameEn: 'Left Ring',
    nameUr: 'بائیں بنصر (انگوٹھی انگلی)',
    tooltipUr: 'بائیں بنصر',
    dotColor: '#3B82F6', // blue
    borderColor: 'border-blue-500',
    textColor: 'text-blue-400',
  },
  'left-middle': {
    id: 'left-middle',
    nameEn: 'Left Middle',
    nameUr: 'بائیں وسطیٰ (درمیانی انگلی)',
    tooltipUr: 'بائیں وسطیٰ',
    dotColor: '#06B6D4', // cyan
    borderColor: 'border-cyan-400',
    textColor: 'text-cyan-400',
  },
  'left-index': {
    id: 'left-index',
    nameEn: 'Left Index',
    nameUr: 'بائیں شہادت (اشاریہ)',
    tooltipUr: 'بائیں شہادت',
    dotColor: '#10B981', // green
    borderColor: 'border-emerald-500',
    textColor: 'text-emerald-400',
  },
  'right-index': {
    id: 'right-index',
    nameEn: 'Right Index',
    nameUr: 'دائیں شہادت (اشاریہ)',
    tooltipUr: 'دائیں شہادت',
    dotColor: '#F59E0B', // amber
    borderColor: 'border-amber-500',
    textColor: 'text-amber-400',
  },
  'right-middle': {
    id: 'right-middle',
    nameEn: 'Right Middle',
    nameUr: 'دائیں وسطیٰ (درمیانی انگلی)',
    tooltipUr: 'دائیں وسطیٰ',
    dotColor: '#EF4444', // red
    borderColor: 'border-red-500',
    textColor: 'text-red-400',
  },
  'right-ring': {
    id: 'right-ring',
    nameEn: 'Right Ring',
    nameUr: 'دائیں بنصر (انگوٹھی انگلی)',
    tooltipUr: 'دائیں بنصر',
    dotColor: '#EC4899', // pink
    borderColor: 'border-pink-500',
    textColor: 'text-pink-400',
  },
  'right-pinky': {
    id: 'right-pinky',
    nameEn: 'Right Pinky',
    nameUr: 'دائیں خنصر (چھوٹی انگلی)',
    tooltipUr: 'دائیں خنصر',
    dotColor: '#64748B', // gray
    borderColor: 'border-slate-500',
    textColor: 'text-slate-400',
  },
  thumbs: {
    id: 'thumbs',
    nameEn: 'Thumbs',
    nameUr: 'دونوں انگوٹھے (اسپیس بار)',
    tooltipUr: 'دونوں انگوٹھے',
    dotColor: '#1E293B', // dark slate
    borderColor: 'border-slate-700',
    textColor: 'text-slate-300',
  },
};

// Key to Finger dictionary
export const KEY_FINGER_MAP: Record<string, FingerId> = {
  // Left Pinky: ` 1 Q A Z Tab Caps Shift
  '`': 'left-pinky',
  '~': 'left-pinky',
  '1': 'left-pinky',
  '!': 'left-pinky',
  q: 'left-pinky',
  a: 'left-pinky',
  z: 'left-pinky',
  tab: 'left-pinky',
  caps: 'left-pinky',
  'shift-left': 'left-pinky',

  // Left Ring: 2 W S X
  '2': 'left-ring',
  '@': 'left-ring',
  w: 'left-ring',
  s: 'left-ring',
  x: 'left-ring',

  // Left Middle: 3 E D C
  '3': 'left-middle',
  '#': 'left-middle',
  e: 'left-middle',
  d: 'left-middle',
  c: 'left-middle',

  // Left Index: 4 5 R T F G V B
  '4': 'left-index',
  '$': 'left-index',
  '5': 'left-index',
  '%': 'left-index',
  r: 'left-index',
  t: 'left-index',
  f: 'left-index',
  g: 'left-index',
  v: 'left-index',
  b: 'left-index',

  // Right Index: 6 7 Y U H J N M
  '6': 'right-index',
  '^': 'right-index',
  '7': 'right-index',
  '&': 'right-index',
  y: 'right-index',
  u: 'right-index',
  h: 'right-index',
  j: 'right-index',
  n: 'right-index',
  m: 'right-index',

  // Right Middle: 8 I K ,
  '8': 'right-middle',
  '*': 'right-middle',
  i: 'right-middle',
  k: 'right-middle',
  ',': 'right-middle',
  '<': 'right-middle',

  // Right Ring: 9 O L .
  '9': 'right-ring',
  '(': 'right-ring',
  o: 'right-ring',
  l: 'right-ring',
  '.': 'right-ring',
  '>': 'right-ring',

  // Right Pinky: 0 - = P ; ' / [ ] \ Backspace Enter
  '0': 'right-pinky',
  ')': 'right-pinky',
  '-': 'right-pinky',
  '_': 'right-pinky',
  '=': 'right-pinky',
  '+': 'right-pinky',
  p: 'right-pinky',
  '[': 'right-pinky',
  '{': 'right-pinky',
  ']': 'right-pinky',
  '}': 'right-pinky',
  '\\': 'right-pinky',
  '|': 'right-pinky',
  ';': 'right-pinky',
  ':': 'right-pinky',
  "'": 'right-pinky',
  '"': 'right-pinky',
  '/': 'right-pinky',
  '?': 'right-pinky',
  bksp: 'right-pinky',
  enter: 'right-pinky',
  'shift-right': 'right-pinky',

  // Thumbs: Spacebar
  space: 'thumbs',
};

const ORDERED_FINGERS: FingerId[] = [
  'left-pinky',
  'left-ring',
  'left-middle',
  'left-index',
  'right-index',
  'right-middle',
  'right-ring',
  'right-pinky',
  'thumbs',
];

export const Keyboard: React.FC<KeyboardProps> = ({
  nextKey = '',
  requiresShift = false,
  language,
  showFingerGuide: propFingerGuide,
}) => {
  const storeFingerGuide = useSettingsStore((s) => s.fingerGuideEnabled);
  const showGuide = propFingerGuide !== undefined ? propFingerGuide : storeFingerGuide;

  const normNextKey = nextKey.toLowerCase();
  const isUrdu = language.startsWith('urdu');

  // Identify active finger
  const activeFingerId = normNextKey ? KEY_FINGER_MAP[normNextKey] : undefined;
  const activeFinger = activeFingerId ? FINGER_CONFIGS[activeFingerId] : undefined;

  const getSubChar = (key: string) => {
    if (language === 'urdu-phonetic') {
      const mapping = URDU_PHONETIC_MAP[key.toLowerCase()];
      return mapping ? mapping.base : null;
    }
    if (language === 'urdu-standard') {
      const mapping = URDU_STANDARD_MAP[key.toLowerCase()];
      return mapping ? mapping.base : null;
    }
    return null;
  };

  const getShiftSubChar = (key: string) => {
    if (language === 'urdu-phonetic') {
      const mapping = URDU_PHONETIC_MAP[key.toLowerCase()];
      return mapping?.shift || null;
    }
    if (language === 'urdu-standard') {
      const mapping = URDU_STANDARD_MAP[key.toLowerCase()];
      return mapping?.shift || null;
    }
    return null;
  };

  const renderKey = (
    keyLabel: string,
    keyId: string,
    options: {
      extraWidth?: string;
      isSpecial?: boolean;
      forceTarget?: boolean;
    } = {}
  ) => {
    const isTarget = options.forceTarget ?? (normNextKey === keyId.toLowerCase());
    const fingerId = KEY_FINGER_MAP[keyId.toLowerCase()] || 'left-pinky';
    const finger = FINGER_CONFIGS[fingerId];
    const sub = !options.isSpecial ? getSubChar(keyId) : null;
    const shiftSub = !options.isSpecial ? getShiftSubChar(keyId) : null;

    return (
      <div
        key={keyId}
        className={`relative flex flex-col items-center justify-center rounded-lg font-medium text-xs sm:text-sm h-7.5 sm:h-8.5 transition-all duration-150 select-none ${
          options.extraWidth || 'flex-1 max-w-[48px]'
        } ${
          isTarget
            ? 'bg-blue-600 text-white shadow-md shadow-blue-500/50 scale-105 z-20 border-2 border-white ring-2 ring-blue-400/40'
            : 'bg-slate-700/85 text-slate-200 border border-slate-600/60 hover:bg-slate-600/80'
        }`}
      >
        {/* Floating tooltip above the NEXT KEY to press */}
        {isTarget && (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap px-2 py-0.5 rounded-md bg-slate-900 text-white border border-slate-600 text-[10px] font-bold shadow-lg pointer-events-none flex items-center gap-1.5 animate-bounce">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: finger.dotColor }}
            />
            <span>{isUrdu ? finger.tooltipUr : finger.nameEn}</span>
          </div>
        )}

        {/* 6px Color Dot in top-left corner */}
        {showGuide && !options.isSpecial && (
          <span
            className="absolute top-1 left-1.5 w-[6px] h-[6px] rounded-full shadow-xs"
            style={{ backgroundColor: finger.dotColor }}
            title={`${finger.nameEn} • ${finger.nameUr}`}
            aria-hidden="true"
          />
        )}

        {/* Key label */}
        <span className={options.isSpecial ? 'text-[11px] font-semibold text-slate-300' : 'uppercase font-bold'}>
          {keyLabel}
        </span>

        {/* Urdu Base Character */}
        {sub && (
          <span
            className={`absolute bottom-0.5 right-1 text-[11px] sm:text-xs font-urdu-typing ${
              isTarget ? 'text-amber-200 font-bold' : 'text-amber-400'
            }`}
          >
            {sub}
          </span>
        )}

        {/* Urdu Shift Character */}
        {shiftSub && (
          <span
            className={`absolute top-0.5 right-1 text-[9px] font-urdu-typing opacity-80 ${
              isTarget ? 'text-blue-100 font-bold' : 'text-slate-400'
            }`}
          >
            {shiftSub}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900/95 p-2 sm:p-2.5 rounded-2xl shadow-xl border border-slate-700/70 select-none">
      {/* Top Header: Either Unified Hand Diagram or Minimal Next Key Strip */}
      {showGuide ? (
        <HandDiagram
          activeFingerId={activeFingerId}
          nextKey={normNextKey}
          isUrdu={isUrdu}
          requiresShift={requiresShift}
        />
      ) : (
        <div className="mb-1.5 px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium text-[11px]">
              {isUrdu ? 'اگلی کلید / Next Key:' : 'Next Key:'}
            </span>
            <span className="inline-flex items-center justify-center min-w-[24px] h-5.5 px-2 rounded bg-blue-600 text-white font-mono font-bold text-xs uppercase shadow-xs">
              {normNextKey === 'space' ? 'Space Bar' : normNextKey || '—'}
            </span>
            {requiresShift && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                + Shift
              </span>
            )}
          </div>
          <span className="text-slate-400 text-[11px] italic">
            {isUrdu ? 'کی بورڈ ڈسپلے' : 'Keyboard Display'}
          </span>
        </div>
      )}

      {/* Main Visual Keyboard Layout */}
      <div className="flex flex-col gap-1.5 sm:gap-2">
        {/* Row 1: Numbers & Symbols */}
        <div className="flex gap-1 sm:gap-1.5 justify-center">
          {KEYBOARD_ROWS[0].map((k) => renderKey(k, k))}
          {renderKey('Bksp', 'bksp', { extraWidth: 'px-2 sm:px-3 flex-none min-w-[48px]', isSpecial: true })}
        </div>

        {/* Row 2: QWERTY */}
        <div className="flex gap-1 sm:gap-1.5 justify-center">
          {renderKey('Tab', 'tab', { extraWidth: 'px-2.5 flex-none min-w-[48px]', isSpecial: true })}
          {KEYBOARD_ROWS[1].map((k) => renderKey(k, k))}
        </div>

        {/* Row 3: ASDF */}
        <div className="flex gap-1 sm:gap-1.5 justify-center">
          {renderKey('Caps', 'caps', { extraWidth: 'px-3 flex-none min-w-[56px]', isSpecial: true })}
          {KEYBOARD_ROWS[2].map((k) => renderKey(k, k))}
          {renderKey('Enter', 'enter', { extraWidth: 'px-3 flex-none min-w-[62px]', isSpecial: true })}
        </div>

        {/* Row 4: ZXCV & Shifts */}
        <div className="flex gap-1 sm:gap-1.5 justify-center">
          <div
            className={`flex items-center justify-center rounded-lg font-semibold text-xs h-7.5 sm:h-8.5 px-2.5 sm:px-3 transition-all ${
              requiresShift
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/50 scale-105 border-2 border-amber-200 ring-2 ring-amber-400/40 z-10'
                : 'bg-slate-700/85 text-slate-300 border border-slate-600/60'
            }`}
          >
            Shift
          </div>
          {KEYBOARD_ROWS[3].map((k) => renderKey(k, k))}
          <div
            className={`flex items-center justify-center rounded-lg font-semibold text-xs h-7.5 sm:h-8.5 px-2.5 sm:px-3 transition-all ${
              requiresShift
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/50 scale-105 border-2 border-amber-200 ring-2 ring-amber-400/40 z-10'
                : 'bg-slate-700/85 text-slate-300 border border-slate-600/60'
            }`}
          >
            Shift
          </div>
        </div>

        {/* Row 5: Space Bar */}
        <div className="flex gap-1.5 justify-center mt-0.5">
          <div className="flex-1 max-w-[80px] h-7.5 sm:h-8.5 rounded-lg bg-slate-800/70 text-slate-400 text-xs flex items-center justify-center border border-slate-700/50">
            Ctrl
          </div>
          <div className="flex-1 max-w-[60px] h-7.5 sm:h-8.5 rounded-lg bg-slate-800/70 text-slate-400 text-xs flex items-center justify-center border border-slate-700/50">
            Alt
          </div>
          <div
            className={`relative flex-3 max-w-[360px] h-7.5 sm:h-8.5 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
              normNextKey === 'space'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/50 border-2 border-white scale-102 ring-2 ring-blue-400/40 z-10'
                : 'bg-slate-700/85 text-slate-200 border border-slate-600/60 hover:bg-slate-600/80'
            }`}
          >
            {normNextKey === 'space' && (
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap px-2 py-0.5 rounded-md bg-slate-900 text-white border border-slate-600 text-[10px] font-bold shadow-lg pointer-events-none flex items-center gap-1.5 animate-bounce">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: FINGER_CONFIGS.thumbs.dotColor }}
                />
                <span>{isUrdu ? FINGER_CONFIGS.thumbs.tooltipUr : FINGER_CONFIGS.thumbs.nameEn}</span>
              </div>
            )}
            {showGuide && (
              <span
                className="absolute top-1 left-2 w-[5px] h-[5px] rounded-full"
                style={{ backgroundColor: FINGER_CONFIGS.thumbs.dotColor }}
              />
            )}
            Space Bar
          </div>
          <div className="flex-1 max-w-[60px] h-7.5 sm:h-8.5 rounded-lg bg-slate-800/70 text-slate-400 text-xs flex items-center justify-center border border-slate-700/50">
            Alt
          </div>
          <div className="flex-1 max-w-[80px] h-7.5 sm:h-8.5 rounded-lg bg-slate-800/70 text-slate-400 text-xs flex items-center justify-center border border-slate-700/50">
            Ctrl
          </div>
        </div>
      </div>

      {/* Horizontal Finger Legend Bar */}
      {showGuide && (
        <div className="mt-2 pt-1.5 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-slate-300 text-[10px]">
            {ORDERED_FINGERS.map((fid) => {
              const f = FINGER_CONFIGS[fid];
              const isActive = activeFingerId === fid;
              return (
                <div
                  key={fid}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border transition-all ${
                    isActive
                      ? 'bg-slate-800 border-white ring-1 ring-blue-400 shadow-xs text-white scale-105'
                      : 'bg-slate-800/50 border-slate-700/70 text-slate-400'
                  }`}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: f.dotColor }}
                  />
                  <span className="font-semibold">{f.nameEn}</span>
                  <span className="text-[9px] text-slate-400 font-urdu-typing">
                    {f.tooltipUr}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
