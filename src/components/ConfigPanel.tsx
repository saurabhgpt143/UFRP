import React, { useState } from 'react';
import { SheetCrossProfile, ProfileSpecs } from './SheetCrossProfile';
import { StepAlternativeSelector } from './StepAlternativeSelector';
import { calculateMaterials, RESIN_SPECS, GLASS_FIBER_SPECS } from '../utils/frpCalculations';
import {
  FRPConfig,
  MaterialCalculations,
  StepNumber,
  TableSpec,
  ProfileType,
  ResinColor,
  ResinType,
  GlassFiberType,
  MylarThickness
} from '../types';
import {
  Sliders,
  AlertTriangle,
  Play,
  Pause,
  FastForward,
  Eye,
  CheckCircle,
  CheckCircle2,
  HelpCircle,
  Layers,
  Sparkles,
  Flame,
  ArrowRight,
  Pipette,
  Scroll,
  Scissors,
  FlaskConical,
  Settings2,
  Thermometer,
  Clock,
  Atom,
  Printer,
  IndianRupee
} from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

interface ConfigPanelProps {
  config: FRPConfig;
  onChangeConfig: (newConfig: FRPConfig) => void;
  tableSpec: TableSpec;
  materials: MaterialCalculations;
  currentStep: StepNumber;
  unrollProgress: number;
  onStartUnroll: () => void;
  curingProgress: number;
  isHeating: boolean;
  onToggleHeating: () => void;
  onFastForwardCuring: () => void;
  speedMultiplier: number;
  onChangeSpeed: (speed: number) => void;
  backlightMode: boolean;
  onToggleBacklight: () => void;
  flexAmount: number;
  onChangeFlex: (amount: number) => void;
  onSelectStep?: (step: StepNumber) => void;
  onDemoldAndLift: () => void;
  onOpenReportModal: () => void;
  onOpenMechanism?: () => void;
  onOpenTimingModal?: () => void;
  onOpenThermalPrint?: () => void;
  onOpenRateModal?: () => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  config,
  onChangeConfig,
  tableSpec,
  materials,
  currentStep,
  unrollProgress,
  onStartUnroll,
  curingProgress,
  isHeating,
  onToggleHeating,
  onFastForwardCuring,
  speedMultiplier,
  onChangeSpeed,
  backlightMode,
  onToggleBacklight,
  flexAmount,
  onChangeFlex,
  onSelectStep,
  onDemoldAndLift,
  onOpenReportModal,
  onOpenMechanism,
  onOpenTimingModal,
  onOpenThermalPrint,
  onOpenRateModal,
}) => {
  const [step3SubTab, setStep3SubTab] = useState<'resin_mix' | 'fibermat' | 'top_resin'>('resin_mix');
  const [step4SubTab, setStep4SubTab] = useState<'upper_mylar' | 'sheet_transfer' | 'upper_die' | 'die_weights'>('upper_mylar');
  const [beakerReactionStage, setBeakerReactionStage] = useState<'mixing' | 'initiated' | 'gelling' | 'exotherm' | 'cured'>('mixing');
  const [step6SubTab, setStep6SubTab] = useState<'weight_removal' | 'upper_die_removal' | 'top_mylar_peeling' | 'sheet_elevation' | 'lower_mylar_detachment' | 'margin_trimming'>('weight_removal');

  const updateField = <K extends keyof FRPConfig>(key: K, value: FRPConfig[K]) => {
    soundFx.playClick();
    const newConfig = {
      ...config,
      [key]: value,
    };

    // When changing fiberglass type, automatically adjust resin-to-glass ratio to match the recommended standard for that specific fiberglass
    if (key === 'fiberType') {
      const fiberSpec = GLASS_FIBER_SPECS[value as GlassFiberType];
      if (fiberSpec) {
        newConfig.resinToGlassRatio = fiberSpec.recommendedResinRatio;
      }
    }

    // When selecting cross-profile, automatically retrieve the profile's standard final sheet width
    if (key === 'profile') {
      const spec = ProfileSpecs.PROFILES[value as ProfileType];
      if (spec && spec.totalWidthMm) {
        newConfig.widthMm = spec.totalWidthMm;
      }
    }

    // Calculate required flat width if width, profile, or edge margin changed
    if (key === 'widthMm' || key === 'profile' || key === 'edgeMarginMm') {
      const tempMaterials = calculateMaterials(newConfig);
      if (newConfig.mylarWidthMm < tempMaterials.flatWidthMm) {
        newConfig.mylarWidthMm = tempMaterials.flatWidthMm;
      }
    }

    onChangeConfig(newConfig);
  };

  const isMylarTooNarrow = config.mylarWidthMm < materials.flatWidthMm;

  return (
    <div className="w-full bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 p-3 sm:p-4 flex flex-col gap-3.5 sm:gap-4 h-auto lg:h-full lg:overflow-y-auto font-sans text-white">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-400" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Step {currentStep} Parameters
          </h2>
        </div>
        <span className="text-[10px] font-mono text-slate-400">Real-time Controls</span>
      </div>

      {/* STEP 1: Table Modular Sizing */}
      {currentStep === 1 && (
        <div className="flex flex-col gap-4">
          <div className="bg-blue-950/40 border border-blue-800/50 p-3 rounded-xl text-xs text-blue-200 leading-relaxed">
            <span className="font-bold text-blue-300 block mb-1">Modular Bed Sizing Logic</span>
            Standard table modules are <strong className="text-white">1800W × 1200L × 900H mm</strong>. The simulator connects table units end-to-end based on your sheet length.
          </div>

          {/* Sheet Length Input & Slider */}
          <div className="flex flex-col gap-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="sheet-length-input" className="text-slate-300 font-semibold flex items-center gap-1.5">
                <span>Sheet Target Length</span>
                <span className="text-[10px] text-slate-500 font-mono">(mm)</span>
              </label>
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                <input
                  id="sheet-length-input"
                  type="number"
                  min="500"
                  max="20000"
                  step="100"
                  value={config.lengthMm}
                  onChange={(e) => updateField('lengthMm', Math.max(100, Number(e.target.value)))}
                  className="w-20 bg-transparent text-right font-mono font-bold text-blue-400 focus:outline-none text-xs"
                />
                <span className="text-slate-400 font-mono text-xs">mm</span>
              </div>
            </div>

            <input
              type="range"
              min="1800"
              max="10800"
              step="300"
              value={config.lengthMm}
              onChange={(e) => updateField('lengthMm', Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>1800mm ({Math.ceil(1800/1200)} Units)</span>
              <span>5400mm ({Math.ceil(5400/1200)})</span>
              <span>10800mm ({Math.ceil(10800/1200)})</span>
            </div>
          </div>

          {/* Calculated Tables Callout */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-medium text-slate-400">Modular Table Bed Units (1800W × 900H mm)</div>
                <div className="text-sm font-bold text-white mt-0.5">
                  {tableSpec.tableCount} Unit{tableSpec.tableCount > 1 ? 's' : ''} ({tableSpec.totalBedLengthMm}mm Total Bed Length)
                </div>
              </div>
              <div className="w-9 h-9 rounded-lg bg-blue-500/20 text-blue-400 font-mono font-bold flex items-center justify-center border border-blue-500/30">
                {tableSpec.tableCount}
              </div>
            </div>
            <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-xs">
              <span className="text-slate-400">Adjacent Table Arranged Aside:</span>
              <strong className="text-emerald-400 font-mono">1 Identical Table Line for Die Staging</strong>
            </div>
          </div>

          {/* Ultimate Sheet Width & Edge Margin Controls */}
          <div className="flex flex-col gap-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            {/* Ultimate Finished Sheet Width */}
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="sheet-width-input" className="text-slate-200 font-bold flex items-center gap-1.5">
                <span>Ultimate Finished Sheet Width</span>
                <span className="text-[10px] text-slate-500 font-mono">(mm)</span>
              </label>
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                <input
                  id="sheet-width-input"
                  type="number"
                  min="100"
                  max="3000"
                  step="10"
                  value={config.widthMm}
                  onChange={(e) => updateField('widthMm', Math.max(50, Number(e.target.value)))}
                  className="w-20 bg-transparent text-right font-mono font-bold text-blue-400 focus:outline-none text-xs"
                />
                <span className="text-slate-400 font-mono text-xs">mm</span>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {[900, 1000, 1070, 1188, 1200, 1300, 1500].map((w) => (
                <button
                  key={w}
                  onClick={() => updateField('widthMm', w)}
                  className={`py-1 rounded-lg text-xs font-mono font-semibold border transition-all ${
                    config.widthMm === w
                      ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {w}mm
                </button>
              ))}
            </div>

            {/* Side Edge Trimming Margin */}
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-900">
              <label htmlFor="edge-margin-input" className="text-slate-300 font-medium flex items-center gap-1">
                <span>Side Edge Trimming Margin</span>
                <span className="text-[10px] text-slate-500 font-mono">(mm)</span>
              </label>
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 focus-within:border-amber-500 focus-within:ring-1 focus-within:ring-amber-500">
                <input
                  id="edge-margin-input"
                  type="number"
                  min="0"
                  max="200"
                  step="5"
                  value={config.edgeMarginMm ?? 50}
                  onChange={(e) => updateField('edgeMarginMm', Math.max(0, Number(e.target.value)))}
                  className="w-16 bg-transparent text-right font-mono font-bold text-amber-400 focus:outline-none text-xs"
                />
                <span className="text-slate-400 font-mono text-xs">mm</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {[30, 50, 75, 100].map((m) => (
                <button
                  key={m}
                  onClick={() => updateField('edgeMarginMm', m)}
                  className={`py-1 rounded-lg text-[11px] font-mono border transition-all ${
                    (config.edgeMarginMm ?? 50) === m
                      ? 'bg-amber-600/30 border-amber-400 text-amber-200 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  +{m}mm
                </button>
              ))}
            </div>

            {/* Length Margin (End Trim Allowance) */}
            <div className="flex items-center justify-between text-xs pt-2.5 border-t border-slate-900">
              <label htmlFor="length-margin-input" className="text-slate-300 font-medium flex items-center gap-1">
                <span>Length End Trim Margin (per end)</span>
                <span className="text-[10px] text-slate-500 font-mono">(mm)</span>
              </label>
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">
                <input
                  id="length-margin-input"
                  type="number"
                  min="0"
                  max="200"
                  step="5"
                  value={config.lengthMarginMm ?? 50}
                  onChange={(e) => updateField('lengthMarginMm', Math.max(0, Number(e.target.value)))}
                  className="w-16 bg-transparent text-right font-mono font-bold text-emerald-400 focus:outline-none text-xs"
                />
                <span className="text-slate-400 font-mono text-xs">mm</span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-1">
              {[20, 30, 50, 75, 100].map((lm) => (
                <button
                  key={lm}
                  onClick={() => updateField('lengthMarginMm', lm)}
                  className={`py-1 rounded-lg text-[11px] font-mono border transition-all ${
                    (config.lengthMarginMm ?? 50) === lm
                      ? 'bg-emerald-600/30 border-emerald-400 text-emerald-200 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  +{lm}mm
                </button>
              ))}
            </div>

            {/* Determined Raw Bounding Dimensions Callout */}
            <div className="mt-1 bg-blue-950/40 border border-blue-500/30 p-2.5 rounded-lg flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-blue-300 font-semibold uppercase tracking-wider">
                  Raw Pre-Trimmed Mold Sheet Dimensions:
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-300 bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
                <span>{materials.rawLengthMm} mm Length</span>
                <span className="text-slate-500">×</span>
                <span>{materials.flatWidthMm} mm Flat Width</span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 leading-tight">
                Formula: Finished ({config.lengthMm}L × {config.widthMm}W mm) + Length Margins (+{2 * (config.lengthMarginMm ?? 50)}mm) + Side Margin (+{materials.edgeMarginMm}mm) × Profile Stretch ({materials.profileStretchFactor.toFixed(2)}×)
              </p>
            </div>
          </div>

          {/* Sheet Thickness Input & Preset Options */}
          <div className="flex flex-col gap-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="sheet-thickness-input" className="text-slate-300 font-semibold flex items-center gap-1.5">
                <span>Sheet Thickness</span>
                <span className="text-[10px] text-slate-500 font-mono">(mm)</span>
              </label>
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1">
                <input
                  id="sheet-thickness-input"
                  type="number"
                  min="0.5"
                  max="25"
                  step="0.1"
                  value={config.thicknessMm}
                  onChange={(e) => updateField('thicknessMm', Math.max(0.1, Number(e.target.value)))}
                  className="w-16 bg-transparent text-right font-mono font-bold text-blue-400 focus:outline-none text-xs"
                />
                <span className="text-slate-400 font-mono text-xs">mm</span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-1.5 mt-1">
              {[1.2, 1.5, 2.0, 3.0, 5.0].map((t) => (
                <button
                  key={t}
                  onClick={() => updateField('thicknessMm', t)}
                  className={`py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
                    config.thicknessMm === t
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {t}mm
                </button>
              ))}
            </div>
          </div>

          {/* Profile Selector */}
          <SheetCrossProfile
            config={config}
            onChangeProfile={(profile) => updateField('profile', profile)}
            compact={true}
          />

          {/* Resin Color & Translucency Base Preset Selector */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <span>Resin Pigment & Translucency Base Preset:</span>
              </label>
              <button
                onClick={() => {
                  updateField('color', 'custom');
                  if (!config.customHex) updateField('customHex', '#8b5cf6');
                  if (config.customBaseTransmittance === undefined) updateField('customBaseTransmittance', 85);
                }}
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border transition-all ${
                  config.color === 'custom'
                    ? 'bg-purple-600/30 border-purple-400 text-purple-200'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                + Custom Preset
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'crystal_transparent', label: '100% Clear', colorBg: 'bg-cyan-100 border border-cyan-400' },
                { id: 'translucent_clear', label: 'Clear Blue', colorBg: 'bg-blue-400' },
                { id: 'sky_blue', label: 'Sky Blue', colorBg: 'bg-sky-500' },
                { id: 'opal_white', label: 'Opal White', colorBg: 'bg-slate-200 text-slate-900' },
                { id: 'emerald_green', label: 'Emerald', colorBg: 'bg-emerald-500' },
                { id: 'amber', label: 'Amber', colorBg: 'bg-amber-500' },
                { id: 'carbon_black', label: 'Opaque Black', colorBg: 'bg-slate-900 border-slate-600' },
                { id: 'custom', label: 'Custom Tint', colorBg: 'bg-purple-500', isCustom: true },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    updateField('color', c.id as ResinColor);
                    if (c.id === 'custom') {
                      if (!config.customHex) updateField('customHex', '#8b5cf6');
                      if (config.customBaseTransmittance === undefined) updateField('customBaseTransmittance', 85);
                    } else {
                      // Allow custom base transmittance or reset
                    }
                  }}
                  className={`p-2 rounded-lg text-[11px] font-medium border flex items-center gap-1.5 transition-all ${
                    config.color === c.id
                      ? 'border-blue-400 bg-slate-800 font-bold shadow-sm ring-1 ring-blue-500 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span
                    className={`w-3 h-3 rounded-full shrink-0 ${c.colorBg}`}
                    style={c.isCustom && config.customHex ? { backgroundColor: config.customHex } : undefined}
                  />
                  <span className="truncate">{c.label}</span>
                </button>
              ))}
            </div>

            {/* Base Preset Parameter Customization Box */}
            <div className="bg-slate-950/90 p-3 rounded-xl border border-slate-800 flex flex-col gap-2.5 mt-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-400" />
                  <span>Modify Translucency Base Ceiling</span>
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                  Base Limit: {config.customBaseTransmittance ?? (config.color === 'crystal_transparent' ? 95 : config.color === 'opal_white' ? 65 : config.color === 'carbon_black' ? 10 : 88)}%
                </span>
              </div>

              {/* Custom Base Transmittance Limit Slider */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Base Translucency Level (Max Pass %):</span>
                  <strong className="text-blue-300 font-bold">
                    {config.customBaseTransmittance ?? (config.color === 'crystal_transparent' ? 95 : config.color === 'opal_white' ? 65 : config.color === 'carbon_black' ? 10 : 88)}%
                  </strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={config.customBaseTransmittance ?? (config.color === 'crystal_transparent' ? 95 : config.color === 'opal_white' ? 65 : config.color === 'carbon_black' ? 10 : 88)}
                  onChange={(e) => updateField('customBaseTransmittance', Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[9px] font-mono text-slate-500">
                  <span>0% Opaque</span>
                  <span>50% Translucent</span>
                  <span>100% Full Transparency</span>
                </div>
              </div>

              {/* Custom Color Palette / Color Picker */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-900">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Custom Pigment Color Tint:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.customHex || '#38bdf8'}
                      onChange={(e) => {
                        updateField('color', 'custom');
                        updateField('customHex', e.target.value);
                      }}
                      className="w-6 h-6 rounded cursor-pointer border border-slate-700 bg-transparent p-0"
                    />
                    <span className="text-purple-300 font-bold">{config.customHex || '#38bdf8'}</span>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-1">
                  {[
                    { name: 'Sky Blue', hex: '#38bdf8' },
                    { name: 'Emerald', hex: '#10b981' },
                    { name: 'Amber', hex: '#f59e0b' },
                    { name: 'Purple', hex: '#8b5cf6' },
                    { name: 'Ruby Red', hex: '#f43f5e' },
                    { name: 'Teal', hex: '#14b8a6' },
                  ].map((swatch) => (
                    <button
                      key={swatch.hex}
                      onClick={() => {
                        updateField('color', 'custom');
                        updateField('customHex', swatch.hex);
                      }}
                      className="h-6 rounded-md border border-slate-700 transition-all hover:scale-105 flex items-center justify-center shadow"
                      style={{ backgroundColor: swatch.hex }}
                      title={swatch.name}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Application-Based Pigment Selection Assistant */}
          <div className="bg-slate-900/90 border border-blue-500/30 p-3 rounded-xl flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase text-blue-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Application-Based Pigment Assistant</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                Recommended Match
              </span>
            </div>
            <p className="text-[10px] text-slate-300 leading-relaxed">
              Facing a challenge selecting pigment color? Click your target industry application below to automatically apply the optimal pigment paste dosage & light transmission preset:
            </p>
            <div className="grid grid-cols-2 gap-1.5 pt-0.5">
              {[
                {
                  title: '☀️ Daylighting Skylights',
                  desc: 'Sky Blue (85% Light Pass, anti-glare tint)',
                  color: 'sky_blue',
                  pigment: 0.8,
                },
                {
                  title: '🏭 Industrial Factory',
                  desc: 'Opal White (42% Light Pass, shadowless light)',
                  color: 'opal_white',
                  pigment: 2.5,
                },
                {
                  title: '🌿 Greenhouse Roofing',
                  desc: 'Emerald (80% Light Pass, PAR growth spectrum)',
                  color: 'emerald_green',
                  pigment: 1.0,
                },
                {
                  title: '🏛️ Canopy & Sunshades',
                  desc: 'Amber (82% Light Pass, warm UV block)',
                  color: 'amber',
                  pigment: 1.0,
                },
                {
                  title: '💎 Crystal Clear Deck',
                  desc: 'Clear (94% Light Pass, maximum visibility)',
                  color: 'crystal_transparent',
                  pigment: 0.0,
                },
                {
                  title: '🔒 Opaque Privacy Wall',
                  desc: 'Carbon Black (2% Light Pass, 100% opacity)',
                  color: 'carbon_black',
                  pigment: 3.0,
                },
              ].map((app) => (
                <button
                  key={app.title}
                  onClick={() => {
                    updateField('color', app.color as ResinColor);
                    updateField('pigmentPercent', app.pigment);
                  }}
                  className={`p-2 rounded-lg border text-left flex flex-col gap-0.5 transition-all ${
                    config.color === app.color && Math.abs((materials.pigmentPercent) - app.pigment) < 0.3
                      ? 'bg-blue-600/30 border-blue-400 ring-1 ring-blue-400'
                      : 'bg-slate-950 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <span className="text-[11px] font-bold text-white leading-tight">{app.title}</span>
                  <span className="text-[9px] text-slate-400 leading-tight">{app.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pigment Concentration vs. Desired Level of Transparency Control Box */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-3 mt-1">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <div className="text-[11px] font-mono font-bold uppercase text-cyan-400 flex items-center gap-1.5">
                <Pipette className="w-3.5 h-3.5 text-cyan-400" />
                <span>Pigment Paste & Transparency Tuning</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                {materials.lightTransmittancePercent}% Light Pass
              </span>
            </div>

            {/* Control 1: Desired Level of Transparency */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Desired Level of Transparency:</span>
                <strong className="text-cyan-300 font-bold">{materials.lightTransmittancePercent}% Transmittance</strong>
              </div>
              <input
                type="range"
                min="0"
                max="95"
                step="1"
                value={materials.lightTransmittancePercent}
                onChange={(e) => {
                  const desiredTrans = Number(e.target.value);
                  let baseMax = 90;
                  if (config.color === 'crystal_transparent') baseMax = 95;
                  if (config.color === 'opal_white') baseMax = 65;
                  if (config.color === 'carbon_black') baseMax = 10;
                  const thicknessFactor = Math.pow(0.92, Math.max(0, config.thicknessMm - 1));
                  const targetRatio = Math.max(0.01, desiredTrans / (baseMax * thicknessFactor));
                  const reqPigment = Math.max(0, Math.min(5.0, Number((-Math.log(Math.min(1.0, targetRatio)) / 0.85).toFixed(1))));
                  updateField('pigmentPercent', reqPigment);
                }}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[9px] font-mono text-slate-500">
                <span>0% (Fully Opaque)</span>
                <span>50% (Translucent)</span>
                <span>95% (High Transparency)</span>
              </div>
            </div>

            {/* Control 2: Pigment Concentration Slider */}
            <div className="flex flex-col gap-1 pt-2 border-t border-slate-900">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Pigment Paste Concentration:</span>
                <strong className="text-amber-300 font-bold">{materials.pigmentPercent.toFixed(1)}% ({materials.pigmentWeightGrams.toFixed(1)} g)</strong>
              </div>
              <input
                type="range"
                min="0.0"
                max="5.0"
                step="0.1"
                value={materials.pigmentPercent}
                onChange={(e) => updateField('pigmentPercent', Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[9px] font-mono text-slate-500">
                <span>0.0% (Clear / No Paste)</span>
                <span>1.0% (Standard)</span>
                <span>5.0% (Max Opacity)</span>
              </div>
            </div>

            {/* Quick Presets for Desired Opacity */}
            <div className="grid grid-cols-4 gap-1 pt-1">
              {[
                { label: 'Clear (90%)', pig: 0.0 },
                { label: 'Light (75%)', pig: 0.3 },
                { label: 'Medium (50%)', pig: 0.8 },
                { label: 'Opaque (2%)', pig: 2.8 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => updateField('pigmentPercent', preset.pig)}
                  className={`py-1 rounded text-[10px] font-mono border transition-all ${
                    Math.abs(materials.pigmentPercent - preset.pig) < 0.2
                      ? 'bg-cyan-600/30 border-cyan-400 text-cyan-200 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              if (onSelectStep) onSelectStep(2);
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-semibold text-xs text-white shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all"
          >
            <ArrowRight className="w-4 h-4 text-cyan-300" />
            <span>Confirm Specifications & Proceed to Step 2 (Mylar Film)</span>
          </button>

          {/* Step 1 Process Options & Alternative Methods */}
          <StepAlternativeSelector stepId={1} config={config} updateField={updateField} />
        </div>
      )}

      {/* STEP 2: Mylar Film Selection */}
      {currentStep === 2 && (
        <div className="flex flex-col gap-4">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed flex flex-col gap-1.5">
            <span>
              Select high-clarity BOPET Mylar release paper for the base carrier bed. Following the table setup, only the bottom Mylar paper is to be unrolled onto the table.
            </span>
            <div className="bg-blue-950/60 border border-blue-500/30 p-2 rounded-lg flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Determined Flat Raw Width (incl. +{materials.edgeMarginMm}mm margin):</span>
              <strong className="text-cyan-300 font-bold">{materials.flatWidthMm} mm</strong>
            </div>
          </div>

          {/* Warning if Mylar is too narrow */}
          {isMylarTooNarrow && (
            <div className="bg-amber-500/10 border border-amber-500/40 p-3 rounded-xl flex items-start gap-2 text-xs text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              <div>
                <strong>Warning: Mylar Width Deficit!</strong>
                <p className="mt-0.5 text-amber-200/80">
                  Selected Mylar width ({config.mylarWidthMm}mm) is smaller than the determined raw flat sheet width ({materials.flatWidthMm}mm). This will cause resin edge overflow!
                </p>
                <button
                  onClick={() => updateField('mylarWidthMm', materials.flatWidthMm)}
                  className="mt-2 px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 rounded-lg text-amber-200 text-[11px] font-mono font-bold"
                >
                  Auto-Match Mylar to {materials.flatWidthMm}mm
                </button>
              </div>
            </div>
          )}

          {/* Mylar Roll Width */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300">Mylar Film Roll Width (mm):</label>
              <button
                onClick={() => updateField('mylarWidthMm', materials.flatWidthMm)}
                className="text-[10px] font-mono text-blue-400 hover:text-blue-300 underline"
              >
                Sync with Flat Width ({materials.flatWidthMm}mm)
              </button>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
              {[1000, 1200, 1300, 1400, 1500, 1600, 1800].map((mw) => {
                const isSelected = config.mylarWidthMm === mw;
                const isInsufficient = mw < materials.flatWidthMm;
                return (
                  <button
                    key={mw}
                    onClick={() => updateField('mylarWidthMm', mw)}
                    className={`py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                      isSelected
                        ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                        : isInsufficient
                        ? 'bg-slate-950 border-amber-500/30 text-amber-400 hover:bg-slate-800'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {mw}mm
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mylar Film Thickness */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-300">Film Gauge Thickness (µm):</label>
            <div className="grid grid-cols-3 gap-2">
              {[50, 75, 100].map((th) => (
                <button
                  key={th}
                  onClick={() => updateField('mylarThicknessUm', th as MylarThickness)}
                  className={`py-2 rounded-lg text-xs font-mono font-semibold border transition-all ${
                    config.mylarThicknessUm === th
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {th} µm
                </button>
              ))}
            </div>
          </div>

          {/* Film Finish */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-300">Surface Finish Treatment:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'gloss', label: 'High Gloss' },
                { id: 'matte', label: 'Satin Matte' },
                { id: 'anti_uv', label: 'Anti-UV Film' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => updateField('mylarFinish', f.id as any)}
                  className={`py-2 rounded-lg text-[11px] font-medium border transition-all ${
                    config.mylarFinish === f.id
                      ? 'bg-blue-600 border-blue-400 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Trigger Unroll Action */}
          <button
            onClick={() => {
              soundFx.playUnroll();
              onStartUnroll();
              if (onSelectStep) onSelectStep(3);
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-semibold text-xs text-white shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all mt-2"
          >
            <Layers className="w-4 h-4" />
            Unroll Bottom Mylar & Proceed to Resin Layup
          </button>

          {/* Step 2 Process Options & Alternative Methods */}
          <StepAlternativeSelector stepId={2} config={config} updateField={updateField} />
        </div>
      )}

      {/* STEP 3: Resin & Fiber Layup */}
      {currentStep === 3 && (
        <div className="flex flex-col gap-3.5">
          {/* Sub-section Dropdown & Tab switcher */}
          <div className="flex flex-col gap-2">
            <div className="relative w-full">
              <label htmlFor="step3-subtab-dropdown" className="sr-only">Select Step 3 Sub-section</label>
              <select
                id="step3-subtab-dropdown"
                value={step3SubTab}
                onChange={(e) => {
                  soundFx.playClick();
                  setStep3SubTab(e.target.value as any);
                }}
                className="w-full bg-slate-950 border border-blue-500/50 text-blue-200 text-xs font-bold font-mono rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-inner appearance-none pr-8"
              >
                <option value="resin_mix">Sub-section 1: Base 50% Liquid Resin Compounding</option>
                <option value="fibermat">Sub-section 2: FiberMat Glass Reinforcement Layup</option>
                <option value="top_resin">Sub-section 3: Top 50% Resin Encapsulation Coat</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-blue-400 text-xs">
                ▼
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setStep3SubTab('resin_mix');
                }}
                className={`py-2 px-1 text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                  step3SubTab === 'resin_mix'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Pipette className="w-3 h-3" />
                <span>Base 50% Resin</span>
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setStep3SubTab('fibermat');
                }}
                className={`py-2 px-1 text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                  step3SubTab === 'fibermat'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>FiberMat</span>
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setStep3SubTab('top_resin');
                }}
                className={`py-2 px-1 text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                  step3SubTab === 'top_resin'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Top 50% Resin</span>
              </button>
            </div>
          </div>

          {step3SubTab === 'resin_mix' && (
            <div className="flex flex-col gap-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed flex flex-col gap-2.5">
                <p>
                  Select the unsaturated polyester or vinyl ester polymer chemistry based on transparency requirements, product specifications, and application domain, then proceed with liquid compounding in the graduated beaker.
                </p>
                {onOpenThermalPrint && (
                  <button
                    onClick={onOpenThermalPrint}
                    className="w-full py-2 px-3 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 rounded-xl text-amber-300 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-amber-400" />
                    <span>Thermal Print Resin Mixture Ticket (80mm)</span>
                  </button>
                )}
              </div>

              {/* Polymer Resin Type Selection based on Transparency, Specs & Application */}
              <div className="bg-slate-900/90 border border-indigo-500/30 p-3.5 rounded-xl flex flex-col gap-3 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[11px] font-mono font-bold uppercase text-indigo-300 flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Resin Polymer Selection & Application Matching</span>
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-cyan-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-500/40">
                    ₹{materials.resinTypeSpec.costPerKgInr}/kg
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                    Polymer Chemistry Options:
                  </label>
                  
                  <div className="grid grid-cols-1 gap-1.5">
                    {(Object.keys(RESIN_SPECS) as ResinType[]).map((rKey) => {
                      const spec = RESIN_SPECS[rKey];
                      const isSelected = (config.resinType ?? 'orthophthalic') === rKey;

                      return (
                        <button
                          key={rKey}
                          type="button"
                          onClick={() => {
                            updateField('resinType', rKey);
                            soundFx.playClick();
                          }}
                          className={`p-2.5 rounded-lg border text-left transition-all flex flex-col gap-1 relative overflow-hidden ${
                            isSelected
                              ? 'bg-indigo-950/90 border-indigo-400 shadow-md shadow-indigo-500/10'
                              : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${
                                rKey === 'acrylic_modified' ? 'bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.8)]' :
                                rKey === 'isophthalic' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' :
                                rKey === 'vinyl_ester' ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]' :
                                rKey === 'dicyclopentadiene' ? 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]' :
                                'bg-blue-400'
                              }`}></span>
                              <strong className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                                {spec.name}
                              </strong>
                            </div>
                            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              spec.baseTransmittance >= 90 ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' :
                              spec.baseTransmittance >= 85 ? 'bg-blue-950 text-blue-300 border border-blue-500/30' :
                              'bg-amber-950 text-amber-300 border border-amber-500/30'
                            }`}>
                              {spec.baseTransmittance}% Transmittance
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-1 text-[9px] font-mono mt-0.5 text-slate-400">
                            <div>HDT: <strong className="text-slate-200">{spec.hdtC}°C</strong></div>
                            <div>UV Grade: <strong className="text-slate-200">{spec.uvGrade.split(' ')[0]}</strong></div>
                            <div>Price: <strong className="text-emerald-400">₹{spec.costPerKgInr}/kg</strong></div>
                          </div>

                          <div className="text-[10px] font-sans text-slate-300 mt-0.5">
                            <span className="text-indigo-300 font-medium">Application Domain:</span> {spec.applicationDomain}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Resin Specification Details */}
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex flex-col gap-1.5 text-[10px]">
                  <div className="flex items-center justify-between text-indigo-300 font-mono font-bold border-b border-slate-800 pb-1">
                    <span>📋 Active Resin Performance Spec:</span>
                    <span className="text-white uppercase">{materials.resinTypeSpec.name}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-slate-300">
                    <div>
                      <span className="text-slate-400 block font-mono">Transparency Baseline:</span>
                      <strong className="text-cyan-300 font-mono">{materials.resinTypeSpec.baseTransmittance}% Optical Pass</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-mono">Heat Distortion Temp:</span>
                      <strong className="text-amber-300 font-mono">{materials.resinTypeSpec.hdtC} °C</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-mono">UV Weathering Grade:</span>
                      <strong className="text-emerald-300 font-mono">{materials.resinTypeSpec.uvGrade}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-mono">Chemical Barrier:</span>
                      <strong className="text-purple-300 font-mono">{materials.resinTypeSpec.chemicalResistance}</strong>
                    </div>
                  </div>

                  <div className="pt-1 border-t border-slate-800 text-slate-300 leading-normal">
                    <strong className="text-indigo-300">Application Match:</strong> {materials.resinTypeSpec.applicationDomain}
                  </div>
                </div>
              </div>

              {/* Transparent Beaker Visual Compounding Card */}
              <div className="bg-slate-900/90 border border-blue-500/30 p-3.5 rounded-xl flex flex-col gap-3 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[11px] font-mono font-bold uppercase text-cyan-300 flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Transparent Beaker Compound Preparation</span>
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                    {(materials.resinVolumeLiters * 0.5).toFixed(2)} L Batch
                  </span>
                </div>

                {/* Beaker Graphic & Liquid Blend Status */}
                <div className="flex flex-col gap-3 bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                  
                  {/* Reaction Observation Selector Bar */}
                  <div className="flex flex-col gap-1.5 pb-2 border-b border-slate-800/80">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-slate-400 font-semibold uppercase flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-400" /> Physical Reaction Stage in Beaker:
                      </span>
                      <span className={`font-bold uppercase px-1.5 py-0.5 rounded ${
                        beakerReactionStage === 'mixing' ? 'text-blue-400 bg-blue-950/60' :
                        beakerReactionStage === 'initiated' ? 'text-amber-400 bg-amber-950/60' :
                        beakerReactionStage === 'gelling' ? 'text-purple-400 bg-purple-950/60' :
                        beakerReactionStage === 'exotherm' ? 'text-rose-400 bg-rose-950/60' :
                        'text-emerald-400 bg-emerald-950/60'
                      }`}>
                        {beakerReactionStage === 'mixing' && '1. Liquid Agitation & Degassing'}
                        {beakerReactionStage === 'initiated' && '2. Radical Initiation (MEKP+Co)'}
                        {beakerReactionStage === 'gelling' && '3. Sol-Gel Transition (t_gel)'}
                        {beakerReactionStage === 'exotherm' && '4. Peak Exotherm Heat Release'}
                        {beakerReactionStage === 'cured' && '5. Fully Cured Vitrified Solid'}
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-1">
                      {[
                        { id: 'mixing', label: '1. Mix', color: 'blue' },
                        { id: 'initiated', label: '2. Radical', color: 'amber' },
                        { id: 'gelling', label: '3. Gel', color: 'purple' },
                        { id: 'exotherm', label: '4. Heat', color: 'rose' },
                        { id: 'cured', label: '5. Solid', color: 'emerald' },
                      ].map((stg) => (
                        <button
                          key={stg.id}
                          type="button"
                          onClick={() => {
                            setBeakerReactionStage(stg.id as any);
                            soundFx.playClick();
                          }}
                          className={`py-1 px-1 rounded text-[9px] font-mono font-bold transition-all border text-center ${
                            beakerReactionStage === stg.id
                              ? stg.id === 'mixing' ? 'bg-blue-600 text-white border-blue-400 shadow-sm' :
                                stg.id === 'initiated' ? 'bg-amber-600 text-white border-amber-400 shadow-sm' :
                                stg.id === 'gelling' ? 'bg-purple-600 text-white border-purple-400 shadow-sm' :
                                stg.id === 'exotherm' ? 'bg-rose-600 text-white border-rose-400 shadow-sm' :
                                'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                          }`}
                        >
                          {stg.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-3 items-center">
                    {/* Glass Beaker SVG Graphic */}
                    <div className="col-span-4 flex flex-col items-center justify-center relative">
                      <div className={`w-20 h-24 border-2 rounded-b-xl rounded-t-sm relative overflow-hidden bg-slate-900/60 backdrop-blur-sm shadow-inner flex flex-col justify-end p-1 transition-all duration-500 ${
                        beakerReactionStage === 'exotherm' ? 'border-rose-500/80 shadow-rose-500/30' : 'border-slate-400/50'
                      }`}>
                        {/* Beaker Lip */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-400/40 border-b border-slate-300/30"></div>
                        
                        {/* Graduation Marks */}
                        <div className="absolute left-1 top-3 bottom-3 flex flex-col justify-between text-[7px] font-mono text-slate-400 select-none pointer-events-none z-10">
                          <div className="flex items-center gap-0.5"><span>-</span><span>100%</span></div>
                          <div className="flex items-center gap-0.5"><span>-</span><span>75%</span></div>
                          <div className="flex items-center gap-0.5"><span>-</span><span>50%</span></div>
                          <div className="flex items-center gap-0.5"><span>-</span><span>25%</span></div>
                        </div>

                        {/* Thermal Steam / Vapor Wisps during Peak Exotherm */}
                        {beakerReactionStage === 'exotherm' && (
                          <div className="absolute -top-3 left-0 right-0 flex justify-around pointer-events-none z-20">
                            <span className="w-1.5 h-4 bg-white/40 rounded-full blur-[1px] animate-bounce"></span>
                            <span className="w-2 h-5 bg-rose-200/50 rounded-full blur-[1px] animate-pulse"></span>
                            <span className="w-1.5 h-3 bg-white/30 rounded-full blur-[1px] animate-bounce"></span>
                          </div>
                        )}

                        {/* Liquid Batch Filling in Beaker */}
                        <div 
                          className="w-full rounded-b-lg transition-all duration-500 relative flex items-center justify-center overflow-hidden"
                          style={{
                            height: materials.fillerPercent > 0 ? `${Math.min(92, 75 + materials.fillerPercent * 0.4)}%` : '75%',
                            backgroundColor:
                              beakerReactionStage === 'cured' ? 'rgba(15, 23, 42, 0.95)' :
                              beakerReactionStage === 'exotherm' ? 'rgba(225, 29, 72, 0.85)' :
                              beakerReactionStage === 'gelling' ? 'rgba(147, 51, 234, 0.8)' :
                              config.color === 'sky_blue' ? 'rgba(56, 189, 248, 0.75)' :
                              config.color === 'emerald_green' ? 'rgba(16, 185, 129, 0.75)' :
                              config.color === 'amber' ? 'rgba(245, 158, 11, 0.75)' :
                              config.color === 'opal_white' ? 'rgba(241, 245, 249, 0.85)' :
                              config.color === 'carbon_black' ? 'rgba(30, 41, 59, 0.95)' :
                              'rgba(56, 189, 248, 0.5)',
                            boxShadow: beakerReactionStage === 'exotherm' ? '0 0 25px rgba(244, 63, 94, 0.6)' : '0 0 15px rgba(56, 189, 248, 0.2)'
                          }}
                        >
                          {/* Meniscus wave overlay */}
                          <div className={`absolute top-0 left-0 right-0 h-1 bg-white/40 ${beakerReactionStage === 'gelling' || beakerReactionStage === 'cured' ? '' : 'animate-pulse'}`}></div>

                          {/* Entrapped Air Degassing Micro-Bubbles */}
                          {(beakerReactionStage === 'mixing' || beakerReactionStage === 'initiated') && (
                            <div className="absolute inset-0 pointer-events-none flex justify-around items-end pb-1 opacity-75">
                              <div className="w-1 h-1 bg-white/80 rounded-full animate-bounce"></div>
                              <div className="w-1.5 h-1.5 bg-white/90 rounded-full animate-ping"></div>
                              <div className="w-1 h-1 bg-white/70 rounded-full animate-bounce"></div>
                            </div>
                          )}

                          {/* Mineral Filler Cloudiness / Suspended Particles in Beaker */}
                          {materials.fillerPercent > 0 && (
                            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-1 bg-slate-100/20 backdrop-blur-[0.5px]">
                              {/* Suspended Mineral Powder Particles */}
                              <div className="flex justify-around items-center opacity-80 pt-1">
                                <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm"></div>
                                <div className="w-1 h-1 bg-emerald-100 rounded-full"></div>
                                <div className="w-2 h-2 bg-white/90 rounded-full blur-[0.5px]"></div>
                                <div className="w-1 h-1 bg-slate-200 rounded-full"></div>
                              </div>
                              <div className="flex justify-around items-center opacity-70">
                                <div className="w-1 h-1 bg-white rounded-full"></div>
                                <div className="w-1.5 h-1.5 bg-slate-100 rounded-full"></div>
                                <div className="w-1 h-1 bg-white/80 rounded-full"></div>
                              </div>
                              {/* High-density Mineral Filler Slurry Bed at bottom of beaker */}
                              <div className="w-full h-2.5 bg-white/50 border-t border-white/60 flex items-center justify-center">
                                <span className="text-[6px] font-mono font-bold text-slate-800 uppercase tracking-tighter">
                                  {materials.fillerType === 'calcium_carbonate' ? 'CaCO₃' : materials.fillerType === 'ath_flame_retardant' ? 'ATH' : materials.fillerType === 'silica_powder' ? 'SILICA' : 'FILLER'}
                                </span>
                              </div>
                            </div>
                          )}

                          <span className="text-[9px] font-mono font-bold text-slate-900 drop-shadow bg-white/80 px-1.5 py-0.5 rounded text-center z-10">
                            {((materials.totalResinWeightKg * 0.5) + (materials.fillerWeightKg * 0.5)).toFixed(2)} kg
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 mt-1 text-center">
                        {beakerReactionStage === 'exotherm' ? (
                          <span className="text-rose-400 font-bold flex items-center gap-1">
                            <Flame className="w-3 h-3 text-rose-500 animate-pulse" />
                            ~95°C Exotherm
                          </span>
                        ) : beakerReactionStage === 'gelling' ? (
                          <span className="text-purple-300 font-bold">Gelation (Rubbery)</span>
                        ) : beakerReactionStage === 'cured' ? (
                          <span className="text-emerald-400 font-bold">Vitrified Puck</span>
                        ) : materials.fillerPercent > 0 ? (
                          <span className="text-emerald-400 font-bold">Beaker Slurry</span>
                        ) : (
                          'Graduated Beaker'
                        )}
                      </span>
                    </div>

                    {/* Compounding Ingredients List */}
                    <div className="col-span-8 flex flex-col gap-1.5 text-[11px] font-mono">
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="text-slate-400">1. Base Liquid Resin:</span>
                        <strong className="text-blue-300">{(materials.totalResinWeightKg * 0.5).toFixed(2)} kg</strong>
                      </div>
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="text-slate-400">2. MEKP Catalyst ({config.catalystPercent}%):</span>
                        <strong className="text-amber-400">{(materials.catalystVolumeMl * 0.5).toFixed(0)} mL</strong>
                      </div>
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="text-slate-400">3. Cobalt Promoter 6% ({(materials.cobaltPercent ?? 0.2)}%):</span>
                        <strong className="text-purple-300">{(materials.cobaltVolumeMl * 0.5).toFixed(1)} mL ({(materials.cobaltWeightGrams * 0.5).toFixed(1)} g)</strong>
                      </div>
                      {materials.fillerPercent > 0 && (
                        <div className="flex justify-between items-center text-slate-300">
                          <span className="text-slate-400">4. Mineral Filler ({materials.fillerPercent}% PHR):</span>
                          <strong className="text-emerald-300">
                            {(materials.fillerWeightGrams * 0.5) < 1000
                              ? `${(materials.fillerWeightGrams * 0.5).toFixed(1)} g`
                              : `${(materials.fillerWeightKg * 0.5).toFixed(2)} kg`}
                          </strong>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="text-slate-400">{materials.fillerPercent > 0 ? '5' : '4'}. Pigment Paste ({materials.pigmentPercent}%):</span>
                        <strong className="text-cyan-300">
                          {(materials.pigmentWeightGrams * 0.5) < 1000
                            ? `${(materials.pigmentWeightGrams * 0.5).toFixed(1)} g`
                            : `${(materials.pigmentWeightKg * 0.5).toFixed(3)} kg`}
                        </strong>
                      </div>
                      <div className="pt-1.5 border-t border-slate-800 flex justify-between text-[10px] text-emerald-400">
                        <span>Beaker Batch Status:</span>
                        <span className="font-bold">
                          {beakerReactionStage === 'mixing' ? 'Agitated & Homogenized' :
                           beakerReactionStage === 'initiated' ? 'Active Radical Cleavage' :
                           beakerReactionStage === 'gelling' ? 'Rubbery Gel Matrix (t_gel)' :
                           beakerReactionStage === 'exotherm' ? 'Exothermic Reaction Peak' :
                           'Vitrified Thermoset Solid'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Observable Physical Reactions Breakdown Box */}
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800 text-[10px] text-slate-300 space-y-1.5 font-sans">
                    <span className="font-mono font-bold text-cyan-300 uppercase block tracking-wider text-[9px] border-b border-slate-800 pb-1">
                      🔬 Physical Reactions Observed in Beaker:
                    </span>
                    {beakerReactionStage === 'mixing' && (
                      <p className="leading-normal text-slate-300">
                        • <strong>Entrapped Micro-Bubble Effervescence:</strong> Mechanical impeller shear traps microscopic air bubbles; bubbles float to the liquid meniscus and pop as degassing agents lower surface tension.<br />
                        • <strong>Turbidity & Opacity:</strong> Addition of fine mineral powder ({materials.fillerType}) creates a cloudy, translucent suspension slurry with Rayleigh particle light scattering.
                      </p>
                    )}
                    {beakerReactionStage === 'initiated' && (
                      <p className="leading-normal text-amber-200">
                        • <strong>Color Shift & Pinkish Tint:</strong> Cobalt octoate (Co²⁺) initially imparts a faint pink/violet tint that turns translucent amber as redox radical cleavage of MEKP oxygen-oxygen bonds proceeds.<br />
                        • <strong>Viscosity Creep:</strong> Liquid viscosity increases from ~350 cP to ~1,200 cP as primary free radicals (RO•) begin attacking monomer double bonds.
                      </p>
                    )}
                    {beakerReactionStage === 'gelling' && (
                      <p className="leading-normal text-purple-200">
                        • <strong>Sol-Gel Transition (t_gel ≈ {materials.estimatedGelTimeMin} min):</strong> Fluid motion ceases completely. The resin transforms into a rubbery gelatinous lump that can no longer be poured.<br />
                        • <strong>Meniscus Immobilization:</strong> The surface liquid wave locks into place as styrene bridges crosslink neighbor polyester prepolymer chains into a 3D network mesh.
                      </p>
                    )}
                    {beakerReactionStage === 'exotherm' && (
                      <p className="leading-normal text-rose-200">
                        • <strong>Exothermic Thermal Warming (Peak ~{Math.round(50 + (materials.ambientTempC * 0.8) + (config.catalystPercent * 15) + (config.cobaltPercent * 25))}°C):</strong> The glass beaker walls become hot to touch as polymerization releases enthalpy (~70 kJ/mol).<br />
                        • <strong>Vapor Emission:</strong> Minor wisps of evaporated styrene monomer and moisture rise from the hot gel surface.
                      </p>
                    )}
                    {beakerReactionStage === 'cured' && (
                      <p className="leading-normal text-emerald-200">
                        • <strong>Vitrification & Solid Puck:</strong> The gel hardens into an insoluble, glass-like thermoset solid with Barcol Hardness ≥ 40.<br />
                        • <strong>Volumetric Polymer Shrinkage:</strong> Covalent bond formation contracts matrix volume by ~5–8%, causing a visible microscopic gap along the beaker glass inner rim.
                      </p>
                    )}
                  </div>

                </div>
              </div>

              {/* MEKP Catalyst Ratio */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="text-slate-300 font-medium">MEKP Catalyst Ratio (%):</label>
                  <span className="font-mono font-bold text-amber-400">{config.catalystPercent}%</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="3.0"
                  step="0.1"
                  value={config.catalystPercent}
                  onChange={(e) => updateField('catalystPercent', Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>1.0% (Slow Gel)</span>
                  <span>2.0% (Standard)</span>
                  <span>3.0% (Fast Gel)</span>
                </div>
              </div>

              {/* Shop Floor Ambient Temperature (°C) */}
              <div className="flex flex-col gap-2 p-3 bg-slate-950 rounded-xl border border-purple-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-purple-300 flex items-center gap-1.5 uppercase">
                    <Thermometer className="w-4 h-4 text-purple-400" /> Shop Ambient Temperature
                  </span>
                  <span className="text-xs font-mono font-extrabold text-white bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/40">
                    {materials.ambientTempC} °C
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Ambient Curing Regime:</span>
                  <span className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                    materials.ambientCureStatus === 'cold_slow'
                      ? 'bg-blue-950 text-blue-300 border border-blue-500/30'
                      : materials.ambientCureStatus === 'hot_fast'
                      ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {materials.ambientCureStatus === 'cold_slow' ? '❄️ Cold Ambient (<20°C)' : materials.ambientCureStatus === 'hot_fast' ? '🔥 Hot Ambient (>29°C)' : '✅ Optimal Ambient (20-28°C)'}
                  </span>
                </div>

                <input
                  type="range"
                  min="15"
                  max="42"
                  step="1"
                  value={materials.ambientTempC}
                  onChange={(e) => updateField('ambientTempC', Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />

                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      updateField('ambientTempC', 18);
                      updateField('cobaltPercent', 0.35);
                      soundFx.playClick();
                    }}
                    className={`py-1 px-1.5 rounded text-[10px] font-mono border transition-all ${
                      materials.ambientTempC === 18
                        ? 'bg-purple-600 text-white border-purple-400 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    18°C Winter Cold
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateField('ambientTempC', 25);
                      updateField('cobaltPercent', 0.20);
                      soundFx.playClick();
                    }}
                    className={`py-1 px-1.5 rounded text-[10px] font-mono border transition-all ${
                      materials.ambientTempC === 25
                        ? 'bg-purple-600 text-white border-purple-400 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    25°C Standard Room
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateField('ambientTempC', 35);
                      updateField('cobaltPercent', 0.10);
                      soundFx.playClick();
                    }}
                    className={`py-1 px-1.5 rounded text-[10px] font-mono border transition-all ${
                      materials.ambientTempC === 35
                        ? 'bg-purple-600 text-white border-purple-400 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    35°C Summer Warm
                  </button>
                </div>
              </div>

              {/* Cobalt Accelerator / Promoter Ratio */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="text-slate-300 font-medium flex items-center gap-1">
                    <span>Cobalt Octoate Promoter (6% Active Co):</span>
                  </label>
                  <span className="font-mono font-bold text-purple-400">
                    {(config.cobaltPercent ?? 0.2).toFixed(2)}% ({(materials.cobaltVolumeMl * 0.5).toFixed(1)} mL)
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.50"
                  step="0.05"
                  value={config.cobaltPercent ?? 0.2}
                  onChange={(e) => updateField('cobaltPercent', Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>0.05% (Low Co)</span>
                  <span>0.20% (Standard Ambient)</span>
                  <span>0.50% (High Co)</span>
                </div>
              </div>

              {/* Ambient Temperature Cobalt Reaction & Gel-Time Card */}
              <div className="bg-slate-950 p-3 rounded-xl border border-purple-500/20 flex flex-col gap-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-[11px] font-mono font-bold uppercase text-purple-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-purple-400" /> Ambient Temperature Gel-Time Predictor
                  </span>
                  <span className="text-xs font-mono font-extrabold text-purple-300 bg-purple-950/90 px-2 py-0.5 rounded border border-purple-500/30">
                    ~{materials.estimatedGelTimeMin} min Gel Time
                  </span>
                </div>

                <p className="text-[10px] text-slate-300 leading-relaxed font-sans">
                  {materials.cobaltRecommendation}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1">
                  <div className="bg-slate-900 p-2 rounded border border-slate-800 flex flex-col gap-0.5">
                    <span className="text-slate-400">Total Cobalt Weight:</span>
                    <strong className="text-purple-300 font-bold">{materials.cobaltWeightGrams.toFixed(1)} g ({materials.cobaltVolumeMl.toFixed(1)} mL)</strong>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800 flex flex-col gap-0.5">
                    <span className="text-slate-400">MEKP Catalyst Ratio:</span>
                    <strong className="text-amber-300 font-bold">{config.catalystPercent}% MEKP ({materials.catalystVolumeMl.toFixed(0)} mL)</strong>
                  </div>
                </div>

                <div className="bg-purple-950/40 p-2.5 rounded-lg border border-purple-500/30 text-[10px] text-purple-200 leading-snug font-sans flex flex-col gap-2">
                  <div>
                    <strong>Chemistry Note:</strong> Cobalt Octoate (6% cobalt metal) accelerates room-temperature cleavage of MEKP oxygen-oxygen bonds via a redox catalytic cycle, enabling polymer matrix crosslinking at ambient temperatures ({materials.ambientTempC}°C) without external oven heating.
                  </div>
                  <div className="flex flex-col sm:flex-row gap-1.5">
                    {onOpenTimingModal && (
                      <button
                        type="button"
                        onClick={() => {
                          soundFx.playClick();
                          onOpenTimingModal();
                        }}
                        className="flex-1 py-1.5 px-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded flex items-center justify-center gap-1.5 font-mono text-[10px] font-bold transition-all shadow-sm"
                      >
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>⏱️ Step Timing & Gel Window</span>
                      </button>
                    )}
                    {onOpenMechanism && (
                      <button
                        type="button"
                        onClick={() => {
                          soundFx.playClick();
                          onOpenMechanism();
                        }}
                        className="flex-1 py-1.5 px-2 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 rounded flex items-center justify-center gap-1.5 font-mono text-[10px] font-bold transition-all shadow-sm"
                      >
                        <Atom className="w-3.5 h-3.5 text-indigo-300 animate-spin-slow" />
                        <span>Reaction Mechanism</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Mineral Filler & Matrix Extender Section */}
              <div className="flex flex-col gap-2 p-3 bg-slate-950 rounded-xl border border-emerald-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-300 flex items-center gap-1.5 uppercase">
                    <Layers className="w-4 h-4 text-emerald-400" /> Mineral Filler & Matrix Extender
                  </span>
                  <span className="text-xs font-mono font-extrabold text-white bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                    {materials.fillerPercent}% PHR ({materials.fillerWeightKg.toFixed(2)} kg)
                  </span>
                </div>

                {/* Filler Type Buttons */}
                <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      updateField('fillerType', 'none');
                      updateField('fillerPercent', 0);
                      soundFx.playClick();
                    }}
                    className={`py-1.5 px-2 rounded border transition-all text-left flex flex-col gap-0.5 ${
                      materials.fillerType === 'none' || materials.fillerPercent === 0
                        ? 'bg-emerald-600 text-white border-emerald-400 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <span>Unfilled Pure Resin</span>
                    <span className="text-[9px] opacity-80">100% Optical Translucent</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      updateField('fillerType', 'calcium_carbonate');
                      if (materials.fillerPercent === 0) updateField('fillerPercent', 15);
                      soundFx.playClick();
                    }}
                    className={`py-1.5 px-2 rounded border transition-all text-left flex flex-col gap-0.5 ${
                      materials.fillerType === 'calcium_carbonate'
                        ? 'bg-emerald-600 text-white border-emerald-400 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <span>Calcium Carbonate (CaCO₃)</span>
                    <span className="text-[9px] opacity-80">Max Economy (~₹18/kg)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      updateField('fillerType', 'ath_flame_retardant');
                      if (materials.fillerPercent === 0) updateField('fillerPercent', 25);
                      soundFx.playClick();
                    }}
                    className={`py-1.5 px-2 rounded border transition-all text-left flex flex-col gap-0.5 ${
                      materials.fillerType === 'ath_flame_retardant'
                        ? 'bg-emerald-600 text-white border-emerald-400 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <span>ATH (Aluminium Trihydrate)</span>
                    <span className="text-[9px] opacity-80">UL94 V-0 Flame Retardant</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      updateField('fillerType', 'silica_powder');
                      if (materials.fillerPercent === 0) updateField('fillerPercent', 20);
                      soundFx.playClick();
                    }}
                    className={`py-1.5 px-2 rounded border transition-all text-left flex flex-col gap-0.5 ${
                      materials.fillerType === 'silica_powder'
                        ? 'bg-emerald-600 text-white border-emerald-400 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <span>Silica / Quartz Powder</span>
                    <span className="text-[9px] opacity-80">Abrasion & Stiffness Gain</span>
                  </button>
                </div>

                {/* Filler Loading Slider */}
                {materials.fillerType !== 'none' && (
                  <div className="flex flex-col gap-1 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-300">Mineral Filler Loading Ratio:</span>
                      <span className="font-mono font-bold text-emerald-400">{materials.fillerPercent}% PHR</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      step="5"
                      value={materials.fillerPercent}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        updateField('fillerPercent', val);
                        if (val === 0) updateField('fillerType', 'none');
                        else if (materials.fillerType === 'none') updateField('fillerType', 'calcium_carbonate');
                      }}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-slate-500">
                      <span>0% (Unfilled)</span>
                      <span>15% (Optimal CaCO₃)</span>
                      <span>25% (ATH Flame)</span>
                      <span>40% (Max Heavy Bulk)</span>
                    </div>
                  </div>
                )}

                <p className="text-[10px] text-slate-300 font-sans leading-relaxed pt-1">
                  {materials.fillerEffectNote}
                </p>
              </div>

              {/* Pigment Paste Concentration Slider for Desired Transparency */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="text-slate-300 font-medium">Pigment Concentration (Tuning Transparency):</label>
                  <span className="font-mono font-bold text-cyan-400">
                    {materials.pigmentPercent.toFixed(1)}% ({materials.lightTransmittancePercent}% Light Pass)
                  </span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="5.0"
                  step="0.1"
                  value={materials.pigmentPercent}
                  onChange={(e) => updateField('pigmentPercent', Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>0.0% (High Clarity)</span>
                  <span>1.0% (Translucent)</span>
                  <span>5.0% (Fully Opaque)</span>
                </div>
              </div>

              {/* Material Recipe Summary Box */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs flex flex-col gap-1.5 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Initial 50% Resin Batch:</span>
                  <strong className="text-blue-300">{(materials.totalResinWeightKg * 0.5).toFixed(2)} kg ({(materials.resinVolumeLiters * 0.5).toFixed(2)} L)</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>MEKP Hardener (for 50%):</span>
                  <strong className="text-amber-300">{(materials.catalystVolumeMl * 0.5).toFixed(0)} mL</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Cobalt Promoter 6% (for 50%):</span>
                  <strong className="text-purple-300">{(materials.cobaltVolumeMl * 0.5).toFixed(1)} mL ({(materials.cobaltWeightGrams * 0.5).toFixed(1)} g)</strong>
                </div>
                {materials.fillerPercent > 0 && (
                  <div className="flex justify-between text-slate-400">
                    <span>Mineral Filler ({materials.fillerPercent}% PHR):</span>
                    <strong className="text-emerald-300">
                      {(materials.fillerWeightGrams * 0.5) < 1000
                        ? `${(materials.fillerWeightGrams * 0.5).toFixed(1)} g`
                        : `${(materials.fillerWeightKg * 0.5).toFixed(2)} kg`}
                    </strong>
                  </div>
                )}
                <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-900">
                  <span>Pigment Paste ({materials.pigmentPercent}%):</span>
                  <strong className="text-cyan-300">
                    {(materials.pigmentWeightGrams * 0.5) < 1000
                      ? `${(materials.pigmentWeightGrams * 0.5).toFixed(1)} g`
                      : `${(materials.pigmentWeightKg * 0.5).toFixed(3)} kg`}
                  </strong>
                </div>
                <div className="flex justify-between items-center text-slate-400 pt-1 border-t border-slate-900">
                  <span>Resin Unit Rate:</span>
                  <strong className="text-teal-300">₹{materials.activeResinRateInrPerKg}/kg</strong>
                </div>
              </div>

              {onOpenRateModal && (
                <button
                  onClick={onOpenRateModal}
                  className="w-full py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <IndianRupee className="w-4 h-4 text-teal-400" />
                  <span>Adjust Raw Material Rates & Pricing</span>
                </button>
              )}

              <button
                onClick={() => {
                  soundFx.playPour();
                  setStep3SubTab('fibermat');
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-xs text-white shadow-lg flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Apply Base 50% Resin & Proceed to FiberMat
              </button>
            </div>
          )}

          {step3SubTab === 'fibermat' && (
            <div className="flex flex-col gap-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                Subsequent to the incorporation of the initial resin mixture, apply FiberMat reinforcement layers over the resin mixture. The appropriate resin-to-glass ratio is calibrated according to the selected fiberglass reinforcement structure.
              </div>

              {/* Glass Fiber Type Selection Grid */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-slate-300 flex flex-wrap items-center justify-between gap-1">
                  <span>FiberMat Reinforcement Type:</span>
                  <span className="font-mono text-[10px] text-blue-400 font-bold uppercase truncate max-w-[220px]" title={materials.glassFiberSpec.name}>{materials.glassFiberSpec.name}</span>
                </label>
                
                <div className="grid grid-cols-1 gap-1.5 text-xs font-mono">
                  {(Object.keys(GLASS_FIBER_SPECS) as GlassFiberType[]).map((typeKey) => {
                    const spec = GLASS_FIBER_SPECS[typeKey];
                    const isSelected = config.fiberType === typeKey;
                    return (
                      <button
                        key={typeKey}
                        type="button"
                        onClick={() => updateField('fiberType', typeKey)}
                        className={`p-2 rounded-xl border text-left transition-all flex flex-col gap-1.5 min-w-0 ${
                          isSelected
                            ? 'bg-blue-950/80 border-blue-500/80 text-white shadow-md shadow-blue-500/10'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-1 min-w-0">
                          <span className={`font-bold text-xs min-w-0 break-words ${isSelected ? 'text-blue-300' : 'text-slate-200'}`}>
                            {spec.name}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold shrink-0 whitespace-nowrap ${
                            isSelected ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-900 text-slate-400 border-slate-800'
                          }`}>
                            Rec: {spec.recommendedResinRatioPercent}% Resin
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-sans leading-tight min-w-0 break-words">
                          {spec.weaveStructure} • {spec.gsmPerLayer} GSM/layer
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Glass Layers */}
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
                  <label className="text-slate-300 font-medium">FiberMat Layers Count:</label>
                  <span className="font-mono font-bold text-blue-400 whitespace-nowrap">{config.glassLayers} Layer(s) ({config.glassLayers * materials.glassFiberSpec.gsmPerLayer} GSM total)</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((l) => (
                    <button
                      key={l}
                      onClick={() => updateField('glassLayers', l)}
                      className={`py-1.5 rounded-lg text-xs font-mono font-bold border ${
                        config.glassLayers === l
                          ? 'bg-blue-600 border-blue-400 text-white'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      {l} Ply
                    </button>
                  ))}
                </div>
              </div>

              {/* Fiberglass-Specific Resin Ratio Selector & Technical Calibration */}
              <div className="bg-slate-950 p-3 rounded-xl border border-blue-500/30 flex flex-col gap-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <span className="text-[11px] font-mono font-bold uppercase text-blue-300 flex items-center gap-1.5 shrink-0">
                    <FlaskConical className="w-3.5 h-3.5 text-blue-400 shrink-0" /> Resin-to-Glass Calibration
                  </span>
                  <span className="text-xs font-mono font-extrabold text-white bg-blue-950 px-2 py-0.5 rounded border border-blue-500/40 shrink-0 whitespace-nowrap">
                    {Math.round(config.resinToGlassRatio * 100)}% Resin / {Math.round((1 - config.resinToGlassRatio) * 100)}% Glass
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-center justify-between text-xs gap-1">
                    <span className="text-slate-300 font-medium whitespace-nowrap">Calibrated Ratio Slider:</span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Standard: <strong className="text-emerald-400">{materials.glassFiberSpec.recommendedResinRatioPercent}% Resin</strong>
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0.35"
                    max="0.80"
                    step="0.01"
                    value={config.resinToGlassRatio}
                    onChange={(e) => updateField('resinToGlassRatio', Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />

                  <div className="flex justify-between text-[9px] font-mono text-slate-500 gap-1 overflow-x-auto pb-0.5">
                    <span className="whitespace-nowrap">35% (Dry Glass)</span>
                    <span className="whitespace-nowrap">50% (Woven)</span>
                    <span className="whitespace-nowrap">67% (CSM)</span>
                    <span className="whitespace-nowrap">80% (Rich Cap)</span>
                  </div>
                </div>

                {/* Quick Match Button */}
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => updateField('resinToGlassRatio', materials.glassFiberSpec.recommendedResinRatio)}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-mono font-bold border transition-all flex items-center justify-center gap-1.5 ${
                      Math.abs(config.resinToGlassRatio - materials.glassFiberSpec.recommendedResinRatio) < 0.005
                        ? 'bg-emerald-600 text-white border-emerald-400'
                        : 'bg-slate-900 text-emerald-400 border-emerald-500/40 hover:bg-emerald-950'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span>Auto-Match Standard ({materials.glassFiberSpec.recommendedResinRatioPercent}% Resin)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateField('resinToGlassRatio', Math.min(0.80, materials.glassFiberSpec.recommendedResinRatio + 0.05))}
                    className="flex-1 py-1.5 px-2 rounded-lg text-[10px] font-mono font-bold border transition-all bg-slate-900 text-blue-300 border-slate-800 hover:bg-slate-800 flex items-center justify-center gap-1 whitespace-nowrap"
                  >
                    <span>Rich Wet-Out (+5% Resin)</span>
                  </button>
                </div>

                {/* Technical Fiber Behavior Note */}
                <div className="bg-blue-950/40 p-2.5 rounded-lg border border-blue-500/20 text-[10px] text-blue-200 leading-relaxed font-sans">
                  <strong>Industry Standard Specification:</strong> {materials.glassFiberSpec.description} Standard weight ratio is <strong>{materials.glassFiberSpec.resinToGlassRatioText}</strong>.
                </div>
              </div>

              {/* Material Recipe Summary Box */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs flex flex-col gap-1.5 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Reinforcement Type:</span>
                  <strong className="text-white">{materials.glassFiberSpec.name}</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Total FiberMat Weight:</span>
                  <strong className="text-emerald-300">{materials.totalGlassWeightKg.toFixed(2)} kg</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Required Resin Weight:</span>
                  <strong className="text-blue-300">{materials.totalResinWeightKg.toFixed(2)} kg (Ratio {(config.resinToGlassRatio / (1 - config.resinToGlassRatio)).toFixed(2)}:1)</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Reinforcement Area:</span>
                  <strong className="text-cyan-300">{materials.sheetAreaM2.toFixed(2)} m²</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setStep3SubTab('top_resin');
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-xs text-white shadow-lg flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Incorporate FiberMat & Proceed to Remaining 50% Resin
              </button>
            </div>
          )}

          {step3SubTab === 'top_resin' && (
            <div className="flex flex-col gap-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                Subsequently, apply the remaining 50% resin mixture over the fiberglass in a separate step to fully saturate the composite matrix.
              </div>

              {/* Material Recipe Summary Box */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs flex flex-col gap-1.5 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Remaining 50% Resin Batch:</span>
                  <strong className="text-blue-300">{(materials.totalResinWeightKg * 0.5).toFixed(2)} kg ({(materials.resinVolumeLiters * 0.5).toFixed(2)} L)</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>MEKP Hardener (for 50%):</span>
                  <strong className="text-amber-300">{(materials.catalystVolumeMl * 0.5).toFixed(0)} mL</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Cobalt Promoter 6% (for 50%):</span>
                  <strong className="text-purple-300">{(materials.cobaltVolumeMl * 0.5).toFixed(1)} mL ({(materials.cobaltWeightGrams * 0.5).toFixed(1)} g)</strong>
                </div>
                {materials.fillerPercent > 0 && (
                  <div className="flex justify-between text-slate-400">
                    <span>Mineral Filler ({materials.fillerPercent}% PHR):</span>
                    <strong className="text-emerald-300">
                      {(materials.fillerWeightGrams * 0.5) < 1000
                        ? `${(materials.fillerWeightGrams * 0.5).toFixed(1)} g`
                        : `${(materials.fillerWeightKg * 0.5).toFixed(2)} kg`}
                    </strong>
                  </div>
                )}
                <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-900">
                  <span>Total Composite Saturation:</span>
                  <strong className="text-emerald-300">100% Impregnated ({materials.totalResinWeightKg.toFixed(1)} kg Total Resin)</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  soundFx.playPour();
                  if (onSelectStep) onSelectStep(4);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-xs text-white shadow-lg flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Apply Remaining 50% Resin & Proceed to Step 4 (Compression Die)
              </button>
            </div>
          )}

          {/* Step 3 Process Options & Alternative Methods */}
          <StepAlternativeSelector stepId={3} config={config} updateField={updateField} />
        </div>
      )}

      {/* STEP 4: Compression Die & Weights */}
      {currentStep === 4 && (
        <div className="flex flex-col gap-3.5">
          {/* Sub-section Dropdown & Tab switcher */}
          <div className="flex flex-col gap-2">
            <div className="relative w-full">
              <label htmlFor="step4-subtab-dropdown" className="sr-only">Select Step 4 Sub-section</label>
              <select
                id="step4-subtab-dropdown"
                value={step4SubTab}
                onChange={(e) => {
                  soundFx.playClick();
                  setStep4SubTab(e.target.value as any);
                }}
                className="w-full bg-slate-950 border border-blue-500/50 text-blue-200 text-xs font-bold font-mono rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-inner appearance-none pr-8"
              >
                <option value="upper_mylar">Sub-section 1: Upper Mylar Protective Film Application</option>
                <option value="sheet_transfer">Sub-section 2: Sheet Transfer to Side Shaping Table</option>
                <option value="upper_die">Sub-section 3: Upper Profile Shaping Die Placement</option>
                <option value="die_weights">Sub-section 4: Die Compression Load & Clamping</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-blue-400 text-xs">
                ▼
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setStep4SubTab('upper_mylar');
                }}
                className={`py-2 px-1 text-[10px] sm:text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                  step4SubTab === 'upper_mylar'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Scroll className="w-3 h-3" />
                <span>1. Mylar</span>
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setStep4SubTab('sheet_transfer');
                }}
                className={`py-2 px-1 text-[10px] sm:text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                  step4SubTab === 'sheet_transfer'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <ArrowRight className="w-3 h-3 text-amber-300" />
                <span>2. Transfer</span>
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setStep4SubTab('upper_die');
                }}
                className={`py-2 px-1 text-[10px] sm:text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                  step4SubTab === 'upper_die'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Layers className="w-3 h-3 text-cyan-300" />
                <span>3. Upper Die</span>
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setStep4SubTab('die_weights');
                }}
                className={`py-2 px-1 text-[10px] sm:text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                  step4SubTab === 'die_weights'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>4. Weights</span>
              </button>
            </div>
          </div>

          {step4SubTab === 'upper_mylar' && (
            <div className="flex flex-col gap-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                Subsequent to applying the resin mixture, unroll the upper Mylar film smoothly over the resin compound to seal the wet composite layer.
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Upper Mylar Roll Width:</span>
                  <strong className="text-emerald-400">{config.mylarWidthMm} mm</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Carrier Film Thickness:</span>
                  <strong className="text-blue-300">{config.mylarThicknessUm} µm BOPET Film</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Covered Resin Area:</span>
                  <strong className="text-cyan-300">{materials.sheetAreaM2.toFixed(2)} m²</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setStep4SubTab('sheet_transfer');
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-xs text-white shadow-lg flex items-center justify-center gap-2"
              >
                <Scroll className="w-4 h-4 text-emerald-300" />
                Unroll Upper Mylar & Proceed to Sheet Transfer
              </button>
            </div>
          )}

          {step4SubTab === 'sheet_transfer' && (
            <div className="flex flex-col gap-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                The FRP plain sheet with Mylar paper, previously prepared on the main table, is now transferred to the lower die positioned on the side table for shaping.
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-2 text-xs font-mono">
                <div className="flex justify-between font-sans">
                  <span className="text-slate-400">Sheet Assembly Status:</span>
                  <strong className="text-emerald-400">FRP Plain Sheet + Dual Mylar Film</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Origin Bed:</span>
                  <strong className="text-blue-300">Main Manufacturing Table</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Destination Die Bed:</span>
                  <strong className="text-amber-400">Side Table Positioned Die ({config.profile.replace('_', ' ')})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Transferred Assembly Dimensions:</span>
                  <strong className="text-white">{config.widthMm}mm W × {config.lengthMm}mm L</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setStep4SubTab('upper_die');
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-xs text-white shadow-lg flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-4 h-4 text-amber-300" />
                Transfer Plain Sheet onto Lower Die & Proceed to Upper Die
              </button>
            </div>
          )}

          {step4SubTab === 'upper_die' && (
            <div className="flex flex-col gap-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                Subsequent to sheet transfer, the upper shaping die is lowered over the plain sheet assembly on the side table to press and form the designated profile geometry.
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-2 text-xs font-mono">
                <div className="flex justify-between font-sans">
                  <span className="text-slate-400">Upper Profile Shaping Die:</span>
                  <strong className="text-cyan-300 capitalize">{config.profile.replace('_', ' ')} Top Die</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Alignment Mode:</span>
                  <strong className="text-emerald-400">Male / Female Matching Mold Interlock</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Surface Protection:</span>
                  <strong className="text-blue-300">Upper BOPET Mylar Release Film Active</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Profile Pitch Alignment:</span>
                  <strong className="text-white">100% Interlocked with Base Die</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setStep4SubTab('die_weights');
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold text-xs text-white shadow-lg flex items-center justify-center gap-2"
              >
                <Layers className="w-4 h-4 text-cyan-300" />
                Lower Upper Die for Profile Shaping & Proceed to Weights
              </button>
            </div>
          )}

          {step4SubTab === 'die_weights' && (
            <div className="flex flex-col gap-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                With the upper shaping die positioned over the sheet, lower calibrated compression weights and clamps onto the die assembly for uniform compaction and resin squeeze out.
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-2 text-xs font-mono">
                <div className="flex justify-between font-sans">
                  <span className="text-slate-400">Positioned Die Assembly:</span>
                  <strong className="text-white capitalize">{config.profile.replace('_', ' ')} Upper & Lower Die</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Upper Die Status:</span>
                  <strong className="text-emerald-400">Engaged over Sheet Assembly</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Compression Load:</span>
                  <strong className="text-amber-400">50 kg / meter</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  soundFx.playWeightClunk();
                  if (onSelectStep) onSelectStep(5);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 font-semibold text-xs text-white shadow-lg flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                Apply Compression Load & Proceed to Step 5 (Curing)
              </button>
            </div>
          )}

          {/* Step 4 Process Options & Alternative Methods */}
          <StepAlternativeSelector stepId={4} config={config} updateField={updateField} />
        </div>
      )}

      {/* STEP 5: Curing & Drying Table */}
      {currentStep === 5 && (
        <div className="flex flex-col gap-4">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
            Control drying temperature and observe exothermic cross-linking polymerization reaction.
          </div>

          {/* Curing Progress Bar */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Curing Completion:</span>
              <span className="font-mono font-bold text-emerald-400">{Math.round(curingProgress)}%</span>
            </div>
            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-amber-500 via-blue-500 to-emerald-400 h-full transition-all duration-200"
                style={{ width: `${curingProgress}%` }}
              />
            </div>
          </div>

          {/* Temp Control */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="text-slate-300 font-medium">Drying Temp (°C):</label>
              <span className="font-mono font-bold text-amber-400">{config.dryingTempC} °C</span>
            </div>
            <input
              type="range"
              min="25"
              max="80"
              step="5"
              value={config.dryingTempC}
              onChange={(e) => updateField('dryingTempC', Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Speed Multiplier */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-slate-300">Simulation Speed Multiplier:</label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 5, 10, 60].map((s) => (
                <button
                  key={s}
                  onClick={() => onChangeSpeed(s)}
                  className={`py-1.5 rounded-lg text-xs font-mono font-bold border ${
                    speedMultiplier === s
                      ? 'bg-amber-600 border-amber-400 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          {/* Drying Control Buttons */}
          <div className="flex gap-2">
            <button
              onClick={onToggleHeating}
              className={`flex-1 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
                isHeating
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                  : 'bg-blue-600 text-white hover:bg-blue-500'
              }`}
            >
              {isHeating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isHeating ? 'Pause Heating' : 'Start Heating'}
            </button>

            <button
              onClick={onFastForwardCuring}
              className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1"
            >
              <FastForward className="w-4 h-4 text-emerald-400" /> Complete
            </button>
          </div>

          {/* Step 5 Process Options & Alternative Methods */}
          <StepAlternativeSelector stepId={5} config={config} updateField={updateField} />
        </div>
      )}

      {/* STEP 6: Weight Removal, Demold, Lower Mylar Detachment, Margin Trimming & Quality Inspection */}
      {currentStep === 6 && (
        <div className="flex flex-col gap-3.5">
          {/* Sub-section Dropdown & Tab switcher */}
          <div className="flex flex-col gap-2">
            <div className="relative w-full">
              <label htmlFor="step6-subtab-dropdown" className="sr-only">Select Step 6 Sub-section</label>
              <select
                id="step6-subtab-dropdown"
                value={step6SubTab}
                onChange={(e) => {
                  soundFx.playClick();
                  setStep6SubTab(e.target.value as any);
                }}
                className="w-full bg-slate-950 border border-amber-500/50 text-amber-200 text-xs font-bold font-mono rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer shadow-inner appearance-none pr-8"
              >
                <option value="weight_removal">Sub-section 1: Compression Weight Unloading</option>
                <option value="upper_die_removal">Sub-section 2: Upper Profile Die Demolding</option>
                <option value="top_mylar_peeling">Sub-section 3: Top Mylar Film Peeling</option>
                <option value="sheet_elevation">Sub-section 4: Cured Profile Sheet Elevation</option>
                <option value="lower_mylar_detachment">Sub-section 5: Lower Mylar Carrier Detachment</option>
                <option value="margin_trimming">Sub-section 6: Margin Edge Trimming & Inspection</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-amber-400 text-xs">
                ▼
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                soundFx.playClick();
                setStep6SubTab('weight_removal');
              }}
              className={`py-2 px-1 text-[10px] sm:text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                step6SubTab === 'weight_removal'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>1. Weights</span>
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setStep6SubTab('upper_die_removal');
              }}
              className={`py-2 px-1 text-[10px] sm:text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                step6SubTab === 'upper_die_removal'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Layers className="w-3 h-3 text-cyan-300" />
              <span>2. Upper Die</span>
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setStep6SubTab('top_mylar_peeling');
              }}
              className={`py-2 px-1 text-[10px] sm:text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                step6SubTab === 'top_mylar_peeling'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Scroll className="w-3 h-3 text-indigo-300" />
              <span>3. Top Mylar</span>
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setStep6SubTab('sheet_elevation');
              }}
              className={`py-2 px-1 text-[10px] sm:text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                step6SubTab === 'sheet_elevation'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Layers className="w-3 h-3 text-purple-300" />
              <span>4. Elevate</span>
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setStep6SubTab('lower_mylar_detachment');
              }}
              className={`py-2 px-1 text-[10px] sm:text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                step6SubTab === 'lower_mylar_detachment'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Scroll className="w-3 h-3 text-teal-300" />
              <span>5. Lower Mylar</span>
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setStep6SubTab('margin_trimming');
              }}
              className={`py-2 px-1 text-[10px] sm:text-[11px] font-semibold rounded-lg transition-all flex items-center justify-center gap-1 ${
                step6SubTab === 'margin_trimming'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Scissors className="w-3 h-3 text-emerald-300" />
              <span>6. Trim Margins</span>
            </button>
          </div>
        </div>

          {/* Subtab 1: Weight Removal */}
          {step6SubTab === 'weight_removal' && (
            <div className="flex flex-col gap-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                Subsequent to the drying period, the initial step involves the removal of the compression weights and clamps from the upper die assembly.
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-2 text-xs font-mono">
                <div className="flex justify-between font-sans">
                  <span className="text-slate-400">Post-Drying Status:</span>
                  <strong className="text-emerald-400">Exotherm Complete (100% Cured)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Initial Action:</span>
                  <strong className="text-amber-400">Unbolt & Lift Compression Weights</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Applied Load to Release:</span>
                  <strong className="text-white">50 kg / meter Cast Iron Blocks</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  soundFx.playWeightClunk();
                  setStep6SubTab('upper_die_removal');
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 font-semibold text-xs text-white shadow-lg flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-200" />
                Remove Compression Weights & Proceed to Upper Die Removal
              </button>
            </div>
          )}

          {/* Subtab 2: Uppermost Die Removal */}
          {step6SubTab === 'upper_die_removal' && (
            <div className="flex flex-col gap-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                Subsequent to weight removal, the uppermost profile shaping die is unlatched and lifted away from the cured sheet on the side table.
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-2 text-xs font-mono">
                <div className="flex justify-between font-sans">
                  <span className="text-slate-400">Weights Status:</span>
                  <strong className="text-emerald-400">Compression Weights Cleared</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Component:</span>
                  <strong className="text-cyan-300 font-sans uppercase">{config.profile.replace('_', ' ')} Uppermost Die</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Demold Action:</span>
                  <strong className="text-blue-300">Lift Uppermost Mold Half & Stage Aside</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setStep6SubTab('top_mylar_peeling');
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 font-semibold text-xs text-white shadow-lg flex items-center justify-center gap-2"
              >
                <Layers className="w-4 h-4 text-cyan-200" />
                Lift & Remove Uppermost Die & Proceed to Top Mylar Removal
              </button>
            </div>
          )}

          {/* Subtab 3: Uppermost Mylar Sheet Removal */}
          {step6SubTab === 'top_mylar_peeling' && (
            <div className="flex flex-col gap-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                With the uppermost shaping die removed, peel off and remove the uppermost protective BOPET Mylar sheet from the stack to expose the smooth molded top profile.
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-2 text-xs font-mono">
                <div className="flex justify-between font-sans">
                  <span className="text-slate-400">Uppermost Die:</span>
                  <strong className="text-emerald-400">Removed & Staged</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Mylar Sheet:</span>
                  <strong className="text-indigo-300">Uppermost BOPET Mylar Film Layer</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Surface Profile:</span>
                  <strong className="text-amber-300">Glossy Translucent {config.profile.replace('_', ' ')} Finish</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  soundFx.playPeel();
                  setStep6SubTab('sheet_elevation');
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 font-semibold text-xs text-white shadow-lg flex items-center justify-center gap-2"
              >
                <Scroll className="w-4 h-4 text-indigo-200" />
                Remove Uppermost Mylar Sheet & Proceed to Sheet Elevation
              </button>
            </div>
          )}

          {/* Subtab 4: Elevate FRP Sheet */}
          {step6SubTab === 'sheet_elevation' && (
            <div className="flex flex-col gap-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                Elevate the cured FRP corrugated sheet from the lower die surface using vacuum suction cups or overhead lifting clamps.
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-2 text-xs font-mono">
                <div className="flex justify-between font-sans">
                  <span className="text-slate-400">Demolding Progress:</span>
                  <strong className="text-emerald-400">Weights, Upper Die & Top Mylar Cleared</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Elevation Action:</span>
                  <strong className="text-cyan-300">Elevate Cured FRP Sheet off Base Die</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Underside Status:</span>
                  <strong className="text-amber-300">Lower Mylar Substrate Adhered Below</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  soundFx.playPeel();
                  onDemoldAndLift();
                  setStep6SubTab('lower_mylar_detachment');
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 font-semibold text-xs text-white shadow-lg flex items-center justify-center gap-2"
              >
                <Layers className="w-4 h-4 text-purple-200" />
                Elevate FRP Sheet & Proceed to Lower Mylar Detachment
              </button>
            </div>
          )}

          {/* Subtab 5: Detach Lower Mylar Substrate */}
          {step6SubTab === 'lower_mylar_detachment' && (
            <div className="flex flex-col gap-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                Subsequently, detach the lower Mylar substrate film from the underside of the elevated FRP sheet, exposing the smooth bottom surface.
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-2 text-xs font-mono">
                <div className="flex justify-between font-sans">
                  <span className="text-slate-400">Sheet Elevation:</span>
                  <strong className="text-emerald-400">Elevated off Lower Die</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Substrate:</span>
                  <strong className="text-teal-300">Lower BOPET Mylar Release Film</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Action:</span>
                  <strong className="text-amber-300">Peel & Detach Base Substrate Film</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  soundFx.playPeel();
                  setStep6SubTab('margin_trimming');
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 font-semibold text-xs text-white shadow-lg flex items-center justify-center gap-2"
              >
                <Scroll className="w-4 h-4 text-teal-200" />
                Detach Lower Mylar Substrate & Proceed to Margin Trimming
              </button>
            </div>
          )}

          {/* Subtab 6: Trim Margins & Final Quality Inspection */}
          {step6SubTab === 'margin_trimming' && (
            <div className="flex flex-col gap-4">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                Subsequently, trim the uneven resin and fiberglass margins using a high-precision diamond edge saw cutter to produce clean, straight, and polished sheet borders.
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-2 text-xs font-mono">
                <div className="flex justify-between font-sans">
                  <span className="text-slate-400">Lower Substrate:</span>
                  <strong className="text-emerald-400">Lower Mylar Detached</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Trimming Cutter:</span>
                  <strong className="text-emerald-300">High-Speed Diamond Blade Saw</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Flange Border Finish:</span>
                  <strong className="text-cyan-300">Smooth, Polished & Dimensionally Trimmed</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  soundFx.playSuccess();
                  onOpenReportModal();
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 font-semibold text-xs text-white shadow-lg flex items-center justify-center gap-2 mb-1"
              >
                <Scissors className="w-4 h-4 text-emerald-200" />
                Trim Margins & View Final 3D Product Rendering
              </button>

              {/* Backlight Inspection Toggle */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-slate-200">Underbed Backlight Check</div>
                  <div className="text-[10px] text-slate-400">Illuminates sheet translucency & fiber uniformity</div>
                </div>
                <button
                  onClick={onToggleBacklight}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    backlightMode
                      ? 'bg-amber-500 text-slate-950 border-amber-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 inline mr-1" />
                  {backlightMode ? 'ON' : 'OFF'}
                </button>
              </div>

              {/* Flexure Load Simulation */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="text-slate-300 font-medium">Flexural Mechanical Load Check:</label>
                  <span className="font-mono font-bold text-blue-400">{Math.round(flexAmount * 100)}% Load</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={flexAmount}
                  onChange={(e) => onChangeFlex(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Open Final Spec Report */}
              <button
                onClick={onOpenReportModal}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-semibold text-xs text-blue-300 flex items-center justify-center gap-2 transition-all mt-1"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                View Quality Inspection Certificate
              </button>
            </div>
          )}

          {/* Step 6 Process Options & Alternative Methods */}
          <StepAlternativeSelector stepId={6} config={config} updateField={updateField} />
        </div>
      )}
    </div>
  );
};
