import React from 'react';
import { Settings2, Sparkles, CheckCircle2, IndianRupee, TrendingDown, ShieldCheck } from 'lucide-react';
import { FRPConfig, StepNumber } from '../types';
import { STEP_ALTERNATIVE_OPTIONS, STEP_COST_STRATEGIES } from '../data/processOptions';
import { soundFx } from '../utils/soundEffects';

interface StepAlternativeSelectorProps {
  stepId: StepNumber;
  config: FRPConfig;
  updateField: <K extends keyof FRPConfig>(key: K, value: FRPConfig[K]) => void;
}

export const StepAlternativeSelector: React.FC<StepAlternativeSelectorProps> = ({
  stepId,
  config,
  updateField,
}) => {
  const options = STEP_ALTERNATIVE_OPTIONS[stepId] || [];
  const costStrategies = STEP_COST_STRATEGIES[stepId] || [];
  if (options.length === 0) return null;

  // Field name mapping
  const fieldKey = `step${stepId}Method` as keyof FRPConfig;
  const currentVal = (config[fieldKey] as string) || options[0].id;
  const activeOption = options.find((o) => o.id === currentVal) || options[0];

  return (
    <div className="bg-slate-900/90 border border-indigo-500/30 p-3.5 rounded-xl flex flex-col gap-3 shadow-lg my-2">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="text-[11px] font-mono font-bold uppercase text-indigo-300 flex items-center gap-1.5">
          <Settings2 className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>Step {stepId} Process Options & Alternatives</span>
        </span>
        <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          {options.length} Process Methods
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] text-slate-300 leading-relaxed">
          Choose your target manufacturing setup or alternative engineering method:
        </p>
      </div>

      {/* Streamlined Method Dropdown Interface */}
      <div className="relative w-full">
        <label htmlFor="method-select-dropdown" className="sr-only">Select Method</label>
        <select
          id="method-select-dropdown"
          value={currentVal}
          onChange={(e) => {
            soundFx.playClick();
            updateField(fieldKey, e.target.value as any);
          }}
          className="w-full bg-slate-950 border border-indigo-500/50 text-indigo-200 text-xs font-bold font-mono rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer shadow-inner appearance-none pr-8"
        >
          {options.map((opt) => (
            <option key={opt.id} value={opt.id} className="bg-slate-900 text-white font-sans text-xs">
              {opt.name} ({opt.typeBadge})
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-400 text-xs">
          ▼
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((opt) => {
          const isSelected = currentVal === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => {
                soundFx.playClick();
                updateField(fieldKey, opt.id as any);
              }}
              className={`p-2.5 rounded-xl border text-left flex flex-col gap-1.5 transition-all relative ${
                isSelected
                  ? 'bg-gradient-to-br from-indigo-950/90 to-slate-900 border-indigo-400 ring-1 ring-indigo-400/50 shadow-md'
                  : 'bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-start justify-between gap-1">
                <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {opt.name}
                </span>
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                    opt.typeBadge === 'Standard Default'
                      ? 'bg-blue-950 text-blue-300 border border-blue-500/40'
                      : 'bg-purple-950 text-purple-300 border border-purple-500/40'
                  }`}
                >
                  {opt.typeBadge}
                </span>
              </div>

              <p className="text-[10px] text-slate-400 leading-relaxed">
                {opt.description}
              </p>

              {isSelected && (
                <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 pt-1 border-t border-slate-800/80 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>Selected Active Method</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Option Technical Breakdown Box */}
      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px] font-mono font-bold text-indigo-300">
          <span>Active Specifications ({activeOption.shortLabel}):</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[10px] font-mono">
          {activeOption.specs.map((spec, idx) => (
            <div key={idx} className="bg-slate-900/90 p-1.5 rounded border border-slate-800 text-slate-300">
              • {spec}
            </div>
          ))}
        </div>
        <div className="text-[10px] text-emerald-300/90 font-mono bg-emerald-950/40 p-2 rounded border border-emerald-500/20">
          <strong className="text-emerald-400">Engineering Advantage:</strong> {activeOption.advantages}
        </div>
      </div>

      {/* Stage Cost-Reduction Strategies Box */}
      {costStrategies.length > 0 && (
        <div className="bg-slate-950/90 border border-emerald-500/30 p-3 rounded-lg flex flex-col gap-2.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="text-[11px] font-mono font-bold uppercase text-emerald-400 flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Step {stepId} Cost-Reduction Strategies</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
              <IndianRupee className="w-3 h-3 text-emerald-400" />
              Value Engineering
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {costStrategies.map((strat, sIdx) => (
              <div key={sIdx} className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 flex flex-col gap-1 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    {strat.title}
                  </span>
                  <span className="text-[10px] font-mono font-extrabold text-emerald-400 bg-emerald-950/90 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    Saves {strat.savingsPercent}
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 leading-relaxed pl-5">
                  {strat.action}
                </p>
                <div className="pl-5 text-[10px] font-mono text-cyan-300 flex items-center gap-1 mt-0.5">
                  <strong className="text-slate-400">Financial Impact:</strong> {strat.financialImpact}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

