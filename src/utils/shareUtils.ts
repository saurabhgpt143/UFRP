import { FRPConfig } from '../types';
import { calculateMaterials, getResinHexColor } from './frpCalculations';

export function serializeConfigToUrl(config: FRPConfig): string {
  const params = new URLSearchParams();
  params.set('lengthMm', config.lengthMm.toString());
  params.set('widthMm', config.widthMm.toString());
  params.set('thicknessMm', config.thicknessMm.toString());
  params.set('profile', config.profile);
  params.set('color', config.color);
  if (config.customHex) params.set('customHex', config.customHex);
  params.set('resinType', config.resinType);
  params.set('fiberType', config.fiberType);
  params.set('glassLayers', config.glassLayers.toString());
  params.set('dryingTempC', config.dryingTempC.toString());
  
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?${params.toString()}`;
}

export function parseConfigFromUrl(defaultConfig: FRPConfig): FRPConfig {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    if (!urlParams.has('lengthMm') && !urlParams.has('profile')) {
      return defaultConfig;
    }

    const newConfig: FRPConfig = { ...defaultConfig };

    if (urlParams.has('lengthMm')) newConfig.lengthMm = Number(urlParams.get('lengthMm')) || defaultConfig.lengthMm;
    if (urlParams.has('widthMm')) newConfig.widthMm = Number(urlParams.get('widthMm')) || defaultConfig.widthMm;
    if (urlParams.has('thicknessMm')) newConfig.thicknessMm = Number(urlParams.get('thicknessMm')) || defaultConfig.thicknessMm;
    if (urlParams.has('profile')) newConfig.profile = urlParams.get('profile') as any;
    if (urlParams.has('color')) newConfig.color = urlParams.get('color') as any;
    if (urlParams.has('customHex')) newConfig.customHex = urlParams.get('customHex') || undefined;
    if (urlParams.has('resinType')) newConfig.resinType = urlParams.get('resinType') as any;
    if (urlParams.has('fiberType')) newConfig.fiberType = urlParams.get('fiberType') as any;
    if (urlParams.has('glassLayers')) newConfig.glassLayers = Number(urlParams.get('glassLayers')) || defaultConfig.glassLayers;
    if (urlParams.has('dryingTempC')) newConfig.dryingTempC = Number(urlParams.get('dryingTempC')) || defaultConfig.dryingTempC;

    return newConfig;
  } catch (err) {
    console.warn('Failed to parse URL config:', err);
    return defaultConfig;
  }
}

export function generateProductSpecCardCanvas(
  config: FRPConfig,
  sourceCanvas?: HTMLCanvasElement | null
): Promise<HTMLCanvasElement> {
  return new Promise((resolve) => {
    const materials = calculateMaterials(config);
    const resinHexNum = getResinHexColor(config.color, config.customHex);
    const resinHex = '#' + resinHexNum.toString(16).padStart(6, '0');
    const glassRatioPercent = Math.round((materials.totalGlassWeightKg / Math.max(0.01, materials.totalSheetWeightKg)) * 100);

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 675;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      resolve(canvas);
      return;
    }

    // 1. Background Canvas Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 675);
    bgGrad.addColorStop(0, '#020617');
    bgGrad.addColorStop(0.5, '#0f172a');
    bgGrad.addColorStop(1, '#020617');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 675);

    // Decorative grid pattern
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.25)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 1200; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 675);
      ctx.stroke();
    }
    for (let y = 0; y < 675; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1200, y);
      ctx.stroke();
    }

    // Header Banner
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, 1200, 64);
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 20px system-ui, sans-serif';
    ctx.fillText('FRP COMPOSITE SHEET SPECIFICATION', 32, 40);

    // BIS Certified Badge
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 12px monospace';
    ctx.fillText('🇮🇳 BIS IS 12866:2020 COMPLIANT', 720, 40);

    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('3D SPEC CARD', 1060, 40);

    // Left Box: 3D Image Snapshot Frame
    const frameX = 32;
    const frameY = 90;
    const frameW = 540;
    const frameH = 520;

    ctx.fillStyle = '#020617';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(frameX, frameY, frameW, frameH, 16);
    ctx.fill();
    ctx.stroke();

    if (sourceCanvas) {
      try {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(frameX + 8, frameY + 8, frameW - 16, frameH - 16, 12);
        ctx.clip();
        ctx.drawImage(sourceCanvas, frameX + 8, frameY + 8, frameW - 16, frameH - 16);
        ctx.restore();
      } catch (e) {
        console.warn('Could not draw WebGL source canvas:', e);
      }
    }

    // Color Swatch Tag on Image Frame
    ctx.fillStyle = resinHex;
    ctx.beginPath();
    ctx.arc(frameX + 32, frameY + 32, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px system-ui, sans-serif';
    ctx.fillText(config.color.toUpperCase().replace(/_/g, ' '), frameX + 54, frameY + 37);

    // Right Box: Specifications Details
    const rightX = 600;
    const rightY = 90;

    // Profile Title
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(`PROFILE: ${config.profile.toUpperCase().replace(/_/g, ' ')}`, rightX, rightY + 24);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px system-ui, sans-serif';
    ctx.fillText(`${config.widthMm}mm × ${config.lengthMm}mm × ${config.thicknessMm}mm`, rightX, rightY + 68);

    // Solar Transmittance Bar
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillText(`Solar Light Transmittance (${materials.lightTransmittancePercent}% Pass):`, rightX, rightY + 110);

    ctx.fillStyle = '#020617';
    ctx.fillRect(rightX, rightY + 120, 560, 16);
    const barGrad = ctx.createLinearGradient(rightX, 0, rightX + 560, 0);
    barGrad.addColorStop(0, '#f59e0b');
    barGrad.addColorStop(0.5, '#06b6d4');
    barGrad.addColorStop(1, '#10b981');
    ctx.fillStyle = barGrad;
    ctx.fillRect(rightX, rightY + 120, (560 * materials.lightTransmittancePercent) / 100, 16);

    // Specs Grid Cards
    const specs = [
      { label: 'Unit Weight', val: `${materials.totalSheetWeightKg.toFixed(2)} kg` },
      { label: 'Resin Matrix', val: (config.resinType || 'orthophthalic').toUpperCase() },
      { label: 'Glass Fiber', val: `${config.fiberType.toUpperCase()} (${glassRatioPercent}%)` },
      { label: 'Density', val: `${materials.densityGcm3.toFixed(2)} g/cm³` },
      { label: 'Stiffness', val: `${materials.flexuralStiffnessGpa.toFixed(1)} GPa` },
      { label: 'Heat Limit (HDT)', val: `${materials.resinTypeSpec.hdtC}°C` },
    ];

    specs.forEach((item, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const sx = rightX + col * 285;
      const sy = rightY + 160 + row * 72;

      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(sx, sy, 270, 60, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '11px monospace';
      ctx.fillText(item.label.toUpperCase(), sx + 14, sy + 22);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 15px system-ui, sans-serif';
      ctx.fillText(item.val, sx + 14, sy + 46);
    });

    // Cost & Pricing Footer Banner
    const priceY = rightY + 395;
    ctx.fillStyle = '#020617';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(rightX, priceY, 560, 75, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px system-ui, sans-serif';
    ctx.fillText('EST. EX-FACTORY PRICE + 18% GST (HSN 3920):', rightX + 16, priceY + 24);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 24px system-ui, sans-serif';
    ctx.fillText(`₹${Math.round(materials.estimatedCostInr).toLocaleString('en-IN')} INR`, rightX + 16, priceY + 54);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(`₹${materials.pricePerSqFtInr}/sq.ft • ₹${materials.pricePerM2Inr}/m²`, rightX + 240, priceY + 54);

    // Footer Branding / URL
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('MANUFACTURER: UFRP BY M.G. INDUSTRIES • PH: 9752556113', rightX, 645);

    resolve(canvas);
  });
}

export function generateProductSummaryText(config: FRPConfig): string {
  const materials = calculateMaterials(config);
  const glassRatioPercent = Math.round((materials.totalGlassWeightKg / Math.max(0.01, materials.totalSheetWeightKg)) * 100);

  return `================================================
FRP COMPOSITE SHEET SPECIFICATION REPORT
================================================
Manufacturer    : UFRP BY M.G. INDUSTRIES
Contact Number  : +91 9752556113
Product Profile : ${config.profile.toUpperCase().replace(/_/g, ' ')}
Dimensions      : ${config.widthMm} mm (W) × ${config.lengthMm} mm (L) × ${config.thicknessMm} mm (T)
Resin Color     : ${config.color.toUpperCase().replace(/_/g, ' ')}
Solar Light Pass: ${materials.lightTransmittancePercent}% Transmittance

INDIAN STANDARDS & QUALITY COMPLIANCE:
------------------------------------------------
Manufacturer    : UFRP BY M.G. INDUSTRIES (Contact: 9752556113)
BIS Standard    : IS 12866:2020 (FRP Roofing & Structural Laminates)
Polyester Matrix: IS 6746:1994 Resin Systems
Glass Roving    : IS 11273:1992 Structural Fiber
Wind Resistance : IS 875 (Part 3) Up to 55 m/s Coastal Wind Zone
Flame Spread    : IS 15061 Class 1 Rating

MATERIAL SPECIFICATIONS:
------------------------------------------------
Resin Matrix    : ${(config.resinType || 'orthophthalic').toUpperCase()} Polymer
Reinforcement   : ${config.fiberType.toUpperCase()} (${config.glassLayers} Layers)
Glass Fiber Wt  : ${glassRatioPercent}% Glass Content
Sheet Weight    : ${materials.totalSheetWeightKg.toFixed(2)} kg per panel
Density         : ${materials.densityGcm3.toFixed(2)} g/cm³

MECHANICAL & THERMAL PERFORMANCE:
------------------------------------------------
Flexural Stiffness: ${materials.flexuralStiffnessGpa.toFixed(1)} GPa
Heat Distortion   : ${materials.resinTypeSpec.hdtC}°C (HDT)
Chemical Guard    : ${materials.resinTypeSpec.chemicalResistance}

ESTIMATED INDIAN MARKET PRICING & GST (HSN 3920):
------------------------------------------------
Ex-Factory Price : ₹${Math.round(materials.estimatedCostInr).toLocaleString('en-IN')} INR ($${materials.estimatedCostUsd.toFixed(2)} USD)
Rate per Sq. Feet: ₹${materials.pricePerSqFtInr} / sq.ft
Rate per Sq. Meter: ₹${materials.pricePerM2Inr} / m²
Rate per Kg Weight: ₹${materials.pricePerKgInr} / kg
18% GST Amount   : ₹${materials.gstAmountInr.toLocaleString('en-IN')} INR
Total Incl. GST  : ₹${materials.totalCostWithGstInr.toLocaleString('en-IN')} INR

Configured via FRP Sheet Simulator 3D.
Share Link: ${serializeConfigToUrl(config)}
================================================`;
}
