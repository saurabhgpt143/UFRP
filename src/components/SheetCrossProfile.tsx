import React, { useState } from 'react';
import { FRPConfig, ProfileType } from '../types';
import { calculateMaterials } from '../utils/frpCalculations';
import { Layers, Ruler, Maximize2, ShieldAlert, Check, Info } from 'lucide-react';

interface SheetCrossProfileProps {
  config: FRPConfig;
  onChangeProfile: (profile: ProfileType) => void;
  compact?: boolean;
}

export interface ProfileSpec {
  id: ProfileType;
  name: string;
  badge: string;
  coveredWidthMm: number;
  totalWidthMm: number;
  reqSheetWidthMm: number;
  pitchMm: number;
  ribHeightMm: number;
  ribTopWidthMm: number;
  ribBaseWidthMm: number;
  ribCount: number;
  minorRibHeightMm: number;
  description: string;
}

export class ProfileSpecs {
  static readonly PROFILES: Record<ProfileType, ProfileSpec> = {
    profile_7v: {
      id: 'profile_7v',
      name: '7v Profile (1300mm)',
      badge: '7v Standard',
      coveredWidthMm: 1235,
      totalWidthMm: 1300,
      reqSheetWidthMm: 1440,
      pitchMm: 198,
      ribHeightMm: 30,
      ribTopWidthMm: 25,
      ribBaseWidthMm: 65,
      ribCount: 7,
      minorRibHeightMm: 1.5,
      description: '7-rib high-strength trapezoidal profile with 1300mm final formed width, requiring 1440mm unformed flat sheet (excluding edge margin).',
    },
    profile_6v: {
      id: 'profile_6v',
      name: '6v Profile (1070mm)',
      badge: '6v Compact',
      coveredWidthMm: 1000,
      totalWidthMm: 1070,
      reqSheetWidthMm: 1220,
      pitchMm: 198,
      ribHeightMm: 30,
      ribTopWidthMm: 25,
      ribBaseWidthMm: 65,
      ribCount: 6,
      minorRibHeightMm: 1.5,
      description: '6-rib structural roofing profile with 1070mm final formed width, requiring 1220mm unformed flat sheet (excluding edge margin).',
    },
    trapezoidal_rib: {
      id: 'trapezoidal_rib',
      name: 'Trapezoidal Industrial',
      badge: 'Industrial Rib',
      coveredWidthMm: 1000,
      totalWidthMm: 1080,
      reqSheetWidthMm: 1250,
      pitchMm: 250,
      ribHeightMm: 35,
      ribTopWidthMm: 40,
      ribBaseWidthMm: 80,
      ribCount: 5,
      minorRibHeightMm: 2.0,
      description: 'Heavy-duty industrial trapezoidal profile for large commercial purlin spans.',
    },
    corrugated_sinusoidal: {
      id: 'corrugated_sinusoidal',
      name: 'Corrugated Wave',
      badge: 'Sinusoidal',
      coveredWidthMm: 914,
      totalWidthMm: 1000,
      reqSheetWidthMm: 1150,
      pitchMm: 76,
      ribHeightMm: 18,
      ribTopWidthMm: 38,
      ribBaseWidthMm: 38,
      ribCount: 12,
      minorRibHeightMm: 0,
      description: 'Classic sinusoidal 76/18 wave corrugated profile for residential and agricultural roofing.',
    },
    flat: {
      id: 'flat',
      name: 'Flat Smooth Panel',
      badge: 'Flat Sheet',
      coveredWidthMm: 1000,
      totalWidthMm: 1000,
      reqSheetWidthMm: 1000,
      pitchMm: 0,
      ribHeightMm: 0,
      ribTopWidthMm: 0,
      ribBaseWidthMm: 0,
      ribCount: 0,
      minorRibHeightMm: 0,
      description: 'Smooth flat sheet for architectural glazing, wall cladding, and tank linings.',
    },
    curved: {
      id: 'curved',
      name: 'Curved Architectural',
      badge: 'Arch Profile',
      coveredWidthMm: 1000,
      totalWidthMm: 1050,
      reqSheetWidthMm: 1200,
      pitchMm: 150,
      ribHeightMm: 25,
      ribTopWidthMm: 30,
      ribBaseWidthMm: 60,
      ribCount: 6,
      minorRibHeightMm: 1.0,
      description: 'Curved vaulted profile for skylight domes and curved canopy structures.',
    },
  };
}

export const SheetCrossProfile: React.FC<SheetCrossProfileProps> = ({
  config,
  onChangeProfile,
  compact = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const selectedProfileId = config.profile;

  const currentSpec = ProfileSpecs.PROFILES[selectedProfileId] || ProfileSpecs.PROFILES.profile_7v;

  const handleSelectProfile = (p: ProfileType) => {
    onChangeProfile(p);
  };

  // Helper to generate technical SVG path for profile cross section
  const renderSVGProfile = () => {
    const p = currentSpec;
    const svgWidth = 720;
    const svgHeight = 160;
    const paddingX = 40;
    const baselineY = 110;
    const thicknessPx = Math.max(2, config.thicknessMm * 1.5);

    if (p.id === 'flat') {
      const w = svgWidth - paddingX * 2;
      return (
        <g>
          {/* Flat top line */}
          <rect
            x={paddingX}
            y={baselineY - thicknessPx}
            width={w}
            height={thicknessPx}
            fill="#38bdf8"
            stroke="#0284c7"
            strokeWidth="1.5"
          />
          {/* Total width dimension */}
          <line x1={paddingX} y1={baselineY + 20} x2={paddingX + w} y2={baselineY + 20} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" />
          <text x={paddingX + w / 2} y={baselineY + 36} fill="#ef4444" textAnchor="middle" fontSize="12" fontFamily="monospace" fontWeight="bold">
            Total Width: {p.totalWidthMm}mm
          </text>
        </g>
      );
    }

    if (p.id === 'corrugated_sinusoidal') {
      const numWaves = 8;
      const waveWidth = (svgWidth - paddingX * 2) / numWaves;
      const amp = 20;

      let d = `M ${paddingX} ${baselineY}`;
      for (let i = 0; i < numWaves; i++) {
        const xStart = paddingX + i * waveWidth;
        const xMid = xStart + waveWidth / 2;
        const xEnd = xStart + waveWidth;
        d += ` Q ${xStart + waveWidth * 0.25} ${baselineY - amp}, ${xMid} ${baselineY}`;
        d += ` Q ${xStart + waveWidth * 0.75} ${baselineY + amp}, ${xEnd} ${baselineY}`;
      }

      return (
        <g>
          <path d={d} fill="none" stroke="#38bdf8" strokeWidth={thicknessPx} strokeLinecap="round" />
          {/* Dimension Pitch */}
          <line x1={paddingX} y1={baselineY - amp - 10} x2={paddingX + waveWidth} y2={baselineY - amp - 10} stroke="#22c55e" strokeWidth="1.5" />
          <text x={paddingX + waveWidth / 2} y={baselineY - amp - 16} fill="#22c55e" textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold">
            Pitch: {p.pitchMm}mm
          </text>
        </g>
      );
    }

    // Ribbed profiles: 7v, 6v, trapezoidal_rib, curved
    const numRibs = p.ribCount > 0 ? p.ribCount : 6;
    const availableW = svgWidth - paddingX * 2;
    const bayW = availableW / (numRibs - 0.5);
    const ribH = Math.min(45, p.ribHeightMm * 1.3);
    const topW = bayW * 0.22;
    const baseW = bayW * 0.5;
    const slopeW = (baseW - topW) / 2;

    const points: { x: number; y: number }[] = [];
    let curX = paddingX;

    for (let i = 0; i < numRibs; i++) {
      // Base flat left
      points.push({ x: curX, y: baselineY });

      // Up slope
      curX += slopeW;
      points.push({ x: curX, y: baselineY - ribH });

      // Top flat
      curX += topW;
      points.push({ x: curX, y: baselineY - ribH });

      // Down slope
      curX += slopeW;
      points.push({ x: curX, y: baselineY });

      // Flat span with minor stiffening flutes
      const flatSpanW = bayW - baseW;
      if (i < numRibs - 1 && flatSpanW > 0) {
        const minorStep = flatSpanW / 6;
        for (let m = 1; m <= 5; m++) {
          const mx = curX + m * minorStep;
          const my = m % 2 === 1 ? baselineY - 3 : baselineY;
          points.push({ x: mx, y: my });
        }
        curX += flatSpanW;
      }
    }

    const pathD = points.map((pt, idx) => `${idx === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(' ');

    const totalSpanX = curX - paddingX;
    const coverSpanX = totalSpanX * (p.coveredWidthMm / p.totalWidthMm);

    return (
      <g>
        {/* Fill area under profile */}
        <path d={`${pathD} L ${curX} ${baselineY + 10} L ${paddingX} ${baselineY + 10} Z`} fill="url(#resinGradient)" opacity="0.15" />

        {/* Thick sheet line */}
        <path d={pathD} fill="none" stroke="#38bdf8" strokeWidth={thicknessPx + 1} strokeLinejoin="round" strokeLinecap="round" />

        {/* Rib Height Dimension */}
        <line x1={paddingX + baseW / 2} y1={baselineY} x2={paddingX + baseW / 2} y2={baselineY - ribH} stroke="#22c55e" strokeWidth="1.2" strokeDasharray="2 2" />
        <text x={paddingX + baseW / 2 + 6} y={baselineY - ribH / 2 + 4} fill="#22c55e" fontSize="10" fontFamily="monospace" fontWeight="bold">
          {p.ribHeightMm}mm
        </text>

        {/* Pitch Dimension */}
        <line x1={paddingX + slopeW + topW / 2} y1={baselineY - ribH - 12} x2={paddingX + bayW + slopeW + topW / 2} y2={baselineY - ribH - 12} stroke="#22c55e" strokeWidth="1.5" />
        <line x1={paddingX + slopeW + topW / 2} y1={baselineY - ribH - 18} x2={paddingX + slopeW + topW / 2} y2={baselineY - ribH - 6} stroke="#22c55e" strokeWidth="1" />
        <line x1={paddingX + bayW + slopeW + topW / 2} y1={baselineY - ribH - 18} x2={paddingX + bayW + slopeW + topW / 2} y2={baselineY - ribH - 6} stroke="#22c55e" strokeWidth="1" />
        <text x={paddingX + bayW / 2 + slopeW + topW / 2} y={baselineY - ribH - 16} fill="#22c55e" textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold">
          Pitch: {p.pitchMm}mm
        </text>

        {/* Top Width Dimension callout */}
        <text x={paddingX + slopeW + topW / 2} y={baselineY - ribH - 2} fill="#60a5fa" textAnchor="middle" fontSize="9" fontFamily="monospace">
          {p.ribTopWidthMm}mm
        </text>

        {/* Minor Stiffening Flute Callout */}
        {p.minorRibHeightMm > 0 && (
          <g>
            <text x={paddingX + bayW * 1.5} y={baselineY + 16} fill="#a7f3d0" textAnchor="middle" fontSize="9" fontFamily="monospace">
              Stiffening Flutes ({p.minorRibHeightMm}mm)
            </text>
            <line x1={paddingX + bayW * 1.5} y1={baselineY + 8} x2={paddingX + bayW * 1.5} y2={baselineY - 1} stroke="#a7f3d0" strokeWidth="0.8" strokeDasharray="1 1" />
          </g>
        )}

        {/* Covered Width Dimension Line */}
        <line x1={paddingX} y1={baselineY + 28} x2={paddingX + coverSpanX} y2={baselineY + 28} stroke="#38bdf8" strokeWidth="1.5" />
        <line x1={paddingX} y1={baselineY + 22} x2={paddingX} y2={baselineY + 34} stroke="#38bdf8" strokeWidth="1.5" />
        <line x1={paddingX + coverSpanX} y1={baselineY + 22} x2={paddingX + coverSpanX} y2={baselineY + 34} stroke="#38bdf8" strokeWidth="1.5" />
        <text x={paddingX + coverSpanX / 2} y={baselineY + 42} fill="#38bdf8" textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold">
          Covered Width: {p.coveredWidthMm}mm
        </text>

        {/* Total Width Dimension Line */}
        <line x1={paddingX} y1={baselineY + 52} x2={paddingX + totalSpanX} y2={baselineY + 52} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" />
        <line x1={paddingX} y1={baselineY + 46} x2={paddingX} y2={baselineY + 58} stroke="#ef4444" strokeWidth="1.5" />
        <line x1={paddingX + totalSpanX} y1={baselineY + 46} x2={paddingX + totalSpanX} y2={baselineY + 58} stroke="#ef4444" strokeWidth="1.5" />
        <text x={paddingX + totalSpanX / 2} y={baselineY + 66} fill="#ef4444" textAnchor="middle" fontSize="11" fontFamily="monospace" fontWeight="bold">
          Total Width: {p.totalWidthMm}mm (Req. Raw Sheet: {p.reqSheetWidthMm}mm)
        </text>
      </g>
    );
  };

  if (compact) {
    return (
      <div className="flex flex-col gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Sheet Cross Profile</span>
          </label>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
            {currentSpec.badge}
          </span>
        </div>

        {/* Profile Picker Grid */}
        <div className="grid grid-cols-2 gap-1.5">
          {Object.values(ProfileSpecs.PROFILES).map((p) => {
            const isSelected = p.id === selectedProfileId;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectProfile(p.id)}
                className={`p-2 rounded-lg text-[11px] font-medium border text-left flex flex-col gap-0.5 transition-all ${
                  isSelected
                    ? 'bg-blue-600/30 border-blue-400 text-white font-bold ring-1 ring-blue-400 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate">{p.name}</span>
                  {isSelected && <Check className="w-3 h-3 text-blue-400 shrink-0" />}
                </div>
                <span className="text-[9px] font-mono text-slate-500">
                  {p.coveredWidthMm > 0 ? `${p.coveredWidthMm}mm cover` : 'Flat'}
                </span>
              </button>
            );
          })}
        </div>

        {/* SVG Mini Cross Section Preview */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 overflow-hidden relative">
          <div className="text-[9px] font-mono text-slate-400 flex items-center justify-between mb-1">
            <span>TECHNICAL CROSS SECTION</span>
            <span className="text-blue-400 font-bold">{currentSpec.totalWidthMm}mm Total</span>
          </div>
          <svg viewBox="0 0 720 160" className="w-full h-auto max-h-28">
            <defs>
              <linearGradient id="resinGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
            </defs>
            {renderSVGProfile()}
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 text-white">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
            <Ruler className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Technical Roofing Cross Profile</h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Precision Flute Geometry & Dimensional Callouts
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 flex items-center gap-1"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>{isExpanded ? 'Collapse' : 'Full Specs'}</span>
        </button>
      </div>

      {/* Profile Selector Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {Object.values(ProfileSpecs.PROFILES).map((p) => {
          const isSelected = p.id === selectedProfileId;
          return (
            <button
              key={p.id}
              onClick={() => handleSelectProfile(p.id)}
              className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                isSelected
                  ? 'bg-blue-600/30 border-blue-400 text-white font-bold ring-2 ring-blue-500/50 shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs">{p.badge}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                {p.coveredWidthMm ? `Cov: ${p.coveredWidthMm}mm` : 'Flat'}
              </div>
            </button>
          );
        })}
      </div>

      {/* SVG Technical Drawing Display */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 sm:p-4 relative">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-mono text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="font-bold text-white">{currentSpec.name}</span>
            <span className="text-slate-500">| Pitch: {currentSpec.pitchMm}mm</span>
          </div>
          <div className="text-[11px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            ASTM D3841 Standard
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <svg viewBox="0 0 720 160" className="w-full min-w-[500px] h-auto">
            <defs>
              <linearGradient id="resinGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
            </defs>
            {renderSVGProfile()}
          </svg>
        </div>

        <p className="text-[11px] text-slate-400 mt-2 italic leading-relaxed border-t border-slate-900 pt-2">
          {currentSpec.description}
        </p>
      </div>

      {/* Dimensional Breakdown Table */}
      {(() => {
        const m = calculateMaterials(config);
        return (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono text-xs">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block">FINISHED SHEET SIZE</span>
              <strong className="text-sm text-blue-400 font-bold">{config.lengthMm} × {config.widthMm} mm</strong>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block">LENGTH TRIM MARGIN</span>
              <strong className="text-sm text-emerald-400 font-bold">+{m.lengthMarginMm} mm / end</strong>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block">RAW MOLD LENGTH</span>
              <strong className="text-sm text-cyan-300 font-bold">{m.rawLengthMm} mm</strong>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block">DETERMINED FLAT RAW WIDTH</span>
              <strong className="text-sm text-cyan-300 font-bold">{m.flatWidthMm} mm</strong>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-500 block">APPLIED MYLAR FILM ROLL</span>
              <strong className="text-sm text-amber-400 font-bold">
                {config.mylarWidthMm} mm
              </strong>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
