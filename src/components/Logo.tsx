import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  inverted?: boolean;
  variant?: 'light' | 'dark';
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = true,
  inverted = false,
  variant,
}) => {
  const isLight = variant === 'light' || inverted;

  const iconDimensions = {
    sm: 32,
    md: 42,
    lg: 56,
    xl: 72,
  }[size];

  return (
    <div className="flex items-center gap-3">
      {/* Emblem SVG: Open Book + AI Chip + Golden Sparks */}
      <div
        className="relative flex items-center justify-center rounded-xl p-1 shadow-md transition-transform hover:scale-105"
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #0369a1 100%)',
          width: iconDimensions,
          height: iconDimensions,
        }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="46" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
          
          <path
            d="M 50 74 C 42 70 28 69 16 73 L 16 35 C 28 31 42 32 50 36 Z"
            fill="#ffffff"
            opacity="0.95"
          />
          <path
            d="M 50 74 C 58 70 72 69 84 73 L 84 35 C 72 31 58 32 50 36 Z"
            fill="#f8fafc"
            opacity="0.95"
          />
          <path
            d="M 50 36 L 50 74"
            stroke="#1e3a8a"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          <rect
            x="38"
            y="30"
            width="24"
            height="24"
            rx="4"
            fill="#1e3a8a"
            stroke="#fbbf24"
            strokeWidth="2"
          />
          
          <circle cx="50" cy="42" r="4.5" fill="#fbbf24" />
          <line x1="50" y1="30" x2="50" y2="24" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
          <line x1="50" y1="54" x2="50" y2="60" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
          <line x1="38" y1="42" x2="32" y2="42" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
          <line x1="62" y1="42" x2="68" y2="42" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
          
          <circle cx="50" cy="22" r="2.5" fill="#fde047" />
          <circle cx="50" cy="62" r="2.5" fill="#fde047" />
          <circle cx="30" cy="42" r="2.5" fill="#fde047" />
          <circle cx="70" cy="42" r="2.5" fill="#fde047" />
        </svg>

        <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full blur-[1px] animate-pulse" />
      </div>

      <div>
        <div className="flex items-center gap-1.5 leading-tight">
          <span
            className={`font-black tracking-tight font-sans ${
              size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : size === 'xl' ? 'text-3xl' : 'text-xl'
            } ${isLight ? 'text-white' : 'text-blue-900'}`}
          >
            EDU PLAN <span className="text-amber-500">AI</span>
          </span>
        </div>
        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className={`font-bold tracking-wider uppercase text-[10px] px-1.5 py-0.5 rounded ${
                isLight
                  ? 'bg-amber-400 text-blue-950 font-extrabold'
                  : 'bg-blue-900 text-amber-300 font-extrabold'
              }`}
            >
              DEEP LEARNING
            </span>
            <span
              className={`text-[10px] hidden sm:inline ${
                isLight ? 'text-blue-200' : 'text-slate-500'
              }`}
            >
              Guru SD
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
