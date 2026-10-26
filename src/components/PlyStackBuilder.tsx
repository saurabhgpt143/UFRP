import React from 'react';
import { FRPConfig, GlassFiberType, GlassPlyItem, MaterialCalculations } from '../types';
import { GLASS_FIBER_SPECS, resolvePlySchedule } from '../utils/frpCalculations';
import { EditableNumberInput } from './EditableNumberInput';
import { Layers, Plus, Trash2, ArrowUp, ArrowDown, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

interface PlyStackBuilderProps {
  config: FRPConfig;
  materials: MaterialCalculations;
  onChangeConfig: (newConfig: FRPConfig) => void;
  compact?: boolean;
}

export const PlyStackBuilder: React.FC<PlyStackBuilderProps> = ({
  config,
  materials,
  onChangeConfig,
  compact = false,
}) => {
  const activePlies = resolvePlySchedule(config);

  const applyPlySchedule = (newPlies: GlassPlyItem[], autoSyncThickness = false) => {
    soundFx.playClick();
    const safePlies: GlassPlyItem[] =
      newPlies.length > 0 ? newPlies : [{ id: 'ply-1', fiberType: config.fiberType || 'csm_450' }];

    // Compute weighted recommended resin ratio across the new ply schedule
    let totalGsm = 0;
    let weightedRatioSum = 0;
    for (const p of safePlies) {
      const spec = GLASS_FIBER_SPECS[p.fiberType] || GLASS_FIBER_SPECS['csm_450'];
      const gsm = p.customGsm && p.customGsm > 0 ? p.customGsm : spec.gsmPerLayer;
      totalGsm += gsm;
      weightedRatioSum += spec.recommendedResinRatio * gsm;
    }
    const weightedResinRatio = totalGsm > 0 ? parseFloat((weightedRatioSum / totalGsm).toFixed(2)) : 0.67;

    // Determine dominant fiberType for backward compatibility
    const dominantPly = safePlies.reduce((best, cur) => {
      const bestGsm = best.customGsm ?? GLASS_FIBER_SPECS[best.fiberType].gsmPerLayer;
      const curGsm = cur.customGsm ?? GLASS_FIBER_SPECS[cur.fiberType].gsmPerLayer;
      return curGsm > bestGsm ? cur : best;
    }, safePlies[0]);

    const nextConfig: FRPConfig = {
      ...config,
      plySchedule: safePlies,
      glassLayers: safePlies.length,
      fiberType: dominantPly.fiberType,
      resinToGlassRatio: weightedResinRatio,
    };

    if (autoSyncThickness) {
      const estThickness = estimateCuredThicknessMm(safePlies, weightedResinRatio);
      nextConfig.thicknessMm = estThickness;
    }

    onChangeConfig(nextConfig);
  };

  // Estimate cured laminate thickness from glass GSM and resin ratio
  const estimateCuredThicknessMm = (plies: { fiberType: GlassFiberType; customGsm?: number }[], resinRatio: number) => {
    const totalGlassGsm = plies.reduce((sum, p) => {
      const spec = GLASS_FIBER_SPECS[p.fiberType] || GLASS_FIBER_SPECS['csm_450'];
      return sum + (p.customGsm && p.customGsm > 0 ? p.customGsm : spec.gsmPerLayer);
    }, 0);
    const glassRatio = Math.max(0.15, 1 - resinRatio);
    const totalResinGsm = (totalGlassGsm / glassRatio) * resinRatio;
    // Glass density ~2.54 g/cm3 (2540 g/m2 per mm), Resin density ~1.15 g/cm3 (1150 g/m2 per mm)
    const thicknessMm = totalGlassGsm / 2540 + totalResinGsm / 1150;
    return Math.max(0.5, parseFloat(thicknessMm.toFixed(1)));
  };

  const currentItems: GlassPlyItem[] = activePlies.map((p) => ({
    id: p.id,
    fiberType: p.fiberType,
    customGsm: p.gsm,
  }));

  const handleAddPly = (fiberType: GlassFiberType) => {
    const spec = GLASS_FIBER_SPECS[fiberType];
    const newPly: GlassPlyItem = {
      id: `ply-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      fiberType,
      customGsm: spec.gsmPerLayer,
    };
    applyPlySchedule([...currentItems, newPly]);
  };

  const handleUpdatePlyType = (index: number, newType: GlassFiberType) => {
    const spec = GLASS_FIBER_SPECS[newType];
    const updated = currentItems.map((item, idx) =>
      idx === index ? { ...item, fiberType: newType, customGsm: spec.gsmPerLayer } : item
    );
    applyPlySchedule(updated);
  };

  const handleUpdatePlyGsm = (index: number, newGsm: number) => {
    const clampedGsm = Math.max(1, Math.min(3000, Math.round(newGsm)));
    const updated = currentItems.map((item, idx) =>
      idx === index ? { ...item, customGsm: clampedGsm } : item
    );
    applyPlySchedule(updated);
  };

  const handleRemovePly = (index: number) => {
    if (currentItems.length <= 1) return;
    const updated = currentItems.filter((_, idx) => idx !== index);
    applyPlySchedule(updated);
  };

  const handleMovePly = (index: number, direction: -1 | 1) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= currentItems.length) return;
    const updated = [...currentItems];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    applyPlySchedule(updated);
  };

  const estCuredThicknessMm = estimateCuredThicknessMm(currentItems, config.resinToGlassRatio);

  const getPlyBadgeStyle = (fiberType: GlassFiberType) => {
    if (fiberType === 'surface_veil_30') return 'bg-cyan-950/90 border-cyan-500/40 text-cyan-300';
    if (fiberType === 'polymer_mesh') return 'bg-teal-950/90 border-teal-500/40 text-teal-300';
    if (fiberType === 'printed_cloth') return 'bg-pink-950/90 border-pink-500/40 text-pink-300';
    if (fiberType.includes('woven')) return 'bg-amber-950/90 border-amber-500/40 text-amber-300';
    if (fiberType.includes('multiaxial')) return 'bg-purple-950/90 border-purple-500/40 text-purple-300';
    return 'bg-blue-950/90 border-blue-500/40 text-blue-300';
  };

  const getPlyPositionLabel = (idx: number, total: number) => {
    if (total === 1) return 'Single Core Ply';
    if (idx === 0) return 'Top Weather Skin';
    if (idx === total - 1) return 'Bottom Mold Skin';
    return `Core Ply #${idx + 1}`;
  };

  return (
    <div className="bg-slate-950/90 border border-emerald-500/30 rounded-xl p-3 flex flex-col gap-2.5 shadow-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold text-white uppercase flex items-center gap-1.5">
              <span>Multi-Ply Laminate Stack Builder</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 block">
              Add CSM, Woven Roving, Polymer Mesh, Printed Cloth, Surface Veil &amp; custom GSM per layer
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
              materials.isHybridPlySchedule
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-blue-500/20 border-blue-500/40 text-blue-300'
            }`}
          >
            {materials.isHybridPlySchedule ? 'Hybrid Multi-Ply' : 'Uniform Plies'}
          </span>
          <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
            {activePlies.length} {activePlies.length === 1 ? 'Ply' : 'Plies'} • {materials.glassWeightGsm} GSM
          </span>
        </div>
      </div>

      {/* Individual Plies List */}
      <div className="flex flex-col gap-1.5">
        {activePlies.map((ply, idx) => (
          <div
            key={ply.id || idx}
            className={`p-2 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all ${getPlyBadgeStyle(
              ply.fiberType
            )}`}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-slate-950/80 border border-white/10 text-white shrink-0">
                Ply {idx + 1}
              </span>
              <span className="text-[9px] font-mono uppercase tracking-wider opacity-80 shrink-0 hidden md:inline">
                [{getPlyPositionLabel(idx, activePlies.length)}]
              </span>
              <select
                aria-label={`Ply ${idx + 1} Fiber Type`}
                value={ply.fiberType}
                onChange={(e) => handleUpdatePlyType(idx, e.target.value as GlassFiberType)}
                className="bg-slate-900 border border-slate-700 text-white text-[11px] font-mono font-bold rounded px-2 py-1 focus:outline-none focus:border-emerald-400 flex-1 min-w-0 cursor-pointer"
              >
                {(Object.keys(GLASS_FIBER_SPECS) as GlassFiberType[]).map((fKey) => {
                  const s = GLASS_FIBER_SPECS[fKey];
                  return (
                    <option key={fKey} value={fKey}>
                      {s.shortName} ({s.recommendedResinRatioPercent}% Resin)
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-1.5 shrink-0">
              {/* Custom GSM Input for this Ply */}
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 focus-within:border-emerald-400">
                <EditableNumberInput
                  min={1}
                  max={3000}
                  step={ply.fiberType === 'polymer_mesh' ? 1 : 25}
                  value={ply.gsm}
                  onChange={(val) => handleUpdatePlyGsm(idx, val)}
                  className="w-12 bg-transparent text-right font-mono font-bold text-emerald-300 focus:outline-none text-[11px]"
                />
                <span className="text-[9px] font-mono text-slate-400">GSM</span>
              </div>

              {/* Reorder Up/Down & Remove */}
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMovePly(idx, -1)}
                  title="Move Ply Up"
                  className="p-1 rounded bg-slate-900/80 hover:bg-slate-800 disabled:opacity-30 text-slate-300 hover:text-white border border-slate-700/70 cursor-pointer"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  disabled={idx === activePlies.length - 1}
                  onClick={() => handleMovePly(idx, 1)}
                  title="Move Ply Down"
                  className="p-1 rounded bg-slate-900/80 hover:bg-slate-800 disabled:opacity-30 text-slate-300 hover:text-white border border-slate-700/70 cursor-pointer"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  disabled={activePlies.length <= 1}
                  onClick={() => handleRemovePly(idx)}
                  title="Remove Ply"
                  className="p-1 rounded bg-red-950/60 hover:bg-red-900/80 disabled:opacity-30 text-red-300 hover:text-white border border-red-500/30 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* + Add Different Ply Buttons */}
      <div className="flex flex-col gap-1.5 pt-1 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span className="font-bold text-emerald-300 flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add Different Ply to Stack:
          </span>
          <span>Click any reinforcement / interlayer to append</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1">
          {[
            { type: 'polymer_mesh' as GlassFiberType, label: '+ Polymer Mesh 5g', style: 'border-teal-500/50 text-teal-300 hover:bg-teal-950/60 bg-teal-950/20' },
            { type: 'printed_cloth' as GlassFiberType, label: '+ Printed Cloth 100g', style: 'border-pink-500/50 text-pink-300 hover:bg-pink-950/60 bg-pink-950/20' },
            { type: 'surface_veil_30' as GlassFiberType, label: '+ Veil 30g', style: 'border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/60 bg-slate-900' },
            { type: 'csm_225' as GlassFiberType, label: '+ CSM 225g', style: 'border-blue-500/40 text-blue-300 hover:bg-blue-950/60 bg-slate-900' },
            { type: 'csm_300' as GlassFiberType, label: '+ CSM 300g', style: 'border-blue-500/40 text-blue-300 hover:bg-blue-950/60 bg-slate-900' },
            { type: 'csm_450' as GlassFiberType, label: '+ CSM 450g', style: 'border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/60 bg-slate-900' },
            { type: 'csm_600' as GlassFiberType, label: '+ CSM 600g', style: 'border-emerald-500/40 text-emerald-300 hover:bg-emerald-950/60 bg-slate-900' },
            { type: 'woven_roving_400' as GlassFiberType, label: '+ WR 400g', style: 'border-amber-500/40 text-amber-300 hover:bg-amber-950/60 bg-slate-900' },
            { type: 'woven_roving_600' as GlassFiberType, label: '+ WR 600g', style: 'border-amber-500/40 text-amber-300 hover:bg-amber-950/60 bg-slate-900' },
            { type: 'multiaxial_800' as GlassFiberType, label: '+ Biaxial 800g', style: 'border-purple-500/40 text-purple-300 hover:bg-purple-950/60 bg-slate-900' },
          ].map((btn) => (
            <button
              key={btn.type}
              type="button"
              onClick={() => handleAddPly(btn.type)}
              className={`py-1 px-1.5 rounded-lg border text-[10px] font-mono font-bold transition-all cursor-pointer ${btn.style}`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Separate Reinforcement & Interlayer Rate Input Boxes (Glass, Polymer Mesh, Printed Clothes in ₹/kg) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2 flex flex-col gap-1.5 text-[10px] font-mono">
        <div className="flex items-center justify-between text-slate-400">
          <span className="font-bold text-slate-300">Reinforcement &amp; Interlayer Rates (₹/kg):</span>
          <span className="text-[9px] text-slate-500">Separate editable rate boxes</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
          {/* Glass Fiber Rate Input Box */}
          <div className="bg-slate-950 px-2 py-1.5 rounded border border-emerald-500/30 flex items-center justify-between gap-1">
            <span className="text-emerald-300 font-semibold truncate">Glass (CSM/WR):</span>
            <div className="flex items-center gap-0.5 shrink-0">
              <span className="text-slate-400">₹</span>
              <EditableNumberInput
                value={materials.activeGlassRateInrPerKg}
                min={1}
                max={10000}
                step={5}
                onChange={(val) => onChangeConfig({ ...config, customGlassRateInrPerKg: val })}
                className="w-12 bg-slate-900 border border-slate-700 focus:border-emerald-400 rounded px-1 py-0.5 text-right font-bold text-emerald-300 focus:outline-none"
              />
              <span className="text-[9px] text-slate-500">/kg</span>
            </div>
          </div>

          {/* Polymer Mesh Rate Input Box */}
          <div className="bg-slate-950 px-2 py-1.5 rounded border border-teal-500/40 flex items-center justify-between gap-1">
            <span className="text-teal-300 font-semibold truncate">Polymer Mesh:</span>
            <div className="flex items-center gap-0.5 shrink-0">
              <span className="text-slate-400">₹</span>
              <EditableNumberInput
                value={materials.activePolymerMeshRateInrPerKg}
                min={0}
                max={15000}
                step={5}
                onChange={(val) => onChangeConfig({ ...config, customPolymerMeshRateInrPerKg: val })}
                className="w-12 bg-slate-900 border border-slate-700 focus:border-teal-400 rounded px-1 py-0.5 text-right font-bold text-teal-300 focus:outline-none"
              />
              <span className="text-[9px] text-slate-500">/kg</span>
            </div>
          </div>

          {/* Printed Clothes Rate Input Box */}
          <div className="bg-slate-950 px-2 py-1.5 rounded border border-pink-500/40 flex items-center justify-between gap-1">
            <span className="text-pink-300 font-semibold truncate">Printed Clothes:</span>
            <div className="flex items-center gap-0.5 shrink-0">
              <span className="text-slate-400">₹</span>
              <EditableNumberInput
                value={materials.activePrintedClothRateInrPerKg}
                min={0}
                max={20000}
                step={10}
                onChange={(val) => onChangeConfig({ ...config, customPrintedClothRateInrPerKg: val })}
                className="w-12 bg-slate-900 border border-slate-700 focus:border-pink-400 rounded px-1 py-0.5 text-right font-bold text-pink-300 focus:outline-none"
              />
              <span className="text-[9px] text-slate-500">/kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Hybrid Multi-Ply Layup Presets */}
      {!compact && (
        <div className="flex flex-col gap-1.5 pt-1.5 border-t border-slate-800/80">
          <span className="text-[10px] font-mono font-semibold text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> Quick Hybrid &amp; Standard Layup Presets:
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
            <button
              type="button"
              onClick={() =>
                applyPlySchedule(
                  [
                    { id: 'p1', fiberType: 'csm_450', customGsm: 450 },
                    { id: 'p2', fiberType: 'polymer_mesh', customGsm: 5 },
                    { id: 'p3', fiberType: 'csm_450', customGsm: 450 },
                  ],
                  true
                )
              }
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-teal-500/40 text-left flex flex-col gap-0.5 cursor-pointer"
            >
              <span className="font-bold text-teal-300">Polymer Mesh Core: CSM 450 + Mesh 5g + CSM 450</span>
              <span className="text-[9px] text-slate-400">905 GSM • Impact &amp; Hail-Resistant Safety Sheet</span>
            </button>

            <button
              type="button"
              onClick={() =>
                applyPlySchedule(
                  [
                    { id: 'p1', fiberType: 'surface_veil_30', customGsm: 30 },
                    { id: 'p2', fiberType: 'printed_cloth', customGsm: 100 },
                    { id: 'p3', fiberType: 'csm_450', customGsm: 450 },
                    { id: 'p4', fiberType: 'csm_450', customGsm: 450 },
                  ],
                  true
                )
              }
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-pink-500/40 text-left flex flex-col gap-0.5 cursor-pointer"
            >
              <span className="font-bold text-pink-300">Decorative Printed Cloth: Veil + Printed + 2× CSM</span>
              <span className="text-[9px] text-slate-400">1030 GSM • Designer Printed FRP Door / Sheet</span>
            </button>

            <button
              type="button"
              onClick={() =>
                applyPlySchedule(
                  [
                    { id: 'p1', fiberType: 'csm_300', customGsm: 300 },
                    { id: 'p2', fiberType: 'woven_roving_600', customGsm: 600 },
                    { id: 'p3', fiberType: 'csm_300', customGsm: 300 },
                  ],
                  true
                )
              }
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-amber-500/30 text-left flex flex-col gap-0.5 cursor-pointer"
            >
              <span className="font-bold text-amber-300">Sandwich: CSM 300 + WR 600 + CSM 300</span>
              <span className="text-[9px] text-slate-400">1200 GSM • High Stiffness Box/Roof</span>
            </button>

            <button
              type="button"
              onClick={() =>
                applyPlySchedule(
                  [
                    { id: 'p1', fiberType: 'surface_veil_30', customGsm: 30 },
                    { id: 'p2', fiberType: 'csm_450', customGsm: 450 },
                    { id: 'p3', fiberType: 'csm_450', customGsm: 450 },
                  ],
                  true
                )
              }
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-left flex flex-col gap-0.5 cursor-pointer"
            >
              <span className="font-bold text-cyan-300">Weather Shield: Veil 30 + 2× CSM 450</span>
              <span className="text-[9px] text-slate-400">930 GSM • Anti-Bloom UV Barrier</span>
            </button>

            <button
              type="button"
              onClick={() =>
                applyPlySchedule(
                  [
                    { id: 'p1', fiberType: 'csm_450', customGsm: 450 },
                    { id: 'p2', fiberType: 'woven_roving_600', customGsm: 600 },
                    { id: 'p3', fiberType: 'csm_450', customGsm: 450 },
                    { id: 'p4', fiberType: 'woven_roving_600', customGsm: 600 },
                  ],
                  true
                )
              }
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-purple-500/30 text-left flex flex-col gap-0.5 cursor-pointer"
            >
              <span className="font-bold text-purple-300">Heavy Duty: 2× (CSM 450 + WR 600)</span>
              <span className="text-[9px] text-slate-400">2100 GSM • Heavy Structural Load</span>
            </button>

            <button
              type="button"
              onClick={() =>
                applyPlySchedule(
                  [
                    { id: 'p1', fiberType: 'csm_450', customGsm: 450 },
                    { id: 'p2', fiberType: 'csm_450', customGsm: 450 },
                  ],
                  true
                )
              }
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-blue-500/30 text-left flex flex-col gap-0.5 cursor-pointer"
            >
              <span className="font-bold text-blue-300">Standard Roofing: 2× CSM 450</span>
              <span className="text-[9px] text-slate-400">900 GSM • Standard Industrial Sheet</span>
            </button>
          </div>
        </div>
      )}

      {/* Summary & Cured Thickness Sync Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono">
        <div className="flex flex-col">
          <span className="text-slate-400">
            Active Stack: <strong className="text-white">{materials.plySummaryText}</strong>
          </span>
          <span className="text-slate-400">
            Est. Cured Laminate Thickness: <strong className="text-cyan-300">~{estCuredThicknessMm} mm</strong> | Glass Mass:{' '}
            <strong className="text-emerald-300">{materials.totalGlassWeightKg.toFixed(2)} kg</strong>
          </span>
        </div>
        {Math.abs(config.thicknessMm - estCuredThicknessMm) >= 0.1 && (
          <button
            type="button"
            onClick={() => {
              soundFx.playClick();
              onChangeConfig({ ...config, thicknessMm: estCuredThicknessMm });
            }}
            className="px-2 py-1 rounded bg-cyan-600/30 hover:bg-cyan-600 text-cyan-200 hover:text-white border border-cyan-500/40 font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0"
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Sync Thickness ({estCuredThicknessMm}mm)</span>
          </button>
        )}
      </div>
    </div>
  );
};
