import React from 'react';
import {
  Grid,
  Scroll,
  Pipette,
  Layers,
  Thermometer,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Settings2,
  Clock,
  Zap,
  Flame,
  AlertTriangle
} from 'lucide-react';
import { FRPConfig, StepNumber, WorkflowStep } from '../types';
import { STEP_ALTERNATIVE_OPTIONS } from '../data/processOptions';
import { SUB_STEPS_DATA } from '../data/subSteps';

interface StepWorkflowProps {
  currentStep: StepNumber;
  activeSubStep?: number;
  onSelectStep: (step: StepNumber) => void;
  onSelectSubStep?: (subStep: number) => void;
  curingProgress: number;
  config?: FRPConfig;
  onOpenTimingModal?: () => void;
}

export const stepsData: (WorkflowStep & {
  stepDuration: string;
  cumulativeTime: string;
  isPreGel: boolean;
  timingTag: string;
})[] = [
  {
    id: 1,
    title: 'Table & Modular Setup',
    subtitle: '900 x 1200 x 1800mm Modular Bed',
    description: 'Select target sheet length & width. System automatically aligns 900x1200x1800mm manufacturing table units, with a matching table arranged aside for die preparation and tooling staging.',
    iconName: 'Grid',
    stepDuration: '3.0 – 5.0 min',
    cumulativeTime: 'Offline Prep',
    isPreGel: true,
    timingTag: 'Pre-Catalyst',
  },
  {
    id: 2,
    title: 'Mylar Release Film',
    subtitle: 'Width & Film Thickness',
    description: 'Select BOPET Mylar film specifications matching sheet dimensions. Following table setup, only bottom Mylar paper is unrolled onto the table.',
    iconName: 'Scroll',
    stepDuration: '3.0 – 3.5 min',
    cumulativeTime: 'Offline Prep',
    isPreGel: true,
    timingTag: 'Pre-Catalyst',
  },
  {
    id: 3,
    title: 'Resin & FiberMat Layup',
    subtitle: 'Base Resin, FiberMat & Top 50% Resin',
    description: 'Subsequent to bottom Mylar application, prepare initial 50% resin mixture, incorporate FiberMat over the mixture, and subsequently apply the remaining 50% resin mixture over the fiberglass in a separate step.',
    iconName: 'Pipette',
    stepDuration: '5.5 – 7.0 min',
    cumulativeTime: 'T = 0:00 → 9:00',
    isPreGel: true,
    timingTag: 'Pre-Gel Wet-Out',
  },
  {
    id: 4,
    title: 'Top Mylar & Upper Die Shaping',
    subtitle: 'Sheet Transfer, Upper Die & Compression',
    description: 'Unroll upper Mylar film over resin. Transfer the prepared FRP plain sheet assembly to the lower die on the side table, lower the upper die for profile shaping, and apply compression load.',
    iconName: 'Layers',
    stepDuration: '5.5 – 6.5 min',
    cumulativeTime: 'T = 9:00 → 15:30 (CUTOFF)',
    isPreGel: true,
    timingTag: 'Pre-Gel Clamping',
  },
  {
    id: 5,
    title: 'Drying & Curing Table',
    subtitle: 'Thermal Control & Exotherm Reaction',
    description: 'Transfer sheet assembly to drying table zone. Monitor temperature curve, resin gelation, and curing progress.',
    iconName: 'Thermometer',
    stepDuration: '25 – 45 min',
    cumulativeTime: 'T = 22:00 → 65:00',
    isPreGel: false,
    timingTag: 'Thermal Curing',
  },
  {
    id: 6,
    title: 'Demolding, Trimming & 3D Render',
    subtitle: 'Demolding, Margin Trimming & Final 3D Product Rendering',
    description: 'Subsequent to drying, remove weights, lift off upper die, remove top Mylar, elevate FRP sheet, detach lower Mylar substrate, trim margins for a smooth finish, and inspect the final 3D product rendering.',
    iconName: 'CheckCircle2',
    stepDuration: '6.0 – 10 min',
    cumulativeTime: 'Post-Cure (T > 65m)',
    isPreGel: false,
    timingTag: 'Finished Product',
  },
];

export const StepWorkflow: React.FC<StepWorkflowProps> = ({
  currentStep,
  activeSubStep = 3,
  onSelectStep,
  onSelectSubStep,
  curingProgress,
  config,
  onOpenTimingModal,
}) => {
  return (
    <div className="w-full bg-slate-900 border-r border-slate-800 p-4 flex flex-col gap-3 h-full overflow-y-auto font-sans">
      <div className="flex flex-col gap-2 pb-2 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
            Production Timeline
          </h2>
          <span className="text-[11px] font-mono text-blue-400 font-semibold bg-blue-500/10 px-2 py-0.5 rounded">
            Step {currentStep} of 6
          </span>
        </div>

        {/* Quick Timing & Pre-Gel Schedule Button */}
        {onOpenTimingModal && (
          <button
            type="button"
            onClick={onOpenTimingModal}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all text-xs font-mono font-semibold group shadow-sm"
            title="Open Complete Process Timing & Gel Window Schedule"
          >
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400 group-hover:animate-spin-slow" />
              <span>⏱️ Gel Timing Schedule</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-200">
              t_gel: ~20m
            </span>
          </button>
        )}

        {/* Streamlined Step Dropdown Selector Interface */}
        <div className="relative w-full">
          <label htmlFor="step-dropdown-select" className="sr-only">Select Manufacturing Step</label>
          <select
            id="step-dropdown-select"
            value={currentStep}
            onChange={(e) => onSelectStep(Number(e.target.value) as StepNumber)}
            className="w-full bg-slate-950 border border-blue-500/40 text-blue-200 text-xs font-bold font-mono rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-inner appearance-none pr-8"
          >
            {stepsData.map((s) => (
              <option key={s.id} value={s.id} className="bg-slate-900 text-white font-sans text-xs">
                Step {s.id}: {s.title} ({s.stepDuration})
              </option>
            ))}
          </select>
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-blue-400 text-xs">
            ▼
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        {stepsData.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          // Get active process option
          const fieldKey = `step${step.id}Method` as keyof FRPConfig;
          const selectedMethodId = config ? (config[fieldKey] as string) : undefined;
          const stepOptions = STEP_ALTERNATIVE_OPTIONS[step.id as StepNumber] || [];
          const activeOpt = stepOptions.find((o) => o.id === selectedMethodId) || stepOptions[0];

          return (
            <div
              key={step.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectStep(step.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectStep(step.id);
                }
              }}
              className={`w-full text-left p-3 rounded-xl border transition-all duration-200 flex items-start gap-3 relative group cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-blue-900/40 to-slate-800/80 border-blue-500/60 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/40'
                  : isCompleted
                  ? 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  : 'bg-slate-950/30 border-slate-800/50 text-slate-500 hover:border-slate-800'
              }`}
            >
              {/* Step indicator circle */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold font-mono transition-colors ${
                  isActive
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                    : isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isCompleted ? '✓' : step.id}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h3
                    className={`text-xs font-bold truncate ${
                      isActive ? 'text-white' : isCompleted ? 'text-slate-200' : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </h3>
                  {isActive && <ChevronRight className="w-4 h-4 text-blue-400 shrink-0" />}
                </div>

                <p className="text-[11px] font-medium text-slate-400 truncate mt-0.5">
                  {step.subtitle}
                </p>

                {/* Timing & Duration Badge */}
                <div className="mt-1.5 flex items-center flex-wrap gap-1">
                  <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border truncate flex items-center gap-1 ${
                    step.isPreGel && step.id >= 3
                      ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                      : step.id === 5
                      ? 'bg-red-950/80 text-red-300 border-red-500/40'
                      : 'bg-slate-900 text-slate-300 border-slate-800'
                  }`}>
                    <Clock className="w-2.5 h-2.5" />
                    <span>{step.stepDuration}</span>
                    <span className="text-slate-400">|</span>
                    <span>{step.cumulativeTime}</span>
                  </span>

                  {/* Active Method Badge */}
                  {activeOpt && (
                    <span
                      className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border truncate ${
                        activeOpt.typeBadge === 'Standard Default'
                          ? 'bg-blue-950/80 text-blue-300 border-blue-500/30'
                          : 'bg-purple-950/80 text-purple-300 border-purple-500/30'
                      }`}
                    >
                      {activeOpt.shortLabel}
                    </span>
                  )}
                </div>

                {/* Sequential Sub-steps breakdown for active step */}
                {isActive && SUB_STEPS_DATA[step.id as StepNumber] && (
                  <div className="mt-2.5 pt-2 border-t border-blue-500/20 flex flex-col gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-bold text-blue-400 uppercase tracking-wider">
                        Sequential Sub-steps
                      </span>
                      {onOpenTimingModal && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenTimingModal();
                          }}
                          className="text-[9px] font-mono text-amber-400 hover:underline flex items-center gap-0.5"
                        >
                          <Clock className="w-2.5 h-2.5" />
                          <span>Timing Details</span>
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {SUB_STEPS_DATA[step.id as StepNumber].map((sub) => {
                        const isSubSel = sub.subStepId === activeSubStep;
                        return (
                          <button
                            key={sub.subStepId}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (onSelectSubStep) onSelectSubStep(sub.subStepId);
                            }}
                            className={`flex-1 py-1 text-[10px] font-mono font-bold rounded transition-all text-center flex flex-col items-center justify-center leading-tight ${
                              isSubSel
                                ? 'bg-blue-500 text-white shadow-sm ring-1 ring-blue-300'
                                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
                            }`}
                            title={`${sub.title} (${sub.durationMin}) - ${sub.description}`}
                          >
                            <span>{step.id}.{sub.subStepId}</span>
                            <span className="text-[8px] font-normal opacity-80">{sub.durationMin.split(' ')[0]}m</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Active progress bar if step 5 drying */}
                {step.id === 5 && currentStep === 5 && (
                  <div className="mt-2 w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-300"
                      style={{ width: `${curingProgress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Navigation Controls */}
      <div className="mt-auto pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
        <button
          disabled={currentStep === 1}
          onClick={() => onSelectStep((currentStep - 1) as StepNumber)}
          className="flex-1 px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-center"
        >
          Previous
        </button>
        <button
          disabled={currentStep === 6}
          onClick={() => onSelectStep((currentStep + 1) as StepNumber)}
          className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-1 shadow-md shadow-blue-600/20"
        >
          Next Step <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export const MobileStepBar: React.FC<StepWorkflowProps> = ({
  currentStep,
  activeSubStep = 3,
  onSelectStep,
  onSelectSubStep,
  onOpenTimingModal,
}) => {
  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 px-3 py-2 flex flex-col gap-1.5 shrink-0 z-10 font-sans lg:hidden">
      <div className="flex items-center justify-between gap-2">
        {/* Streamlined Step Dropdown Selector */}
        <div className="relative flex-1 min-w-0">
          <label htmlFor="mobile-step-dropdown" className="sr-only">Select Step</label>
          <select
            id="mobile-step-dropdown"
            value={currentStep}
            onChange={(e) => onSelectStep(Number(e.target.value) as StepNumber)}
            className="w-full bg-slate-950 border border-blue-500/40 text-blue-200 text-xs font-bold font-mono rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer appearance-none pr-6 truncate"
          >
            {stepsData.map((s) => (
              <option key={s.id} value={s.id} className="bg-slate-900 text-white font-sans text-xs">
                Step {s.id}: {s.title} ({s.stepDuration})
              </option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-blue-400 text-[10px]">
            ▼
          </div>
        </div>

        {/* Gel Timing Modal Trigger */}
        {onOpenTimingModal && (
          <button
            onClick={onOpenTimingModal}
            className="px-2 py-1 text-[10px] font-mono font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0 flex items-center gap-1"
            title="Open Gel Timing Schedule"
          >
            <Clock className="w-3 h-3 text-amber-400" />
            <span>⏱️ Timing</span>
          </button>
        )}

        {/* Prev / Next Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            disabled={currentStep === 1}
            onClick={() => onSelectStep((currentStep - 1) as StepNumber)}
            className="px-2.5 py-1 text-[11px] font-semibold rounded bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed border border-slate-700 transition-colors"
          >
            Prev
          </button>
          <button
            disabled={currentStep === 6}
            onClick={() => onSelectStep((currentStep + 1) as StepNumber)}
            className="px-2.5 py-1 text-[11px] font-semibold rounded bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed border border-blue-500 transition-colors flex items-center gap-1 shadow-sm"
          >
            Next <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Sub-step selector pills for Mobile */}
      {SUB_STEPS_DATA[currentStep] && (
        <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-slate-800">
          <span className="text-[10px] font-mono text-slate-400 shrink-0">Sub-steps:</span>
          <div className="flex items-center gap-1 flex-1 justify-end">
            {SUB_STEPS_DATA[currentStep].map((sub) => {
              const isSubSel = sub.subStepId === activeSubStep;
              return (
                <button
                  key={sub.subStepId}
                  type="button"
                  onClick={() => onSelectSubStep && onSelectSubStep(sub.subStepId)}
                  className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded transition-all flex items-center gap-1 ${
                    isSubSel
                      ? 'bg-blue-500 text-white ring-1 ring-blue-300'
                      : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                  title={`${sub.title} (${sub.durationMin})`}
                >
                  <span>{currentStep}.{sub.subStepId}</span>
                  <span className="text-[8px] opacity-75">({sub.durationMin.split(' ')[0]}m)</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
