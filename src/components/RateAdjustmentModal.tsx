import React from 'react';
import {
  X,
  IndianRupee,
  RotateCcw,
  Percent,
  Package,
  Layers,
  FlaskConical,
  Factory,
  TrendingUp,
  CheckCircle2,
  Sliders,
  Sparkles,
  Sun,
  Palette,
  Film,
  Save
} from 'lucide-react';
import { FRPConfig, MaterialCalculations } from '../types';
import { EditableNumberInput } from './EditableNumberInput';
import {
  applyMylarMicronChange,
  applyMylarRateChange,
  getMylarRateForMicron,
} from '../utils/frpCalculations';

interface RateAdjustmentModalProps {
  config: FRPConfig;
  materials: MaterialCalculations;
  isOpen: boolean;
  onClose: () => void;
  onChangeConfig?: (newConfig: FRPConfig) => void;
  updateField?: <K extends keyof FRPConfig>(field: K, val: FRPConfig[K]) => void;
}

export const RateAdjustmentModal: React.FC<RateAdjustmentModalProps> = ({
  config,
  materials,
  isOpen,
  onClose,
  onChangeConfig,
  updateField,
}) => {
  if (!isOpen) return null;

  const applyConfigUpdate = (newConfig: FRPConfig) => {
    if (typeof onChangeConfig === 'function') {
      onChangeConfig(newConfig);
    } else if (typeof updateField === 'function') {
      (Object.keys(newConfig) as Array<keyof FRPConfig>).forEach((key) => {
        if (newConfig[key] !== config[key]) {
          updateField(key, newConfig[key]);
        }
      });
    }
  };

  const resinRate = materials.activeResinRateInrPerKg;
  const glassRate = materials.activeGlassRateInrPerKg;
  const polymerMeshRate = materials.activePolymerMeshRateInrPerKg;
  const printedClothRate = materials.activePrintedClothRateInrPerKg;
  const fillerRate = materials.activeFillerRateInrPerKg;
  const catalystRate = materials.activeCatalystRateInrPerKg;
  const cobaltRate = materials.activeCobaltRateInrPerKg;
  const pigmentRate = materials.activePigmentRateInrPerKg;
  const styreneRate = materials.activeStyreneRateInrPerKg;
  const uvRate = materials.activeUvRateInrPerKg;
  const bottomMylarRate = materials.activeBottomMylarRateInrPerKg;
  const topMylarRate = materials.activeTopMylarRateInrPerKg;
  const laborRate = materials.activeLaborRateInrPerKg;
  const gstPercent = materials.activeGstPercent;
  const profitMargin = materials.activeProfitMarginPercent;

  const bottomMylarUm = config.mylarBottomThicknessUm ?? config.mylarThicknessUm ?? 25;
  const topMylarUm = config.mylarTopThicknessUm ?? config.mylarThicknessUm ?? 100;

  const handleResetRates = () => {
    try {
      localStorage.removeItem('ufrp_raw_material_rates_v1');
    } catch {
      // ignore
    }
    applyConfigUpdate({
      ...config,
      customResinRateInrPerKg: undefined,
      customGlassRateInrPerKg: undefined,
      customPolymerMeshRateInrPerKg: undefined,
      customPrintedClothRateInrPerKg: undefined,
      customFillerRateInrPerKg: undefined,
      customCatalystRateInrPerKg: undefined,
      customCobaltRateInrPerKg: undefined,
      customPigmentRateInrPerKg: undefined,
      customStyreneRateInrPerKg: undefined,
      customUvRateInrPerKg: undefined,
      customMylarRateInrPerKg: undefined,
      customBottomMylarRateInrPerKg: undefined,
      customTopMylarRateInrPerKg: undefined,
      customMylarRatesByMicron: undefined,
      customLaborRateInrPerKg: undefined,
      customLaborRateUpTo1mmInrPerKg: undefined,
      customLaborRate1_1To1_5mmInrPerKg: undefined,
      customLaborRateAbove1_5mmInrPerKg: undefined,
      laborRateTierOverride: undefined,
      customCatalystRateInrPerLiter: undefined,
      customCobaltRateInrPerLiter: undefined,
      customMylarRateInrPerM2: undefined,
      customLaborRateInrPerSheet: undefined,
      customGstPercent: undefined,
      customProfitMarginPercent: undefined,
    });
  };

  const handleActiveLaborRateChange = (val: number) => {
    if (materials.activeLaborTierId === 'up_to_1mm') {
      applyConfigUpdate({
        ...config,
        customLaborRateInrPerKg: undefined,
        customLaborRateUpTo1mmInrPerKg: val,
      });
    } else if (materials.activeLaborTierId === '1_1_to_1_5mm') {
      applyConfigUpdate({
        ...config,
        customLaborRateInrPerKg: undefined,
        customLaborRate1_1To1_5mmInrPerKg: val,
      });
    } else {
      applyConfigUpdate({
        ...config,
        customLaborRateInrPerKg: undefined,
        customLaborRateAbove1_5mmInrPerKg: val,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 font-sans overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl text-white my-4 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-950/90 via-slate-900 to-emerald-950/90 px-4 sm:px-6 py-4 border-b border-teal-500/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/40 flex items-center justify-center shrink-0">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  Raw Material &amp; Labor Rate Editor (All in ₹/kg)
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 rounded-md border border-emerald-500/40 flex items-center gap-1">
                  <Save className="w-3 h-3" /> Auto-Remembered
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                All 10 raw material &amp; labor rates are directly editable in ₹/kg and automatically remembered across sessions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Live Pricing Summary Banner */}
          <div className="bg-slate-950 p-4 rounded-xl border border-teal-500/30 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Ex-Factory / Sheet</span>
              <strong className="text-base sm:text-lg text-white font-extrabold">
                ₹{Math.round(materials.estimatedCostInr).toLocaleString('en-IN')}
              </strong>
              <span className="text-[9px] text-teal-400 block mt-0.5">
                Incl. {profitMargin}% Margin (₹{materials.profitAmountInr})
              </span>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Rate / Sq. Feet</span>
              <strong className="text-base sm:text-lg text-emerald-400 font-extrabold">
                ₹{materials.pricePerSqFtInr}
              </strong>
              <span className="text-[9px] text-slate-500 block mt-0.5">
                ₹{materials.pricePerM2Inr} / m²
              </span>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Rate / Kg Weight</span>
              <strong className="text-base sm:text-lg text-cyan-400 font-extrabold">
                ₹{materials.pricePerKgInr}
              </strong>
              <span className="text-[9px] text-slate-500 block mt-0.5">
                Sheet: {materials.totalSheetWeightKg.toFixed(2)} kg
              </span>
            </div>

            <div className="bg-amber-950/30 p-3 rounded-lg border border-amber-500/30">
              <span className="text-[10px] text-amber-300 uppercase block">Final Incl. {gstPercent}% GST</span>
              <strong className="text-base sm:text-lg text-amber-300 font-extrabold">
                ₹{materials.totalCostWithGstInr.toLocaleString('en-IN')}
              </strong>
              <span className="text-[9px] text-amber-400/80 block mt-0.5">
                GST: ₹{materials.gstAmountInr.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Primary Raw Materials Grid */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" /> 1. Primary Matrix, Reinforcement &amp; Mylar Film Rates (₹/kg)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* 1. Polymer Resin Rate (₹/kg) */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                    <FlaskConical className="w-3.5 h-3.5 text-indigo-400" />
                    Polymer Resin Rate (₹/kg)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Used: {materials.totalResinWeightKg.toFixed(2)} kg = <strong className="text-white">₹{materials.resinCostInr}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={80}
                    max={1200}
                    step={1}
                    value={Math.min(1200, Math.max(80, resinRate))}
                    onChange={(e) =>
                      applyConfigUpdate({ ...config, customResinRateInrPerKg: Number(e.target.value) })
                    }
                    className="flex-1 accent-indigo-500 cursor-pointer"
                  />
                  <div className="relative w-28">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">₹</span>
                    <EditableNumberInput
                      value={resinRate}
                      min={1}
                      max={10000}
                      step={1}
                      onChange={(val) =>
                        applyConfigUpdate({ ...config, customResinRateInrPerKg: val })
                      }
                      className="w-full bg-slate-900 border border-slate-700 focus:border-indigo-500 rounded-lg pl-6 pr-2 py-1.5 text-right font-mono text-xs font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 font-mono">
                  Active grade: {materials.resinTypeSpec.name} (Default: ₹{materials.resinTypeSpec.costPerKgInr}/kg)
                </p>
              </div>

              {/* 2. Glass Fiber Rate (₹/kg) */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    Glass Fiber (CSM/WR) Rate (₹/kg)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Used: {(materials.totalGlassWeightKg - materials.polymerMeshWeightKg - materials.printedClothWeightKg).toFixed(2)} kg = <strong className="text-white">₹{materials.glassCostInr}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={60}
                    max={800}
                    step={1}
                    value={Math.min(800, Math.max(60, glassRate))}
                    onChange={(e) =>
                      applyConfigUpdate({ ...config, customGlassRateInrPerKg: Number(e.target.value) })
                    }
                    className="flex-1 accent-emerald-500 cursor-pointer"
                  />
                  <div className="relative w-28">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">₹</span>
                    <EditableNumberInput
                      value={glassRate}
                      min={1}
                      max={10000}
                      step={1}
                      onChange={(val) =>
                        applyConfigUpdate({ ...config, customGlassRateInrPerKg: val })
                      }
                      className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 rounded-lg pl-6 pr-2 py-1.5 text-right font-mono text-xs font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 font-mono">
                  Active stack: {materials.plySummaryText} (Default: ₹235/kg)
                </p>
              </div>

              {/* 2B. Polymer Reinforcing Mesh Rate (₹/kg) */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-teal-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-teal-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-teal-400" />
                    Polymer Mesh (5 GSM) Rate (₹/kg)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Used: {materials.polymerMeshWeightGrams.toFixed(1)}g ({materials.polymerMeshWeightKg.toFixed(3)} kg) = <strong className="text-white">₹{materials.polymerMeshCostInr}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={80}
                    max={1200}
                    step={5}
                    value={Math.min(1200, Math.max(80, polymerMeshRate))}
                    onChange={(e) =>
                      applyConfigUpdate({ ...config, customPolymerMeshRateInrPerKg: Number(e.target.value) })
                    }
                    className="flex-1 accent-teal-500 cursor-pointer"
                  />
                  <div className="relative w-28">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">₹</span>
                    <EditableNumberInput
                      value={polymerMeshRate}
                      min={0}
                      max={15000}
                      step={5}
                      onChange={(val) =>
                        applyConfigUpdate({ ...config, customPolymerMeshRateInrPerKg: val })
                      }
                      className="w-full bg-slate-900 border border-slate-700 focus:border-teal-500 rounded-lg pl-6 pr-2 py-1.5 text-right font-mono text-xs font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 font-mono">
                  High-tenacity PP/PET polymer grid mesh (5 gsm • Default: ₹320/kg)
                </p>
              </div>

              {/* 2C. Printed Clothes / Designer Fabric Rate (₹/kg) */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-pink-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-pink-300 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-pink-400" />
                    Printed Clothes (50 GSM) Rate (₹/kg)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Used: {materials.printedClothWeightGrams.toFixed(1)}g ({materials.printedClothWeightKg.toFixed(3)} kg) = <strong className="text-white">₹{materials.printedClothCostInr}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={100}
                    max={2000}
                    step={10}
                    value={Math.min(2000, Math.max(100, printedClothRate))}
                    onChange={(e) =>
                      applyConfigUpdate({ ...config, customPrintedClothRateInrPerKg: Number(e.target.value) })
                    }
                    className="flex-1 accent-pink-500 cursor-pointer"
                  />
                  <div className="relative w-28">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">₹</span>
                    <EditableNumberInput
                      value={printedClothRate}
                      min={0}
                      max={20000}
                      step={10}
                      onChange={(val) =>
                        applyConfigUpdate({ ...config, customPrintedClothRateInrPerKg: val })
                      }
                      className="w-full bg-slate-900 border border-slate-700 focus:border-pink-500 rounded-lg pl-6 pr-2 py-1.5 text-right font-mono text-xs font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 font-mono">
                  Decorative printed clothes / designer fabric interlayer (50 gsm • Default: ₹480/kg)
                </p>
              </div>

              {/* 3. Mineral Filler Rate (₹/kg) */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                    <Package className="w-3.5 h-3.5 text-cyan-400" />
                    Mineral Filler Rate (₹/kg)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Used: {materials.fillerWeightKg.toFixed(2)} kg = <strong className="text-white">₹{materials.fillerCostInr}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={5}
                    max={300}
                    step={1}
                    value={Math.min(300, Math.max(5, fillerRate))}
                    onChange={(e) =>
                      applyConfigUpdate({ ...config, customFillerRateInrPerKg: Number(e.target.value) })
                    }
                    className="flex-1 accent-cyan-500 cursor-pointer"
                  />
                  <div className="relative w-28">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">₹</span>
                    <EditableNumberInput
                      value={fillerRate}
                      min={0}
                      max={5000}
                      step={1}
                      onChange={(val) =>
                        applyConfigUpdate({ ...config, customFillerRateInrPerKg: val })
                      }
                      className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-lg pl-6 pr-2 py-1.5 text-right font-mono text-xs font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 font-mono">
                  Active filler: {config.fillerType === 'none' ? 'Unfilled (0%)' : config.fillerType?.replace(/_/g, ' ')} (Default: ₹{materials.fillerCostInrKg}/kg)
                </p>
              </div>

              {/* 4A. 25-Micron (1st / Bottom Layer) Mylar Carrier Film Rate (₹/kg) */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-cyan-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-cyan-400" />
                    {bottomMylarUm}-Micron (1st / Bottom) Mylar Rate (₹/kg)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {materials.bottomMylarWeightGrams.toFixed(0)}g ({materials.bottomMylarWeightKg.toFixed(3)} kg) = <strong className="text-white">₹{materials.bottomMylarCostInr}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={80}
                    max={600}
                    step={5}
                    value={Math.min(600, Math.max(80, bottomMylarRate))}
                    onChange={(e) =>
                      applyConfigUpdate(
                        applyMylarRateChange(config, 'bottom', Number(e.target.value))
                      )
                    }
                    className="flex-1 accent-cyan-500 cursor-pointer"
                  />
                  <div className="relative w-28">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">₹</span>
                    <EditableNumberInput
                      value={bottomMylarRate}
                      min={0}
                      max={10000}
                      step={5}
                      onChange={(val) =>
                        applyConfigUpdate(applyMylarRateChange(config, 'bottom', val))
                      }
                      className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-lg pl-6 pr-2 py-1.5 text-right font-mono text-xs font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>
                <div className="bg-slate-900/90 px-2.5 py-1.5 rounded-lg border border-slate-800 flex flex-col gap-1.5 text-[10px] font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-300">Select 1st (Bottom) Micron (Auto-Fetches Rate):</span>
                    <div className="flex items-center gap-1">
                      <EditableNumberInput
                        value={bottomMylarUm}
                        min={10}
                        max={500}
                        step={5}
                        onChange={(val) =>
                          applyConfigUpdate(applyMylarMicronChange(config, val, undefined))
                        }
                        className="w-14 bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded px-1.5 py-0.5 text-right font-bold text-white focus:outline-none"
                      />
                      <span className="text-slate-400">µm</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {[19, 25, 36, 50, 75, 100, 125].map((um) => {
                      const rateForUm = getMylarRateForMicron(um, config);
                      return (
                        <button
                          key={um}
                          type="button"
                          onClick={() =>
                            applyConfigUpdate(applyMylarMicronChange(config, um, undefined))
                          }
                          className={`py-1 rounded border font-bold transition-all cursor-pointer flex flex-col items-center leading-tight ${
                            bottomMylarUm === um
                              ? 'bg-cyan-600 border-cyan-400 text-white'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span>{um}µm</span>
                          <span className="text-[8px] opacity-80">₹{rateForUm}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 4B. 100-Micron (2nd / Top Layer) Mylar Carrier Film Rate (₹/kg) */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-amber-400" />
                    {topMylarUm}-Micron (Top Layer) Mylar Rate (₹/kg)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {materials.topMylarWeightGrams.toFixed(0)}g ({materials.topMylarWeightKg.toFixed(3)} kg) = <strong className="text-white">₹{materials.topMylarCostInr}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={80}
                    max={600}
                    step={5}
                    value={Math.min(600, Math.max(80, topMylarRate))}
                    onChange={(e) =>
                      applyConfigUpdate(
                        applyMylarRateChange(config, 'top', Number(e.target.value))
                      )
                    }
                    className="flex-1 accent-amber-500 cursor-pointer"
                  />
                  <div className="relative w-28">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">₹</span>
                    <EditableNumberInput
                      value={topMylarRate}
                      min={0}
                      max={10000}
                      step={5}
                      onChange={(val) =>
                        applyConfigUpdate(applyMylarRateChange(config, 'top', val))
                      }
                      className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-lg pl-6 pr-2 py-1.5 text-right font-mono text-xs font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>
                <div className="bg-slate-900/90 px-2.5 py-1.5 rounded-lg border border-slate-800 flex flex-col gap-1.5 text-[10px] font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-300">Select 2nd (Top) Micron (Auto-Fetches Rate):</span>
                    <div className="flex items-center gap-1">
                      <EditableNumberInput
                        value={topMylarUm}
                        min={10}
                        max={500}
                        step={5}
                        onChange={(val) =>
                          applyConfigUpdate(applyMylarMicronChange(config, undefined, val))
                        }
                        className="w-14 bg-slate-950 border border-slate-700 focus:border-amber-500 rounded px-1.5 py-0.5 text-right font-bold text-white focus:outline-none"
                      />
                      <span className="text-slate-400">µm</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {[19, 25, 36, 50, 75, 100, 125].map((um) => {
                      const rateForUm = getMylarRateForMicron(um, config);
                      return (
                        <button
                          key={um}
                          type="button"
                          onClick={() =>
                            applyConfigUpdate(applyMylarMicronChange(config, undefined, um))
                          }
                          className={`py-1 rounded border font-bold transition-all cursor-pointer flex flex-col items-center leading-tight ${
                            topMylarUm === um
                              ? 'bg-amber-600 border-amber-400 text-white'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          <span>{um}µm</span>
                          <span className="text-[8px] opacity-80">₹{rateForUm}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Curing Agents, Additives, Pigments & Labor Grid (All in ₹/kg) */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> 2. Catalyst, Promoter, Pigment, Additive &amp; Labor Rates (All in ₹/kg)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {/* 5. MEKP Catalyst Rate (₹/kg) */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-300 flex items-center gap-1">
                    MEKP Catalyst (₹/kg)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {materials.catalystWeightGrams.toFixed(0)} g ({materials.catalystWeightKg.toFixed(3)} kg) = <strong className="text-white">₹{materials.catalystCostInr}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={150}
                    max={2000}
                    step={10}
                    value={Math.min(2000, Math.max(150, catalystRate))}
                    onChange={(e) =>
                      applyConfigUpdate({ ...config, customCatalystRateInrPerKg: Number(e.target.value) })
                    }
                    className="flex-1 accent-amber-500 cursor-pointer"
                  />
                  <div className="relative w-24">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">₹</span>
                    <EditableNumberInput
                      value={catalystRate}
                      min={1}
                      max={20000}
                      step={10}
                      onChange={(val) =>
                        applyConfigUpdate({ ...config, customCatalystRateInrPerKg: val })
                      }
                      className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-lg pl-5 pr-2 py-1.5 text-right font-mono text-xs font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 font-mono">Default: ₹610/kg ({materials.catalystVolumeMl.toFixed(0)} mL)</p>
              </div>

              {/* 6. Cobalt Octoate Promoter Rate (₹/kg) */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-purple-300 flex items-center gap-1">
                    Cobalt Promoter (₹/kg)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {materials.cobaltWeightGrams.toFixed(1)} g ({materials.cobaltWeightKg.toFixed(3)} kg) = <strong className="text-white">₹{materials.cobaltCostInr}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={200}
                    max={3000}
                    step={10}
                    value={Math.min(3000, Math.max(200, cobaltRate))}
                    onChange={(e) =>
                      applyConfigUpdate({ ...config, customCobaltRateInrPerKg: Number(e.target.value) })
                    }
                    className="flex-1 accent-purple-500 cursor-pointer"
                  />
                  <div className="relative w-24">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">₹</span>
                    <EditableNumberInput
                      value={cobaltRate}
                      min={1}
                      max={25000}
                      step={10}
                      onChange={(val) =>
                        applyConfigUpdate({ ...config, customCobaltRateInrPerKg: val })
                      }
                      className="w-full bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-lg pl-5 pr-2 py-1.5 text-right font-mono text-xs font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 font-mono">Cobalt Octoate 6% (Default: ₹885/kg)</p>
              </div>

              {/* 7. Pigment Paste Rate (₹/kg) */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-pink-300 flex items-center gap-1">
                    <Palette className="w-3 h-3 text-pink-400" />
                    Pigment Paste (₹/kg)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {materials.pigmentWeightGrams.toFixed(0)} g ({materials.pigmentWeightKg.toFixed(3)} kg) = <strong className="text-white">₹{materials.pigmentCostInr}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={100}
                    max={2500}
                    step={10}
                    value={Math.min(2500, Math.max(100, pigmentRate))}
                    onChange={(e) =>
                      applyConfigUpdate({ ...config, customPigmentRateInrPerKg: Number(e.target.value) })
                    }
                    className="flex-1 accent-pink-500 cursor-pointer"
                  />
                  <div className="relative w-24">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">₹</span>
                    <EditableNumberInput
                      value={pigmentRate}
                      min={0}
                      max={25000}
                      step={10}
                      onChange={(val) =>
                        applyConfigUpdate({ ...config, customPigmentRateInrPerKg: val })
                      }
                      className="w-full bg-slate-900 border border-slate-700 focus:border-pink-500 rounded-lg pl-5 pr-2 py-1.5 text-right font-mono text-xs font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 font-mono">RAL / Polyester Paste (Default: ₹450/kg)</p>
              </div>

              {/* 8. Styrene Monomer Diluent Rate (₹/kg) */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-sky-300 flex items-center gap-1">
                    Styrene Monomer (₹/kg)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {materials.styreneMonomerWeightGrams.toFixed(0)} g ({materials.styreneMonomerWeightKg.toFixed(2)} kg) = <strong className="text-white">₹{materials.styreneCostInr}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={60}
                    max={600}
                    step={5}
                    value={Math.min(600, Math.max(60, styreneRate))}
                    onChange={(e) =>
                      applyConfigUpdate({ ...config, customStyreneRateInrPerKg: Number(e.target.value) })
                    }
                    className="flex-1 accent-sky-500 cursor-pointer"
                  />
                  <div className="relative w-24">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">₹</span>
                    <EditableNumberInput
                      value={styreneRate}
                      min={0}
                      max={10000}
                      step={5}
                      onChange={(val) =>
                        applyConfigUpdate({ ...config, customStyreneRateInrPerKg: val })
                      }
                      className="w-full bg-slate-900 border border-slate-700 focus:border-sky-500 rounded-lg pl-5 pr-2 py-1.5 text-right font-mono text-xs font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 font-mono">Reactive Diluent (Default: ₹145/kg)</p>
              </div>

              {/* 9. UV Stabilizer Package Rate (₹/kg) */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-yellow-300 flex items-center gap-1">
                    <Sun className="w-3 h-3 text-yellow-400" />
                    UV Stabilizer (₹/kg)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {materials.uvStabilizerWeightGrams.toFixed(1)} g ({materials.uvStabilizerWeightKg.toFixed(3)} kg) = <strong className="text-white">₹{materials.uvCostInr}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={400}
                    max={6000}
                    step={50}
                    value={Math.min(6000, Math.max(400, uvRate))}
                    onChange={(e) =>
                      applyConfigUpdate({ ...config, customUvRateInrPerKg: Number(e.target.value) })
                    }
                    className="flex-1 accent-yellow-500 cursor-pointer"
                  />
                  <div className="relative w-24">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">₹</span>
                    <EditableNumberInput
                      value={uvRate}
                      min={0}
                      max={50000}
                      step={50}
                      onChange={(val) =>
                        applyConfigUpdate({ ...config, customUvRateInrPerKg: val })
                      }
                      className="w-full bg-slate-900 border border-slate-700 focus:border-yellow-500 rounded-lg pl-5 pr-2 py-1.5 text-right font-mono text-xs font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 font-mono">Tinuvin UVA/HALS (Default: ₹1800/kg)</p>
              </div>

              {/* 10. FRP Sheet Installation Labor Rate (₹/kg - Thickness Tiered) */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-rose-500/30 space-y-2.5 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-rose-300 flex items-center gap-1">
                    <Factory className="w-3 h-3 text-rose-400" />
                    FRP Sheet Installation Labor (₹/kg)
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {materials.totalSheetWeightKg.toFixed(2)} kg = <strong className="text-white">₹{materials.laborEnergyCostInr}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={150}
                    step={1}
                    value={Math.min(150, Math.max(0, laborRate))}
                    onChange={(e) => handleActiveLaborRateChange(Number(e.target.value))}
                    className="flex-1 accent-rose-500 cursor-pointer"
                  />
                  <div className="relative w-24">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">₹</span>
                    <EditableNumberInput
                      value={laborRate}
                      min={0}
                      max={10000}
                      step={1}
                      onChange={handleActiveLaborRateChange}
                      className="w-full bg-slate-900 border border-slate-700 focus:border-rose-500 rounded-lg pl-5 pr-2 py-1.5 text-right font-mono text-xs font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Thickness-Based Labor Rate Tiers (Up to 1 mm: ₹30/kg | 1.1 to 1.5 mm: ₹23/kg | 1.5 mm & above: ₹17/kg) */}
                <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-800 space-y-1.5 text-[10px] font-mono">
                  <div className="flex items-center justify-between text-[9px] text-slate-400 border-b border-slate-800 pb-1">
                    <span>Sheet Gauge: <strong className="text-rose-300">{config.thicknessMm} mm</strong></span>
                    <span className="text-emerald-300 font-bold">{materials.activeLaborTierLabel}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      {
                        id: 'up_to_1mm' as const,
                        label: 'Up to 1 mm',
                        rate: materials.activeLaborRateUpTo1mmInrPerKg,
                        field: 'customLaborRateUpTo1mmInrPerKg' as const,
                      },
                      {
                        id: '1_1_to_1_5mm' as const,
                        label: '1.1–1.5 mm',
                        rate: materials.activeLaborRate1_1To1_5mmInrPerKg,
                        field: 'customLaborRate1_1To1_5mmInrPerKg' as const,
                      },
                      {
                        id: '1_5mm_and_above' as const,
                        label: '1.5 mm+',
                        rate: materials.activeLaborRateAbove1_5mmInrPerKg,
                        field: 'customLaborRateAbove1_5mmInrPerKg' as const,
                      },
                    ].map((tier) => {
                      const isActive = materials.activeLaborTierId === tier.id;
                      return (
                        <div
                          key={tier.id}
                          onClick={() =>
                            applyConfigUpdate({
                              ...config,
                              customLaborRateInrPerKg: undefined,
                              laborRateTierOverride: tier.id,
                            })
                          }
                          className={`p-1.5 rounded border transition-all cursor-pointer flex flex-col gap-1 ${
                            isActive
                              ? 'bg-rose-950/70 border-rose-500 text-white shadow-sm'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <span className="text-[9px] font-bold truncate">{tier.label}</span>
                          <div className="flex items-center justify-between gap-0.5" onClick={(e) => e.stopPropagation()}>
                            <span className="text-[9px] text-rose-300">₹</span>
                            <EditableNumberInput
                              value={tier.rate}
                              min={0}
                              max={5000}
                              step={1}
                              onChange={(val) =>
                                applyConfigUpdate({
                                  ...config,
                                  customLaborRateInrPerKg: undefined,
                                  [tier.field]: val,
                                })
                              }
                              className="w-10 bg-slate-900 border border-slate-700 focus:border-rose-400 rounded px-1 py-0.2 text-right font-bold text-white text-[10px] focus:outline-none"
                            />
                            <span className="text-[8px] text-slate-500">/kg</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <p className="text-[9.5px] text-slate-400 font-mono leading-tight">
                  Up to 1 mm: ₹30/kg • 1.1 mm to 1.5 mm: ₹23/kg • 1.5 mm &amp; above: ₹17/kg
                </p>
              </div>
            </div>
          </div>

          {/* Commercial Margin & GST Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Manufacturer Profit Margin % */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-teal-300 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
                  Manufacturer Profit Margin (%)
                </span>
                <span className="text-[10px] font-mono text-teal-400">
                  +₹{materials.profitAmountInr} / sheet
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={60}
                  step={0.5}
                  value={Math.min(60, Math.max(0, profitMargin))}
                  onChange={(e) =>
                    applyConfigUpdate({ ...config, customProfitMarginPercent: Number(e.target.value) })
                  }
                  className="flex-1 accent-teal-500 cursor-pointer"
                />
                <div className="relative w-24">
                  <EditableNumberInput
                    value={profitMargin}
                    min={0}
                    max={200}
                    step={0.5}
                    onChange={(val) =>
                      applyConfigUpdate({ ...config, customProfitMarginPercent: val })
                    }
                    className="w-full bg-slate-900 border border-slate-700 focus:border-teal-500 rounded-lg pl-2 pr-6 py-1.5 text-right font-mono text-xs font-bold text-white focus:outline-none"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">%</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-mono">
                Commercial markup over raw material & manufacturing cost
              </p>
            </div>

            {/* Statutory GST Rate (%) */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-amber-400" />
                  Statutory GST Rate (% • HSN 3920)
                </span>
                <span className="text-[10px] font-mono text-amber-400">
                  Tax: ₹{materials.gstAmountInr}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="grid grid-cols-4 gap-1.5 flex-1">
                  {[0, 5, 12, 18].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => applyConfigUpdate({ ...config, customGstPercent: rate })}
                      className={`py-1.5 rounded-lg font-mono text-xs font-bold border transition-all cursor-pointer ${
                        gstPercent === rate
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
                <div className="relative w-24">
                  <EditableNumberInput
                    value={gstPercent}
                    min={0}
                    max={50}
                    step={0.5}
                    onChange={(val) =>
                      applyConfigUpdate({ ...config, customGstPercent: val })
                    }
                    className="w-full bg-slate-900 border border-slate-700 focus:border-amber-500 rounded-lg pl-2 pr-6 py-1.5 text-right font-mono text-xs font-bold text-white focus:outline-none"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">%</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-mono">
                Select a GST slab or type any custom tax percentage directly
              </p>
            </div>
          </div>

          {/* Itemized Sheet Cost Summary Bar */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="font-bold text-slate-300 uppercase">Itemized Sheet Cost Breakdown (INR)</span>
              <span>Base Cost: <strong className="text-white">₹{Math.round(materials.exFactoryCostInr - materials.profitAmountInr).toLocaleString('en-IN')}</strong></span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-[10px] font-mono">
              <div className="bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800 flex justify-between">
                <span className="text-slate-400">Resin:</span>
                <strong className="text-indigo-300">₹{materials.resinCostInr}</strong>
              </div>
              <div className="bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800 flex justify-between">
                <span className="text-slate-400">Glass:</span>
                <strong className="text-emerald-300">₹{materials.glassCostInr}</strong>
              </div>
              <div className="bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800 flex justify-between">
                <span className="text-slate-400">Poly Mesh:</span>
                <strong className="text-teal-300">₹{materials.polymerMeshCostInr}</strong>
              </div>
              <div className="bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800 flex justify-between">
                <span className="text-slate-400">Print Cloth:</span>
                <strong className="text-pink-300">₹{materials.printedClothCostInr}</strong>
              </div>
              <div className="bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800 flex justify-between">
                <span className="text-slate-400">Filler:</span>
                <strong className="text-cyan-300">₹{materials.fillerCostInr}</strong>
              </div>
              <div className="bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800 flex justify-between">
                <span className="text-slate-400">{bottomMylarUm}µm Mylar:</span>
                <strong className="text-cyan-300">₹{materials.bottomMylarCostInr}</strong>
              </div>
              <div className="bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800 flex justify-between">
                <span className="text-slate-400">{topMylarUm}µm Mylar:</span>
                <strong className="text-amber-300">₹{materials.topMylarCostInr}</strong>
              </div>
              <div className="bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800 flex justify-between">
                <span className="text-slate-400">MEKP:</span>
                <strong className="text-amber-300">₹{materials.catalystCostInr}</strong>
              </div>
              <div className="bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800 flex justify-between">
                <span className="text-slate-400">Cobalt:</span>
                <strong className="text-purple-300">₹{materials.cobaltCostInr}</strong>
              </div>
              <div className="bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800 flex justify-between">
                <span className="text-slate-400">Pigment:</span>
                <strong className="text-pink-300">₹{materials.pigmentCostInr}</strong>
              </div>
              <div className="bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800 flex justify-between">
                <span className="text-slate-400">Styrene:</span>
                <strong className="text-sky-300">₹{materials.styreneCostInr}</strong>
              </div>
              <div className="bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800 flex justify-between">
                <span className="text-slate-400">UV Pkg:</span>
                <strong className="text-yellow-300">₹{materials.uvCostInr}</strong>
              </div>
              <div className="bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800 flex justify-between">
                <span className="text-slate-400">Labor:</span>
                <strong className="text-rose-300">₹{materials.laborEnergyCostInr}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-4 sm:px-6 py-3.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleResetRates}
            className="px-3.5 py-2 rounded-xl text-xs font-mono font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span>Reset Factory Default Rates</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 flex items-center gap-1.5 shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-slate-950" />
            <span>Apply & Save Rates</span>
          </button>
        </div>
      </div>
    </div>
  );
};
