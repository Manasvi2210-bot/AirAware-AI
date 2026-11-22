import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'none' | 'cyan' | 'emerald' | 'rose' | 'amber';
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  glow = 'none',
  interactive = false,
  padding = 'md',
  onClick,
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  }[padding];

  const glowClasses = {
    none: '',
    cyan: 'shadow-[0_0_25px_-5px_rgba(6,182,212,0.18)] border-cyan-500/30',
    emerald: 'shadow-[0_0_25px_-5px_rgba(16,185,129,0.18)] border-emerald-500/30',
    rose: 'shadow-[0_0_25px_-5px_rgba(244,63,94,0.18)] border-rose-500/30',
    amber: 'shadow-[0_0_25px_-5px_rgba(245,158,11,0.18)] border-amber-500/30',
  }[glow];

  const baseStyle = interactive
    ? 'glass-card-interactive cursor-pointer'
    : 'glass-panel';

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl relative overflow-hidden ${baseStyle} ${glowClasses} ${paddingClasses} ${className}`}
    >
      {/* Subtle top edge glossy line reflection */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
      {children}
    </div>
  );
};
