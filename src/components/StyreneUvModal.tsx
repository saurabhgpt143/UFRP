import React, { useState } from 'react';
import {
  X,
  Sun,
  Shield,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Droplet,
  Flame,
  Activity,
  Zap,
  Clock,
  Layers,
  FlaskConical,
  Info,
  ChevronRight,
  TrendingDown,
  Wind,
  Sliders,
  Check
} from 'lucide-react';
import { FRPConfig, MaterialCalculations, UVStabilizerType, ResinType } from '../types';
import { soundFx } from '../utils/soundEffects';

interface StyreneUvModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: FRPConfig;
  materials: MaterialCalculations;
  onChangeConfig: (newConfig: FRPConfig) => void;
}

export const StyreneUvModal: React.FC<StyreneUvModalProps> = ({
  isOpen,
  onClose,
  config,
  materials,
  onChangeConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'styrene' | 'uv' | 'calibrator'>('overview');

  // Local state for calibrator
  const [calibratorStyrene, setCalibratorStyrene] = useState<number>(config.styreneDiluentPercent ?? 0.0);
  const [calibratorUvType, setCalibratorUvType] = useState<UVStabilizerType>(config.uvStabilizerType ?? 'none');
  const [calibratorUvPercent, setCalibratorUvPercent] = useState<number>(config.uvStabilizerPercent ?? 0.0);

  if (!isOpen) return null;

  const handleApplyToBatch = () => {
    soundFx.playClick();
    onChangeConfig({
      ...config,
      styreneDiluentPercent: calibratorStyrene,
      uvStabilizerType: calibratorUvType,
      uvStabilizerPercent: calibratorUvPercent,
    });
  };

  const currentResinType = config.resinType ?? 'orthophthalic';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 font-sans overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl text-white my-4 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 px-4 sm:px-6 py-3.5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-blue-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <FlaskConical className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Styrene Monomer & UV Stabilizer Engineering Recommendations
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 border border-blue-500/40 text-blue-300 font-bold uppercase">
                  IS 12866 / ASTM D3841
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Reactive Dilution Rheology, Crosslink Kinetics & Synergistic UVA/HALS Photoprotection
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 px-4 sm:px-6 gap-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('overview');
            }}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Executive Recommendations & Matrix</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('styrene');
            }}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'styrene'
                ? 'border-blue-400 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Droplet className="w-3.5 h-3.5" />
            <span>Styrene Monomer Dilution & Rheology</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('uv');
            }}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'uv'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>UV Stabilizers & Photodegradation Defense</span>
          </button>

          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('calibrator');
            }}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'calibrator'
                ? 'border-purple-400 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Batch Calibrator</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex flex-col gap-6 text-xs text-slate-300">
          {/* TAB 1: EXECUTIVE RECOMMENDATIONS & MATRIX */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-5">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Styrene Summary Card */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-950 border border-blue-500/30 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-blue-300 uppercase flex items-center gap-1.5">
                      <Droplet className="w-4 h-4 text-blue-400" /> Styrene Monomer Recommendation
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                      2.0% – 4.0% PHR Addition
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Commercial unsaturated polyester resin (UPR) arrives pre-blended with <strong>35%–40% styrene monomer</strong> by weight. On the production line, adding <strong>2.0%–4.0% pure monomeric styrene (PHR)</strong> reduces batch viscosity from ~650 cP down to <strong>350–400 cP</strong>, ensuring thorough capillary glass wetting and complete de-airing before gelation without inducing shrinkage cracks.
                  </p>
                  <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Factory Base Styrene:</span>
                      <strong className="text-white">35 – 40 wt%</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Shop Thinning Limit:</span>
                      <strong className="text-emerald-400">2.0% – 5.0% PHR (Max 8%)</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Volumetric Shrinkage:</span>
                      <strong className="text-amber-400">6.5% – 7.5% (Controlled)</strong>
                    </div>
                  </div>
                </div>

                {/* UV Stabilizer Summary Card */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-300 uppercase flex items-center gap-1.5">
                      <Sun className="w-4 h-4 text-emerald-400" /> UV Stabilizer Recommendation
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      0.35% – 0.50% Synergistic
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    A single UV stabilizer is insufficient for 15–25 year outdoor durability. The gold standard is a <strong>Synergistic Dual-Additive System (2:1 ratio)</strong>: <strong>0.25%–0.35% Benzotriazole UVA</strong> (e.g., Tinuvin 326 / 328) combined with <strong>0.15%–0.20% Hindered Amine Light Stabilizer (HALS)</strong> (e.g., Tinuvin 770 / 292), paired with a <strong>50–75 µm UV-barrier BOPET Mylar film</strong>.
                  </p>
                  <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>UV Absorber (UVA):</span>
                      <strong className="text-emerald-300">0.25% – 0.35% PHR (Tinuvin 326)</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Radical Scavenger (HALS):</span>
                      <strong className="text-teal-300">0.15% – 0.20% PHR (Tinuvin 770)</strong>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Yellowing Index (10 yr):</span>
                      <strong className="text-cyan-400">ΔYI &lt; 3.5 (ASTM E313)</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Master Dosing Matrix Table */}
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-mono font-bold uppercase text-slate-200 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-amber-400" /> Master Formulation Matrix by Application & Resin Type
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Recommended phr per 100 kg Liquid Resin</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60">
                        <th className="p-2.5">Application / Resin</th>
                        <th className="p-2.5">Styrene Dilution</th>
                        <th className="p-2.5">UVA (Benzotriazole)</th>
                        <th className="p-2.5">HALS (Tinuvin 770)</th>
                        <th className="p-2.5">Target Viscosity</th>
                        <th className="p-2.5">Outdoor Lifespan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      <tr className={currentResinType === 'orthophthalic' ? 'bg-amber-950/20 font-semibold' : ''}>
                        <td className="p-2.5 text-white flex items-center gap-1.5">
                          {currentResinType === 'orthophthalic' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
                          <span>General Purpose Roofing (Ortho)</span>
                        </td>
                        <td className="p-2.5 text-blue-300">2.5% – 4.0% PHR</td>
                        <td className="p-2.5 text-emerald-300">0.35% PHR</td>
                        <td className="p-2.5 text-teal-300">0.15% PHR</td>
                        <td className="p-2.5 text-slate-300">380 – 420 cP</td>
                        <td className="p-2.5 text-amber-300">12 – 15 Years</td>
                      </tr>
                      <tr className={currentResinType === 'isophthalic' ? 'bg-amber-950/20 font-semibold' : ''}>
                        <td className="p-2.5 text-white flex items-center gap-1.5">
                          {currentResinType === 'isophthalic' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
                          <span>Industrial & Coastal Cladding (Iso)</span>
                        </td>
                        <td className="p-2.5 text-blue-300">2.0% – 3.0% PHR</td>
                        <td className="p-2.5 text-emerald-300">0.30% PHR</td>
                        <td className="p-2.5 text-teal-300">0.15% PHR</td>
                        <td className="p-2.5 text-slate-300">400 – 450 cP</td>
                        <td className="p-2.5 text-emerald-400">18 – 22 Years</td>
                      </tr>
                      <tr className={currentResinType === 'acrylic_modified' ? 'bg-amber-950/20 font-semibold' : ''}>
                        <td className="p-2.5 text-white flex items-center gap-1.5">
                          {currentResinType === 'acrylic_modified' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
                          <span>Greenhouse High-PAR Crystal Clear</span>
                        </td>
                        <td className="p-2.5 text-blue-300">1.0% – 2.0% PHR</td>
                        <td className="p-2.5 text-emerald-300">0.20% PHR</td>
                        <td className="p-2.5 text-teal-300">0.25% PHR</td>
                        <td className="p-2.5 text-slate-300">350 – 380 cP</td>
                        <td className="p-2.5 text-cyan-300">25+ Years (ΔYI &lt; 2)</td>
                      </tr>
                      <tr className={currentResinType === 'vinyl_ester' ? 'bg-amber-950/20 font-semibold' : ''}>
                        <td className="p-2.5 text-white flex items-center gap-1.5">
                          {currentResinType === 'vinyl_ester' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
                          <span>Heavy Chemical Corrosion Barrier (VE)</span>
                        </td>
                        <td className="p-2.5 text-blue-300">1.5% – 3.0% PHR</td>
                        <td className="p-2.5 text-emerald-300">0.30% PHR</td>
                        <td className="p-2.5 text-teal-300">0.10% PHR</td>
                        <td className="p-2.5 text-slate-300">450 – 500 cP</td>
                        <td className="p-2.5 text-purple-300">25+ Years</td>
                      </tr>
                      <tr className={currentResinType === 'dicyclopentadiene' ? 'bg-amber-950/20 font-semibold' : ''}>
                        <td className="p-2.5 text-white flex items-center gap-1.5">
                          {currentResinType === 'dicyclopentadiene' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>}
                          <span>Low-Emission Eco Panel (DCPD)</span>
                        </td>
                        <td className="p-2.5 text-blue-300">0.0% – 1.5% PHR</td>
                        <td className="p-2.5 text-emerald-300">0.30% PHR</td>
                        <td className="p-2.5 text-teal-300">0.20% PHR</td>
                        <td className="p-2.5 text-slate-300">320 – 360 cP</td>
                        <td className="p-2.5 text-slate-300">15 – 18 Years</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Ambient Seasonal Adjustment Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-blue-500/20 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-blue-300 font-mono font-bold">
                    <span>❄️ Winter (&lt; 20°C)</span>
                    <span className="text-[10px] bg-blue-950 px-1.5 py-0.5 rounded">3.0% – 5.0% PHR</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Resin viscosity spikes significantly in cold weather (&gt; 800 cP). Increase styrene dilution up to 4–5% and bump Cobalt Octoate to 0.35% to prevent sluggish wet-out and dry fiber streaks.
                  </p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-emerald-500/20 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-emerald-300 font-mono font-bold">
                    <span>🌿 Nominal (20°C – 28°C)</span>
                    <span className="text-[10px] bg-emerald-950 px-1.5 py-0.5 rounded">2.0% – 3.0% PHR</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Standard production sweet spot. 2.0%–2.5% styrene dilution provides balanced flow, comfortable 18–22 min pot life, and minimal cure shrinkage (&lt; 7.0%).
                  </p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-amber-500/20 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-amber-300 font-mono font-bold">
                    <span>🔥 Summer (&gt; 29°C)</span>
                    <span className="text-[10px] bg-amber-950 px-1.5 py-0.5 rounded">0.0% – 1.5% PHR</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Warm ambient drops natural resin viscosity. Restrict styrene addition to &le; 1.5% to avoid monomer boil-off, surface wrinkling, or pre-mature flash gelation before the top Mylar seals.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STYRENE MONOMER SCIENCE & RHEOLOGY */}
          {activeTab === 'styrene' && (
            <div className="flex flex-col gap-5">
              {/* Chemistry & Role of Styrene */}
              <div className="bg-slate-950 p-4 rounded-xl border border-blue-500/30 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-xs font-mono font-bold uppercase text-blue-300 flex items-center gap-1.5">
                    <Droplet className="w-4 h-4 text-blue-400" /> Chemistry of Styrene Monomer (C₈H₈) in UP Resins
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">Molecular Weight: 104.15 g/mol</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-slate-300">
                  <div className="space-y-2">
                    <h4 className="font-bold text-white flex items-center gap-1">
                      <span>1. Reactive Solvent &amp; Viscosity Reducer:</span>
                    </h4>
                    <p>
                      Liquid unsaturated polyester is synthesized by polycondensation of glycols and dibasic acids (maleic anhydride / phthalic acid). This creates a solid or highly viscous glassy resin. Styrene monomer is blended in to act as a <strong>solvent</strong> that reduces viscosity for liquid dispensing and fiber impregnation.
                    </p>
                    <p>
                      Unlike inert paint thinners (like mineral spirits or acetone), styrene participates directly in the free-radical polymerization reaction — becoming part of the permanent solid polymer backbone with zero solvent extraction required.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-white flex items-center gap-1">
                      <span>2. Covalent Crosslinking Bridge:</span>
                    </h4>
                    <p>
                      When MEKP decomposes into free radicals via Cobalt Octoate catalysis, styrene vinyl double bonds (CH₂=CH–) copolymerize across maleic and fumaric unsaturations on adjacent polyester chains.
                    </p>
                    <p className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-cyan-300">
                      Polyester—CH=CH—Polyester + 2~3 (Styrene) ⟶ 3D Covalent Crosslinked Network (Thermoset)
                    </p>
                  </div>
                </div>
              </div>

              {/* Hazards of Under-dilution vs Over-dilution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Under-dilution */}
                <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-amber-300 font-mono font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Consequences of Under-Dilution (&lt; 1% in High Viscosity)</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-slate-300 list-disc list-inside">
                    <li><strong>Sluggish Glass Wet-out:</strong> High resin viscosity (&gt; 700 cP) fails to penetrate dense 450/600 GSM chopped strand bundles, creating dry fiber starvation spots.</li>
                    <li><strong>Trapped Micro-Bubbles:</strong> Air cannot escape through thick resin before the upper die is applied, degrading optical light transmittance by 15–25%.</li>
                    <li><strong>Uneven Thickness Distribution:</strong> Calibrating thickness to &plusmn;0.1 mm becomes impossible across 1.2 m to 1.8 m sheet widths.</li>
                  </ul>
                </div>

                {/* Over-dilution */}
                <div className="bg-slate-950 p-4 rounded-xl border border-red-500/30 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-red-300 font-mono font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span>Hazards of Over-Dilution (&gt; 5% – 8% PHR Addition)</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-slate-300 list-disc list-inside">
                    <li><strong>Excessive Cure Shrinkage (&gt; 9%):</strong> Pure styrene exhibits ~17% volumetric shrinkage upon polymerization. Excess styrene leads to internal stress, sheet warping, and mold pre-release cracking.</li>
                    <li><strong>Degraded Heat Distortion (HDT):</strong> Lower crosslink density from excessive styrene homopolymer blocks drops HDT from 85°C to &lt; 65°C, causing sagging under solar roof heat.</li>
                    <li><strong>Accelerated Yellowing:</strong> Residual unreacted styrene monomer oxidizes rapidly into yellow quinoid chromophores under atmospheric oxygen and UV light.</li>
                    <li><strong>Styrene Blooming / Blistering:</strong> Monomer boils off forming vapor pockets beneath the top Mylar film during the 85°C peak exotherm.</li>
                  </ul>
                </div>
              </div>

              {/* Vapor Suppression & Shop Floor Safety */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                    <Wind className="w-4 h-4 text-teal-400" /> Vapor Suppression &amp; Workplace Hygiene
                  </h4>
                  <span className="text-[10px] font-mono text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-500/30">
                    TLV: 20 ppm TWA (ACGIH)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <strong className="text-white block mb-1">Mylar Barrier Sealing:</strong>
                    Unrolling the top BOPET Mylar film immediately in Step 4 physically caps 98% of volatile styrene emissions, keeping workplace levels far below statutory limits.
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <strong className="text-white block mb-1">Vapor Suppressant Additive (VSP):</strong>
                    Incorporating 0.15%–0.30% specialty paraffin wax creates a microscopic floating barrier layer that inhibits styrene evaporation during open wet roll-out.
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <strong className="text-white block mb-1">OSHA / ACGIH Standards:</strong>
                    Maintain localized exhaust ventilation (&gt; 10 air exchanges/hr) to guarantee shop floor ambient air remains &lt; 20 ppm TWA and &lt; 40 ppm STEL.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: UV STABILIZERS & PHOTODEGRADATION DEFENSE */}
          {activeTab === 'uv' && (
            <div className="flex flex-col gap-5">
              {/* Photodegradation Mechanics */}
              <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-xs font-mono font-bold uppercase text-emerald-300 flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-emerald-400" /> Photolytic Degradation of FRP Sheets
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">Solar Cut-off: 290 nm – 400 nm</span>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed space-y-2">
                  <p>
                    Solar ultraviolet radiation contains photons with quantum energy ranging from <strong>300 to 415 kJ/mol</strong> (at 290–400 nm). This energy exceeds the chemical bond dissociation energy of carbon-carbon (347 kJ/mol) and carbon-oxygen (358 kJ/mol) bonds in the cured polyester matrix.
                  </p>
                  <p>
                    Without stabilization, direct solar exposure initiates <strong>Norrish Type I &amp; II photo-oxidation</strong>:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[10px] pt-1">
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-amber-400 block font-bold">1. Hydroperoxide ROOH:</span>
                      O₂ reacts with photo-cleaved radicals to form unstable ROOH hydroperoxides.
                    </div>
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-red-400 block font-bold">2. Quinoid Chromophores:</span>
                      Phthalic and styrene aromatic rings oxidize into yellow quinone structures (yellowing).
                    </div>
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-purple-400 block font-bold">3. Fiber Blooming:</span>
                      Matrix erosion washes away resin, exposing bare structural glass fibers to moisture.
                    </div>
                  </div>
                </div>
              </div>

              {/* The Synergistic Solution: UVA + HALS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* UV Absorber (UVA) */}
                <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-300 uppercase flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-emerald-400" /> 1. UV Absorber (UVA)
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                      Tinuvin 326 / 328 (0.25–0.35%)
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    <strong>Mechanism:</strong> Hydroxyphenyl-benzotriazole molecules preferentially absorb dangerous UV photons in the 290–380 nm range before they strike polymer chains. Through reversible <strong>excited-state intramolecular proton transfer (ESIPT)</strong>, the photon energy is converted into harmless low-level thermal vibrations.
                  </p>
                  <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                    <li>Acts as a optical sunscreen for the sheet interior</li>
                    <li>Prevents initial deep matrix yellowing</li>
                    <li>Highly compatible with polyester and vinyl ester resins</li>
                  </ul>
                </div>

                {/* HALS Radical Scavenger */}
                <div className="bg-slate-950 p-4 rounded-xl border border-teal-500/30 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-teal-300 uppercase flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-teal-400" /> 2. Hindered Amine (HALS)
                    </span>
                    <span className="text-[10px] font-mono text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-500/30">
                      Tinuvin 770 / 292 (0.15–0.20%)
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    <strong>Mechanism:</strong> Unlike UV absorbers, HALS does not absorb UV light. Instead, it acts as a catalytic free-radical scavenger via the <strong>Denisov Cycle</strong>: sterically hindered nitroxyl radicals (&gt;N–O•) trap destructive alkyl and peroxy radicals, then cyclically regenerate themselves continuously over 20+ years.
                  </p>
                  <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                    <li>Provides indefinite surface micro-crack protection</li>
                    <li>Prevents resin embrittlement and surface chalking</li>
                    <li>Effective even in thin surface layers where UVAs lack path length</li>
                  </ul>
                </div>
              </div>

              {/* Synergistic Multiplier Comparison Card */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/50 via-slate-900 to-emerald-950/50 border border-cyan-500/30 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-mono font-bold text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-400" /> Why Synergistic Dual-Additive (UVA + HALS) is Essential
                  </h4>
                  <span className="text-[10px] font-mono text-cyan-300 font-bold">3.5× Longevity Multiplier</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs font-mono">
                  <div className="bg-slate-950/80 p-3 rounded-lg border border-red-500/30">
                    <div className="text-slate-400 text-[10px]">Unstabilized Base Resin</div>
                    <div className="text-red-400 font-bold text-sm my-1">2 – 3 Years</div>
                    <div className="text-[10px] text-slate-400">Severe yellowing (ΔYI &gt; 18) &amp; fiber blooming</div>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-lg border border-amber-500/30">
                    <div className="text-slate-400 text-[10px]">UVA Only (0.40%)</div>
                    <div className="text-amber-400 font-bold text-sm my-1">8 – 10 Years</div>
                    <div className="text-[10px] text-slate-400">Deep color stable, but surface micro-cracks form</div>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-lg border border-emerald-500/40 shadow-lg shadow-emerald-500/10">
                    <div className="text-emerald-300 text-[10px] font-bold">UVA (0.3%) + HALS (0.15%)</div>
                    <div className="text-emerald-400 font-bold text-sm my-1">20 – 25+ Years</div>
                    <div className="text-[10px] text-emerald-200">Optimal transparency &amp; zero surface chalking</div>
                  </div>
                </div>
              </div>

              {/* Surface BOPET Mylar Armor Protection */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-blue-400 shrink-0" />
                  <div>
                    <strong className="text-white block font-mono text-[11px]">
                      Third Layer of Defense: Anti-UV BOPET Mylar Film (Step 2 &amp; Step 4)
                    </strong>
                    <span>
                      In the continuous manufacturing process, a 50–75 µm UV-stabilized polyester (PET) carrier film bonds permanently to the outer weather face, filtering 99% of wavelengths &lt; 380 nm before photons reach the structural core.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: INTERACTIVE BATCH CALIBRATOR */}
          {activeTab === 'calibrator' && (
            <div className="flex flex-col gap-5">
              <div className="bg-slate-950 p-4 rounded-xl border border-purple-500/30 flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-xs font-mono font-bold uppercase text-purple-300 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-purple-400" /> Interactive Chemical Dosing Calibrator
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    Current Batch: {(materials.totalResinWeightKg).toFixed(2)} kg Resin
                  </span>
                </div>

                {/* Calibrator Sliders */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                  {/* Styrene Diluent Slider */}
                  <div className="flex flex-col gap-2 p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-blue-300 flex items-center gap-1">
                        <Droplet className="w-3.5 h-3.5 text-blue-400" /> Styrene Monomer Diluent:
                      </span>
                      <span className="font-mono font-bold text-white bg-blue-950 px-2 py-0.5 rounded border border-blue-500/30">
                        {calibratorStyrene.toFixed(1)}% PHR ({(materials.totalResinWeightKg * (calibratorStyrene / 100) * 1000).toFixed(0)} g)
                      </span>
                    </div>

                    <input
                      type="range"
                      min="0.0"
                      max="8.0"
                      step="0.5"
                      value={calibratorStyrene}
                      onChange={(e) => setCalibratorStyrene(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />

                    <div className="flex justify-between text-[10px] font-mono text-slate-500">
                      <span>0.0% (Neat)</span>
                      <span>2.0% (Standard)</span>
                      <span>4.0% (Winter)</span>
                      <span>8.0% (Max Limit)</span>
                    </div>

                    <div className="text-[10px] font-mono text-slate-400 pt-1">
                      Estimated Resin Viscosity: <strong className="text-cyan-300">{Math.round(650 * Math.exp(-0.16 * calibratorStyrene))} cP</strong> • Cure Shrinkage: <strong className="text-amber-300">{(6.0 + calibratorStyrene * 0.45).toFixed(1)}%</strong>
                    </div>
                  </div>

                  {/* UV Stabilizer Type & Percent */}
                  <div className="flex flex-col gap-2 p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-300 flex items-center gap-1">
                        <Sun className="w-3.5 h-3.5 text-emerald-400" /> UV Stabilizer System:
                      </span>
                      <span className="font-mono font-bold text-white bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                        {calibratorUvPercent.toFixed(2)}% PHR ({(materials.totalResinWeightKg * (calibratorUvPercent / 100) * 1000).toFixed(1)} g)
                      </span>
                    </div>

                    {/* UV Type Buttons */}
                    <div className="grid grid-cols-2 gap-1 text-[10px] font-mono">
                      <button
                        type="button"
                        onClick={() => {
                          setCalibratorUvType('synergistic_uva_hals');
                          setCalibratorUvPercent(0.35);
                        }}
                        className={`p-1.5 rounded border text-left transition-all ${
                          calibratorUvType === 'synergistic_uva_hals'
                            ? 'bg-emerald-600 text-white border-emerald-400 font-bold'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        <div>UVA + HALS Dual (Recommended)</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setCalibratorUvType('benzotriazole_tinuvin_326');
                          setCalibratorUvPercent(0.30);
                        }}
                        className={`p-1.5 rounded border text-left transition-all ${
                          calibratorUvType === 'benzotriazole_tinuvin_326'
                            ? 'bg-emerald-600 text-white border-emerald-400 font-bold'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        <div>Tinuvin 326 (Benzotriazole)</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setCalibratorUvType('hals_tinuvin_770');
                          setCalibratorUvPercent(0.20);
                        }}
                        className={`p-1.5 rounded border text-left transition-all ${
                          calibratorUvType === 'hals_tinuvin_770'
                            ? 'bg-emerald-600 text-white border-emerald-400 font-bold'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        <div>Tinuvin 770 (HALS)</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setCalibratorUvType('none');
                          setCalibratorUvPercent(0.0);
                        }}
                        className={`p-1.5 rounded border text-left transition-all ${
                          calibratorUvType === 'none'
                            ? 'bg-red-600 text-white border-red-400 font-bold'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        <div>None (Unstabilized)</div>
                      </button>
                    </div>

                    <input
                      type="range"
                      min="0.0"
                      max="1.0"
                      step="0.05"
                      value={calibratorUvPercent}
                      onChange={(e) => setCalibratorUvPercent(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-1"
                    />

                    <div className="flex justify-between text-[10px] font-mono text-slate-500">
                      <span>0.0% (Unprotected)</span>
                      <span>0.35% (Optimal)</span>
                      <span>1.0% (Heavy Industrial)</span>
                    </div>
                  </div>
                </div>

                {/* Projected Performance Simulation Output */}
                <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="text-[11px] font-mono font-bold uppercase text-slate-300 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-cyan-400" /> Projected Weathering &amp; Yellowing Index (ASTM E313)
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">
                      {calibratorUvType === 'synergistic_uva_hals' ? '25 Year Lifetime Rating' : calibratorUvType === 'none' ? '2 Year Lifetime Rating' : '15 Year Lifetime Rating'}
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-2 text-center font-mono text-xs">
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <div className="text-[10px] text-slate-400">Year 0 (New)</div>
                      <div className="text-white font-bold text-sm my-0.5">YI 2.1</div>
                      <div className="text-[9px] text-emerald-400">Crystal Clear</div>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <div className="text-[10px] text-slate-400">Year 5</div>
                      <div className="text-white font-bold text-sm my-0.5">
                        YI {(2.1 + (calibratorUvType === 'synergistic_uva_hals' ? 1.0 : calibratorUvType === 'none' ? 9.5 : 2.5)).toFixed(1)}
                      </div>
                      <div className="text-[9px] text-cyan-300">
                        {calibratorUvType === 'none' ? 'Noticeable Yellow' : 'Excellent Clarity'}
                      </div>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <div className="text-[10px] text-slate-400">Year 10</div>
                      <div className="text-white font-bold text-sm my-0.5">
                        YI {(2.1 + (calibratorUvType === 'synergistic_uva_hals' ? 2.2 : calibratorUvType === 'none' ? 19.0 : 5.8)).toFixed(1)}
                      </div>
                      <div className="text-[9px] text-emerald-300">
                        {calibratorUvType === 'none' ? 'Severe Degradation' : 'Stable Solar Pass'}
                      </div>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <div className="text-[10px] text-slate-400">Year 15</div>
                      <div className="text-white font-bold text-sm my-0.5">
                        YI {(2.1 + (calibratorUvType === 'synergistic_uva_hals' ? 3.8 : calibratorUvType === 'none' ? 28.0 : 9.5)).toFixed(1)}
                      </div>
                      <div className="text-[9px] text-amber-300">
                        {calibratorUvType === 'none' ? 'Structural Fiber Bloom' : 'Intact Barrier'}
                      </div>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <div className="text-[10px] text-slate-400">Year 20</div>
                      <div className="text-white font-bold text-sm my-0.5">
                        YI {(2.1 + (calibratorUvType === 'synergistic_uva_hals' ? 5.5 : calibratorUvType === 'none' ? 35.0 : 14.0)).toFixed(1)}
                      </div>
                      <div className="text-[9px] text-purple-300">
                        {calibratorUvType === 'synergistic_uva_hals' ? 'Passes BIS IS 12866' : 'Beyond Life'}
                      </div>
                    </div>
                  </div>

                  {/* Apply to Batch Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleApplyToBatch}
                      className="py-2 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-bold text-xs text-white shadow-lg shadow-emerald-600/20 flex items-center gap-2 cursor-pointer transition-all"
                    >
                      <Check className="w-4 h-4" />
                      <span>Apply Calibrated Formulation to Active Machine Batch</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-4 sm:px-6 py-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono shrink-0">
          <div className="flex items-center gap-2 text-slate-400">
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span>Formulation adheres to ASTM D3841, ASTM G154 (QUV Weathering) &amp; BIS IS 12866:2020.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
