import React from 'react';
import {
  X,
  IndianRupee,
  Sliders,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Percent,
  Check,
  Building2,
  Scale,
  Calculator,
  ShieldCheck,
  Factory
} from 'lucide-react';
import { FRPConfig, MaterialCalculations } from '../types';
import { soundFx } from '../utils/soundEffects';

interface RateAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: FRPConfig;
  materials: MaterialCalculations;
  updateField: <K extends keyof FRPConfig>(field: K, value: FRPConfig[K]) => void;
}

export const RateAdjustmentModal: React.FC<RateAdjustmentModalProps> = ({
  isOpen,
  onClose,
  config,
  materials,
  updateField,
}) => {
  if (!isOpen) return null;

  // Baseline market defaults
  const usdToInr = config.customUsdToInrRate ?? 83.5;
  const currentResinRate = materials.activeResinRateInrPerKg;
  const currentGlassRate = materials.activeGlassRateInrPerKg;
  const currentFillerRate = materials.activeFillerRateInrPerKg;
  const currentCatalystRate = materials.activeCatalystRateInrPerLiter;
  const currentLaborRate = materials.activeLaborRateInrPerSheet;
  const currentGst = materials.activeGstPercent;
  const currentProfitMargin = materials.activeProfitMarginPercent;

  // Preset Handlers
  const handleResetToDefault = () => {
    soundFx.playClick();
    updateField('customResinRateInrPerKg', undefined);
    updateField('customGlassRateInrPerKg', undefined);
    updateField('customFillerRateInrPerKg', undefined);
    updateField('customCatalystRateInrPerLiter', undefined);
    updateField('customLaborRateInrPerSheet', undefined);
    updateField('customUsdToInrRate', undefined);
    updateField('customGstPercent', undefined);
    updateField('customProfitMarginPercent', undefined);
  };

  const handleApplyWholesaleDiscount = () => {
    soundFx.playSuccess();
    updateField('customResinRateInrPerKg', Math.round(currentResinRate * 0.85));
    updateField('customGlassRateInrPerKg', Math.round(currentGlassRate * 0.85));
    updateField('customFillerRateInrPerKg', Math.round(currentFillerRate * 0.85));
    updateField('customCatalystRateInrPerLiter', Math.round(currentCatalystRate * 0.85));
  };

  const handleApplyPremiumQuality = () => {
    soundFx.playSuccess();
    updateField('customResinRateInrPerKg', Math.round(currentResinRate * 1.25));
    updateField('customGlassRateInrPerKg', Math.round(currentGlassRate * 1.20));
    updateField('customProfitMarginPercent', 20);
  };

  // Cost component percentage calculations for visual breakdown
  const totalBaseInr = materials.estimatedCostInr > 0 ? materials.estimatedCostInr : 1;
  const resinTotalInr = materials.totalResinWeightKg * currentResinRate;
  const glassTotalInr = materials.totalGlassWeightKg * currentGlassRate;
  const fillerTotalInr = materials.fillerWeightKg * currentFillerRate;
  const laborTotalInr = currentLaborRate;

  const resinPct = Math.round((resinTotalInr / totalBaseInr) * 100);
  const glassPct = Math.round((glassTotalInr / totalBaseInr) * 100);
  const fillerPct = Math.round((fillerTotalInr / totalBaseInr) * 100);
  const laborPct = Math.round((laborTotalInr / totalBaseInr) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto font-sans">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-slate-800 bg-slate-950 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Commercial Rate & Cost Adjuster</span>
                <span className="text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40 px-2 py-0.5 rounded">
                  Live Pricing
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Customize raw material unit prices, labor rates, GST rates, and commercial profit margins.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-3 sm:p-5 overflow-y-auto flex flex-col lg:flex-row gap-4 sm:gap-6 bg-slate-900">
          {/* Left Column: Input Sliders & Rate Controls */}
          <div className="flex-1 flex flex-col gap-4">
            {/* Quick Presets Bar */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-2">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center justify-between">
                <span>Quick Rate Presets & Benchmark Reset</span>
                <Sparkles className="w-3 h-3 text-amber-400" />
              </span>

              <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px]">
                <button
                  onClick={handleResetToDefault}
                  className="py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                  title="Reset to factory benchmark standard rates"
                >
                  <RotateCcw className="w-3 h-3 text-sky-400" />
                  <span>Reset Factory</span>
                </button>

                <button
                  onClick={handleApplyWholesaleDiscount}
                  className="py-1.5 px-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                  title="Apply 15% wholesale raw material discount"
                >
                  <TrendingUp className="w-3 h-3 text-emerald-400 rotate-180" />
                  <span>-15% Bulk</span>
                </button>

                <button
                  onClick={handleApplyPremiumQuality}
                  className="py-1.5 px-2 rounded-lg bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/30 text-amber-300 font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
                  title="Apply premium high-grade resin & glass rates"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>+25% Premium</span>
                </button>
              </div>
            </div>

            {/* Rate Adjustment Input Controls */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-3.5 text-xs font-mono">
              <h4 className="text-[11px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
                <Sliders className="w-3.5 h-3.5" /> Raw Material Unit Rates (INR / Kg)
              </h4>

              {/* 1. Resin Rate */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-slate-300">
                  <span>1. Polymer Resin Matrix Rate:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-amber-400 font-bold text-sm">₹{currentResinRate}</span>
                    <span className="text-slate-500 text-[10px]">/ kg</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="150"
                  max="800"
                  step="5"
                  value={currentResinRate}
                  onChange={(e) => updateField('customResinRateInrPerKg', Number(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-500">
                  <span>Standard Ortho: ₹267</span>
                  <span>Iso: ₹351</span>
                  <span>Vinyl Ester: ₹568</span>
                </div>
              </div>

              {/* 2. Glass Fiber Rate */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-slate-300">
                  <span>2. Fiberglass (CSM / Roving) Rate:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-cyan-400 font-bold text-sm">₹{currentGlassRate}</span>
                    <span className="text-slate-500 text-[10px]">/ kg</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="120"
                  max="500"
                  step="5"
                  value={currentGlassRate}
                  onChange={(e) => updateField('customGlassRateInrPerKg', Number(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-500">
                  <span>Economy CSM: ₹180</span>
                  <span>Standard E-Glass: ₹235</span>
                  <span>High Tensile: ₹420</span>
                </div>
              </div>

              {/* 3. Mineral Filler Rate */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-slate-300">
                  <span>3. Mineral Filler ({config.fillerType || 'CaCO3'}) Rate:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-emerald-400 font-bold text-sm">₹{currentFillerRate}</span>
                    <span className="text-slate-500 text-[10px]">/ kg</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="5"
                  max="150"
                  step="1"
                  value={currentFillerRate}
                  onChange={(e) => updateField('customFillerRateInrPerKg', Number(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-500">
                  <span>CaCO3: ₹18</span>
                  <span>Quartz: ₹28</span>
                  <span>ATH Flame Retardant: ₹55</span>
                </div>
              </div>

              {/* 4. Catalyst & Additives Rate */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-slate-300">
                  <span>4. MEKP Catalyst & Promoter Rate:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-purple-400 font-bold text-sm">₹{currentCatalystRate}</span>
                    <span className="text-slate-500 text-[10px]">/ Liter</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="300"
                  max="1500"
                  step="25"
                  value={currentCatalystRate}
                  onChange={(e) => updateField('customCatalystRateInrPerLiter', Number(e.target.value))}
                  className="w-full accent-purple-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <h4 className="text-[11px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2 mt-2">
                <Factory className="w-3.5 h-3.5" /> Labor, Overhead & Commercial Margins
              </h4>

              {/* 5. Labor & Overhead Cost */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-slate-300">
                  <span>5. Overhead, Power & Labor per Sheet:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-blue-400 font-bold text-sm">₹{currentLaborRate}</span>
                    <span className="text-slate-500 text-[10px]">/ sheet</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="200"
                  max="5000"
                  step="50"
                  value={currentLaborRate}
                  onChange={(e) => updateField('customLaborRateInrPerSheet', Number(e.target.value))}
                  className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* 6. Profit Margin % */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-slate-300">
                  <span>6. Commercial Profit Margin:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-amber-300 font-bold text-sm">{currentProfitMargin}%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={currentProfitMargin}
                  onChange={(e) => updateField('customProfitMarginPercent', Number(e.target.value))}
                  className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-slate-500">
                  <span>0% (Cost Only)</span>
                  <span>15% (Standard)</span>
                  <span>30% (Retail)</span>
                </div>
              </div>

              {/* 7. GST % & Exchange Rate */}
              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-800">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400">Statutory GST Rate:</label>
                  <select
                    value={currentGst}
                    onChange={(e) => updateField('customGstPercent', Number(e.target.value))}
                    className="bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                  >
                    <option value={18}>18% GST (HSN 3920 Standard)</option>
                    <option value={12}>12% Reduced GST</option>
                    <option value={5}>5% Concessional GST</option>
                    <option value={0}>0% SEZ / Export Exempt</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-slate-400">USD / INR Exchange Rate:</label>
                  <input
                    type="number"
                    step="0.1"
                    value={usdToInr}
                    onChange={(e) => updateField('customUsdToInrRate', Number(e.target.value))}
                    className="bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-sky-300 font-bold focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Recalculations & Commercial Breakdown */}
          <div className="w-full lg:w-80 flex flex-col gap-3.5 shrink-0">
            {/* Live Pricing Summary Card */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-3 font-mono">
              <span className="text-[10px] font-bold uppercase text-teal-400 flex items-center gap-1.5 border-b border-slate-900 pb-2">
                <Calculator className="w-4 h-4 text-teal-400" /> Calculated Commercial Summary
              </span>

              {/* Main Total Inr Price */}
              <div className="bg-slate-900/90 p-3 rounded-xl border border-teal-500/30 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] uppercase text-slate-400 font-bold">Total Finished Sheet Price</span>
                <div className="text-2xl font-black text-teal-300 flex items-center justify-center gap-0.5 mt-0.5">
                  <span>₹{Math.round(materials.totalCostWithGstInr).toLocaleString('en-IN')}</span>
                  <span className="text-xs text-slate-400 font-normal">INR</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                  Incl. {currentGst}% GST (₹{Math.round(materials.gstAmountInr).toLocaleString('en-IN')})
                </span>
              </div>

              {/* Unit Rate Breakdown */}
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex justify-between border-b border-slate-900 pb-1.5">
                  <span className="text-slate-400">Ex-Factory Base Cost:</span>
                  <span className="text-slate-200 font-bold">₹{Math.round(materials.estimatedCostInr).toLocaleString('en-IN')}</span>
                </div>

                {currentProfitMargin > 0 && (
                  <div className="flex justify-between border-b border-slate-900 pb-1.5 text-amber-300">
                    <span>Profit Margin ({currentProfitMargin}%):</span>
                    <span className="font-bold">+₹{materials.profitAmountInr.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between border-b border-slate-900 pb-1.5">
                  <span className="text-slate-400">Rate per Sq.Ft (Ex-GST):</span>
                  <span className="text-amber-300 font-bold">₹{materials.pricePerSqFtInr} / sq.ft</span>
                </div>

                <div className="flex justify-between border-b border-slate-900 pb-1.5">
                  <span className="text-slate-400">Rate per Sq.Ft (Incl. GST):</span>
                  <span className="text-emerald-300 font-bold">
                    ₹{(materials.pricePerSqFtInr * (1 + currentGst / 100)).toFixed(1)} / sq.ft
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-900 pb-1.5">
                  <span className="text-slate-400">Rate per Sq.Meter:</span>
                  <span className="text-cyan-300 font-bold">₹{materials.pricePerM2Inr} / m²</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Rate per Finished Kg:</span>
                  <span className="text-slate-200 font-bold">₹{materials.pricePerKgInr} / kg</span>
                </div>
              </div>

              {/* Material Cost Distribution Bar */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-900">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Cost Component Breakdown:</span>
                <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex">
                  <div className="bg-amber-500 h-full" style={{ width: `${resinPct}%` }} title={`Resin: ${resinPct}%`} />
                  <div className="bg-cyan-500 h-full" style={{ width: `${glassPct}%` }} title={`Glass: ${glassPct}%`} />
                  <div className="bg-emerald-500 h-full" style={{ width: `${fillerPct}%` }} title={`Filler: ${fillerPct}%`} />
                  <div className="bg-blue-500 h-full" style={{ width: `${laborPct}%` }} title={`Labor: ${laborPct}%`} />
                </div>
                <div className="grid grid-cols-2 gap-1 text-[9px] text-slate-400">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block"/> Resin: {resinPct}%</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500 inline-block"/> Glass: {glassPct}%</span>
                  {fillerPct > 0 && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"/> Filler: {fillerPct}%</span>}
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500 inline-block"/> Labor/Pwr: {laborPct}%</span>
                </div>
              </div>
            </div>

            {/* Apply & Close Button */}
            <button
              onClick={() => {
                soundFx.playSuccess();
                onClose();
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-all cursor-pointer mt-auto"
            >
              <Check className="w-4 h-4" />
              <span>Apply Custom Commercial Rates</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
