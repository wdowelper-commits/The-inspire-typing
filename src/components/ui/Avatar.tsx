import React from 'react';
import {
  Rocket,
  Flame,
  Keyboard as KeyboardIcon,
  Trophy,
  Star,
  Zap,
  Heart,
  Crown,
} from 'lucide-react';

export const PRESET_AVATARS = [
  { id: 'preset:rocket', name: 'Rocket', icon: Rocket, bg: 'bg-gradient-to-tr from-blue-600 to-cyan-500' },
  { id: 'preset:fire', name: 'Fire', icon: Flame, bg: 'bg-gradient-to-tr from-amber-500 to-rose-600' },
  { id: 'preset:keyboard', name: 'Keyboard', icon: KeyboardIcon, bg: 'bg-gradient-to-tr from-violet-600 to-indigo-600' },
  { id: 'preset:trophy', name: 'Trophy', icon: Trophy, bg: 'bg-gradient-to-tr from-yellow-400 to-amber-600' },
  { id: 'preset:star', name: 'Star', icon: Star, bg: 'bg-gradient-to-tr from-amber-400 to-yellow-500' },
  { id: 'preset:zap', name: 'Lightning', icon: Zap, bg: 'bg-gradient-to-tr from-cyan-500 to-blue-600' },
  { id: 'preset:heart', name: 'Heart', icon: Heart, bg: 'bg-gradient-to-tr from-rose-500 to-pink-600' },
  { id: 'preset:crown', name: 'Crown', icon: Crown, bg: 'bg-gradient-to-tr from-purple-600 to-pink-500' },
];

export const Avatar: React.FC<{
  name?: string;
  url?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ name = 'User', url, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base font-bold',
    xl: 'w-16 h-16 text-xl font-bold',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4.5 h-4.5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  // Check if preset icon avatar
  if (url && url.startsWith('preset:')) {
    const preset = PRESET_AVATARS.find((p) => p.id === url) || PRESET_AVATARS[0];
    const IconComp = preset.icon;
    return (
      <div
        className={`${sizes[size]} ${preset.bg} rounded-full flex items-center justify-center text-white shadow-xs select-none shrink-0 ${className}`}
        title={preset.name}
      >
        <IconComp className={iconSizes[size]} />
      </div>
    );
  }

  // Check if custom uploaded image URL
  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover border border-slate-200 shadow-xs shrink-0 ${className}`}
      />
    );
  }

  const getInitials = (n: string) => {
    return (
      n
        .split(' ')
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase() || 'IT'
    );
  };

  // Consistent pleasant background color based on name
  const colors = [
    'bg-blue-600',
    'bg-indigo-600',
    'bg-purple-600',
    'bg-emerald-600',
    'bg-rose-600',
    'bg-amber-600',
  ];
  const charCode = name.charCodeAt(0) || 0;
  const color = colors[charCode % colors.length];

  return (
    <div
      className={`${sizes[size]} ${color} rounded-full flex items-center justify-center text-white font-semibold shadow-xs select-none shrink-0 ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};
