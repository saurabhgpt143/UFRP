export type PrimaryHue = 'violet' | 'indigo' | 'blue' | 'green' | 'yellow' | 'orange' | 'red';

export interface PrimaryMixRatio {
  violet: number;   // %
  indigo: number;   // %
  blue: number;     // %
  green: number;    // %
  yellow: number;   // %
  orange: number;   // %
  red: number;      // %
  white: number;    // % (Rutile TiO2)
  black: number;    // % (Furnace Carbon Black)
  pigmentChemistry: string; // e.g. "Quinacridone Violet + Rutile TiO2 + DPP Red"
  cielab: { L: number; a: number; b: number };
  cureAdjustmentNote: string;
}

export interface RalColorSpec {
  code: string;               // e.g. "RAL 4008"
  name: string;               // e.g. "Signal Violet"
  primaryHue: PrimaryHue;
  hueLabel: string;           // e.g. "Violet"
  hex: string;                // e.g. "#904684"
  baseTransmittance: number;  // Optical light pass % (unpigmented base matrix)
  recommendedPigment: number; // phr (parts per hundred resin)
  colorId: string;            // Unique identifier
  description: string;
  typicalApplication: string;
  bisCode: string;            // IS 12866 fastness rating
  mixRatio: PrimaryMixRatio;  // Formulation breakdown based on primary hues
}

export const PRIMARY_HUES: {
  id: PrimaryHue;
  label: string;
  wavelengthNm: string;
  accentClass: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  description: string;
}[] = [
  {
    id: 'violet',
    label: 'Violet',
    wavelengthNm: '380 – 420 nm',
    accentClass: 'accent-purple-500',
    bgClass: 'bg-purple-950/60',
    borderClass: 'border-purple-500/40',
    textClass: 'text-purple-300',
    description: 'High energy short-wave hue. Excellent for distinctive architectural accents, skylight canopies, and hazard demarcation.',
  },
  {
    id: 'indigo',
    label: 'Indigo',
    wavelengthNm: '420 – 450 nm',
    accentClass: 'accent-indigo-500',
    bgClass: 'bg-indigo-950/60',
    borderClass: 'border-indigo-500/40',
    textClass: 'text-indigo-300',
    description: 'Deep royal and ultramarine shade. Delivers dignified solar shade screening with controlled glare reduction.',
  },
  {
    id: 'blue',
    label: 'Blue',
    wavelengthNm: '450 – 495 nm',
    accentClass: 'accent-blue-500',
    bgClass: 'bg-blue-950/60',
    borderClass: 'border-blue-500/40',
    textClass: 'text-blue-300',
    description: 'The standard industrial daylighting hue. Enhances ambient coolness while transmitting ample diffused daylight.',
  },
  {
    id: 'green',
    label: 'Green',
    wavelengthNm: '495 – 570 nm',
    accentClass: 'accent-emerald-500',
    bgClass: 'bg-emerald-950/60',
    borderClass: 'border-emerald-500/40',
    textClass: 'text-emerald-300',
    description: 'Human eye peak sensitivity band. Ideal for agricultural nurseries, botanical greenhouses, and sports canopies.',
  },
  {
    id: 'yellow',
    label: 'Yellow',
    wavelengthNm: '570 – 590 nm',
    accentClass: 'accent-amber-400',
    bgClass: 'bg-amber-950/60',
    borderClass: 'border-amber-500/40',
    textClass: 'text-amber-300',
    description: 'Maximum luminosity transmittance. Popular for bright factory interiors, railway platform sheds, and walkways.',
  },
  {
    id: 'orange',
    label: 'Orange',
    wavelengthNm: '590 – 620 nm',
    accentClass: 'accent-orange-500',
    bgClass: 'bg-orange-950/60',
    borderClass: 'border-orange-500/40',
    textClass: 'text-orange-300',
    description: 'Warm solar spectrum filter. Blocks high-frequency glare while infusing warm diffused illumination.',
  },
  {
    id: 'red',
    label: 'Red',
    wavelengthNm: '620 – 750 nm',
    accentClass: 'accent-rose-500',
    bgClass: 'bg-rose-950/60',
    borderClass: 'border-rose-500/40',
    textClass: 'text-rose-300',
    description: 'Maximum wavelength long-wave hue. Specified for fire hazard sheds, safety canopies, and architectural identity.',
  },
];

export const RAL_COLORS: RalColorSpec[] = [
  // 1. VIOLET HUES (RAL 4000 series)
  {
    code: 'RAL 4008',
    name: 'Signal Violet',
    primaryHue: 'violet',
    hueLabel: 'Violet',
    hex: '#904684',
    baseTransmittance: 68,
    recommendedPigment: 1.0,
    colorId: 'ral_violet_4008',
    description: 'Vibrant, high-contrast violet formulated with stable quinacridone violet pigment paste.',
    typicalApplication: 'Architectural Feature Canopies, Airport Terminals, Creative Studio Skylights',
    bisCode: 'IS 12866 Grade 5 Fastness',
    mixRatio: {
      violet: 82,
      indigo: 0,
      blue: 0,
      green: 0,
      yellow: 0,
      orange: 0,
      red: 6,
      white: 12,
      black: 0,
      pigmentChemistry: 'Quinacridone Violet (PV19) + DPP Red (PR254) + Rutile TiO2 (PW6)',
      cielab: { L: 38.5, a: 39.8, b: -18.2 },
      cureAdjustmentNote: 'Peroxide stable. Zero cobalt inhibition; maintains normal gel time (14–16 min).'
    }
  },
  {
    code: 'RAL 4005',
    name: 'Blue Lilac',
    primaryHue: 'violet',
    hueLabel: 'Violet',
    hex: '#6c4675',
    baseTransmittance: 62,
    recommendedPigment: 1.2,
    colorId: 'ral_violet_4005',
    description: 'Cool blue-undertone lilac with high UV stabilization and balanced daylight diffusion.',
    typicalApplication: 'Commercial Walkway Canopies, Exhibition Halls, Botanical Sunscreens',
    bisCode: 'IS 12866 Grade 5 Fastness',
    mixRatio: {
      violet: 70,
      indigo: 0,
      blue: 15,
      green: 0,
      yellow: 0,
      orange: 0,
      red: 0,
      white: 15,
      black: 0,
      pigmentChemistry: 'Quinacridone Violet (PV19) + Phthalo Blue (PB15:3) + Rutile TiO2 (PW6)',
      cielab: { L: 34.2, a: 24.1, b: -20.6 },
      cureAdjustmentNote: 'Slight cobalt promotion synergy from trace copper in phthalo blue; gel window -1 min.'
    }
  },
  {
    code: 'RAL 4001',
    name: 'Red Lilac',
    primaryHue: 'violet',
    hueLabel: 'Violet',
    hex: '#865e79',
    baseTransmittance: 65,
    recommendedPigment: 1.0,
    colorId: 'ral_violet_4001',
    description: 'Soft warm lilac delivering comfortable diffused solar lighting without color harshness.',
    typicalApplication: 'Decorative Skylights, Pergola Roofing, Residential Carports',
    bisCode: 'IS 12866 Grade 4 Fastness',
    mixRatio: {
      violet: 60,
      indigo: 0,
      blue: 0,
      green: 0,
      yellow: 0,
      orange: 0,
      red: 25,
      white: 15,
      black: 0,
      pigmentChemistry: 'Carbazole Violet (PV23) + Quinacridone Magenta (PR122) + Rutile TiO2 (PW6)',
      cielab: { L: 43.1, a: 22.3, b: -8.9 },
      cureAdjustmentNote: 'Peroxide stable; neutral effect on MEKP decomposition kinetics.'
    }
  },

  // 2. INDIGO HUES (Deep Blues / Violet Blues - RAL 5000 series)
  {
    code: 'RAL 5002',
    name: 'Ultramarine Blue (Indigo)',
    primaryHue: 'indigo',
    hueLabel: 'Indigo',
    hex: '#20214f',
    baseTransmittance: 52,
    recommendedPigment: 1.5,
    colorId: 'ral_indigo_5002',
    description: 'Deep, rich classic indigo shade based on high-purity copper phthalocyanine blue paste.',
    typicalApplication: 'Heavy Industrial Glare-Control Roofs, Power Plant Cladding, Marine Canopies',
    bisCode: 'IS 12866 Grade 6 Maximum Fastness',
    mixRatio: {
      violet: 6,
      indigo: 78,
      blue: 14,
      green: 0,
      yellow: 0,
      orange: 0,
      red: 0,
      white: 0,
      black: 2,
      pigmentChemistry: 'Indanthrone Blue (PB60) + Cu-Phthalocyanine (PB15:1) + Carbon Black (PBk7)',
      cielab: { L: 20.8, a: 8.7, b: -33.4 },
      cureAdjustmentNote: 'High optical density; slight radical scavenging from carbon black (+5% cobalt recommended).'
    }
  },
  {
    code: 'RAL 5022',
    name: 'Night Blue',
    primaryHue: 'indigo',
    hueLabel: 'Indigo',
    hex: '#252839',
    baseTransmittance: 42,
    recommendedPigment: 1.8,
    colorId: 'ral_indigo_5022',
    description: 'Midnight indigo offering maximum shade density and glare reduction for tropical climates.',
    typicalApplication: 'High-Temperature Smelters, Foundry Daylighting, Privacy Partitions',
    bisCode: 'IS 12866 Grade 6 Maximum Fastness',
    mixRatio: {
      violet: 6,
      indigo: 72,
      blue: 10,
      green: 0,
      yellow: 0,
      orange: 0,
      red: 0,
      white: 0,
      black: 12,
      pigmentChemistry: 'Indanthrone Blue (PB60) + Phthalo Blue + Furnace Carbon Black (PBk7)',
      cielab: { L: 17.5, a: 2.1, b: -15.8 },
      cureAdjustmentNote: 'Carbon black slows MEKP free-radical propagation; increase cobalt promoter by 0.05% PHR.'
    }
  },
  {
    code: 'RAL 5000',
    name: 'Violet Blue',
    primaryHue: 'indigo',
    hueLabel: 'Indigo',
    hex: '#354764',
    baseTransmittance: 58,
    recommendedPigment: 1.2,
    colorId: 'ral_indigo_5000',
    description: 'Sophisticated bridge between violet and navy blue with excellent thermal reflection.',
    typicalApplication: 'Corporate Atrium Skylights, Metro Rail Station Roofs',
    bisCode: 'IS 12866 Grade 5 Fastness',
    mixRatio: {
      violet: 10,
      indigo: 60,
      blue: 25,
      green: 0,
      yellow: 0,
      orange: 0,
      red: 0,
      white: 5,
      black: 0,
      pigmentChemistry: 'Cu-Phthalo Blue (PB15:2) + Carbazole Violet (PV23) + Rutile TiO2 (PW6)',
      cielab: { L: 31.2, a: -1.2, b: -21.4 },
      cureAdjustmentNote: 'Neutral crosslink impact; excellent thermal stability in continuous tunnel cure.'
    }
  },

  // 3. BLUE HUES (RAL 5000 series)
  {
    code: 'RAL 5015',
    name: 'Sky Blue',
    primaryHue: 'blue',
    hueLabel: 'Blue',
    hex: '#2271b3',
    baseTransmittance: 80,
    recommendedPigment: 0.8,
    colorId: 'ral_blue_5015',
    description: 'The industry-standard translucent blue daylighting color for commercial factory sheds.',
    typicalApplication: 'Factory Shed Daylighting, Warehouse Corrugated Strips, Sports Arenas',
    bisCode: 'IS 12866 Grade 6 Maximum Fastness',
    mixRatio: {
      violet: 0,
      indigo: 0,
      blue: 85,
      green: 3,
      yellow: 0,
      orange: 0,
      red: 0,
      white: 12,
      black: 0,
      pigmentChemistry: 'Cu-Phthalocyanine Beta Blue (PB15:3) + Rutile TiO2 (PW6) + Phthalo Green (PG7)',
      cielab: { L: 47.3, a: -12.4, b: -38.6 },
      cureAdjustmentNote: 'Phthalo copper ion complexes slightly stabilize radicals; maintain standard catalyst ratio.'
    }
  },
  {
    code: 'RAL 5012',
    name: 'Light Blue',
    primaryHue: 'blue',
    hueLabel: 'Blue',
    hex: '#2b73b0',
    baseTransmittance: 82,
    recommendedPigment: 0.6,
    colorId: 'ral_blue_5012',
    description: 'Crisp azure blue providing cool, refreshing natural illumination under intense sunshine.',
    typicalApplication: 'Coastal Storage Sheds, Waterpark Canopies, School Walkways',
    bisCode: 'IS 12866 Grade 6 Maximum Fastness',
    mixRatio: {
      violet: 0,
      indigo: 0,
      blue: 75,
      green: 3,
      yellow: 0,
      orange: 0,
      red: 0,
      white: 22,
      black: 0,
      pigmentChemistry: 'Phthalo Blue (PB15:3) + Rutile TiO2 (PW6) + Trace Phthalo Green (PG7)',
      cielab: { L: 51.6, a: -14.9, b: -34.8 },
      cureAdjustmentNote: 'High white tint-tone; excellent resin flow and zero air entrapment.'
    }
  },
  {
    code: 'RAL 5017',
    name: 'Traffic Blue',
    primaryHue: 'blue',
    hueLabel: 'Blue',
    hex: '#063971',
    baseTransmittance: 60,
    recommendedPigment: 1.4,
    colorId: 'ral_blue_5017',
    description: 'High-opacity bold blue for heavy structural cladding and brand identity roofing.',
    typicalApplication: 'Logistics Hubs, Tata / JSW Industrial Shed Accents, Bus Terminal Canopies',
    bisCode: 'IS 12866 Grade 6 Maximum Fastness',
    mixRatio: {
      violet: 0,
      indigo: 4,
      blue: 90,
      green: 0,
      yellow: 0,
      orange: 0,
      red: 0,
      white: 2,
      black: 4,
      pigmentChemistry: 'Alpha-Cu Phthalocyanine Blue (PB15:1) + Carbon Black + TiO2',
      cielab: { L: 26.5, a: -1.8, b: -33.9 },
      cureAdjustmentNote: 'Dense mass tone; adjust promoter if ambient temperature drops below 20°C.'
    }
  },

  // 4. GREEN HUES (RAL 6000 series)
  {
    code: 'RAL 6018',
    name: 'Yellow Green',
    primaryHue: 'green',
    hueLabel: 'Green',
    hex: '#57a639',
    baseTransmittance: 76,
    recommendedPigment: 0.8,
    colorId: 'ral_green_6018',
    description: 'Vibrant spring green matching human ocular sensitivity for peak visual comfort.',
    typicalApplication: 'Horticulture Greenhouses, Farm Sheds, Eco-Park Visitor Shelters',
    bisCode: 'IS 12866 Grade 5 Fastness',
    mixRatio: {
      violet: 0,
      indigo: 0,
      blue: 0,
      green: 62,
      yellow: 32,
      orange: 0,
      red: 0,
      white: 6,
      black: 0,
      pigmentChemistry: 'Phthalocyanine Green G (PG7) + Bismuth Vanadate (PY184) + Rutile TiO2',
      cielab: { L: 61.4, a: -35.2, b: 42.1 },
      cureAdjustmentNote: 'Bismuth vanadate is inert to free radicals; normal peak exotherm observed.'
    }
  },
  {
    code: 'RAL 6029',
    name: 'Mint Green',
    primaryHue: 'green',
    hueLabel: 'Green',
    hex: '#20603d',
    baseTransmittance: 70,
    recommendedPigment: 1.0,
    colorId: 'ral_green_6029',
    description: 'Refined emerald green with superior chlorophyll-favorable PAR light filtering.',
    typicalApplication: 'Commercial Greenhouses, Nursery Roofs, Swimming Pool Enclosures',
    bisCode: 'IS 12866 Grade 5 Fastness',
    mixRatio: {
      violet: 0,
      indigo: 0,
      blue: 12,
      green: 75,
      yellow: 8,
      orange: 0,
      red: 0,
      white: 5,
      black: 0,
      pigmentChemistry: 'Polychloro-Cu-Phthalocyanine (PG7) + Phthalo Blue + Diarylide Yellow (PY83)',
      cielab: { L: 38.6, a: -34.8, b: 14.2 },
      cureAdjustmentNote: 'Very stable photo-oxidation resistance. Ideal with UV absorbers.'
    }
  },
  {
    code: 'RAL 6005',
    name: 'Moss Green',
    primaryHue: 'green',
    hueLabel: 'Green',
    hex: '#2f4538',
    baseTransmittance: 50,
    recommendedPigment: 1.6,
    colorId: 'ral_green_6005',
    description: 'Classic dark forest green blending harmoniously into natural landscapes.',
    typicalApplication: 'Military Installations, Forestry Canopies, Agricultural Warehouses',
    bisCode: 'IS 12866 Grade 6 Maximum Fastness',
    mixRatio: {
      violet: 0,
      indigo: 0,
      blue: 5,
      green: 65,
      yellow: 12,
      orange: 0,
      red: 0,
      white: 0,
      black: 18,
      pigmentChemistry: 'PG7 Phthalo Green + Carbon Black (PBk7) + Iron Oxide Yellow (PY42)',
      cielab: { L: 28.1, a: -12.4, b: 5.6 },
      cureAdjustmentNote: 'High carbon black content: ensure cobalt 6% is dosed at full 0.25% PHR.'
    }
  },

  // 5. YELLOW HUES (RAL 1000 series)
  {
    code: 'RAL 1018',
    name: 'Zinc Yellow',
    primaryHue: 'yellow',
    hueLabel: 'Yellow',
    hex: '#f8f32b',
    baseTransmittance: 85,
    recommendedPigment: 0.6,
    colorId: 'ral_yellow_1018',
    description: 'Bright high-transmittance yellow that maximizes interior ambient lux without glare.',
    typicalApplication: 'Cold-Climate Factory Skylights, Mining Camp Daylighting, Assembly Lines',
    bisCode: 'IS 12866 Grade 5 Fastness',
    mixRatio: {
      violet: 0,
      indigo: 0,
      blue: 0,
      green: 3,
      yellow: 92,
      orange: 0,
      red: 0,
      white: 5,
      black: 0,
      pigmentChemistry: 'Bismuth Vanadate Yellow (PY184) + Trace PG7 Green + Rutile TiO2 (PW6)',
      cielab: { L: 88.5, a: -8.5, b: 79.2 },
      cureAdjustmentNote: 'Extremely clean tone; base resin must have Gardner index < 1.5 to prevent greenish cast.'
    }
  },
  {
    code: 'RAL 1021',
    name: 'Colza Yellow',
    primaryHue: 'yellow',
    hueLabel: 'Yellow',
    hex: '#eed437',
    baseTransmittance: 80,
    recommendedPigment: 0.8,
    colorId: 'ral_yellow_1021',
    description: 'Rich warm golden yellow delivering cheery ambient illumination and UV absorption.',
    typicalApplication: 'Textile Mills, Railway Station Daylighting, Canopy Covers',
    bisCode: 'IS 12866 Grade 5 Fastness',
    mixRatio: {
      violet: 0,
      indigo: 0,
      blue: 0,
      green: 0,
      yellow: 90,
      orange: 6,
      red: 0,
      white: 4,
      black: 0,
      pigmentChemistry: 'Isoindoline Yellow (PY139) + DPP Orange (PO73) + Rutile TiO2',
      cielab: { L: 81.2, a: 6.8, b: 76.4 },
      cureAdjustmentNote: 'Warm hue naturally complements polyester amber tone; zero chromatic degradation.'
    }
  },
  {
    code: 'RAL 1023',
    name: 'Traffic Yellow',
    primaryHue: 'yellow',
    hueLabel: 'Yellow',
    hex: '#f7b500',
    baseTransmittance: 74,
    recommendedPigment: 1.0,
    colorId: 'ral_yellow_1023',
    description: 'High-visibility safety yellow formulated with heat-stable bismuth vanadate pigment.',
    typicalApplication: 'Hazard Warning Canopies, Crane Bays, Safety Gangway Covers',
    bisCode: 'IS 12866 Grade 5 Fastness',
    mixRatio: {
      violet: 0,
      indigo: 0,
      blue: 0,
      green: 0,
      yellow: 85,
      orange: 12,
      red: 0,
      white: 3,
      black: 0,
      pigmentChemistry: 'Bismuth Vanadate (PY184) + Perinone Orange (PO43) + Rutile TiO2',
      cielab: { L: 78.4, a: 15.6, b: 78.1 },
      cureAdjustmentNote: 'High thermal resistance in oven curing; excellent color retention up to 130°C peak.'
    }
  },

  // 6. ORANGE HUES (RAL 2000 series)
  {
    code: 'RAL 2004',
    name: 'Pure Orange',
    primaryHue: 'orange',
    hueLabel: 'Orange',
    hex: '#e25303',
    baseTransmittance: 68,
    recommendedPigment: 1.0,
    colorId: 'ral_orange_2004',
    description: 'Vivid, intense pure orange that cuts through blue solar haze to deliver high warm illumination.',
    typicalApplication: 'Distribution Center Skylights, Sports Complex Roofs, Commercial Entrances',
    bisCode: 'IS 12866 Grade 5 Fastness',
    mixRatio: {
      violet: 0,
      indigo: 0,
      blue: 0,
      green: 0,
      yellow: 12,
      orange: 82,
      red: 6,
      white: 0,
      black: 0,
      pigmentChemistry: 'Diketopyrrolopyrrole Orange (PO73) + Diarylide Yellow (PY83) + DPP Red (PR254)',
      cielab: { L: 56.8, a: 52.3, b: 62.4 },
      cureAdjustmentNote: 'DPP chromophores are 100% inert to ketone peroxides; exact predictable cure.'
    }
  },
  {
    code: 'RAL 2008',
    name: 'Bright Red Orange',
    primaryHue: 'orange',
    hueLabel: 'Orange',
    hex: '#ed6b21',
    baseTransmittance: 64,
    recommendedPigment: 1.2,
    colorId: 'ral_orange_2008',
    description: 'Warm glowing red-orange engineered with non-bleeding diketopyrrolopyrrole (DPP) paste.',
    typicalApplication: 'Theme Park Pavilions, Shopping Mall Canopies, Terrace Awnings',
    bisCode: 'IS 12866 Grade 5 Fastness',
    mixRatio: {
      violet: 0,
      indigo: 0,
      blue: 0,
      green: 0,
      yellow: 6,
      orange: 70,
      red: 24,
      white: 0,
      black: 0,
      pigmentChemistry: 'DPP Orange (PO73) + DPP Red (PR254) + Isoindoline Yellow (PY139)',
      cielab: { L: 54.1, a: 54.8, b: 51.2 },
      cureAdjustmentNote: 'Exceptional exterior weather fastness; no chalking or micro-fading after 3000 hr QUV.'
    }
  },
  {
    code: 'RAL 2000',
    name: 'Yellow Orange',
    primaryHue: 'orange',
    hueLabel: 'Orange',
    hex: '#dd7907',
    baseTransmittance: 72,
    recommendedPigment: 0.9,
    colorId: 'ral_orange_2000',
    description: 'Golden amber orange combining high light transmission with superior infrared shade.',
    typicalApplication: 'Agricultural Drying Sheds, Pergola Roofing, Food Processing Daylighting',
    bisCode: 'IS 12866 Grade 5 Fastness',
    mixRatio: {
      violet: 0,
      indigo: 0,
      blue: 0,
      green: 0,
      yellow: 30,
      orange: 65,
      red: 0,
      white: 5,
      black: 0,
      pigmentChemistry: 'Isoindolinone Yellow (PY110) + DPP Orange (PO73) + Rutile TiO2',
      cielab: { L: 59.8, a: 42.6, b: 61.5 },
      cureAdjustmentNote: 'Warm golden mass tone masks slight resin aging yellowing over 10+ years.'
    }
  },

  // 7. RED HUES (RAL 3000 series)
  {
    code: 'RAL 3020',
    name: 'Traffic Red',
    primaryHue: 'red',
    hueLabel: 'Red',
    hex: '#cc0605',
    baseTransmittance: 45,
    recommendedPigment: 1.5,
    colorId: 'ral_red_3020',
    description: 'Statutory emergency warning red with high opacity and extreme photolytic color lock.',
    typicalApplication: 'Fire Fighting Equipment Sheds, Chemical Spill Canopies, Dangerous Cargo Areas',
    bisCode: 'IS 12866 Grade 5 Fastness',
    mixRatio: {
      violet: 0,
      indigo: 0,
      blue: 0,
      green: 0,
      yellow: 2,
      orange: 6,
      red: 92,
      white: 0,
      black: 0,
      pigmentChemistry: 'Diketopyrrolopyrrole Red (PR254) + DPP Orange (PO73) + Trace PY83',
      cielab: { L: 44.2, a: 61.8, b: 39.4 },
      cureAdjustmentNote: 'PR254 high-opacity red; maintain standard 1.5–2.0% MEKP initiator for full cure.'
    }
  },
  {
    code: 'RAL 3000',
    name: 'Flame Red',
    primaryHue: 'red',
    hueLabel: 'Red',
    hex: '#af2b1e',
    baseTransmittance: 50,
    recommendedPigment: 1.3,
    colorId: 'ral_red_3000',
    description: 'Industrial vibrant crimson red providing high aesthetic impact and long-term gloss.',
    typicalApplication: 'Automotive Showroom Skylights, Industrial Corporate Identity Cladding',
    bisCode: 'IS 12866 Grade 5 Fastness',
    mixRatio: {
      violet: 0,
      indigo: 0,
      blue: 0,
      green: 0,
      yellow: 0,
      orange: 10,
      red: 85,
      white: 0,
      black: 5,
      pigmentChemistry: 'DPP Red (PR254) + DPP Orange (PO73) + Trace Carbon Black (PBk7)',
      cielab: { L: 40.5, a: 52.8, b: 31.9 },
      cureAdjustmentNote: 'Trace black lowers value; verify Barcol hardness >= 40 at demold.'
    }
  },
  {
    code: 'RAL 3002',
    name: 'Carmine Red',
    primaryHue: 'red',
    hueLabel: 'Red',
    hex: '#9b111e',
    baseTransmittance: 40,
    recommendedPigment: 1.6,
    colorId: 'ral_red_3002',
    description: 'Deep elegant ruby carmine red for premium architectural skylights and exterior envelopes.',
    typicalApplication: 'Luxury Architectural Domes, Cultural Centers, Hotel Entrance Canopies',
    bisCode: 'IS 12866 Grade 5 Fastness',
    mixRatio: {
      violet: 6,
      indigo: 0,
      blue: 0,
      green: 0,
      yellow: 0,
      orange: 0,
      red: 88,
      white: 0,
      black: 6,
      pigmentChemistry: 'Quinacridone Red (PR209) + Carbazole Violet (PV23) + Carbon Black (PBk7)',
      cielab: { L: 35.8, a: 45.4, b: 23.1 },
      cureAdjustmentNote: 'Carbazole and quinacridone provide rich ruby shade; full crosslink density in 20 min.'
    }
  },
];

export interface BatchPigmentBreakdown {
  totalPigmentGrams: number;
  components: {
    name: string;
    hue: PrimaryHue | 'white' | 'black';
    ratioPercent: number;
    grams: number;
    colorHex: string;
  }[];
}

export function calculateBatchPigmentComponents(
  ral: RalColorSpec,
  totalResinKg: number,
  customPhr?: number
): BatchPigmentBreakdown {
  const phr = customPhr ?? ral.recommendedPigment;
  const totalPigmentGrams = totalResinKg * 1000 * (phr / 100);

  const colorsMap: Record<string, { name: string; hex: string }> = {
    violet: { name: 'Primary Violet Paste (PV19)', hex: '#904684' },
    indigo: { name: 'Primary Indigo Paste (PB60/PB15)', hex: '#20214f' },
    blue: { name: 'Primary Blue Paste (PB15:3)', hex: '#2271b3' },
    green: { name: 'Primary Green Paste (PG7)', hex: '#57a639' },
    yellow: { name: 'Primary Yellow Paste (PY184)', hex: '#f8f32b' },
    orange: { name: 'Primary Orange Paste (PO73)', hex: '#e25303' },
    red: { name: 'Primary Red Paste (PR254)', hex: '#cc0605' },
    white: { name: 'Rutile White Base (PW6 TiO2)', hex: '#f8fafc' },
    black: { name: 'Furnace Black Shading (PBk7)', hex: '#0f172a' },
  };

  const keys: (keyof PrimaryMixRatio)[] = [
    'violet',
    'indigo',
    'blue',
    'green',
    'yellow',
    'orange',
    'red',
    'white',
    'black',
  ];

  const components: BatchPigmentBreakdown['components'] = [];

  for (const k of keys) {
    const ratioVal = ral.mixRatio[k];
    if (typeof ratioVal === 'number' && ratioVal > 0) {
      const g = (totalPigmentGrams * ratioVal) / 100;
      const meta = colorsMap[k] || { name: k, hex: '#888888' };
      components.push({
        name: meta.name,
        hue: k as any,
        ratioPercent: ratioVal,
        grams: parseFloat(g.toFixed(2)),
        colorHex: meta.hex,
      });
    }
  }

  // Sort descending by percentage
  components.sort((a, b) => b.ratioPercent - a.ratioPercent);

  return {
    totalPigmentGrams: parseFloat(totalPigmentGrams.toFixed(2)),
    components,
  };
}

export function findRalColor(codeOrId: string): RalColorSpec | undefined {
  const clean = codeOrId.trim().toUpperCase();
  return RAL_COLORS.find(
    (c) =>
      c.code.toUpperCase() === clean ||
      c.colorId.toUpperCase() === clean ||
      c.name.toUpperCase().includes(clean)
  );
}

export function getRalColorsByHue(hue: PrimaryHue): RalColorSpec[] {
  return RAL_COLORS.filter((c) => c.primaryHue === hue);
}
