import React from 'react';
import {
  Eye,
  Box,
  Compass,
  Maximize2,
  Minimize2,
  Video,
  Sun,
  Flame,
  Layers
} from 'lucide-react';

interface ViewportControlsProps {
  wireframeMode: boolean;
  onToggleWireframe: () => void;
  xrayMode: boolean;
  onToggleXray: () => void;
  selectedCameraPreset: 'orbit' | 'top' | 'side' | 'front' | 'closeup';
  onSelectCameraPreset: (preset: 'orbit' | 'top' | 'side' | 'front' | 'closeup') => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  onRecenterView?: () => void;
}

export const ViewportControls: React.FC<ViewportControlsProps> = ({
  wireframeMode,
  onToggleWireframe,
  xrayMode,
  onToggleXray,
  selectedCameraPreset,
  onSelectCameraPreset,
  isFullscreen = false,
  onToggleFullscreen,
  onRecenterView,
}) => {
  return (
    <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 flex flex-col items-end gap-1.5 sm:gap-2 max-w-[calc(100vw-1rem)]">
      {/* Camera Angle Presets & Fullscreen Toggle */}
      <div className="bg-slate-950/90 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-slate-800 flex items-center gap-1 shadow-lg text-xs text-slate-300 max-w-full overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-mono text-slate-500 uppercase px-1 flex items-center gap-1 shrink-0">
          <Video className="w-3 h-3 text-blue-400" /> <span className="hidden sm:inline">View:</span>
        </span>
        {[
          { id: 'orbit', label: '3D Orbit', shortLabel: '3D' },
          { id: 'top', label: 'Top', shortLabel: 'Top' },
          { id: 'side', label: 'Side', shortLabel: 'Side' },
          { id: 'front', label: 'Front', shortLabel: 'Front' },
          { id: 'closeup', label: 'Close-up', shortLabel: 'Close' },
        ].map((p) => (
          <button
            key={p.id}
            onClick={() => onSelectCameraPreset(p.id as any)}
            className={`px-2 sm:px-2.5 py-1 rounded-lg font-medium text-[10px] sm:text-xs whitespace-nowrap transition-all shrink-0 min-h-[32px] sm:min-h-0 flex items-center ${
              selectedCameraPreset === p.id
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="hidden sm:inline">{p.label}</span>
            <span className="sm:hidden">{p.shortLabel}</span>
          </button>
        ))}

        {onToggleFullscreen && (
          <button
            onClick={onToggleFullscreen}
            className={`px-2 py-1 rounded-lg font-medium text-[10px] sm:text-xs border transition-all flex items-center gap-1 ml-1 ${
              isFullscreen
                ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
            }`}
            title={isFullscreen ? 'Exit Fullscreen Mode' : 'Expand to Fullscreen View'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3 h-3" />
                <span className="hidden sm:inline">Exit Full</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline">Fullscreen</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Render Mode Toggles & Fit View Button */}
      <div className="bg-slate-950/90 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-slate-800 flex items-center gap-1.5 sm:gap-2 shadow-lg text-xs">
        {onRecenterView && (
          <button
            onClick={onRecenterView}
            className="px-2 sm:px-2.5 py-1 rounded-lg font-medium text-[10px] sm:text-xs flex items-center gap-1 sm:gap-1.5 border border-slate-700 bg-slate-900 text-emerald-400 hover:bg-slate-800 transition-all min-h-[32px] sm:min-h-0"
            title="Recenter & Fit Complete Machine in View"
          >
            <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 animate-spin-slow" />
            <span>Fit View</span>
          </button>
        )}

        <button
          onClick={onToggleWireframe}
          className={`px-2 sm:px-2.5 py-1 rounded-lg font-medium text-[10px] sm:text-xs flex items-center gap-1 sm:gap-1.5 border transition-all min-h-[32px] sm:min-h-0 ${
            wireframeMode
              ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          <Box className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>Wireframe</span>
        </button>

        <button
          onClick={onToggleXray}
          className={`px-2 sm:px-2.5 py-1 rounded-lg font-medium text-[10px] sm:text-xs flex items-center gap-1 sm:gap-1.5 border transition-all min-h-[32px] sm:min-h-0 ${
            xrayMode
              ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50'
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>X-Ray</span>
        </button>
      </div>
    </div>
  );
};
