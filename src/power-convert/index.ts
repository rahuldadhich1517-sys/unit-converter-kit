import {
  type ConversionOptions,
  type UnitInfo,
  UnitRegistry,
  validateNumber
} from '../shared/index.js';

export type PowerUnit =
  | 'mW'
  | 'W'
  | 'kW'
  | 'MW'
  | 'GW'
  | 'hp'
  | 'PS'
  | 'BTU/h';

export interface PowerUnitInfo extends UnitInfo<PowerUnit> {
  category: 'power';
  standardConvention: string;
}

export interface PowerConversionOptions extends ConversionOptions {
  /**
   * Whether to allow negative power values.
   * @default false
   */
  allowNegative?: boolean;
}

const POWER_UNITS: readonly PowerUnitInfo[] = [
  {
    id: 'mW',
    name: 'Milliwatt',
    symbol: 'mW',
    category: 'power',
    system: 'si',
    factorToBase: 0.001,
    standardConvention: '10^-3 Watts',
    aliases: ['milliwatt', 'milliwatts'],
    description: 'One thousandth of a watt'
  },
  {
    id: 'W',
    name: 'Watt',
    symbol: 'W',
    category: 'power',
    system: 'si',
    factorToBase: 1, // canonical base unit
    standardConvention: 'SI unit of power (1 Joule per second = 1 kg·m²/s³)',
    aliases: ['watt', 'watts'],
    description: 'SI base derived unit of power'
  },
  {
    id: 'kW',
    name: 'Kilowatt',
    symbol: 'kW',
    category: 'power',
    system: 'si',
    factorToBase: 1000,
    standardConvention: '10^3 Watts',
    aliases: ['kilowatt', 'kilowatts'],
    description: 'One thousand watts'
  },
  {
    id: 'MW',
    name: 'Megawatt',
    symbol: 'MW',
    category: 'power',
    system: 'si',
    factorToBase: 1000000,
    standardConvention: '10^6 Watts',
    aliases: ['megawatt', 'megawatts'],
    description: 'One million watts'
  },
  {
    id: 'GW',
    name: 'Gigawatt',
    symbol: 'GW',
    category: 'power',
    system: 'si',
    factorToBase: 1000000000,
    standardConvention: '10^9 Watts',
    aliases: ['gigawatt', 'gigawatts'],
    description: 'One billion watts (10^9 W)'
  },
  {
    id: 'hp',
    name: 'Mechanical Horsepower (Imperial)',
    symbol: 'hp',
    category: 'power',
    system: 'imperial',
    factorToBase: 745.6998715822702, // 550 ft·lbf/s = 550 * 0.3048 * 4.4482216152605 exact
    standardConvention: 'Mechanical (Imperial) horsepower: 550 ft·lbf/s ≈ 745.69987 W',
    aliases: ['horsepower', 'hp_mechanical', 'hp_imperial'],
    description: 'Mechanical horsepower, defined as 550 foot-pounds-force per second (approx. 745.7 W)'
  },
  {
    id: 'PS',
    name: 'Metric Horsepower (Pferdestärke)',
    symbol: 'PS',
    category: 'power',
    system: 'metric',
    factorToBase: 735.49875, // 75 kgf·m/s = 75 * 9.80665 W exact
    standardConvention: 'Metric horsepower (PS / cv / ch): 75 kgf·m/s = 735.49875 W (DIN 66036)',
    aliases: ['ps', 'cv', 'ch', 'pk', 'metric_hp', 'hp_metric'],
    description: 'Metric horsepower (Pferdestärke / Cheval-vapeur), defined as 75 kgf·m/s (735.49875 W)'
  },
  {
    id: 'BTU/h',
    name: 'BTU per hour (IT)',
    symbol: 'BTU/h',
    category: 'power',
    system: 'imperial',
    factorToBase: 0.2930710701722222, // 1055.05585262 J / 3600 s exact
    standardConvention: 'International Table BTU per hour: 1055.05585262 / 3600 W ≈ 0.293071 W',
    aliases: ['btu/h', 'btu_per_hour', 'BTU/hr', 'btu/hr'],
    description: 'British thermal units per hour based on International Table BTU (approx. 0.29307 W)'
  }
];

const registry = new UnitRegistry<PowerUnit, PowerUnitInfo>('power', 'W', POWER_UNITS);

/**
 * Converts power between supported units.
 */
export function convertPower(
  value: number,
  from: PowerUnit | string,
  to: PowerUnit | string,
  options?: PowerConversionOptions
): number {
  const allowNegative = options?.allowNegative ?? false;
  validateNumber(value, 'power value', { allowNegative });
  return registry.convertLinear(value, from, to, options);
}

/**
 * Returns metadata for all supported power units.
 */
export function getPowerUnits(): PowerUnitInfo[] {
  return registry.getUnits();
}

/**
 * Retrieves unit metadata for a specific power unit or alias.
 */
export function getPowerUnitInfo(unit: PowerUnit | string): PowerUnitInfo | undefined {
  return registry.getUnitInfo(unit);
}

/**
 * Checks if the unit string is a valid power unit or alias.
 */
export function isValidPowerUnit(unit: string): unit is PowerUnit {
  return registry.isValidUnit(unit);
}
