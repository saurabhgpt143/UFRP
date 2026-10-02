import React, { useState } from 'react';
import {
  X,
  Palette,
  Sparkles,
  Check,
  CheckCircle2,
  Info,
  Layers,
  FlaskConical,
  Award,
  Pipette,
  Eye,
  Droplet,
  BookOpen,
  Scale,
  SlidersHorizontal,
  Flame,
  Clock,
  Shield,
  Sun,
  Activity,
  ChevronRight,
  Filter,
  RefreshCw,
  Wrench,
  Zap,
  ShieldCheck,
  Moon,
  Gauge
} from 'lucide-react';
import { FRPConfig, MaterialCalculations, ResinColor } from '../types';
import {
  PRIMARY_HUES,
  RAL_COLORS,
  RalColorSpec,
  PrimaryHue,
  findRalColor,
  calculateBatchPigmentComponents
} from '../data/ralColors';
import { soundFx } from '../utils/soundEffects';

export interface GlowColorOption {
  id: string;
  name: string;
  chemicalFormula: string;
  glowColorName: string;
  glowHex: string;
  daytimeHex: string;
  peakWavelengthNm: number;
  afterglowHours: number;
  luminanceMcd: number; // mcd/m2 after 10 min
  dinClass: string;
  application: string;
}

export const GLOW_OPTIONS: GlowColorOption[] = [
  {
    id: 'yellow_green',
    name: 'Strontium Aluminate Yellow-Green',
    chemicalFormula: 'SrAl2O4:Eu2+,Dy3+',
    glowColorName: 'Neon Yellow-Green',
    glowHex: '#39ff14',
    daytimeHex: '#f0fdf4',
    peakWavelengthNm: 520,
    afterglowHours: 12,
    luminanceMcd: 360,
    dinClass: 'DIN 67510 Class D (Maximum Industrial)',
    application: 'Emergency Fire Escape Skylights, Industrial Hazard Walkways, Mining Shaft Canopies',
  },
  {
    id: 'aqua_blue',
    name: 'Strontium Aluminate Aqua-Blue',
    chemicalFormula: 'Sr4Al14O25:Eu2+,Dy3+',
    glowColorName: 'Electric Cyan / Aqua',
    glowHex: '#00f5d4',
    daytimeHex: '#ecfeff',
    peakWavelengthNm: 490,
    afterglowHours: 10,
    luminanceMcd: 290,
    dinClass: 'DIN 67510 Class C (High Persistence)',
    application: 'Coastal Walkways, Marine Night Canopies, Architectural Skylight Accents',
  },
  {
    id: 'sky_blue',
    name: 'Calcium Aluminate Sky Blue',
    chemicalFormula: 'CaAl2O4:Eu2+,Nd3+',
    glowColorName: 'Cobalt Sky Blue',
    glowHex: '#00b4d8',
    daytimeHex: '#f0f9ff',
    peakWavelengthNm: 440,
    afterglowHours: 6,
    luminanceMcd: 180,
    dinClass: 'DIN 67510 Class B',
    application: 'Commercial Atrium Roofs, Aviation Hangar Night Paths, Decorative Pergolas',
  },
  {
    id: 'fire_orange',
    name: 'Yttrium Oxide-Sulfide Fire Orange',
    chemicalFormula: 'Y2O2S:Eu3+ / CaS:Bi',
    glowColorName: 'Vibrant Solar Orange',
    glowHex: '#ff5400',
    daytimeHex: '#fff7ed',
    peakWavelengthNm: 605,
    afterglowHours: 3,
    luminanceMcd: 85,
    dinClass: 'DIN 67510 Class A',
    application: 'Dangerous Equipment Zones, Chemical Tank Shelter Roofs, Perimeter Warning Bands',
  },
  {
    id: 'violet_purple',
    name: 'Calcium Aluminate Deep Violet',
    chemicalFormula: 'CaAl2O4:Eu2+',
    glowColorName: 'Ultraviolet Glow',
    glowHex: '#a855f7',
    daytimeHex: '#faf5ff',
    peakWavelengthNm: 405,
    afterglowHours: 4,
    luminanceMcd: 95,
    dinClass: 'DIN 67510 Class A',
    application: 'Nightclub & Hospitality Skylights, Luxury Pergola Demarcation Borders',
  },
];

interface ColorMakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: FRPConfig;
  materials: MaterialCalculations;
  onChangeConfig: (newConfig: FRPConfig) => void;
}

export const ColorMakerModal: React.FC<ColorMakerModalProps> = ({
  isOpen,
  onClose,
  config,
  materials,
  onChangeConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'swatches' | 'guidelines' | 'deyellowing' | 'glow'>('swatches');
  const [selectedHue, setSelectedHue] = useState<PrimaryHue | 'all'>('all');
  const [selectedRal, setSelectedRal] = useState<RalColorSpec>(() => {
    if (config.ralCode) {
      const found = findRalColor(config.ralCode);
      if (found) return found;
    }
    return RAL_COLORS[0]; // RAL 4008 Signal Violet
  });
  const [customPigmentPhr, setCustomPigmentPhr] = useState<number>(() => {
    return config.pigmentPercent ?? selectedRal.recommendedPigment;
  });

  // State for Liquid Resin De-Yellowing & Optical Brightener Calibrator
  const [opticalBrightenerPpm, setOpticalBrightenerPpm] = useState<number>(100); // 50 - 200 ppm
  const [opticalTonerPpm, setOpticalTonerPpm] = useState<number>(12); // 5 - 30 ppm
  const [usePhosphiteAntioxidant, setUsePhosphiteAntioxidant] = useState<boolean>(true);
  const [deyellowBatchResinKg, setDeyellowBatchResinKg] = useState<number>(() => {
    return materials.totalResinWeightKg > 0 ? materials.totalResinWeightKg : 50;
  });

  // State for Glow-in-the-Dark Photoluminescent Calibrator
  const [selectedGlowId, setSelectedGlowId] = useState<string>('yellow_green');
  const [glowPhr, setGlowPhr] = useState<number>(15.0); // 5% - 30% PHR
  const [isNightSimulated, setIsNightSimulated] = useState<boolean>(true);
  const [glowBatchResinKg, setGlowBatchResinKg] = useState<number>(() => {
    return materials.totalResinWeightKg > 0 ? materials.totalResinWeightKg : 50;
  });

  if (!isOpen) return null;

  const filteredColors = selectedHue === 'all'
    ? RAL_COLORS
    : RAL_COLORS.filter((c) => c.primaryHue === selectedHue);

  const handleSelectColor = (ral: RalColorSpec) => {
    soundFx.playClick();
    setSelectedRal(ral);
    setCustomPigmentPhr(ral.recommendedPigment);
  };

  const handleApplyColor = (ral: RalColorSpec, pigmentPhr?: number) => {
    soundFx.playClick();
    const activePigment = pigmentPhr ?? ral.recommendedPigment;

    // Map primary hue to standard ResinColor
    let mappedResinColor: ResinColor = 'custom';
    if (ral.primaryHue === 'violet') mappedResinColor = 'ral_violet';
    else if (ral.primaryHue === 'indigo') mappedResinColor = 'ral_indigo';
    else if (ral.primaryHue === 'blue') mappedResinColor = 'ral_blue';
    else if (ral.primaryHue === 'green') mappedResinColor = 'ral_green';
    else if (ral.primaryHue === 'yellow') mappedResinColor = 'ral_yellow';
    else if (ral.primaryHue === 'orange') mappedResinColor = 'ral_orange';
    else if (ral.primaryHue === 'red') mappedResinColor = 'ral_red';

    onChangeConfig({
      ...config,
      color: mappedResinColor,
      customHex: ral.hex,
      ralCode: ral.code,
      ralName: ral.name,
      ralHue: ral.primaryHue,
      pigmentPercent: activePigment,
      customBaseTransmittance: ral.baseTransmittance,
    });
  };

  const handleApplyWaterWhite = () => {
    soundFx.playClick();
    onChangeConfig({
      ...config,
      color: 'crystal_transparent',
      customHex: '#e0f2fe',
      pigmentPercent: 0.01,
      customBaseTransmittance: 92,
      ralCode: undefined,
      ralName: 'Optical Crystal Water-White (De-Yellowed)',
      ralHue: undefined,
    });
    onClose();
  };

  const handleApplyGlow = (glow: GlowColorOption, phr: number, simulateNight: boolean) => {
    soundFx.playClick();
    onChangeConfig({
      ...config,
      color: 'custom',
      customHex: simulateNight ? glow.glowHex : glow.daytimeHex,
      pigmentPercent: phr,
      customBaseTransmittance: Math.max(30, Math.round(75 - phr * 1.2)),
      ralCode: `GLOW-${glow.peakWavelengthNm}`,
      ralName: `${glow.name} (${glow.glowColorName})`,
      ralHue: 'green',
    });
    onClose();
  };

  // Scaled calculations for currently selected RAL in modal
  const totalResinKg = materials.totalResinWeightKg;
  const pigmentBreakdown = calculateBatchPigmentComponents(selectedRal, totalResinKg, customPigmentPhr);
  const simulatedLightPass = Math.max(
    5,
    Math.min(92, Math.round(selectedRal.baseTransmittance * Math.exp(-0.45 * customPigmentPhr)))
  );

  // De-Yellowing batch calculations
  const scaledBrightenerGrams = parseFloat(((deyellowBatchResinKg * opticalBrightenerPpm) / 1000).toFixed(2));
  const scaledTonerGrams = parseFloat(((deyellowBatchResinKg * opticalTonerPpm) / 1000).toFixed(2));
  const scaledAntioxidantGrams = usePhosphiteAntioxidant ? parseFloat((deyellowBatchResinKg * 1000 * 0.0008).toFixed(1)) : 0;
  const estimatedNeutralizedGardner = Math.max(0.1, parseFloat((2.5 - (opticalTonerPpm * 0.07) - (opticalBrightenerPpm * 0.008)).toFixed(1)));
  const estimatedDeltaB = parseFloat((-(opticalTonerPpm * 0.12 + opticalBrightenerPpm * 0.008)).toFixed(1));
  const estimatedTransmittanceGain = Math.min(5.0, parseFloat((opticalBrightenerPpm * 0.02 + opticalTonerPpm * 0.05).toFixed(1)));

  // Glow-in-the-Dark Photoluminescent batch calculations
  const activeGlowOption = GLOW_OPTIONS.find((g) => g.id === selectedGlowId) || GLOW_OPTIONS[0];
  const scaledGlowPowderKg = parseFloat(((glowBatchResinKg * glowPhr) / 100).toFixed(3));
  const scaledGlowPowderGrams = parseFloat((scaledGlowPowderKg * 1000).toFixed(1));
  const scaledResinGrams = parseFloat((glowBatchResinKg * 1000).toFixed(0));
  const scaledFumedSilicaGrams = parseFloat((glowBatchResinKg * 1000 * 0.015).toFixed(1)); // 1.5% anti-settling thixotrope
  const scaledFumedSilicaKg = parseFloat((scaledFumedSilicaGrams / 1000).toFixed(3));
  const scaledSilaneAgentGrams = parseFloat((scaledGlowPowderGrams * 0.008).toFixed(1)); // 0.8% of phosphor weight
  const scaledCobaltPromoterGrams = parseFloat((glowBatchResinKg * 1000 * 0.002).toFixed(1)); // 0.20% Cobalt Octoate (6%)
  const scaledCobaltPromoterMl = parseFloat((scaledCobaltPromoterGrams / 0.95).toFixed(1));
  const scaledMekpInitiatorGrams = parseFloat((glowBatchResinKg * 1000 * 0.015).toFixed(1)); // 1.50% MEKP
  const scaledMekpInitiatorMl = parseFloat((scaledMekpInitiatorGrams / 1.15).toFixed(1));
  const totalCompoundedBatchGrams = parseFloat(
    (
      scaledResinGrams +
      scaledGlowPowderGrams +
      scaledFumedSilicaGrams +
      scaledSilaneAgentGrams +
      scaledCobaltPromoterGrams +
      scaledMekpInitiatorGrams
    ).toFixed(1)
  );
  const totalCompoundedBatchKg = parseFloat((totalCompoundedBatchGrams / 1000).toFixed(2));
  const phosphorMassPercent = parseFloat(((scaledGlowPowderGrams / totalCompoundedBatchGrams) * 100).toFixed(1));
  const calculatedLuminance = Math.round(activeGlowOption.luminanceMcd * (glowPhr / 15));
  const calculatedPersistence = Math.min(14, parseFloat((activeGlowOption.afterglowHours * Math.sqrt(glowPhr / 15)).toFixed(1)));

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 font-sans overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl text-white my-3 max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 px-4 sm:px-6 py-3.5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-amber-500 text-white p-0.5 flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Palette className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-1.5">
                  <span>Color Maker</span>
                  <span className="text-slate-400 font-normal text-xs sm:text-sm">| Primary Hue, RAL & Glow Studio</span>
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 border border-purple-500/40 text-purple-300 font-bold uppercase">
                  VIBGYOR & Photoluminescent
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Primary Hues • RAL Classic • De-Yellowing • Photoluminescent Glow in the Dark Formulations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher Tabs */}
            <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1">
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab('swatches');
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
                  activeTab === 'swatches'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>RAL Swatches</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab('guidelines');
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
                  activeTab === 'guidelines'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Mixing Guidelines</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab('deyellowing');
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
                  activeTab === 'deyellowing'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>De-Yellowing</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab('glow');
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono font-medium transition-all ${
                  activeTab === 'glow'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-lime-400" />
                <span>Glow in the Dark</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile View Switcher */}
        <div className="sm:hidden flex border-b border-slate-800 bg-slate-950 px-3 py-1.5 gap-1 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setActiveTab('swatches');
            }}
            className={`px-2.5 py-1.5 rounded text-xs font-mono font-medium flex items-center justify-center gap-1 shrink-0 ${
              activeTab === 'swatches' ? 'bg-purple-600 text-white' : 'text-slate-400 bg-slate-900'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Swatches</span>
          </button>
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setActiveTab('guidelines');
            }}
            className={`px-2.5 py-1.5 rounded text-xs font-mono font-medium flex items-center justify-center gap-1 shrink-0 ${
              activeTab === 'guidelines' ? 'bg-purple-600 text-white' : 'text-slate-400 bg-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guidelines</span>
          </button>
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setActiveTab('deyellowing');
            }}
            className={`px-2.5 py-1.5 rounded text-xs font-mono font-medium flex items-center justify-center gap-1 shrink-0 ${
              activeTab === 'deyellowing' ? 'bg-purple-600 text-white' : 'text-slate-400 bg-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>De-Yellowing</span>
          </button>
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              setActiveTab('glow');
            }}
            className={`px-2.5 py-1.5 rounded text-xs font-mono font-medium flex items-center justify-center gap-1 shrink-0 ${
              activeTab === 'glow' ? 'bg-purple-600 text-white' : 'text-slate-400 bg-slate-900'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-lime-400" />
            <span>Glow</span>
          </button>
        </div>

        {/* Tab 1: RAL Swatches & Dosing Studio */}
        {activeTab === 'swatches' && (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Primary Hue Spectral Bar & Filter Navigation */}
            <div className="flex flex-col border-b border-slate-800 bg-slate-950/60 px-4 sm:px-6 py-2.5 gap-2 shrink-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-semibold uppercase text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Select Primary Hue Category (RAL Standard):</span>
                </span>
                <span className="text-[10px] font-mono text-purple-300">
                  {filteredColors.length} RAL Colors Available
                </span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <button
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedHue('all');
                  }}
                  className={`py-1.5 px-3 rounded-lg text-xs font-mono font-bold transition-all shrink-0 ${
                    selectedHue === 'all'
                      ? 'bg-white text-slate-950 shadow-md ring-1 ring-white'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  🌈 All Primary Hues ({RAL_COLORS.length})
                </button>

                {PRIMARY_HUES.map((hue) => {
                  const count = RAL_COLORS.filter((c) => c.primaryHue === hue.id).length;
                  const isSelected = selectedHue === hue.id;

                  return (
                    <button
                      key={hue.id}
                      onClick={() => {
                        soundFx.playClick();
                        setSelectedHue(hue.id);
                      }}
                      className={`py-1.5 px-3 rounded-lg text-xs font-mono font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                        isSelected
                          ? `${hue.bgClass} ${hue.borderClass} ${hue.textClass} ring-1 ring-purple-400 shadow-md`
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            hue.id === 'violet' ? '#904684' :
                            hue.id === 'indigo' ? '#20214f' :
                            hue.id === 'blue' ? '#2271b3' :
                            hue.id === 'green' ? '#57a639' :
                            hue.id === 'yellow' ? '#f8f32b' :
                            hue.id === 'orange' ? '#e25303' : '#cc0605'
                        }}
                      />
                      <span>{hue.label}</span>
                      <span className="text-[10px] opacity-70">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Main Content: Split Swatches Grid + Interactive Dosing Sidebar */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 text-xs text-slate-300">
              
              {/* Left: Swatches Grid (7 Cols on desktop) */}
              <div className="lg:col-span-7 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400 font-semibold uppercase">
                    RAL Classic Swatches ({selectedHue.toUpperCase()})
                  </span>
                  <span className="text-emerald-400">IS 12866 Xenon Arc Grade 5–6</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
                  {filteredColors.map((ral) => {
                    const isSelected = selectedRal.code === ral.code;
                    const isApplied = config.ralCode === ral.code || config.customHex === ral.hex;

                    return (
                      <div
                        key={ral.code}
                        onClick={() => handleSelectColor(ral)}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-2.5 relative overflow-hidden ${
                          isSelected
                            ? 'bg-slate-900 border-purple-400 ring-2 ring-purple-500/50 shadow-lg'
                            : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            {/* Simulated FRP Resin Swatch with gloss gradient */}
                            <div
                              className="w-8 h-8 rounded-lg shrink-0 border border-white/20 shadow-md relative overflow-hidden"
                              style={{ backgroundColor: ral.hex }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/40 pointer-events-none" />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-white font-mono">{ral.code}</span>
                                {isApplied && (
                                  <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] font-mono rounded font-bold">
                                    ACTIVE
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-300 font-medium leading-tight">{ral.name}</div>
                            </div>
                          </div>

                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 shrink-0">
                            {ral.baseTransmittance}% Pass
                          </span>
                        </div>

                        {/* Primary formulation quick tags */}
                        <div className="flex items-center gap-1 text-[9px] font-mono text-slate-400 bg-slate-900/60 p-1 rounded border border-slate-850">
                          <span className="text-purple-300 font-semibold">Mix:</span>
                          <span className="truncate">
                            {Object.entries(ral.mixRatio)
                              .filter(([k, v]) => ['violet', 'indigo', 'blue', 'green', 'yellow', 'orange', 'red', 'white', 'black'].includes(k) && typeof v === 'number' && v > 0)
                              .map(([k, v]) => `${v}% ${k.charAt(0).toUpperCase() + k.slice(1)}`)
                              .join(' • ')}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-mono pt-1.5 border-t border-slate-850">
                          <span className="text-purple-300 font-medium">{ral.primaryHue.toUpperCase()} HUE</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApplyColor(ral);
                            }}
                            className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all flex items-center gap-1 ${
                              isApplied
                                ? 'bg-emerald-600 text-white'
                                : 'bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40'
                            }`}
                          >
                            {isApplied ? <Check className="w-3 h-3" /> : <Droplet className="w-3 h-3" />}
                            <span>{isApplied ? 'Selected' : 'Use Color'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Selected RAL Dosing & Transmittance Studio (5 Cols on desktop) */}
              <div className="lg:col-span-5 flex flex-col gap-3.5 bg-slate-950 p-4 rounded-xl border border-purple-500/30">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-purple-300 uppercase flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4 text-purple-400" />
                    <span>Color Maker Batch Recipe</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/30">
                    {selectedRal.code}
                  </span>
                </div>

                {/* Color Hero Display */}
                <div className="p-3.5 rounded-xl border border-slate-800 flex items-center gap-3.5 bg-slate-900/90 relative overflow-hidden">
                  <div
                    className="w-12 h-12 rounded-xl border-2 border-white/30 shadow-xl shrink-0 relative overflow-hidden flex items-center justify-center"
                    style={{ backgroundColor: selectedRal.hex }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/50" />
                    <Sparkles className="w-5 h-5 text-white/80 drop-shadow" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono font-extrabold text-white flex items-center gap-1.5 truncate">
                      <span>{selectedRal.code}</span>
                      <span className="text-slate-400 font-normal">•</span>
                      <span className="truncate">{selectedRal.name}</span>
                    </div>
                    <div className="text-[10px] text-purple-300 font-mono mt-0.5">
                      Primary Hue: <strong>{selectedRal.hueLabel}</strong> ({selectedRal.hex})
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono">
                      CIELAB: L* {selectedRal.mixRatio.cielab.L}, a* {selectedRal.mixRatio.cielab.a}, b* {selectedRal.mixRatio.cielab.b}
                    </div>
                  </div>
                </div>

                {/* Pigment Loading Concentration Slider */}
                <div className="flex flex-col gap-2 p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300 flex items-center gap-1">
                      <Pipette className="w-3.5 h-3.5 text-cyan-400" /> Pigment Paste Loading:
                    </span>
                    <span className="font-mono font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-700">
                      {customPigmentPhr.toFixed(1)}% PHR ({pigmentBreakdown.totalPigmentGrams.toFixed(1)} g)
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0.2"
                    max="4.0"
                    step="0.1"
                    value={customPigmentPhr}
                    onChange={(e) => setCustomPigmentPhr(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />

                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>0.2% (Translucent)</span>
                    <span>{selectedRal.recommendedPigment}% (RAL Standard)</span>
                    <span>4.0% (Opaque Barrier)</span>
                  </div>
                </div>

                {/* Primary Hue Mixing Ratio Formulation Card */}
                <div className="p-3 bg-slate-900 rounded-xl border border-purple-500/25 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-purple-300 font-mono font-bold flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5 text-purple-400" /> Primary Color Mixing Ratios:
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Batch: {totalResinKg.toFixed(1)} kg Resin
                    </span>
                  </div>

                  {/* Multi-segmented colored ratio bar */}
                  <div className="w-full h-3 rounded-lg overflow-hidden flex border border-slate-700 shadow-inner bg-slate-950">
                    {pigmentBreakdown.components.map((c, i) => (
                      <div
                        key={i}
                        style={{
                          width: `${c.ratioPercent}%`,
                          backgroundColor: c.colorHex,
                        }}
                        title={`${c.name}: ${c.ratioPercent}% (${c.grams}g)`}
                        className="h-full transition-all"
                      />
                    ))}
                  </div>

                  {/* Component list with scaled gram weights */}
                  <div className="flex flex-col gap-1.5 pt-1">
                    {pigmentBreakdown.components.map((comp, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-[11px] font-mono bg-slate-950/70 px-2 py-1 rounded border border-slate-800/80"
                      >
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-white/30 shrink-0"
                            style={{ backgroundColor: comp.colorHex }}
                          />
                          <span className="text-slate-300 text-[10px]">{comp.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-purple-300 font-semibold text-[10px]">
                            {comp.ratioPercent}%
                          </span>
                          <span className="text-emerald-400 font-bold text-[10px]">
                            {comp.grams} g
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chemical and cure notes */}
                  <div className="text-[10px] text-slate-400 bg-slate-950/50 p-2 rounded border border-slate-850 space-y-1">
                    <div>
                      <strong className="text-slate-300">Chemistry: </strong>
                      <span>{selectedRal.mixRatio.pigmentChemistry}</span>
                    </div>
                    <div>
                      <strong className="text-amber-400">Cure Advisory: </strong>
                      <span>{selectedRal.mixRatio.cureAdjustmentNote}</span>
                    </div>
                  </div>
                </div>

                {/* Optical Transmittance Output Simulator */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-col gap-2 font-mono">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-emerald-400" /> Light Transmittance:
                    </span>
                    <span className="text-sm font-bold text-emerald-400">
                      {simulatedLightPass}% Daylight Pass
                    </span>
                  </div>

                  {/* Progress visualizer bar */}
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${simulatedLightPass}%`,
                        backgroundColor: selectedRal.hex,
                      }}
                    />
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  type="button"
                  onClick={() => {
                    handleApplyColor(selectedRal, customPigmentPhr);
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 font-bold text-xs text-white shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Apply {selectedRal.code} to Active FRP Sheet</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Primary Mixing Guidelines & Ratio Reference Matrix */}
        {activeTab === 'guidelines' && (
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col gap-5 text-xs text-slate-300">
            {/* Top Overview Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Scale className="w-5 h-5 text-purple-400" />
                    <span>Guidelines for Color Formulations from Primary Mixing Ratios</span>
                  </h3>
                  <span className="px-2 py-0.5 bg-purple-900/60 border border-purple-500/40 text-[10px] font-mono text-purple-300 rounded font-bold">
                    BIS IS 12866 & RAL Standard
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Thermoset composite resin coloration obeys <strong>subtractive color physics</strong>. By compounding standard primary pigment pastes—<strong>Violet, Indigo, Blue, Green, Yellow, Orange, Red</strong>—alongside Rutile Titanium Dioxide ($TiO_2$) and Carbon Black, any RAL Classic color is reproducibly engineered with exact spectrophotometric accuracy.
                </p>
              </div>
              <div className="bg-slate-950 px-3 py-2 rounded-lg border border-purple-500/30 font-mono text-center shrink-0">
                <div className="text-[10px] text-slate-400">Current Production Batch</div>
                <div className="text-emerald-400 font-bold text-sm">{totalResinKg.toFixed(1)} kg Resin</div>
              </div>
            </div>

            {/* 6 Key Engineering Formulation Principles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {/* Principle 1 */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-purple-300 font-mono font-bold text-xs">
                  <div className="w-6 h-6 rounded-md bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-300">
                    1
                  </div>
                  <span>Subtractive Primary System</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Liquid polyester absorbs wavelengths selectively. Use pure monomolecular chemical classes: <strong>Quinacridone</strong> for Violet/Red, <strong>Copper Phthalocyanine</strong> for Blue/Green, <strong>Bismuth Vanadate / DPP</strong> for Yellow/Orange. Avoid multi-pigment muddy blends by restricting to 2 or 3 primaries plus white/black.
                </p>
              </div>

              {/* Principle 2 */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-cyan-300 font-mono font-bold text-xs">
                  <div className="w-6 h-6 rounded-md bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                    2
                  </div>
                  <span>Kubelka-Munk & Transmittance</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Absorption-to-scattering ratio $K/S = \sum c_i (K/S)_i$. In translucent skylight sheets (0.3–0.8% PHR), optical transmittance follows exponential decay. Adding Rutile $TiO_2$ sharply increases diffuse scattering $S$, transforming transparent sheets into soft diffused daylight panels.
                </p>
              </div>

              {/* Principle 3 */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-amber-300 font-mono font-bold text-xs">
                  <div className="w-6 h-6 rounded-md bg-amber-950 border border-amber-500/40 flex items-center justify-center text-amber-300">
                    3
                  </div>
                  <span>Resin Yellowness Offset</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Virgin polyester resins carry an intrinsic Gardner color index of 1.0–2.0 (amber undertone, CIELAB $b^* \approx +2.5$). To achieve crisp sky blues, indigos, or violets without muddy greenish hues, add <strong>0.02–0.05% optical violet toner</strong> to cancel matrix yellowness.
                </p>
              </div>

              {/* Principle 4 */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-emerald-300 font-mono font-bold text-xs">
                  <div className="w-6 h-6 rounded-md bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                    4
                  </div>
                  <span>Cure Kinetics & Radical Traps</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  <strong>Carbon Black (PBk7)</strong> is a powerful free-radical scavenger; black-shaded colors (Moss Green, Night Blue, Carmine Red) require <strong>+10% to +20% Cobalt Octoate</strong>. Phthalo blue/green slightly stabilize cure. DPP and Quinacridone are completely peroxide-inert.
                </p>
              </div>

              {/* Principle 5 */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-pink-300 font-mono font-bold text-xs">
                  <div className="w-6 h-6 rounded-md bg-pink-950 border border-pink-500/40 flex items-center justify-center text-pink-300">
                    5
                  </div>
                  <span>Dispersion & Masterbatching</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Pastes must achieve Hegman fineness $\ge 7.0$ (&lt; 15 µm). Never dump pure pigment paste directly into large 500 kg tanks. Pre-blend primary pastes in a 10% carrier masterbatch in monomeric styrene or base resin using a high-shear Cowles dissolver (1800 RPM) to prevent roller streaking.
                </p>
              </div>

              {/* Principle 6 */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-rose-300 font-mono font-bold text-xs">
                  <div className="w-6 h-6 rounded-md bg-rose-950 border border-rose-500/40 flex items-center justify-center text-rose-300">
                    6
                  </div>
                  <span>Spectrophotometric Tolerances</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Match verification under CIE standard illuminant D65 (6500 K daylight, 10° observer). Maintain color deviation ΔE*ab ≤ 1.0 for architectural roof matching:
                  <span className="block font-mono text-white text-[10px] my-0.5">
                    ΔE*ab = √[(ΔL*)² + (Δa*)² + (Δb*)²]
                  </span>
                  Check cured test coupons after exotherm cool-down.
                </p>
              </div>
            </div>

            {/* Complete Primary Mixing Ratios & Formulation Reference Table */}
            <div className="flex flex-col gap-2.5 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-purple-400" />
                  <span className="font-mono font-bold text-white text-xs uppercase">
                    RAL Color Formulations & Primary Mixing Ratio Matrix
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Calculated for Batch Resin: <strong className="text-white">{totalResinKg.toFixed(1)} kg</strong>
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[11px] border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60">
                      <th className="p-2">RAL Code & Name</th>
                      <th className="p-2">Primary Hue</th>
                      <th className="p-2">Pigment PHR</th>
                      <th className="p-2">Total Paste</th>
                      <th className="p-2 min-w-[280px]">Primary Mixing Ratios (% of Pigment)</th>
                      <th className="p-2">Chemistry & CIELAB</th>
                      <th className="p-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {RAL_COLORS.map((ral) => {
                      const batchCalc = calculateBatchPigmentComponents(ral, totalResinKg);
                      const isCurrent = selectedRal.code === ral.code;

                      return (
                        <tr
                          key={ral.code}
                          className={`hover:bg-slate-900/80 transition-colors ${
                            isCurrent ? 'bg-purple-950/20' : ''
                          }`}
                        >
                          <td className="p-2">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-4 h-4 rounded border border-white/20 shrink-0"
                                style={{ backgroundColor: ral.hex }}
                              />
                              <div>
                                <strong className="text-white block">{ral.code}</strong>
                                <span className="text-[10px] text-slate-400 block">{ral.name}</span>
                              </div>
                            </div>
                          </td>

                          <td className="p-2">
                            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] uppercase font-bold text-purple-300">
                              {ral.primaryHue}
                            </span>
                          </td>

                          <td className="p-2 text-slate-300">
                            {ral.recommendedPigment}% PHR
                          </td>

                          <td className="p-2 text-cyan-300 font-bold">
                            {batchCalc.totalPigmentGrams} g
                          </td>

                          <td className="p-2">
                            <div className="flex flex-col gap-1">
                              {/* Visual mini-bar */}
                              <div className="w-full h-2 rounded overflow-hidden flex border border-slate-800 bg-slate-900">
                                {batchCalc.components.map((c, i) => (
                                  <div
                                    key={i}
                                    style={{
                                      width: `${c.ratioPercent}%`,
                                      backgroundColor: c.colorHex,
                                    }}
                                    title={`${c.name}: ${c.ratioPercent}%`}
                                  />
                                ))}
                              </div>
                              {/* Text components */}
                              <div className="text-[10px] text-slate-400 flex flex-wrap gap-x-2">
                                {batchCalc.components.map((c, i) => (
                                  <span key={i} className="text-[9px]">
                                    <strong className="text-slate-200">{c.ratioPercent}%</strong> {c.hue} ({c.grams}g)
                                  </span>
                                ))}
                              </div>
                            </div>
                          </td>

                          <td className="p-2 text-[10px] text-slate-400 max-w-xs">
                            <div className="truncate text-slate-300">{ral.mixRatio.pigmentChemistry}</div>
                            <div className="text-[9px] text-slate-500 font-mono">
                              L*: {ral.mixRatio.cielab.L} | a*: {ral.mixRatio.cielab.a} | b*: {ral.mixRatio.cielab.b}
                            </div>
                          </td>

                          <td className="p-2 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                handleSelectColor(ral);
                                setActiveTab('swatches');
                              }}
                              className="px-2.5 py-1 bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white rounded text-[10px] border border-purple-500/40 transition-colors font-bold"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Step-by-Step Batch Calculation Formula Guide */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-3 font-mono">
              <span className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Mathematical Dosing Formula for Shop-Floor Technicians</span>
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] text-slate-300">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px] mb-1">Step 1: Total Pigment Paste Mass</div>
                  <div className="font-bold text-emerald-400 bg-slate-950 p-2 rounded border border-slate-850 text-xs">
                    M_pigment = Resin (kg) × (PHR / 100) × 1000 g
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    E.g., 50 kg resin @ 1.0% PHR = 500 g total paste.
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px] mb-1">Step 2: Primary Component Paste Mass</div>
                  <div className="font-bold text-purple-300 bg-slate-950 p-2 rounded border border-slate-850 text-xs">
                    m_i = M_pigment × (Ratio %_i / 100)
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    E.g., Signal Violet: 500g × 82% = 410g Violet + 60g White + 30g Red.
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                  <div className="text-slate-400 text-[10px] mb-1">Step 3: Catalyst / Promoter Verification</div>
                  <div className="font-bold text-amber-300 bg-slate-950 p-2 rounded border border-slate-850 text-xs">
                    MEKP = 1.5–2.0% PHR | Cobalt = 0.20–0.25% PHR
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    If Black % &gt; 5%, bump cobalt by +0.05% to avoid green undercure.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Resin Yellowing Removal & De-Yellowing Guide */}
        {activeTab === 'deyellowing' && (
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col gap-5 text-xs text-slate-300">
            {/* Top Overview Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-purple-950/60 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span>Effective Removal & Prevention of Yellowing in Polyester Resins</span>
                  </h3>
                  <span className="px-2 py-0.5 bg-amber-900/60 border border-amber-500/40 text-[10px] font-mono text-amber-300 rounded font-bold">
                    Gardner & YI Restoration
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Resin yellowing occurs in three distinct phases: <strong>virgin synthesis amber cast (Gardner 1.5–3.0)</strong>, <strong>high-exotherm cure burn (&gt; 140°C)</strong>, and <strong>cured outdoor UV photodegradation (ΔYI)</strong>. Effective de-yellowing combines <em>subtractive optical toning</em>, <em>fluorescent whitening agents (FWA)</em>, and <em>chemical/micro-abrasive restoration</em>.
                </p>
              </div>
              <div className="bg-slate-950 px-3 py-2 rounded-lg border border-amber-500/30 font-mono text-center shrink-0">
                <div className="text-[10px] text-slate-400">Current Resin Batch</div>
                <div className="text-amber-400 font-bold text-sm">{deyellowBatchResinKg.toFixed(1)} kg Resin</div>
              </div>
            </div>

            {/* Interactive Liquid Resin De-Yellowing & Optical Brightener Calibrator */}
            <div className="p-4 rounded-xl bg-slate-950 border border-purple-500/30 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-purple-400" />
                  <span className="font-mono font-bold text-white text-xs uppercase">
                    Interactive Liquid Resin Water-White Neutralization Calibrator
                  </span>
                </div>
                <span className="text-[10px] font-mono text-purple-300">
                  Target: Gardner &lt; 0.5 (Crystal Clear Water-White)
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Sliders & Controls (7 Cols) */}
                <div className="lg:col-span-7 flex flex-col gap-3.5">
                  {/* Optical Toner Slider */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                        <Pipette className="w-3.5 h-3.5 text-purple-400" />
                        <span>Optical Violet / Blue Toner (Subtractive Neutralizer):</span>
                      </span>
                      <span className="font-mono font-bold text-purple-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-700">
                        {opticalTonerPpm} ppm ({scaledTonerGrams} g)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="30"
                      step="1"
                      value={opticalTonerPpm}
                      onChange={(e) => setOpticalTonerPpm(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-slate-500">
                      <span>5 ppm (Mild Amber Offset)</span>
                      <span>12 ppm (Recommended Standard)</span>
                      <span>30 ppm (Dense Yellowing Offset)</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-snug">
                      Carbazole Violet (PV23) paste micro-dosed to optically counterbalance the +2.5 b* amber yellowness of virgin resin via subtractive wavelength absorption.
                    </p>
                  </div>

                  {/* Optical Brightener Slider */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        <span>Fluorescent Whitening Agent (OB / OB-1 Brightener):</span>
                      </span>
                      <span className="font-mono font-bold text-amber-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-700">
                        {opticalBrightenerPpm} ppm ({scaledBrightenerGrams} g)
                      </span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="200"
                      step="10"
                      value={opticalBrightenerPpm}
                      onChange={(e) => setOpticalBrightenerPpm(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-slate-500">
                      <span>50 ppm (Subtle Luster)</span>
                      <span>100 ppm (Standard Commercial)</span>
                      <span>200 ppm (Ultra High Radiance)</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-snug">
                      Bis-benzoxazole thiophene (OB-1) absorbs UV light (360–380 nm) and re-emits blue fluorescence (430–440 nm), increasing apparent daylight transmission.
                    </p>
                  </div>

                  {/* Phosphite Antioxidant Toggle */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="text-xs font-semibold text-slate-200">Secondary Phosphite Antioxidant (Irgafos 168)</div>
                        <div className="text-[10px] text-slate-400">Decomposes hydroperoxides during monomer dilution and bulk storage (0.08% PHR)</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUsePhosphiteAntioxidant(!usePhosphiteAntioxidant)}
                      className={`px-3 py-1 rounded text-[11px] font-mono font-bold transition-all ${
                        usePhosphiteAntioxidant
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {usePhosphiteAntioxidant ? 'ACTIVE (40g)' : 'DISABLED'}
                    </button>
                  </div>
                </div>

                {/* Live Output & Color Shift Metrics (5 Cols) */}
                <div className="lg:col-span-5 flex flex-col gap-3 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                  <span className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <span>Projected Clarity & Gardner Shift</span>
                  </span>

                  {/* Before vs After Visualizer */}
                  <div className="grid grid-cols-2 gap-2 text-center font-mono">
                    <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-600/30">
                      <span className="text-[10px] text-amber-300 block">Raw Virgin Resin</span>
                      <div className="w-full h-8 rounded mt-1 border border-amber-500/40 bg-amber-400/30 flex items-center justify-center text-xs font-bold text-amber-200">
                        Gardner 2.5
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1 block">b* = +2.8 (Amber cast)</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30">
                      <span className="text-[10px] text-cyan-300 block">De-Yellowed State</span>
                      <div className="w-full h-8 rounded mt-1 border border-cyan-400/40 bg-cyan-200/20 flex items-center justify-center text-xs font-bold text-cyan-200">
                        Gardner {estimatedNeutralizedGardner}
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1 block">b* = {Math.max(-0.2, (2.8 + estimatedDeltaB)).toFixed(1)} (Water-White)</span>
                    </div>
                  </div>

                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="p-2 bg-slate-950 rounded border border-slate-800">
                      <span className="text-[9px] text-slate-500 uppercase block">Optical Toner Mass</span>
                      <strong className="text-purple-300 text-xs">{scaledTonerGrams} g</strong>
                    </div>
                    <div className="p-2 bg-slate-950 rounded border border-slate-800">
                      <span className="text-[9px] text-slate-500 uppercase block">OB-1 Brightener Mass</span>
                      <strong className="text-amber-300 text-xs">{scaledBrightenerGrams} g</strong>
                    </div>
                    <div className="p-2 bg-slate-950 rounded border border-slate-800">
                      <span className="text-[9px] text-slate-500 uppercase block">Yellowness Shift (Δb*)</span>
                      <strong className="text-emerald-400 text-xs">{estimatedDeltaB} b*</strong>
                    </div>
                    <div className="p-2 bg-slate-950 rounded border border-slate-800">
                      <span className="text-[9px] text-slate-500 uppercase block">Light Pass Gain</span>
                      <strong className="text-cyan-300 text-xs">+{estimatedTransmittanceGain}% Pass</strong>
                    </div>
                  </div>

                  {/* Action button */}
                  <button
                    type="button"
                    onClick={handleApplyWaterWhite}
                    className="w-full mt-1 py-2 px-3 rounded-lg bg-gradient-to-r from-purple-600 via-cyan-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply Water-White Formulation to Batch</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Recommended Color Additives Mixing Ratio & Masterbatch Protocol */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-3 font-mono">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-amber-300 uppercase flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-amber-400" />
                  <span>Recommended Color Additive Mixing Ratios & Masterbatch Dilution Protocol</span>
                </span>
                <span className="text-[10px] text-slate-400">
                  Precision Shop-Floor Dosing Standard
                </span>
              </div>

              {/* 3 Toner Recipes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
                <div className="p-3 rounded-lg bg-slate-900 border border-purple-500/30 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <strong className="text-purple-300 text-xs">Standard Amber Offset</strong>
                    <span className="text-[9px] bg-purple-950 px-1.5 py-0.5 rounded text-purple-300 border border-purple-500/30">Gardner 1.5–2.5</span>
                  </div>
                  <div className="font-bold text-white text-xs bg-slate-950 p-2 rounded border border-slate-800">
                    75% Violet (PV23) + 25% Blue (PB15:3)
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                    Standard primary neutralizer for typical orthophthalic/isophthalic amber cast. Targets exact b* = 0.0 ± 0.2.
                  </p>
                  <div className="text-[10px] text-emerald-400 font-mono mt-auto pt-1 border-t border-slate-800">
                    Dosing: 10–12 ppm (0.5–0.6 g / 50kg)
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-rose-500/30 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <strong className="text-rose-300 text-xs">Greenish-Amber Offset</strong>
                    <span className="text-[9px] bg-rose-950 px-1.5 py-0.5 rounded text-rose-300 border border-rose-500/30">Cobalt High</span>
                  </div>
                  <div className="font-bold text-white text-xs bg-slate-950 p-2 rounded border border-slate-800">
                    90% Violet (PV23) + 10% Magenta (PR122)
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                    Used when resin exhibits greenish-yellow cast from cobalt over-acceleration. Omits blue to avoid intensifying green.
                  </p>
                  <div className="text-[10px] text-emerald-400 font-mono mt-auto pt-1 border-t border-slate-800">
                    Dosing: 12–15 ppm (0.6–0.75 g / 50kg)
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-cyan-500/30 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <strong className="text-cyan-300 text-xs">Warm Orange-Amber Offset</strong>
                    <span className="text-[9px] bg-cyan-950 px-1.5 py-0.5 rounded text-cyan-300 border border-cyan-500/30">Heavy Cook</span>
                  </div>
                  <div className="font-bold text-white text-xs bg-slate-950 p-2 rounded border border-slate-800">
                    60% Violet (PV23) + 40% Blue (PB15:3)
                  </div>
                  <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                    Designed for thermal scorch or heavily cooked resins with strong red/orange undertones. High blue shift restores crisp daylight pass.
                  </p>
                  <div className="text-[10px] text-emerald-400 font-mono mt-auto pt-1 border-t border-slate-800">
                    Dosing: 12–18 ppm (0.6–0.9 g / 50kg)
                  </div>
                </div>
              </div>

              {/* Masterbatch Dilution Protocol Bar */}
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px]">
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <strong className="text-white">Shop-Floor 1:100 (1.0%) Styrene Masterbatch Dilution Protocol:</strong>
                    <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                      Never dose neat pigment paste directly at &lt; 1g. Mix <strong>10 g Neat Toner Blend</strong> into <strong>990 g Monomeric Styrene</strong>. Dose <strong>50 g to 75 g of 1.0% Masterbatch per 50 kg resin</strong> for streak-free dispersion.
                    </p>
                  </div>
                </div>
                <div className="bg-slate-950 px-3 py-1.5 rounded border border-slate-800 font-mono text-[10px] shrink-0 text-right">
                  <div className="text-slate-400">Additive Synergy Ratio</div>
                  <div className="text-amber-300 font-bold">OB-1 : Toner = 8:1 to 10:1</div>
                </div>
              </div>
            </div>

            {/* Three Technical Modules: A, B, C */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Module A: Liquid Virgin Resin */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-3">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <div className="w-6 h-6 rounded-md bg-amber-950 border border-amber-500/40 flex items-center justify-center text-amber-300 font-mono font-bold text-xs">
                    A
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">Liquid Virgin Resin De-Yellowing</h4>
                    <span className="text-[10px] text-slate-400 font-mono">Inherent Synthesis Yellowness</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-[11px] text-slate-300 leading-relaxed">
                  <div>
                    <strong className="text-amber-300 block mb-0.5">1. Root Chemical Cause:</strong>
                    Thermal oxidation during polycondensation (190–210°C) of phthalic/maleic anhydride with glycols creates polycyclic quinoid chromophores and traces of benzaldehyde in styrene, causing Gardner index 1.5–3.0.
                  </div>
                  <div>
                    <strong className="text-purple-300 block mb-0.5">2. Optical Subtractive Neutralization:</strong>
                    Micro-dosing <strong>8–15 ppm Carbazole Violet (PV23)</strong> or Cobalt Blue toner paste optically absorbs 570–590 nm yellow wavelengths, dropping the CIELAB b* from +2.8 down to ≤ +0.3 without opacity loss.
                  </div>
                  <div>
                    <strong className="text-cyan-300 block mb-0.5">3. Fluorescent Whitening (OB-1):</strong>
                    Adding <strong>80–120 ppm OB-1</strong> absorbs invisible ambient UV (360–380 nm) and fluoresces blue light (430–440 nm), increasing total luminous reflectance and masking resin haze.
                  </div>
                  <div>
                    <strong className="text-emerald-300 block mb-0.5">4. Liquid Bleaching Earth Adsorption:</strong>
                    For high-clarity sheets, circulate liquid resin through a packed column of <strong>activated bleaching earth / attapulgite clay</strong> at 50°C to physically adsorb dark quinoid color bodies.
                  </div>
                </div>
              </div>

              {/* Module B: Exotherm Scorching Suppression */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-3">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <div className="w-6 h-6 rounded-md bg-rose-950 border border-rose-500/40 flex items-center justify-center text-rose-300 font-mono font-bold text-xs">
                    B
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">Exotherm Cure Burn Suppression</h4>
                    <span className="text-[10px] text-slate-400 font-mono">High-Heat Polymerization Scorch</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-[11px] text-slate-300 leading-relaxed">
                  <div>
                    <strong className="text-rose-300 block mb-0.5">1. Root Chemical Cause:</strong>
                    When peak crosslinking exotherm temperature exceeds <strong>140°C</strong> in continuous ovens or thick sections (&gt; 2.5 mm), thermal scorch degrades ester linkages, turning the core matrix permanently brownish-yellow.
                  </div>
                  <div>
                    <strong className="text-amber-300 block mb-0.5">2. Cobalt Promoter Optimization:</strong>
                    Cap Cobalt Octoate (6%) at <strong>0.15%–0.20% PHR</strong>. Over-promoting with cobalt (&gt; 0.35%) leaves residual trivalent cobalt oxide complexes that impart a persistent greenish-yellow tint.
                  </div>
                  <div>
                    <strong className="text-emerald-300 block mb-0.5">3. Staged Peroxide Initiator Blends:</strong>
                    Replace pure rapid MEKP with a staged dual system: <strong>1.2% standard MEKP + 0.4% Cumene Hydroperoxide (CHP)</strong> or Acetyl Acetone Peroxide (AAP) to broaden the exotherm curve and lower peak temp by 18°C.
                  </div>
                  <div>
                    <strong className="text-cyan-300 block mb-0.5">4. Continuous Tunnel Temperature Zoning:</strong>
                    Profile the curing tunnel into 3 progressive heat zones (60°C Entry → 85°C Gel Peak → 115°C Post-cure Anneal) with active air-chiller roll takeoff to prevent localized hot-spot scorching.
                  </div>
                </div>
              </div>

              {/* Module C: Cured / Weathered FRP Sheet Restoration */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-3">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                  <div className="w-6 h-6 rounded-md bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-mono font-bold text-xs">
                    C
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">Weathered Cured Sheet Restoration</h4>
                    <span className="text-[10px] text-slate-400 font-mono">Outdoor UV Photodegradation (ΔYI)</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-[11px] text-slate-300 leading-relaxed">
                  <div>
                    <strong className="text-cyan-300 block mb-0.5">Step 1: Chemical Chelation & Oxidation Wash</strong>
                    Apply an aqueous wash containing <strong>8% Oxalic Acid + 4% Hydrogen Peroxide (H2O2)</strong> with non-ionic surfactant. Dwell for 15 minutes. Oxalic acid chelates yellow iron/mineral stains; peroxide oxidizes conjugated quinone double bonds.
                  </div>
                  <div>
                    <strong className="text-purple-300 block mb-0.5">Step 2: Micro-Abrasive Stratum Stripping</strong>
                    Because UV photodegradation is confined to the topmost <strong>15–35 µm</strong> resin skin, wet-sand progressively with <strong>P1000 → P1500 → P2000</strong> abrasive paper. This strips the yellow oxidized micro-layer without exposing glass fibers.
                  </div>
                  <div>
                    <strong className="text-emerald-300 block mb-0.5">Step 3: Rotary Machine Compounding</strong>
                    Buff with a rotary buffer (1200–1500 RPM) using diminishing alumina micro-abrasive compounding paste and medium foam pad to restore optical specular gloss and eliminate sanding micro-scratches.
                  </div>
                  <div>
                    <strong className="text-amber-300 block mb-0.5">Step 4: Protective UV Clearcoat Seal</strong>
                    Spray an aliphatic <strong>2K acrylic-polyurethane UV clearcoat (1.5% UVA/HALS)</strong> or roll-laminate a 36 µm UV-stabilized PVDF / Mylar film to seal the restored surface and prevent yellowing re-emergence.
                  </div>
                </div>
              </div>
            </div>

            {/* Long-Term Preventative Resin Formulations Matrix */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-3 font-mono">
              <span className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Standard Preventive Formulations to Prevent Resin Yellowing from Re-Occurring</span>
              </span>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[11px] text-slate-300">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex flex-col gap-1">
                  <div className="text-emerald-400 font-bold text-xs">1. Base Resin Backbone</div>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Specify <strong>Neopentyl Glycol (NPG) Isophthalic</strong> resin. NPG has zero tertiary hydrogens, providing 4× higher photolytic stability than standard orthophthalic glycols.
                  </p>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex flex-col gap-1">
                  <div className="text-purple-400 font-bold text-xs">2. Synergistic UVA + HALS</div>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Dose <strong>0.25% Benzotriazole (Tinuvin 328) + 0.12% HALS (Tinuvin 770)</strong>. The 2:1 UVA/HALS ratio blocks UV-A absorption and rapidly quenches free radicals.
                  </p>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex flex-col gap-1">
                  <div className="text-cyan-400 font-bold text-xs">3. MMA Comonomer Dilution</div>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Substitute <strong>10%–15% Methyl Methacrylate (MMA)</strong> into the styrene reactive diluent. MMA interrupts long polystyrene chains that form yellow polyene chromophores.
                  </p>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex flex-col gap-1">
                  <div className="text-amber-400 font-bold text-xs">4. Storage & Peroxide Control</div>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Store virgin resin below <strong>25°C</strong> in opaque lined steel drums. Maintain dissolved oxygen at 20–30 ppm to prevent spontaneous styrene peroxide radical generation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Photoluminescent Glow in the Dark Studio */}
        {activeTab === 'glow' && (
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col gap-5 text-xs text-slate-300">
            {/* Top Overview Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-cyan-950/70 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-emerald-950/50">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Moon className="w-5 h-5 text-lime-400" />
                    <span>Photoluminescent Glow-in-the-Dark Compounding Guide</span>
                  </h3>
                  <span className="px-2 py-0.5 bg-emerald-900/60 border border-emerald-500/40 text-[10px] font-mono text-lime-300 rounded font-bold">
                    DIN 67510 Class C & D
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Glow-in-the-dark FRP composites utilize <strong>rare-earth doped inorganic phosphors</strong> (SrAl2O4:Eu,Dy). They absorb ambient ultraviolet and visible light (200–450 nm), storing photon energy in crystal lattices and steadily re-emitting bright luminescence for <strong>10 to 12+ hours</strong> in pitch darkness.
                </p>
              </div>
              <div className="bg-slate-950 px-3 py-2 rounded-lg border border-emerald-500/40 font-mono text-center shrink-0">
                <div className="text-[10px] text-slate-400">Current Production Batch</div>
                <div className="text-lime-400 font-bold text-sm">{totalResinKg.toFixed(1)} kg Resin</div>
              </div>
            </div>

            {/* Main Interactive Studio Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left: Glow Phosphor Swatches (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400 font-semibold uppercase">
                    Rare-Earth Photoluminescent Phosphors (Aluminate Matrix)
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[10px]">Preview State:</span>
                    <button
                      type="button"
                      onClick={() => setIsNightSimulated(!isNightSimulated)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 transition-all ${
                        isNightSimulated
                          ? 'bg-lime-500/20 text-lime-300 border border-lime-500/50 shadow-sm'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                      }`}
                    >
                      {isNightSimulated ? <Moon className="w-3 h-3 text-lime-400" /> : <Sun className="w-3 h-3 text-amber-400" />}
                      <span>{isNightSimulated ? '🌙 Night Glow' : '☀️ Daylight'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2.5 max-h-[460px] overflow-y-auto pr-1">
                  {GLOW_OPTIONS.map((glow) => {
                    const isSelected = selectedGlowId === glow.id;
                    const previewColor = isNightSimulated ? glow.glowHex : glow.daytimeHex;

                    return (
                      <div
                        key={glow.id}
                        onClick={() => {
                          soundFx.playClick();
                          setSelectedGlowId(glow.id);
                        }}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-2 relative overflow-hidden ${
                          isSelected
                            ? 'bg-slate-900 border-lime-400 ring-2 ring-lime-500/40 shadow-xl shadow-lime-950/40'
                            : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            {/* Color Swatch with simulated glow shadow */}
                            <div
                              className="w-10 h-10 rounded-xl shrink-0 border border-white/30 relative flex items-center justify-center transition-all duration-300"
                              style={{
                                backgroundColor: previewColor,
                                boxShadow: isNightSimulated ? `0 0 16px ${glow.glowHex}80` : 'none',
                              }}
                            >
                              {isNightSimulated ? (
                                <Moon className="w-4 h-4 text-slate-950 drop-shadow" />
                              ) : (
                                <Sun className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white font-mono">{glow.name}</span>
                                <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[9px] font-mono text-cyan-300">
                                  {glow.peakWavelengthNm} nm
                                </span>
                              </div>
                              <div className="text-[10px] text-lime-400 font-mono font-medium">
                                Glow Hue: {glow.glowColorName} • {glow.dinClass}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="text-xs font-bold font-mono text-emerald-400 block">
                              {glow.afterglowHours}h Glow
                            </span>
                            <span className="text-[9px] font-mono text-slate-500">
                              {glow.luminanceMcd} mcd/m²
                            </span>
                          </div>
                        </div>

                        <div className="text-[10px] text-slate-400 bg-slate-950/60 p-1.5 rounded border border-slate-850">
                          <strong className="text-slate-300 font-mono">Chemistry: </strong>
                          <span>{glow.chemicalFormula} • </span>
                          <strong className="text-purple-300">Application: </strong>
                          <span>{glow.application}</span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-mono pt-1 border-t border-slate-850">
                          <span className="text-slate-400">
                            Daytime look: <strong className="text-slate-200">Milky Translucent Cream</strong>
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApplyGlow(glow, glowPhr, isNightSimulated);
                            }}
                            className="px-3 py-1 rounded text-[10px] font-mono font-bold bg-lime-600/30 hover:bg-lime-600 text-lime-200 hover:text-white border border-lime-500/40 transition-all flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Select Phosphor</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Dosing & Afterglow Simulator (5 Cols) */}
              <div className="lg:col-span-5 flex flex-col gap-3.5 bg-slate-950 p-4 rounded-xl border border-lime-500/30 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold text-lime-300 uppercase flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4 text-lime-400" />
                    <span>Phosphor Dosing Calibrator</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-lime-950 text-lime-300 border border-lime-500/30">
                    {activeGlowOption.glowColorName}
                  </span>
                </div>

                {/* Hero Glow Preview Card */}
                <div
                  className="p-4 rounded-xl border border-slate-800 flex flex-col items-center justify-center gap-2 relative overflow-hidden transition-all duration-500 text-center"
                  style={{
                    backgroundColor: isNightSimulated ? '#020617' : '#0f172a',
                    boxShadow: isNightSimulated ? `inset 0 0 40px ${activeGlowOption.glowHex}40` : 'none',
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-2xl border-2 border-white/40 flex items-center justify-center transition-all duration-500"
                    style={{
                      backgroundColor: isNightSimulated ? activeGlowOption.glowHex : activeGlowOption.daytimeHex,
                      boxShadow: isNightSimulated ? `0 0 30px ${activeGlowOption.glowHex}` : 'none',
                    }}
                  >
                    <Moon className={`w-8 h-8 ${isNightSimulated ? 'text-slate-950' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <strong className="text-xs font-mono text-white block">
                      {activeGlowOption.name}
                    </strong>
                    <span className="text-[10px] font-mono text-lime-400">
                      {isNightSimulated ? `Active Night Glow (${activeGlowOption.peakWavelengthNm} nm)` : 'Ambient Daytime Appearance'}
                    </span>
                  </div>
                </div>

                {/* Phosphor Loading Slider */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5 text-lime-400" /> Phosphor Loading (PHR):
                    </span>
                    <span className="font-mono font-bold text-lime-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-700">
                      {glowPhr.toFixed(1)}% PHR ({scaledGlowPowderKg.toFixed(2)} kg)
                    </span>
                  </div>

                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={glowPhr}
                    onChange={(e) => setGlowPhr(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-lime-400"
                  />

                  <div className="flex justify-between text-[9px] font-mono text-slate-500">
                    <span>5% (Subtle Accent)</span>
                    <span>15% (DIN Class C Safety)</span>
                    <span>30% (DIN Class D Max)</span>
                  </div>
                </div>

                {/* Batch Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-500 uppercase block">Total Phosphor Mass</span>
                    <strong className="text-lime-300 text-xs">{scaledGlowPowderKg} kg ({scaledGlowPowderGrams} g)</strong>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-500 uppercase block">Aerosil 200 Silica (1.5%)</span>
                    <strong className="text-cyan-300 text-xs">{scaledFumedSilicaGrams} g (Thixotrope)</strong>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-500 uppercase block">Initial Luminance (10m)</span>
                    <strong className="text-emerald-400 text-xs">{calculatedLuminance} mcd/m²</strong>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-500 uppercase block">Glow Duration</span>
                    <strong className="text-amber-300 text-xs">{calculatedPersistence} Hours</strong>
                  </div>
                </div>

                {/* Compounding Advisory Notice */}
                <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-[10px] text-slate-300 leading-relaxed">
                  <strong className="text-lime-400 block mb-0.5">Shop-Floor Mixing Rule:</strong>
                  Do NOT use high-shear Cowles blades (&gt; 400 RPM) as mechanical shear fractures the crystalline lattice and permanently reduces phosphorescence by up to 70%. Blend gently with low-speed anchor or paddle agitator.
                </div>

                {/* Apply Button */}
                <button
                  type="button"
                  onClick={() => handleApplyGlow(activeGlowOption, glowPhr, isNightSimulated)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-lime-600 hover:from-emerald-500 hover:to-lime-500 font-bold text-xs text-white shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Apply {activeGlowOption.glowColorName} to Active Sheet</span>
                </button>
              </div>
            </div>

            {/* Master Compounding Mixing Ratio & Exact Quantity Bill of Materials (BOM) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-lime-500/40 shadow-xl flex flex-col gap-4">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-lime-950 border border-lime-500/50 flex items-center justify-center text-lime-400 shrink-0">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Mixing Ratio & Exact Quantity Compounding Formulator</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lime-950 text-lime-300 border border-lime-500/30">
                        Live Scaled BOM
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Standardized Stoichiometric Proportions • DIN 67510 Class A–D • Gram & Kilogram Precision
                    </p>
                  </div>
                </div>

                {/* Mixing Ratio Badge */}
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-lime-500/30 text-right font-mono text-[10px] shrink-0">
                  <span className="text-slate-400">Weight Ratio:</span>
                  <span className="text-lime-300 font-bold">
                    100 Resin : {glowPhr.toFixed(1)} Phosphor : 1.5 Silica : 0.2 Co : 1.5 MEKP
                  </span>
                </div>
              </div>

              {/* Tier Selector & Batch Sizing Controls */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
                {/* Batch Size Selector (7 Cols) */}
                <div className="lg:col-span-7 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5 font-mono">
                      <Scale className="w-3.5 h-3.5 text-lime-400" />
                      <span>Select or Enter Resin Batch Mass:</span>
                    </span>
                    <span className="font-mono font-bold text-lime-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                      {glowBatchResinKg.toFixed(1)} kg Base Resin
                    </span>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                    {[
                      { label: '1 kg', value: 1, desc: 'Lab / Coupon' },
                      { label: '5 kg', value: 5, desc: 'Pail' },
                      { label: '10 kg', value: 10, desc: 'Workshop' },
                      { label: '25 kg', value: 25, desc: 'Carboy' },
                      { label: '50 kg', value: 50, desc: 'Drum Half' },
                      { label: '100 kg', value: 100, desc: 'Bulk' },
                      {
                        label: `Job (${totalResinKg.toFixed(1)}k)`,
                        value: totalResinKg > 0 ? totalResinKg : 50,
                        desc: 'Active Sheet'
                      },
                    ].map((preset) => {
                      const isSelected = Math.abs(glowBatchResinKg - preset.value) < 0.1;
                      return (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            soundFx.playClick();
                            setGlowBatchResinKg(preset.value);
                          }}
                          className={`py-1.5 px-1 rounded-lg text-center font-mono border transition-all ${
                            isSelected
                              ? 'bg-lime-500/20 border-lime-400 text-lime-300 font-bold shadow-sm'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
                          }`}
                        >
                          <div className="text-[11px] leading-tight font-bold">{preset.label}</div>
                          <div className="text-[8px] text-slate-500 truncate">{preset.desc}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Manual Slider / Number Input */}
                  <div className="flex items-center gap-3 pt-1">
                    <input
                      type="range"
                      min="1"
                      max="200"
                      step="1"
                      value={glowBatchResinKg}
                      onChange={(e) => setGlowBatchResinKg(Number(e.target.value))}
                      className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-lime-400"
                    />
                    <div className="flex items-center gap-1 shrink-0 font-mono text-[11px]">
                      <input
                        type="number"
                        min="0.5"
                        max="1000"
                        step="0.5"
                        value={glowBatchResinKg}
                        onChange={(e) => setGlowBatchResinKg(Math.max(0.5, Number(e.target.value)))}
                        className="w-16 px-2 py-1 bg-slate-900 border border-slate-700 rounded text-center text-white font-bold text-xs focus:outline-none focus:border-lime-400"
                      />
                      <span className="text-slate-400 text-xs">kg</span>
                    </div>
                  </div>
                </div>

                {/* Glow Performance Tier Presets (5 Cols) */}
                <div className="lg:col-span-5 flex flex-col gap-2 border-t lg:border-t-0 lg:border-l border-slate-800 lg:pl-3.5 pt-2 lg:pt-0">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="font-semibold text-slate-200 flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Glow Intensity Tier:</span>
                    </span>
                    <span className="text-[10px] text-lime-400 font-bold">{glowPhr.toFixed(0)}% PHR Loading</span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      {
                        id: 'accent',
                        name: 'Tier 1: Subtle Accent',
                        phr: 8,
                        hours: '3–4h',
                        gramsPerKg: '80 g / kg',
                        din: 'Class A'
                      },
                      {
                        id: 'standard',
                        name: 'Tier 2: Standard Arch.',
                        phr: 15,
                        hours: '8–10h',
                        gramsPerKg: '150 g / kg',
                        din: 'Class B/C'
                      },
                      {
                        id: 'safety_c',
                        name: 'Tier 3: Safety Egress',
                        phr: 20,
                        hours: '10–12h',
                        gramsPerKg: '200 g / kg',
                        din: 'DIN Class C'
                      },
                      {
                        id: 'high_d',
                        name: 'Tier 4: Maximum Mil.',
                        phr: 28,
                        hours: '12–14h+',
                        gramsPerKg: '280 g / kg',
                        din: 'DIN Class D'
                      },
                    ].map((tier) => {
                      const isTierActive = Math.abs(glowPhr - tier.phr) <= 1;
                      return (
                        <button
                          key={tier.id}
                          type="button"
                          onClick={() => {
                            soundFx.playClick();
                            setGlowPhr(tier.phr);
                          }}
                          className={`p-1.5 rounded-lg border text-left font-mono transition-all flex flex-col justify-between ${
                            isTierActive
                              ? 'bg-lime-950/80 border-lime-400 text-white shadow-sm ring-1 ring-lime-400'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-850'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] font-bold text-white">
                            <span>{tier.name}</span>
                            <span className="text-lime-400 text-[9px]">{tier.phr}%</span>
                          </div>
                          <div className="flex items-center justify-between text-[9px] text-slate-400 mt-1">
                            <span>{tier.hours}</span>
                            <span className="text-cyan-300">{tier.gramsPerKg}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Exact Compounding Quantity Table (BOM) */}
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left font-mono text-[11px] divide-y divide-slate-800">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="px-3 py-2.5">Compound Ingredient</th>
                      <th className="px-3 py-2.5">Function & Chemical Spec</th>
                      <th className="px-3 py-2.5 text-center">Mixing Ratio (PHR)</th>
                      <th className="px-3 py-2.5 text-center">% by Total Mass</th>
                      <th className="px-3 py-2.5 text-right text-lime-400">Exact Grams (g)</th>
                      <th className="px-3 py-2.5 text-right text-cyan-400">Exact Weight (kg)</th>
                      <th className="px-3 py-2.5">Shop Dispensing Guide</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
                    {/* Row 1: Base Resin */}
                    <tr className="hover:bg-slate-900/90 transition-colors">
                      <td className="px-3 py-2.5 font-bold text-white flex items-center gap-1.5">
                        <Droplet className="w-3.5 h-3.5 text-blue-400" />
                        <span>Base Liquid Thermoset Resin</span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-400 text-[10px]">
                        Water-White Isophthalic / Vinyl Ester (Gardner ≤ 1.0)
                      </td>
                      <td className="px-3 py-2.5 text-center font-bold text-white">100.0 PHR</td>
                      <td className="px-3 py-2.5 text-center text-slate-300">
                        {((scaledResinGrams / totalCompoundedBatchGrams) * 100).toFixed(1)}%
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-white">
                        {scaledResinGrams.toLocaleString()} g
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-white">
                        {glowBatchResinKg.toFixed(3)} kg
                      </td>
                      <td className="px-3 py-2.5 text-slate-400 text-[10px]">
                        Measure tare bucket; verify viscosity 450–650 cP at 25°C
                      </td>
                    </tr>

                    {/* Row 2: Selected Rare-Earth Phosphor */}
                    <tr className="hover:bg-slate-900/90 bg-lime-950/20 transition-colors">
                      <td className="px-3 py-2.5 font-bold text-lime-300 flex items-center gap-1.5">
                        <Moon className="w-3.5 h-3.5 text-lime-400" />
                        <span>{activeGlowOption.name}</span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-300 text-[10px]">
                        {activeGlowOption.chemicalFormula} • 35–55 µm Waterproof Silane Treated
                      </td>
                      <td className="px-3 py-2.5 text-center font-bold text-lime-300">
                        {glowPhr.toFixed(1)} PHR
                      </td>
                      <td className="px-3 py-2.5 text-center font-bold text-lime-400">
                        {phosphorMassPercent}%
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-lime-300 text-xs">
                        {scaledGlowPowderGrams.toLocaleString()} g
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-lime-300 text-xs">
                        {scaledGlowPowderKg.toFixed(3)} kg
                      </td>
                      <td className="px-3 py-2.5 text-lime-200/90 text-[10px]">
                        Weigh dry; add under low-speed anchor agitation (150–250 RPM)
                      </td>
                    </tr>

                    {/* Row 3: Hydrophilic Fumed Silica */}
                    <tr className="hover:bg-slate-900/90 transition-colors">
                      <td className="px-3 py-2.5 font-bold text-cyan-300 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Anti-Settling Fumed Silica (Aerosil 200)</span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-400 text-[10px]">
                        Thixotrope • Prevents 4.0 g/cm³ phosphor gravity settling
                      </td>
                      <td className="px-3 py-2.5 text-center text-cyan-300 font-bold">1.50 PHR</td>
                      <td className="px-3 py-2.5 text-center text-slate-300">
                        {((scaledFumedSilicaGrams / totalCompoundedBatchGrams) * 100).toFixed(1)}%
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-cyan-300">
                        {scaledFumedSilicaGrams.toLocaleString()} g
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-cyan-300">
                        {scaledFumedSilicaKg.toFixed(3)} kg
                      </td>
                      <td className="px-3 py-2.5 text-slate-400 text-[10px]">
                        Premix in resin for 5 min to build thixotropic yield BEFORE phosphor
                      </td>
                    </tr>

                    {/* Row 4: Silane Coupling Agent */}
                    <tr className="hover:bg-slate-900/90 transition-colors">
                      <td className="px-3 py-2.5 font-bold text-purple-300 flex items-center gap-1.5">
                        <FlaskConical className="w-3.5 h-3.5 text-purple-400" />
                        <span>Silane Wetting Agent (KH-570 / MEMO)</span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-400 text-[10px]">
                        Methacryloxy silane • Couples phosphor particles to ester matrix
                      </td>
                      <td className="px-3 py-2.5 text-center text-purple-300 font-bold">
                        {(glowPhr * 0.008).toFixed(2)} PHR
                      </td>
                      <td className="px-3 py-2.5 text-center text-slate-300">
                        {((scaledSilaneAgentGrams / totalCompoundedBatchGrams) * 100).toFixed(2)}%
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-purple-300">
                        {scaledSilaneAgentGrams.toLocaleString()} g
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-purple-300">
                        {(scaledSilaneAgentGrams / 1000).toFixed(3)} kg
                      </td>
                      <td className="px-3 py-2.5 text-slate-400 text-[10px]">
                        Dispense via syringe/pipette; pre-dilute 1:1 with styrene monomer
                      </td>
                    </tr>

                    {/* Row 5: Cobalt Octoate Promoter */}
                    <tr className="hover:bg-slate-900/90 transition-colors">
                      <td className="px-3 py-2.5 font-bold text-rose-300 flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-rose-400" />
                        <span>Cobalt Octoate Promoter (6% Co metal)</span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-400 text-[10px]">
                        Crosslinking accelerator • Cleaves MEKP peroxide at room temp
                      </td>
                      <td className="px-3 py-2.5 text-center text-rose-300 font-bold">0.20 PHR</td>
                      <td className="px-3 py-2.5 text-center text-slate-300">
                        {((scaledCobaltPromoterGrams / totalCompoundedBatchGrams) * 100).toFixed(2)}%
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-rose-300">
                        {scaledCobaltPromoterGrams.toLocaleString()} g ({scaledCobaltPromoterMl} ml)
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-rose-300">
                        {(scaledCobaltPromoterGrams / 1000).toFixed(3)} kg
                      </td>
                      <td className="px-3 py-2.5 text-slate-400 text-[10px]">
                        Disperse thoroughly. NEVER mix directly with pure MEKP (explosive hazard!)
                      </td>
                    </tr>

                    {/* Row 6: MEKP Catalyst */}
                    <tr className="hover:bg-slate-900/90 transition-colors">
                      <td className="px-3 py-2.5 font-bold text-amber-300 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>MEKP Catalyst Initiator (Medium 9% O2)</span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-400 text-[10px]">
                        Free-radical peroxide initiator • Initiates crosslinking polymerization
                      </td>
                      <td className="px-3 py-2.5 text-center text-amber-300 font-bold">1.50 PHR</td>
                      <td className="px-3 py-2.5 text-center text-slate-300">
                        {((scaledMekpInitiatorGrams / totalCompoundedBatchGrams) * 100).toFixed(2)}%
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-amber-300">
                        {scaledMekpInitiatorGrams.toLocaleString()} g ({scaledMekpInitiatorMl} ml)
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-amber-300">
                        {(scaledMekpInitiatorGrams / 1000).toFixed(3)} kg
                      </td>
                      <td className="px-3 py-2.5 text-slate-400 text-[10px]">
                        Add LAST immediately prior to doctor blade wetting; pot life 18–25 min @ 25°C
                      </td>
                    </tr>

                    {/* Total Batch Yield Row */}
                    <tr className="bg-slate-950 font-bold text-white text-xs border-t-2 border-lime-500/50">
                      <td className="px-3 py-3 uppercase flex items-center gap-1.5 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Total Compounded Liquid Yield</span>
                      </td>
                      <td className="px-3 py-3 text-slate-400 text-[10px] font-normal">
                        Finished ready-to-cast photoluminescent thermoset compound
                      </td>
                      <td className="px-3 py-3 text-center text-emerald-400 font-mono">
                        {(100 + glowPhr + 1.5 + (glowPhr * 0.008) + 0.2 + 1.5).toFixed(2)} PHR
                      </td>
                      <td className="px-3 py-3 text-center text-emerald-400 font-mono">100.0%</td>
                      <td className="px-3 py-3 text-right text-emerald-300 font-mono text-sm">
                        {totalCompoundedBatchGrams.toLocaleString()} g
                      </td>
                      <td className="px-3 py-3 text-right text-emerald-300 font-mono text-sm">
                        {totalCompoundedBatchKg.toFixed(2)} kg
                      </td>
                      <td className="px-3 py-3 text-slate-300 text-[10px] font-normal">
                        Ready for continuous nip rolls or mold casting
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Quick-Reference Shop Floor Cards for Standard Drum & Pail Sizes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  {
                    title: '1.0 kg Lab Coupon Batch',
                    resin: '1,000 g Resin',
                    phosphor: `${(glowPhr * 10).toFixed(0)} g Phosphor`,
                    silica: '15.0 g Fumed Silica',
                    cobalt: '2.0 g (2.1 ml) Cobalt 6%',
                    mekp: '15.0 g (13.0 ml) MEKP',
                    yieldKg: `${(1.0 + (glowPhr * 0.01) + 0.015 + 0.002 + 0.015).toFixed(2)} kg total`,
                  },
                  {
                    title: '5.0 kg Pail Batch',
                    resin: '5.0 kg (5,000 g) Resin',
                    phosphor: `${(glowPhr * 50).toFixed(0)} g Phosphor`,
                    silica: '75.0 g Fumed Silica',
                    cobalt: '10.0 g (10.5 ml) Cobalt 6%',
                    mekp: '75.0 g (65.2 ml) MEKP',
                    yieldKg: `${(5.0 * (1 + (glowPhr * 0.01) + 0.015 + 0.002 + 0.015)).toFixed(2)} kg total`,
                  },
                  {
                    title: '25.0 kg Carboy Batch',
                    resin: '25.0 kg Resin',
                    phosphor: `${((glowPhr * 250) / 1000).toFixed(2)} kg (${(glowPhr * 250).toFixed(0)} g)`,
                    silica: '375.0 g Fumed Silica',
                    cobalt: '50.0 g (52.6 ml) Cobalt 6%',
                    mekp: '375.0 g (326 ml) MEKP',
                    yieldKg: `${(25.0 * (1 + (glowPhr * 0.01) + 0.015 + 0.002 + 0.015)).toFixed(2)} kg total`,
                  },
                  {
                    title: '50.0 kg Standard Drum Half',
                    resin: '50.0 kg Resin',
                    phosphor: `${((glowPhr * 500) / 1000).toFixed(2)} kg (${(glowPhr * 500).toFixed(0)} g)`,
                    silica: '750.0 g Fumed Silica',
                    cobalt: '100.0 g (105 ml) Cobalt 6%',
                    mekp: '750.0 g (652 ml) MEKP',
                    yieldKg: `${(50.0 * (1 + (glowPhr * 0.01) + 0.015 + 0.002 + 0.015)).toFixed(2)} kg total`,
                  },
                ].map((card, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-white border-b border-slate-800 pb-1">
                      <span>{card.title}</span>
                      <span className="text-[9px] text-lime-400 font-normal">{card.yieldKg}</span>
                    </div>
                    <div className="text-[10px] space-y-1 text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Resin:</span>
                        <strong className="text-white">{card.resin}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Phosphor:</span>
                        <strong className="text-lime-300">{card.phosphor}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Silica:</span>
                        <span className="text-cyan-300">{card.silica}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Cobalt 6%:</span>
                        <span className="text-rose-300">{card.cobalt}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">MEKP:</span>
                        <span className="text-amber-300">{card.mekp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* The 5 Golden Compounding Rules for Glow in the Dark FRP */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-lime-300 font-mono font-bold text-xs">
                  <div className="w-6 h-6 rounded-md bg-lime-950 border border-lime-500/40 flex items-center justify-center text-lime-300">
                    1
                  </div>
                  <span>Low-Shear Paddle Blending Only</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Strontium aluminate crystals are brittle sintered ceramics (35–55 µm). High-shear dispersing blades or bead mills fracture the micro-crystal lattice, causing rapid non-radiative photon decay and destroying 60%–80% of afterglow luminance.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-cyan-300 font-mono font-bold text-xs">
                  <div className="w-6 h-6 rounded-md bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                    2
                  </div>
                  <span>Waterproof Silane Encapsulation (WP)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Raw untreated aluminates react with ambient moisture or glycol condensates to form non-luminescent aluminum hydroxide Al(OH)3. Always specify <strong>Silane-treated micro-encapsulated waterproof grade (WP)</strong> phosphors for thermoset resins.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-amber-300 font-mono font-bold text-xs">
                  <div className="w-6 h-6 rounded-md bg-amber-950 border border-amber-500/40 flex items-center justify-center text-amber-300">
                    3
                  </div>
                  <span>Anti-Settling Thixotrope Dosing</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Glow phosphor powder has high specific gravity (density approx 3.6 to 4.0 g/cm³) compared to liquid polyester (1.1 g/cm³). Dose <strong>1.5% Fumed Silica (Aerosil 200)</strong> or BYK-410 to generate thixotropic yield stress and prevent heavy particle sediment settling.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-purple-300 font-mono font-bold text-xs">
                  <div className="w-6 h-6 rounded-md bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-300">
                    4
                  </div>
                  <span>White Reflective Backing Layer</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Phosphor crystals emit photons isotropically in all 360° directions. Applying a pure white base layer (gelcoat or resin with 10%–15% TiO2) behind the glow laminate acts as an optical mirror, bouncing back-scattered photons forward and <strong>doubling perceived night lux</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-rose-300 font-mono font-bold text-xs">
                  <div className="w-6 h-6 rounded-md bg-rose-950 border border-rose-500/40 flex items-center justify-center text-rose-300">
                    5
                  </div>
                  <span>Zero Opaque Pigments or Iron Oxides</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Never mix opaque pigments (Carbon Black, TiO2, iron oxides) into the phosphor layer. They absorb excitation photons and smother night emission. If daytime tinting is required, use trace transparent solvent dyes or primary pastes at ≤ 0.05% PHR.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-emerald-300 font-mono font-bold text-xs">
                  <div className="w-6 h-6 rounded-md bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                    6
                  </div>
                  <span>Rapid Sunlight & UV-A Charging</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Phosphors achieve 100% saturation charge in <strong>10–15 minutes of direct sunlight</strong> (1000 lux) or 25 minutes under indoor fluorescent lighting (400 lux). The optical absorption/emission cycle is non-degrading with an outdoor operating lifespan exceeding 20 years.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-slate-950 px-4 sm:px-6 py-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono shrink-0">
          <div className="flex items-center gap-2 text-slate-400">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>RAL Deutsches Institut für Gütesicherung und Kennzeichnung e.V. Specification Standards</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            Close Color Maker
          </button>
        </div>
      </div>
    </div>
  );
};
