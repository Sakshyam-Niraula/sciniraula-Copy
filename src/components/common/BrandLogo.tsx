import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
}) => {
  const iconSize = size === 'sm' ? 26 : size === 'lg' ? 44 : 34;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* SciNiraula Vector Emblem */}
      <div className="relative flex items-center justify-center">
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 hover:rotate-45"
        >
          <defs>
            <linearGradient id="orbitGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="orbitGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
              <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Outer hexagonal lab lattice */}
          <polygon
            points="50,6 88,28 88,72 50,94 12,72 12,28"
            stroke="rgba(56, 189, 248, 0.25)"
            strokeWidth="2"
            fill="rgba(14, 165, 233, 0.05)"
          />

          {/* Quantum electron orbital 1 */}
          <ellipse
            cx="50"
            cy="50"
            rx="36"
            ry="14"
            transform="rotate(-30 50 50)"
            stroke="url(#orbitGrad1)"
            strokeWidth="2.5"
            strokeDasharray="4 2"
          />

          {/* Quantum electron orbital 2 */}
          <ellipse
            cx="50"
            cy="50"
            rx="36"
            ry="14"
            transform="rotate(45 50 50)"
            stroke="url(#orbitGrad2)"
            strokeWidth="2.5"
          />

          {/* Orbital nodes */}
          <circle cx="78" cy="34" r="3.5" fill="#38bdf8" />
          <circle cx="26" cy="72" r="3" fill="#818cf8" />

          {/* Central energetic quantum nucleus */}
          <circle cx="50" cy="50" r="12" fill="url(#coreGlow)" />
          <circle cx="50" cy="50" r="5" fill="#f8fafc" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-baseline">
          <span className="font-extrabold tracking-tight text-white font-sans text-xl sm:text-2xl">
            Sci<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-blue-500">Niraula</span>
          </span>
          <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-mono tracking-widest font-semibold uppercase rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
            STEM LAB
          </span>
        </div>
        {showTagline && (
          <span className="text-[11px] text-slate-400 font-medium tracking-wide">
            Explore. Experiment. Understand.
          </span>
        )}
      </div>
    </div>
  );
};
