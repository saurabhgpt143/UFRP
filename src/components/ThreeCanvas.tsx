import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FRPConfig, MaterialCalculations, StepNumber, TableSpec } from '../types';
import { getResinHexColor } from '../utils/frpCalculations';

interface ThreeCanvasProps {
  config: FRPConfig;
  tableSpec: TableSpec;
  materials: MaterialCalculations;
  currentStep: StepNumber;
  curingProgress: number; // 0 to 100
  isHeating: boolean;
  wireframeMode: boolean;
  xrayMode: boolean;
  backlightMode: boolean;
  flexAmount: number; // 0 to 1 for step 6 flex test
  unrollProgress: number; // 0 to 1 for mylar unroll animation
  selectedCameraPreset: 'orbit' | 'top' | 'side' | 'front' | 'closeup';
  onObjectClick?: (objectName: string) => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  config,
  tableSpec,
  materials,
  currentStep,
  curingProgress,
  isHeating,
  wireframeMode,
  xrayMode,
  backlightMode,
  flexAmount,
  unrollProgress,
  selectedCameraPreset,
  onObjectClick,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Dynamic mesh group references
  const tableGroupRef = useRef<THREE.Group | null>(null);
  const bottomMylarRef = useRef<THREE.Mesh | null>(null);
  const mylarRollRef = useRef<THREE.Group | null>(null);
  const resinSheetRef = useRef<THREE.Mesh | null>(null);
  const fiberTextureRef = useRef<THREE.Mesh | null>(null);
  const topMylarRef = useRef<THREE.Mesh | null>(null);
  const dieGroupRef = useRef<THREE.Group | null>(null);
  const weightsGroupRef = useRef<THREE.Group | null>(null);
  const heatLampsGroupRef = useRef<THREE.Group | null>(null);
  const upperMylarPeeledRef = useRef<THREE.Mesh | null>(null);
  const hoistedSheetGroupRef = useRef<THREE.Group | null>(null);
  const backlightRef = useRef<THREE.RectAreaLight | THREE.SpotLight | null>(null);

  // Animation frame ID
  const animFrameIdRef = useRef<number | null>(null);

  // Scale converting millimeters to meters for 3D world (1m = 1 unit)
  const lengthM = config.lengthMm / 1000;
  const widthM = config.widthMm / 1000;
  const thicknessM = Math.max(0.005, config.thicknessMm / 1000); // minimum visible thickness 5mm in 3D
  const mylarWidthM = config.mylarWidthMm / 1000;

  // Initialize Three.js scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a); // dark slate canvas
    scene.fog = new THREE.FogExp2(0x0f172a, 0.04);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(2.8, 2.2, 3.5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 + 0.05; // don't go below floor
    controls.minDistance = 0.5;
    controls.maxDistance = 20;
    controlsRef.current = controls;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(5, 8, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.0001;
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.5);
    fillLight.position.set(-5, 4, -5);
    scene.add(fillLight);

    // Floor Grid & Workshop Geometry
    const floorGeo = new THREE.PlaneGeometry(30, 30);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.8,
      metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    const gridHelper = new THREE.GridHelper(30, 60, 0x3b82f6, 0x334155);
    gridHelper.position.y = 0.001;
    scene.add(gridHelper);

    // Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // Raycaster for click interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      if (!container || !cameraRef.current || !sceneRef.current) return;
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(sceneRef.current.children, true);

      if (intersects.length > 0) {
        const topObject = intersects[0].object;
        if (topObject.name && onObjectClick) {
          onObjectClick(topObject.name);
        }
      }
    };

    container.addEventListener('click', handleClick);

    // Animation Loop
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      if (controlsRef.current) controlsRef.current.update();
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
      container.removeEventListener('click', handleClick);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      renderer.dispose();
    };
  }, []);

  // Update Camera Presets
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    const cam = cameraRef.current;
    const ctrl = controlsRef.current;
    const centerZ = 0;
    const targetY = tableSpec.unitHeightMm / 1000;
    const span = Math.max(lengthM, widthM, 2.5);
    const camDist = span * 0.95 + 1.8;

    switch (selectedCameraPreset) {
      case 'top':
        cam.position.set(0, camDist * 1.25, centerZ);
        ctrl.target.set(0, targetY, centerZ);
        break;
      case 'side':
        cam.position.set(camDist * 1.1, targetY + 0.4, centerZ);
        ctrl.target.set(0, targetY, centerZ);
        break;
      case 'front':
        cam.position.set(0, targetY + 0.6, camDist * 1.1);
        ctrl.target.set(0, targetY, centerZ);
        break;
      case 'closeup':
        cam.position.set(0.6, targetY + 0.15, 0.4);
        ctrl.target.set(0, targetY + 0.02, 0);
        break;
      case 'orbit':
      default:
        cam.position.set(camDist * 0.6, targetY + camDist * 0.45, camDist * 0.7);
        ctrl.target.set(0, targetY, 0);
        break;
    }
  }, [selectedCameraPreset, lengthM, widthM, tableSpec.unitHeightMm]);

  // Build / Rebuild Scene Objects on Config / Step changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Clear previous dynamic groups
    if (tableGroupRef.current) scene.remove(tableGroupRef.current);
    if (mylarRollRef.current) scene.remove(mylarRollRef.current);
    if (bottomMylarRef.current) scene.remove(bottomMylarRef.current);
    if (resinSheetRef.current) scene.remove(resinSheetRef.current);
    if (fiberTextureRef.current) scene.remove(fiberTextureRef.current);
    if (topMylarRef.current) scene.remove(topMylarRef.current);
    if (dieGroupRef.current) scene.remove(dieGroupRef.current);
    if (weightsGroupRef.current) scene.remove(weightsGroupRef.current);
    if (heatLampsGroupRef.current) scene.remove(heatLampsGroupRef.current);
    if (upperMylarPeeledRef.current) scene.remove(upperMylarPeeledRef.current);
    if (hoistedSheetGroupRef.current) scene.remove(hoistedSheetGroupRef.current);
    if (backlightRef.current) scene.remove(backlightRef.current);

    // 1. Build Tables (1800mm wide x 900mm high x 1200mm long modular units)
    const tableGroup = new THREE.Group();
    tableGroup.name = 'Manufacturing & Die Staging Tables Assembly';

    const tableWidthM = tableSpec.unitWidthMm / 1000;   // 1.8m width
    const tableHeightM = tableSpec.unitHeightMm / 1000; // 0.9m height
    const tableLengthM = tableSpec.unitLengthMm / 1000; // 1.2m length
    const tableCount = tableSpec.tableCount;
    const totalBedLengthM = tableCount * tableLengthM;

    const startZ = -totalBedLengthM / 2 + tableLengthM / 2;
    const sideTableX = tableWidthM + 0.5; // Offset position for adjacent die table

    const tableSteelMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.8,
      roughness: 0.3,
      wireframe: wireframeMode,
    });

    const tableTopMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0, // polished stainless steel
      metalness: 0.9,
      roughness: 0.15,
      wireframe: wireframeMode,
    });

    // Helper function to build table line
    const createTableLine = (lineX: number, linePrefix: string) => {
      const lineGroup = new THREE.Group();
      lineGroup.name = linePrefix;

      for (let i = 0; i < tableCount; i++) {
        const singleTable = new THREE.Group();
        const zPos = startZ + i * tableLengthM;
        singleTable.position.set(lineX, 0, zPos);

        // Tabletop plate (0.9m x 1.8m x 0.03m thickness)
        const topGeo = new THREE.BoxGeometry(tableWidthM, 0.03, tableLengthM);
        const topMesh = new THREE.Mesh(topGeo, tableTopMat);
        topMesh.position.y = tableHeightM - 0.015;
        topMesh.castShadow = true;
        topMesh.receiveShadow = true;
        topMesh.name = `${linePrefix} Unit #${i + 1}`;
        singleTable.add(topMesh);

        // 4 Leg posts
        const legGeo = new THREE.BoxGeometry(0.06, tableHeightM - 0.03, 0.06);
        const legOffsets = [
          [-tableWidthM / 2 + 0.05, -tableLengthM / 2 + 0.08],
          [tableWidthM / 2 - 0.05, -tableLengthM / 2 + 0.08],
          [-tableWidthM / 2 + 0.05, tableLengthM / 2 - 0.08],
          [tableWidthM / 2 - 0.05, tableLengthM / 2 - 0.08],
        ];

        legOffsets.forEach(([lx, lz]) => {
          const legMesh = new THREE.Mesh(legGeo, tableSteelMat);
          legMesh.position.set(lx, (tableHeightM - 0.03) / 2, lz);
          legMesh.castShadow = true;
          singleTable.add(legMesh);

          // Foot leveler pad
          const padGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.03, 16);
          const padMesh = new THREE.Mesh(padGeo, tableSteelMat);
          padMesh.position.set(lx, 0.015, lz);
          singleTable.add(padMesh);
        });

        // Lower cross brace frame
        const braceGeo = new THREE.BoxGeometry(tableWidthM - 0.1, 0.04, tableLengthM - 0.16);
        const braceMesh = new THREE.Mesh(braceGeo, tableSteelMat);
        braceMesh.position.set(0, 0.35, 0);
        singleTable.add(braceMesh);

        // Inter-table modular locking clamp (if not last table)
        if (i < tableCount - 1) {
          const clampGeo = new THREE.BoxGeometry(tableWidthM + 0.04, 0.05, 0.08);
          const clampMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.7, roughness: 0.3 });
          const clampMesh = new THREE.Mesh(clampGeo, clampMat);
          clampMesh.position.set(0, tableHeightM - 0.02, tableLengthM / 2);
          singleTable.add(clampMesh);
        }

        lineGroup.add(singleTable);
      }
      return lineGroup;
    };

    // 1A. Main Manufacturing Table Line at X=0
    tableGroup.add(createTableLine(0, 'Main Manufacturing Table'));

    // 1B. Adjacent Table Line arranged aside for Die at X=sideTableX
    tableGroup.add(createTableLine(sideTableX, 'Adjacent Die Staging Table'));

    // 1C. Staging Die tooling on top of the adjacent die table
    const sideDieY = tableHeightM + 0.01;
    let sideDieGeo: THREE.BufferGeometry;
    if (config.profile === 'profile_7v') {
      sideDieGeo = create7vOr6vGeometry(widthM * 1.0, lengthM, 0.04, 7);
    } else if (config.profile === 'profile_6v') {
      sideDieGeo = create7vOr6vGeometry(widthM * 1.0, lengthM, 0.04, 6);
    } else if (config.profile === 'corrugated_sinusoidal') {
      sideDieGeo = createCorrugatedGeometry(widthM * 1.0, lengthM, 0.04, 12, 0.03);
    } else if (config.profile === 'trapezoidal_rib') {
      sideDieGeo = createTrapezoidalGeometry(widthM * 1.0, lengthM, 0.04, 8, 0.035);
    } else {
      sideDieGeo = new THREE.BoxGeometry(widthM * 1.0, 0.04, lengthM);
    }

    const sideDieMat = new THREE.MeshStandardMaterial({
      color: 0x64748b, // steel grey profile die staging
      metalness: 0.85,
      roughness: 0.25,
      wireframe: wireframeMode,
    });
    const sideDieMesh = new THREE.Mesh(sideDieGeo, sideDieMat);
    sideDieMesh.position.set(sideTableX, sideDieY + 0.02, 0);
    sideDieMesh.castShadow = true;
    tableGroup.add(sideDieMesh);

    // Staging weights on the adjacent die table
    const sideWeightMat = new THREE.MeshStandardMaterial({
      color: 0xca8a04,
      metalness: 0.6,
      roughness: 0.4,
      wireframe: wireframeMode,
    });
    const sideWeightCount = Math.max(3, Math.floor(lengthM / 0.6) + 1);
    const sideWeightSpacingZ = lengthM / (sideWeightCount + 1);
    for (let w = 1; w <= sideWeightCount; w++) {
      const wz = -lengthM / 2 + w * sideWeightSpacingZ;
      [-widthM * 0.3, widthM * 0.3].forEach((wx) => {
        const wBlockGeo = new THREE.BoxGeometry(0.2, 0.12, 0.3);
        const wMesh = new THREE.Mesh(wBlockGeo, sideWeightMat);
        wMesh.position.set(sideTableX + wx, sideDieY + 0.08, wz);
        wMesh.castShadow = true;
        tableGroup.add(wMesh);
      });
    }

    scene.add(tableGroup);
    tableGroupRef.current = tableGroup;

    // Table Surface Height Level
    const tableTopY = tableHeightM;

    // 2. Mylar Film Roll at head of table (Step 1)
    const mylarRollGroup = new THREE.Group();
    mylarRollGroup.position.set(0, tableTopY + 0.12, -totalBedLengthM / 2 - 0.2);

    const rollCoreGeo = new THREE.CylinderGeometry(0.06, 0.06, mylarWidthM, 32);
    rollCoreGeo.rotateZ(Math.PI / 2);
    const rollMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.85,
      roughness: 0.2,
      metalness: 0.1,
    });
    const rollMesh = new THREE.Mesh(rollCoreGeo, rollMat);
    mylarRollGroup.add(rollMesh);

    // Roll support stand arms
    const armGeo = new THREE.BoxGeometry(0.04, 0.3, 0.04);
    const armMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
    const armL = new THREE.Mesh(armGeo, armMat);
    armL.position.set(-mylarWidthM / 2 - 0.04, -0.05, 0);
    const armR = new THREE.Mesh(armGeo, armMat);
    armR.position.set(mylarWidthM / 2 + 0.04, -0.05, 0);
    mylarRollGroup.add(armL, armR);

    scene.add(mylarRollGroup);
    mylarRollRef.current = mylarRollGroup;

    // 3. Lower Mylar Film Sheet (Step 1+)
    if (currentStep >= 1) {
      const actualUnrollLen = currentStep <= 2 ? totalBedLengthM * unrollProgress : totalBedLengthM;
      if (actualUnrollLen > 0.001) {
        const mylarGeo = new THREE.PlaneGeometry(mylarWidthM, actualUnrollLen);
        mylarGeo.rotateX(-Math.PI / 2);

        const mylarMat = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: xrayMode ? 0.3 : 0.6,
          roughness: 0.1,
          transmission: 0.7,
          ior: 1.5,
          reflectivity: 0.9,
          wireframe: wireframeMode,
          side: THREE.DoubleSide,
        });

        const mylarSheet = new THREE.Mesh(mylarGeo, mylarMat);
        // Center based on unroll length
        const mylarZ = -totalBedLengthM / 2 + actualUnrollLen / 2;
        mylarSheet.position.set(0, tableTopY + 0.002, mylarZ);
        mylarSheet.receiveShadow = true;
        mylarSheet.name = 'Lower Mylar Release Film';
        scene.add(mylarSheet);
        bottomMylarRef.current = mylarSheet;
      }
    }

    // 4. Resin Matrix & Fiberglass Layer (Step 3+)
    if (currentStep >= 3 && currentStep < 5) {
      const hexColor = getResinHexColor(config.color, config.customHex);
      const transmittanceRatio = materials.lightTransmittancePercent / 100;

      // Curing visual shift: liquid is more transparent & saturated, cured is harder & glassier
      const baseOpacity = Math.max(0.40, 1.0 - transmittanceRatio * 0.55);
      const opacityVal = xrayMode ? 0.4 : baseOpacity - (curingProgress / 100) * 0.15;
      const roughnessVal = Math.max(0.02, Math.max(0.05, 0.25 - transmittanceRatio * 0.20) - (curingProgress / 100) * 0.20);
      const transmissionVal = config.color === 'carbon_black' || transmittanceRatio < 0.05 ? 0 : Math.min(0.95, transmittanceRatio * 1.05);

      let sheetGeo: THREE.BufferGeometry;

      // Profile Geometry creation:
      // At Step 3 (Resin & FiberMat Layup), resin is poured flat on the bottom Mylar film.
      // Profile geometry (7V, 6V, Corrugated, Trapezoidal) is ONLY formed starting at Step 4 when upper die shaping compresses it.
      // Flat unformed resin matrix width on Mylar paper (leaves a ~20mm margin on each side of the Mylar paper)
      const flatResinWidthM = mylarWidthM * 0.96;

      if (currentStep >= 4 && config.profile === 'profile_7v') {
        sheetGeo = create7vOr6vGeometry(widthM, lengthM, thicknessM, 7);
      } else if (currentStep >= 4 && config.profile === 'profile_6v') {
        sheetGeo = create7vOr6vGeometry(widthM, lengthM, thicknessM, 6);
      } else if (currentStep >= 4 && config.profile === 'corrugated_sinusoidal') {
        sheetGeo = createCorrugatedGeometry(widthM, lengthM, thicknessM, 12, 0.03);
      } else if (currentStep >= 4 && config.profile === 'trapezoidal_rib') {
        sheetGeo = createTrapezoidalGeometry(widthM, lengthM, thicknessM, 8, 0.035);
      } else {
        // Flat sheet for Step 3 liquid resin matrix & FiberMat layup on Mylar release paper
        sheetGeo = new THREE.BoxGeometry(flatResinWidthM, thicknessM, lengthM);
      }

      const resinMat = new THREE.MeshPhysicalMaterial({
        color: hexColor,
        transparent: true,
        opacity: opacityVal,
        roughness: roughnessVal,
        transmission: transmissionVal,
        clearcoat: 0.9,
        wireframe: wireframeMode,
      });

      const resinSheet = new THREE.Mesh(sheetGeo, resinMat);
      resinSheet.position.set(0, tableTopY + 0.005 + thicknessM / 2, 0);
      resinSheet.castShadow = true;
      resinSheet.receiveShadow = true;
      resinSheet.name = 'FRP Resin & Fiber Layer';
      scene.add(resinSheet);
      resinSheetRef.current = resinSheet;

      // Embedded Fiberglass Strand Pattern matching resin layup width
      const fiberWidthM = currentStep >= 4 && config.profile !== 'flat' ? widthM * 0.98 : flatResinWidthM * 0.98;
      const fiberGeo = new THREE.PlaneGeometry(fiberWidthM, lengthM * 0.98, 20, 40);
      fiberGeo.rotateX(-Math.PI / 2);

      const fiberTex = createFiberglassTexture(fiberWidthM, lengthM);

      const fiberMat = new THREE.MeshStandardMaterial({
        map: fiberTex,
        transparent: true,
        opacity: xrayMode ? 0.98 : 0.88,
        roughness: 0.3,
        metalness: 0.1,
        side: THREE.DoubleSide,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
      });

      const fiberMesh = new THREE.Mesh(fiberGeo, fiberMat);
      // Position right at top of liquid resin matrix so glass fiber strands are 100% discernible
      fiberMesh.position.set(0, tableTopY + 0.005 + thicknessM + 0.001, 0);
      fiberMesh.renderOrder = 2;
      scene.add(fiberMesh);
      fiberTextureRef.current = fiberMesh;
    }

    // 5. Top Mylar Film & Die & Compression Weights (Step 4)
    if (currentStep >= 4 && currentStep < 5) {
      // Top Mylar Film
      const topMylarGeo = new THREE.PlaneGeometry(mylarWidthM, lengthM);
      topMylarGeo.rotateX(-Math.PI / 2);
      const topMylarMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: xrayMode ? 0.3 : 0.65,
        roughness: 0.1,
        transmission: 0.7,
        reflectivity: 0.9,
        wireframe: wireframeMode,
        side: THREE.DoubleSide,
      });
      const topMylarSheet = new THREE.Mesh(topMylarGeo, topMylarMat);
      topMylarSheet.position.set(0, tableTopY + 0.007 + thicknessM, 0);
      topMylarSheet.name = 'Top Mylar Film';
      scene.add(topMylarSheet);
      topMylarRef.current = topMylarSheet;

      // Profile Shaping Die Group
      const dieGroup = new THREE.Group();
      dieGroup.name = 'Profile Shaping Die';

      const dieY = tableTopY + 0.01 + thicknessM;
      let dieGeo: THREE.BufferGeometry;

      if (config.profile === 'profile_7v') {
        dieGeo = create7vOr6vGeometry(widthM * 1.05, lengthM, 0.04, 7);
      } else if (config.profile === 'profile_6v') {
        dieGeo = create7vOr6vGeometry(widthM * 1.05, lengthM, 0.04, 6);
      } else if (config.profile === 'corrugated_sinusoidal') {
        dieGeo = createCorrugatedGeometry(widthM * 1.05, lengthM, 0.04, 12, 0.03);
      } else if (config.profile === 'trapezoidal_rib') {
        dieGeo = createTrapezoidalGeometry(widthM * 1.05, lengthM, 0.04, 8, 0.035);
      } else {
        dieGeo = new THREE.BoxGeometry(widthM * 1.05, 0.04, lengthM);
      }

      const dieMat = new THREE.MeshStandardMaterial({
        color: 0x475569, // steel grey profile die
        metalness: 0.85,
        roughness: 0.25,
        wireframe: wireframeMode,
      });

      const dieMesh = new THREE.Mesh(dieGeo, dieMat);
      dieMesh.position.set(0, dieY + 0.02, 0);
      dieMesh.castShadow = true;
      dieGroup.add(dieMesh);

      scene.add(dieGroup);
      dieGroupRef.current = dieGroup;

      // Compression Weights placed along length (spaced every 0.6m)
      const weightsGroup = new THREE.Group();
      weightsGroup.name = 'Compression Cast Iron Weights';

      const weightCount = Math.max(3, Math.floor(lengthM / 0.6) + 1);
      const weightSpacingZ = lengthM / (weightCount + 1);
      const weightMat = new THREE.MeshStandardMaterial({
        color: 0xca8a04, // industrial safety yellow
        metalness: 0.6,
        roughness: 0.4,
        wireframe: wireframeMode,
      });

      for (let w = 1; w <= weightCount; w++) {
        const wz = -lengthM / 2 + w * weightSpacingZ;

        // Pair of weights (left & right)
        [-widthM * 0.3, widthM * 0.3].forEach((wx) => {
          const wBlockGeo = new THREE.BoxGeometry(0.2, 0.12, 0.3);
          const wMesh = new THREE.Mesh(wBlockGeo, weightMat);
          wMesh.position.set(wx, dieY + 0.08, wz);
          wMesh.castShadow = true;

          // Weight handle
          const handleGeo = new THREE.TorusGeometry(0.05, 0.012, 8, 16, Math.PI);
          const handleMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9 });
          const handleMesh = new THREE.Mesh(handleGeo, handleMat);
          handleMesh.rotation.x = -Math.PI / 2;
          handleMesh.position.set(wx, dieY + 0.14, wz);

          weightsGroup.add(wMesh, handleMesh);
        });
      }

      scene.add(weightsGroup);
      weightsGroupRef.current = weightsGroup;
    }

    // 6. Curing & Drying Heat Lamps Bar (Step 4)
    if (currentStep === 4) {
      const lampsGroup = new THREE.Group();
      lampsGroup.name = 'Infrared Curing Heat Lamps';

      const barLength = lengthM * 1.05;
      const barGeo = new THREE.BoxGeometry(0.08, 0.08, barLength);
      const barMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9 });
      const barMesh = new THREE.Mesh(barGeo, barMat);
      barMesh.position.set(0, tableTopY + 0.9, 0);
      lampsGroup.add(barMesh);

      // Support pillars
      const pillarGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.9, 16);
      const pillarL = new THREE.Mesh(pillarGeo, barMat);
      pillarL.position.set(0, tableTopY + 0.45, -lengthM / 2);
      const pillarR = new THREE.Mesh(pillarGeo, barMat);
      pillarR.position.set(0, tableTopY + 0.45, lengthM / 2);
      lampsGroup.add(pillarL, pillarR);

      // Glowing IR bulbs
      const bulbCount = Math.max(3, Math.floor(lengthM / 0.8));
      const bulbMat = new THREE.MeshBasicMaterial({
        color: isHeating ? 0xff4500 : 0x64748b, // bright orange glow when heating
      });

      for (let b = 0; b < bulbCount; b++) {
        const bz = -lengthM / 2 + (b + 0.5) * (lengthM / bulbCount);
        const bulbGeo = new THREE.SphereGeometry(0.06, 16, 16);
        const bulbMesh = new THREE.Mesh(bulbGeo, bulbMat);
        bulbMesh.position.set(0, tableTopY + 0.84, bz);
        lampsGroup.add(bulbMesh);

        if (isHeating) {
          const lampLight = new THREE.PointLight(0xff6b00, 1.2, 2.5);
          lampLight.position.set(0, tableTopY + 0.8, bz);
          lampsGroup.add(lampLight);
        }
      }

      scene.add(lampsGroup);
      heatLampsGroupRef.current = lampsGroup;
    }

    // 7. Demolded & Hoisted Finished FRP Sheet (Step 5 & Step 6)
    if (currentStep >= 5) {
      const hoistedGroup = new THREE.Group();
      hoistedGroup.name = 'Completed FRP Sheet';

      // Elevation height depending on step
      const elevateY = currentStep === 6 ? tableTopY + 0.65 : tableTopY + 0.25;
      hoistedGroup.position.set(0, elevateY, 0);

      const hexColor = getResinHexColor(config.color);

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

      // Apply flex bending if flexAmount > 0 (Step 6 flex test)
      if (flexAmount > 0 && currentStep === 6) {
        applyFlexBending(sheetGeo, flexAmount * 0.12, lengthM);
      }

      const curedMat = new THREE.MeshPhysicalMaterial({
        color: hexColor,
        transparent: config.color !== 'carbon_black',
        opacity: config.color === 'crystal_transparent' ? (xrayMode ? 0.35 : 0.6) : (xrayMode ? 0.5 : 0.88),
        roughness: config.color === 'crystal_transparent' ? 0.05 : 0.12,
        metalness: 0.02,
        transmission: config.color === 'crystal_transparent' ? 0.95 : config.color === 'carbon_black' ? 0 : config.color === 'opal_white' ? 0.4 : 0.75,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        wireframe: wireframeMode,
      });

      const finalSheetMesh = new THREE.Mesh(sheetGeo, curedMat);
      finalSheetMesh.castShadow = true;
      finalSheetMesh.receiveShadow = true;
      hoistedGroup.add(finalSheetMesh);

      // Embedded Fiberglass Strand Layer in Cured/Demolded FRP Sheet
      const fiberTex = createFiberglassTexture(widthM, lengthM);
      const fiberOverlayMat = new THREE.MeshStandardMaterial({
        map: fiberTex,
        transparent: true,
        opacity: xrayMode ? 0.98 : 0.85,
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
      hoistedGroup.add(fiberOverlayMesh);

      // Vacuum Suction Cup Lifters & Crane Arms (Step 6)
      if (currentStep === 6) {
        const lifterBarGeo = new THREE.BoxGeometry(widthM * 0.8, 0.04, lengthM * 0.8);
        const lifterMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.7 });
        const lifterMesh = new THREE.Mesh(lifterBarGeo, lifterMat);
        lifterMesh.position.set(0, thicknessM / 2 + 0.1, 0);
        hoistedGroup.add(lifterMesh);

        // Suction cups
        const cupGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.05, 16);
        const cupMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });
        [-widthM * 0.3, widthM * 0.3].forEach((cx) => {
          [-lengthM * 0.3, 0, lengthM * 0.3].forEach((cz) => {
            const cup = new THREE.Mesh(cupGeo, cupMat);
            cup.position.set(cx, thicknessM / 2 + 0.025, cz);
            hoistedGroup.add(cup);
          });
        });

        // Side Edge & Longitudinal End Trim Margin Laser Cut Lines
        const trimLinesGroup = new THREE.Group();
        trimLinesGroup.name = 'Edge & Length End Trim Guides';

        // Longitudinal End Trim Cut Lines at both ends
        [-lengthM / 2, lengthM / 2].forEach((endZ) => {
          const endLineGeo = new THREE.BoxGeometry(widthM * 1.04, 0.006, 0.01);
          const endLineMat = new THREE.MeshBasicMaterial({ color: 0x10b981 }); // emerald end trim line
          const endLineMesh = new THREE.Mesh(endLineGeo, endLineMat);
          endLineMesh.position.set(0, thicknessM / 2 + 0.005, endZ);
          trimLinesGroup.add(endLineMesh);
        });

        // Side Edge Trim Cut Lines at both sides
        [-widthM / 2, widthM / 2].forEach((sideX) => {
          const sideLineGeo = new THREE.BoxGeometry(0.01, 0.006, lengthM * 1.02);
          const sideLineMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b }); // amber side trim line
          const sideLineMesh = new THREE.Mesh(sideLineGeo, sideLineMat);
          sideLineMesh.position.set(sideX, thicknessM / 2 + 0.005, 0);
          trimLinesGroup.add(sideLineMesh);
        });

        hoistedGroup.add(trimLinesGroup);
      }

      scene.add(hoistedGroup);
      hoistedSheetGroupRef.current = hoistedGroup;

      // Peeled upper Mylar film curl effect (Step 5)
      if (currentStep === 5) {
        const peelGeo = new THREE.PlaneGeometry(mylarWidthM, lengthM * 0.5);
        peelGeo.rotateX(-Math.PI / 2.5);
        const peelMat = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.5,
          transmission: 0.8,
          side: THREE.DoubleSide,
        });
        const peelMesh = new THREE.Mesh(peelGeo, peelMat);
        peelMesh.position.set(0, tableTopY + 0.45, lengthM / 4);
        scene.add(peelMesh);
        upperMylarPeeledRef.current = peelMesh;
      }
    }

    // Backlight Inspector Light (Underneath table illuminating sheet in Step 6)
    if (backlightMode && currentStep === 6) {
      const spotLight = new THREE.SpotLight(0xffffff, 10);
      spotLight.position.set(0, tableTopY - 0.2, 0);
      spotLight.angle = Math.PI / 3;
      spotLight.penumbra = 0.5;
      scene.add(spotLight);
      backlightRef.current = spotLight;
    }
  }, [
    config,
    tableSpec,
    currentStep,
    curingProgress,
    isHeating,
    wireframeMode,
    xrayMode,
    backlightMode,
    flexAmount,
    unrollProgress,
  ]);

  return (
    <div className="relative w-full h-full min-h-[300px] sm:min-h-[450px] overflow-hidden rounded-xl bg-slate-900 border border-slate-800 shadow-2xl touch-none">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing touch-none" />

      {/* 3D Scene Controls & Overlays */}
      <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
        <div className="bg-slate-950/80 backdrop-blur-md p-2 rounded-lg border border-slate-800 text-xs text-slate-300 shadow-lg flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono font-medium text-slate-200">3D WebGL Canvas</span>
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
    // Sine wave along width X
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
    const normX = (x + widthM / 2) / widthM; // 0 to 1
    const ribIndex = Math.floor(normX * ribCount);
    const phase = (normX * ribCount) - ribIndex; // 0 to 1 inside rib segment

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

// Helper: Flex bending deformation
function applyFlexBending(geo: THREE.BufferGeometry, flexOffsetM: number, lengthM: number) {
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const z = pos.getZ(i); // along length
    // Parabolic flex arc (0 at ends, max flex in center)
    const normZ = (z + lengthM / 2) / lengthM; // 0 to 1
    const flexY = -Math.sin(normZ * Math.PI) * flexOffsetM;
    pos.setY(i, pos.getY(i) + flexY);
  }
  geo.computeVertexNormals();
}

// Helper: 7v and 6v Profile Geometry with 198mm Pitch & 30mm Ribs
function create7vOr6vGeometry(
  widthM: number,
  lengthM: number,
  thicknessM: number,
  ribCount: number
): THREE.BufferGeometry {
  const pitchM = 0.198; // 198mm
  const ribHeightM = 0.030; // 30mm
  const topWidthM = 0.025; // 25mm
  const baseWidthM = 0.065; // 65mm

  const segsX = Math.max(48, ribCount * 12);
  const segsZ = Math.max(10, Math.floor(lengthM * 10));
  const geo = new THREE.PlaneGeometry(widthM, lengthM, segsX, segsZ);
  geo.rotateX(-Math.PI / 2);

  const pos = geo.attributes.position;
  const slopeWidthM = (baseWidthM - topWidthM) / 2;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const normX = (x + widthM / 2) / widthM; // 0 to 1
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
