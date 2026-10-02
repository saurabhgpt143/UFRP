import React from 'react';
import {
  Boxes,
  RotateCcw,
  Volume2,
  VolumeX,
  Layers,
  Sparkles,
  CheckCircle2,
  Sliders,
  FileSpreadsheet,
  Atom,
  Share2,
  Printer,
  IndianRupee,
  Download,
  Smartphone,
  Clock,
  Sun,
  Palette
} from 'lucide-react';
import { FRPConfig } from '../types';
import { soundFx } from '../utils/soundEffects';
import { usePwaInstall } from '../usePwaInstall';

interface HeaderProps {
  config: FRPConfig;
  onApplyPreset: (presetName: string) => void;
  onReset: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenReport: () => void;
  onOpenMechanism?: () => void;
  onOpenTimingModal?: () => void;
  onOpenStyreneUvModal?: () => void;
  onOpenColorMakerModal?: () => void;
  onOpenShare?: () => void;
  onOpenThermalPrint?: () => void;
  onOpenRateModal?: () => void;
  onToggleProduct3DView?: () => void;
  active3DView?: 'machine' | 'product';
}

export const Header: React.FC<HeaderProps> = ({
  config,
  onApplyPreset,
  onReset,
  soundEnabled,
  onToggleSound,
  onOpenReport,
  onOpenMechanism,
  onOpenTimingModal,
  onOpenStyreneUvModal,
  onOpenColorMakerModal,
  onOpenShare,
  onOpenThermalPrint,
  onOpenRateModal,
  onToggleProduct3DView,
  active3DView = 'machine',
}) => {
  const { isInstallable, isInstalled, installPwa } = usePwaInstall();

  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 px-3 sm:px-4 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4 text-white z-20">
      {/* Title & UFRP Vector Logo Badge */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-slate-950 p-1 flex items-center justify-center border border-amber-500/40 shadow-lg shadow-amber-500/10 shrink-0 group">
          <img
            src="/icon.svg"
            alt="UFRP Vector Logo"
            className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]"
          />
          <span className="absolute -bottom-1 -right-1 px-1 py-0.2 bg-amber-500 text-[8px] font-extrabold text-slate-950 rounded uppercase tracking-tighter">
            PWA
          </span>
        </div>
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h1 className="text-sm sm:text-lg font-bold tracking-tight text-white font-sans truncate flex items-center gap-1.5">
              <span>UFRP</span>
              <span className="text-slate-400 font-normal text-xs hidden xs:inline">Sheet Engineering</span>
            </h1>
            <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-mono font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-md shrink-0 flex items-center gap-1">
              <span>IS 12866</span>
              <span className="text-slate-400">|</span>
              <span className="text-amber-300">M.G. Ind.</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans hidden sm:block">
            Unsaturated Fiberglass Reinforced Polymer Pultrusion & Thermal Recipe POS
          </p>
        </div>
      </div>

      {/* Preset Profiles & Tools */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Mobile Preset Selector */}
        <div className="md:hidden">
          <select
            onChange={(e) => {
              if (e.target.value) {
                onApplyPreset(e.target.value);
                e.target.value = '';
              }
            }}
            defaultValue=""
            className="bg-slate-800 border border-slate-700 text-[11px] text-slate-200 rounded-lg px-2 py-1.5 focus:outline-none"
          >
            <option value="" disabled>Presets...</option>
            <option value="roof_corrugated">IS 12866 Corrugated</option>
            <option value="trapezoidal_industrial">Tata/JSW Profile</option>
            <option value="heavy_chemical">Chemical Plant Shed</option>
            <option value="railway_canopy">Railway Platform Canopy</option>
          </select>
        </div>

        {/* Desktop Preset Buttons */}
        <div className="hidden md:flex items-center bg-slate-950/80 p-1 rounded-lg border border-slate-800 text-xs">
          <span className="text-slate-400 font-medium px-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Presets:
          </span>
          <button
            onClick={() => onApplyPreset('roof_corrugated')}
            className="px-2 py-1 rounded-md font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            IS 12866 Corrugated
          </button>
          <button
            onClick={() => onApplyPreset('trapezoidal_industrial')}
            className="px-2 py-1 rounded-md font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Tata/JSW Profile
          </button>
          <button
            onClick={() => onApplyPreset('heavy_chemical')}
            className="px-2 py-1 rounded-md font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Chemical Plant Shed
          </button>
          <button
            onClick={() => onApplyPreset('railway_canopy')}
            className="px-2 py-1 rounded-md font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Railway Canopy
          </button>
        </div>

        {/* 3D Final Product Showcase Button */}
        {onToggleProduct3DView && (
          <button
            onClick={onToggleProduct3DView}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg border transition-all shadow-sm ${
              active3DView === 'product'
                ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold ring-1 ring-amber-400'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
            }`}
            title="View Final 3D FRP Sheet Product Visualizer"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-pulse" />
            <span>3D Final Product</span>
          </button>
        )}

        {/* Reaction Mechanism Chemistry Button */}
        {onOpenMechanism && (
          <button
            onClick={onOpenMechanism}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600/30 transition-all shadow-sm"
          >
            <Atom className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400 animate-spin-slow" />
            <span>Reaction Mechanism</span>
          </button>
        )}

        {/* Process Timing & Gel Window Schedule Button */}
        {onOpenTimingModal && (
          <button
            onClick={onOpenTimingModal}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all shadow-sm"
            title="Open Process Timing & Gel Window Schedule"
          >
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 animate-pulse" />
            <span>Gel Timing<span className="hidden sm:inline"> Schedule</span></span>
          </button>
        )}

        {/* Styrene & UV Stabilizer Engineering Recommendations Button */}
        {onOpenStyreneUvModal && (
          <button
            onClick={onOpenStyreneUvModal}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all shadow-sm"
            title="Open Styrene & UV Stabilizer Formulation Recommendations"
          >
            <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            <span>Styrene &amp; UV<span className="hidden sm:inline"> Guide</span></span>
          </button>
        )}

        {/* Color Maker RAL Studio Button */}
        {onOpenColorMakerModal && (
          <button
            onClick={onOpenColorMakerModal}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30 transition-all shadow-sm"
            title="Open Color Maker RAL Specifications Studio"
          >
            <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
            <span>Color Maker<span className="hidden sm:inline"> (RAL)</span></span>
          </button>
        )}

        {/* Certificate / Report Button */}
        <button
          onClick={onOpenReport}
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30 transition-all shadow-sm"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
          <span>Spec Sheet<span className="hidden sm:inline"> & Report</span></span>
        </button>

        {/* Share Product Button */}
        {onOpenShare && (
          <button
            onClick={onOpenShare}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-600/30 transition-all shadow-sm"
            title="Share Product Specification and 3D View"
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
            <span>Share<span className="hidden sm:inline"> Product</span></span>
          </button>
        )}

        {/* PWA Install Button / Installed Badge */}
        {isInstalled ? (
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-mono font-bold rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30" title="UFRP Progressive Web App Active">
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>UFRP App</span>
          </div>
        ) : (
          <button
            onClick={installPwa}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-bold rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition-all cursor-pointer shrink-0"
            title="Install UFRP as Progressive Web App"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install<span className="hidden sm:inline"> UFRP PWA</span></span>
          </button>
        )}

        {/* Adjust Rates Button */}
        {onOpenRateModal && (
          <button
            onClick={onOpenRateModal}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40 hover:bg-teal-500/30 transition-all shadow-sm cursor-pointer"
            title="Adjust Commercial Rates, Raw Material Prices & Profit Margins"
          >
            <IndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400" />
            <span>Adjust<span className="hidden sm:inline"> Rates</span></span>
          </button>
        )}

        {/* Thermal Print Mixture Button */}
        {onOpenThermalPrint && (
          <button
            onClick={onOpenThermalPrint}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all shadow-sm"
            title="Print Thermal Batch Slip / Recipe Receipt"
          >
            <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <span>Thermal Print<span className="hidden sm:inline"> Mix</span></span>
          </button>
        )}

        {/* Audio Toggle */}
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
          className="p-1.5 sm:p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700 transition-colors"
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          title="Reset Simulation Process"
          className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden xs:inline sm:inline">Reset</span>
        </button>
      </div>
    </header>
  );
};
