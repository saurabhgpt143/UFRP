export type ProfileType = 'flat' | 'corrugated_sinusoidal' | 'trapezoidal_rib' | 'profile_7v' | 'profile_6v' | 'curved';

export type ResinColor =
  | 'crystal_transparent'
  | 'translucent_clear'
  | 'sky_blue'
  | 'opal_white'
  | 'emerald_green'
  | 'amber'
  | 'carbon_black'
  | 'ral_violet'
  | 'ral_indigo'
  | 'ral_blue'
  | 'ral_green'
  | 'ral_yellow'
  | 'ral_orange'
  | 'ral_red'
  | 'custom';

export type ResinType = 'orthophthalic' | 'isophthalic' | 'dicyclopentadiene' | 'vinyl_ester' | 'acrylic_modified';

export type UVStabilizerType = 'synergistic_uva_hals' | 'benzotriazole_tinuvin_326' | 'hals_tinuvin_770' | 'cyasorb_uv531' | 'none';

export type GlassFiberType =
  | 'surface_veil_30'
  | 'polymer_mesh'
  | 'printed_cloth'
  | 'csm_225'
  | 'csm_300'
  | 'csm_450'
  | 'csm_600'
  | 'woven_roving_400'
  | 'woven_roving_600'
  | 'multiaxial_800';

export interface GlassPlyItem {
  id: string;
  fiberType: GlassFiberType;
  customGsm?: number; // Optional custom GSM override for this specific ply
}

export type MylarThickness = number; // in microns (µm), e.g. 19, 25, 36, 50, 75, 100, 125

export type LaborRateTierId = 'up_to_1mm' | '1_1_to_1_5mm' | '1_5mm_and_above';

export interface FRPConfig {
  // Sheet specs
  lengthMm: number;        // e.g. 1800 to 10800
  lengthMarginMm?: number; // End trim margin per longitudinal end (e.g. 20 to 150 mm, default 50mm)
  widthMm: number;         // Ultimate finished sheet width (e.g. 900, 1000, 1200, 1500)
  edgeMarginMm: number;    // Edge trimming & overlap margin (e.g. 30 to 100 mm, default 50mm)
  thicknessMm: number;     // e.g. 1.0, 1.2, 1.5, 2.0, 3.0, 5.0
  profile: ProfileType;
  corrugatedDrawFactor?: number; // Profile draw factor for sinusoidal waves (1.12 to 1.15, standard 1.125 for 54" per 4ft, 1.146 for 55" per 4ft)
  color: ResinColor;
  customHex?: string;      // Custom pigment HEX color e.g. "#a855f7"
  customBaseTransmittance?: number; // Custom base light transmittance % (0-100)
  ralCode?: string;        // RAL color code e.g. "RAL 4008"
  ralName?: string;        // RAL standard name e.g. "Signal Violet"
  ralHue?: 'violet' | 'indigo' | 'blue' | 'green' | 'yellow' | 'orange' | 'red'; // Primary hue category
  resinType?: ResinType;   // Orthophthalic, Isophthalic, DCPD, Vinyl Ester, Acrylic Modified
  pigmentPercent?: number;  // Pigment concentration (0.0% to 5.0%)
  fiberType: GlassFiberType;
  glassLayers: number;     // 1 to 20
  plySchedule?: GlassPlyItem[]; // Individual ply-by-ply schedule allowing different fiber types & GSMs per ply
  resinToGlassRatio: number; // e.g. 0.65 (65% resin, 35% glass)

  // Mylar film specs (Supports independent Bottom/1st Layer and Top/2nd Layer thickness in microns)
  mylarWidthMm: number;          // e.g. 1000, 1200, 1500
  mylarThicknessUm: MylarThickness;       // Primary / 1st (Bottom) layer thickness in µm (e.g. 25)
  mylarBottomThicknessUm?: MylarThickness; // 1st (Bottom) Mylar layer thickness in µm (e.g. 25 µm)
  mylarTopThicknessUm?: MylarThickness;    // 2nd (Top) Mylar layer thickness in µm (e.g. 100 µm)
  mylarFinish: 'gloss' | 'matte' | 'anti_uv';

  // Process / Curing specs
  catalystPercent: number; // 1.0 to 3.0% MEKP
  cobaltPercent?: number;  // 0.05 to 0.50% Cobalt Naphthenate / Octoate Promoter
  ambientTempC?: number;   // 15°C to 45°C ambient shop floor temperature
  styreneDiluentPercent?: number; // 0.0% to 10.0% phr additional reactive styrene monomer diluent
  uvStabilizerType?: UVStabilizerType; // UV Stabilizer additive package selection
  uvStabilizerPercent?: number;   // 0.0% to 1.0% phr UV absorber / HALS loading
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

  // Custom Commercial & Raw Material Rate Overrides (All in ₹/kg including Labor)
  customResinRateInrPerKg?: number;       // Custom Resin Price in INR/kg
  customGlassRateInrPerKg?: number;       // Custom Glass Fiber Price in INR/kg
  customPolymerMeshRateInrPerKg?: number; // Custom Polymer Mesh Price in INR/kg (Default: ₹320/kg)
  customPrintedClothRateInrPerKg?: number; // Custom Printed Cloth Price in INR/kg (Default: ₹480/kg)
  customFillerRateInrPerKg?: number;      // Custom Mineral Filler Price in INR/kg
  customCatalystRateInrPerKg?: number;    // Custom MEKP Catalyst Price in INR/kg
  customCobaltRateInrPerKg?: number;      // Custom Cobalt Octoate Price in INR/kg
  customPigmentRateInrPerKg?: number;     // Custom Pigment Paste Price in INR/kg
  customStyreneRateInrPerKg?: number;     // Custom Styrene Monomer Price in INR/kg
  customUvRateInrPerKg?: number;          // Custom UV Stabilizer Price in INR/kg
  customMylarRateInrPerKg?: number;       // Custom Mylar Film Price in INR/kg (Legacy/Fallback)
  customBottomMylarRateInrPerKg?: number; // Custom 25-Micron (1st / Bottom) Mylar Film Price in INR/kg (Default: ₹165/kg)
  customTopMylarRateInrPerKg?: number;    // Custom 100-Micron (2nd / Top) Mylar Film Price in INR/kg (Default: ₹195/kg)
  customMylarRatesByMicron?: Record<number, number>; // Per-micron rate lookup map (e.g. { 19: 160, 25: 165, 36: 172, 50: 180, 75: 188, 100: 195, 125: 210 })
  customLaborRateInrPerKg?: number;       // Custom Labor & Installation Cost in INR/kg
  // Thickness-based FRP Sheet Installation Labor Rate Tiers (₹/kg)
  // Up to 1 mm: ₹30/kg | 1.1 mm to 1.5 mm: ₹23/kg | 1.5 mm and above: ₹17/kg
  customLaborRateUpTo1mmInrPerKg?: number;        // Default: ₹30/kg
  customLaborRate1_1To1_5mmInrPerKg?: number;     // Default: ₹23/kg
  customLaborRateAbove1_5mmInrPerKg?: number;     // Default: ₹17/kg
  laborRateTierOverride?: 'auto' | LaborRateTierId;
  // Legacy rate fields kept optional for backward compatibility
  customCatalystRateInrPerLiter?: number;
  customCobaltRateInrPerLiter?: number;
  customMylarRateInrPerM2?: number;
  customLaborRateInrPerSheet?: number;
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
  catalystWeightGrams: number;
  catalystWeightKg: number;
  cobaltPercent: number;
  cobaltWeightGrams: number;
  cobaltWeightKg: number;
  cobaltVolumeMl: number;
  // Mylar Dual-Layer Specifications (1st Bottom Layer & Top Layer)
  mylarBottomThicknessUm: number;
  mylarTopThicknessUm: number;
  mylarSingleSideAreaM2: number;
  mylarTotalAreaM2: number;
  bottomMylarWeightGrams: number;
  bottomMylarWeightKg: number;
  topMylarWeightGrams: number;
  topMylarWeightKg: number;
  totalMylarWeightGrams: number;
  totalMylarWeightKg: number;
  bottomMylarCostInr: number;
  topMylarCostInr: number;
  ambientTempC: number;
  estimatedGelTimeMin: number;
  cobaltRecommendation: string;
  ambientCureStatus: 'cold_slow' | 'optimal' | 'hot_fast';
  fillerType: 'none' | 'calcium_carbonate' | 'ath_flame_retardant' | 'silica_powder';
  fillerPercent: number;
  fillerWeightKg: number;
  fillerWeightGrams: number;
  fillerCostInrKg: number;
  fillerEffectNote: string;
  // Styrene Reactive Diluent Monomer
  styreneDiluentPercent: number;
  styreneMonomerWeightKg: number;
  styreneMonomerWeightGrams: number;
  styreneRecommendation: string;
  styreneStatus: 'none' | 'optimal' | 'excessive';
  // UV Stabilizer Protection System
  uvStabilizerType: UVStabilizerType;
  uvStabilizerPercent: number;
  uvStabilizerWeightGrams: number;
  uvStabilizerWeightKg: number;
  uvStabilizerGrams: number; // for backward compatibility with ThermalPrintModal
  uvRecommendation: string;
  uvProtectionLevel: 'none' | 'standard' | 'high' | 'maximum';
  yellowingIndexProjection: {
    year0: number;
    year5: number;
    year10: number;
    year15: number;
    year20: number;
  };
  pigmentPercent: number;
  pigmentWeightGrams: number;
  pigmentWeightKg: number;
  resinVolumeLiters: number;
  densityGcm3: number;
  estimatedCostInr: number;
  pricePerM2Inr: number;
  pricePerSqFtInr: number;
  pricePerKgInr: number;
  gstAmountInr: number;
  totalCostWithGstInr: number;
  // Active Rate Details (All in ₹/kg including Labor)
  activeResinRateInrPerKg: number;
  activeGlassRateInrPerKg: number;
  activePolymerMeshRateInrPerKg: number;
  activePrintedClothRateInrPerKg: number;
  activeFillerRateInrPerKg: number;
  activeCatalystRateInrPerKg: number;
  activeCobaltRateInrPerKg: number;
  activePigmentRateInrPerKg: number;
  activeStyreneRateInrPerKg: number;
  activeUvRateInrPerKg: number;
  activeMylarRateInrPerKg: number;
  activeBottomMylarRateInrPerKg: number;
  activeTopMylarRateInrPerKg: number;
  activeLaborRateInrPerKg: number;
  activeLaborTierId: LaborRateTierId;
  activeLaborTierLabel: string;
  activeLaborRateUpTo1mmInrPerKg: number;
  activeLaborRate1_1To1_5mmInrPerKg: number;
  activeLaborRateAbove1_5mmInrPerKg: number;
  // Polymer Mesh & Printed Cloth Breakdown
  polymerMeshWeightKg: number;
  polymerMeshWeightGrams: number;
  printedClothWeightKg: number;
  printedClothWeightGrams: number;
  // Legacy compatibility active rate fields
  activeCatalystRateInrPerLiter: number;
  activeCobaltRateInrPerLiter: number;
  activeMylarRateInrPerM2: number;
  activeLaborRateInrPerSheet: number;
  activeGstPercent: number;
  activeProfitMarginPercent: number;
  // Itemized Cost Breakdown (INR)
  resinCostInr: number;
  glassCostInr: number;
  polymerMeshCostInr: number;
  printedClothCostInr: number;
  fillerCostInr: number;
  catalystCostInr: number;
  cobaltCostInr: number;
  pigmentCostInr: number;
  styreneCostInr: number;
  uvCostInr: number;
  mylarCostInr: number;
  laborEnergyCostInr: number;
  profitAmountInr: number;
  exFactoryCostInr: number;
  bisStandards: string[];
  flexuralStiffnessGpa: number;
  lightTransmittancePercent: number;
  peakExothermTempC: number;
  lifespanProjection: LifespanProjection;
  ralSpec?: {
    code: string;
    name: string;
    primaryHue: string;
    hueLabel: string;
    hex: string;
    bisCode: string;
    description: string;
  };
  resinTypeSpec: {
    typeKey: ResinType;
    name: string;
    baseTransmittance: number;
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
  plyScheduleBreakdown: {
    plyNumber: number;
    id: string;
    fiberType: GlassFiberType;
    name: string;
    shortName: string;
    gsm: number;
    recommendedResinRatio: number;
    weaveStructure: string;
  }[];
  isHybridPlySchedule: boolean;
  plySummaryText: string;
  structuralLoad: StructuralLoadSpec;
}

export type SupportCondition = 'single_span' | 'double_span' | 'multi_span';
export type DeflectionLimitCriteria = 'L_60' | 'L_100' | 'L_120' | 'L_180';

export interface PurlinSpanLoadPoint {
  spanMm: number;
  spanFeet: number;
  allowableLoadKgM2: number;
  allowableLoadKNM2: number;
  allowableLoadPsf: number;
  bendingLimitKgM2: number;
  deflectionLimitKgM2: number;
  governingFactor: 'bending' | 'deflection';
  maxDeflectionMm: number;
  concentratedLoadCapacityKg: number;
  walkableStatus: 'safe_walkable' | 'crawl_board_required' | 'fragile_walkway';
}

export interface StructuralLoadSpec {
  profileDepthMm: number;
  profilePitchMm: number;
  effectiveThicknessMm: number;
  momentOfInertiaCm4PerM: number; // I_xx in cm^4 per meter width
  sectionModulusCm3PerM: number;  // Z_xx in cm^3 per meter width
  flexuralModulusGpa: number;     // E_flex in GPa
  ultimateFlexuralStrengthMpa: number; // sigma_ult in MPa
  allowableBendingStressMpa: number;   // sigma_all = sigma_ult / FS
  factorOfSafety: number;              // default 2.5
  flexuralRigidityNm2PerM: number;     // D = E * I in N*m^2 per meter width
  recommendedMaxPurlinSpanMm: number;  // optimal recommended span for standard 100 kg/m^2 roof load
  concentratedLoadPadCapacityKg: number; // ASTM D3841 150x150mm midspan point load (kg)
  maxWindSpeedCapacityKmph: number;     // permissible basic wind speed (km/h)
  maxWindPressureKNM2: number;          // peak uplift / pressure capacity (kN/m^2)
  purlinTable: PurlinSpanLoadPoint[];   // Table of standard spans: 600, 900, 1000, 1200, 1400, 1500, 1800, 2000 mm
  standardsReferenced: string[];        // ASTM D3841, IS 12866, EN 1013, IS 875 Part 3
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

export interface BoxBaseDimensionResult {
  widthMm: number;
  lengthMm: number;
  thicknessMm: number;
  payloadKg: number;
  supportType: 'perimeter_4_edges' | 'supported_2_edges' | 'fully_supported_bottom';
  loadType: 'uniform_distributed' | 'center_point_load';
  reinforcementType: 'csm_mat' | 'woven_roving' | 'sandwich_core';
  actualStressMpa: number;
  allowableStressMpa: number;
  stressRatioPercent: number;
  actualDeflectionMm: number;
  allowableDeflectionMm: number;
  deflectionRatioPercent: number;
  maxSafeCapacityKg: number;
  isSafe: boolean;
  status: 'safe' | 'marginal' | 'unsafe';
  statusMessage: string;
  recommendedThicknessMm: number;
  stiffenerRecommendation: string;
  laminateSchedule: string;
  baseWeightKg: number;
}

