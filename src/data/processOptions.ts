import { StepNumber } from '../types';

export interface StepMethodOption {
  id: string;
  name: string;
  shortLabel: string;
  typeBadge: 'Standard Default' | 'Alternative Method';
  description: string;
  specs: string[];
  advantages: string;
  costImpact?: string;
}

export interface CostReductionStrategy {
  title: string;
  category: 'Material Savings' | 'Energy & Utility' | 'Tooling & Scrap' | 'Process Automation';
  savingsPercent: string;
  action: string;
  financialImpact: string;
}

export const STEP_COST_STRATEGIES: Record<StepNumber, CostReductionStrategy[]> = {
  1: [
    {
      title: 'Modular Steel Bed & Quick-Clamp Fixtures',
      category: 'Tooling & Scrap',
      savingsPercent: '12 - 18%',
      action: 'Utilize standardized modular bed channels with pneumatic quick-release side clamps to drastically reduce mold staging time.',
      financialImpact: 'Lowers initial bed capex by ~₹2,10,000 and cuts line changeover time from 45 min to 12 min.',
    },
    {
      title: 'Automated Pneumatic Bed Levelling',
      category: 'Process Automation',
      savingsPercent: '5 - 8%',
      action: 'Replace manual optical levelling jacks with auto-balancing pneumatic air-bags to ensure strict <0.3mm/m bed flatness.',
      financialImpact: 'Prevents resin pooling in low spots, reducing excess resin consumption by 0.15 kg/m² (~₹40/m² saved).',
    },
  ],
  2: [
    {
      title: 'Jumbo Roll Film Sourcing & Tension Brake',
      category: 'Material Savings',
      savingsPercent: '18 - 22%',
      action: 'Procure 100µm BOPET Mylar film in 1500m jumbo spools with automated magnetic particle brake tensioning.',
      financialImpact: 'Saves ~₹29/m² on plastic film consumables and eliminates film wrinkle rejects.',
    },
    {
      title: 'Reusable PTFE-Glass Fiber Conveyor Substrate',
      category: 'Tooling & Scrap',
      savingsPercent: '25 - 35%',
      action: 'Upgrade from single-use disposable film to a continuous reusable Teflon (PTFE) coated glass fiber belt.',
      financialImpact: 'Eliminates plastic film waste entirely over 500+ production cycles, reducing material cost by ~₹71/m².',
    },
  ],
  3: [
    {
      title: 'Automated Peristaltic Meter-Mix Dispensing',
      category: 'Process Automation',
      savingsPercent: '15 - 25%',
      action: 'Implement digital peristaltic dosing pumps for MEKP catalyst and pigment paste to replace manual beaker measurement.',
      financialImpact: 'Eliminates batch off-spec spoilage (saving ~₹150/kg of wasted resin mix) and ensures exact 1.5% MEKP ratio.',
    },
    {
      title: 'Direct Chopped Roving Gun Conversion',
      category: 'Material Savings',
      savingsPercent: '20 - 28%',
      action: 'Switch from pre-woven chopped strand glass mat (CSM) rolls to direct continuous glass roving spools with gantry chopper.',
      financialImpact: 'Lowers glass fiber raw material purchasing cost from ₹200/kg to ₹146/kg.',
    },
  ],
  4: [
    {
      title: 'High-Density Composite Die Inserts',
      category: 'Tooling & Scrap',
      savingsPercent: '30 - 50%',
      action: 'Substitute heavy machined steel upper dies with high-density polyurethane (HDPE/UHMW) composite profile die sections.',
      financialImpact: 'Cuts profile die tooling cost by 50% (saving ~₹1,25,000 per die set) and reduces manual die lifting weight by 65%.',
    },
    {
      title: 'Calibrated Perimeter Edge Dampers',
      category: 'Tooling & Scrap',
      savingsPercent: '8 - 12%',
      action: 'Install perimeter silicone elastomeric edge dampers to constrain resin squeeze-out during deadweight compression.',
      financialImpact: 'Saves 0.22 kg/m² of resin lost to edge flash squeeze-out (~₹58/m² saved).',
    },
  ],
  5: [
    {
      title: 'Directional Far-Infrared (FIR) Heating Tunnel',
      category: 'Energy & Utility',
      savingsPercent: '35 - 45%',
      action: 'Replace open resistance heaters with zoned Far-Infrared quartz tube radiators that directly excite resin polymer bonds.',
      financialImpact: 'Reduces electricity consumption from 18 kW/hr to 10.5 kW/hr (saves ~₹120/hr at peak industrial tariffs) and shortens gel time by 40%.',
    },
    {
      title: 'Thermal Hood Insulation & Heat Recirculation',
      category: 'Energy & Utility',
      savingsPercent: '15 - 20%',
      action: 'Enclose the assembly bed with double-walled rockwool insulated hoods and recirculating hot-air blowers.',
      financialImpact: 'Captures chemical exothermic heat of reaction to maintain 60°C curing temp with minimal burner power.',
    },
  ],
  6: [
    {
      title: 'Laser-Guided Narrow-Kerf Flying Cold Saw',
      category: 'Tooling & Scrap',
      savingsPercent: '10 - 15%',
      action: 'Replace manual shears with automated diamond cold saw operating at 4500 RPM with a thin 1.8mm blade kerf.',
      financialImpact: 'Reduces edge margin trimming scrap by 60% and produces glass-smooth burr-free edges without delamination.',
    },
    {
      title: 'Automated Film Winder & Mylar Reclamation',
      category: 'Material Savings',
      savingsPercent: '12 - 18%',
      action: 'Attach continuous motorized film stripping rollers that collect clean used Mylar onto cardboard cores.',
      financialImpact: 'Enables clean PET film scrap recycling resale at ₹33/kg or re-use as protective interleave sheets.',
    },
  ],
};

export const STEP_ALTERNATIVE_OPTIONS: Record<StepNumber, StepMethodOption[]> = {
  1: [
    {
      id: 'stationary_table',
      name: 'Stationary Modular Bed Assembly',
      shortLabel: 'Modular Steel Bed',
      typeBadge: 'Standard Default',
      description: 'Rigid 900x1200x1800mm steel channel bed with optical levelling jacks and parallel side mold staging table.',
      specs: ['Bed Unit: 900 × 1200 × 1800mm', 'Tolerance: <0.5mm/m levelling', 'Die Staging: Parallel matching bed'],
      advantages: 'High rigidity, zero mechanical vibration, maximum cost-efficiency for custom sheets.',
    },
    {
      id: 'conveyor_belt',
      name: 'Continuous Conveyor Belt Bed',
      shortLabel: 'Continuous Conveyor',
      typeBadge: 'Alternative Method',
      description: 'Motorized stainless-steel continuous wire-mesh belt conveyor with laser guide tracking & pneumatic width positioners.',
      specs: ['Speed: 0.5 - 5.0 m/min continuous', 'Laser Alignment: Automated edge tracking', 'Substrate: Stainless Steel Mesh'],
      advantages: '3x higher production throughput, continuous non-stop sheet pulling for industrial high volume.',
    },
  ],
  2: [
    {
      id: 'bopet_mylar',
      name: 'BOPET Mylar Release Film Roll',
      shortLabel: 'BOPET Mylar Film',
      typeBadge: 'Standard Default',
      description: 'High-clarity Biaxially-Oriented Polyethylene Terephthalate (BOPET) film unrolled on the assembly table.',
      specs: ['Gauge: 50µm, 75µm, 100µm', 'Widths: 1000mm - 1800mm', 'Surface: Mirror Gloss or Satin Matte'],
      advantages: 'Superior high-gloss surface finish, outstanding chemical resistance, zero resin adhesion.',
    },
    {
      id: 'ptfe_cellophane',
      name: 'PTFE/Silicone Belt & Anti-Static Bar',
      shortLabel: 'PTFE Belt & Anti-Static',
      typeBadge: 'Alternative Method',
      description: 'Reusable high-temp PTFE (Teflon) coated woven glass fiber carrier belt with inline 7kV ionizing anti-static bar.',
      specs: ['Temp Rating: Up to 260°C', 'Anti-Static: 7kV Ionizing Bar', 'Lifespan: Reusable >500 cycles'],
      advantages: 'Zero consumable plastic film waste, eliminates static dust attraction, ultra-durable reusable substrate.',
    },
  ],
  3: [
    {
      id: 'two_stage_manual',
      name: 'Two-Stage Beaker Blend & Pour',
      shortLabel: 'Two-Stage Beaker Pour',
      typeBadge: 'Standard Default',
      description: 'Initial 50% resin pour onto bottom Mylar, FiberMat glass placement, and top 50% resin impregnation pour.',
      specs: ['Resin Split: 50% Bottom / 50% Top', 'Mix Vessel: Graduated Transparent Beaker', 'Air Removal: Serrated squeegee roller'],
      advantages: 'Precise volumetric resin control, thorough wet-out inspection, minimal resin waste.',
    },
    {
      id: 'spray_injection',
      name: 'Chopped Roving Spray & Coater',
      shortLabel: 'Roving Spray & Coater',
      typeBadge: 'Alternative Method',
      description: 'Dual-stream external mix spray gun with continuous glass roving cutter and motorized grooved wet-out rollers.',
      specs: ['Fiber Feed: Continuous Roving Spools', 'Chop Length: 25mm - 50mm', 'Deposition: Automated traverse gantry'],
      advantages: 'Eliminates pre-cut mat handling, higher glass content uniformity, ideal for thick structural laminates.',
    },
  ],
  4: [
    {
      id: 'profile_die_clamp',
      name: 'Top Mylar + Upper Corrugated Die',
      shortLabel: 'Upper Profile Die & Weights',
      typeBadge: 'Standard Default',
      description: 'Top Mylar sheet covering, transfer to lower profile die, placement of matching upper die, and calibrated weight compression.',
      specs: ['Die Profiles: Sinusoidal, Trapezoidal, 7V', 'Clamping: Calibrated top deadweights', 'Film Protection: Dual Mylar sandwich'],
      advantages: 'Exact profile geometry replication, sharp corrugated pitch, uniform sheet thickness across ribs.',
    },
    {
      id: 'continuous_roller_forming',
      name: 'S-Wave Rollers & Vacuum Bagging',
      shortLabel: 'Progressive S-Wave Rollers',
      typeBadge: 'Alternative Method',
      description: 'Pass-through progressive corrugation rollers with flexible silicone top vacuum membrane for atmospheric pressure compaction.',
      specs: ['Forming: 5-Stage Progressive Rollers', 'Pressure: -0.8 bar Vacuum Bagging', 'Die-less: Adjustable pitch rollers'],
      advantages: 'Continuous profiling without full-length rigid dies, zero trapped air voids, flexible pitch adjustment.',
    },
  ],
  5: [
    {
      id: 'thermal_oven_bed',
      name: 'Thermal Bed & Convection Tunnel',
      shortLabel: 'Thermal Resistance Bed',
      typeBadge: 'Standard Default',
      description: 'Under-bed electrical resistance heating plates with circulating hot air convection hood (25°C to 80°C).',
      specs: ['Temp Range: 25 - 80°C Controlled', 'Sensor: Pt100 Thermistor Probe', 'Gel Time: 15 - 45 min exotherm'],
      advantages: 'Uniform temperature distribution, reliable MEKP peroxide decomposition, proven industrial standard.',
    },
    {
      id: 'fir_infrared_tunnel',
      name: 'Far-Infrared (FIR) Curing Tunnel',
      shortLabel: 'Far-Infrared (FIR) Tunnel',
      typeBadge: 'Alternative Method',
      description: 'High-efficiency Far-Infrared quartz tube heating tunnel with dual pyrometer non-contact surface monitoring.',
      specs: ['Wavelength: 3.0 - 10.0 µm FIR', 'Exotherm Acceleration: 40% Faster', 'Pyrometer: Dual IR Laser Sensors'],
      advantages: 'Direct volumetric polymer heating, reduced thermal inertia, up to 40% energy savings and faster line speed.',
    },
  ],
  6: [
    {
      id: 'manual_shear_trim',
      name: 'Manual Demold & Rotary Shear Trim',
      shortLabel: 'Manual Rotary Shear Trim',
      typeBadge: 'Standard Default',
      description: 'Manual lift demolding of upper die & top film, edge margin trimming with benchtop rotary guillotine shear, and Mylar stripping.',
      specs: ['Demold: Manual lever lift', 'Edge Trim: Benchtop rotary shear', 'Inspection: Visual light box check'],
      advantages: 'Simple low-maintenance operation, no electrical hazard during trimming, easy quality inspection.',
    },
    {
      id: 'laser_flying_saw',
      name: 'Automated Flying Saw & Laser Guide',
      shortLabel: 'Laser Flying Saw & Vac Lift',
      typeBadge: 'Alternative Method',
      description: 'Automated vacuum cup gantry lift, high-speed diamond flying cold saw with laser line guide & HEPA dust collector.',
      specs: ['Demold Rig: Pneumatic Vacuum Cups', 'Cutting: Diamond Cold Saw (4500 RPM)', 'Dust Extraction: HEPA Filter Shroud'],
      advantages: 'Burr-free glass-smooth cut edges, zero manual heavy lifting, dust-free clean environment.',
    },
  ],
};
