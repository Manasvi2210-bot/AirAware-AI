import React from 'react';
import type { AQICategory } from '../../types/airQuality';
import { getAQIConfig } from '../../utils/aqiUtils';

interface BadgeProps {
  children: React.ReactNode;
  category?: AQICategory;
  variant?: 'aqi' | 'neutral' | 'info' | 'warning' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  category,
  variant,
  size = 'md',
  className = '',
  dot = false,
}) => {
  let colorClasses = 'bg-slate-800/80 text-slate-300 border-slate-700/60';
  let dotColor = '#94a3b8';

  if (category) {
    const config = getAQIConfig(
      category === 'Good' ? 25 :
      category === 'Moderate' ? 75 :
      category === 'Unhealthy for Sensitive Groups' ? 125 :
      category === 'Unhealthy' ? 175 :
      category === 'Very Unhealthy' ? 250 : 350
    );
    colorClasses = `${config.bgColor} ${config.textColor} ${config.borderColor}`;
    dotColor = config.color;
  } else if (variant === 'info') {
    colorClasses = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    dotColor = '#06b6d4';
  } else if (variant === 'warning') {
    colorClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    dotColor = '#f59e0b';
  } else if (variant === 'danger') {
    colorClasses = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    dotColor = '#f43f5e';
  } else if (variant === 'success') {
    colorClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    dotColor = '#10b981';
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2',
    lg: 'text-sm px-3.5 py-1.5 gap-2.5 font-medium',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border backdrop-blur-md font-medium tracking-wide transition-colors ${colorClasses} ${sizeClasses} ${className}`}
    >
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ backgroundColor: dotColor }}
        />
      )}
      {children}
    </span>
  );
};
