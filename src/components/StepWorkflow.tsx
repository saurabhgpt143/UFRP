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
  Settings2
} from 'lucide-react';
import { FRPConfig, StepNumber, WorkflowStep } from '../types';
import { STEP_ALTERNATIVE_OPTIONS } from '../data/processOptions';

interface StepWorkflowProps {
  currentStep: StepNumber;
  onSelectStep: (step: StepNumber) => void;
  curingProgress: number;
  config?: FRPConfig;
}

export const stepsData: WorkflowStep[] = [
  {
    id: 1,
    title: 'Table & Modular Setup',
    subtitle: '900 x 1200 x 1800mm Modular Bed',
    description: 'Select target sheet length & width. System automatically aligns 900x1200x1800mm manufacturing table units, with a matching table arranged aside for die preparation and tooling staging.',
    iconName: 'Grid',
  },
  {
    id: 2,
    title: 'Mylar Release Film',
    subtitle: 'Width & Film Thickness',
    description: 'Select BOPET Mylar film specifications matching sheet dimensions. Following table setup, only bottom Mylar paper is unrolled onto the table.',
    iconName: 'Scroll',
  },
  {
    id: 3,
    title: 'Resin & FiberMat Layup',
    subtitle: 'Base Resin, FiberMat & Top 50% Resin',
    description: 'Subsequent to bottom Mylar application, prepare initial 50% resin mixture, incorporate FiberMat over the mixture, and subsequently apply the remaining 50% resin mixture over the fiberglass in a separate step.',
    iconName: 'Pipette',
  },
  {
    id: 4,
    title: 'Top Mylar & Upper Die Shaping',
    subtitle: 'Sheet Transfer, Upper Die & Compression',
    description: 'Unroll upper Mylar film over resin. Transfer the prepared FRP plain sheet assembly to the lower die on the side table, lower the upper die for profile shaping, and apply compression load.',
    iconName: 'Layers',
  },
  {
    id: 5,
    title: 'Drying & Curing Table',
    subtitle: 'Thermal Control & Exotherm Reaction',
    description: 'Transfer sheet assembly to drying table zone. Monitor temperature curve, resin gelation, and curing progress.',
    iconName: 'Thermometer',
  },
  {
    id: 6,
    title: 'Demolding, Trimming & 3D Render',
    subtitle: 'Demolding, Margin Trimming & Final 3D Product Rendering',
    description: 'Subsequent to drying, remove weights, lift off upper die, remove top Mylar, elevate FRP sheet, detach lower Mylar substrate, trim margins for a smooth finish, and inspect the final 3D product rendering.',
    iconName: 'CheckCircle2',
  },
];

export const StepWorkflow: React.FC<StepWorkflowProps> = ({
  currentStep,
  onSelectStep,
  curingProgress,
  config,
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
                Step {s.id}: {s.title}
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
            <button
              key={step.id}
              onClick={() => onSelectStep(step.id)}
              className={`w-full text-left p-3 rounded-xl border transition-all duration-200 flex items-start gap-3 relative group ${
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

                {/* Active Method Badge */}
                {activeOpt && (
                  <div className="mt-1.5 flex items-center gap-1">
                    <span
                      className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded border truncate ${
                        activeOpt.typeBadge === 'Standard Default'
                          ? 'bg-blue-950/80 text-blue-300 border-blue-500/30'
                          : 'bg-purple-950/80 text-purple-300 border-purple-500/30'
                      }`}
                    >
                      {activeOpt.shortLabel}
                    </span>
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
            </button>
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
  onSelectStep,
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
                Step {s.id}: {s.title}
              </option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-blue-400 text-[10px]">
            ▼
          </div>
        </div>

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
    </div>
  );
};
