import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FRPConfig } from '../types';
import { getResinHexColor, calculateMaterials } from '../utils/frpCalculations';
import { RotateCw, Eye, Grid, Sparkles, Sun, Sunrise, Sunset, ChevronDown, ChevronUp, Share2 } from 'lucide-react';

interface Product3DRendererProps {
  config: FRPConfig;
  height?: string;
  showSunlightControlPanel?: boolean;
  onShare?: () => void;
}

export const Product3DRenderer: React.FC<Product3DRendererProps> = ({
  config,
  height = 'h-64 sm:h-80',
  showSunlightControlPanel = true,
  onShare,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [backlight, setBacklight] = useState<boolean>(false);
  const [sunlightMode, setSunlightMode] = useState<boolean>(true);
  const [sunTimeOfDay, setSunTimeOfDay] = useState<'morning' | 'noon' | 'afternoon'>('noon');
  const [isHudExpanded, setIsHudExpanded] = useState<boolean>(true);
  const controlsRef = useRef<OrbitControls | null>(null);

  const materials = calculateMaterials(config);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const heightPx = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(sunlightMode ? 0x020817 : 0x020617); // Slate canvas

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / heightPx, 0.1, 100);
    const lengthM = config.lengthMm / 1000;
    const widthM = config.widthMm / 1000;
    const maxDim = Math.max(lengthM, widthM);
    camera.position.set(maxDim * 1.1, maxDim * 0.7, maxDim * 1.2);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 2.0;
    controlsRef.current = controls;

    // Studio Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, sunlightMode ? 0.6 : 0.8);
    scene.add(ambientLight);

    // Fill Light
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.8);
    fillLight.position.set(-5, 4, -5);
    scene.add(fillLight);

    if (backlight) {
      const bLight = new THREE.SpotLight(0x38bdf8, 15, 10, Math.PI / 3);
      bLight.position.set(0, -1.5, 0);
      scene.add(bLight);
    }

    // -------------------------------------------------------------
    // SUNLIGHT SIMULATION & LIGHT TRANSMISSION SCENE SETUP
    // -------------------------------------------------------------
    const transmittanceRatio = materials.lightTransmittancePercent / 100;
    const hexColor = getResinHexColor(config.color, config.customHex);
    const floorY = -maxDim * 0.35;

    if (sunlightMode) {
      // Calculate solar position based on time of day
      let sunPos = new THREE.Vector3(0, maxDim * 2.0, 0.2); // Noon
      if (sunTimeOfDay === 'morning') {
        sunPos = new THREE.Vector3(-maxDim * 1.8, maxDim * 1.2, maxDim * 0.8);
      } else if (sunTimeOfDay === 'afternoon') {
        sunPos = new THREE.Vector3(maxDim * 1.8, maxDim * 1.2, maxDim * 0.8);
      }

      // 1. Directional Sun Light
      const sunLight = new THREE.DirectionalLight(0xfffae6, 3.8);
      sunLight.position.copy(sunPos);
      sunLight.castShadow = true;
      sunLight.shadow.mapSize.width = 1024;
      sunLight.shadow.mapSize.height = 1024;
      scene.add(sunLight);

      // 2. Visual 3D Sun Mesh Sphere
      const sunGeo = new THREE.SphereGeometry(maxDim * 0.07, 16, 16);
      const sunMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
      const sunMesh = new THREE.Mesh(sunGeo, sunMat);
      sunMesh.position.copy(sunPos);
      scene.add(sunMesh);

      // Outer Sun Glow Halo
      const sunGlowGeo = new THREE.SphereGeometry(maxDim * 0.12, 16, 16);
      const sunGlowMat = new THREE.MeshBasicMaterial({
        color: 0xfde047,
        transparent: true,
        opacity: 0.35,
      });
      const sunGlowMesh = new THREE.Mesh(sunGlowGeo, sunGlowMat);
      sunGlowMesh.position.copy(sunPos);
      scene.add(sunGlowMesh);

      // 3. Volumetric Incident Sunlight Beam (Sun down to Panel)
      const incidentBeamGeo = new THREE.CylinderGeometry(widthM * 0.7, widthM * 0.9, sunPos.y - 0, 16);
      const incidentBeamMat = new THREE.MeshBasicMaterial({
        color: 0xfef9c3,
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide,
      });
      const incidentBeamMesh = new THREE.Mesh(incidentBeamGeo, incidentBeamMat);
      incidentBeamMesh.position.set(sunPos.x * 0.5, sunPos.y * 0.5, sunPos.z * 0.5);
      incidentBeamMesh.rotation.z = Math.atan2(-sunPos.x, sunPos.y);
      scene.add(incidentBeamMesh);

      // 4. Ground / Floor Sensor Plane beneath panel
      const floorGeo = new THREE.PlaneGeometry(maxDim * 4, maxDim * 4);
      const floorMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.8,
        metalness: 0.2,
      });
      const floorMesh = new THREE.Mesh(floorGeo, floorMat);
      floorMesh.rotation.x = -Math.PI / 2;
      floorMesh.position.y = floorY;
      floorMesh.receiveShadow = true;
      scene.add(floorMesh);

      // Floor Grid Overlay
      const gridHelper = new THREE.GridHelper(maxDim * 4, 16, 0x334155, 0x1e293b);
      gridHelper.position.y = floorY + 0.001;
      scene.add(gridHelper);

      // 5. Transmitted Light Floor Spot (Sunlight passing through the panel)
      if (transmittanceRatio > 0.02) {
        const spotGeo = new THREE.PlaneGeometry(widthM * 1.05, lengthM * 1.05);
        const spotMat = new THREE.MeshBasicMaterial({
          color: hexColor,
          transparent: true,
          opacity: Math.min(0.85, transmittanceRatio * 0.85),
          side: THREE.DoubleSide,
        });
        const spotMesh = new THREE.Mesh(spotGeo, spotMat);
        spotMesh.rotation.x = -Math.PI / 2;
        spotMesh.position.set(0, floorY + 0.005, 0);
        scene.add(spotMesh);

        // Soft Outer Sunlight Diffusion Aura on Floor
        const auraGeo = new THREE.PlaneGeometry(widthM * 1.3, lengthM * 1.3);
        const auraMat = new THREE.MeshBasicMaterial({
          color: 0xfef08a,
          transparent: true,
          opacity: Math.min(0.4, transmittanceRatio * 0.4),
          side: THREE.DoubleSide,
        });
        const auraMesh = new THREE.Mesh(auraGeo, auraMat);
        auraMesh.rotation.x = -Math.PI / 2;
        auraMesh.position.set(0, floorY + 0.003, 0);
        scene.add(auraMesh);

        // 6. Volumetric Transmitted Light Column (Shaft under Panel)
        const transmittedShaftGeo = new THREE.BoxGeometry(widthM, Math.abs(floorY), lengthM);
        const transmittedShaftMat = new THREE.MeshBasicMaterial({
          color: hexColor,
          transparent: true,
          opacity: Math.min(0.25, transmittanceRatio * 0.25),
          side: THREE.DoubleSide,
        });
        const shaftMesh = new THREE.Mesh(transmittedShaftGeo, transmittedShaftMat);
        shaftMesh.position.set(0, floorY / 2, 0);
        scene.add(shaftMesh);
      }
    } else {
      // Standard Studio Key Light if Sunlight mode is toggled off
      const mainLight = new THREE.DirectionalLight(0xffffff, 2.0);
      mainLight.position.set(5, 8, 5);
      mainLight.castShadow = true;
      scene.add(mainLight);
    }

    // -------------------------------------------------------------
    // Product FRP Sheet Mesh Generation
    // -------------------------------------------------------------
    const thicknessM = config.thicknessMm / 1000;
    let sheetGeo: THREE.BufferGeometry;

    if (config.profile === 'profile_7v') {
      sheetGeo = create7vOr6vGeometry(widthM, lengthM, thicknessM, 7);
    } else if (config.profile === 'profile_6v') {
      sheetGeo = create7vOr6vGeometry(widthM, lengthM, thicknessM, 6);
    } else if (config.profile === 'corrugated_sinusoidal') {
      sheetGeo = createCorrugatedGeometry(widthM, lengthM, thicknessM, 12, 0.03);
    } else if (config.profile === 'trapezoidal_rib') {
      sheetGeo = createTrapezoidalGeometry(widthM, lengthM, thicknessM, 8, 0.035);
    } else {
      sheetGeo = new THREE.BoxGeometry(widthM, thicknessM, lengthM);
    }

    const isOpaque = config.color === 'carbon_black' || transmittanceRatio < 0.05;

    const sheetMat = new THREE.MeshPhysicalMaterial({
      color: hexColor,
      transparent: !isOpaque,
      opacity: isOpaque ? 0.98 : Math.max(0.40, 1.0 - transmittanceRatio * 0.55),
      roughness: isOpaque ? 0.35 : Math.max(0.03, 0.25 - transmittanceRatio * 0.20),
      metalness: 0.05,
      transmission: isOpaque ? 0.0 : Math.min(0.95, transmittanceRatio * 1.05),
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      wireframe: wireframe,
      side: THREE.DoubleSide,
    });

    const sheetMesh = new THREE.Mesh(sheetGeo, sheetMat);
    sheetMesh.castShadow = true;
    sheetMesh.receiveShadow = true;
    sheetMesh.position.set(0, 0, 0);
    scene.add(sheetMesh);

    // Embedded Fiberglass Strand Pattern Overlay
    const fiberTex = createFiberglassTexture(widthM, lengthM);
    const fiberOverlayMat = new THREE.MeshStandardMaterial({
      map: fiberTex,
      transparent: true,
      opacity: 0.85,
      roughness: 0.2,
      metalness: 0.1,
      side: THREE.DoubleSide,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
    });

    const fiberOverlayMesh = new THREE.Mesh(sheetGeo.clone(), fiberOverlayMat);
    fiberOverlayMesh.position.set(0, 0, 0);
    fiberOverlayMesh.scale.set(1.0008, 1.0008, 1.0008);
    fiberOverlayMesh.renderOrder = 2;
    scene.add(fiberOverlayMesh);

    // Render loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize listener
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      sheetGeo.dispose();
      sheetMat.dispose();
    };
  }, [config, wireframe, backlight, autoRotate, sunlightMode, sunTimeOfDay, materials.lightTransmittancePercent]);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  const incidentLux = 100000; // 100,000 Lux direct solar daylight
  const transmittedLux = Math.round(incidentLux * (materials.lightTransmittancePercent / 100));

  return (
    <div className={`relative w-full ${height} rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl group select-none flex flex-col`}>
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Overlays: Top Left Product Badge */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-xs shadow-lg">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        <span className="font-mono font-bold text-white text-[11px] uppercase tracking-wider">
          Final 3D Product Rendering
        </span>
        <span className="text-[10px] text-slate-400 font-mono">
          ({config.widthMm}W × {config.lengthMm}L mm)
        </span>
      </div>

      {/* Overlays: Top Right Viewport Controls */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
        <button
          onClick={() => setSunlightMode(!sunlightMode)}
          className={`px-2 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all flex items-center gap-1 ${
            sunlightMode
              ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/20'
              : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white'
          }`}
          title="Toggle Solar Light Transmission Simulation"
        >
          <Sun className={`w-3.5 h-3.5 ${sunlightMode ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Sunlight</span>
        </button>

        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-1.5 rounded-lg text-xs font-medium border transition-all ${
            autoRotate
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
              : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white'
          }`}
          title="Toggle 360 Auto-Rotation"
        >
          <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
        </button>

        <button
          onClick={() => setWireframe(!wireframe)}
          className={`p-1.5 rounded-lg text-xs font-medium border transition-all ${
            wireframe
              ? 'bg-blue-600 text-white border-blue-500 shadow-md'
              : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white'
          }`}
          title="Toggle Polygon Mesh Wireframe"
        >
          <Grid className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setBacklight(!backlight)}
          className={`p-1.5 rounded-lg text-xs font-medium border transition-all ${
            backlight
              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold'
              : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:text-white'
          }`}
          title="Toggle Underbed Backlight Illumination"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>

        {onShare && (
          <button
            onClick={onShare}
            className="px-2 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1 border border-cyan-400"
            title="Share this 3D FRP Sheet Model"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        )}
      </div>

      {/* Sunlight Transmission HUD Card Overlay (Top Right Below Controls) */}
      {sunlightMode && showSunlightControlPanel && (
        <div className="absolute top-12 right-3 z-10 w-60 sm:w-64 bg-slate-900/95 backdrop-blur-md p-2 rounded-xl border border-amber-500/40 shadow-2xl flex flex-col gap-1.5 transition-all">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1">
            <button
              onClick={() => setIsHudExpanded(!isHudExpanded)}
              className="text-[10px] font-mono font-bold uppercase text-amber-400 flex items-center gap-1 hover:text-amber-300 transition-colors"
            >
              <Sun className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Solar Meter</span>
              {isHudExpanded ? <ChevronUp className="w-3 h-3 text-slate-400" /> : <ChevronDown className="w-3 h-3 text-slate-400" />}
            </button>
            <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-500/30">
              {materials.lightTransmittancePercent}% Pass
            </span>
          </div>

          {isHudExpanded && (
            <>
              {/* Time of Day Angle Selector */}
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-mono text-slate-400 uppercase">Simulated Solar Elevation:</span>
                <div className="grid grid-cols-3 gap-1 text-[9px] font-mono">
                  <button
                    type="button"
                    onClick={() => setSunTimeOfDay('morning')}
                    className={`py-1 px-1 rounded border flex items-center justify-center gap-1 transition-all ${
                      sunTimeOfDay === 'morning'
                        ? 'bg-amber-600 text-white border-amber-400 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <Sunrise className="w-3 h-3 text-amber-300" /> Morning
                  </button>
                  <button
                    type="button"
                    onClick={() => setSunTimeOfDay('noon')}
                    className={`py-1 px-1 rounded border flex items-center justify-center gap-1 transition-all ${
                      sunTimeOfDay === 'noon'
                        ? 'bg-amber-600 text-white border-amber-400 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <Sun className="w-3 h-3 text-amber-200" /> 12 PM
                  </button>
                  <button
                    type="button"
                    onClick={() => setSunTimeOfDay('afternoon')}
                    className={`py-1 px-1 rounded border flex items-center justify-center gap-1 transition-all ${
                      sunTimeOfDay === 'afternoon'
                        ? 'bg-amber-600 text-white border-amber-400 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <Sunset className="w-3 h-3 text-amber-400" /> Afternoon
                  </button>
                </div>
              </div>

              {/* Visual Spectrum Gauge */}
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono text-slate-400">
                  <span>Incident: 100k Lux</span>
                  <span className="text-cyan-300 font-bold">Passed: {transmittedLux.toLocaleString()} Lux</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5 flex">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-amber-400 via-cyan-400 to-emerald-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                    style={{ width: `${materials.lightTransmittancePercent}%` }}
                  ></div>
                </div>
              </div>

              {/* Daylighting Utility Classification */}
              <div className="text-[9px] font-sans text-slate-300 bg-slate-950 p-1.5 rounded border border-slate-800 leading-tight">
                <strong className="text-amber-300 font-mono block">Daylighting Application:</strong>
                {materials.lightTransmittancePercent >= 85 ? (
                  <span className="text-cyan-300">High-Clarity Direct Daylighting (Greenhouses, Solar Atriums).</span>
                ) : materials.lightTransmittancePercent >= 60 ? (
                  <span className="text-emerald-300">Soft Anti-Glare Diffused Daylighting (Industrial Plants, Warehouses).</span>
                ) : materials.lightTransmittancePercent >= 20 ? (
                  <span className="text-amber-300">Shaded Solar Heat Control Panel (Commercial Canopy / Siding).</span>
                ) : (
                  <span className="text-slate-400">Opaque Blackout Composite Roofing.</span>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Bottom Info Bar */}
      <div className="absolute bottom-2 left-3 right-3 z-10 flex items-center justify-between text-[10px] text-slate-400 font-mono bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-md border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-slate-300">Profile: <strong className="text-emerald-400 font-sans">{config.profile.replace('_', ' ')}</strong></span>
          <span>•</span>
          <span className="text-slate-300">Resin: <strong className="text-cyan-400 font-sans">{config.color.replace('_', ' ')}</strong></span>
          <span>•</span>
          <span className="text-amber-300 font-bold">Solar Pass: {materials.lightTransmittancePercent}%</span>
        </div>
        <div className="text-slate-500 hidden sm:block">
          Drag to Orbit • Scroll to Zoom
        </div>
      </div>
    </div>
  );
};

// Helper: Corrugated Wave Geometry
function createCorrugatedGeometry(
  widthM: number,
  lengthM: number,
  thicknessM: number,
  waveCount: number,
  amplitudeM: number
): THREE.BufferGeometry {
  const segsX = waveCount * 8;
  const segsZ = Math.max(10, Math.floor(lengthM * 10));
  const geo = new THREE.PlaneGeometry(widthM, lengthM, segsX, segsZ);
  geo.rotateX(-Math.PI / 2);

  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const waveY = Math.sin((x / widthM) * Math.PI * 2 * waveCount) * amplitudeM;
    pos.setY(i, pos.getY(i) + waveY);
  }
  geo.computeVertexNormals();
  return geo;
}

// Helper: Trapezoidal Rib Geometry
function createTrapezoidalGeometry(
  widthM: number,
  lengthM: number,
  thicknessM: number,
  ribCount: number,
  ribHeightM: number
): THREE.BufferGeometry {
  const segsX = ribCount * 6;
  const segsZ = Math.max(10, Math.floor(lengthM * 10));
  const geo = new THREE.PlaneGeometry(widthM, lengthM, segsX, segsZ);
  geo.rotateX(-Math.PI / 2);

  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const normX = (x + widthM / 2) / widthM;
    const ribIndex = Math.floor(normX * ribCount);
    const phase = (normX * ribCount) - ribIndex;

    let ribY = 0;
    if (phase > 0.25 && phase < 0.75) {
      ribY = ribHeightM;
    } else if (phase <= 0.25) {
      ribY = (phase / 0.25) * ribHeightM;
    } else {
      ribY = ((1 - phase) / 0.25) * ribHeightM;
    }
    pos.setY(i, pos.getY(i) + ribY);
  }
  geo.computeVertexNormals();
  return geo;
}

// Helper: 7v and 6v Profile Geometry
function create7vOr6vGeometry(
  widthM: number,
  lengthM: number,
  thicknessM: number,
  ribCount: number
): THREE.BufferGeometry {
  const pitchM = 0.198;
  const ribHeightM = 0.030;
  const topWidthM = 0.025;
  const baseWidthM = 0.065;

  const segsX = Math.max(48, ribCount * 12);
  const segsZ = Math.max(10, Math.floor(lengthM * 10));
  const geo = new THREE.PlaneGeometry(widthM, lengthM, segsX, segsZ);
  geo.rotateX(-Math.PI / 2);

  const pos = geo.attributes.position;
  const slopeWidthM = (baseWidthM - topWidthM) / 2;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const normX = (x + widthM / 2) / widthM;
    const xPosM = normX * widthM;
    const posInBay = xPosM % pitchM;

    let ribY = 0;
    if (posInBay < baseWidthM) {
      if (posInBay <= slopeWidthM) {
        ribY = (posInBay / slopeWidthM) * ribHeightM;
      } else if (posInBay <= slopeWidthM + topWidthM) {
        ribY = ribHeightM;
      } else {
        ribY = ((baseWidthM - posInBay) / slopeWidthM) * ribHeightM;
      }
    } else {
      const flatPos = posInBay - baseWidthM;
      const flatSpan = pitchM - baseWidthM;
      const minorWave = Math.sin((flatPos / flatSpan) * Math.PI * 5) * 0.0015;
      ribY = Math.max(0, minorWave);
    }

    pos.setY(i, pos.getY(i) + ribY);
  }
  geo.computeVertexNormals();
  return geo;
}

// Helper: Procedural Fiberglass CSM & Woven Roving Texture Generator
function createFiberglassTexture(widthM: number, lengthM: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 512, 512);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fillRect(0, 0, 512, 512);

    // 1. Heavy Glass Fiber Bundles (Chopped Strand Mat - CSM)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.98)';
    ctx.shadowColor = 'rgba(255, 255, 255, 0.9)';
    ctx.shadowBlur = 3;

    for (let i = 0; i < 700; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const angle = Math.random() * Math.PI * 2;
      const len = 25 + Math.random() * 45;
      const width = 2.5 + Math.random() * 3.5;

      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
      ctx.stroke();
    }

    // 2. Fine Filaments & High-Density Glass Strands
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(240, 248, 255, 0.88)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 900; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const angle = Math.random() * Math.PI * 2;
      const len = 15 + Math.random() * 35;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
      ctx.stroke();
    }

    // 3. Woven Roving Reinforcement Weave (Cross-hatched Glass Strands)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 2.8;
    const gridStep = 32;
    for (let g = 0; g < 512; g += gridStep) {
      // Horizontal weave
      ctx.beginPath();
      for (let x = 0; x <= 512; x += 16) {
        const offset = Math.sin(x * 0.1 + g) * 3;
        if (x === 0) ctx.moveTo(x, g + offset);
        else ctx.lineTo(x, g + offset);
      }
      ctx.stroke();

      // Vertical weave
      ctx.beginPath();
      for (let y = 0; y <= 512; y += 16) {
        const offset = Math.cos(y * 0.1 + g) * 3;
        if (y === 0) ctx.moveTo(g + offset, y);
        else ctx.lineTo(g + offset, y);
      }
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(Math.max(2, widthM * 4), Math.max(2, lengthM * 4));
  return texture;
}
