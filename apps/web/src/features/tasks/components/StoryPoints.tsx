import React from 'react';

interface StoryPointsProps {
  points?: number;
  capacity?: number;
  showCapacity?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StoryPoints: React.FC<StoryPointsProps> = ({
  points = 1,
  capacity,
  showCapacity = false,
  size = 'sm'
}) => {
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 font-bold',
    md: 'text-xs px-2 py-1 font-extrabold',
    lg: 'text-sm px-2.5 py-1.5 font-black',
  }[size];

  if (showCapacity && capacity !== undefined) {
    const isOver = points > capacity;
    return (
      <div className="flex items-center gap-1.5">
        <span className={`inline-flex items-center gap-1 rounded-full ${sizeClasses} ${
          isOver ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
        }`}>
          <span className="opacity-70">SP:</span>
          <span>{points} / {capacity}</span>
        </span>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-full bg-slate-100 text-slate-700 border border-slate-200/80 ${sizeClasses}`} title={`${points} Story Points`}>
      <span className="text-slate-600 font-semibold mr-0.5">pts:</span>
      <span>{points}</span>
    </span>
  );
};
