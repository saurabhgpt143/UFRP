import { FRPConfig, MaterialCalculations, TableSpec, ResinType, GlassFiberType } from '../types';

export const GLASS_FIBER_SPECS: Record<GlassFiberType, {
  typeKey: GlassFiberType;
  name: string;
  gsmPerLayer: number;
  recommendedResinRatio: number;
  recommendedResinRatioPercent: number;
  resinToGlassRatioText: string;
  description: string;
  typicalApplications: string;
  weaveStructure: string;
}> = {
  csm_300: {
    typeKey: 'csm_300',
    name: 'Chopped Strand Mat (CSM 300 gsm)',
    gsmPerLayer: 300,
    recommendedResinRatio: 0.70,
    recommendedResinRatioPercent: 70,
    resinToGlassRatioText: '70:30 Resin:Glass (2.33:1 Weight Ratio)',
    description: 'Lightweight random emulsion-bonded chopped strands. Requires higher liquid resin volume to thoroughly wet out binder emulsion.',
    typicalApplications: 'Translucent Skylights, Architectural Decorative Sheets, Light Duty Corrugated Covers',
    weaveStructure: 'Randomly Oriented Short Chopped Strands with Emulsion Binder',
  },
  csm_450: {
    typeKey: 'csm_450',
    name: 'Chopped Strand Mat (CSM 450 gsm)',
    gsmPerLayer: 450,
    recommendedResinRatio: 0.67,
    recommendedResinRatioPercent: 67,
    resinToGlassRatioText: '67:33 Resin:Glass (2.03:1 Weight Ratio)',
    description: 'Industry standard medium-weight chopped strand mat. Optimal resin retention for uniform translucency and multi-directional strength.',
    typicalApplications: 'Industrial Roofing Sheets, Factory Daylighting Panels, Chemical Plant Cladding',
    weaveStructure: 'Isotropic Random Chopped Strands (50mm cut fibers)',
  },
  csm_600: {
    typeKey: 'csm_600',
    name: 'Chopped Strand Mat (CSM 600 gsm)',
    gsmPerLayer: 600,
    recommendedResinRatio: 0.65,
    recommendedResinRatioPercent: 65,
    resinToGlassRatioText: '65:35 Resin:Glass (1.86:1 Weight Ratio)',
    description: 'Heavy gauge chopped strand mat. Provides rapid laminate thickness build-up with high structural impact absorption.',
    typicalApplications: 'Heavy-Duty Industrial Roofing, High-Wind Coastal Canopies, Corrosion Barriers',
    weaveStructure: 'Dense Random Chopped Mat',
  },
  woven_roving_600: {
    typeKey: 'woven_roving_600',
    name: 'Woven Roving Fabric (600 gsm)',
    gsmPerLayer: 600,
    recommendedResinRatio: 0.52,
    recommendedResinRatioPercent: 52,
    resinToGlassRatioText: '52:48 Resin:Glass (1.08:1 Weight Ratio)',
    description: 'Bi-directional continuous woven glass roving (0°/90°). Continuous filaments pack tightly, needing significantly lower resin content.',
    typicalApplications: 'High Flexural Structural Panels, Structural Cooling Tower Casing, Heavy Load Bridges',
    weaveStructure: 'Plain Weave Continuous Filament Rovings (0°/90° Warp & Weft)',
  },
  multiaxial_800: {
    typeKey: 'multiaxial_800',
    name: 'Multiaxial Biaxial Stitch Mat (800 gsm)',
    gsmPerLayer: 800,
    recommendedResinRatio: 0.48,
    recommendedResinRatioPercent: 48,
    resinToGlassRatioText: '48:52 Resin:Glass (0.92:1 Weight Ratio)',
    description: 'Non-crimp stitched multiaxial reinforcement (+45°/-45° or 0°/90°). Maximum structural glass packing density with lowest resin wet-out volume.',
    typicalApplications: 'Heavy Industrial Structural FRP, Extreme Load Panels, Seismic Resistant Enclosures',
    weaveStructure: 'Stitched Non-Crimp Multiaxial Continuous Strands',
  },
};

export const RESIN_SPECS: Record<ResinType, {
  typeKey: ResinType;
  name: string;
  baseTransmittance: number;
  costPerKgUsd: number;
  costPerKgInr: number;
  hdtC: number;
  uvGrade: string;
  applicationDomain: string;
  chemicalResistance: string;
  stiffnessMultiplier: number;
}> = {
  orthophthalic: {
    typeKey: 'orthophthalic',
    name: 'General Purpose Orthophthalic Polyester',
    baseTransmittance: 85,
    costPerKgUsd: 3.20,
    costPerKgInr: 267,
    hdtC: 72,
    uvGrade: 'Standard UV Stabilized',
    applicationDomain: 'Architectural Roofing, Residential Skylights, Non-Corrosive Industrial Sheds',
    chemicalResistance: 'Moderate Water & Mild Acid Resistance',
    stiffnessMultiplier: 1.0,
  },
  isophthalic: {
    typeKey: 'isophthalic',
    name: 'Isophthalic High-Performance Industrial Resin',
    baseTransmittance: 89,
    costPerKgUsd: 4.20,
    costPerKgInr: 351,
    hdtC: 85,
    uvGrade: 'Enhanced UV Weatherable Grade',
    applicationDomain: 'Chemical Process Plants, Coastal Roofing, Cooling Towers, Marine Structures',
    chemicalResistance: 'Superior Acid, Alkali & Salt Spray Barrier',
    stiffnessMultiplier: 1.12,
  },
  dicyclopentadiene: {
    typeKey: 'dicyclopentadiene',
    name: 'DCPD Low-Styrene Eco Polyester',
    baseTransmittance: 83,
    costPerKgUsd: 2.95,
    costPerKgInr: 246,
    hdtC: 75,
    uvGrade: 'Class-B Outdoor Weathering',
    applicationDomain: 'Eco-Conscious Building, High-Surface-Finish Wall Cladding, Low-Emission Indoor Facilities',
    chemicalResistance: 'Standard Moisture & Dilute Chemical Resistance',
    stiffnessMultiplier: 0.98,
  },
  vinyl_ester: {
    typeKey: 'vinyl_ester',
    name: 'Epoxy Vinyl Ester Heavy Corrosion Grade',
    baseTransmittance: 78,
    costPerKgUsd: 6.80,
    costPerKgInr: 568,
    hdtC: 105,
    uvGrade: 'Heavy Industrial Shielded',
    applicationDomain: 'Fertilizer Plants, Battery Storage Rooms, Extreme Thermal & Corrosive Roofs',
    chemicalResistance: 'Maximum Resistance to Concentrated Acids, Alkalis & Solvents',
    stiffnessMultiplier: 1.28,
  },
  acrylic_modified: {
    typeKey: 'acrylic_modified',
    name: 'Acrylic-Modified Crystal High-Clarity Resin',
    baseTransmittance: 95,
    costPerKgUsd: 5.40,
    costPerKgInr: 451,
    hdtC: 80,
    uvGrade: '25-Year Non-Yellowing Crystal UV Warranty',
    applicationDomain: 'Premium Greenhouse Daylighting, Atrium Skylights, Architectural Domes & Solariums',
    chemicalResistance: 'High Weathering & Non-Yellowing Solar Resistance',
    stiffnessMultiplier: 1.05,
  },
};

export function calculateTables(config: FRPConfig): TableSpec {
  const unitWidthMm = 1800;  // Designated width: 1800mm
  const unitHeightMm = 900;   // Designated height: 900mm
  const unitLengthMm = 1200;  // Modular unit length: 1200mm

  // Each table unit is 1200mm in length
  const tableCount = Math.max(1, Math.ceil(config.lengthMm / unitLengthMm));
  const totalBedLengthMm = tableCount * unitLengthMm;
  const totalBedAreaM2 = (totalBedLengthMm / 1000) * (unitWidthMm / 1000);

  return {
    unitWidthMm,
    unitHeightMm,
    unitLengthMm,
    tableCount,
    totalBedLengthMm,
    totalBedAreaM2,
    levelnessMmPerM: 0.2, // Precision leveled steel frame
  };
}

export function calculateMaterials(config: FRPConfig): MaterialCalculations {
  const lengthM = config.lengthMm / 1000;
  const lengthMarginMm = config.lengthMarginMm ?? 50;
  const rawLengthMm = config.lengthMm + (lengthMarginMm * 2);
  const rawLengthM = rawLengthMm / 1000;
  const ultimateWidthMm = config.widthMm;
  const edgeMarginMm = config.edgeMarginMm ?? 50;

  // Profile stretch factor (ratio of unformed flat developed width to formed width)
  let profileStretchFactor = 1.0;
  if (config.profile === 'profile_7v') profileStretchFactor = 1440 / 1300; // ~1.1077 (1440mm flat per 1300mm finished width)
  else if (config.profile === 'profile_6v') profileStretchFactor = 1220 / 1070; // ~1.1402 (1220mm flat per 1070mm finished width)
  else if (config.profile === 'trapezoidal_rib') profileStretchFactor = 1.250;
  else if (config.profile === 'corrugated_sinusoidal') profileStretchFactor = 1.180;
  else if (config.profile === 'curved') profileStretchFactor = 1.120;
  else if (config.profile === 'flat') profileStretchFactor = 1.000;

  // Flat Width determined from ultimate sheet width, profile geometry, and edge margin
  const flatWidthMm = Math.round(ultimateWidthMm * profileStretchFactor + edgeMarginMm);
  const requiredMylarWidthMm = flatWidthMm;
  const requiredMylarLengthMm = rawLengthMm;

  const widthM = ultimateWidthMm / 1000;
  const flatWidthM = flatWidthMm / 1000;

  // Finished Sheet surface area in m²
  const sheetAreaM2 = lengthM * widthM;

  // Effective developed raw pre-trim area in m² based on flat raw sheet width and raw pre-trim length
  const effectiveAreaM2 = rawLengthM * flatWidthM;
  const sheetVolumeCm3 = effectiveAreaM2 * (config.thicknessMm / 10) * 10000; // in cm³

  // Fiberglass GSM
  const activeGlassSpec = GLASS_FIBER_SPECS[config.fiberType] || GLASS_FIBER_SPECS['csm_450'];
  const gsmPerLayer = activeGlassSpec.gsmPerLayer;

  const totalGlassGsm = gsmPerLayer * config.glassLayers;
  const totalGlassWeightKg = (totalGlassGsm * effectiveAreaM2) / 1000;

  // Resin calculation based on glass weight & resin ratio
  // Resin fraction = config.resinToGlassRatio, Glass fraction = (1 - config.resinToGlassRatio)
  const glassRatio = 1 - config.resinToGlassRatio;
  const totalResinWeightKg = (totalGlassWeightKg / glassRatio) * config.resinToGlassRatio;
  // Mineral Filler Calculation (CaCO3, ATH, Silica Powder)
  const fillerType = config.fillerType ?? 'none';
  const fillerPercent = config.fillerPercent ?? 0;
  
  let fillerCostUsdKg = 0.22; // $0.22/kg (~₹18/kg) for Calcium Carbonate
  let fillerDensityGcm3 = 2.71;
  let fillerEffectNote = "Unfilled pure resin matrix. Ideal for maximum optical clarity and translucent roofing.";

  if (fillerType === 'calcium_carbonate') {
    fillerCostUsdKg = 0.22; // $0.22/kg (~₹18/kg)
    fillerDensityGcm3 = 2.71;
    fillerEffectNote = `Calcium Carbonate (CaCO₃) @ ${fillerPercent}% PHR lowers unit cost significantly by bulking the matrix.`;
  } else if (fillerType === 'ath_flame_retardant') {
    fillerCostUsdKg = 0.66; // $0.66/kg (~₹55/kg)
    fillerDensityGcm3 = 2.42;
    fillerEffectNote = `Aluminium Trihydrate (ATH) @ ${fillerPercent}% PHR delivers UL94 V-0 flame retardancy & low-smoke release.`;
  } else if (fillerType === 'silica_powder') {
    fillerCostUsdKg = 0.34; // $0.34/kg (~₹28/kg)
    fillerDensityGcm3 = 2.65;
    fillerEffectNote = `Silica / Quartz Powder @ ${fillerPercent}% PHR enhances surface hardness, scratch resistance & flexural modulus.`;
  } else if (fillerPercent > 0) {
    fillerEffectNote = `Mineral Filler @ ${fillerPercent}% PHR provides cost optimization and matrix extension.`;
  }

  const fillerWeightKg = totalResinWeightKg * (fillerPercent / 100);
  const fillerWeightGrams = fillerWeightKg * 1000;

  // Total Composite Sheet Weight includes Glass + Resin + Mineral Filler
  const totalSheetWeightKg = totalGlassWeightKg + totalResinWeightKg + fillerWeightKg;

  // Resin density ~ 1.12 g/cm³
  const resinDensityGcm3 = 1.12;
  const resinVolumeLiters = totalResinWeightKg / resinDensityGcm3;

  // MEKP Catalyst ML (density ~ 1.1 g/ml)
  const catalystVolumeMl = (totalResinWeightKg * 1000 * (config.catalystPercent / 100)) / 1.1;

  // Cobalt Accelerator/Promoter (Cobalt Octoate/Naphthenate 6%, density ~ 0.96 g/ml)
  const cobaltPercent = config.cobaltPercent !== undefined ? config.cobaltPercent : 0.2;
  const cobaltWeightGrams = totalResinWeightKg * 1000 * (cobaltPercent / 100);
  const cobaltVolumeMl = cobaltWeightGrams / 0.96;

  // Ambient Temperature & Gel-Time Reaction Dynamics
  const ambientTempC = config.ambientTempC !== undefined ? config.ambientTempC : 25;
  const arrheniusTempFactor = Math.pow(2, (25 - ambientTempC) / 10);
  const catalystFactor = Math.pow(2.0 / Math.max(0.5, config.catalystPercent), 0.75);
  const cobaltFactor = Math.pow(0.20 / Math.max(0.02, cobaltPercent), 0.85);
  const estimatedGelTimeMin = Math.round(Math.max(3, Math.min(180, 22 * arrheniusTempFactor * catalystFactor * cobaltFactor)));

  let ambientCureStatus: 'cold_slow' | 'optimal' | 'hot_fast' = 'optimal';
  let cobaltRecommendation = `Standard ambient (${ambientTempC}°C). 0.20% Cobalt Octoate 6% yields an optimal ~20 min gel window.`;

  if (ambientTempC < 20) {
    ambientCureStatus = 'cold_slow';
    cobaltRecommendation = `Cold ambient (${ambientTempC}°C). Recommend increasing Cobalt Octoate to 0.30%–0.35% to prevent sluggish gelation.`;
  } else if (ambientTempC > 29) {
    ambientCureStatus = 'hot_fast';
    cobaltRecommendation = `Warm ambient (${ambientTempC}°C). Recommend reducing Cobalt Octoate to 0.08%–0.12% to avoid flash gelation & surface cracking.`;
  }

  // Resin Type Spec
  const activeResinType = config.resinType ?? 'orthophthalic';
  const activeResinSpec = RESIN_SPECS[activeResinType];

  // Pigment Paste Dosing based on Resin Color, Pigment Concentration & Desired Transparency
  let defaultPigment = 0.8;
  let baseColorMaxTransmittance = activeResinSpec.baseTransmittance;
  if (config.color === 'crystal_transparent') { defaultPigment = 0.0; baseColorMaxTransmittance = Math.min(95, activeResinSpec.baseTransmittance); }
  else if (config.color === 'translucent_clear') { defaultPigment = 0.2; baseColorMaxTransmittance = Math.min(90, activeResinSpec.baseTransmittance); }
  else if (config.color === 'sky_blue') { defaultPigment = 0.8; baseColorMaxTransmittance = Math.min(88, activeResinSpec.baseTransmittance); }
  else if (config.color === 'emerald_green') { defaultPigment = 1.0; baseColorMaxTransmittance = Math.min(82, activeResinSpec.baseTransmittance); }
  else if (config.color === 'amber') { defaultPigment = 1.0; baseColorMaxTransmittance = Math.min(84, activeResinSpec.baseTransmittance); }
  else if (config.color === 'opal_white') { defaultPigment = 2.5; baseColorMaxTransmittance = Math.min(65, activeResinSpec.baseTransmittance); }
  else if (config.color === 'carbon_black') { defaultPigment = 3.0; baseColorMaxTransmittance = Math.min(10, activeResinSpec.baseTransmittance); }
  else if (config.color === 'custom') { defaultPigment = 1.0; baseColorMaxTransmittance = config.customBaseTransmittance ?? Math.min(80, activeResinSpec.baseTransmittance); }

  if (config.customBaseTransmittance !== undefined) {
    baseColorMaxTransmittance = config.customBaseTransmittance;
  }

  const pigmentPercent = config.pigmentPercent !== undefined ? config.pigmentPercent : defaultPigment;

  const pigmentWeightGrams = totalResinWeightKg * 1000 * (pigmentPercent / 100);
  const pigmentWeightKg = pigmentWeightGrams / 1000;

  // Combined cured density
  const densityGcm3 = totalSheetWeightKg / (sheetVolumeCm3 / 1000);

  // Cost estimates & Custom Rate Overrides
  const usdToInrRate = config.customUsdToInrRate ?? 83.5;
  const activeResinRateInrPerKg = config.customResinRateInrPerKg ?? Math.round(activeResinSpec.costPerKgUsd * usdToInrRate);
  const activeGlassRateInrPerKg = config.customGlassRateInrPerKg ?? Math.round(2.8 * usdToInrRate);
  const activeFillerRateInrPerKg = config.customFillerRateInrPerKg ?? Math.round(fillerCostUsdKg * usdToInrRate);
  const activeCatalystRateInrPerLiter = config.customCatalystRateInrPerLiter ?? Math.round(8.0 * usdToInrRate);
  const activeLaborRateInrPerSheet = config.customLaborRateInrPerSheet ?? Math.round(15.0 * (config.lengthMm / 1800) * usdToInrRate);
  const activeGstPercent = config.customGstPercent ?? 18;
  const activeProfitMarginPercent = config.customProfitMarginPercent ?? 0;

  const resinCostInr = totalResinWeightKg * activeResinRateInrPerKg;
  const glassCostInr = totalGlassWeightKg * activeGlassRateInrPerKg;
  const fillerCostInr = fillerWeightKg * activeFillerRateInrPerKg;
  const mylarAreaM2 = (config.mylarWidthMm / 1000) * rawLengthM * 2; // top & bottom for raw sheet length
  const mylarCostInr = mylarAreaM2 * 0.8 * usdToInrRate;
  const catalystCostInr = (catalystVolumeMl / 1000) * activeCatalystRateInrPerLiter;
  const laborEnergyCostInr = activeLaborRateInrPerSheet;

  const baseCostInr = resinCostInr + glassCostInr + fillerCostInr + mylarCostInr + catalystCostInr + laborEnergyCostInr;
  const profitAmountInr = baseCostInr * (activeProfitMarginPercent / 100);
  const exFactoryCostInr = baseCostInr + profitAmountInr;
  const estimatedCostInr = exFactoryCostInr;
  const estimatedCostUsd = estimatedCostInr / usdToInrRate;

  // Indian Rupee Unit Rates & GST
  const pricePerM2Inr = sheetAreaM2 > 0 ? estimatedCostInr / sheetAreaM2 : 0;
  const pricePerSqFtInr = pricePerM2Inr / 10.7639; // 1 m² = 10.7639 sq.ft
  const pricePerKgInr = totalSheetWeightKg > 0 ? estimatedCostInr / totalSheetWeightKg : 0;
  const gstAmountInr = estimatedCostInr * (activeGstPercent / 100);
  const totalCostWithGstInr = estimatedCostInr + gstAmountInr;

  // Bureau of Indian Standards (BIS) Codes
  const bisStandards = [
    'IS 12866:2020 (FRP Roofing & Structural Sheet Specification)',
    'IS 6746:1994 (Unsaturated Polyester Resin Matrix for FRP)',
    'IS 11273:1992 (Woven Roving Fabrics for Glass Reinforcement)',
    'IS 875 Part 3:2015 (Design Wind Loads up to 55 m/s)',
    'IS 15061 (Class 1 Flame Spread Rating)'
  ];

  // Mechanical properties: Resin type & filler additions modify modulus (rigidity)
  let flexuralStiffnessGpa = 8.5 * activeResinSpec.stiffnessMultiplier; // base FRP with resin modifier
  if (config.fiberType.includes('woven')) flexuralStiffnessGpa = 14.2 * activeResinSpec.stiffnessMultiplier;
  if (config.fiberType.includes('multiaxial')) flexuralStiffnessGpa = 18.5 * activeResinSpec.stiffnessMultiplier;
  if (config.glassLayers > 2) flexuralStiffnessGpa *= 1.35;
  if (fillerPercent > 0) {
    const fillerStiffnessBoost = Math.min(0.25, (fillerPercent / 100) * 0.6); // up to +25% stiffness
    flexuralStiffnessGpa *= (1 + fillerStiffnessBoost);
  }

  // Light transmittance: Filler particles scatter light significantly (refractive index mismatch)
  const thicknessFactor = Math.pow(0.92, Math.max(0, config.thicknessMm - 1));
  let fillerScatteringFactor = Math.exp(-0.06 * fillerPercent); // 15% filler reduces transmittance by ~60%
  let calculatedTransmittance = Math.round(baseColorMaxTransmittance * Math.exp(-0.85 * pigmentPercent) * thicknessFactor * fillerScatteringFactor);
  if (config.color === 'carbon_black') {
    calculatedTransmittance = Math.max(0, Math.round(5 - pigmentPercent * 1.5));
  }
  const lightTransmittancePercent = Math.max(0, Math.min(95, calculatedTransmittance));

  // Peak exotherm reaction temp
  const peakExothermTempC = config.dryingTempC + (config.catalystPercent * 18.5);

  // Lifespan & Durability Calculations
  let baseResinLifespanYears = 12;
  if (activeResinType === 'isophthalic') baseResinLifespanYears = 18;
  if (activeResinType === 'dicyclopentadiene') baseResinLifespanYears = 15;
  if (activeResinType === 'acrylic_modified') baseResinLifespanYears = 22;
  if (activeResinType === 'vinyl_ester') baseResinLifespanYears = 25;

  // UV Exposure Resistance & Surface Film/Gelcoat Protection
  let uvProtectionBonusYears = 3;
  let uvProtectionType = "36µm UV-Stabilized Mylar Carrier Film";
  let uvDegradationResistance = "Standard UV-2 Weather Grade (ISO 4892)";

  const step1 = config.step1Method || '';
  const step5 = config.step5Method || '';
  const hasGelcoat = step1.includes('gelcoat') || step5.includes('gelcoat');

  if (hasGelcoat) {
    uvProtectionBonusYears = 7;
    uvProtectionType = "Isophthalic Neopentyl Glycol (NPG) Gelcoat + UV Absorber";
    uvDegradationResistance = "Extreme UV-5 Outdoor Weathering Class (4000 hr QUV Passed)";
  } else if (config.mylarThicknessUm >= 50) {
    uvProtectionBonusYears = 5;
    uvProtectionType = `${config.mylarThicknessUm}µm Heavy Duty Weather-Shield Mylar Film`;
    uvDegradationResistance = "High UV-4 Commercial Roof Grade";
  } else if (config.mylarThicknessUm >= 30) {
    uvProtectionBonusYears = 4;
    uvProtectionType = `${config.mylarThicknessUm}µm UV-Inhibited PET Film Coating`;
    uvDegradationResistance = "Enhanced UV-3 Weather Resistance Class";
  }

  // Thickness Structural Durability Factor
  let thicknessBonusYears = 0;
  if (config.thicknessMm >= 2.5) thicknessBonusYears = 4;
  else if (config.thicknessMm >= 1.8) thicknessBonusYears = 2;
  else if (config.thicknessMm < 1.2) thicknessBonusYears = -2;

  // Glass Fiber Reinforcement Structural Toughness
  let fiberReinforcementBonusYears = 0;
  if (config.fiberType === 'woven_roving_600' || config.fiberType === 'multiaxial_800') {
    fiberReinforcementBonusYears = 3;
  } else if (config.glassLayers >= 3) {
    fiberReinforcementBonusYears = 2;
  }

  // Filler Effect
  let fillerLifespanBonus = 0;
  if (fillerType === 'silica_powder') fillerLifespanBonus = 2;
  if (fillerType === 'ath_flame_retardant') fillerLifespanBonus = 1;

  const expectedLifespanYears = Math.min(35, Math.max(8, baseResinLifespanYears + uvProtectionBonusYears + thicknessBonusYears + fiberReinforcementBonusYears + fillerLifespanBonus));
  const warrantyPeriodYears = Math.round(expectedLifespanYears * 0.6);

  // Chemical Resistance Rating Text
  let chemicalResistanceRating = activeResinSpec.chemicalResistance;
  if (fillerType === 'ath_flame_retardant') {
    chemicalResistanceRating += " + Flame Retardant (UL94 V-0)";
  } else if (fillerType === 'silica_powder') {
    chemicalResistanceRating += " + High Abrasion Resistance";
  }

  // Degradation Curve Data (0 to 30 years)
  const degradationGraphData = [0, 5, 10, 15, 20, 25, 30].map((year) => {
    // Annual degradation rate depends on UV shield and resin quality
    const annualStructDecay = 100 / (expectedLifespanYears * 2.6);
    const annualUvDecay = 100 / (expectedLifespanYears * 2.1);

    const structPct = Math.max(25, Math.round(100 - (year * annualStructDecay)));
    const uvPct = Math.max(15, Math.round(100 - (year * annualUvDecay)));

    let condition = "Pristine Factory Cured";
    if (year === 5) condition = "Optimal Service (UV Shield Active)";
    else if (year === 10) condition = "Minor Surface Sheen Wear";
    else if (year === 15) condition = "Stable Service (Passes BIS Load)";
    else if (year === 20) condition = "Noticeable Surface Chalking";
    else if (year === 25) condition = "Matrix Resin Weather Wear";
    else if (year === 30) condition = "End of Primary Service Life";

    return {
      year,
      structuralIntegrityPercent: structPct,
      uvResistancePercent: uvPct,
      weatheringCondition: condition,
    };
  });

  const maintenanceRecommendation = expectedLifespanYears > 20
    ? "Low Maintenance. Inspect seals & flashings every 5 years. Optional PU re-coat after 15 years extends lifespan by +8 years."
    : "Standard Roof Maintenance. Wash with mild detergent every 2 years. Apply UV acrylic re-sealant after 8–10 years.";

  return {
    ultimateWidthMm,
    profileStretchFactor,
    edgeMarginMm,
    lengthMarginMm,
    rawLengthMm,
    flatWidthMm,
    requiredMylarWidthMm,
    requiredMylarLengthMm,
    sheetAreaM2,
    sheetVolumeCm3,
    glassWeightGsm: totalGlassGsm,
    totalGlassWeightKg,
    totalResinWeightKg,
    totalSheetWeightKg,
    catalystVolumeMl,
    cobaltPercent,
    cobaltWeightGrams: parseFloat(cobaltWeightGrams.toFixed(1)),
    cobaltVolumeMl: parseFloat(cobaltVolumeMl.toFixed(1)),
    ambientTempC,
    estimatedGelTimeMin,
    cobaltRecommendation,
    ambientCureStatus,
    fillerType,
    fillerPercent,
    fillerWeightKg: parseFloat(fillerWeightKg.toFixed(2)),
    fillerWeightGrams: parseFloat(fillerWeightGrams.toFixed(1)),
    fillerCostUsdKg,
    fillerEffectNote,
    pigmentPercent,
    pigmentWeightGrams: parseFloat(pigmentWeightGrams.toFixed(1)),
    pigmentWeightKg: parseFloat(pigmentWeightKg.toFixed(3)),
    resinVolumeLiters,
    densityGcm3: parseFloat(densityGcm3.toFixed(2)),
    estimatedCostUsd: parseFloat(estimatedCostUsd.toFixed(2)),
    estimatedCostInr: parseFloat(estimatedCostInr.toFixed(2)),
    pricePerM2Inr: Math.round(pricePerM2Inr),
    pricePerSqFtInr: parseFloat(pricePerSqFtInr.toFixed(1)),
    pricePerKgInr: Math.round(pricePerKgInr),
    gstAmountInr: Math.round(gstAmountInr),
    totalCostWithGstInr: Math.round(totalCostWithGstInr),
    // Active Rate Details
    activeResinRateInrPerKg,
    activeGlassRateInrPerKg,
    activeFillerRateInrPerKg,
    activeCatalystRateInrPerLiter,
    activeLaborRateInrPerSheet,
    activeUsdToInrRate: usdToInrRate,
    activeGstPercent,
    activeProfitMarginPercent,
    profitAmountInr: Math.round(profitAmountInr),
    exFactoryCostInr: Math.round(exFactoryCostInr),
    bisStandards,
    flexuralStiffnessGpa: parseFloat(flexuralStiffnessGpa.toFixed(1)),
    lightTransmittancePercent,
    peakExothermTempC: Math.round(peakExothermTempC),
    lifespanProjection: {
      expectedLifespanYears,
      baseResinLifespanYears,
      uvProtectionBonusYears,
      thicknessBonusYears,
      fiberReinforcementBonusYears,
      chemicalResistanceRating,
      uvDegradationResistance,
      uvProtectionType,
      maintenanceRecommendation,
      warrantyPeriodYears,
      degradationGraphData,
    },
    resinTypeSpec: {
      typeKey: activeResinSpec.typeKey,
      name: activeResinSpec.name,
      baseTransmittance: activeResinSpec.baseTransmittance,
      costPerKgUsd: activeResinSpec.costPerKgUsd,
      costPerKgInr: activeResinSpec.costPerKgInr,
      hdtC: activeResinSpec.hdtC,
      uvGrade: activeResinSpec.uvGrade,
      applicationDomain: activeResinSpec.applicationDomain,
      chemicalResistance: activeResinSpec.chemicalResistance,
    },
    glassFiberSpec: {
      typeKey: activeGlassSpec.typeKey,
      name: activeGlassSpec.name,
      gsmPerLayer: activeGlassSpec.gsmPerLayer,
      recommendedResinRatio: activeGlassSpec.recommendedResinRatio,
      recommendedResinRatioPercent: activeGlassSpec.recommendedResinRatioPercent,
      resinToGlassRatioText: activeGlassSpec.resinToGlassRatioText,
      description: activeGlassSpec.description,
      typicalApplications: activeGlassSpec.typicalApplications,
      weaveStructure: activeGlassSpec.weaveStructure,
    },
  };
}

export function getResinHexColor(color: FRPConfig['color'], customHex?: string): number {
  if (color === 'custom' && customHex) {
    const clean = customHex.replace('#', '');
    const parsed = parseInt(clean, 16);
    if (!isNaN(parsed)) return parsed;
  }
  switch (color) {
    case 'crystal_transparent':
      return 0xe0f2fe; // crystal glass transparent
    case 'translucent_clear':
      return 0xdbeafe; // light ice blue/clear
    case 'sky_blue':
      return 0x38bdf8; // vibrant sky blue
    case 'opal_white':
      return 0xf8fafc; // milky white
    case 'emerald_green':
      return 0x10b981; // emerald
    case 'amber':
      return 0xf59e0b; // amber yellow
    case 'carbon_black':
      return 0x1e293b; // slate dark
    case 'custom':
      return customHex ? parseInt(customHex.replace('#', ''), 16) || 0x8b5cf6 : 0x8b5cf6;
    default:
      return 0x38bdf8;
  }
}
