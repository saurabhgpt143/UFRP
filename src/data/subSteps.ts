import { StepNumber } from '../types';

export interface SubStepInfo {
  stepId: StepNumber;
  subStepId: number; // 1, 2, 3
  title: string;
  subtitle: string;
  description: string;
  badge: string;
}

export const SUB_STEPS_DATA: Record<StepNumber, SubStepInfo[]> = {
  1: [
    {
      stepId: 1,
      subStepId: 1,
      title: '1.1 Primary Table Alignment',
      subtitle: '900 x 1200 x 1800mm Base Units',
      description: 'Align primary 900x1200x1800mm modular steel bed units to target sheet length.',
      badge: 'Base Bed',
    },
    {
      stepId: 1,
      subStepId: 2,
      title: '1.2 Staging Side Table',
      subtitle: 'Tooling & Die Staging Bed',
      description: 'Position matching secondary side table unit aside for lower profile die preparation.',
      badge: 'Side Table',
    },
    {
      stepId: 1,
      subStepId: 3,
      title: '1.3 Bed Leveling & Edge Stops',
      subtitle: 'Width Rail & Stop Calibration',
      description: 'Calibrate precision table levelness (<0.5mm/m) and adjust width guide stop rails.',
      badge: 'Calibrated',
    },
  ],
  2: [
    {
      stepId: 2,
      subStepId: 1,
      title: '2.1 Mount Lower Mylar Roll',
      subtitle: 'BOPET Release Film Dispenser',
      description: 'Mount bottom release film roll at bed head on tension unwind shaft.',
      badge: 'Roll Mounted',
    },
    {
      stepId: 2,
      subStepId: 2,
      title: '2.2 Unroll Substrate Paper',
      subtitle: 'Progressive Bed Covering',
      description: 'Unroll lower Mylar paper smoothly over table surface along full length.',
      badge: 'Unrolling',
    },
    {
      stepId: 2,
      subStepId: 3,
      title: '2.3 Stretch & Tension Substrate',
      subtitle: 'Wrinkle-Free Film Bed',
      description: 'Lock tension brakes to ensure lower Mylar film lies flat without wrinkles.',
      badge: 'Substrate Ready',
    },
  ],
  3: [
    {
      stepId: 3,
      subStepId: 1,
      title: '3.1 Apply Lower 50% Resin Mix',
      subtitle: 'Base Resin Matrix Coating',
      description: 'Pour first 50% catalyzed polyester/vinyl ester liquid resin mix over lower Mylar.',
      badge: 'Resin Base',
    },
    {
      stepId: 3,
      subStepId: 2,
      title: '3.2 Lay FiberMat Reinforcement',
      subtitle: 'Glass CSM / Woven Roving Layer',
      description: 'Impregnate glass fiber mat (CSM 450/600) into initial resin matrix bath.',
      badge: 'Glass Fiber',
    },
    {
      stepId: 3,
      subStepId: 3,
      title: '3.3 Apply Upper 50% Resin Coat',
      subtitle: 'Complete Matrix Wet-Out',
      description: 'Pour remaining 50% resin mix over fiberglass to ensure complete glass wet-out.',
      badge: 'Full Matrix',
    },
  ],
  4: [
    {
      stepId: 4,
      subStepId: 1,
      title: '4.1 Mount Top Mylar Roll',
      subtitle: 'Upper Release Film Dispenser',
      description: 'Stage upper BOPET film roll at machine head above resin impregnator.',
      badge: 'Top Roll',
    },
    {
      stepId: 4,
      subStepId: 2,
      title: '4.2 Unroll Top Protective Film',
      subtitle: 'Ice-Cyan Top Mylar Layer',
      description: 'Unroll top Mylar release film over liquid resin/fiber layup to seal matrix.',
      badge: 'Top Mylar',
    },
    {
      stepId: 4,
      subStepId: 3,
      title: '4.3 Sheet Transfer to Lower Die',
      subtitle: 'Side Tooling Profile Staging',
      description: 'Transfer prepared FRP plain sheet assembly onto lower profile die on side table.',
      badge: 'Sheet Transferred',
    },
  ],
  5: [
    {
      stepId: 5,
      subStepId: 1,
      title: '5.1 Enter Drying Oven Zone',
      subtitle: 'Enclosed Thermal Tunnel',
      description: 'Guide sheet assembly into temperature-controlled thermal drying oven zone.',
      badge: 'In Oven',
    },
    {
      stepId: 5,
      subStepId: 2,
      title: '5.2 Infrared Lamp Heating',
      subtitle: 'IR Heating & Gelation',
      description: 'Activate top & bottom IR lamps to ramp temperature to target 50-80°C.',
      badge: 'IR Lamps ON',
    },
    {
      stepId: 5,
      subStepId: 3,
      title: '5.3 Exotherm Peak Curing',
      subtitle: 'Thermoset Polymer Cure',
      description: 'Crosslink polymer matrix through exotherm reaction for full mechanical strength.',
      badge: 'Cured',
    },
  ],
  6: [
    {
      stepId: 6,
      subStepId: 1,
      title: '6.1 Peel Top Mylar Film',
      subtitle: 'Upper Film Stripping',
      description: 'Strip away top protective Mylar film from cured FRP sheet surface.',
      badge: 'Top Film Off',
    },
    {
      stepId: 6,
      subStepId: 2,
      title: '6.2 Elevate Sheet & Detach Substrate',
      subtitle: 'Demolding & Bottom Film Peel',
      description: 'Lift FRP sheet using vacuum suction cups and peel off bottom substrate Mylar.',
      badge: 'Demolded',
    },
    {
      stepId: 6,
      subStepId: 3,
      title: '6.3 Margin Edge Saw Trimming',
      subtitle: 'Circular Diamond Saw Cuts',
      description: 'Trim rough side and end margins to achieve ultimate clean finished dimensions.',
      badge: 'Trimmed Product',
    },
  ],
};
