import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Award,
  Layers,
  Ruler,
  BarChart3,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Wind,
  Footprints,
  Compass,
  FileSpreadsheet,
  Info,
  Activity,
  Zap,
  ArrowRight,
  ChevronRight,
  Scale,
  Box,
  Package
} from 'lucide-react';
import {
  FRPConfig,
  MaterialCalculations,
  SupportCondition,
  DeflectionLimitCriteria,
  PurlinSpanLoadPoint
} from '../types';
import { evaluateCustomSpanAndLoad, evaluateBoxBaseCalculation } from '../utils/frpCalculations';

interface StructuralLoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: FRPConfig;
  materials: MaterialCalculations;
  onOpenReportModal?: () => void;
}

export const StructuralLoadModal: React.FC<StructuralLoadModalProps> = ({
  isOpen,
  onClose,
  config,
  materials,
  onOpenReportModal,
}) => {
  const [activeTab, setActiveTab] = useState<'roof_purlin' | 'box_base'>(
    config.profile === 'flat' ? 'box_base' : 'roof_purlin'
  );
  const [selectedSpanMm, setSelectedSpanMm] = useState<number>(1200);
  const [appliedLoadKgM2, setAppliedLoadKgM2] = useState<number>(120);
  const [supportCondition, setSupportCondition] = useState<SupportCondition>('double_span');
  const [deflectionCriteria, setDeflectionCriteria] = useState<DeflectionLimitCriteria>('L_60');
  const [activeUnit, setActiveUnit] = useState<'metric_kg' | 'metric_kn' | 'imperial_psf'>('metric_kg');

  // Box Base Dimension Sizer State
  const [boxWidthMm, setBoxWidthMm] = useState<number>(500);
  const [boxLengthMm, setBoxLengthMm] = useState<number>(600);
  const [boxThicknessMm, setBoxThicknessMm] = useState<number>(config.thicknessMm || 2.0);
  const [boxPayloadKg, setBoxPayloadKg] = useState<number>(50);
  const [boxSupportType, setBoxSupportType] = useState<'perimeter_4_edges' | 'supported_2_edges' | 'fully_supported_bottom'>('perimeter_4_edges');
  const [boxLoadType, setBoxLoadType] = useState<'uniform_distributed' | 'center_point_load'>('uniform_distributed');
  const [boxReinforcementType, setBoxReinforcementType] = useState<'csm_mat' | 'woven_roving' | 'sandwich_core'>('csm_mat');

  if (!isOpen) return null;

  const struct = materials.structuralLoad;
  const evalResult = evaluateCustomSpanAndLoad(
    struct,
    selectedSpanMm,
    appliedLoadKgM2,
    supportCondition,
    deflectionCriteria
  );

  const boxResult = evaluateBoxBaseCalculation(
    boxWidthMm,
    boxLengthMm,
    boxThicknessMm,
    boxPayloadKg,
    boxSupportType,
    boxLoadType,
    boxReinforcementType
  );

  const handlePrint = () => {

    window.print();
  };

  // Profile display name
  const profileLabel =
    config.profile === 'corrugated_sinusoidal'
      ? 'Circular Sinusoidal 76/18 Wave'
      : config.profile === 'trapezoidal_rib'
      ? 'Industrial Trapezoidal Box Rib'
      : config.profile === 'profile_7v'
      ? '7-V Corrugated Groove'
      : config.profile === 'profile_6v'
      ? '6-V Corrugated Groove'
      : config.profile === 'curved'
      ? 'Curved Sinusoidal Vault Canopy'
      : 'Flat Unprofiled Sheet';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 font-sans overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl text-white my-4 sm:my-8 max-h-[94vh] flex flex-col">
        {/* Modal Top Bar */}
        <div className="bg-slate-950 px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  Structural Load-Bearing & Purlin Span Analyzer
                </h2>
                <span className="hidden xs:inline-block px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-md">
                  IS 12866 / ASTM D3841
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 font-mono">
                Moment of Inertia (I) • Section Modulus (Z) • Flexural Rigidity (EI) • Uniform & Concentrated Loads
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs"
              title="Print Structural Engineering Calculation Sheet"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-950 px-4 sm:px-6 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('roof_purlin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'roof_purlin'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-blue-300" />
              <span>Roof Purlin Span Analyzer</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('box_base')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                activeTab === 'box_base'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Box className="w-3.5 h-3.5 text-emerald-300" />
              <span>Box Base & Flat Panel Sizer</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                Plain Sheet
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
            {activeTab === 'box_base' ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Navier-Levy Plate Bending & Deflection Engine
              </span>
            ) : (
              <span className="text-blue-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                IS 12866 / ASTM D3841 Corrugated Specification
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-3 sm:p-6 overflow-y-auto flex flex-col gap-5 text-xs text-slate-300">
          {activeTab === 'roof_purlin' ? (
            <>
              {/* Header Summary Banner */}
              <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 p-3.5 sm:p-4 rounded-xl border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">

            <div className="flex items-center gap-3">
              <ShieldCheck className="w-7 h-7 sm:w-9 sm:h-9 text-blue-400 shrink-0" />
              <div>
                <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400">
                  Profile Section Analysis • {profileLabel}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                  {config.thicknessMm}mm FRP Sheet @ Recommended Purlin Span: <span className="text-emerald-400 font-mono">{struct.recommendedMaxPurlinSpanMm} mm</span> ({(struct.recommendedMaxPurlinSpanMm / 304.8).toFixed(1)} ft)
                </h3>
                <p className="text-[11px] text-slate-300 font-sans mt-0.5">
                  Allowable design capacity at recommended span: <strong className="text-amber-300 font-mono">{struct.purlinTable.find(p => p.spanMm === struct.recommendedMaxPurlinSpanMm)?.allowableLoadKgM2 || 140} kg/m²</strong> (Factor of Safety = 2.50)
                </p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-1.5 text-[10px] font-mono shrink-0">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Flex Rigidity: <strong className="text-white">{struct.flexuralRigidityNm2PerM} N·m²/m</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Peak Wind: <strong className="text-cyan-300">{struct.maxWindSpeedCapacityKmph} km/h</strong> ({struct.maxWindPressureKNM2} kN/m²)
              </span>
            </div>
          </div>

          {/* Section 1: Geometric Cross-Sectional & Laminate Mechanical Properties */}
          <div className="bg-slate-950 p-3.5 sm:p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
            <h4 className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-blue-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-blue-400" />
                1. Geometric Section & Elastic Laminate Moduli
              </span>
              <span className="text-[10px] font-normal text-slate-400 normal-case">
                Per 1 Meter (1000 mm) Sheet Width
              </span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-slate-300 font-mono">
              {/* Moment of Inertia */}
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase block">Moment of Inertia (Ixx)</span>
                <strong className="text-xs sm:text-sm text-cyan-300 block mt-0.5">
                  {struct.momentOfInertiaCm4PerM} cm⁴/m
                </strong>
                <span className="text-[9px] text-slate-400 block mt-0.5">
                  {(struct.momentOfInertiaCm4PerM * 10000).toLocaleString()} mm⁴/m
                </span>
              </div>

              {/* Section Modulus */}
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase block">Section Modulus (Zxx)</span>
                <strong className="text-xs sm:text-sm text-emerald-300 block mt-0.5">
                  {struct.sectionModulusCm3PerM} cm³/m
                </strong>
                <span className="text-[9px] text-slate-400 block mt-0.5">
                  {(struct.sectionModulusCm3PerM * 1000).toLocaleString()} mm³/m
                </span>
              </div>

              {/* Flexural Modulus E */}
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase block">Flexural Modulus (E)</span>
                <strong className="text-xs sm:text-sm text-teal-300 block mt-0.5">
                  {struct.flexuralModulusGpa} GPa
                </strong>
                <span className="text-[9px] text-slate-400 block mt-0.5">
                  ASTM D790 / {materials.glassFiberSpec.name.split('(')[0]}
                </span>
              </div>

              {/* Allowable Bending Stress */}
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase block">Allowable Stress (σ_all)</span>
                <strong className="text-xs sm:text-sm text-amber-300 block mt-0.5">
                  {struct.allowableBendingStressMpa} MPa
                </strong>
                <span className="text-[9px] text-slate-400 block mt-0.5">
                  σ_ult: {struct.ultimateFlexuralStrengthMpa} MPa (FS={struct.factorOfSafety})
                </span>
              </div>
            </div>

            {/* Profile Comparison Note */}
            <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Profile Rigidity Advantage: </strong>
                {config.profile === 'flat' ? (
                  <span className="text-rose-300">
                    Flat uncorrugated sheet has very low moment of inertia (0.07 cm⁴/m). Corrugating to 76/18 or Trapezoidal profile enhances structural stiffness by over 130×!
                  </span>
                ) : (
                  <span>
                    Forming the sheet into {profileLabel} with depth {struct.profileDepthMm}mm increases section moment of inertia from a flat base of ~0.07 cm⁴/m to <strong className="text-cyan-300">{struct.momentOfInertiaCm4PerM} cm⁴/m</strong>, allowing spans up to 1.5–1.8m with minimal deflection.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Interactive Real-Time Purlin Span & Applied Load Evaluator */}
          <div className="bg-slate-950 p-3.5 sm:p-4 rounded-xl border border-slate-800 flex flex-col gap-3.5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <h4 className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-purple-400" />
                2. Live Purlin Span & Applied Load Simulator
              </h4>
              <span className="text-[10px] font-mono text-slate-400">
                ASTM D3841 Beam Bending & Serviceability Mechanics
              </span>
            </div>

            {/* Simulation Controls Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              {/* Span Selector */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase font-mono font-bold text-slate-400">
                    Purlin Span (L)
                  </label>
                  <span className="text-xs font-bold text-cyan-300 font-mono">
                    {selectedSpanMm} mm ({(selectedSpanMm / 304.8).toFixed(1)} ft)
                  </span>
                </div>
                <input
                  type="range"
                  min="600"
                  max="2000"
                  step="50"
                  value={selectedSpanMm}
                  onChange={(e) => setSelectedSpanMm(Number(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono text-slate-500">
                  <span onClick={() => setSelectedSpanMm(900)} className="cursor-pointer hover:text-cyan-400">900mm</span>
                  <span onClick={() => setSelectedSpanMm(1200)} className="cursor-pointer hover:text-cyan-400">1200mm (Std)</span>
                  <span onClick={() => setSelectedSpanMm(1500)} className="cursor-pointer hover:text-cyan-400">1500mm</span>
                  <span onClick={() => setSelectedSpanMm(1800)} className="cursor-pointer hover:text-cyan-400">1800mm</span>
                </div>
              </div>

              {/* Applied Load Selector */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] uppercase font-mono font-bold text-slate-400">
                    Applied Load (w)
                  </label>
                  <span className="text-xs font-bold text-amber-300 font-mono">
                    {appliedLoadKgM2} kg/m² ({(appliedLoadKgM2 * 0.00980665).toFixed(2)} kN/m²)
                  </span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="350"
                  step="10"
                  value={appliedLoadKgM2}
                  onChange={(e) => setAppliedLoadKgM2(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono text-slate-500">
                  <span onClick={() => setAppliedLoadKgM2(75)} className="cursor-pointer hover:text-amber-400">75 (Live)</span>
                  <span onClick={() => setAppliedLoadKgM2(120)} className="cursor-pointer hover:text-amber-400">120 (Design)</span>
                  <span onClick={() => setAppliedLoadKgM2(200)} className="cursor-pointer hover:text-amber-400">200 (Wind)</span>
                </div>
              </div>

              {/* Support Condition */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono font-bold text-slate-400 block">
                  Support Condition
                </label>
                <select
                  value={supportCondition}
                  onChange={(e) => setSupportCondition(e.target.value as SupportCondition)}
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-purple-500 font-mono"
                >
                  <option value="single_span">Single Span (Simple 2 Purlins)</option>
                  <option value="double_span">Double Continuous (3 Purlins)</option>
                  <option value="multi_span">Multi-Span (4+ Purlins Continuous)</option>
                </select>
                <span className="text-[9px] text-slate-500 block">
                  {supportCondition === 'single_span'
                    ? 'Maximum deflection: 5wL⁴ / 384EI'
                    : supportCondition === 'double_span'
                    ? 'Center support continuity reduces δ by ~52%'
                    : 'Interior span continuity reduces δ by ~62%'}
                </span>
              </div>

              {/* Deflection Limit Criteria */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono font-bold text-slate-400 block">
                  Deflection Limit (δ_max)
                </label>
                <select
                  value={deflectionCriteria}
                  onChange={(e) => setDeflectionCriteria(e.target.value as DeflectionLimitCriteria)}
                  className="w-full bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-purple-500 font-mono"
                >
                  <option value="L_60">L / 60 (ASTM D3841 Industrial Roofing)</option>
                  <option value="L_100">L / 100 (Commercial Skylight Standard)</option>
                  <option value="L_120">L / 120 (Heavy Snow / Ice Cladding)</option>
                  <option value="L_180">L / 180 (Aesthetic / Rigid Glazing)</option>
                </select>
                <span className="text-[9px] text-slate-500 block">
                  Permissible δ: <strong className="text-slate-300">{(selectedSpanMm / (deflectionCriteria === 'L_60' ? 60 : deflectionCriteria === 'L_100' ? 100 : deflectionCriteria === 'L_120' ? 120 : 180)).toFixed(1)} mm</strong>
                </span>
              </div>
            </div>

            {/* Dynamic Animated Beam Deflection Visualizer */}
            <div className="bg-slate-900 p-3 sm:p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-400" />
                  Simulated Beam Curvature under {appliedLoadKgM2} kg/m² Uniform Load:
                </span>
                <span className="text-slate-400">
                  Actual Deflection: <strong className={evalResult.status === 'critical' ? 'text-rose-400' : evalResult.status === 'warning' ? 'text-amber-400' : 'text-emerald-400'}>{evalResult.actualDeflectionMm} mm</strong> ({evalResult.spanToDeflectionRatio})
                </span>
              </div>

              {/* SVG Deflection Graphic */}
              <div className="w-full h-24 bg-slate-950 rounded-lg border border-slate-800 relative overflow-hidden flex items-center justify-center px-4">
                <svg className="w-full h-full" viewBox="0 0 500 80" preserveAspectRatio="none">
                  {/* Grid background lines */}
                  <line x1="0" y1="20" x2="500" y2="20" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />
                  <line x1="0" y1="40" x2="500" y2="40" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />
                  <line x1="0" y1="60" x2="500" y2="60" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.5" />

                  {/* Purlin Support markers */}
                  {/* Left Support */}
                  <polygon points="40,42 48,58 32,58" fill="#64748b" />
                  <rect x="25" y="58" width="30" height="4" fill="#475569" />
                  <text x="40" y="72" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Purlin 1</text>

                  {/* Middle Support if double/multi span */}
                  {supportCondition !== 'single_span' && (
                    <>
                      <polygon points="250,42 258,58 242,58" fill="#64748b" />
                      <rect x="235" y="58" width="30" height="4" fill="#475569" />
                      <text x="250" y="72" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">Purlin 2</text>
                    </>
                  )}

                  {/* Right Support */}
                  <polygon points="460,42 468,58 452,58" fill="#64748b" />
                  <rect x="445" y="58" width="30" height="4" fill="#475569" />
                  <text x="460" y="72" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="monospace">
                    {supportCondition === 'single_span' ? 'Purlin 2' : 'Purlin 3'}
                  </text>

                  {/* Deflected Beam Curve */}
                  {supportCondition === 'single_span' ? (
                    (() => {
                      const maxSag = Math.min(26, Math.max(2, (evalResult.actualDeflectionMm / evalResult.allowableDeflectionMm) * 16));
                      const strokeColor = evalResult.status === 'critical' ? '#f43f5e' : evalResult.status === 'warning' ? '#f59e0b' : '#38bdf8';
                      return (
                        <>
                          <path
                            d={`M 40,40 Q 250,${40 + maxSag * 1.5} 460,40`}
                            fill="none"
                            stroke={strokeColor}
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                          {/* Center deflection drop line */}
                          <line x1="250" y1="40" x2="250" y2={40 + maxSag * 1.5} stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
                          <circle cx="250" cy={40 + maxSag * 1.5} r="3" fill="#f59e0b" />
                        </>
                      );
                    })()
                  ) : (
                    (() => {
                      const maxSag = Math.min(20, Math.max(2, (evalResult.actualDeflectionMm / evalResult.allowableDeflectionMm) * 12));
                      const strokeColor = evalResult.status === 'critical' ? '#f43f5e' : evalResult.status === 'warning' ? '#f59e0b' : '#38bdf8';
                      return (
                        <>
                          {/* Left Span Sag */}
                          <path
                            d={`M 40,40 Q 145,${40 + maxSag * 1.3} 250,40 Q 355,${40 + maxSag * 1.3} 460,40`}
                            fill="none"
                            stroke={strokeColor}
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                          <circle cx="145" cy={40 + maxSag * 1.3} r="2.5" fill="#f59e0b" />
                          <circle cx="355" cy={40 + maxSag * 1.3} r="2.5" fill="#f59e0b" />
                        </>
                      );
                    })()
                  )}

                  {/* Uniform load arrows */}
                  <g opacity="0.6">
                    <line x1="100" y1="12" x2="100" y2="28" stroke="#38bdf8" strokeWidth="1.5" markerEnd="url(#arrow)" />
                    <line x1="180" y1="12" x2="180" y2="28" stroke="#38bdf8" strokeWidth="1.5" />
                    <line x1="250" y1="12" x2="250" y2="28" stroke="#38bdf8" strokeWidth="1.5" />
                    <line x1="320" y1="12" x2="320" y2="28" stroke="#38bdf8" strokeWidth="1.5" />
                    <line x1="400" y1="12" x2="400" y2="28" stroke="#38bdf8" strokeWidth="1.5" />
                  </g>
                </svg>
              </div>

              {/* Status Verdict & Live Metrics Gauge */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {/* Deflection Metric */}
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Deflection Ratio</span>
                    <span className={evalResult.deflectionRatioPercent > 100 ? 'text-rose-400' : 'text-emerald-400'}>
                      {evalResult.deflectionRatioPercent}% of limit
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1.5">
                    <div
                      className={`h-full transition-all duration-300 ${
                        evalResult.deflectionRatioPercent > 100
                          ? 'bg-rose-500'
                          : evalResult.deflectionRatioPercent > 80
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, evalResult.deflectionRatioPercent)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                    {evalResult.actualDeflectionMm} mm / max {evalResult.allowableDeflectionMm} mm
                  </span>
                </div>

                {/* Bending Stress Metric */}
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Flexural Bending Stress</span>
                    <span className={evalResult.stressRatioPercent > 100 ? 'text-rose-400' : 'text-emerald-400'}>
                      {evalResult.stressRatioPercent}% of σ_all
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1.5">
                    <div
                      className={`h-full transition-all duration-300 ${
                        evalResult.stressRatioPercent > 100
                          ? 'bg-rose-500'
                          : evalResult.stressRatioPercent > 80
                          ? 'bg-amber-500'
                          : 'bg-blue-500'
                      }`}
                      style={{ width: `${Math.min(100, evalResult.stressRatioPercent)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                    {evalResult.actualStressMpa} MPa / {evalResult.allowableStressMpa} MPa (FS={evalResult.achievedSafetyFactor})
                  </span>
                </div>

                {/* Verdict Badge */}
                <div
                  className={`p-2 rounded-lg border flex flex-col justify-center ${
                    evalResult.status === 'critical'
                      ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
                      : evalResult.status === 'warning'
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                      : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold font-mono text-[11px]">
                    {evalResult.status === 'critical' ? (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    <span>{evalResult.status === 'critical' ? 'DESIGN CRITICAL / LIMIT EXCEEDED' : evalResult.status === 'warning' ? 'MARGINAL DESIGN LOAD' : 'STRUCTURAL CRITERIA SATISFIED'}</span>
                  </div>
                  <p className="text-[9.5px] mt-0.5 leading-tight font-sans">
                    {evalResult.statusMessage}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Purlin Span vs. Allowable Load Engineering Matrix */}
          <div className="bg-slate-950 p-3.5 sm:p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <h4 className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                3. Purlin Span vs. Allowable Safe Load Matrix (IS 12866 &amp; ASTM D3841)
              </h4>

              {/* Unit Toggle */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => setActiveUnit('metric_kg')}
                  className={`px-2 py-0.5 rounded ${activeUnit === 'metric_kg' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  kg/m²
                </button>
                <button
                  type="button"
                  onClick={() => setActiveUnit('metric_kn')}
                  className={`px-2 py-0.5 rounded ${activeUnit === 'metric_kn' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  kN/m²
                </button>
                <button
                  type="button"
                  onClick={() => setActiveUnit('imperial_psf')}
                  className={`px-2 py-0.5 rounded ${activeUnit === 'imperial_psf' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  psf (lbs/ft²)
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-[11px] font-mono text-left">
                <thead className="bg-slate-900/90 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Purlin Span</th>
                    <th className="py-2.5 px-3">Safe Allowable Load</th>
                    <th className="py-2.5 px-3">Bending Limit</th>
                    <th className="py-2.5 px-3">Deflection Limit (L/60)</th>
                    <th className="py-2.5 px-3">Governing Criterion</th>
                    <th className="py-2.5 px-3">Point Load (Pad)</th>
                    <th className="py-2.5 px-3 text-right">Roofer Walkability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-950/60">
                  {struct.purlinTable.map((point) => {
                    const isSelected = selectedSpanMm === point.spanMm;
                    const isRecommended = point.spanMm === struct.recommendedMaxPurlinSpanMm;

                    const displayLoad =
                      activeUnit === 'metric_kg'
                        ? `${point.allowableLoadKgM2} kg/m²`
                        : activeUnit === 'metric_kn'
                        ? `${point.allowableLoadKNM2} kN/m²`
                        : `${point.allowableLoadPsf} psf`;

                    const displayBending =
                      activeUnit === 'metric_kg'
                        ? `${point.bendingLimitKgM2} kg/m²`
                        : activeUnit === 'metric_kn'
                        ? `${(point.bendingLimitKgM2 * 0.00980665).toFixed(2)} kN/m²`
                        : `${(point.bendingLimitKgM2 * 0.204816).toFixed(1)} psf`;

                    const displayDeflection =
                      activeUnit === 'metric_kg'
                        ? `${point.deflectionLimitKgM2} kg/m²`
                        : activeUnit === 'metric_kn'
                        ? `${(point.deflectionLimitKgM2 * 0.00980665).toFixed(2)} kN/m²`
                        : `${(point.deflectionLimitKgM2 * 0.204816).toFixed(1)} psf`;

                    return (
                      <tr
                        key={point.spanMm}
                        onClick={() => setSelectedSpanMm(point.spanMm)}
                        className={`transition-colors cursor-pointer hover:bg-slate-900/80 ${
                          isSelected
                            ? 'bg-blue-950/50 text-white font-bold ring-1 ring-blue-500/50'
                            : isRecommended
                            ? 'bg-emerald-950/20 text-slate-200'
                            : 'text-slate-300'
                        }`}
                      >
                        <td className="py-2.5 px-3 flex items-center gap-1.5">
                          <span className="font-bold text-white">{point.spanMm} mm</span>
                          <span className="text-slate-500">({point.spanFeet} ft)</span>
                          {isRecommended && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] border border-emerald-500/30">
                              Optimal
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-amber-300">
                          {displayLoad}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400">
                          {displayBending}
                        </td>
                        <td className="py-2.5 px-3 text-cyan-400">
                          {displayDeflection}
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] uppercase ${
                              point.governingFactor === 'deflection'
                                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                                : 'bg-purple-950 text-purple-300 border border-purple-800'
                            }`}
                          >
                            {point.governingFactor} (δ={point.maxDeflectionMm}mm)
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-emerald-300">
                          {point.concentratedLoadCapacityKg} kg (ASTM D3841)
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              point.walkableStatus === 'safe_walkable'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : point.walkableStatus === 'crawl_board_required'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            <Footprints className="w-3 h-3" />
                            {point.walkableStatus === 'safe_walkable'
                              ? 'Walkable'
                              : point.walkableStatus === 'crawl_board_required'
                              ? 'Crawl-Board Req.'
                              : 'Fragile (No Step)'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="text-[10px] text-slate-400 italic">
              * Note: Calculations assume standard continuous purlin support (2+ spans) with crest-fixing self-tapping screws and EPDM bonded washers. Factor of Safety = 2.50 per IS 12866 Clause 7.
            </p>
          </div>

          {/* Section 4: Wind Uplift & Foot Traffic Safety Guidelines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Wind Uplift (IS 875 Part 3) */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-2">
              <h5 className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-cyan-400" />
                Wind Uplift & Suction Resistance (IS 875-3)
              </h5>
              <div className="space-y-1.5 text-[11px] text-slate-300 font-sans">
                <div className="flex justify-between font-mono bg-slate-900 p-2 rounded border border-slate-800">
                  <span className="text-slate-400">Peak Design Wind Speed:</span>
                  <strong className="text-cyan-300">{struct.maxWindSpeedCapacityKmph} km/h ({(struct.maxWindSpeedCapacityKmph / 3.6).toFixed(0)} m/s)</strong>
                </div>
                <div className="flex justify-between font-mono bg-slate-900 p-2 rounded border border-slate-800">
                  <span className="text-slate-400">Permissible Uplift Suction:</span>
                  <strong className="text-white">{struct.maxWindPressureKNM2} kN/m² ({Math.round(struct.maxWindPressureKNM2 * 101.97)} kg/m²)</strong>
                </div>
                <p className="text-[10px] text-slate-400 pt-1">
                  Complies with India Wind Zones I to V (up to 50 m/s basic wind speed). Ensure self-drilling fastener screws with 19mm vulcanized EPDM bonded washers on corrugation crests.
                </p>
              </div>
            </div>

            {/* Concentrated Load & Roofer Safety */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-2">
              <h5 className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Footprints className="w-4 h-4 text-amber-400" />
                ASTM D3841 Concentrated Load & Walkability
              </h5>
              <div className="space-y-1.5 text-[11px] text-slate-300 font-sans">
                <div className="flex justify-between font-mono bg-slate-900 p-2 rounded border border-slate-800">
                  <span className="text-slate-400">Pad Point Load Test:</span>
                  <strong className="text-amber-300">{struct.concentratedLoadPadCapacityKg} kg ({((struct.concentratedLoadPadCapacityKg * 9.80665) / 1000).toFixed(2)} kN)</strong>
                </div>
                <div className="flex justify-between font-mono bg-slate-900 p-2 rounded border border-slate-800">
                  <span className="text-slate-400">Test Block Geometry:</span>
                  <strong className="text-white">150 × 150 mm Square Pad (Midspan)</strong>
                </div>
                <p className="text-[10px] text-slate-400 pt-1">
                  OSHA & IS roofing safety: Workers must always use walking boards (crawl-boards) spanning across at least two purlins when maintenance is performed on translucent panels.
                </p>
              </div>
            </div>
          </div>

          {/* Section 5: Standards & Statutory Certifications */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col gap-2 text-[10px] font-mono">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              Statutory Design Codes & Reference Specifications:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-400">
              {struct.standardsReferenced.map((ref, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>{ref}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-5 text-xs text-slate-300">
          {/* Header Summary Banner */}
          <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 p-3.5 sm:p-4 rounded-xl border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                  Flat Sheet Structural Base Sizing • {boxWidthMm} × {boxLengthMm} mm
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                  Safe Payload: <span className="text-emerald-300 font-mono">{boxResult.maxSafeCapacityKg} kg</span> @ {boxThicknessMm}mm Base Plate
                </h3>
                <p className="text-[11px] text-slate-300 font-sans mt-0.5">
                  {boxResult.statusMessage}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-1.5 text-[10px] font-mono shrink-0">
              <span className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 border ${
                boxResult.status === 'safe'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : boxResult.status === 'marginal'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}>
                {boxResult.status === 'safe' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                {boxResult.status === 'safe' ? 'SAFE FOR PRODUCTION' : boxResult.status === 'marginal' ? 'MARGINAL DEFLECTION' : 'EXCESS DEFLECTION'}
              </span>
              <span className="text-slate-400">
                Plate Mass: <strong className="text-white">{boxResult.baseWeightKg} kg</strong> (Area: {((boxWidthMm * boxLengthMm) / 1e6).toFixed(2)} m²)
              </span>
            </div>
          </div>

          {/* Quick Preset Dimensions Bar */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex flex-col gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Quick Dimension Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { label: '300 × 300 mm (Small Toolbox)', w: 300, l: 300, load: 25, t: 2.0 },
                { label: '500 × 500 mm (Medium Enclosure)', w: 500, l: 500, load: 50, t: 2.5 },
                { label: '600 × 600 mm (Battery / UPS Tray)', w: 600, l: 600, load: 80, t: 3.0 },
                { label: '400 × 1200 mm (Narrow Trough)', w: 400, l: 1200, load: 60, t: 3.0 },
                { label: '1000 × 1000 mm (Pallet Box Bin)', w: 1000, l: 1000, load: 150, t: 4.0 },
                { label: '1200 × 1200 mm (Heavy Sump Base)', w: 1200, l: 1200, load: 250, t: 5.0 },
              ].map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setBoxWidthMm(p.w);
                    setBoxLengthMm(p.l);
                    setBoxPayloadKg(p.load);
                    setBoxThicknessMm(p.t);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-all ${
                    boxWidthMm === p.w && boxLengthMm === p.l
                      ? 'bg-emerald-600 text-white border-emerald-400 font-bold'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Parameters Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Box Dimensions & Payload */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-3.5">
              <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-emerald-400" />
                Box Geometry & Target Payload
              </h4>

              {/* Width */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Box Width (B):</span>
                  <span className="font-mono font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {boxWidthMm} mm ({(boxWidthMm / 25.4).toFixed(1)} in)
                  </span>
                </div>
                <input
                  type="range"
                  min={150}
                  max={1500}
                  step={25}
                  value={boxWidthMm}
                  onChange={(e) => setBoxWidthMm(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Length */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Box Length (L):</span>
                  <span className="font-mono font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {boxLengthMm} mm ({(boxLengthMm / 25.4).toFixed(1)} in)
                  </span>
                </div>
                <input
                  type="range"
                  min={150}
                  max={2400}
                  step={25}
                  value={boxLengthMm}
                  onChange={(e) => setBoxLengthMm(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Target Payload Weight */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Target Payload Weight:</span>
                  <span className="font-mono font-bold text-amber-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {boxPayloadKg} kg ({(boxPayloadKg * 2.20462).toFixed(0)} lbs)
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={400}
                  step={5}
                  value={boxPayloadKg}
                  onChange={(e) => setBoxPayloadKg(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Base Sheet Thickness Selection */}
              <div className="space-y-1.5 pt-1">
                <span className="text-slate-400 text-[11px] block">Test Sheet Thickness:</span>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 font-mono">
                  {[1.5, 2.0, 2.5, 3.0, 4.0, 5.0, 6.0].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setBoxThicknessMm(t)}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        boxThicknessMm === t
                          ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                          : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                      }`}
                    >
                      {t} mm
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Boundary Condition & Reinforcement */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-3.5">
              <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                Support Conditions & Laminate Schedule
              </h4>

              {/* Support Condition */}
              <div className="space-y-1.5">
                <span className="text-slate-400 text-[11px] block">Base Boundary Support:</span>
                <div className="grid grid-cols-3 gap-1.5 font-sans">
                  {[
                    { id: 'perimeter_4_edges', label: '4-Edge Perimeter', sub: 'Box walls / corner feet' },
                    { id: 'supported_2_edges', label: '2-Edge Support', sub: 'Forklift skids / 2 rails' },
                    { id: 'fully_supported_bottom', label: 'Fully Flat on Floor', sub: 'Pallet / solid deck' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setBoxSupportType(s.id as any)}
                      className={`p-2 rounded-lg text-left border flex flex-col gap-0.5 transition-all ${
                        boxSupportType === s.id
                          ? 'bg-cyan-950/80 border-cyan-500 text-white shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className="text-[11px] font-bold leading-tight">{s.label}</span>
                      <span className="text-[9px] text-slate-400">{s.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Load Distribution */}
              <div className="space-y-1.5">
                <span className="text-slate-400 text-[11px] block">Load Distribution Pattern:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBoxLoadType('uniform_distributed')}
                    className={`p-2 rounded-lg text-left border transition-all ${
                      boxLoadType === 'uniform_distributed'
                        ? 'bg-blue-950/80 border-blue-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-[11px]">Uniform Distributed Load</div>
                    <div className="text-[9px] text-slate-400">Powders, fluids, packed goods</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBoxLoadType('center_point_load')}
                    className={`p-2 rounded-lg text-left border transition-all ${
                      boxLoadType === 'center_point_load'
                        ? 'bg-amber-950/80 border-amber-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-[11px]">Central Concentrated Point</div>
                    <div className="text-[9px] text-slate-400">Heavy motor, battery, transformer</div>
                  </button>
                </div>
              </div>

              {/* Fiberglass Reinforcement Architecture */}
              <div className="space-y-1.5">
                <span className="text-slate-400 text-[11px] block">Fiberglass Matrix Type:</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'csm_mat', label: 'CSM Emulsion Mat', sub: 'E = 8.5 GPa (Standard)' },
                    { id: 'woven_roving', label: 'CSM + Woven Roving', sub: 'E = 14.5 GPa (+70% stiffer)' },
                    { id: 'sandwich_core', label: 'Sandwich Core (10mm)', sub: 'Ultra-light high rigidity' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setBoxReinforcementType(f.id as any)}
                      className={`p-2 rounded-lg text-left border transition-all ${
                        boxReinforcementType === f.id
                          ? 'bg-purple-950/80 border-purple-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-bold text-[11px] leading-tight">{f.label}</div>
                      <div className="text-[9px] text-slate-400">{f.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Realtime Engineering Results Card */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                Live Engineering Performance for {boxWidthMm} × {boxLengthMm} mm @ {boxThicknessMm} mm Base
              </span>
              <span className="text-slate-400 text-[10px] font-normal normal-case">
                Safety Factor: 2.50 • Permissible Stress: {boxResult.allowableStressMpa} MPa
              </span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 font-mono">
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase block">Calculated Center Sag</span>
                <strong className={`text-sm sm:text-base block mt-0.5 ${
                  boxResult.deflectionRatioPercent > 100 ? 'text-rose-400' : boxResult.deflectionRatioPercent > 80 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {boxResult.actualDeflectionMm} mm
                </strong>
                <span className="text-[9px] text-slate-400 block mt-0.5">
                  Limit: ≤ {boxResult.allowableDeflectionMm} mm ({boxResult.deflectionRatioPercent}% cap)
                </span>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase block">Max Safe Weight</span>
                <strong className="text-sm sm:text-base text-cyan-300 block mt-0.5">
                  {boxResult.maxSafeCapacityKg} kg
                </strong>
                <span className="text-[9px] text-slate-400 block mt-0.5">
                  Applied: {boxPayloadKg} kg ({Math.max(boxResult.stressRatioPercent, boxResult.deflectionRatioPercent)}%)
                </span>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase block">Recommended Thickness</span>
                <strong className="text-sm sm:text-base text-amber-300 block mt-0.5">
                  ≥ {boxResult.recommendedThicknessMm} mm
                </strong>
                <span className="text-[9px] text-slate-400 block mt-0.5">
                  Current: {boxThicknessMm} mm {boxThicknessMm >= boxResult.recommendedThicknessMm ? '✓ Adequate' : '⚠ Increase'}
                </span>
              </div>

              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase block">Base Plate Weight</span>
                <strong className="text-sm sm:text-base text-white block mt-0.5">
                  {boxResult.baseWeightKg} kg
                </strong>
                <span className="text-[9px] text-slate-400 block mt-0.5">
                  Density: 1.55 g/cm³
                </span>
              </div>
            </div>

            {/* Stiffener & Layup Recommendation Bar */}
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Stiffening Guidance:</span>
                  <span className="text-emerald-300 font-sans">{boxResult.stiffenerRecommendation}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Laminate layup: <strong className="text-slate-200">{boxResult.laminateSchedule}</strong>
                </div>
              </div>

              {boxThicknessMm < boxResult.recommendedThicknessMm && (
                <button
                  type="button"
                  onClick={() => setBoxThicknessMm(boxResult.recommendedThicknessMm)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 transition-all flex items-center gap-1"
                >
                  <span>Apply Recommended {boxResult.recommendedThicknessMm}mm</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Section: Master Dimension Recommendation Matrix Table */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
              <div>
                <h4 className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-blue-400" />
                  Master Dimension Recommendation Matrix (Engineering Reference)
                </h4>
                <p className="text-[11px] text-slate-400">
                  Pre-calculated standard box spans under 4-edge perimeter support (Factor of Safety = 2.50, Max Deflection &lt; Span/80)
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-left font-mono text-[11px]">
                <thead className="bg-slate-900 text-slate-400 uppercase text-[9px] border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Box Dimensions (W × L)</th>
                    <th className="py-2.5 px-3">Typical Application</th>
                    <th className="py-2.5 px-3 text-amber-300">Rec. Thickness</th>
                    <th className="py-2.5 px-3">Laminate Schedule</th>
                    <th className="py-2.5 px-3 text-emerald-300">Safe Uniform Load</th>
                    <th className="py-2.5 px-3 text-cyan-300">Safe Point Load</th>
                    <th className="py-2.5 px-3 text-right">Stiffener / Rib Requirement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 bg-slate-950/50">
                  {[
                    { dim: '200 × 200 mm (8" × 8")', app: 'Junction / Terminal Box', t: '1.5 mm', layup: '1x CSM 450 gsm', unif: '40 kg', point: '25 kg', rib: 'Self-supporting flat plate' },
                    { dim: '300 × 300 mm (12" × 12")', app: 'Small Utility / Tool Box', t: '2.0 mm', layup: '2x CSM 450 gsm', unif: '60 kg', point: '35 kg', rib: 'Self-supporting flat plate' },
                    { dim: '450 × 450 mm (18" × 18")', app: 'Inverter / Pump Enclosure', t: '2.5 mm', layup: '2x CSM 450 + 1x CSM 300', unif: '75 kg', point: '45 kg', rib: '25mm perimeter turned-down lip' },
                    { dim: '600 × 600 mm (24" × 24")', app: 'Solar Battery / UPS Tray', t: '3.0 mm', layup: 'CSM 450 + WR 600 + CSM 300', unif: '110 kg', point: '60 kg', rib: '1x cross rib if point loaded' },
                    { dim: '300 × 900 mm (12" × 36")', app: 'Cable / Pipe Trough', t: '2.5 mm', layup: '2x CSM 450 gsm', unif: '85 kg', point: '40 kg', rib: 'Side lips prevent longitudinal bow' },
                    { dim: '500 × 1000 mm (20" × 40")', app: 'Chemical Pan / Drip Tray', t: '3.0 mm', layup: 'CSM 450 + WR 600 + CSM 450', unif: '120 kg', point: '55 kg', rib: 'Transverse rib at mid-length' },
                    { dim: '800 × 800 mm (32" × 32")', app: 'Equipment Base / Large Bin', t: '4.0 mm', layup: '2x CSM 450 + 2x WR 600', unif: '180 kg', point: '85 kg', rib: '2x Top-hat ribs (50×30 mm)' },
                    { dim: '1000 × 1000 mm (40" × 40")', app: 'Standard Pallet Box Base', t: '5.0 mm (or 3mm + ribs)', layup: '3x CSM 450 + 2x WR 600', unif: '260 kg', point: '120 kg', rib: '2x Inverted top-hat ribs essential' },
                    { dim: '1200 × 1200 mm (48" × 48")', app: 'Heavy Sump / Machine Tray', t: '6.0 mm (or sandwich)', layup: '2x Skins + 10mm Core', unif: '350+ kg', point: '160 kg', rib: 'Structural hat ribs or sandwich core' },
                  ].map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-900/60 transition-colors cursor-pointer"
                      onClick={() => {
                        const parts = row.dim.split(' × ');
                        const w = parseInt(parts[0], 10);
                        const l = parseInt(parts[1], 10);
                        const t = parseFloat(row.t);
                        if (!isNaN(w) && !isNaN(l)) {
                          setBoxWidthMm(w);
                          setBoxLengthMm(l);
                          if (!isNaN(t)) setBoxThicknessMm(t);
                        }
                      }}
                    >
                      <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5">
                        <Box className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{row.dim}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 font-sans">{row.app}</td>
                      <td className="py-2.5 px-3 font-bold text-amber-300">{row.t}</td>
                      <td className="py-2.5 px-3 text-slate-300">{row.layup}</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-300">{row.unif}</td>
                      <td className="py-2.5 px-3 font-bold text-cyan-300">{row.point}</td>
                      <td className="py-2.5 px-3 text-right font-sans text-slate-400">{row.rib}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[10px] text-slate-400 italic">
              * Click any row in the matrix to load its exact dimensions directly into the interactive engineering analyzer above.
            </p>
          </div>

          {/* Section: Practical Box Base Engineering Rules */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-2">
              <h5 className="text-[11px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                The Cubic Thickness Rule (t³)
              </h5>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                Plate flexural rigidity follows <strong className="text-white font-mono">D = E·t³ / 12(1-ν²)</strong>. Bumping thickness from <strong className="text-amber-300 font-mono">2.0mm → 3.0mm</strong> gives <strong className="text-emerald-300 font-mono">+238% stiffness</strong> for only a 50% material cost increase. For boxes over 600mm, increasing thickness is far more cost-effective than adding extra layers after curing.
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-2">
              <h5 className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                Perimeter Flanges vs Stiffener Ribs
              </h5>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                Molding a <strong className="text-white font-mono">25–35mm down-turned perimeter flange</strong> along all four edges locks the perimeter in place, preventing edge curling and doubling allowable capacity compared to a free flat plate. For spans &gt; 800mm, bond two inverted FRP top-hat ribs on the underside.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-4 sm:px-6 py-3 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-400 hidden sm:block font-mono">
            UFRP Continuous Sheet Production Engineering • Structural Load Engine v2.4
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onOpenReportModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenReportModal();
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>View Full Spec Sheet</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
