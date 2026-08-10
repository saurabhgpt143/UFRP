import React, { useState } from 'react';
import {
  X,
  Atom,
  Flame,
  Zap,
  Activity,
  Layers,
  Sparkles,
  HelpCircle,
  Thermometer,
  Clock,
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react';
import { FRPConfig } from '../types';

interface ReactionMechanismModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: FRPConfig;
  materials: any;
}

export const ReactionMechanismModal: React.FC<ReactionMechanismModalProps> = ({
  isOpen,
  onClose,
  config,
  materials,
}) => {
  const [activeStage, setActiveStage] = useState<number>(1);
  const [temperatureOverride, setTemperatureOverride] = useState<number>(config.ambientTempC);
  const [mekpOverride, setMekpOverride] = useState<number>(config.catalystPercent);
  const [cobaltOverride, setCobaltOverride] = useState<number>(config.cobaltPercent ?? 0.2);

  if (!isOpen) return null;

  // Kinetic estimations based on inputs
  const estimatedGelMin = Math.max(3, Math.round(20 * (25 / Math.max(10, temperatureOverride)) * (2.0 / Math.max(0.5, mekpOverride)) * (0.2 / Math.max(0.05, cobaltOverride))));
  const peakExothermC = Math.round(50 + (temperatureOverride * 0.8) + (mekpOverride * 15) + (cobaltOverride * 25));

  const stages = [
    {
      id: 1,
      title: 'Stage 1: Initiation & Redox Radical Generation',
      subtitle: 'Cobalt Octoate Promoter + MEKP Peroxide Initiator',
      timeWindow: `0 – ${Math.round(estimatedGelMin * 0.25)} min`,
      phase: 'Liquid Resin Slurry',
      viscosity: '300 – 450 cP',
      tempRange: `${temperatureOverride}°C`,
      color: 'from-amber-500 to-orange-600',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      chemicalEq: [
        'ROOH (MEKP) + Co²⁺ ⟶ RO• (Alkoxy Radical) + Co³⁺ + OH⁻',
        'ROOH + Co³⁺ ⟶ ROO• (Peroxy Radical) + Co²⁺ + H⁺'
      ],
      description: 'Cobalt Octoate (Co²⁺) acts as a redox catalyst that continuously decomposes Methyl Ethyl Ketone Peroxide (MEKP) oxygen-oxygen bonds at ambient temperatures without needing external heat. This produces a steady stream of free radicals (RO•, ROO•).',
      keyEvents: [
        'Homolytic cleavage of O-O peroxide single bonds',
        'Redox cycling between Co²⁺ and Co³⁺ metal oxidation states',
        'Generation of primary free radicals (RO•) with unshared valence electrons',
        'Zero thermal activation barrier required due to cobalt promoter catalysis'
      ],
      svgDiagram: (
        <svg viewBox="0 0 500 200" className="w-full h-auto text-xs font-mono">
          <defs>
            <linearGradient id="radGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          {/* Background Grid */}
          <rect width="500" height="200" fill="#0f172a" rx="12" />
          <path d="M 0,100 Q 250,90 500,100" stroke="#1e293b" strokeWidth="1" fill="none" />
          
          {/* MEKP Molecule */}
          <g transform="translate(60, 100)">
            <rect x="-45" y="-35" width="90" height="70" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="0" y="-12" fill="#fbbf24" textAnchor="middle" fontWeight="bold" fontSize="11">MEKP Peroxide</text>
            <text x="0" y="8" fill="#94a3b8" textAnchor="middle" fontSize="10">R–O–O–H</text>
            <circle x="12" y="8" r="3" fill="#ef4444" className="animate-ping" />
          </g>

          {/* Arrow with Cobalt */}
          <g transform="translate(180, 100)">
            <line x1="-20" y1="0" x2="30" y2="0" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow)" />
            <circle cx="5" cy="-22" r="16" fill="#8b5cf6" fillOpacity="0.2" stroke="#a78bfa" strokeWidth="1.5" />
            <text x="5" y="-18" fill="#c084fc" textAnchor="middle" fontWeight="bold" fontSize="10">Co²⁺</text>
            <text x="5" y="22" fill="#38bdf8" textAnchor="middle" fontSize="9">Redox Cleavage</text>
          </g>

          {/* Generated Free Radicals */}
          <g transform="translate(340, 65)">
            <rect x="-50" y="-25" width="100" height="50" rx="8" fill="#1e293b" stroke="#ef4444" strokeWidth="1.5" />
            <text x="0" y="-5" fill="#fca5a5" textAnchor="middle" fontWeight="bold" fontSize="11">RO• Radical</text>
            <circle cx="32" cy="-6" r="3.5" fill="#ef4444" className="animate-pulse" />
            <text x="0" y="12" fill="#94a3b8" textAnchor="middle" fontSize="9">Active Initiator</text>
          </g>

          <g transform="translate(340, 135)">
            <rect x="-50" y="-25" width="100" height="50" rx="8" fill="#1e293b" stroke="#a855f7" strokeWidth="1.5" />
            <text x="0" y="-5" fill="#e9d5ff" textAnchor="middle" fontWeight="bold" fontSize="11">Co³⁺ + OH⁻</text>
            <text x="0" y="12" fill="#94a3b8" textAnchor="middle" fontSize="9">Oxidized Cobalt</text>
          </g>
        </svg>
      )
    },
    {
      id: 2,
      title: 'Stage 2: Radical Propagation & Monomer Activation',
      subtitle: 'Free Radical Attack on Styrene & Maleic/Fumaric Ester C=C Bonds',
      timeWindow: `${Math.round(estimatedGelMin * 0.25)} – ${Math.round(estimatedGelMin * 0.75)} min`,
      phase: 'Viscous Polymer Solution',
      viscosity: '450 – 2,500 cP',
      tempRange: `${temperatureOverride} – ${temperatureOverride + 10}°C`,
      color: 'from-blue-500 to-cyan-600',
      badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      chemicalEq: [
        'RO• + CH₂=CH–C₆H₅ (Styrene) ⟶ RO–CH₂–C•H–C₆H₅',
        'Styrene Radical• + –CH=CH– (Ester Double Bond) ⟶ Chain Growth Radical•'
      ],
      description: 'Primary radicals attack carbon-carbon double bonds (C=C) of volatile styrene reactive monomer and maleic anhydride / fumaric acid unsaturated ester units in the polyester prepolymer backbone, initiating chain propagation.',
      keyEvents: [
        'Addition of RO• radical across electron-dense C=C double bonds',
        'Conversion of π-bonds into covalent σ-bonds + active carbon radicals',
        'Styrene diluent monomer acts as a reactive crosslinking bridge',
        'Viscosity steadily rises as oligomer chain lengths expand'
      ],
      svgDiagram: (
        <svg viewBox="0 0 500 200" className="w-full h-auto text-xs font-mono">
          <rect width="500" height="200" fill="#0f172a" rx="12" />
          
          {/* Radical attacking C=C */}
          <g transform="translate(80, 100)">
            <circle cx="0" cy="0" r="22" fill="#ef4444" fillOpacity="0.2" stroke="#f87171" strokeWidth="1.5" />
            <text x="0" y="4" fill="#fca5a5" textAnchor="middle" fontWeight="bold" fontSize="10">RO•</text>
          </g>

          <path d="M 110,100 L 150,100" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />

          {/* Styrene Monomer */}
          <g transform="translate(230, 100)">
            <rect x="-60" y="-35" width="120" height="70" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="0" y="-12" fill="#38bdf8" textAnchor="middle" fontWeight="bold" fontSize="11">CH₂=CH–C₆H₅</text>
            <text x="0" y="8" fill="#94a3b8" textAnchor="middle" fontSize="10">Styrene Monomer</text>
          </g>

          <path d="M 300,100 L 340,100" stroke="#10b981" strokeWidth="2" />

          {/* Growing Chain Radical */}
          <g transform="translate(410, 100)">
            <rect x="-55" y="-35" width="110" height="70" rx="8" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" />
            <text x="0" y="-12" fill="#34d399" textAnchor="middle" fontWeight="bold" fontSize="11">RO–Styrene•</text>
            <text x="0" y="8" fill="#a7f3d0" textAnchor="middle" fontSize="9">Active Chain End</text>
            <circle cx="38" cy="-12" r="3" fill="#34d399" className="animate-ping" />
          </g>
        </svg>
      )
    },
    {
      id: 3,
      title: 'Stage 3: Sol-Gel Transition & 3D Network Crosslinking',
      subtitle: 'Gel Point (t_gel) & Styrene Bridge Formation',
      timeWindow: `${Math.round(estimatedGelMin * 0.75)} – ${estimatedGelMin} min (Gel Point)`,
      phase: 'Rubbery Gel Matrix',
      viscosity: '> 100,000 cP (Infinite Network)',
      tempRange: `${temperatureOverride + 10} – ${temperatureOverride + 25}°C`,
      color: 'from-emerald-500 to-teal-600',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      chemicalEq: [
        'Polyester Chain A + n(Styrene Bridge) + Polyester Chain B ⟶ 3D Covalent Mesh',
        'Sol Fraction (Liquid) ⟶ Gel Fraction (Insoluble Polymer Network)'
      ],
      description: 'At the Gel Point (t_gel), styrene monomer sequences bridge neighboring unsaturated polyester polymer chains. The resin abruptly changes from a flowable liquid into an elastic, non-flowable rubber gel matrix.',
      keyEvents: [
        'Infinite molecular weight 3D crosslinked network percolation',
        'Liquid flow ceases completely; resin can no longer be poured',
        'Exothermic temperature ramp begins accelerating rapidly',
        'Glass fibers become permanently locked in their structural position'
      ],
      svgDiagram: (
        <svg viewBox="0 0 500 200" className="w-full h-auto text-xs font-mono">
          <rect width="500" height="200" fill="#0f172a" rx="12" />
          
          {/* Top Polyester Chain */}
          <path d="M 40,50 C 150,30 350,70 460,50" stroke="#38bdf8" strokeWidth="4" fill="none" />
          <text x="50" y="38" fill="#38bdf8" fontSize="10" fontWeight="bold">Polyester Chain A</text>

          {/* Bottom Polyester Chain */}
          <path d="M 40,150 C 150,170 350,130 460,150" stroke="#38bdf8" strokeWidth="4" fill="none" />
          <text x="50" y="168" fill="#38bdf8" fontSize="10" fontWeight="bold">Polyester Chain B</text>

          {/* Crosslinking Styrene Bridges */}
          <g stroke="#10b981" strokeWidth="2.5" strokeDasharray="2,2">
            <line x1="120" y1="45" x2="130" y2="155" />
            <line x1="240" y1="52" x2="250" y2="148" />
            <line x1="360" y1="50" x2="350" y2="145" />
          </g>

          {/* Nodes */}
          <circle cx="125" cy="100" r="14" fill="#10b981" fillOpacity="0.2" stroke="#34d399" strokeWidth="1.5" />
          <text x="125" y="103" fill="#a7f3d0" textAnchor="middle" fontSize="8" fontWeight="bold">Styrene Bridge</text>

          <circle cx="245" cy="100" r="14" fill="#10b981" fillOpacity="0.2" stroke="#34d399" strokeWidth="1.5" />
          <text x="245" y="103" fill="#a7f3d0" textAnchor="middle" fontSize="8" fontWeight="bold">Styrene Bridge</text>

          <circle cx="355" cy="100" r="14" fill="#10b981" fillOpacity="0.2" stroke="#34d399" strokeWidth="1.5" />
          <text x="355" y="103" fill="#a7f3d0" textAnchor="middle" fontSize="8" fontWeight="bold">Styrene Bridge</text>
        </svg>
      )
    },
    {
      id: 4,
      title: 'Stage 4: Exothermic Peak & Curing (Vitrification)',
      subtitle: 'Rapid Polymerization Heat Release & Glass Transition (Tg) Shift',
      timeWindow: `${estimatedGelMin} – ${estimatedGelMin + 15} min`,
      phase: 'Rigid Glassy Solid (Vitrification)',
      viscosity: 'Solid Matrix (G\' >> G")',
      tempRange: `${temperatureOverride + 25} – ${peakExothermC}°C (Exotherm Peak)`,
      color: 'from-rose-500 to-red-600',
      badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      chemicalEq: [
        'C=C Double Bond Conversion ⟶ C–C Single Bonds + ΔH (Heat of Reaction)',
        'ΔH_reaction ≈ –70 kJ / mol of double bonds'
      ],
      description: 'The enclosed crosslinking reaction releases significant enthalpy (exothermic heat). Matrix temperature surges to peak exotherm (~80–115°C). Glass transition temperature (Tg) rises above curing temp, freezing polymer chains into a rigid glassy thermoset.',
      keyEvents: [
        'Rapid exothermic temperature spike up to peak exotherm',
        'Double-bond conversion reaches 90–95%',
        'Vitrification locks in mechanical strength & flexural modulus',
        'Volatile styrene emissions drop to near zero as styrene is consumed'
      ],
      svgDiagram: (
        <svg viewBox="0 0 500 200" className="w-full h-auto text-xs font-mono">
          <rect width="500" height="200" fill="#0f172a" rx="12" />
          
          {/* Thermal Exotherm Wave */}
          <path d="M 20,160 L 120,150 Q 220,130 280,30 Q 340,110 480,140" fill="none" stroke="#ef4444" strokeWidth="3" />
          <polygon points="280,30 270,45 290,45" fill="#ef4444" />
          
          <g transform="translate(280, 20)">
            <rect x="-65" y="-15" width="130" height="25" rx="6" fill="#7f1d1d" stroke="#f87171" strokeWidth="1" />
            <text x="0" y="2" fill="#fca5a5" textAnchor="middle" fontWeight="bold" fontSize="10">Peak Exotherm {peakExothermC}°C</text>
          </g>

          {/* Flame Icon Graphic */}
          <g transform="translate(180, 80)">
            <circle cx="0" cy="0" r="20" fill="#ef4444" fillOpacity="0.2" />
            <text x="0" y="4" fill="#f87171" textAnchor="middle" fontSize="12" fontWeight="bold">ΔH Exotherm</text>
          </g>

          {/* Matrix Vitrification Box */}
          <g transform="translate(400, 90)">
            <rect x="-55" y="-25" width="110" height="50" rx="8" fill="#1e293b" stroke="#f43f5e" strokeWidth="1.5" />
            <text x="0" y="-5" fill="#fda4af" textAnchor="middle" fontWeight="bold" fontSize="11">Vitrification</text>
            <text x="0" y="12" fill="#94a3b8" textAnchor="middle" fontSize="9">Tg &gt; T_ambient</text>
          </g>
        </svg>
      )
    },
    {
      id: 5,
      title: 'Stage 5: Termination & Post-Cure Stabilization',
      subtitle: 'Radical Recombination & Final Barcol Hardness',
      timeWindow: `${estimatedGelMin + 15} – ${config.dryingTimeMinutes} min`,
      phase: 'Fully Cured FRP Composite Sheet',
      viscosity: 'Hard Thermoset Polymer',
      tempRange: `${config.dryingTempC}°C (Cooling to Ambient)`,
      color: 'from-purple-500 to-indigo-600',
      badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
      chemicalEq: [
        'R₁• + R₂• ⟶ R₁–R₂ (Radical Combination Termination)',
        'Residual C=C Conversion ⟶ > 98% Barcol Hardness (≥ 40)'
      ],
      description: 'Remaining active radicals recombine into stable covalent single bonds. Thermal post-curing on the heated drying table completes residual double bond crosslinking, maximizing structural rigidity, chemical resistance, and weatherability.',
      keyEvents: [
        'Radical termination via combination and disproportionation',
        'Barcol Hardness reaches full specification (≥ 40 BHU)',
        'Residual monomer content drops below 1% for odorless finish',
        'FRP sheet is ready for demolding, margin edge trimming, and 3D rendering'
      ],
      svgDiagram: (
        <svg viewBox="0 0 500 200" className="w-full h-auto text-xs font-mono">
          <rect width="500" height="200" fill="#0f172a" rx="12" />
          
          {/* Dense 3D Solid Network Grid */}
          <g stroke="#818cf8" strokeWidth="1.5" fill="none">
            <line x1="50" y1="40" x2="450" y2="40" />
            <line x1="50" y1="80" x2="450" y2="80" />
            <line x1="50" y1="120" x2="450" y2="120" />
            <line x1="50" y1="160" x2="450" y2="160" />

            <line x1="100" y1="20" x2="100" y2="180" />
            <line x1="200" y1="20" x2="200" y2="180" />
            <line x1="300" y1="20" x2="300" y2="180" />
            <line x1="400" y1="20" x2="400" y2="180" />
          </g>

          {/* Hardness Badge */}
          <g transform="translate(250, 100)">
            <rect x="-75" y="-25" width="150" height="50" rx="10" fill="#0f172a" stroke="#a78bfa" strokeWidth="2" />
            <text x="0" y="-5" fill="#c084fc" textAnchor="middle" fontWeight="bold" fontSize="12">Fully Cured Thermoset</text>
            <text x="0" y="12" fill="#34d399" textAnchor="middle" fontSize="10" fontWeight="bold">Barcol Hardness ≥ 40</text>
          </g>
        </svg>
      )
    }
  ];

  const currentStageData = stages[activeStage - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-sans text-slate-100">
        
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
              <Atom className="w-5 h-5 text-white animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Resin Curing Reaction Mechanism
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full">
                  Free-Radical Polymerization
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Step-by-step chemical kinetics, electron transfer & molecular crosslinking stages
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Kinetic Controls & Parameters */}
        <div className="bg-slate-950/60 border-b border-slate-800/80 px-4 sm:px-6 py-2.5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs shrink-0">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between font-mono text-slate-400 text-[11px]">
              <span>Ambient Temp (T_ambient):</span>
              <strong className="text-blue-400">{temperatureOverride}°C</strong>
            </div>
            <input
              type="range"
              min="10"
              max="45"
              step="1"
              value={temperatureOverride}
              onChange={(e) => setTemperatureOverride(Number(e.target.value))}
              className="accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between font-mono text-slate-400 text-[11px]">
              <span>MEKP Catalyst Ratio:</span>
              <strong className="text-amber-400">{mekpOverride.toFixed(1)}%</strong>
            </div>
            <input
              type="range"
              min="0.5"
              max="3.5"
              step="0.1"
              value={mekpOverride}
              onChange={(e) => setMekpOverride(Number(e.target.value))}
              className="accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between font-mono text-slate-400 text-[11px]">
              <span>Cobalt Octoate 6%:</span>
              <strong className="text-purple-400">{cobaltOverride.toFixed(2)}%</strong>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.50"
              step="0.01"
              value={cobaltOverride}
              onChange={(e) => setCobaltOverride(Number(e.target.value))}
              className="accent-purple-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Stage Tabs Navigation */}
        <div className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2.5 bg-slate-950/40 border-b border-slate-800 overflow-x-auto shrink-0 scrollbar-none">
          {stages.map((stg) => {
            const isActive = stg.id === activeStage;
            return (
              <button
                key={stg.id}
                onClick={() => setActiveStage(stg.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-2 border ${
                  isActive
                    ? 'bg-gradient-to-r ' + stg.color + ' text-white border-transparent shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center font-mono text-[10px] font-bold">
                  {stg.id}
                </span>
                <span>Stage {stg.id}</span>
              </button>
            );
          })}
        </div>

        {/* Stage Content Details */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* Header Banner for Selected Stage */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded-md border ${currentStageData.badgeBg}`}>
                {currentStageData.phase}
              </span>
              <h3 className="text-lg font-bold text-white mt-1">
                {currentStageData.title}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {currentStageData.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono bg-slate-900 p-2.5 rounded-lg border border-slate-800 shrink-0">
              <div>
                <span className="text-slate-500 block text-[10px]">TIME WINDOW</span>
                <span className="text-emerald-400 font-bold">{currentStageData.timeWindow}</span>
              </div>
              <div className="w-px h-6 bg-slate-800"></div>
              <div>
                <span className="text-slate-500 block text-[10px]">VISCOSITY</span>
                <span className="text-blue-400 font-bold">{currentStageData.viscosity}</span>
              </div>
              <div className="w-px h-6 bg-slate-800"></div>
              <div>
                <span className="text-slate-500 block text-[10px]">TEMPERATURE</span>
                <span className="text-rose-400 font-bold">{currentStageData.tempRange}</span>
              </div>
            </div>
          </div>

          {/* SVG Reaction Mechanism Diagram */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Molecular & Radical Reaction Diagram
            </h4>
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-2 shadow-inner">
              {currentStageData.svgDiagram}
            </div>
          </div>

          {/* Chemical Equations Card */}
          <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 space-y-2">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Chemical Reaction Equations
            </h4>
            <div className="space-y-1.5">
              {currentStageData.chemicalEq.map((eq, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs sm:text-sm font-mono text-cyan-300 flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-cyan-500/10 text-cyan-400 text-[10px] flex items-center justify-center font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <span>{eq}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Process Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-400" /> Kinetic Description
              </h4>
              <p className="text-xs leading-relaxed text-slate-300 font-sans">
                {currentStageData.description}
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Key Phase Milestones
              </h4>
              <ul className="space-y-1.5">
                {currentStageData.keyEvents.map((evt, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{evt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-amber-400" />
            <span>Estimated Gel Window: <strong className="text-white font-mono">{estimatedGelMin} mins</strong> | Peak Exotherm: <strong className="text-rose-400 font-mono">{peakExothermC}°C</strong></span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close Reaction Visualizer
          </button>
        </div>

      </div>
    </div>
  );
};
