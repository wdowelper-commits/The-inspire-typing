import React from 'react';
import { FingerId, FINGER_CONFIGS } from './Keyboard';

interface LeftHandProps {
  activeFingerId?: FingerId | null;
  className?: string;
}

export const LeftHand: React.FC<LeftHandProps> = ({
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

  const pinky = getFingerState('left-pinky');
  const ring = getFingerState('left-ring');
  const middle = getFingerState('left-middle');
  const index = getFingerState('left-index');
  const thumb = getFingerState('thumbs');

  return (
    <svg
      viewBox="0 0 170 160"
      className={className}
      style={{ overflow: 'visible' }}
      aria-label="Left Hand Finger Guide"
    >
      <defs>
        {/* Soft skin gradient for natural 3D hand depth */}
        <linearGradient id="left-palm-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FADBD8" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#F5CBA7" />
          <stop offset="100%" stopColor="#EDBB99" />
        </linearGradient>

        <linearGradient id="left-wrist-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F5CBA7" stopOpacity="0" />
          <stop offset="100%" stopColor="#DC7633" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {/* Palm & Wrist Area */}
      <path
        d="M 28 152 C 24 130 26 104 36 86 C 39 80 47 80 54 82 C 67 82 82 82 98 83 C 114 84 126 90 134 100 C 146 116 136 136 124 152 Z"
        fill="url(#left-palm-grad)"
        stroke="#E59866"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Wrist shading overlay */}
      <path
        d="M 28 152 C 30 142 40 138 76 138 C 112 138 122 142 124 152 Z"
        fill="url(#left-wrist-shadow)"
      />

      {/* Natural Palm Creases (Life line, Head line, Heart line) */}
      <g stroke="#E59866" strokeWidth="1" strokeLinecap="round" opacity="0.55" fill="none">
        {/* Heart line */}
        <path d="M 33 92 C 50 96 76 92 98 84" />
        {/* Head line */}
        <path d="M 38 106 C 58 106 82 100 102 92" />
        {/* Life line curving around thenar eminence */}
        <path d="M 103 91 C 104 102 96 124 74 138" />
        {/* Subtle thenar crease */}
        <path d="M 112 108 C 118 116 120 128 116 136" opacity="0.4" />
      </g>

      {/* Knuckle arches below fingers */}
      <g stroke="#E59866" strokeWidth="1" opacity="0.45" fill="none">
        <path d="M 23 76 Q 28.5 78 34 76" />
        <path d="M 43 68 Q 49 70 55 68" />
        <path d="M 65 65 Q 71.5 67 78 65" />
        <path d="M 89 69 Q 95 71 101 69" />
      </g>

      {/* ─────────────────── FINGERS ─────────────────── */}

      {/* 1. Left Pinky (Purple: #8B5CF6) */}
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
        {/* Finger Base / Body */}
        <path
          d="M 22 75 L 22 42 Q 22 30 28.5 30 Q 35 30 35 42 L 35 75 Z"
          fill={pinky.isActive ? pinky.color : '#F0B27A'}
          fillOpacity={pinky.isActive ? 0.95 : 0.4}
          stroke={pinky.isActive ? '#FFFFFF' : '#E59866'}
          strokeWidth={pinky.isActive ? 1.5 : 1.2}
          strokeLinejoin="round"
        />
        {/* Fingernail Area */}
        <path
          d="M 24.5 38 Q 24.5 32 28.5 32 Q 32.5 32 32.5 38 Q 28.5 39 24.5 38 Z"
          fill={pinky.isActive ? '#FFFFFF' : '#FDEBD0'}
          fillOpacity={pinky.isActive ? 0.9 : 0.95}
          stroke="#E59866"
          strokeWidth="0.6"
        />
        {/* Knuckle Lines (Distal and Proximal Interphalangeal Joints) */}
        <line x1="23.5" y1="48" x2="33.5" y2="48" stroke={pinky.isActive ? '#FFFFFF' : '#E59866'} strokeWidth="1" opacity={pinky.isActive ? 0.7 : 0.55} />
        <line x1="23" y1="62" x2="34" y2="62" stroke={pinky.isActive ? '#FFFFFF' : '#E59866'} strokeWidth="1" opacity={pinky.isActive ? 0.7 : 0.55} />
      </g>

      {/* 2. Left Ring (Blue: #3B82F6) */}
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
          d="M 42 67 L 42 24 Q 42 12 49 12 Q 56 12 56 24 L 56 67 Z"
          fill={ring.isActive ? ring.color : '#F0B27A'}
          fillOpacity={ring.isActive ? 0.95 : 0.4}
          stroke={ring.isActive ? '#FFFFFF' : '#E59866'}
          strokeWidth={ring.isActive ? 1.5 : 1.2}
          strokeLinejoin="round"
        />
        <path
          d="M 44.5 22 Q 44.5 14 49 14 Q 53.5 14 53.5 22 Q 49 23 44.5 22 Z"
          fill={ring.isActive ? '#FFFFFF' : '#FDEBD0'}
          fillOpacity={ring.isActive ? 0.9 : 0.95}
          stroke="#E59866"
          strokeWidth="0.6"
        />
        <line x1="43.5" y1="36" x2="54.5" y2="36" stroke={ring.isActive ? '#FFFFFF' : '#E59866'} strokeWidth="1" opacity={ring.isActive ? 0.7 : 0.55} />
        <line x1="43" y1="52" x2="55" y2="52" stroke={ring.isActive ? '#FFFFFF' : '#E59866'} strokeWidth="1" opacity={ring.isActive ? 0.7 : 0.55} />
      </g>

      {/* 3. Left Middle (Cyan: #06B6D4) */}
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
          d="M 64 64 L 64 16 Q 64 4 71.5 4 Q 79 4 79 16 L 79 64 Z"
          fill={middle.isActive ? middle.color : '#F0B27A'}
          fillOpacity={middle.isActive ? 0.95 : 0.4}
          stroke={middle.isActive ? '#FFFFFF' : '#E59866'}
          strokeWidth={middle.isActive ? 1.5 : 1.2}
          strokeLinejoin="round"
        />
        <path
          d="M 66.5 15 Q 66.5 6 71.5 6 Q 76.5 6 76.5 15 Q 71.5 16 66.5 15 Z"
          fill={middle.isActive ? '#FFFFFF' : '#FDEBD0'}
          fillOpacity={middle.isActive ? 0.9 : 0.95}
          stroke="#E59866"
          strokeWidth="0.6"
        />
        <line x1="65.5" y1="30" x2="77.5" y2="30" stroke={middle.isActive ? '#FFFFFF' : '#E59866'} strokeWidth="1" opacity={middle.isActive ? 0.7 : 0.55} />
        <line x1="65" y1="48" x2="78" y2="48" stroke={middle.isActive ? '#FFFFFF' : '#E59866'} strokeWidth="1" opacity={middle.isActive ? 0.7 : 0.55} />
      </g>

      {/* 4. Left Index (Green: #10B981) */}
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
          d="M 88 68 L 88 26 Q 88 14 94.5 14 Q 101 14 101 26 L 101 68 Z"
          fill={index.isActive ? index.color : '#F0B27A'}
          fillOpacity={index.isActive ? 0.95 : 0.4}
          stroke={index.isActive ? '#FFFFFF' : '#E59866'}
          strokeWidth={index.isActive ? 1.5 : 1.2}
          strokeLinejoin="round"
        />
        <path
          d="M 90.5 24 Q 90.5 16 94.5 16 Q 98.5 16 98.5 24 Q 94.5 25 90.5 24 Z"
          fill={index.isActive ? '#FFFFFF' : '#FDEBD0'}
          fillOpacity={index.isActive ? 0.9 : 0.95}
          stroke="#E59866"
          strokeWidth="0.6"
        />
        <line x1="89.5" y1="38" x2="99.5" y2="38" stroke={index.isActive ? '#FFFFFF' : '#E59866'} strokeWidth="1" opacity={index.isActive ? 0.7 : 0.55} />
        <line x1="89" y1="54" x2="100" y2="54" stroke={index.isActive ? '#FFFFFF' : '#E59866'} strokeWidth="1" opacity={index.isActive ? 0.7 : 0.55} />
      </g>

      {/* 5. Left Thumb (#0284C7 / #38BDF8) */}
      <g
        className={`transition-all duration-200 cursor-pointer ${
          thumb.isActive ? 'scale-105 origin-bottom-left' : ''
        }`}
        style={{
          filter: thumb.isActive
            ? `drop-shadow(0 0 10px #38BDF8) drop-shadow(0 0 3px #FFFFFF)`
            : 'none',
        }}
      >
        <path
          d="M 108 106 C 118 96 132 86 145 84 C 153 82 157 88 153 96 C 145 108 132 120 120 130 Z"
          fill={thumb.isActive ? '#0284C7' : '#F0B27A'}
          fillOpacity={thumb.isActive ? 0.95 : 0.45}
          stroke={thumb.isActive ? '#FFFFFF' : '#E59866'}
          strokeWidth={thumb.isActive ? 1.5 : 1.2}
          strokeLinejoin="round"
        />
        {/* Thumb Fingernail Area */}
        <ellipse
          cx="146"
          cy="89"
          rx="5"
          ry="6"
          transform="rotate(35 146 89)"
          fill={thumb.isActive ? '#FFFFFF' : '#FDEBD0'}
          fillOpacity={thumb.isActive ? 0.9 : 0.95}
          stroke="#E59866"
          strokeWidth="0.6"
        />
        {/* Thumb Interphalangeal Joint Crease */}
        <line
          x1="130"
          y1="96"
          x2="137"
          y2="108"
          stroke={thumb.isActive ? '#FFFFFF' : '#E59866'}
          strokeWidth="1"
          opacity={thumb.isActive ? 0.7 : 0.55}
        />
      </g>
    </svg>
  );
};
