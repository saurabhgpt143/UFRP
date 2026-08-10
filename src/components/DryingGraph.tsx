import React, { useState } from 'react';
import { Flame, Clock, Activity, ChevronDown, ChevronUp } from 'lucide-react';

interface DryingGraphProps {
  curingProgress: number; // 0 to 100
  dryingTempC: number;
  peakExothermTempC: number;
  isHeating: boolean;
}

export const DryingGraph: React.FC<DryingGraphProps> = ({
  curingProgress,
  dryingTempC,
  peakExothermTempC,
  isHeating,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  // Generate points for SVG temperature curve
  // Curve starts at ambient (25C), rises to peak exotherm at ~60% progress, then levels off to dryingTempC
  const width = 320;
  const height = 90;

  const points: { x: number; y: number }[] = [];
  for (let p = 0; p <= 100; p += 5) {
    const x = (p / 100) * width;
    let temp = 25;
    if (p < 60) {
      // Exothermic rise
      const t = p / 60;
      temp = 25 + (peakExothermTempC - 25) * Math.sin((t * Math.PI) / 2);
    } else {
      // Cooling down to oven temp
      const t = (p - 60) / 40;
      temp = peakExothermTempC - (peakExothermTempC - dryingTempC) * t;
    }

    // Map temp (20C to 110C) to Y coords (height to 0)
    const y = height - ((temp - 20) / (110 - 20)) * height;
    points.push({ x, y });
  }

  const pathD = points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '');

  // Current progress indicator point
  const currentX = (curingProgress / 100) * width;
  let currentTemp = 25;
  if (curingProgress < 60) {
    const t = curingProgress / 60;
    currentTemp = 25 + (peakExothermTempC - 25) * Math.sin((t * Math.PI) / 2);
  } else {
    const t = (curingProgress - 60) / 40;
    currentTemp = peakExothermTempC - (peakExothermTempC - dryingTempC) * t;
  }
  const currentY = height - ((currentTemp - 20) / (110 - 20)) * height;

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="absolute bottom-16 right-2 sm:right-4 z-10 bg-slate-950/90 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 shadow-xl font-sans text-white text-xs flex items-center gap-2"
      >
        <Flame className={`w-3.5 h-3.5 ${isHeating ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
        <span className="font-mono text-[11px] font-bold text-amber-400">{Math.round(currentTemp)}°C</span>
        <span className="text-[10px] text-slate-400">({Math.round(curingProgress)}% Cured)</span>
        <ChevronUp className="w-3.5 h-3.5 text-slate-400 ml-1" />
      </button>
    );
  }

  return (
    <div className="absolute bottom-16 right-2 sm:right-4 left-2 sm:left-auto z-10 w-auto sm:w-80 max-w-full bg-slate-950/90 backdrop-blur-md p-3 sm:p-3.5 rounded-2xl border border-slate-800 shadow-2xl font-sans text-white">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 mb-2">
        <div className="flex items-center gap-2">
          <Flame className={`w-4 h-4 ${isHeating ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
          <h3 className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Exotherm Polymerization
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-amber-400 font-bold">
            {Math.round(currentTemp)} °C
          </span>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title="Minimize Graph"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Temperature Graph */}
      <div className="relative w-full h-[80px] sm:h-[90px] bg-slate-900/80 rounded-xl overflow-hidden p-1 border border-slate-800">
        <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${width} ${height}`}>
          {/* Gradient Area Fill */}
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          <path d={`${pathD} L ${width} ${height} L 0 ${height} Z`} fill="url(#tempGradient)" />
          <path d={pathD} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />

          {/* Current Progress Dot */}
          <circle cx={currentX} cy={currentY} r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" />
          <line x1={currentX} y1={0} x2={currentX} y2={height} stroke="#38bdf8" strokeDasharray="3,3" strokeWidth="1" />
        </svg>
      </div>

      <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span className="flex items-center gap-1">
          <Activity className="w-3 h-3 text-emerald-400" /> Curing: {Math.round(curingProgress)}%
        </span>
        <span className="text-slate-500">Peak: {peakExothermTempC}°C</span>
      </div>
    </div>
  );
};
