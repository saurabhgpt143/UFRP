export type ProfileType = 'flat' | 'corrugated_sinusoidal' | 'trapezoidal_rib' | 'profile_7v' | 'profile_6v' | 'curved';

export type ResinColor = 'crystal_transparent' | 'translucent_clear' | 'sky_blue' | 'opal_white' | 'emerald_green' | 'amber' | 'carbon_black' | 'custom';

export type ResinType = 'orthophthalic' | 'isophthalic' | 'dicyclopentadiene' | 'vinyl_ester' | 'acrylic_modified';

export type GlassFiberType = 'csm_300' | 'csm_450' | 'csm_600' | 'woven_roving_600' | 'multiaxial_800';

export type MylarThickness = 50 | 75 | 100; // in microns (µm)

export interface FRPConfig {
  // Sheet specs
  lengthMm: number;        // e.g. 1800 to 10800
  lengthMarginMm?: number; // End trim margin per longitudinal end (e.g. 20 to 150 mm, default 50mm)
  widthMm: number;         // Ultimate finished sheet width (e.g. 900, 1000, 1200, 1500)
  edgeMarginMm: number;    // Edge trimming & overlap margin (e.g. 30 to 100 mm, default 50mm)
  thicknessMm: number;     // e.g. 1.2, 1.5, 2.0, 3.0, 5.0
  profile: ProfileType;
  color: ResinColor;
  customHex?: string;      // Custom pigment HEX color e.g. "#a855f7"
  customBaseTransmittance?: number; // Custom base light transmittance % (0-100)
  resinType?: ResinType;   // Orthophthalic, Isophthalic, DCPD, Vinyl Ester, Acrylic Modified
  pigmentPercent?: number;  // Pigment concentration (0.0% to 5.0%)
  fiberType: GlassFiberType;
  glassLayers: number;     // 1 to 4
  resinToGlassRatio: number; // e.g. 0.65 (65% resin, 35% glass)

  // Mylar film specs
  mylarWidthMm: number;    // e.g. 1000, 1200, 1500
  mylarThicknessUm: MylarThickness;
  mylarFinish: 'gloss' | 'matte' | 'anti_uv';

  // Process / Curing specs
  catalystPercent: number; // 1.0 to 3.0% MEKP
  cobaltPercent?: number;  // 0.05 to 0.50% Cobalt Naphthenate / Octoate Promoter
  ambientTempC?: number;   // 15°C to 45°C ambient shop floor temperature
  fillerType?: 'none' | 'calcium_carbonate' | 'ath_flame_retardant' | 'silica_powder';
  fillerPercent?: number;  // 0 to 40% phr (parts per hundred resin)
  dryingTempC: number;     // 25 to 80°C
  dryingTimeMinutes: number; // e.g. 15 to 120
  weightKgPerMeter: number;  // compression weights placed on die

  // Alternative Process Method Selections per Step
  step1Method?: 'stationary_table' | 'conveyor_belt';
  step2Method?: 'bopet_mylar' | 'ptfe_cellophane';
  step3Method?: 'two_stage_manual' | 'spray_injection';
  step4Method?: 'profile_die_clamp' | 'continuous_roller_forming';
  step5Method?: 'thermal_oven_bed' | 'fir_infrared_tunnel';
  step6Method?: 'manual_shear_trim' | 'laser_flying_saw';

  // Custom Commercial & Raw Material Rate Overrides
  customResinRateInrPerKg?: number;       // Custom Resin Price in INR/kg
  customGlassRateInrPerKg?: number;       // Custom Glass Fiber Price in INR/kg
  customFillerRateInrPerKg?: number;      // Custom Mineral Filler Price in INR/kg
  customCatalystRateInrPerLiter?: number; // Custom MEKP Catalyst Price in INR/L
  customLaborRateInrPerSheet?: number;    // Custom Labor & Overhead Cost in INR/sheet
  customUsdToInrRate?: number;             // USD to INR Exchange Rate
  customGstPercent?: number;              // Statutory GST Rate % (e.g. 18%)
  customProfitMarginPercent?: number;     // Manufacturer Commercial Profit Margin % (e.g. 15%)
}

export interface TableSpec {
  unitWidthMm: number;   // 1800 mm (designated width)
  unitHeightMm: number;  // 900 mm (designated height)
  unitLengthMm: number;  // 1200 mm (unit bed length)
  tableCount: number;    // Math.ceil(lengthMm / 1200)
  totalBedLengthMm: number;
  totalBedAreaM2: number;
  levelnessMmPerM: number;
}

export interface LifespanDegradationPoint {
  year: number;
  structuralIntegrityPercent: number;
  uvResistancePercent: number;
  weatheringCondition: string;
}

export interface LifespanProjection {
  expectedLifespanYears: number;
  baseResinLifespanYears: number;
  uvProtectionBonusYears: number;
  thicknessBonusYears: number;
  fiberReinforcementBonusYears: number;
  chemicalResistanceRating: string;
  uvDegradationResistance: string;
  uvProtectionType: string;
  maintenanceRecommendation: string;
  warrantyPeriodYears: number;
  degradationGraphData: LifespanDegradationPoint[];
}

export interface MaterialCalculations {
  ultimateWidthMm: number;
  profileStretchFactor: number;
  edgeMarginMm: number;
  lengthMarginMm: number;         // End trim allowance per side (mm)
  rawLengthMm: number;            // Total raw length = lengthMm + (lengthMarginMm * 2)
  flatWidthMm: number;            // Determined flat raw sheet width = ultimateWidth * factor + margin
  requiredMylarWidthMm: number;  // Minimum Mylar film width to cover raw flat sheet
  requiredMylarLengthMm: number; // Minimum Mylar film length to cover raw length
  sheetAreaM2: number;
  sheetVolumeCm3: number;
  glassWeightGsm: number;
  totalGlassWeightKg: number;
  totalResinWeightKg: number;
  totalSheetWeightKg: number;
  catalystVolumeMl: number;
  cobaltPercent: number;
  cobaltWeightGrams: number;
  cobaltVolumeMl: number;
  ambientTempC: number;
  estimatedGelTimeMin: number;
  cobaltRecommendation: string;
  ambientCureStatus: 'cold_slow' | 'optimal' | 'hot_fast';
  fillerType: 'none' | 'calcium_carbonate' | 'ath_flame_retardant' | 'silica_powder';
  fillerPercent: number;
  fillerWeightKg: number;
  fillerWeightGrams: number;
  fillerCostUsdKg: number;
  fillerEffectNote: string;
  pigmentPercent: number;
  pigmentWeightGrams: number;
  pigmentWeightKg: number;
  resinVolumeLiters: number;
  densityGcm3: number;
  estimatedCostUsd: number;
  estimatedCostInr: number;
  pricePerM2Inr: number;
  pricePerSqFtInr: number;
  pricePerKgInr: number;
  gstAmountInr: number;
  totalCostWithGstInr: number;
  // Active Rate Details
  activeResinRateInrPerKg: number;
  activeGlassRateInrPerKg: number;
  activeFillerRateInrPerKg: number;
  activeCatalystRateInrPerLiter: number;
  activeLaborRateInrPerSheet: number;
  activeUsdToInrRate: number;
  activeGstPercent: number;
  activeProfitMarginPercent: number;
  profitAmountInr: number;
  exFactoryCostInr: number;
  bisStandards: string[];
  flexuralStiffnessGpa: number;
  lightTransmittancePercent: number;
  peakExothermTempC: number;
  lifespanProjection: LifespanProjection;
  resinTypeSpec: {
    typeKey: ResinType;
    name: string;
    baseTransmittance: number;
    costPerKgUsd: number;
    costPerKgInr: number;
    hdtC: number;
    uvGrade: string;
    applicationDomain: string;
    chemicalResistance: string;
  };
  glassFiberSpec: {
    typeKey: GlassFiberType;
    name: string;
    gsmPerLayer: number;
    recommendedResinRatio: number;
    recommendedResinRatioPercent: number;
    resinToGlassRatioText: string;
    description: string;
    typicalApplications: string;
    weaveStructure: string;
  };
}

export type StepNumber = 1 | 2 | 3 | 4 | 5 | 6;

export interface WorkflowStep {
  id: StepNumber;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
}

export interface DefectItem {
  id: string;
  name: string;
  type: 'bubble' | 'resin_starved' | 'thickness_var' | 'edge_burr';
  xRatio: number; // 0 to 1
  yRatio: number; // 0 to 1
  severity: 'low' | 'medium' | 'high';
  resolved: boolean;
}
