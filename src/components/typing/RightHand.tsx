import React from 'react';
import { FingerId, FINGER_CONFIGS } from './Keyboard';

interface RightHandProps {
  activeFingerId?: FingerId | null;
  className?: string;
}

export const RightHand: React.FC<RightHandProps> = ({
  activeFingerId,
  className = 'w-16 sm:w-20 h-11 sm:h-13 transition-transform shrink-0',
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

  const thumb = getFingerState('thumbs');
  const index = getFingerState('right-index');
  const middle = getFingerState('right-middle');
  const ring = getFingerState('right-ring');
  const pinky = getFingerState('right-pinky');

  return (
    <svg
      viewBox="0 0 170 160"
      className={className}
      style={{ overflow: 'visible' }}
      aria-label="Right Hand Finger Guide"
    >
      <defs>
        {/* Soft skin gradient for natural 3D hand depth */}
        <linearGradient id="right-palm-grad" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FADBD8" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#F5CBA7" />
          <stop offset="100%" stopColor="#EDBB99" />
        </linearGradient>

        <linearGradient id="right-wrist-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F5CBA7" stopOpacity="0" />
          <stop offset="100%" stopColor="#DC7633" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {/* Palm & Wrist Area */}
      <path
        d="M 142 152 C 146 130 144 104 134 86 C 131 80 123 80 116 82 C 103 82 88 82 72 83 C 56 84 44 90 36 100 C 24 116 34 136 46 152 Z"
        fill="url(#right-palm-grad)"
        stroke="#E59866"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Wrist shading overlay */}
      <path
        d="M 46 152 C 48 142 58 138 94 138 C 130 138 140 142 142 152 Z"
        fill="url(#right-wrist-shadow)"
      />

      {/* Natural Palm Creases (Mirrored Life, Head, Heart lines) */}
      <g stroke="#E59866" strokeWidth="1" strokeLinecap="round" opacity="0.55" fill="none">
        {/* Heart line */}
        <path d="M 137 92 C 120 96 94 92 72 84" />
        {/* Head line */}
        <path d="M 132 106 C 112 106 88 100 68 92" />
        {/* Life line curving around thenar eminence */}
        <path d="M 67 91 C 66 102 74 124 96 138" />
        {/* Subtle thenar crease */}
        <path d="M 58 108 C 52 116 50 128 54 136" opacity="0.4" />
      </g>

      {/* Knuckle arches below fingers */}
      <g stroke="#E59866" strokeWidth="1" opacity="0.45" fill="none">
        <path d="M 69 69 Q 75 71 81 69" />
        <path d="M 92 65 Q 98.5 67 105 65" />
        <path d="M 115 68 Q 121 70 127 68" />
        <path d="M 136 76 Q 141.5 78 147 76" />
      </g>

      {/* ─────────────────── FINGERS ─────────────────── */}

      {/* 1. Right Thumb (#0284C7 / #38BDF8) */}
      <g
        className={`transition-all duration-200 cursor-pointer ${
          thumb.isActive ? 'scale-105 origin-bottom-right' : ''
        }`}
        style={{
          filter: thumb.isActive
            ? `drop-shadow(0 0 10px #38BDF8) drop-shadow(0 0 3px #FFFFFF)`
            : 'none',
        }}
      >
        <path
          d="M 62 106 C 52 96 38 86 25 84 C 17 82 13 88 17 96 C 25 108 38 120 50 130 Z"
          fill={thumb.isActive ? '#0284C7' : '#F0B27A'}
          fillOpacity={thumb.isActive ? 0.95 : 0.45}
          stroke={thumb.isActive ? '#FFFFFF' : '#E59866'}
          strokeWidth={thumb.isActive ? 1.5 : 1.2}
          strokeLinejoin="round"
        />
        <ellipse
          cx="24"
          cy="89"
          rx="5"
          ry="6"
          transform="rotate(-35 24 89)"
          fill={thumb.isActive ? '#FFFFFF' : '#FDEBD0'}
          fillOpacity={thumb.isActive ? 0.9 : 0.95}
          stroke="#E59866"
          strokeWidth="0.6"
        />
        <line
          x1="40"
          y1="96"
          x2="33"
          y2="108"
          stroke={thumb.isActive ? '#FFFFFF' : '#E59866'}
          strokeWidth="1"
          opacity={thumb.isActive ? 0.7 : 0.55}
        />
      </g>

      {/* 2. Right Index (Amber/Yellow: #F59E0B) */}
      <g
        className={`transition-all duration-200 cursor-pointer ${
          index.isActive ? 'scale-105 origin-bottom' : ''
        }`}
        style={{
          filter: index.isActive
            ? `drop-shadow(0 0 10px ${index.color}) drop-shadow(0 0 3px #FFFFFF)`
            : 'none',
        }}
      >
        <path
          d="M 69 68 L 69 26 Q 69 14 75.5 14 Q 82 14 82 26 L 82 68 Z"
          fill={index.isActive ? index.color : '#F0B27A'}
          fillOpacity={index.isActive ? 0.95 : 0.4}
          stroke={index.isActive ? '#FFFFFF' : '#E59866'}
          strokeWidth={index.isActive ? 1.5 : 1.2}
          strokeLinejoin="round"
        />
        <path
          d="M 71.5 24 Q 71.5 16 75.5 16 Q 79.5 16 79.5 24 Q 75.5 25 71.5 24 Z"
          fill={index.isActive ? '#FFFFFF' : '#FDEBD0'}
          fillOpacity={index.isActive ? 0.9 : 0.95}
          stroke="#E59866"
          strokeWidth="0.6"
        />
        <line x1="70.5" y1="38" x2="80.5" y2="38" stroke={index.isActive ? '#FFFFFF' : '#E59866'} strokeWidth="1" opacity={index.isActive ? 0.7 : 0.55} />
        <line x1="70" y1="54" x2="81" y2="54" stroke={index.isActive ? '#FFFFFF' : '#E59866'} strokeWidth="1" opacity={index.isActive ? 0.7 : 0.55} />
      </g>

      {/* 3. Right Middle (Red: #EF4444) */}
      <g
        className={`transition-all duration-200 cursor-pointer ${
          middle.isActive ? 'scale-105 origin-bottom' : ''
        }`}
        style={{
          filter: middle.isActive
            ? `drop-shadow(0 0 10px ${middle.color}) drop-shadow(0 0 3px #FFFFFF)`
            : 'none',
        }}
      >
        <path
          d="M 91 64 L 91 16 Q 91 4 98.5 4 Q 106 4 106 16 L 106 64 Z"
          fill={middle.isActive ? middle.color : '#F0B27A'}
          fillOpacity={middle.isActive ? 0.95 : 0.4}
          stroke={middle.isActive ? '#FFFFFF' : '#E59866'}
          strokeWidth={middle.isActive ? 1.5 : 1.2}
          strokeLinejoin="round"
        />
        <path
          d="M 93.5 15 Q 93.5 6 98.5 6 Q 103.5 6 103.5 15 Q 98.5 16 93.5 15 Z"
          fill={middle.isActive ? '#FFFFFF' : '#FDEBD0'}
          fillOpacity={middle.isActive ? 0.9 : 0.95}
          stroke="#E59866"
          strokeWidth="0.6"
        />
        <line x1="92.5" y1="30" x2="104.5" y2="30" stroke={middle.isActive ? '#FFFFFF' : '#E59866'} strokeWidth="1" opacity={middle.isActive ? 0.7 : 0.55} />
        <line x1="92" y1="48" x2="105" y2="48" stroke={middle.isActive ? '#FFFFFF' : '#E59866'} strokeWidth="1" opacity={middle.isActive ? 0.7 : 0.55} />
      </g>

      {/* 4. Right Ring (Pink: #EC4899) */}
      <g
        className={`transition-all duration-200 cursor-pointer ${
          ring.isActive ? 'scale-105 origin-bottom' : ''
        }`}
        style={{
          filter: ring.isActive
            ? `drop-shadow(0 0 10px ${ring.color}) drop-shadow(0 0 3px #FFFFFF)`
            : 'none',
        }}
      >
        <path
          d="M 114 67 L 114 24 Q 114 12 121 12 Q 128 12 128 24 L 128 67 Z"
          fill={ring.isActive ? ring.color : '#F0B27A'}
          fillOpacity={ring.isActive ? 0.95 : 0.4}
          stroke={ring.isActive ? '#FFFFFF' : '#E59866'}
          strokeWidth={ring.isActive ? 1.5 : 1.2}
          strokeLinejoin="round"
        />
        <path
          d="M 116.5 22 Q 116.5 14 121 14 Q 125.5 14 125.5 22 Q 121 23 116.5 22 Z"
          fill={ring.isActive ? '#FFFFFF' : '#FDEBD0'}
          fillOpacity={ring.isActive ? 0.9 : 0.95}
          stroke="#E59866"
          strokeWidth="0.6"
        />
        <line x1="115.5" y1="36" x2="126.5" y2="36" stroke={ring.isActive ? '#FFFFFF' : '#E59866'} strokeWidth="1" opacity={ring.isActive ? 0.7 : 0.55} />
        <line x1="115" y1="52" x2="127" y2="52" stroke={ring.isActive ? '#FFFFFF' : '#E59866'} strokeWidth="1" opacity={ring.isActive ? 0.7 : 0.55} />
      </g>

      {/* 5. Right Pinky (Slate: #64748B) */}
      <g
        className={`transition-all duration-200 cursor-pointer ${
          pinky.isActive ? 'scale-105 origin-bottom' : ''
        }`}
        style={{
          filter: pinky.isActive
            ? `drop-shadow(0 0 10px ${pinky.color}) drop-shadow(0 0 3px #FFFFFF)`
            : 'none',
        }}
      >
        <path
          d="M 135 75 L 135 42 Q 135 30 141.5 30 Q 148 30 148 42 L 148 75 Z"
          fill={pinky.isActive ? pinky.color : '#F0B27A'}
          fillOpacity={pinky.isActive ? 0.95 : 0.4}
          stroke={pinky.isActive ? '#FFFFFF' : '#E59866'}
          strokeWidth={pinky.isActive ? 1.5 : 1.2}
          strokeLinejoin="round"
        />
        <path
          d="M 137.5 38 Q 137.5 32 141.5 32 Q 145.5 32 145.5 38 Q 141.5 39 137.5 38 Z"
          fill={pinky.isActive ? '#FFFFFF' : '#FDEBD0'}
          fillOpacity={pinky.isActive ? 0.9 : 0.95}
          stroke="#E59866"
          strokeWidth="0.6"
        />
        <line x1="136.5" y1="48" x2="146.5" y2="48" stroke={pinky.isActive ? '#FFFFFF' : '#E59866'} strokeWidth="1" opacity={pinky.isActive ? 0.7 : 0.55} />
        <line x1="136" y1="62" x2="147" y2="62" stroke={pinky.isActive ? '#FFFFFF' : '#E59866'} strokeWidth="1" opacity={pinky.isActive ? 0.7 : 0.55} />
      </g>
    </svg>
  );
};
