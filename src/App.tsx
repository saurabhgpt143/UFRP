import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { RealtimeDryingBar } from './components/RealtimeDryingBar';
import { StepWorkflow, MobileStepBar } from './components/StepWorkflow';
import { ThreeCanvas } from './components/ThreeCanvas';
import { ConfigPanel } from './components/ConfigPanel';
import { MetricsBar } from './components/MetricsBar';
import { ViewportControls } from './components/ViewportControls';
import { DryingGraph } from './components/DryingGraph';
import { Product3DRenderer } from './components/Product3DRenderer';
import { InspectionModal } from './components/InspectionModal';
import { ReactionMechanismModal } from './components/ReactionMechanismModal';
import { ShareProductModal } from './components/ShareProductModal';
import { ThermalPrintModal } from './components/ThermalPrintModal';
import { RateAdjustmentModal } from './components/RateAdjustmentModal';
import { WhatsAppChatBubble } from './components/WhatsAppChatBubble';
import { FRPConfig, StepNumber } from './types';
import { calculateTables, calculateMaterials } from './utils/frpCalculations';
import { parseConfigFromUrl } from './utils/shareUtils';
import { soundFx } from './utils/soundEffects';
import { Boxes, Sparkles } from 'lucide-react';

const defaultConfig: FRPConfig = {
  lengthMm: 3600,
  lengthMarginMm: 50,
  widthMm: 1000,
  edgeMarginMm: 50,
  thicknessMm: 2.0,
  profile: 'corrugated_sinusoidal',
  color: 'crystal_transparent',
  resinType: 'orthophthalic',
  fiberType: 'csm_450',
  glassLayers: 2,
  resinToGlassRatio: 0.65,
  mylarWidthMm: 1200,
  mylarThicknessUm: 75,
  mylarFinish: 'gloss',
  catalystPercent: 2.0,
  cobaltPercent: 0.2,
  ambientTempC: 25,
  fillerType: 'none',
  fillerPercent: 0,
  dryingTempC: 50,
  dryingTimeMinutes: 30,
  weightKgPerMeter: 50,
  step1Method: 'stationary_table',
  step2Method: 'bopet_mylar',
  step3Method: 'two_stage_manual',
  step4Method: 'profile_die_clamp',
  step5Method: 'thermal_oven_bed',
  step6Method: 'manual_shear_trim',
};

export default function App() {
  const [config, setConfig] = useState<FRPConfig>(() => parseConfigFromUrl(defaultConfig));
  const [currentStep, setCurrentStep] = useState<StepNumber>(1);
  const [unrollProgress, setUnrollProgress] = useState<number>(0);
  const [curingProgress, setCuringProgress] = useState<number>(0);
  const [isHeating, setIsHeating] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(5);

  // Viewport overlays & modes
  const [activeViewportTab, setActiveViewportTab] = useState<'machine' | 'product'>('machine');
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const [xrayMode, setXrayMode] = useState<boolean>(false);
  const [backlightMode, setBacklightMode] = useState<boolean>(false);
  const [flexAmount, setFlexAmount] = useState<number>(0);
  const [selectedCameraPreset, setSelectedCameraPreset] = useState<'orbit' | 'top' | 'side' | 'front' | 'closeup'>('orbit');
  const [isFullscreen3D, setIsFullscreen3D] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isMechanismOpen, setIsMechanismOpen] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);
  const [isThermalPrintOpen, setIsThermalPrintOpen] = useState<boolean>(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState<boolean>(false);

  // Derived calculations
  const tableSpec = calculateTables(config);
  const materials = calculateMaterials(config);

  // Apply Presets
  const handleApplyPreset = (presetName: string) => {
    soundFx.playClick();
    if (presetName === 'roof_corrugated') {
      setConfig({
        ...defaultConfig,
        lengthMm: 3600,
        widthMm: 1000,
        thicknessMm: 1.5,
        profile: 'corrugated_sinusoidal',
        color: 'sky_blue',
        resinType: 'orthophthalic',
        mylarWidthMm: 1200,
      });
    } else if (presetName === 'trapezoidal_industrial') {
      setConfig({
        ...defaultConfig,
        lengthMm: 6000,
        widthMm: 1000,
        thicknessMm: 2.0,
        profile: 'trapezoidal_rib',
        color: 'opal_white',
        resinType: 'isophthalic',
        mylarWidthMm: 1350,
        fiberType: 'csm_450',
        glassLayers: 2,
      });
    } else if (presetName === 'heavy_chemical') {
      setConfig({
        ...defaultConfig,
        lengthMm: 7200,
        widthMm: 1200,
        thicknessMm: 3.0,
        profile: 'profile_7v',
        color: 'emerald_green',
        resinType: 'vinyl_ester',
        mylarWidthMm: 1500,
        fiberType: 'woven_roving_600',
        glassLayers: 3,
        fillerType: 'ath_flame_retardant',
        fillerPercent: 20,
      });
    } else if (presetName === 'railway_canopy') {
      setConfig({
        ...defaultConfig,
        lengthMm: 4800,
        widthMm: 1200,
        thicknessMm: 2.5,
        profile: 'curved',
        color: 'opal_white',
        resinType: 'acrylic_modified',
        mylarWidthMm: 1400,
        fiberType: 'multiaxial_800',
        glassLayers: 2,
      });
    }
  };

  // Reset simulation
  const handleReset = () => {
    soundFx.playClick();
    setConfig(defaultConfig);
    setCurrentStep(1);
    setUnrollProgress(0);
    setCuringProgress(0);
    setIsHeating(false);
    setBacklightMode(false);
    setFlexAmount(0);
  };

  // Mylar Unroll Animation
  const handleStartUnroll = () => {
    setUnrollProgress(0);
    let prog = 0;
    const timer = setInterval(() => {
      prog += 0.05;
      if (prog >= 1) {
        prog = 1;
        clearInterval(timer);
      }
      setUnrollProgress(prog);
    }, 40);
  };

  // Curing Timer Effect
  useEffect(() => {
    if (!isHeating || currentStep !== 5) return;

    const intervalMs = 200;
    const timer = setInterval(() => {
      setCuringProgress((prev) => {
        const increment = (0.5 * speedMultiplier * (config.dryingTempC / 40) * (config.catalystPercent / 2));
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setIsHeating(false);
          soundFx.playSuccess();
          handleSelectStep(6);
          return 100;
        }
        return next;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isHeating, currentStep, speedMultiplier, config.dryingTempC, config.catalystPercent]);

  // Fast forward curing
  const handleFastForwardCuring = () => {
    setCuringProgress(100);
    setIsHeating(false);
    soundFx.playSuccess();
    handleSelectStep(6);
  };

  const handleSelectStep = (step: StepNumber) => {
    soundFx.playClick();
    setCurrentStep(step);
    if (step >= 3 && unrollProgress < 1) {
      setUnrollProgress(1);
    }
    if (step < 6) {
      setActiveViewportTab('machine');
    } else if (step === 6) {
      setActiveViewportTab('product');
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-950 font-sans text-white overflow-hidden select-none">
      {/* Top Header */}
      <Header
        config={config}
        onApplyPreset={handleApplyPreset}
        onReset={handleReset}
        soundEnabled={soundEnabled}
        onToggleSound={() => {
          soundFx.enabled = !soundEnabled;
          setSoundEnabled(!soundEnabled);
        }}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenMechanism={() => setIsMechanismOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenThermalPrint={() => setIsThermalPrintOpen(true)}
        onOpenRateModal={() => setIsRateModalOpen(true)}
        onToggleProduct3DView={() => setActiveViewportTab(activeViewportTab === 'machine' ? 'product' : 'machine')}
        active3DView={activeViewportTab}
      />

      {/* Real-time Drying Status Bar during Step 5 / Heating period */}
      {(currentStep === 5 || isHeating) && (
        <RealtimeDryingBar
          config={config}
          materials={materials}
          curingProgress={curingProgress}
          isHeating={isHeating}
          onToggleHeating={() => setIsHeating(!isHeating)}
          onFastForward={handleFastForwardCuring}
          speedMultiplier={speedMultiplier}
          onChangeSpeed={setSpeedMultiplier}
        />
      )}

      {/* Main Grid Workspace: Vertical in Portrait, Side-by-side in Desktop */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative">
        {/* Mobile / Portrait Step Navigation Header */}
        <MobileStepBar
          currentStep={currentStep}
          onSelectStep={handleSelectStep}
          curingProgress={curingProgress}
          config={config}
        />

        {/* Left Sidebar: Step Workflow Navigation (Desktop) */}
        <div className="w-80 shrink-0 hidden lg:block">
          <StepWorkflow
            currentStep={currentStep}
            onSelectStep={handleSelectStep}
            curingProgress={curingProgress}
            config={config}
          />
        </div>

        {/* Center: Interactive 3D WebGL Viewport */}
        <div
          className={
            isFullscreen3D
              ? 'fixed inset-0 z-50 bg-slate-950 flex flex-col w-full h-full'
              : 'w-full lg:flex-1 relative bg-slate-900 overflow-hidden h-[50vh] sm:h-[55vh] min-h-[340px] max-h-[580px] lg:h-full lg:max-h-none shrink-0 lg:shrink flex flex-col'
          }
        >
          {/* Viewport Sub-header Tab Bar */}
          <div className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-3 py-1.5 flex items-center justify-between gap-2 z-20 shrink-0">
            <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs shadow-inner">
              <button
                type="button"
                onClick={() => setActiveViewportTab('machine')}
                className={`px-2.5 sm:px-3 py-1 rounded-lg font-semibold text-[11px] sm:text-xs transition-all flex items-center gap-1.5 ${
                  activeViewportTab === 'machine'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 ring-1 ring-blue-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Boxes className="w-3.5 h-3.5 text-blue-400" />
                <span>Line Machine View</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveViewportTab('product')}
                className={`px-2.5 sm:px-3 py-1 rounded-lg font-semibold text-[11px] sm:text-xs transition-all flex items-center gap-1.5 ${
                  activeViewportTab === 'product'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-bold ring-1 ring-amber-300'
                    : 'text-slate-400 hover:text-amber-300'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>3D Final Product Showcase</span>
              </button>
            </div>

            <div className="text-[10px] font-mono text-slate-400 hidden sm:flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${activeViewportTab === 'product' ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400 animate-ping'}`}></span>
              <span>{activeViewportTab === 'product' ? 'Solar Light Pass Simulator' : 'Modular Production Table'}</span>
            </div>
          </div>

          {/* Viewport Body */}
          <div className="relative flex-1 w-full h-full overflow-hidden">
            {activeViewportTab === 'machine' ? (
              <>
                <ThreeCanvas
                  config={config}
                  tableSpec={tableSpec}
                  materials={materials}
                  currentStep={currentStep}
                  curingProgress={curingProgress}
                  isHeating={isHeating}
                  wireframeMode={wireframeMode}
                  xrayMode={xrayMode}
                  backlightMode={backlightMode}
                  flexAmount={flexAmount}
                  unrollProgress={unrollProgress}
                  selectedCameraPreset={selectedCameraPreset}
                />

                {/* Viewport Overlay Controls */}
                <ViewportControls
                  wireframeMode={wireframeMode}
                  onToggleWireframe={() => setWireframeMode(!wireframeMode)}
                  xrayMode={xrayMode}
                  onToggleXray={() => setXrayMode(!xrayMode)}
                  selectedCameraPreset={selectedCameraPreset}
                  onSelectCameraPreset={setSelectedCameraPreset}
                  isFullscreen={isFullscreen3D}
                  onToggleFullscreen={() => setIsFullscreen3D(!isFullscreen3D)}
                  onRecenterView={() => setSelectedCameraPreset('orbit')}
                />

                {/* Exothermic Graph during Drying (Step 5) */}
                {currentStep === 5 && (
                  <DryingGraph
                    curingProgress={curingProgress}
                    dryingTempC={config.dryingTempC}
                    peakExothermTempC={materials.peakExothermTempC}
                    isHeating={isHeating}
                  />
                )}
              </>
            ) : (
              <div className="w-full h-full relative">
                <Product3DRenderer
                  config={config}
                  height="h-full"
                  showSunlightControlPanel={true}
                  onShare={() => setIsShareOpen(true)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Configuration Panel: Bottom stack on Mobile Portrait, Right Sidebar on Desktop */}
        <div className="w-full lg:w-80 shrink-0 lg:h-full">
          <ConfigPanel
            config={config}
            onChangeConfig={setConfig}
            tableSpec={tableSpec}
            materials={materials}
            currentStep={currentStep}
            unrollProgress={unrollProgress}
            onStartUnroll={handleStartUnroll}
            curingProgress={curingProgress}
            isHeating={isHeating}
            onToggleHeating={() => setIsHeating(!isHeating)}
            onFastForwardCuring={handleFastForwardCuring}
            speedMultiplier={speedMultiplier}
            onChangeSpeed={setSpeedMultiplier}
            backlightMode={backlightMode}
            onToggleBacklight={() => setBacklightMode(!backlightMode)}
            flexAmount={flexAmount}
            onChangeFlex={setFlexAmount}
            onSelectStep={handleSelectStep}
            onDemoldAndLift={() => {
              setCurrentStep(6);
            }}
            onOpenReportModal={() => setIsReportOpen(true)}
            onOpenMechanism={() => setIsMechanismOpen(true)}
            onOpenThermalPrint={() => setIsThermalPrintOpen(true)}
            onOpenRateModal={() => setIsRateModalOpen(true)}
          />
        </div>
      </div>

      {/* Bottom Engineering Metrics Dashboard */}
      <MetricsBar
        config={config}
        tableSpec={tableSpec}
        materials={materials}
        curingProgress={curingProgress}
        onOpenRateModal={() => setIsRateModalOpen(true)}
      />

      {/* Inspection Certificate Modal */}
      <InspectionModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        config={config}
        tableSpec={tableSpec}
        materials={materials}
        onOpenShare={() => setIsShareOpen(true)}
        onOpenRateModal={() => setIsRateModalOpen(true)}
      />

      {/* Chemical Reaction Mechanism Visualizer Modal */}
      <ReactionMechanismModal
        isOpen={isMechanismOpen}
        onClose={() => setIsMechanismOpen(false)}
        config={config}
        materials={materials}
      />

      {/* Share Product & 3D Spec Modal */}
      <ShareProductModal
        config={config}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />

      {/* Thermal Print Batch Ticket Modal */}
      <ThermalPrintModal
        isOpen={isThermalPrintOpen}
        onClose={() => setIsThermalPrintOpen(false)}
        config={config}
        materials={materials}
      />

      {/* Rate Adjustment Modal */}
      <RateAdjustmentModal
        isOpen={isRateModalOpen}
        onClose={() => setIsRateModalOpen(false)}
        config={config}
        materials={materials}
        updateField={(field, val) => setConfig((prev) => ({ ...prev, [field]: val }))}
      />

      {/* WhatsApp Support Floating Bubble */}
      <WhatsAppChatBubble />
    </div>
  );
}
