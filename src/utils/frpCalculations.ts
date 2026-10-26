import {
  FRPConfig,
  MaterialCalculations,
  TableSpec,
  ResinType,
  GlassFiberType,
  GlassPlyItem,
  StructuralLoadSpec,
  PurlinSpanLoadPoint,
  SupportCondition,
  DeflectionLimitCriteria,
  BoxBaseDimensionResult,
  LaborRateTierId,
} from '../types';

import { RAL_COLORS, findRalColor, RalColorSpec } from '../data/ralColors';

export const GLASS_FIBER_SPECS: Record<GlassFiberType, {
  typeKey: GlassFiberType;
  name: string;
  shortName: string;
  gsmPerLayer: number;
  recommendedResinRatio: number;
  recommendedResinRatioPercent: number;
  resinToGlassRatioText: string;
  description: string;
  typicalApplications: string;
  weaveStructure: string;
}> = {
  surface_veil_30: {
    typeKey: 'surface_veil_30',
    name: 'C-Glass Surface Tissue Veil (30 gsm)',
    shortName: 'Surface Veil 30 gsm',
    gsmPerLayer: 30,
    recommendedResinRatio: 0.85,
    recommendedResinRatioPercent: 85,
    resinToGlassRatioText: '85:15 Resin:Glass (Resin-Rich Barrier Skin)',
    description: 'Ultra-fine C-glass non-woven tissue veil applied on the outer weathering or chemical-contact surface to create a resin-rich barrier and prevent fiber blooming.',
    typicalApplications: 'Outer UV Weathering Skin, Chemical Barrier Layer, Smooth Gelcoat Backing',
    weaveStructure: 'Fine Non-Woven C-Glass Filament Tissue Veil',
  },
  polymer_mesh: {
    typeKey: 'polymer_mesh',
    name: 'High-Tenacity Polymer Reinforcing Mesh (5 gsm)',
    shortName: 'Polymer Mesh 5 gsm',
    gsmPerLayer: 5,
    recommendedResinRatio: 0.72,
    recommendedResinRatioPercent: 72,
    resinToGlassRatioText: '72:28 Resin:Mesh (Ultra-Light 5 gsm Polymer Grid)',
    description: 'Ultra-lightweight 5 gsm biaxial high-tenacity synthetic polymer mesh (PP/PET/HDPE grid) embedded in the FRP laminate for tear resistance, hailstone protection, and anti-shatter reinforcement with minimal weight addition.',
    typicalApplications: 'Impact-Resistant Skylights, Anti-Shatter Security Roofing, Hail-Proof Canopies, Hybrid CSM + 5 gsm Polymer Mesh Laminates',
    weaveStructure: 'Open-Grid Biaxial Extruded / Woven Polymer Mesh (5 gsm • 5×5 mm Grid)',
  },
  printed_cloth: {
    typeKey: 'printed_cloth',
    name: 'Decorative Printed Cloth / Designer Fabric (100 gsm)',
    shortName: 'Printed Cloth 100 gsm',
    gsmPerLayer: 100,
    recommendedResinRatio: 0.75,
    recommendedResinRatioPercent: 75,
    resinToGlassRatioText: '75:25 Resin:Cloth (Resin-Impregnated Decorative Layer)',
    description: 'Resin-absorbent printed textile / designer cloth interlayer (floral, woodgrain, marble, or geometric motifs) encapsulated beneath clear resin & surface veil for decorative FRP sheets, doors, and partitions.',
    typicalApplications: 'Decorative FRP Sheets, Designer Bathroom Doors, Printed Balcony Cladding, Interior Partitions & False Ceilings',
    weaveStructure: 'Fine Plain-Weave Printed Textile Cloth (Resin-Permeable)',
  },
  csm_225: {
    typeKey: 'csm_225',
    name: 'Chopped Strand Mat (CSM 225 gsm)',
    shortName: 'CSM 225 gsm',
    gsmPerLayer: 225,
    recommendedResinRatio: 0.72,
    recommendedResinRatioPercent: 72,
    resinToGlassRatioText: '72:28 Resin:Glass (2.57:1 Weight Ratio)',
    description: 'Fine lightweight emulsion-bonded chopped strand mat for thin translucent sheets and skin plies over woven roving.',
    typicalApplications: 'Thin Translucent Skylights, Skin Ply in Hybrid Laminates, Curved Profiles',
    weaveStructure: 'Fine Random Chopped Strands with High-Clarity Emulsion Binder',
  },
  csm_300: {
    typeKey: 'csm_300',
    name: 'Chopped Strand Mat (CSM 300 gsm)',
    shortName: 'CSM 300 gsm',
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
    shortName: 'CSM 450 gsm',
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
    shortName: 'CSM 600 gsm',
    gsmPerLayer: 600,
    recommendedResinRatio: 0.65,
    recommendedResinRatioPercent: 65,
    resinToGlassRatioText: '65:35 Resin:Glass (1.86:1 Weight Ratio)',
    description: 'Heavy gauge chopped strand mat. Provides rapid laminate thickness build-up with high structural impact absorption.',
    typicalApplications: 'Heavy-Duty Industrial Roofing, High-Wind Coastal Canopies, Corrosion Barriers',
    weaveStructure: 'Dense Random Chopped Mat',
  },
  woven_roving_400: {
    typeKey: 'woven_roving_400',
    name: 'Woven Roving Fabric (400 gsm)',
    shortName: 'Woven Roving 400 gsm',
    gsmPerLayer: 400,
    recommendedResinRatio: 0.55,
    recommendedResinRatioPercent: 55,
    resinToGlassRatioText: '55:45 Resin:Glass (1.22:1 Weight Ratio)',
    description: 'Medium-weight bi-directional 0°/90° woven continuous E-glass roving ideal for intermediate core reinforcement between CSM skins.',
    typicalApplications: 'Hybrid CSM + WR Structural Sheets, Box Base Plates, Medium-Span Roofing',
    weaveStructure: 'Balanced Plain Weave Continuous Rovings (0°/90°)',
  },
  woven_roving_600: {
    typeKey: 'woven_roving_600',
    name: 'Woven Roving Fabric (600 gsm)',
    shortName: 'Woven Roving 600 gsm',
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
    shortName: 'Multiaxial 800 gsm',
    gsmPerLayer: 800,
    recommendedResinRatio: 0.48,
    recommendedResinRatioPercent: 48,
    resinToGlassRatioText: '48:52 Resin:Glass (0.92:1 Weight Ratio)',
    description: 'Non-crimp stitched multiaxial reinforcement (+45°/-45° or 0°/90°). Maximum structural glass packing density with lowest resin wet-out volume.',
    typicalApplications: 'Heavy Industrial Structural FRP, Extreme Load Panels, Seismic Resistant Enclosures',
    weaveStructure: 'Stitched Non-Crimp Multiaxial Continuous Strands',
  },
};

export function resolvePlySchedule(config: FRPConfig): MaterialCalculations['plyScheduleBreakdown'] {
  if (config.plySchedule && config.plySchedule.length > 0) {
    return config.plySchedule.map((ply, idx) => {
      const spec = GLASS_FIBER_SPECS[ply.fiberType] || GLASS_FIBER_SPECS['csm_450'];
      const gsm = ply.customGsm && ply.customGsm > 0 ? ply.customGsm : spec.gsmPerLayer;
      return {
        plyNumber: idx + 1,
        id: ply.id || `ply-${idx + 1}`,
        fiberType: ply.fiberType,
        name: spec.name,
        shortName:
          ply.customGsm && ply.customGsm !== spec.gsmPerLayer
            ? `${spec.shortName.replace(/\s+\d+\s*gsm$/i, '')} ${gsm} gsm`
            : spec.shortName,
        gsm,
        recommendedResinRatio: spec.recommendedResinRatio,
        weaveStructure: spec.weaveStructure,
      };
    });
  }

  const count = Math.max(1, config.glassLayers || 1);
  const spec = GLASS_FIBER_SPECS[config.fiberType] || GLASS_FIBER_SPECS['csm_450'];
  return Array.from({ length: count }, (_, idx) => ({
    plyNumber: idx + 1,
    id: `ply-${idx + 1}`,
    fiberType: spec.typeKey,
    name: spec.name,
    shortName: spec.shortName,
    gsm: spec.gsmPerLayer,
    recommendedResinRatio: spec.recommendedResinRatio,
    weaveStructure: spec.weaveStructure,
  }));
}

export const RESIN_SPECS: Record<ResinType, {
  typeKey: ResinType;
  name: string;
  baseTransmittance: number;
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

export function calculateStructuralLoadCapacity(
  config: FRPConfig,
  flexuralStiffnessGpa: number,
  supportCondition: SupportCondition = 'double_span',
  deflectionCriteria: DeflectionLimitCriteria = 'L_60'
): StructuralLoadSpec {
  const t = config.thicknessMm;
  const profile = config.profile;

  // Geometric properties per 1 meter (1000 mm) of sheet width
  let profileDepthMm = 18;
  let profilePitchMm = 76;
  let momentOfInertiaCm4PerM = 9.13;
  let sectionModulusCm3PerM = 9.13;

  if (profile === 'corrugated_sinusoidal') {
    // 76/18 Circular/Sinusoidal wave: pitch 76mm, depth 18mm
    profileDepthMm = 18;
    profilePitchMm = 76;
    const factorT = t / 2.0;
    momentOfInertiaCm4PerM = 9.13 * factorT;
    const yMaxMm = (profileDepthMm + t) / 2;
    sectionModulusCm3PerM = (momentOfInertiaCm4PerM * 10000) / yMaxMm / 1000;
  } else if (profile === 'trapezoidal_rib') {
    // Industrial box/trapezoidal rib: depth 30mm, pitch 200mm
    profileDepthMm = 30;
    profilePitchMm = 200;
    const factorT = t / 2.0;
    momentOfInertiaCm4PerM = 17.95 * factorT;
    const yMaxMm = (profileDepthMm + t) * 0.52; // neutral axis offset slightly towards valley
    sectionModulusCm3PerM = (momentOfInertiaCm4PerM * 10000) / yMaxMm / 1000;
  } else if (profile === 'profile_7v') {
    // 7V profile: depth 28mm, pitch 185mm
    profileDepthMm = 28;
    profilePitchMm = 185;
    const factorT = t / 2.0;
    momentOfInertiaCm4PerM = 14.80 * factorT;
    const yMaxMm = (profileDepthMm + t) / 2;
    sectionModulusCm3PerM = (momentOfInertiaCm4PerM * 10000) / yMaxMm / 1000;
  } else if (profile === 'profile_6v') {
    // 6V profile: depth 26mm, pitch 178mm
    profileDepthMm = 26;
    profilePitchMm = 178;
    const factorT = t / 2.0;
    momentOfInertiaCm4PerM = 13.20 * factorT;
    const yMaxMm = (profileDepthMm + t) / 2;
    sectionModulusCm3PerM = (momentOfInertiaCm4PerM * 10000) / yMaxMm / 1000;
  } else if (profile === 'curved') {
    // Curved sinusoidal barrel canopy: depth 18mm + pre-camber arch
    profileDepthMm = 18;
    profilePitchMm = 76;
    const factorT = t / 2.0;
    momentOfInertiaCm4PerM = 10.20 * factorT;
    const yMaxMm = (profileDepthMm + t) / 2;
    sectionModulusCm3PerM = (momentOfInertiaCm4PerM * 10000) / yMaxMm / 1000;
  } else if (profile === 'flat') {
    // Flat flat sheet (no corrugation)
    profileDepthMm = t;
    profilePitchMm = 0;
    const iMm4 = (1000 * Math.pow(t, 3)) / 12;
    momentOfInertiaCm4PerM = iMm4 / 10000;
    const yMaxMm = t / 2;
    sectionModulusCm3PerM = (iMm4 / yMaxMm) / 1000;
  }

  // Flexural Modulus E in Pa
  const E_Gpa = flexuralStiffnessGpa;
  const E_Pa = E_Gpa * 1e9; // N/m^2

  // Moment of Inertia in m^4 per meter width
  const I_m4 = momentOfInertiaCm4PerM * 1e-8;

  // Section Modulus in m^3 per meter width
  const Z_m3 = sectionModulusCm3PerM * 1e-6;

  // Flexural Rigidity D = E * I in N*m^2 per meter
  const flexuralRigidityNm2PerM = E_Pa * I_m4;

  // Base Ultimate Flexural Strength (MPa) per ASTM D790 / IS 12866 weighted across plies
  const plies = resolvePlySchedule(config);
  const totalPlyGsm = Math.max(1, plies.reduce((sum, p) => sum + p.gsm, 0));
  let weightedFlexStrength = 0;
  for (const ply of plies) {
    let plyStrength = 150;
    if (ply.fiberType.includes('woven')) plyStrength = 225;
    else if (ply.fiberType.includes('multiaxial')) plyStrength = 275;
    else if (ply.fiberType === 'polymer_mesh') plyStrength = 165;
    else if (ply.fiberType === 'printed_cloth') plyStrength = 125;
    else if (ply.fiberType === 'surface_veil_30') plyStrength = 120;
    weightedFlexStrength += plyStrength * (ply.gsm / totalPlyGsm);
  }
  let ultimateFlexuralStrengthMpa = weightedFlexStrength;
  if (plies.length > 2) ultimateFlexuralStrengthMpa *= 1.25;

  const resinType = config.resinType ?? 'orthophthalic';
  if (resinType === 'vinyl_ester') ultimateFlexuralStrengthMpa *= 1.25;
  else if (resinType === 'isophthalic') ultimateFlexuralStrengthMpa *= 1.10;
  else if (resinType === 'acrylic_modified') ultimateFlexuralStrengthMpa *= 1.05;
  else if (resinType === 'dicyclopentadiene') ultimateFlexuralStrengthMpa *= 0.95;

  const factorOfSafety = 2.5; // IS 12866 Section 7.2 Safety Margin
  const allowableBendingStressMpa = ultimateFlexuralStrengthMpa / factorOfSafety;
  const sigmaAllowablePa = allowableBendingStressMpa * 1e6;

  // Deflection limit divisor k
  let kDivisor = 60;
  if (deflectionCriteria === 'L_100') kDivisor = 100;
  else if (deflectionCriteria === 'L_120') kDivisor = 120;
  else if (deflectionCriteria === 'L_180') kDivisor = 180;

  // Support coefficients
  let c_m = 1 / 8; // single span moment coeff (0.125)
  let c_d = 5 / 384; // single span deflection coeff (~0.01302)
  if (supportCondition === 'double_span') {
    c_m = 1 / 8;
    c_d = 1 / 185;
  } else if (supportCondition === 'multi_span') {
    c_m = 1 / 10;
    c_d = 1 / 145;
  }

  // Pre-camber arch boost for curved profile
  const archBoost = profile === 'curved' ? 1.35 : 1.0;

  // Standard Spans table (mm)
  const standardSpansMm = [600, 900, 1000, 1200, 1400, 1500, 1800, 2000];
  const purlinTable: PurlinSpanLoadPoint[] = standardSpansMm.map((spanMm) => {
    const spanM = spanMm / 1000;
    const spanFeet = parseFloat((spanMm / 304.8).toFixed(1));

    // Bending capacity load (N/m^2)
    const wBendingPa = ((sigmaAllowablePa * Z_m3) / (c_m * Math.pow(spanM, 2))) * archBoost;
    // Deflection limit load (N/m^2)
    const wDeflectionPa = ((E_Pa * I_m4) / (c_d * kDivisor * Math.pow(spanM, 3))) * archBoost;

    const allowablePa = Math.min(wBendingPa, wDeflectionPa);
    const governingFactor = wDeflectionPa <= wBendingPa ? 'deflection' : 'bending';

    const allowableLoadKgM2 = Math.round(allowablePa / 9.80665);
    const allowableLoadKNM2 = parseFloat((allowablePa / 1000).toFixed(2));
    const allowableLoadPsf = parseFloat(((allowablePa / 9.80665) * 0.204816).toFixed(1));
    const bendingLimitKgM2 = Math.round(wBendingPa / 9.80665);
    const deflectionLimitKgM2 = Math.round(wDeflectionPa / 9.80665);

    const maxDeflectionMm = parseFloat(((c_d * (allowablePa * Math.pow(spanM, 4))) / (E_Pa * I_m4) * 1000).toFixed(1));

    // Concentrated load capacity (ASTM D3841 150x150 mm block at midspan)
    const Z_eff_m3 = Z_m3 * 0.55;
    const P_allowable_N = (4 * sigmaAllowablePa * Z_eff_m3) / spanM;
    const concentratedLoadCapacityKg = Math.round(P_allowable_N / 9.80665);

    let walkableStatus: 'safe_walkable' | 'crawl_board_required' | 'fragile_walkway' = 'safe_walkable';
    if (concentratedLoadCapacityKg < 80 || profile === 'flat') {
      walkableStatus = 'fragile_walkway';
    } else if (concentratedLoadCapacityKg < 125 || spanMm > 1400) {
      walkableStatus = 'crawl_board_required';
    }

    return {
      spanMm,
      spanFeet,
      allowableLoadKgM2,
      allowableLoadKNM2,
      allowableLoadPsf,
      bendingLimitKgM2,
      deflectionLimitKgM2,
      governingFactor,
      maxDeflectionMm,
      concentratedLoadCapacityKg,
      walkableStatus,
    };
  });

  let recommendedMaxPurlinSpanMm = 1200;
  for (let i = purlinTable.length - 1; i >= 0; i--) {
    if (purlinTable[i].allowableLoadKgM2 >= 120) {
      recommendedMaxPurlinSpanMm = purlinTable[i].spanMm;
      break;
    }
  }
  if (recommendedMaxPurlinSpanMm === 1200 && purlinTable[0].allowableLoadKgM2 < 120) {
    recommendedMaxPurlinSpanMm = 600;
  }

  const recPoint = purlinTable.find(p => p.spanMm === recommendedMaxPurlinSpanMm) || purlinTable[3];
  const concentratedLoadPadCapacityKg = recPoint.concentratedLoadCapacityKg;

  const span1200 = purlinTable.find(p => p.spanMm === 1200) || purlinTable[3];
  const upliftCapacityPa = span1200.allowableLoadKgM2 * 9.80665;
  const maxWindSpeedMs = Math.sqrt(Math.max(100, upliftCapacityPa) / (0.6 * 1.2));
  const maxWindSpeedCapacityKmph = Math.round(maxWindSpeedMs * 3.6);
  const maxWindPressureKNM2 = parseFloat((upliftCapacityPa / 1000).toFixed(2));

  return {
    profileDepthMm,
    profilePitchMm,
    effectiveThicknessMm: t,
    momentOfInertiaCm4PerM: parseFloat(momentOfInertiaCm4PerM.toFixed(2)),
    sectionModulusCm3PerM: parseFloat(sectionModulusCm3PerM.toFixed(2)),
    flexuralModulusGpa: parseFloat(flexuralStiffnessGpa.toFixed(1)),
    ultimateFlexuralStrengthMpa: Math.round(ultimateFlexuralStrengthMpa),
    allowableBendingStressMpa: Math.round(allowableBendingStressMpa),
    factorOfSafety,
    flexuralRigidityNm2PerM: Math.round(flexuralRigidityNm2PerM),
    recommendedMaxPurlinSpanMm,
    concentratedLoadPadCapacityKg,
    maxWindSpeedCapacityKmph,
    maxWindPressureKNM2,
    purlinTable,
    standardsReferenced: [
      'ASTM D3841: Standard Specification for Glass-Fiber-Reinforced Polyester Plastic Panels',
      'IS 12866:2020: Specification for Plastic Translucent Sheets Made from Thermosetting Polyester Resin',
      'EN 1013: Light Transmitting Profiled Plastics Sheets (Load & Deflection Tests)',
      'IS 875 Part 3: Code of Practice for Design Wind Loads for Buildings & Structures',
    ],
  };
}

export function evaluateCustomSpanAndLoad(
  structuralSpec: StructuralLoadSpec,
  spanMm: number,
  appliedLoadKgM2: number,
  supportCondition: SupportCondition = 'double_span',
  deflectionCriteria: DeflectionLimitCriteria = 'L_60'
) {
  const spanM = spanMm / 1000;
  const appliedPa = appliedLoadKgM2 * 9.80665;
  const E_Pa = structuralSpec.flexuralModulusGpa * 1e9;
  const I_m4 = structuralSpec.momentOfInertiaCm4PerM * 1e-8;
  const Z_m3 = structuralSpec.sectionModulusCm3PerM * 1e-6;

  let c_m = 1 / 8;
  let c_d = 5 / 384;
  if (supportCondition === 'double_span') {
    c_m = 1 / 8;
    c_d = 1 / 185;
  } else if (supportCondition === 'multi_span') {
    c_m = 1 / 10;
    c_d = 1 / 145;
  }

  let kDivisor = 60;
  if (deflectionCriteria === 'L_100') kDivisor = 100;
  else if (deflectionCriteria === 'L_120') kDivisor = 120;
  else if (deflectionCriteria === 'L_180') kDivisor = 180;

  // Maximum bending moment per meter
  const momentNm = c_m * appliedPa * Math.pow(spanM, 2);
  const actualStressMpa = (momentNm / Z_m3) / 1e6;
  const allowableStressMpa = structuralSpec.allowableBendingStressMpa;
  const stressRatioPercent = Math.round((actualStressMpa / allowableStressMpa) * 100);

  // Maximum deflection
  const actualDeflectionMm = (c_d * (appliedPa * Math.pow(spanM, 4)) / (E_Pa * I_m4)) * 1000;
  const allowableDeflectionMm = (spanM * 1000) / kDivisor;
  const deflectionRatioPercent = Math.round((actualDeflectionMm / allowableDeflectionMm) * 100);

  // Deflection span ratio
  const spanToDeflectionRatio = actualDeflectionMm > 0 ? Math.round(spanMm / actualDeflectionMm) : 9999;

  // Safety factor
  const achievedSafetyFactor = actualStressMpa > 0 ? parseFloat((structuralSpec.ultimateFlexuralStrengthMpa / actualStressMpa).toFixed(2)) : 99;

  let status: 'optimal' | 'warning' | 'critical' = 'optimal';
  let statusMessage = `PASS: Deflection ${actualDeflectionMm.toFixed(1)}mm ≤ ${allowableDeflectionMm.toFixed(1)}mm (${deflectionCriteria.replace('_', '/')}), Stress at ${stressRatioPercent}% capacity.`;

  if (deflectionRatioPercent > 100 || stressRatioPercent > 100) {
    status = 'critical';
    statusMessage = `FAIL: Exceeds ${deflectionRatioPercent > 100 ? `Deflection limit (${actualDeflectionMm.toFixed(1)}mm > ${allowableDeflectionMm.toFixed(1)}mm)` : `Bending stress limit (${actualStressMpa.toFixed(1)} MPa > ${allowableStressMpa} MPa)`}. Reduce span or increase sheet thickness.`;
  } else if (deflectionRatioPercent > 80 || stressRatioPercent > 80) {
    status = 'warning';
    statusMessage = `MARGINAL: Operating at ${Math.max(deflectionRatioPercent, stressRatioPercent)}% design envelope. Recommended to verify purlin spacing with structural engineer.`;
  }

  return {
    spanMm,
    appliedLoadKgM2,
    momentNm: Math.round(momentNm),
    actualStressMpa: parseFloat(actualStressMpa.toFixed(1)),
    allowableStressMpa,
    stressRatioPercent,
    actualDeflectionMm: parseFloat(actualDeflectionMm.toFixed(2)),
    allowableDeflectionMm: parseFloat(allowableDeflectionMm.toFixed(1)),
    deflectionRatioPercent,
    spanToDeflectionRatio: `L/${spanToDeflectionRatio}`,
    achievedSafetyFactor,
    status,
    statusMessage,
  };
}

export function evaluateBoxBaseCalculation(
  widthMm: number,
  lengthMm: number,
  thicknessMm: number,
  payloadKg: number,
  supportType: 'perimeter_4_edges' | 'supported_2_edges' | 'fully_supported_bottom' = 'perimeter_4_edges',
  loadType: 'uniform_distributed' | 'center_point_load' = 'uniform_distributed',
  reinforcementType: 'csm_mat' | 'woven_roving' | 'sandwich_core' = 'csm_mat'
): BoxBaseDimensionResult {
  const shortMm = Math.min(widthMm, lengthMm);
  const longMm = Math.max(widthMm, lengthMm);
  const b = shortMm / 1000; // meters (shorter span)
  const a = longMm / 1000; // meters (longer span)
  const areaM2 = Math.max(0.01, a * b);
  const t = Math.max(0.001, thicknessMm / 1000); // meters

  // Mechanical properties
  let E_Pa = 8.5e9; // 8.5 GPa for CSM
  let allowableStressMpa = 60; // SF = 2.5 on 150 MPa ultimate
  let laminateSchedule = `${Math.max(1, Math.round(thicknessMm / 1.0))}x CSM 450 gsm Chopped Strand Mat`;

  if (reinforcementType === 'woven_roving') {
    E_Pa = 14.5e9;
    allowableStressMpa = 90;
    laminateSchedule = `CSM 450 Surface + ${Math.max(1, Math.round(thicknessMm / 1.4))}x Woven Roving 600 gsm`;
  } else if (reinforcementType === 'sandwich_core') {
    E_Pa = 18.0e9;
    allowableStressMpa = 72;
    laminateSchedule = `2x FRP Skins (1.5mm) + 10mm Structural High-Density Core`;
  }

  const nu = 0.3; // Poisson's ratio
  const D = (E_Pa * Math.pow(t, 3)) / (12 * (1 - nu * nu));

  let actualStressMpa = 0;
  let actualDeflectionMm = 0;
  let allowableDeflectionMm = Math.min(shortMm / 80, 8.0); // max allowable sag

  if (supportType === 'fully_supported_bottom') {
    const pressurePa = (payloadKg * 9.80665) / areaM2;
    actualStressMpa = pressurePa / 1e6;
    allowableStressMpa = 110;
    actualDeflectionMm = 0.02;
    allowableDeflectionMm = 1.0;
  } else if (supportType === 'perimeter_4_edges') {
    const r = Math.min(3.5, a / b);
    const beta = Math.min(0.125, 0.0479 + 0.046 * Math.pow(r - 1.0, 0.72));
    const alpha = Math.min(0.142, 0.0444 + 0.054 * Math.pow(r - 1.0, 0.82));

    if (loadType === 'uniform_distributed') {
      const q = (payloadKg * 9.80665) / areaM2;
      const sigmaPa = (beta * q * Math.pow(b, 2)) / Math.pow(t, 2);
      actualStressMpa = sigmaPa / 1e6;
      const defM = (alpha * q * Math.pow(b, 4)) / D;
      actualDeflectionMm = defM * 1000;
    } else {
      const P = payloadKg * 9.80665;
      const sigmaPa = 0.48 * (P / Math.pow(t, 2)) * (1 + 1.2 * Math.log(b / Math.max(0.01, 2 * t)));
      actualStressMpa = sigmaPa / 1e6;
      const defM = (0.0128 * P * Math.pow(b, 2)) / D;
      actualDeflectionMm = defM * 1000;
    }
  } else {
    // Supported along 2 edges only
    if (loadType === 'uniform_distributed') {
      const q = (payloadKg * 9.80665) / areaM2;
      const M = (q * Math.pow(b, 2)) / 8;
      const Z = Math.pow(t, 2) / 6;
      actualStressMpa = (M / Z) / 1e6;
      const defM = (5 * q * Math.pow(b, 4)) / (384 * D);
      actualDeflectionMm = defM * 1000;
    } else {
      const P = payloadKg * 9.80665;
      const M = (P * b) / (4 * a);
      const Z = Math.pow(t, 2) / 6;
      actualStressMpa = (M / Z) / 1e6;
      const defM = (P * Math.pow(b, 3)) / (48 * D * a);
      actualDeflectionMm = defM * 1000;
    }
  }

  const stressRatioPercent = Math.round((actualStressMpa / allowableStressMpa) * 100);
  const deflectionRatioPercent = allowableDeflectionMm > 0 ? Math.round((actualDeflectionMm / allowableDeflectionMm) * 100) : 0;

  let maxSafeCapacityKg = 0;
  if (supportType === 'fully_supported_bottom') {
    maxSafeCapacityKg = Math.min(10000, Math.round((allowableStressMpa * 1e6 * areaM2) / 9.80665));
  } else {
    const ratio = Math.max(stressRatioPercent / 100, deflectionRatioPercent / 100);
    maxSafeCapacityKg = ratio > 0 ? Math.round(payloadKg / ratio) : payloadKg;
  }

  const isSafe = stressRatioPercent <= 100 && deflectionRatioPercent <= 100;
  let status: 'safe' | 'marginal' | 'unsafe' = 'safe';
  let statusMessage = `PASS: ${payloadKg} kg payload safely supported. Deflection is ${actualDeflectionMm.toFixed(1)} mm (within ${allowableDeflectionMm.toFixed(1)} mm limit).`;

  if (!isSafe) {
    status = 'unsafe';
    statusMessage = `OVERLOAD: Exceeds ${deflectionRatioPercent > 100 ? `deflection allowance (${actualDeflectionMm.toFixed(1)}mm > ${allowableDeflectionMm.toFixed(1)}mm sag)` : `bending stress limit (${actualStressMpa.toFixed(1)} MPa > ${allowableStressMpa} MPa)`}. Base will bow noticeably.`;
  } else if (stressRatioPercent > 80 || deflectionRatioPercent > 80) {
    status = 'marginal';
    statusMessage = `MARGINAL: Loaded to ${Math.max(stressRatioPercent, deflectionRatioPercent)}% of safe design limit. Consider upgrading thickness or adding stiffeners.`;
  }

  // Recommended Thickness Search
  const candidateThicknesses = [1.5, 2.0, 2.5, 3.0, 4.0, 5.0, 6.0, 8.0];
  let recommendedThicknessMm = candidateThicknesses[candidateThicknesses.length - 1];

  for (const candT of candidateThicknesses) {
    const candT_m = candT / 1000;
    const candD = (E_Pa * Math.pow(candT_m, 3)) / (12 * (1 - nu * nu));
    let candStress = 0;
    let candDefl = 0;

    if (supportType === 'perimeter_4_edges') {
      const r = Math.min(3.5, a / b);
      const beta = Math.min(0.125, 0.0479 + 0.046 * Math.pow(r - 1.0, 0.72));
      const alpha = Math.min(0.142, 0.0444 + 0.054 * Math.pow(r - 1.0, 0.82));
      if (loadType === 'uniform_distributed') {
        const q = (payloadKg * 9.80665) / areaM2;
        candStress = ((beta * q * Math.pow(b, 2)) / Math.pow(candT_m, 2)) / 1e6;
        candDefl = ((alpha * q * Math.pow(b, 4)) / candD) * 1000;
      } else {
        const P = payloadKg * 9.80665;
        candStress = (0.48 * (P / Math.pow(candT_m, 2)) * (1 + 1.2 * Math.log(b / Math.max(0.01, 2 * candT_m)))) / 1e6;
        candDefl = ((0.0128 * P * Math.pow(b, 2)) / candD) * 1000;
      }
    } else if (supportType === 'supported_2_edges') {
      if (loadType === 'uniform_distributed') {
        const q = (payloadKg * 9.80665) / areaM2;
        const M = (q * Math.pow(b, 2)) / 8;
        const Z = Math.pow(candT_m, 2) / 6;
        candStress = (M / Z) / 1e6;
        candDefl = ((5 * q * Math.pow(b, 4)) / (384 * candD)) * 1000;
      } else {
        const P = payloadKg * 9.80665;
        const M = (P * b) / (4 * a);
        const Z = Math.pow(candT_m, 2) / 6;
        candStress = (M / Z) / 1e6;
        candDefl = ((P * Math.pow(b, 3)) / (48 * candD * a)) * 1000;
      }
    } else {
      candStress = ((payloadKg * 9.80665) / areaM2) / 1e6;
      candDefl = 0.02;
    }

    if (candStress <= allowableStressMpa * 0.9 && candDefl <= allowableDeflectionMm * 0.9) {
      recommendedThicknessMm = candT;
      break;
    }
  }

  let stiffenerRecommendation = "No ribs needed. Flat plate has adequate stiffness.";
  if (shortMm > 800 || (shortMm > 500 && payloadKg > 80)) {
    stiffenerRecommendation = "Recommend 2x Inverted Top-Hat FRP Ribs (50x30mm) bonded underneath to eliminate bellying.";
  } else if (shortMm > 600 || (shortMm > 400 && payloadKg > 50)) {
    stiffenerRecommendation = "Recommend 1x Central Transverse Stiffener Rib or 30mm perimeter down-turned flange.";
  } else if (supportType === 'supported_2_edges') {
    stiffenerRecommendation = "Add perimeter flange or side lip (≥25mm) along unsupported edges to resist bending.";
  }

  const baseWeightKg = parseFloat((areaM2 * (thicknessMm / 1000) * 1550).toFixed(2));

  return {
    widthMm,
    lengthMm,
    thicknessMm,
    payloadKg,
    supportType,
    loadType,
    reinforcementType,
    actualStressMpa: parseFloat(actualStressMpa.toFixed(1)),
    allowableStressMpa,
    stressRatioPercent,
    actualDeflectionMm: parseFloat(actualDeflectionMm.toFixed(2)),
    allowableDeflectionMm: parseFloat(allowableDeflectionMm.toFixed(1)),
    deflectionRatioPercent,
    maxSafeCapacityKg,
    isSafe,
    status,
    statusMessage,
    recommendedThicknessMm,
    stiffenerRecommendation,
    laminateSchedule,
    baseWeightKg,
  };
}

// Standard BOPET Mylar Carrier Film Rates by Micron Gauge (₹/kg)
export const DEFAULT_MYLAR_RATES_BY_MICRON: Record<number, number> = {
  19: 160,
  25: 165,
  36: 172,
  50: 180,
  75: 188,
  100: 195,
  125: 210,
};

export function getDefaultMylarRateForMicron(micron: number): number {
  const rounded = Math.round(micron);
  if (DEFAULT_MYLAR_RATES_BY_MICRON[rounded] !== undefined) {
    return DEFAULT_MYLAR_RATES_BY_MICRON[rounded];
  }
  if (rounded <= 19) return 160;
  if (rounded <= 25) return 165;
  if (rounded <= 36) return 172;
  if (rounded <= 50) return 180;
  if (rounded <= 75) return 188;
  if (rounded <= 100) return 195;
  return 210;
}

export function getMylarRateForMicron(micron: number, config?: Partial<FRPConfig>): number {
  const rounded = Math.round(micron);
  const savedForMicron = config?.customMylarRatesByMicron?.[rounded];
  if (typeof savedForMicron === 'number' && !Number.isNaN(savedForMicron)) {
    return savedForMicron;
  }
  return getDefaultMylarRateForMicron(rounded);
}

/**
 * Updates 1st (Bottom) and/or 2nd (Top) Mylar micron thickness and automatically
 * fetches the corresponding ₹/kg rate for the selected micron(s).
 */
export function applyMylarMicronChange(
  config: FRPConfig,
  bottomUm?: number,
  topUm?: number
): FRPConfig {
  const nextBottomUm =
    bottomUm !== undefined
      ? bottomUm
      : (config.mylarBottomThicknessUm ?? config.mylarThicknessUm ?? 25);
  const nextTopUm =
    topUm !== undefined
      ? topUm
      : (config.mylarTopThicknessUm ?? config.mylarThicknessUm ?? 100);

  const nextBottomRate =
    bottomUm !== undefined
      ? getMylarRateForMicron(nextBottomUm, config)
      : (config.customBottomMylarRateInrPerKg ?? getMylarRateForMicron(nextBottomUm, config));

  const nextTopRate =
    topUm !== undefined
      ? getMylarRateForMicron(nextTopUm, config)
      : (config.customTopMylarRateInrPerKg ?? getMylarRateForMicron(nextTopUm, config));

  return {
    ...config,
    mylarThicknessUm: nextBottomUm,
    mylarBottomThicknessUm: nextBottomUm,
    mylarTopThicknessUm: nextTopUm,
    customBottomMylarRateInrPerKg: nextBottomRate,
    customMylarRateInrPerKg: nextBottomRate,
    customTopMylarRateInrPerKg: nextTopRate,
  };
}

/**
 * Updates the ₹/kg rate for the active 1st (Bottom) or 2nd (Top) Mylar layer
 * and remembers it in customMylarRatesByMicron so switching microns auto-fetches it later.
 */
export function applyMylarRateChange(
  config: FRPConfig,
  layer: 'bottom' | 'top',
  rate: number
): FRPConfig {
  const currentBottomUm = Math.round(
    config.mylarBottomThicknessUm ?? config.mylarThicknessUm ?? 25
  );
  const currentTopUm = Math.round(
    config.mylarTopThicknessUm ?? config.mylarThicknessUm ?? 100
  );
  const targetUm = layer === 'bottom' ? currentBottomUm : currentTopUm;

  const updatedMicronMap: Record<number, number> = {
    ...(config.customMylarRatesByMicron || {}),
    [targetUm]: rate,
  };

  if (layer === 'bottom') {
    return {
      ...config,
      customBottomMylarRateInrPerKg: rate,
      customMylarRateInrPerKg: rate,
      ...(currentTopUm === currentBottomUm ? { customTopMylarRateInrPerKg: rate } : {}),
      customMylarRatesByMicron: updatedMicronMap,
    };
  }

  return {
    ...config,
    customTopMylarRateInrPerKg: rate,
    ...(currentBottomUm === currentTopUm
      ? { customBottomMylarRateInrPerKg: rate, customMylarRateInrPerKg: rate }
      : {}),
    customMylarRatesByMicron: updatedMicronMap,
  };
}

export function calculateMaterials(config: FRPConfig): MaterialCalculations {
  const lengthM = config.lengthMm / 1000;
  const lengthMarginMm = config.lengthMarginMm ?? 50;
  const rawLengthMm = config.lengthMm + (lengthMarginMm * 2);
  const rawLengthM = rawLengthMm / 1000;
  const ultimateWidthMm = config.widthMm;
  const edgeMarginMm = config.edgeMarginMm ?? 50;

  // Profile stretch factor / draw factor (ratio of unformed flat developed width to formed width)
  // For traditional circular/sinusoidal waves:
  // A standard wave pattern has a profile draw factor of roughly 1.12 to 1.15.
  // Benchmark: To hit a finished width of 4 feet (48" / 1219mm), the required initial flat sheet width is approx. 4.5 feet (54" to 55" / 1372mm to 1397mm).
  // Arc length per pitch for classic 76/18 = ∫₀⁷⁶ √(1 + (dy/dx)²) dx = 85.622mm (85.622 / 76 = 1.1266).
  let profileStretchFactor = 1.0;
  if (config.profile === 'profile_7v') profileStretchFactor = 1440 / 1300; // ~1.1077 (1440mm flat per 1300mm finished width)
  else if (config.profile === 'profile_6v') profileStretchFactor = 1220 / 1070; // ~1.1402 (1220mm flat per 1070mm finished width)
  else if (config.profile === 'trapezoidal_rib') profileStretchFactor = 1250 / 1080; // ~1.1574 (1250mm flat per 1080mm finished width)
  else if (config.profile === 'corrugated_sinusoidal') {
    profileStretchFactor = config.corrugatedDrawFactor ?? (85.622 / 76); // ~1.1266 (user-adjustable between 1.120 and 1.150)
  }
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

  // Fiberglass GSM & Multi-Ply Schedule Resolution
  const plyScheduleBreakdown = resolvePlySchedule(config);
  const firstFiberType = plyScheduleBreakdown[0]?.fiberType || config.fiberType;
  const isHybridPlySchedule = plyScheduleBreakdown.some(
    (p) => p.fiberType !== firstFiberType || p.gsm !== plyScheduleBreakdown[0].gsm
  );

  const totalGlassGsm = plyScheduleBreakdown.reduce((sum, p) => sum + p.gsm, 0);
  const weightedRecResinRatio =
    totalGlassGsm > 0
      ? parseFloat(
          (
            plyScheduleBreakdown.reduce((sum, p) => sum + p.recommendedResinRatio * p.gsm, 0) /
            totalGlassGsm
          ).toFixed(2)
        )
      : 0.67;

  const baseGlassSpec = GLASS_FIBER_SPECS[config.fiberType] || GLASS_FIBER_SPECS['csm_450'];
  const plySummaryText = isHybridPlySchedule
    ? `${plyScheduleBreakdown.length} Plies: ${plyScheduleBreakdown.map((p) => p.shortName.replace(' gsm', '')).join(' + ')} (${totalGlassGsm} GSM)`
    : `${plyScheduleBreakdown.length}× ${plyScheduleBreakdown[0]?.shortName || baseGlassSpec.shortName} (${totalGlassGsm} GSM)`;

  const activeGlassSpec = isHybridPlySchedule
    ? {
        ...baseGlassSpec,
        name: `Hybrid Stack: ${plyScheduleBreakdown.map((p) => p.shortName.replace(' gsm', '')).join(' + ')} (${totalGlassGsm} gsm)`,
        gsmPerLayer: Math.round(totalGlassGsm / Math.max(1, plyScheduleBreakdown.length)),
        recommendedResinRatio: weightedRecResinRatio,
        recommendedResinRatioPercent: Math.round(weightedRecResinRatio * 100),
        resinToGlassRatioText: `${Math.round(weightedRecResinRatio * 100)}:${100 - Math.round(weightedRecResinRatio * 100)} Weighted Hybrid Resin:Glass`,
        weaveStructure: `Multi-Ply Hybrid (${plyScheduleBreakdown.map((p) => p.shortName).join(' / ')})`,
      }
    : baseGlassSpec;

  const totalGlassWeightKg = (totalGlassGsm * effectiveAreaM2) / 1000;
  const polymerMeshGsm = plyScheduleBreakdown
    .filter((p) => p.fiberType === 'polymer_mesh')
    .reduce((sum, p) => sum + p.gsm, 0);
  const printedClothGsm = plyScheduleBreakdown
    .filter((p) => p.fiberType === 'printed_cloth')
    .reduce((sum, p) => sum + p.gsm, 0);
  const glassOnlyGsm = Math.max(0, totalGlassGsm - polymerMeshGsm - printedClothGsm);
  const glassOnlyWeightKg = (glassOnlyGsm * effectiveAreaM2) / 1000;
  const polymerMeshWeightKg = (polymerMeshGsm * effectiveAreaM2) / 1000;
  const polymerMeshWeightGrams = polymerMeshWeightKg * 1000;
  const printedClothWeightKg = (printedClothGsm * effectiveAreaM2) / 1000;
  const printedClothWeightGrams = printedClothWeightKg * 1000;

  // Resin calculation based on glass weight & resin ratio
  // Resin fraction = config.resinToGlassRatio, Glass fraction = (1 - config.resinToGlassRatio)
  const glassRatio = 1 - config.resinToGlassRatio;
  const totalResinWeightKg = (totalGlassWeightKg / glassRatio) * config.resinToGlassRatio;
  // Mineral Filler Calculation (CaCO3, ATH, Silica Powder)
  const fillerType = config.fillerType ?? 'none';
  const fillerPercent = config.fillerPercent ?? 0;
  
  let fillerCostInrKg = 18; // ₹18/kg for Calcium Carbonate
  let fillerDensityGcm3 = 2.71;
  let fillerEffectNote = "Unfilled pure resin matrix. Ideal for maximum optical clarity and translucent roofing.";

  if (fillerType === 'calcium_carbonate') {
    fillerCostInrKg = 18;
    fillerDensityGcm3 = 2.71;
    fillerEffectNote = `Calcium Carbonate (CaCO₃) @ ${fillerPercent}% PHR lowers unit cost significantly by bulking the matrix.`;
  } else if (fillerType === 'ath_flame_retardant') {
    fillerCostInrKg = 55;
    fillerDensityGcm3 = 2.42;
    fillerEffectNote = `Aluminium Trihydrate (ATH) @ ${fillerPercent}% PHR delivers UL94 V-0 flame retardancy & low-smoke release.`;
  } else if (fillerType === 'silica_powder') {
    fillerCostInrKg = 28;
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

  // MEKP Catalyst Weight & Volume (density ~ 1.1 g/ml)
  const catalystWeightGrams = totalResinWeightKg * 1000 * (config.catalystPercent / 100);
  const catalystWeightKg = catalystWeightGrams / 1000;
  const catalystVolumeMl = catalystWeightGrams / 1.1;

  // Cobalt Accelerator/Promoter (Cobalt Octoate/Naphthenate 6%, density ~ 0.96 g/ml)
  const cobaltPercent = config.cobaltPercent !== undefined ? config.cobaltPercent : 0.2;
  const cobaltWeightGrams = totalResinWeightKg * 1000 * (cobaltPercent / 100);
  const cobaltWeightKg = cobaltWeightGrams / 1000;
  const cobaltVolumeMl = cobaltWeightGrams / 0.96;

  // Dual-Layer Mylar Carrier Film Calculations (1st Bottom Layer & Top Layer)
  // BOPET Mylar density = 1.39 g/cm³ => 1 m² of 1 µm thickness weighs 1.39 grams
  const mylarBottomThicknessUm = config.mylarBottomThicknessUm ?? config.mylarThicknessUm ?? 25;
  const mylarTopThicknessUm = config.mylarTopThicknessUm ?? config.mylarThicknessUm ?? 100;
  const maxMylarThicknessUm = Math.max(mylarBottomThicknessUm, mylarTopThicknessUm);
  const mylarSingleSideAreaM2 = (config.mylarWidthMm / 1000) * rawLengthM;
  const mylarTotalAreaM2 = mylarSingleSideAreaM2 * 2;
  const bottomMylarWeightGrams = mylarSingleSideAreaM2 * mylarBottomThicknessUm * 1.39;
  const bottomMylarWeightKg = bottomMylarWeightGrams / 1000;
  const topMylarWeightGrams = mylarSingleSideAreaM2 * mylarTopThicknessUm * 1.39;
  const topMylarWeightKg = topMylarWeightGrams / 1000;
  const totalMylarWeightGrams = bottomMylarWeightGrams + topMylarWeightGrams;
  const totalMylarWeightKg = totalMylarWeightGrams / 1000;

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

  // Styrene Monomer Diluent (0.0% to 10.0% PHR)
  // Commercial unsaturated polyester resins typically contain 35-40 wt% pre-dissolved reactive styrene.
  // Additional pure monomeric styrene lowers liquid viscosity to facilitate rapid fiber bundle wet-out.
  const styreneDiluentPercent = config.styreneDiluentPercent !== undefined ? config.styreneDiluentPercent : 0.0;
  const styreneMonomerWeightKg = totalResinWeightKg * (styreneDiluentPercent / 100);
  const styreneMonomerWeightGrams = styreneMonomerWeightKg * 1000;

  let styreneStatus: 'none' | 'optimal' | 'excessive' = 'none';
  let styreneRecommendation = "Neat base resin (no additional reactive thinning). High viscosity (~600–800 cPs). Requires vigorous compaction rolling to avoid dry fibers.";

  if (styreneDiluentPercent === 0) {
    styreneStatus = 'none';
    styreneRecommendation = "Neat base resin (no additional reactive thinning). High viscosity (~600–800 cPs). Requires vigorous compaction rolling to avoid dry fibers.";
  } else if (styreneDiluentPercent > 5.0) {
    styreneStatus = 'excessive';
    styreneRecommendation = `High styrene dilution (${styreneDiluentPercent}% PHR). Risk of excessive volumetric cure shrinkage (>8%), increased brittle cracking, lower HDT, and VOC emission. Keep ≤ 5.0% PHR.`;
  } else {
    styreneStatus = 'optimal';
    if (ambientTempC < 20) {
      styreneRecommendation = `Winter ambient (${ambientTempC}°C): ${styreneDiluentPercent}% styrene dilution counteracts cold resin thickening, maintaining rapid capillary fiber impregnation.`;
    } else if (ambientTempC > 30) {
      styreneRecommendation = `Warm ambient (${ambientTempC}°C): ${styreneDiluentPercent}% styrene dilution is sufficient. Keep below 3.0% to limit monomer flash-off before Mylar sealing.`;
    }
  }

  // UV Stabilizer System (UVA + HALS synergistic package or single stabilizer)
  const uvStabilizerType = config.uvStabilizerType ?? 'none';
  const defaultUvPercent = uvStabilizerType === 'none' ? 0.0 : (uvStabilizerType === 'synergistic_uva_hals' ? 0.35 : 0.25);
  const uvStabilizerPercent = config.uvStabilizerPercent !== undefined ? config.uvStabilizerPercent : defaultUvPercent;
  const uvStabilizerWeightKg = totalResinWeightKg * (uvStabilizerPercent / 100);
  const uvStabilizerWeightGrams = uvStabilizerWeightKg * 1000;
  const uvStabilizerGrams = uvStabilizerWeightGrams; // for compatibility with receipt generator

  let uvProtectionLevel: 'none' | 'standard' | 'high' | 'maximum' = 'none';
  let uvRecommendation = "";

  if (uvStabilizerType === 'none' || uvStabilizerPercent === 0) {
    uvProtectionLevel = 'none';
    uvRecommendation = "Unstabilized matrix. Direct sunlight exposure causes severe photolytic chalking and yellowing within 12–24 months (ASTM D3841 / ISO 4892 fail).";
  } else if (uvStabilizerType === 'synergistic_uva_hals') {
    uvProtectionLevel = 'maximum';
    uvRecommendation = `Synergistic Dual-Action UVA + HALS (${uvStabilizerPercent}% PHR): Benzotriazole absorbs UV photons (290–380 nm) while HALS catalytically scavenges photolytic free radicals. Extends sheet service life to 20+ years.`;
  } else if (uvStabilizerType === 'benzotriazole_tinuvin_326') {
    uvProtectionLevel = 'high';
    uvRecommendation = `Tinuvin 326 Benzotriazole UVA (${uvStabilizerPercent}% PHR): Excellent initial yellowing protection and optical clarity retention. Converts UV light into harmless thermal vibrations.`;
  } else if (uvStabilizerType === 'hals_tinuvin_770') {
    uvProtectionLevel = 'high';
    uvRecommendation = `Tinuvin 770 HALS (${uvStabilizerPercent}% PHR): Low-volatility sterically hindered amine radical scavenger. Prevents polymer chain microcracking and surface fiber bloom.`;
  } else if (uvStabilizerType === 'cyasorb_uv531') {
    uvProtectionLevel = 'standard';
    uvRecommendation = `Cyasorb UV-531 Benzophenone (${uvStabilizerPercent}% PHR): Economical UV absorber for industrial roofing panels with good polyester matrix compatibility.`;
  }

  // Resin Type Spec
  const activeResinType = config.resinType ?? 'orthophthalic';
  const activeResinSpec = RESIN_SPECS[activeResinType];

  // Yellowing Index (YI) projection over 0, 5, 10, 15, 20 years (ASTM E313 / ASTM D3841)
  const baseResinYiFactor = activeResinType === 'acrylic_modified' ? 0.35 : (activeResinType === 'isophthalic' ? 0.65 : 1.0);
  const uvYiInhibitionFactor = uvStabilizerType === 'synergistic_uva_hals' ? 0.30 : (uvStabilizerType === 'none' ? 1.9 : 0.55);
  const mylarShieldFactor = config.mylarFinish === 'anti_uv' || maxMylarThicknessUm >= 75 ? 0.65 : 1.0;

  const yellowingIndexProjection = {
    year0: parseFloat((2.0 * baseResinYiFactor).toFixed(1)),
    year5: parseFloat((2.0 + 3.0 * baseResinYiFactor * uvYiInhibitionFactor * mylarShieldFactor).toFixed(1)),
    year10: parseFloat((2.0 + 7.5 * baseResinYiFactor * uvYiInhibitionFactor * mylarShieldFactor).toFixed(1)),
    year15: parseFloat((2.0 + 13.0 * baseResinYiFactor * uvYiInhibitionFactor * mylarShieldFactor).toFixed(1)),
    year20: parseFloat((2.0 + 19.0 * baseResinYiFactor * uvYiInhibitionFactor * mylarShieldFactor).toFixed(1)),
  };

  // Pigment Paste Dosing based on Resin Color, Pigment Concentration & Desired Transparency
  let defaultPigment = 0.8;
  let baseColorMaxTransmittance = activeResinSpec.baseTransmittance;

  // Check for RAL Specification Matching
  let activeRalSpec: RalColorSpec | undefined = config.ralCode ? findRalColor(config.ralCode) : undefined;
  if (!activeRalSpec && typeof config.color === 'string' && config.color.startsWith('ral_')) {
    const hue = config.color.replace('ral_', '');
    activeRalSpec = RAL_COLORS.find(c => c.primaryHue === hue);
  }

  if (activeRalSpec) {
    defaultPigment = activeRalSpec.recommendedPigment;
    baseColorMaxTransmittance = Math.min(activeRalSpec.baseTransmittance, activeResinSpec.baseTransmittance);
  } else if (config.color === 'crystal_transparent') { defaultPigment = 0.0; baseColorMaxTransmittance = Math.min(95, activeResinSpec.baseTransmittance); }
  else if (config.color === 'translucent_clear') { defaultPigment = 0.2; baseColorMaxTransmittance = Math.min(90, activeResinSpec.baseTransmittance); }
  else if (config.color === 'sky_blue') { defaultPigment = 0.8; baseColorMaxTransmittance = Math.min(88, activeResinSpec.baseTransmittance); }
  else if (config.color === 'emerald_green') { defaultPigment = 1.0; baseColorMaxTransmittance = Math.min(82, activeResinSpec.baseTransmittance); }
  else if (config.color === 'amber') { defaultPigment = 1.0; baseColorMaxTransmittance = Math.min(84, activeResinSpec.baseTransmittance); }
  else if (config.color === 'opal_white') { defaultPigment = 2.5; baseColorMaxTransmittance = Math.min(65, activeResinSpec.baseTransmittance); }
  else if (config.color === 'carbon_black') { defaultPigment = 3.0; baseColorMaxTransmittance = Math.min(10, activeResinSpec.baseTransmittance); }
  else if (config.color === 'ral_violet') { defaultPigment = 1.0; baseColorMaxTransmittance = Math.min(68, activeResinSpec.baseTransmittance); }
  else if (config.color === 'ral_indigo') { defaultPigment = 1.5; baseColorMaxTransmittance = Math.min(52, activeResinSpec.baseTransmittance); }
  else if (config.color === 'ral_blue') { defaultPigment = 0.8; baseColorMaxTransmittance = Math.min(80, activeResinSpec.baseTransmittance); }
  else if (config.color === 'ral_green') { defaultPigment = 0.8; baseColorMaxTransmittance = Math.min(76, activeResinSpec.baseTransmittance); }
  else if (config.color === 'ral_yellow') { defaultPigment = 0.6; baseColorMaxTransmittance = Math.min(85, activeResinSpec.baseTransmittance); }
  else if (config.color === 'ral_orange') { defaultPigment = 1.0; baseColorMaxTransmittance = Math.min(68, activeResinSpec.baseTransmittance); }
  else if (config.color === 'ral_red') { defaultPigment = 1.5; baseColorMaxTransmittance = Math.min(45, activeResinSpec.baseTransmittance); }
  else if (config.color === 'custom') { defaultPigment = 1.0; baseColorMaxTransmittance = config.customBaseTransmittance ?? Math.min(80, activeResinSpec.baseTransmittance); }

  if (config.customBaseTransmittance !== undefined) {
    baseColorMaxTransmittance = config.customBaseTransmittance;
  }

  const pigmentPercent = config.pigmentPercent !== undefined ? config.pigmentPercent : defaultPigment;

  const pigmentWeightGrams = totalResinWeightKg * 1000 * (pigmentPercent / 100);
  const pigmentWeightKg = pigmentWeightGrams / 1000;

  // Combined cured density
  const densityGcm3 = totalSheetWeightKg / (sheetVolumeCm3 / 1000);

  // Cost estimates & Custom Rate Overrides (All Raw Material & Labor Rates in ₹/kg)
  const activeResinRateInrPerKg = config.customResinRateInrPerKg ?? activeResinSpec.costPerKgInr;
  const activeGlassRateInrPerKg = config.customGlassRateInrPerKg ?? 235;
  const activePolymerMeshRateInrPerKg = config.customPolymerMeshRateInrPerKg ?? 320;
  const activePrintedClothRateInrPerKg = config.customPrintedClothRateInrPerKg ?? 480;
  const activeFillerRateInrPerKg = config.customFillerRateInrPerKg ?? fillerCostInrKg;
  const activeCatalystRateInrPerKg = config.customCatalystRateInrPerKg ?? 610;
  const activeCobaltRateInrPerKg = config.customCobaltRateInrPerKg ?? 885;
  const activePigmentRateInrPerKg = config.customPigmentRateInrPerKg ?? 450;
  const activeStyreneRateInrPerKg = config.customStyreneRateInrPerKg ?? 145;
  const activeUvRateInrPerKg = config.customUvRateInrPerKg ?? 1800;

  // Separate Mylar Carrier Film Rates for 1st/Bottom Layer (e.g. 25µm: ₹165/kg) and Top Layer (e.g. 100µm: ₹195/kg)
  // Auto-fetches rate by selected micron thickness from per-micron custom map or standard micron table
  const defaultBottomMylarRate = getMylarRateForMicron(mylarBottomThicknessUm, config);
  const defaultTopMylarRate = getMylarRateForMicron(mylarTopThicknessUm, config);
  const activeBottomMylarRateInrPerKg =
    config.customMylarRatesByMicron?.[Math.round(mylarBottomThicknessUm)] ??
    config.customBottomMylarRateInrPerKg ??
    config.customMylarRateInrPerKg ??
    defaultBottomMylarRate;
  const activeTopMylarRateInrPerKg =
    config.customMylarRatesByMicron?.[Math.round(mylarTopThicknessUm)] ??
    config.customTopMylarRateInrPerKg ??
    defaultTopMylarRate;

  // Thickness-based FRP Sheet Installation Labor Rate Tiers (₹/kg):
  // - Up to 1 mm: ₹30/kg
  // - 1.1 mm to 1.5 mm: ₹23/kg
  // - 1.5 mm and above: ₹17/kg
  const activeLaborRateUpTo1mmInrPerKg = config.customLaborRateUpTo1mmInrPerKg ?? 30;
  const activeLaborRate1_1To1_5mmInrPerKg = config.customLaborRate1_1To1_5mmInrPerKg ?? 23;
  const activeLaborRateAbove1_5mmInrPerKg = config.customLaborRateAbove1_5mmInrPerKg ?? 17;

  let activeLaborTierId: LaborRateTierId = '1_5mm_and_above';
  if (config.laborRateTierOverride && config.laborRateTierOverride !== 'auto') {
    activeLaborTierId = config.laborRateTierOverride;
  } else if (config.thicknessMm <= 1.0) {
    activeLaborTierId = 'up_to_1mm';
  } else if (config.thicknessMm <= 1.5) {
    activeLaborTierId = '1_1_to_1_5mm';
  } else {
    activeLaborTierId = '1_5mm_and_above';
  }

  const tierDefaultLaborRateInrPerKg =
    activeLaborTierId === 'up_to_1mm'
      ? activeLaborRateUpTo1mmInrPerKg
      : activeLaborTierId === '1_1_to_1_5mm'
      ? activeLaborRate1_1To1_5mmInrPerKg
      : activeLaborRateAbove1_5mmInrPerKg;

  const activeLaborRateInrPerKg = config.customLaborRateInrPerKg ?? tierDefaultLaborRateInrPerKg;

  const activeLaborTierLabel =
    activeLaborTierId === 'up_to_1mm'
      ? `Up to 1 mm (₹${activeLaborRateInrPerKg}/kg)`
      : activeLaborTierId === '1_1_to_1_5mm'
      ? `1.1 mm to 1.5 mm (₹${activeLaborRateInrPerKg}/kg)`
      : `1.5 mm and above (₹${activeLaborRateInrPerKg}/kg)`;

  const activeGstPercent = config.customGstPercent ?? 18;
  const activeProfitMarginPercent = config.customProfitMarginPercent ?? 0;

  // Itemized Costs (Every single component calculated via Weight in kg × Rate in ₹/kg)
  const resinCostInr = totalResinWeightKg * activeResinRateInrPerKg;
  const glassCostInr = glassOnlyWeightKg * activeGlassRateInrPerKg;
  const polymerMeshCostInr = polymerMeshWeightKg * activePolymerMeshRateInrPerKg;
  const printedClothCostInr = printedClothWeightKg * activePrintedClothRateInrPerKg;
  const fillerCostInr = fillerWeightKg * activeFillerRateInrPerKg;
  const catalystCostInr = catalystWeightKg * activeCatalystRateInrPerKg;
  const cobaltCostInr = cobaltWeightKg * activeCobaltRateInrPerKg;
  const pigmentCostInr = pigmentWeightKg * activePigmentRateInrPerKg;
  const styreneCostInr = styreneMonomerWeightKg * activeStyreneRateInrPerKg;
  const uvCostInr = uvStabilizerWeightKg * activeUvRateInrPerKg;
  const bottomMylarCostInr = bottomMylarWeightKg * activeBottomMylarRateInrPerKg;
  const topMylarCostInr = topMylarWeightKg * activeTopMylarRateInrPerKg;
  const mylarCostInr = bottomMylarCostInr + topMylarCostInr;
  const activeMylarRateInrPerKg =
    totalMylarWeightKg > 0 ? Math.round(mylarCostInr / totalMylarWeightKg) : activeBottomMylarRateInrPerKg;
  const laborEnergyCostInr = totalSheetWeightKg * activeLaborRateInrPerKg;

  // Legacy equivalent values for backward compatibility
  const activeCatalystRateInrPerLiter = Math.round(activeCatalystRateInrPerKg * 1.1);
  const activeCobaltRateInrPerLiter = Math.round(activeCobaltRateInrPerKg * 0.96);
  const activeMylarRateInrPerM2 = mylarTotalAreaM2 > 0 ? Math.round(mylarCostInr / mylarTotalAreaM2) : 30;
  const activeLaborRateInrPerSheet = Math.round(totalSheetWeightKg * activeLaborRateInrPerKg);

  const baseCostInr =
    resinCostInr +
    glassCostInr +
    polymerMeshCostInr +
    printedClothCostInr +
    fillerCostInr +
    catalystCostInr +
    cobaltCostInr +
    pigmentCostInr +
    styreneCostInr +
    uvCostInr +
    mylarCostInr +
    laborEnergyCostInr;
  const profitAmountInr = baseCostInr * (activeProfitMarginPercent / 100);
  const exFactoryCostInr = baseCostInr + profitAmountInr;
  const estimatedCostInr = exFactoryCostInr;

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

  // Mechanical properties: Resin type, multi-ply schedule & filler additions modify modulus (rigidity)
  let weightedBaseModulusGpa = 0;
  for (const ply of plyScheduleBreakdown) {
    let plyModulus = 8.5;
    if (ply.fiberType.includes('woven')) plyModulus = 14.2;
    else if (ply.fiberType.includes('multiaxial')) plyModulus = 18.5;
    else if (ply.fiberType === 'polymer_mesh') plyModulus = 9.2;
    else if (ply.fiberType === 'printed_cloth') plyModulus = 7.2;
    else if (ply.fiberType === 'surface_veil_30') plyModulus = 6.5;
    weightedBaseModulusGpa += plyModulus * (ply.gsm / Math.max(1, totalGlassGsm));
  }
  let flexuralStiffnessGpa = (weightedBaseModulusGpa || 8.5) * activeResinSpec.stiffnessMultiplier;
  if (plyScheduleBreakdown.length > 2) flexuralStiffnessGpa *= 1.35;
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
  const mylarLabelStr = mylarBottomThicknessUm !== mylarTopThicknessUm
    ? `1st ${mylarBottomThicknessUm}µm + Top ${mylarTopThicknessUm}µm BOPET Mylar Film`
    : `${mylarBottomThicknessUm}µm UV-Stabilized Mylar Carrier Film`;
  let uvProtectionType = mylarLabelStr;
  let uvDegradationResistance = "Standard UV-2 Weather Grade (ISO 4892)";

  if (uvStabilizerType === 'synergistic_uva_hals') {
    uvProtectionBonusYears += 4;
    uvProtectionType += " + Synergistic Dual UVA/HALS Matrix (Tinuvin Package)";
    uvDegradationResistance = "Extreme UV-5 Weathering Class (4000 hr QUV Passed)";
  } else if (uvStabilizerType === 'benzotriazole_tinuvin_326' || uvStabilizerType === 'hals_tinuvin_770') {
    uvProtectionBonusYears += 2;
    uvProtectionType += ` + High Performance ${uvStabilizerType === 'benzotriazole_tinuvin_326' ? 'UVA Benzotriazole' : 'HALS Radical Scavenger'}`;
    uvDegradationResistance = "High UV-4 Commercial Roof Grade";
  } else if (uvStabilizerType === 'none') {
    uvProtectionBonusYears = Math.max(0, uvProtectionBonusYears - 2);
    uvDegradationResistance = "Unstabilized UV-1 Indoor Grade Only";
  }

  const step1 = config.step1Method || '';
  const step5 = config.step5Method || '';
  const hasGelcoat = step1.includes('gelcoat') || step5.includes('gelcoat');

  if (hasGelcoat) {
    uvProtectionBonusYears += 3;
    uvProtectionType = "Isophthalic Neopentyl Glycol (NPG) Gelcoat + UV Absorber";
    uvDegradationResistance = "Extreme UV-5 Outdoor Weathering Class (4000 hr QUV Passed)";
  } else if (maxMylarThicknessUm >= 50) {
    uvProtectionBonusYears += 2;
    uvProtectionType = `${mylarLabelStr} (Heavy Duty Weather-Shield)`;
    uvDegradationResistance = "High UV-4 Commercial Roof Grade";
  } else if (maxMylarThicknessUm >= 30) {
    uvProtectionBonusYears += 1;
    uvProtectionType = `${mylarLabelStr} (UV-Inhibited PET Coating)`;
    uvDegradationResistance = "Enhanced UV-3 Weather Resistance Class";
  }

  // Thickness Structural Durability Factor
  let thicknessBonusYears = 0;
  if (config.thicknessMm >= 2.5) thicknessBonusYears = 4;
  else if (config.thicknessMm >= 1.8) thicknessBonusYears = 2;
  else if (config.thicknessMm < 1.2) thicknessBonusYears = -2;

  // Glass Fiber Reinforcement Structural Toughness
  let fiberReinforcementBonusYears = 0;
  const hasHighStrengthPly = plyScheduleBreakdown.some(
    (p) => p.fiberType.includes('woven') || p.fiberType.includes('multiaxial')
  );
  const hasSurfaceVeil = plyScheduleBreakdown.some((p) => p.fiberType === 'surface_veil_30');
  if (hasHighStrengthPly) {
    fiberReinforcementBonusYears = 3;
  } else if (plyScheduleBreakdown.length >= 3) {
    fiberReinforcementBonusYears = 2;
  }
  if (hasSurfaceVeil) {
    fiberReinforcementBonusYears += 2; // C-glass veil prevents fiber bloom & surface weathering
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
    catalystWeightGrams: parseFloat(catalystWeightGrams.toFixed(1)),
    catalystWeightKg: parseFloat(catalystWeightKg.toFixed(3)),
    cobaltPercent,
    cobaltWeightGrams: parseFloat(cobaltWeightGrams.toFixed(1)),
    cobaltWeightKg: parseFloat(cobaltWeightKg.toFixed(4)),
    cobaltVolumeMl: parseFloat(cobaltVolumeMl.toFixed(1)),
    // Mylar Dual-Layer Specifications
    mylarBottomThicknessUm,
    mylarTopThicknessUm,
    mylarSingleSideAreaM2: parseFloat(mylarSingleSideAreaM2.toFixed(2)),
    mylarTotalAreaM2: parseFloat(mylarTotalAreaM2.toFixed(2)),
    bottomMylarWeightGrams: parseFloat(bottomMylarWeightGrams.toFixed(1)),
    bottomMylarWeightKg: parseFloat(bottomMylarWeightKg.toFixed(3)),
    topMylarWeightGrams: parseFloat(topMylarWeightGrams.toFixed(1)),
    topMylarWeightKg: parseFloat(topMylarWeightKg.toFixed(3)),
    totalMylarWeightGrams: parseFloat(totalMylarWeightGrams.toFixed(1)),
    totalMylarWeightKg: parseFloat(totalMylarWeightKg.toFixed(3)),
    bottomMylarCostInr: Math.round(bottomMylarCostInr),
    topMylarCostInr: Math.round(topMylarCostInr),
    ambientTempC,
    estimatedGelTimeMin,
    cobaltRecommendation,
    ambientCureStatus,
    fillerType,
    fillerPercent,
    fillerWeightKg: parseFloat(fillerWeightKg.toFixed(2)),
    fillerWeightGrams: parseFloat(fillerWeightGrams.toFixed(1)),
    fillerCostInrKg,
    fillerEffectNote,
    // Styrene Reactive Diluent Monomer
    styreneDiluentPercent,
    styreneMonomerWeightKg: parseFloat(styreneMonomerWeightKg.toFixed(2)),
    styreneMonomerWeightGrams: parseFloat(styreneMonomerWeightGrams.toFixed(1)),
    styreneRecommendation,
    styreneStatus,
    // UV Stabilizer Protection System
    uvStabilizerType,
    uvStabilizerPercent,
    uvStabilizerWeightGrams: parseFloat(uvStabilizerWeightGrams.toFixed(1)),
    uvStabilizerWeightKg: parseFloat(uvStabilizerWeightKg.toFixed(3)),
    uvStabilizerGrams: parseFloat(uvStabilizerWeightGrams.toFixed(1)),
    uvRecommendation,
    uvProtectionLevel,
    yellowingIndexProjection,
    pigmentPercent,
    pigmentWeightGrams: parseFloat(pigmentWeightGrams.toFixed(1)),
    pigmentWeightKg: parseFloat(pigmentWeightKg.toFixed(3)),
    resinVolumeLiters,
    densityGcm3: parseFloat(densityGcm3.toFixed(2)),
    estimatedCostInr: parseFloat(estimatedCostInr.toFixed(2)),
    pricePerM2Inr: Math.round(pricePerM2Inr),
    pricePerSqFtInr: parseFloat(pricePerSqFtInr.toFixed(1)),
    pricePerKgInr: Math.round(pricePerKgInr),
    gstAmountInr: Math.round(gstAmountInr),
    totalCostWithGstInr: Math.round(totalCostWithGstInr),
    // Active Rate Details (All in ₹/kg including Labor)
    activeResinRateInrPerKg,
    activeGlassRateInrPerKg,
    activePolymerMeshRateInrPerKg,
    activePrintedClothRateInrPerKg,
    activeFillerRateInrPerKg,
    activeCatalystRateInrPerKg,
    activeCobaltRateInrPerKg,
    activePigmentRateInrPerKg,
    activeStyreneRateInrPerKg,
    activeUvRateInrPerKg,
    activeMylarRateInrPerKg,
    activeBottomMylarRateInrPerKg,
    activeTopMylarRateInrPerKg,
    activeLaborRateInrPerKg,
    activeLaborTierId,
    activeLaborTierLabel,
    activeLaborRateUpTo1mmInrPerKg,
    activeLaborRate1_1To1_5mmInrPerKg,
    activeLaborRateAbove1_5mmInrPerKg,
    polymerMeshWeightKg: parseFloat(polymerMeshWeightKg.toFixed(3)),
    polymerMeshWeightGrams: parseFloat(polymerMeshWeightGrams.toFixed(1)),
    printedClothWeightKg: parseFloat(printedClothWeightKg.toFixed(3)),
    printedClothWeightGrams: parseFloat(printedClothWeightGrams.toFixed(1)),
    activeCatalystRateInrPerLiter,
    activeCobaltRateInrPerLiter,
    activeMylarRateInrPerM2,
    activeLaborRateInrPerSheet,
    activeGstPercent,
    activeProfitMarginPercent,
    // Itemized Costs
    resinCostInr: Math.round(resinCostInr),
    glassCostInr: Math.round(glassCostInr),
    polymerMeshCostInr: Math.round(polymerMeshCostInr),
    printedClothCostInr: Math.round(printedClothCostInr),
    fillerCostInr: Math.round(fillerCostInr),
    catalystCostInr: Math.round(catalystCostInr),
    cobaltCostInr: Math.round(cobaltCostInr),
    pigmentCostInr: Math.round(pigmentCostInr),
    styreneCostInr: Math.round(styreneCostInr),
    uvCostInr: Math.round(uvCostInr),
    mylarCostInr: Math.round(mylarCostInr),
    laborEnergyCostInr: Math.round(laborEnergyCostInr),
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
    ralSpec: activeRalSpec
      ? {
          code: activeRalSpec.code,
          name: activeRalSpec.name,
          primaryHue: activeRalSpec.primaryHue,
          hueLabel: activeRalSpec.hueLabel,
          hex: activeRalSpec.hex,
          bisCode: activeRalSpec.bisCode,
          description: activeRalSpec.description,
        }
      : undefined,
    resinTypeSpec: {
      typeKey: activeResinSpec.typeKey,
      name: activeResinSpec.name,
      baseTransmittance: activeResinSpec.baseTransmittance,
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
    plyScheduleBreakdown,
    isHybridPlySchedule,
    plySummaryText,
    structuralLoad: calculateStructuralLoadCapacity(config, flexuralStiffnessGpa),
  };
}

export function getResinHexColor(color: FRPConfig['color'], customHex?: string): number {
  if (customHex) {
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
    case 'ral_blue':
      return 0x2271b3; // RAL 5015 Sky Blue
    case 'opal_white':
      return 0xf8fafc; // milky white
    case 'emerald_green':
    case 'ral_green':
      return 0x57a639; // RAL 6018 Yellow Green
    case 'amber':
      return 0xf59e0b; // amber yellow
    case 'carbon_black':
      return 0x1e293b; // slate dark
    case 'ral_violet':
      return 0x904684; // RAL 4008 Signal Violet
    case 'ral_indigo':
      return 0x20214f; // RAL 5002 Ultramarine Blue (Indigo)
    case 'ral_yellow':
      return 0xf8f32b; // RAL 1018 Zinc Yellow
    case 'ral_orange':
      return 0xe25303; // RAL 2004 Pure Orange
    case 'ral_red':
      return 0xcc0605; // RAL 3020 Traffic Red
    case 'custom':
      return customHex ? parseInt(customHex.replace('#', ''), 16) || 0x8b5cf6 : 0x8b5cf6;
    default:
      return 0x38bdf8;
  }
}
