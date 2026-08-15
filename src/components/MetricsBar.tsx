import React from 'react';
import { FRPConfig, MaterialCalculations, TableSpec } from '../types';
import {
  Boxes,
  Scale,
  IndianRupee,
  Thermometer,
  Layers,
  Ruler,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface MetricsBarProps {
  config: FRPConfig;
  tableSpec: TableSpec;
  materials: MaterialCalculations;
  curingProgress: number;
  onOpenRateModal?: () => void;
  onOpenTimingModal?: () => void;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({
  config,
  tableSpec,
  materials,
  curingProgress,
  onOpenRateModal,
  onOpenTimingModal,
}) => {
  return (
    <div className="w-full bg-slate-950 border-t border-slate-800 px-3 sm:px-4 py-2 sm:py-3 flex flex-nowrap sm:flex-wrap items-center justify-start sm:justify-between gap-3 sm:gap-4 overflow-x-auto scrollbar-none snap-x text-xs z-10 font-sans shrink-0">
      {/* Table Modular Bed Info */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 snap-start bg-slate-900/80 sm:bg-transparent p-2 sm:p-0 border sm:border-0 border-slate-800 rounded-xl">
        <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
          <Boxes className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
        <div>
          <div className="text-[9px] sm:text-[10px] uppercase font-mono font-bold text-slate-400 whitespace-nowrap">Modular Table Bed</div>
          <div className="font-bold text-white font-mono flex items-center gap-1.5 mt-0.5 text-[11px] sm:text-xs whitespace-nowrap">
            <span>{tableSpec.tableCount} Table Units</span>
            <span className="text-slate-500">•</span>
            <span className="text-blue-300">{tableSpec.totalBedLengthMm}mm Length</span>
          </div>
        </div>
      </div>

      {/* Sheet Specs */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 snap-start bg-slate-900/80 sm:bg-transparent p-2 sm:p-0 border sm:border-0 border-slate-800 rounded-xl">
        <div className="p-1.5 sm:p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
          <Ruler className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
        <div>
          <div className="text-[9px] sm:text-[10px] uppercase font-mono font-bold text-slate-400 whitespace-nowrap">Sheet Widths (Finished / Flat)</div>
          <div className="font-bold text-white font-mono mt-0.5 text-[11px] sm:text-xs whitespace-nowrap flex items-center gap-1.5">
            <span>Finished: {config.widthMm}mm</span>
            <span className="text-slate-500">|</span>
            <span className="text-cyan-300">Flat Raw: {materials.flatWidthMm}mm</span>
          </div>
        </div>
      </div>

      {/* Total Weight & Materials */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 snap-start bg-slate-900/80 sm:bg-transparent p-2 sm:p-0 border sm:border-0 border-slate-800 rounded-xl">
        <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
          <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
        <div>
          <div className="text-[9px] sm:text-[10px] uppercase font-mono font-bold text-slate-400 whitespace-nowrap">Total Sheet Mass</div>
          <div className="font-bold text-emerald-300 font-mono mt-0.5 text-[11px] sm:text-xs whitespace-nowrap">
            {materials.totalSheetWeightKg.toFixed(2)} kg <span className="text-slate-400 font-normal">({materials.densityGcm3} g/cm³)</span>
          </div>
        </div>
      </div>

      {/* Resin & Glass Ratio */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 snap-start bg-slate-900/80 sm:bg-transparent p-2 sm:p-0 border sm:border-0 border-slate-800 rounded-xl">
        <div className="p-1.5 sm:p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
          <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
        <div>
          <div className="text-[9px] sm:text-[10px] uppercase font-mono font-bold text-slate-400 whitespace-nowrap">Matrix Breakdown</div>
          <div className="font-bold text-amber-300 font-mono mt-0.5 text-[11px] sm:text-xs whitespace-nowrap">
            {materials.totalResinWeightKg.toFixed(1)}kg Resin / {materials.totalGlassWeightKg.toFixed(1)}kg Glass
          </div>
        </div>
      </div>

      {/* Curing & Gel Time metric */}
      <div
        onClick={onOpenTimingModal}
        className={`flex items-center gap-2.5 sm:gap-3 shrink-0 snap-start bg-slate-900/80 sm:bg-transparent p-2 sm:p-0 border sm:border-0 border-slate-800 rounded-xl ${
          onOpenTimingModal ? 'cursor-pointer hover:bg-slate-900/90 hover:border-purple-500/40 transition-all' : ''
        }`}
        title="Click to view Process Timing & Gel Window Schedule"
      >
        <div className="p-1.5 sm:p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
          <Thermometer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
        <div>
          <div className="text-[9px] sm:text-[10px] uppercase font-mono font-bold text-slate-400 whitespace-nowrap flex items-center gap-1">
            <span>Cobalt @ Ambient ({materials.ambientTempC}°C)</span>
            {onOpenTimingModal && <span className="text-[9px] text-purple-400 font-normal hover:underline">(Timing)</span>}
          </div>
          <div className="font-bold text-purple-300 font-mono mt-0.5 text-[11px] sm:text-xs whitespace-nowrap flex items-center gap-1.5">
            <span>{materials.cobaltPercent}% Cobalt</span>
            <span className="text-amber-300 bg-amber-950/70 px-1 py-0.2 rounded border border-amber-500/30 text-[10px]">~{materials.estimatedGelTimeMin}m Gel</span>
          </div>
        </div>
      </div>

      {/* BIS Standard Verification */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 snap-start bg-slate-900/80 sm:bg-transparent p-2 sm:p-0 border sm:border-0 border-slate-800 rounded-xl">
        <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
        <div>
          <div className="text-[9px] sm:text-[10px] uppercase font-mono font-bold text-slate-400 whitespace-nowrap">Indian BIS Code</div>
          <div className="font-bold text-emerald-300 font-mono mt-0.5 text-[11px] sm:text-xs whitespace-nowrap flex items-center gap-1">
            <span>IS 12866:2020</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">IS 6746</span>
          </div>
        </div>
      </div>

      {/* Estimated Production Cost & Sq.Ft Rate */}
      <div
        onClick={onOpenRateModal}
        className={`flex items-center gap-2.5 sm:gap-3 shrink-0 snap-start bg-slate-900/80 sm:bg-transparent p-2 sm:p-0 border sm:border-0 border-slate-800 rounded-xl ${
          onOpenRateModal ? 'cursor-pointer hover:bg-slate-900/90 hover:border-teal-500/30 transition-all' : ''
        }`}
        title="Click to adjust raw material rates & commercial pricing"
      >
        <div className="p-1.5 sm:p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 shrink-0">
          <IndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
        <div>
          <div className="text-[9px] sm:text-[10px] uppercase font-mono font-bold text-slate-400 whitespace-nowrap flex items-center gap-1">
            <span>Commercial Rate</span>
            {onOpenRateModal && <span className="text-[9px] text-teal-400 font-normal hover:underline">(Adjust)</span>}
          </div>
          <div className="font-bold text-teal-300 font-mono mt-0.5 text-[11px] sm:text-xs whitespace-nowrap flex items-center gap-1.5">
            <span>₹{Math.round(materials.estimatedCostInr).toLocaleString('en-IN')}</span>
            <span className="text-amber-300 bg-amber-950 px-1 py-0.2 rounded border border-amber-500/30 text-[10px]">₹{materials.pricePerSqFtInr}/ft²</span>
          </div>
        </div>
      </div>
    </div>
  );
};
