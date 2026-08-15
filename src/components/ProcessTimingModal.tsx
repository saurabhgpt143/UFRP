import React, { useState, useEffect } from 'react';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  Thermometer,
  Flame,
  Zap,
  Info,
  X,
  Printer,
  ChevronRight,
  ShieldAlert,
  Sliders,
  Layers,
  Sparkles
} from 'lucide-react';
import { FRPConfig, MaterialCalculations, TableSpec } from '../types';
import { PROCESS_TIMING_SCHEDULE } from '../data/subSteps';
import { soundFx } from '../utils/soundEffects';

interface ProcessTimingModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: FRPConfig;
  materials: MaterialCalculations;
  tableSpec?: TableSpec;
}

export const ProcessTimingModal: React.FC<ProcessTimingModalProps> = ({
  isOpen,
  onClose,
  config,
  materials,
}) => {
  // Live Batch Stopwatch for shop floor execution
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'schedule' | 'kinetics' | 'temperature'>('schedule');

  const estimatedGelTimeMin = materials.estimatedGelTimeMin || 20;
  const formingCutoffMin = Math.max(3, Math.round(estimatedGelTimeMin * 0.78)); // 78% of gel time is absolute mechanical cutoff
  const gelTimeSeconds = estimatedGelTimeMin * 60;
  const cutoffSeconds = formingCutoffMin * 60;

  // Stopwatch interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    soundFx.playClick();
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    soundFx.playClick();
    setIsRunning(false);
    setTimerSeconds(0);
  };

  const handlePrintSchedule = () => {
    soundFx.playClick();
    window.print();
  };

  // Gel progress ratio
  const progressPercent = Math.min(100, (timerSeconds / gelTimeSeconds) * 100);
  const isPastCutoff = timerSeconds >= cutoffSeconds;
  const isPastGel = timerSeconds >= gelTimeSeconds;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] font-sans text-white">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950/80 px-4 sm:px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <Clock className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Manufacturing Timing & Pre-Gel Schedule
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Critical Pot-Life
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Resin wet-out, de-airing, Mylar sealing and die clamping must strictly conclude prior to sol-gel transition (<span className="font-mono text-amber-300 font-semibold">t_gel = {estimatedGelTimeMin} min</span>).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintSchedule}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
              title="Print Timing Ticket"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Schedule</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Real-time Dynamic Metric Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 sm:px-6 bg-slate-950/60 border-b border-slate-800 text-xs shrink-0">
          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex flex-col gap-0.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1"><Thermometer className="w-3.5 h-3.5 text-blue-400" /> Ambient Temp:</span>
              <span className="font-mono font-bold text-white text-xs">{config.ambientTempC ?? 25}°C</span>
            </div>
            <span className="text-[10px] text-slate-400">
              {config.ambientTempC && config.ambientTempC < 20
                ? 'Cold shop floor (slower reaction)'
                : config.ambientTempC && config.ambientTempC > 29
                ? 'Hot ambient (accelerated gel risk)'
                : 'Optimal standard ambient'}
            </span>
          </div>

          <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 flex flex-col gap-0.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-amber-400" /> MEKP Catalyst:</span>
              <span className="font-mono font-bold text-amber-300 text-xs">{config.catalystPercent}%</span>
            </div>
            <span className="text-[10px] text-slate-400">Cobalt: {config.cobaltPercent ?? 0.20}% (6% Octoate)</span>
          </div>

          <div className="bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/30 flex flex-col gap-0.5">
            <div className="flex items-center justify-between text-amber-300">
              <span className="flex items-center gap-1 font-semibold"><Clock className="w-3.5 h-3.5 text-amber-400" /> Forming Cutoff:</span>
              <span className="font-mono font-bold text-amber-300 text-xs">T = {formingCutoffMin}:00 min</span>
            </div>
            <span className="text-[10px] text-amber-200/80">Upper die clamp deadline</span>
          </div>

          <div className="bg-blue-950/40 p-2.5 rounded-xl border border-blue-500/30 flex flex-col gap-0.5">
            <div className="flex items-center justify-between text-blue-300">
              <span className="flex items-center gap-1 font-semibold"><Zap className="w-3.5 h-3.5 text-blue-400" /> Gel Point (t_gel):</span>
              <span className="font-mono font-bold text-blue-300 text-xs">{estimatedGelTimeMin}:00 min</span>
            </div>
            <span className="text-[10px] text-blue-200/80">Sol-to-gel network onset</span>
          </div>
        </div>

        {/* Live Shop-Floor Stopwatch Widget */}
        <div className="px-4 sm:px-6 py-3 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Live Batch Timer</span>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl sm:text-3xl font-mono font-black tracking-tight ${
                  isPastGel ? 'text-red-400 animate-pulse' : isPastCutoff ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {formatTime(timerSeconds)}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  / {estimatedGelTimeMin}:00 gel target
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 ml-auto sm:ml-2">
              <button
                onClick={handleStartPause}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all shadow-md ${
                  isRunning
                    ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                    : 'bg-emerald-600 text-white hover:bg-emerald-500'
                }`}
              >
                {isRunning ? <><Pause className="w-3.5 h-3.5" /> Pause</> : <><Play className="w-3.5 h-3.5" /> Start Timer</>}
              </button>
              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Progress Visualizer */}
          <div className="flex-1 w-full max-w-md flex flex-col gap-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="text-emerald-400">T=0 (Pour)</span>
              <span className="text-amber-400 font-bold">Cutoff ({formingCutoffMin}m)</span>
              <span className="text-blue-400 font-bold">Gel Point ({estimatedGelTimeMin}m)</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 border border-slate-800 overflow-hidden relative">
              {/* Cutoff marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-amber-500 z-10"
                style={{ left: `${(formingCutoffMin / estimatedGelTimeMin) * 100}%` }}
                title="Mechanical Forming Cutoff"
              />
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isPastGel
                    ? 'bg-gradient-to-r from-amber-500 to-red-500'
                    : isPastCutoff
                    ? 'bg-gradient-to-r from-emerald-500 to-amber-400'
                    : 'bg-gradient-to-r from-blue-500 to-emerald-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-right font-mono text-slate-400">
              {isPastGel
                ? '⚠️ Gel point reached! Matrix is solidified.'
                : isPastCutoff
                ? '⚠️ Forming cutoff passed! Lock all upper dies immediately.'
                : 'Active workable liquid pot-life window.'}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-4 sm:px-6 pt-3 border-b border-slate-800 bg-slate-950/40 shrink-0">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'schedule'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Step Timing Schedule</span>
          </button>

          <button
            onClick={() => setActiveTab('kinetics')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'kinetics'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Pre-Gel vs Gelation Kinetics</span>
          </button>

          <button
            onClick={() => setActiveTab('temperature')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'temperature'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Temperature & Promoter Guide</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {activeTab === 'schedule' && (
            <div className="space-y-4">
              {/* Critical Alert Banner */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <span>Critical Golden Rule of FRP Sheet Manufacturing:</span>
                  </div>
                  <p className="text-amber-300/90 leading-relaxed">
                    All matrix distribution, fiber impregnation, de-airing rolling, top Mylar sealing, and <strong>upper profile die compression must be 100% completed by T = 15:30 min</strong>. Applying mechanical pressure after polymer chains begin crosslinking (t_gel) causes permanent micro-fractures, delamination, and white hazy stress marks.
                  </p>
                </div>
              </div>

              {/* Master Step-by-Step Timing Schedule Table */}
              <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950/60 shadow-inner">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-800/80 text-slate-300 font-mono text-[11px] uppercase tracking-wider border-b border-slate-700">
                        <th className="py-2.5 px-3 font-semibold">Step / Stage</th>
                        <th className="py-2.5 px-3 font-semibold">Operation</th>
                        <th className="py-2.5 px-3 font-semibold">Step Duration</th>
                        <th className="py-2.5 px-3 font-semibold">Cumulative Time (T)</th>
                        <th className="py-2.5 px-3 font-semibold">Pre-Gel Status</th>
                        <th className="py-2.5 px-3 font-semibold">Critical Process Objective</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 font-sans">
                      {PROCESS_TIMING_SCHEDULE.map((row, idx) => {
                        const isCutoff = row.category === 'forming_cutoff';
                        const isGel = row.category === 'gel_transition';
                        const isPrep = row.category === 'prep';
                        return (
                          <tr
                            key={idx}
                            className={`transition-colors ${
                              isCutoff
                                ? 'bg-amber-950/30 hover:bg-amber-900/30'
                                : isGel
                                ? 'bg-blue-950/30 hover:bg-blue-900/30'
                                : isPrep
                                ? 'bg-slate-900/40 hover:bg-slate-800/40 text-slate-400'
                                : 'hover:bg-slate-800/50'
                            }`}
                          >
                            <td className="py-2.5 px-3 font-mono font-bold text-slate-300">
                              {row.stepCode}
                            </td>
                            <td className="py-2.5 px-3 font-semibold text-white">
                              {row.stepName}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-slate-300">
                              {row.duration}
                            </td>
                            <td className="py-2.5 px-3 font-mono font-bold text-amber-300">
                              {row.cumulativeTime}
                            </td>
                            <td className="py-2.5 px-3">
                              {row.mustCompleteBeforeGel ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                  <CheckCircle2 className="w-3 h-3 text-amber-400" /> Must Finish Pre-Gel
                                </span>
                              ) : isGel ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                                  ⚡ Sol-Gel Point
                                </span>
                              ) : isPrep ? (
                                <span className="text-[10px] font-mono text-slate-400">
                                  Offline Setup
                                </span>
                              ) : (
                                <span className="text-[10px] font-mono text-slate-400">
                                  Post-Gel Solid
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-slate-300 text-[11px] leading-relaxed">
                              {row.criticalObjective}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'kinetics' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                  <h3 className="font-bold text-amber-300 flex items-center gap-2 text-sm">
                    <Flame className="w-4 h-4 text-amber-400" />
                    Phase 1: Active Pot-Life & Wet-Out (T = 0 to 15:30)
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    During this liquid regime, monomeric styrene acts as both solvent and crosslinker. The resin viscosity remains low (<strong>~400–600 cPs</strong>), enabling:
                  </p>
                  <ul className="list-disc list-inside text-slate-400 space-y-1 pl-1">
                    <li>Rapid capillary wicking into dense fiberglass strand bundles (CSM/Woven Roving).</li>
                    <li>Easy evacuation of trapped micro-air bubbles using ribbed consolidation rollers.</li>
                    <li>Effortless hydraulic flow under the upper profile die without shearing nascent polymers.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                  <h3 className="font-bold text-blue-300 flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4 text-blue-400" />
                    Phase 2: Sol-Gel Transition (t_gel = 18:00 to 22:00)
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    As Cobalt Octoate decomposes MEKP into free radicals, styrene-polyester chains bridge rapidly into a three-dimensional infinite network:
                  </p>
                  <ul className="list-disc list-inside text-slate-400 space-y-1 pl-1">
                    <li>Viscosity experiences an exponential surge toward infinity (dμ/dt → ∞).</li>
                    <li>The resin transforms into a rubbery elastic jelly that cannot flow or self-heal.</li>
                    <li>Any movement of the sheet or die at this stage creates irreversible resin crazing.</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-400" />
                  Arrhenius Temperature Sensitivity Kinetics
                </h3>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-blue-300">
                  t_gel(T_ambient) = 22 &times; 2^((25 - T_ambient)/10) &times; (2.0 / Catalyst%)^0.75 &times; (0.20 / Cobalt%)^0.85
                </div>
                <p className="text-slate-400 leading-relaxed">
                  For every <strong>10°C increase</strong> in ambient shop floor temperature, the gelation rate doubles and the available workable pot-life is cut in half.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'temperature' && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-200">
                <div className="font-bold mb-1">Seasonal Ambient Temperature Guide:</div>
                <p className="text-slate-300 leading-relaxed">
                  Always measure shop floor ambient temperature prior to catalyst addition to formulate the exact promoter & catalyst ratio.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Cold Weather */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-blue-500/30 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-300 font-mono">Cold Ambient (&lt; 20°C)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">Winter</span>
                  </div>
                  <div className="text-slate-300 text-[11px] space-y-1">
                    <p><strong>Risk:</strong> Sluggish cure, incomplete wet-out, tacky surface.</p>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[10px] text-blue-300 space-y-0.5">
                      <div>• Cobalt Octoate: 0.30% – 0.35%</div>
                      <div>• MEKP Catalyst: 2.0% – 2.5%</div>
                      <div>• Target Gel Window: 18 – 20 min</div>
                    </div>
                  </div>
                </div>

                {/* Nominal Standard */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-300 font-mono">Nominal (20°C – 28°C)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">Standard</span>
                  </div>
                  <div className="text-slate-300 text-[11px] space-y-1">
                    <p><strong>Optimal:</strong> Balanced pot-life and complete thermal cure.</p>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[10px] text-emerald-300 space-y-0.5">
                      <div>• Cobalt Octoate: 0.20%</div>
                      <div>• MEKP Catalyst: 1.5% – 2.0%</div>
                      <div>• Target Gel Window: 18 – 22 min</div>
                    </div>
                  </div>
                </div>

                {/* Hot Summer */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/30 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300 font-mono">Hot Ambient (&gt; 29°C)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">Summer</span>
                  </div>
                  <div className="text-slate-300 text-[11px] space-y-1">
                    <p><strong>Risk:</strong> Flash gelation, premature skinning, dry fiber spots.</p>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800 font-mono text-[10px] text-amber-300 space-y-0.5">
                      <div>• Cobalt Octoate: 0.08% – 0.12%</div>
                      <div>• MEKP Catalyst: 1.0% – 1.2%</div>
                      <div>• Target Gel Window: 16 – 18 min</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:px-6 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="text-amber-400 font-bold">IS 12866:2020</span>
            <span>|</span>
            <span>Batch Gelation Standard</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20 transition-all"
          >
            Close Schedule
          </button>
        </div>

      </div>
    </div>
  );
};
