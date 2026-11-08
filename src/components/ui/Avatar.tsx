import React from 'react';

export const Avatar: React.FC<{
  name?: string;
  url?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({ name = 'User', url, size = 'md' }) => {
  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base font-bold',
    xl: 'w-16 h-16 text-xl font-bold',
  };

  const getInitials = (n: string) => {
    return n
      .split(' ')
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'IT';
  };

  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover border border-slate-200 shadow-xs`}
      />
    );
  }

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
      className={`${sizes[size]} ${color} rounded-full flex items-center justify-center text-white font-semibold shadow-xs select-none`}
    >
      {getInitials(name)}
    </div>
  );
};
