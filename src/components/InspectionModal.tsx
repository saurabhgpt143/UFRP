import React from 'react';
import confetti from 'canvas-confetti';
import { FRPConfig, MaterialCalculations, TableSpec, StepNumber } from '../types';
import { SheetCrossProfile } from './SheetCrossProfile';
import { Product3DRenderer } from './Product3DRenderer';
import { STEP_ALTERNATIVE_OPTIONS, STEP_COST_STRATEGIES } from '../data/processOptions';
import {
  X,
  Award,
  CheckCircle2,
  Printer,
  FileCheck,
  ShieldCheck,
  Sparkles,
  Layers,
  Boxes,
  Ruler,
  BarChart3,
  Box,
  Settings2,
  TrendingDown,
  IndianRupee,
  Share2,
  Clock,
  Sun,
  Shield,
  Activity
} from 'lucide-react';

interface InspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: FRPConfig;
  tableSpec: TableSpec;
  materials: MaterialCalculations;
  onOpenShare?: () => void;
  onOpenRateModal?: () => void;
}

export const InspectionModal: React.FC<InspectionModalProps> = ({
  isOpen,
  onClose,
  config,
  tableSpec,
  materials,
  onOpenShare,
  onOpenRateModal,
}) => {
  if (!isOpen) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handlePrint = () => {
    triggerConfetti();
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 font-sans overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl text-white my-4 sm:my-8 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-slate-950 px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                Quality Inspection Certificate
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-400 font-mono">
                IS 12866:2020 / BIS Compliant • ASTM D3841 / ISO 9001
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Certificate Body */}
        <div className="p-3 sm:p-6 overflow-y-auto flex flex-col gap-4 sm:gap-6 text-xs text-slate-300">
          {/* Certificate Banner */}
          <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-blue-950/60 p-3 sm:p-4 rounded-xl border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                  Status: Quality Inspection Passed
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-white mt-0.5">
                  FRP Composite Panel #FRP-{Math.floor(100000 + Math.random() * 900000)}
                </h3>
              </div>
            </div>
            <div className="text-left sm:text-right text-[10px] text-slate-400 font-mono">
              <div>Date: <strong className="text-white">{new Date().toLocaleDateString()}</strong></div>
            </div>
          </div>

          {/* Section 0: Final 3D Rendering of the Product */}
          <div className="bg-slate-950 p-3 sm:p-4 rounded-xl border border-slate-800 flex flex-col gap-2.5 sm:gap-3">
            <h4 className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Final 3D Product Rendering
            </h4>
            <Product3DRenderer config={config} height="h-64 sm:h-80" />
          </div>

          {/* Section 1: Modular Table Bed & Dimensions */}
          <div className="bg-slate-950 p-3 sm:p-4 rounded-xl border border-slate-800 flex flex-col gap-2.5 sm:gap-3">
            <h4 className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <Boxes className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 1. Manufacturing Table Bed Setup
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-slate-300">
              <div className="bg-slate-900 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-mono block">Table Units</span>
                <strong className="text-xs sm:text-sm text-white font-mono">{tableSpec.tableCount} Modules</strong>
              </div>
              <div className="bg-slate-900 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-mono block">Module Spec</span>
                <strong className="text-xs sm:text-sm text-white font-mono">1800W × 1200L × 900H mm</strong>
              </div>
              <div className="bg-slate-900 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-mono block">Total Bed Length</span>
                <strong className="text-xs sm:text-sm text-blue-300 font-mono">{tableSpec.totalBedLengthMm} mm</strong>
              </div>
              <div className="bg-slate-900 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-mono block">Table Levelness</span>
                <strong className="text-xs sm:text-sm text-emerald-300 font-mono">0.2 mm / meter</strong>
              </div>
            </div>
          </div>

          {/* Section 2: FRP Sheet Dimensions & Material Breakdown */}
          <div className="bg-slate-950 p-3 sm:p-4 rounded-xl border border-slate-800 flex flex-col gap-2.5 sm:gap-3">
            <h4 className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 2. Sheet Specifications & Material Yield
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
              <div className="bg-slate-900 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-mono block">Finished Dimensions</span>
                <strong className="text-[11px] sm:text-xs text-white font-mono">
                  {config.lengthMm} L × {config.widthMm} W mm ({config.thicknessMm}mm)
                </strong>
              </div>
              <div className="bg-slate-900 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-mono block">Length End Trim Margin</span>
                <strong className="text-[11px] sm:text-xs text-emerald-300 font-mono">
                  +{materials.lengthMarginMm} mm / end (Raw L: {materials.rawLengthMm} mm)
                </strong>
              </div>
              <div className="bg-slate-900 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-mono block">Profile Stretch & Side Margin</span>
                <strong className="text-[11px] sm:text-xs text-amber-300 font-mono">
                  {materials.profileStretchFactor.toFixed(2)}x (+{materials.edgeMarginMm}mm side margin)
                </strong>
              </div>
              <div className="bg-slate-900 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-mono block">Determined Raw Mold Bounds</span>
                <strong className="text-[11px] sm:text-xs text-cyan-300 font-mono">
                  {materials.rawLengthMm} L × {materials.flatWidthMm} W mm
                </strong>
              </div>
              <div className="bg-slate-900 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-mono block">Mylar Carrier Film Roll</span>
                <strong className="text-[11px] sm:text-xs text-blue-300 font-mono">
                  {config.mylarWidthMm}mm Roll ({config.mylarThicknessUm}µm)
                </strong>
              </div>
              <div className="bg-slate-900 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-mono block">Polymer Resin Chemistry</span>
                <strong className="text-[11px] sm:text-xs text-indigo-300 font-mono">
                  {materials.resinTypeSpec.name} (₹{materials.resinTypeSpec.costPerKgInr}/kg)
                </strong>
              </div>
              <div className="bg-slate-900 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-mono block">Resin Mass & Volume</span>
                <strong className="text-[11px] sm:text-xs text-blue-300 font-mono">
                  {materials.totalResinWeightKg.toFixed(2)} kg ({materials.resinVolumeLiters.toFixed(2)} L)
                </strong>
              </div>
              <div className="bg-slate-900 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-mono block">Glass Fiber</span>
                <strong className="text-[11px] sm:text-xs text-emerald-300 font-mono">
                  {materials.totalGlassWeightKg.toFixed(2)} kg ({materials.glassWeightGsm} gsm)
                </strong>
              </div>
              <div className="bg-slate-900 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-mono block">MEKP Catalyst ({config.catalystPercent}%)</span>
                <strong className="text-[11px] sm:text-xs text-amber-300 font-mono">
                  {materials.catalystVolumeMl.toFixed(0)} mL
                </strong>
              </div>
              <div className="bg-slate-900 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-mono block">Cobalt Octoate 6% ({materials.cobaltPercent}%)</span>
                <strong className="text-[11px] sm:text-xs text-purple-300 font-mono">
                  {materials.cobaltVolumeMl.toFixed(1)} mL ({materials.cobaltWeightGrams.toFixed(1)} g)
                </strong>
              </div>
              <div className="bg-slate-900 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-mono block">Ambient Temp & Gel Time</span>
                <strong className="text-[11px] sm:text-xs text-purple-300 font-mono">
                  {materials.ambientTempC}°C (~{materials.estimatedGelTimeMin} min gel)
                </strong>
              </div>
              <div className="bg-slate-900 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-mono block">Mineral Filler ({materials.fillerPercent}% PHR)</span>
                <strong className="text-[11px] sm:text-xs text-emerald-300 font-mono">
                  {materials.fillerWeightKg > 0 ? `${materials.fillerWeightKg.toFixed(2)} kg (${materials.fillerType.replace('_', ' ')})` : '0 kg (Unfilled)'}
                </strong>
              </div>
              <div className="bg-slate-900 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-mono block">Pigment Paste ({materials.pigmentPercent}%)</span>
                <strong className="text-[11px] sm:text-xs text-cyan-300 font-mono">
                  {materials.pigmentWeightGrams < 1000
                    ? `${materials.pigmentWeightGrams.toFixed(1)} g`
                    : `${materials.pigmentWeightKg.toFixed(3)} kg`}
                </strong>
              </div>
              <div className="bg-slate-900 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-mono block">Total Mass</span>
                <strong className="text-[11px] sm:text-xs text-amber-300 font-mono">
                  {materials.totalSheetWeightKg.toFixed(2)} kg ({materials.densityGcm3} g/cm³)
                </strong>
              </div>
            </div>
          </div>

          {/* Section 2B: Cross Profile Engineering Diagram */}
          <SheetCrossProfile
            config={config}
            onChangeProfile={() => {}}
            compact={false}
          />

          {/* Section 3: Mechanical Testing & BIS Compliance */}
          <div className="bg-slate-950 p-3 sm:p-4 rounded-xl border border-slate-800 flex flex-col gap-2.5 sm:gap-3">
            <h4 className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 3. Mechanical Test Metrics & BIS Standards Compliance
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              <div className="bg-slate-900 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-mono block">Flex Modulus</span>
                <strong className="text-xs sm:text-sm text-teal-300 font-mono">{materials.flexuralStiffnessGpa} GPa</strong>
              </div>
              <div className="bg-slate-900 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-mono block">Light Pass</span>
                <strong className="text-xs sm:text-sm text-cyan-300 font-mono">{materials.lightTransmittancePercent}% Pass</strong>
              </div>
              <div className="bg-slate-900 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-mono block">Barcol Hardness</span>
                <strong className="text-xs sm:text-sm text-amber-300 font-mono">48 GY</strong>
              </div>
              <div className="bg-slate-900 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase font-mono block">Peak Exotherm</span>
                <strong className="text-xs sm:text-sm text-rose-300 font-mono">{materials.peakExothermTempC} °C</strong>
              </div>
            </div>

            {/* BIS Standards Codes Grid */}
            <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 text-[10px] font-mono space-y-1.5">
              <span className="text-emerald-400 font-bold block flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-emerald-400" /> Bureau of Indian Standards (BIS) Statutory Verification:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-slate-300">
                {materials.bisStandards.map((std, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{std}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3.5: Projected Product Lifespan & Chemical Durability Matrix */}
          <div className="bg-slate-950 p-3 sm:p-4 rounded-xl border border-amber-500/30 flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                    Product Field Lifespan & Chemical Durability Projection
                  </h4>
                  <p className="text-[10px] text-slate-400 font-sans">
                    Calibrated field service forecast based on polymer chemistry & UV surface shield
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="bg-amber-950/80 border border-amber-500/40 px-2.5 py-1 rounded-xl text-center">
                  <span className="text-[9px] uppercase font-mono text-amber-400 block">Projected Field Life</span>
                  <strong className="text-xs sm:text-sm font-extrabold text-white font-mono">{materials.lifespanProjection.expectedLifespanYears} Years</strong>
                </div>
                <div className="bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1 rounded-xl text-center">
                  <span className="text-[9px] uppercase font-mono text-emerald-400 block">Performance Warranty</span>
                  <strong className="text-xs sm:text-sm font-extrabold text-white font-mono">{materials.lifespanProjection.warrantyPeriodYears} Years</strong>
                </div>
              </div>
            </div>

            {/* Lifespan Factor Contributors Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="bg-slate-900 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase block">Resin Matrix Baseline</span>
                <strong className="text-amber-300 text-xs sm:text-sm">{materials.lifespanProjection.baseResinLifespanYears} Years</strong>
                <span className="text-[9px] text-slate-400 font-sans block truncate" title={materials.resinTypeSpec.name}>{materials.resinTypeSpec.name}</span>
              </div>

              <div className="bg-slate-900 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase block">UV Weather Barrier</span>
                <strong className="text-emerald-300 text-xs sm:text-sm">+{materials.lifespanProjection.uvProtectionBonusYears} Years</strong>
                <span className="text-[9px] text-slate-400 font-sans block truncate" title={materials.lifespanProjection.uvProtectionType}>{materials.lifespanProjection.uvProtectionType}</span>
              </div>

              <div className="bg-slate-900 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase block">Thickness Gauge Mass</span>
                <strong className="text-cyan-300 text-xs sm:text-sm">
                  {materials.lifespanProjection.thicknessBonusYears >= 0 ? `+${materials.lifespanProjection.thicknessBonusYears}` : materials.lifespanProjection.thicknessBonusYears} Years
                </strong>
                <span className="text-[9px] text-slate-400 font-sans block">{config.thicknessMm}mm Sheet Gauge</span>
              </div>

              <div className="bg-slate-900 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase block">Fiber Reinforcement</span>
                <strong className="text-blue-300 text-xs sm:text-sm">+{materials.lifespanProjection.fiberReinforcementBonusYears} Years</strong>
                <span className="text-[9px] text-slate-400 font-sans block truncate" title={materials.glassFiberSpec.name}>{materials.glassFiberSpec.name}</span>
              </div>
            </div>

            {/* Chemical & Degradation Specifications Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-blue-300 font-bold uppercase">
                  <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" /> UV Exposure & Sunlight Resistance
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  <strong>Classification:</strong> {materials.lifespanProjection.uvDegradationResistance}
                </p>
                <p className="text-slate-400 text-[10px]">
                  <strong>Surface Protection:</strong> {materials.lifespanProjection.uvProtectionType} prevents yellowing, surface micro-cracking, and resin-fiber debonding under intense tropical solar irradiance.
                </p>
              </div>

              <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-indigo-300 font-bold uppercase">
                  <Shield className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> Chemical & Corrosion Durability
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  <strong>Chemical Rating:</strong> {materials.lifespanProjection.chemicalResistanceRating}
                </p>
                <p className="text-slate-400 text-[10px]">
                  <strong>Heat Deflection Temp (HDT):</strong> {materials.resinTypeSpec.hdtC}°C. Matrix resists chemical degradation, acid rainfall, and marine moisture ingress.
                </p>
              </div>
            </div>

            {/* Graphical Degradation Projection Curve over 30 Years */}
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex flex-col gap-2.5">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="text-[11px] font-mono font-bold uppercase text-slate-200 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" /> Projected Performance Retention & Aging Trajectory (0 – 30 Years)
                </span>
                <div className="flex items-center gap-3 text-[10px] font-mono">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block"></span> Structural Strength
                  </span>
                  <span className="flex items-center gap-1 text-amber-400">
                    <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 inline-block"></span> UV Shield Retention
                  </span>
                </div>
              </div>

              {/* Bar Chart Projection Grid */}
              <div className="grid grid-cols-7 gap-1.5 pt-2">
                {materials.lifespanProjection.degradationGraphData.map((pt) => {
                  const isEnd = pt.year > materials.lifespanProjection.expectedLifespanYears;
                  return (
                    <div key={pt.year} className="flex flex-col items-center gap-1.5 text-[10px] font-mono">
                      {/* Visual Dual Bars Container */}
                      <div className="w-full h-24 bg-slate-950 rounded-lg p-1 border border-slate-800 flex items-end justify-center gap-1 relative overflow-hidden group">
                        {/* Structural Bar */}
                        <div
                          style={{ height: `${pt.structuralIntegrityPercent}%` }}
                          className={`w-1/2 rounded-t transition-all duration-500 ${
                            pt.structuralIntegrityPercent >= 80
                              ? 'bg-gradient-to-t from-emerald-600 to-emerald-400'
                              : pt.structuralIntegrityPercent >= 60
                              ? 'bg-gradient-to-t from-teal-600 to-teal-400'
                              : 'bg-gradient-to-t from-amber-600 to-amber-400'
                          }`}
                          title={`Year ${pt.year}: ${pt.structuralIntegrityPercent}% Structural Strength`}
                        />
                        {/* UV Protection Bar */}
                        <div
                          style={{ height: `${pt.uvResistancePercent}%` }}
                          className={`w-1/2 rounded-t transition-all duration-500 ${
                            pt.uvResistancePercent >= 70
                              ? 'bg-gradient-to-t from-amber-600 to-amber-400'
                              : 'bg-gradient-to-t from-rose-600 to-rose-400'
                          }`}
                          title={`Year ${pt.year}: ${pt.uvResistancePercent}% UV Retention`}
                        />
                      </div>

                      {/* Labels */}
                      <span className={`font-bold text-[10px] ${isEnd ? 'text-slate-500' : 'text-white'}`}>
                        Yr {pt.year}
                      </span>
                      <div className="text-[9px] text-slate-400 text-center leading-tight">
                        <span className="text-emerald-300 font-bold block">{pt.structuralIntegrityPercent}%</span>
                        <span className="text-amber-300 block">{pt.uvResistancePercent}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-slate-950 p-2 rounded border border-slate-800 text-[10px] text-slate-300 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span><strong>Maintenance Protocol:</strong> {materials.lifespanProjection.maintenanceRecommendation}</span>
              </div>
            </div>
          </div>

          {/* Section 3B: Indian Market Commercial Rates & GST Breakdown */}
          <div className="bg-slate-950 p-3 sm:p-4 rounded-xl border border-slate-800 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" /> Commercial Valuation & GST Breakdown
              </h4>
              {onOpenRateModal && (
                <button
                  onClick={onOpenRateModal}
                  className="px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 font-mono text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <IndianRupee className="w-3 h-3 text-teal-400" />
                  <span>Adjust Rates</span>
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs font-mono">
              <div className="bg-slate-900 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase block">Ex-Factory Price</span>
                <strong className="text-white text-xs sm:text-sm">₹{Math.round(materials.estimatedCostInr).toLocaleString('en-IN')}</strong>
              </div>
              <div className="bg-slate-900 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase block">Rate / Sq. Feet</span>
                <strong className="text-emerald-300 text-xs sm:text-sm">₹{materials.pricePerSqFtInr}/sq.ft</strong>
              </div>
              <div className="bg-slate-900 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase block">Rate / Sq. Meter</span>
                <strong className="text-cyan-300 text-xs sm:text-sm">₹{materials.pricePerM2Inr}/m²</strong>
              </div>
              <div className="bg-slate-900 p-2 sm:p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase block">Rate / Kg Mass</span>
                <strong className="text-blue-300 text-xs sm:text-sm">₹{materials.pricePerKgInr}/kg</strong>
              </div>
            </div>

            <div className="bg-amber-950/30 border border-amber-500/30 p-2.5 rounded-lg flex items-center justify-between text-xs text-amber-200">
              <div className="flex items-center gap-2 font-mono">
                <span>18% GST (HSN 3920): <strong>₹{materials.gstAmountInr.toLocaleString('en-IN')} INR</strong></span>
              </div>
              <div className="font-bold font-mono text-amber-300 text-sm">
                Total Tax Incl: ₹{materials.totalCostWithGstInr.toLocaleString('en-IN')} INR
              </div>
            </div>
          </div>

          {/* Section 4: Process & Equipment Configuration Sequence */}
          <div className="bg-slate-950 p-3 sm:p-4 rounded-xl border border-slate-800 flex flex-col gap-2.5">
            <h4 className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Settings2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" /> 4. Applied Process Methods & Line Setup
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {([1, 2, 3, 4, 5, 6] as StepNumber[]).map((stepNum) => {
                const key = `step${stepNum}Method` as keyof FRPConfig;
                const methodVal = (config[key] as string) || '';
                const options = STEP_ALTERNATIVE_OPTIONS[stepNum] || [];
                const activeOpt = options.find((o) => o.id === methodVal) || options[0];

                return (
                  <div key={stepNum} className="bg-slate-900/90 p-2 rounded-lg border border-slate-800 flex items-start gap-2">
                    <span className="text-[10px] font-mono font-bold text-indigo-300 bg-indigo-950 px-1.5 py-0.5 rounded border border-indigo-500/30 shrink-0">
                      Step {stepNum}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <strong className="text-white text-[11px] truncate">{activeOpt.name}</strong>
                        <span
                          className={`text-[9px] font-mono font-bold px-1 rounded shrink-0 ${
                            activeOpt.typeBadge === 'Standard Default'
                              ? 'bg-blue-950 text-blue-300'
                              : 'bg-purple-950 text-purple-300'
                          }`}
                        >
                          {activeOpt.typeBadge}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{activeOpt.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 5: Value Engineering & Stage Cost Reduction Matrix */}
          <div className="bg-slate-950 p-3 sm:p-4 rounded-xl border border-slate-800 flex flex-col gap-2.5">
            <h4 className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" /> 5. Stage-by-Stage Cost Reduction Matrix
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {([1, 2, 3, 4, 5, 6] as StepNumber[]).map((stepNum) => {
                const strats = STEP_COST_STRATEGIES[stepNum] || [];
                const topStrat = strats[0];
                if (!topStrat) return null;

                return (
                  <div key={stepNum} className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/30">
                        Stage {stepNum} Value Engineering
                      </span>
                      <span className="text-[10px] font-mono font-extrabold text-emerald-300 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                        <IndianRupee className="w-3 h-3 text-emerald-400" />
                        Saves {topStrat.savingsPercent}
                      </span>
                    </div>
                    <strong className="text-white text-xs mt-0.5">{topStrat.title}</strong>
                    <p className="text-[10px] text-slate-300 leading-relaxed">{topStrat.action}</p>
                    <span className="text-[10px] font-mono text-cyan-300 mt-0.5">
                      <strong>Impact:</strong> {topStrat.financialImpact}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quality Audit Checklist */}
          <div className="bg-slate-950 p-3 sm:p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
            <h4 className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Quality Audit Checklist
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Zero void air traps & bubble de-aerating confirmed</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Uniform thickness tolerance within ±0.08mm</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Mylar film release and surface gloss detached cleanly</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>100% polymer cross-linking exotherm complete</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-slate-950 px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          <div className="text-[11px] text-slate-400 font-mono text-center sm:text-left">
            Est. Cost: <strong className="text-white">₹{Math.round(materials.estimatedCostInr).toLocaleString('en-IN')} INR</strong>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors text-center"
            >
              Close
            </button>

            {onOpenShare && (
              <button
                onClick={() => {
                  onClose();
                  onOpenShare();
                }}
                className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 flex items-center justify-center gap-1.5 shadow-lg shadow-amber-400/20 transition-all"
              >
                <Share2 className="w-4 h-4 text-slate-950" /> Share Spec
              </button>
            )}

            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
