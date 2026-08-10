import React from 'react';
import {
  Flame,
  Thermometer,
  Activity,
  Pause,
  Play,
  FastForward,
  Sparkles
} from 'lucide-react';
import { FRPConfig, MaterialCalculations } from '../types';

interface RealtimeDryingBarProps {
  config: FRPConfig;
  materials: MaterialCalculations;
  curingProgress: number;
  isHeating: boolean;
  onToggleHeating: () => void;
  onFastForward: () => void;
  speedMultiplier: number;
  onChangeSpeed: (speed: number) => void;
}

export const RealtimeDryingBar: React.FC<RealtimeDryingBarProps> = ({
  config,
  materials,
  curingProgress,
  isHeating,
  onToggleHeating,
  onFastForward,
  speedMultiplier,
  onChangeSpeed,
}) => {
  // Calculate dynamic temperature during exotherm curve
  const ambientTemp = 25;
  const setTemp = config.dryingTempC;
  const peakTemp = materials.peakExothermTempC || setTemp + 20;

  let currentTemp = ambientTemp;
  if (curingProgress <= 25) {
    currentTemp = ambientTemp + (curingProgress / 25) * (setTemp - ambientTemp);
  } else if (curingProgress <= 65) {
    const peakFactor = Math.sin(((curingProgress - 25) / 40) * Math.PI);
    currentTemp = setTemp + peakFactor * (peakTemp - setTemp);
  } else {
    const coolFactor = (100 - curingProgress) / 35;
    currentTemp = setTemp + (peakTemp - setTemp) * Math.max(0, coolFactor);
  }

  // Phase title
  let phaseText = 'Initial Heat Application';
  if (curingProgress > 10 && curingProgress <= 35) phaseText = 'Resin Gelation & Viscosity Reduction';
  else if (curingProgress > 35 && curingProgress <= 70) phaseText = 'Exothermic Cross-Linking Reaction';
  else if (curingProgress > 70 && curingProgress < 100) phaseText = 'Polymer Vitrification & Hardening';
  else if (curingProgress >= 100) phaseText = 'Drying Complete & Fully Cured';

  const barcolHardness = Math.min(45, Math.round((curingProgress / 100) * 45));

  return (
    <div className="w-full bg-gradient-to-r from-amber-950/90 via-slate-900 to-blue-950/90 border-b border-amber-500/30 px-3 sm:px-6 py-2.5 flex flex-col md:flex-row items-center justify-between gap-3 text-white z-20 shrink-0 font-sans shadow-lg shadow-amber-950/30">
      {/* Left: Flame Icon & Phase Info */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl border shrink-0 ${
            isHeating
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-amber-400 flex items-center gap-1">
                <Activity className="w-3 h-3" /> Real-Time Drying Status
              </span>
              <span className={`px-1.5 py-0.5 text-[9px] font-mono font-semibold rounded uppercase border ${
                curingProgress >= 100
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : isHeating
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {curingProgress >= 100 ? 'Fully Cured' : isHeating ? 'Heating Active' : 'Standby'}
              </span>
            </div>
            <div className="text-xs font-bold text-white mt-0.5 truncate max-w-[220px] sm:max-w-[320px]">
              {phaseText}
            </div>
          </div>
        </div>

        {/* Live Temperature Badge */}
        <div className="flex items-center gap-2 bg-slate-950/80 px-2.5 py-1.5 rounded-lg border border-slate-800 shrink-0 font-mono">
          <Thermometer className="w-4 h-4 text-amber-400" />
          <div>
            <div className="text-[9px] text-slate-400 font-sans">Mat Temp</div>
            <div className="text-xs font-bold text-amber-300">{currentTemp.toFixed(1)} °C</div>
          </div>
        </div>
      </div>

      {/* Center: Live Curing Progress Bar & Hardness */}
      <div className="flex-1 max-w-md w-full flex flex-col gap-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 text-[11px] font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" /> Curing Progress:
          </span>
          <div className="flex items-center gap-3 font-mono">
            <span className="text-slate-400 text-[11px]">Hardness: <strong className="text-cyan-300">{barcolHardness} Barcol</strong></span>
            <span className="font-bold text-emerald-400 text-xs">{curingProgress.toFixed(1)}%</span>
          </div>
        </div>
        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <div
            className="bg-gradient-to-r from-amber-500 via-blue-500 to-emerald-400 h-full rounded-full transition-all duration-300 shadow-sm shadow-emerald-500/50"
            style={{ width: `${Math.min(100, curingProgress)}%` }}
          />
        </div>
      </div>

      {/* Right: Heating Controls */}
      <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0">
        <div className="hidden sm:flex items-center bg-slate-950/80 p-1 rounded-lg border border-slate-800 text-xs">
          <span className="text-[10px] text-slate-400 font-mono font-medium px-1.5">Speed:</span>
          {[1, 5, 10, 60].map((s) => (
            <button
              key={s}
              onClick={() => onChangeSpeed(s)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                speedMultiplier === s
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        <button
          onClick={onToggleHeating}
          className={`px-3 py-1.5 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md ${
            isHeating
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 hover:bg-amber-500/30'
              : 'bg-blue-600 text-white hover:bg-blue-500'
          }`}
        >
          {isHeating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {isHeating ? 'Pause' : 'Start Heating'}
        </button>

        <button
          onClick={onFastForward}
          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
          title="Instant Complete Curing"
        >
          <FastForward className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Complete</span>
        </button>
      </div>
    </div>
  );
};
