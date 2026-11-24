import {
  type ConversionOptions,
  type UnitInfo,
  UnitRegistry,
  applyPrecision,
  validateNumber
} from '../shared/index.js';

/**
 * Standard acceleration of free fall defined by the 3rd CGPM (1901): exactly 9.80665 m/s².
 */
export const STANDARD_GRAVITY = 9.80665;

export type MassUnit =
  | 'ug'
  | 'mg'
  | 'g'
  | 'kg'
  | 't'
  | 'oz'
  | 'lb'
  | 'st'
  | 'us-ton'
  | 'imperial-ton';

export type ForceUnit =
  | 'N'
  | 'kN'
  | 'MN'
  | 'lbf'
  | 'kgf'
  | 'dyn';

export interface MassUnitInfo extends UnitInfo<MassUnit> {
  category: 'mass';
  standardConvention: string;
}

export interface ForceUnitInfo extends UnitInfo<ForceUnit> {
  category: 'force';
  standardConvention: string;
}

export interface MassConversionOptions extends ConversionOptions {
  /**
   * Whether to allow negative mass. Physical mass is non-negative by default.
   * @default false
   */
  allowNegative?: boolean;
}

export interface ForceConversionOptions extends ConversionOptions {
  /**
   * Whether to allow negative force (e.g., directional force vectors).
   * @default true
   */
  allowNegative?: boolean;
}

const MASS_UNITS: readonly MassUnitInfo[] = [
  {
    id: 'ug',
    name: 'Microgram',
    symbol: 'µg',
    category: 'mass',
    system: 'si',
    factorToBase: 1e-9,
    standardConvention: '10^-9 kg',
    aliases: ['µg', 'microgram', 'micrograms'],
    description: 'One billionth of a kilogram'
  },
  {
    id: 'mg',
    name: 'Milligram',
    symbol: 'mg',
    category: 'mass',
    system: 'metric',
    factorToBase: 1e-6,
    standardConvention: '10^-6 kg',
    aliases: ['milligram', 'milligrams'],
    description: 'One millionth of a kilogram'
  },
  {
    id: 'g',
    name: 'Gram',
    symbol: 'g',
    category: 'mass',
    system: 'metric',
    factorToBase: 1e-3,
    standardConvention: '10^-3 kg',
    aliases: ['gram', 'grams'],
    description: 'One thousandth of a kilogram'
  },
  {
    id: 'kg',
    name: 'Kilogram',
    symbol: 'kg',
    category: 'mass',
    system: 'si',
    factorToBase: 1, // canonical base unit
    standardConvention: 'SI base unit of mass (canonical base unit)',
    aliases: ['kilogram', 'kilograms'],
    description: 'SI base unit of mass'
  },
  {
    id: 't',
    name: 'Metric Tonne',
    symbol: 't',
    category: 'mass',
    system: 'metric',
    factorToBase: 1000,
    standardConvention: '1,000 kg (megagram)',
    aliases: ['tonne', 'tonnes', 'metric_ton', 'metric_tonne'],
    description: 'Metric ton, equal to 1,000 kilograms'
  },
  {
    id: 'oz',
    name: 'Avoirdupois Ounce',
    symbol: 'oz',
    category: 'mass',
    system: 'imperial',
    factorToBase: 0.028349523125, // 0.45359237 / 16 exact
    standardConvention: '1/16 lb = 0.028349523125 kg (exact standard)',
    aliases: ['ounce', 'ounces'],
    description: 'International avoirdupois ounce (approx. 28.35 g)'
  },
  {
    id: 'lb',
    name: 'Avoirdupois Pound',
    symbol: 'lb',
    category: 'mass',
    system: 'imperial',
    factorToBase: 0.45359237, // International Yard and Pound Agreement 1959 exact
    standardConvention: 'International avoirdupois pound: exactly 0.45359237 kg',
    aliases: ['lbs', 'pound', 'pounds'],
    description: 'International avoirdupois pound (exactly 0.45359237 kg)'
  },
  {
    id: 'st',
    name: 'Stone',
    symbol: 'st',
    category: 'mass',
    system: 'imperial',
    factorToBase: 6.35029318, // 14 * 0.45359237 exact
    standardConvention: '14 avoirdupois pounds = 6.35029318 kg (exact)',
    aliases: ['stone', 'stones'],
    description: 'British imperial stone, equal to 14 pounds (approx. 6.35 kg)'
  },
  {
    id: 'us-ton',
    name: 'Short Ton (US)',
    symbol: 'short ton',
    category: 'mass',
    system: 'us-customary',
    factorToBase: 907.18474, // 2000 * 0.45359237 exact
    standardConvention: '2,000 avoirdupois pounds = 907.18474 kg (exact)',
    aliases: ['short-ton', 'short_ton', 'us_ton'],
    description: 'US short ton, equal to 2,000 pounds (907.18474 kg)'
  },
  {
    id: 'imperial-ton',
    name: 'Long Ton (UK / Imperial)',
    symbol: 'long ton',
    category: 'mass',
    system: 'imperial',
    factorToBase: 1016.0469088, // 2240 * 0.45359237 exact
    standardConvention: '2,240 avoirdupois pounds = 1016.0469088 kg (exact)',
    aliases: ['long-ton', 'long_ton', 'uk_ton', 'imp-ton', 'imp_ton'],
    description: 'Imperial long ton, equal to 2,240 pounds (1,016.0469 kg)'
  }
];

const FORCE_UNITS: readonly ForceUnitInfo[] = [
  {
    id: 'N',
    name: 'Newton',
    symbol: 'N',
    category: 'force',
    system: 'si',
    factorToBase: 1, // canonical base unit
    standardConvention: 'SI base derived unit of force (1 kg·m/s²)',
    aliases: ['newton', 'newtons'],
    description: 'SI unit of force'
  },
  {
    id: 'kN',
    name: 'Kilonewton',
    symbol: 'kN',
    category: 'force',
    system: 'si',
    factorToBase: 1000,
    standardConvention: '10^3 Newtons',
    aliases: ['kilonewton', 'kilonewtons'],
    description: 'One thousand newtons'
  },
  {
    id: 'MN',
    name: 'Meganewton',
    symbol: 'MN',
    category: 'force',
    system: 'si',
    factorToBase: 1000000,
    standardConvention: '10^6 Newtons',
    aliases: ['meganewton', 'meganewtons'],
    description: 'One million newtons'
  },
  {
    id: 'lbf',
    name: 'Pound-force',
    symbol: 'lbf',
    category: 'force',
    system: 'imperial',
    factorToBase: 4.4482216152605, // 0.45359237 * 9.80665 exact
    standardConvention: '1 lb * standard gravity (9.80665 m/s²) = 4.4482216152605 N (exact)',
    aliases: ['pound-force', 'pound_force'],
    description: 'Imperial unit of force exerted by 1 avoirdupois pound under standard gravity'
  },
  {
    id: 'kgf',
    name: 'Kilogram-force',
    symbol: 'kgf',
    category: 'force',
    system: 'metric',
    factorToBase: 9.80665, // 1 * 9.80665 exact
    standardConvention: '1 kg * standard gravity (9.80665 m/s²) = 9.80665 N (exact)',
    aliases: ['kilopond', 'kp', 'kilogram-force', 'kilogram_force'],
    description: 'Metric gravitational unit of force, equal to 9.80665 Newtons'
  },
  {
    id: 'dyn',
    name: 'Dyne',
    symbol: 'dyn',
    category: 'force',
    system: 'other',
    factorToBase: 1e-5, // 1 g * 1 cm/s^2 = 10^-5 N exact
    standardConvention: '1 g·cm/s² = 10^-5 N (exact CGS unit)',
    aliases: ['dyne', 'dynes'],
    description: 'CGS unit of force (10^-5 N)'
  }
];

const massRegistry = new UnitRegistry<MassUnit, MassUnitInfo>('mass', 'kg', MASS_UNITS);
const forceRegistry = new UnitRegistry<ForceUnit, ForceUnitInfo>('force', 'N', FORCE_UNITS);

/**
 * Converts pure mass measurements (e.g., kg <-> lb).
 * Never converts mass directly to force; use massToWeight for force calculations under gravity.
 */
export function convertMass(
  value: number,
  from: MassUnit | string,
  to: MassUnit | string,
  options?: MassConversionOptions
): number {
  const allowNegative = options?.allowNegative ?? false;
  validateNumber(value, 'mass value', { allowNegative });
  return massRegistry.convertLinear(value, from, to, options);
}

/**
 * Converts pure force/weight measurements (e.g., N <-> lbf).
 */
export function convertWeight(
  value: number,
  from: ForceUnit | string,
  to: ForceUnit | string,
  options?: ForceConversionOptions
): number {
  const allowNegative = options?.allowNegative ?? true;
  validateNumber(value, 'force value', { allowNegative });
  return forceRegistry.convertLinear(value, from, to, options);
}

/**
 * Converts a physical mass into the force of weight it exerts under a gravitational acceleration.
 * Formula: W = m * g.
 *
 * @param mass Mass value
 * @param massUnit Unit of the input mass
 * @param forceUnit Unit of the desired force/weight output
 * @param gravity Acceleration due to gravity in m/s². Defaults to standard gravity (9.80665 m/s²).
 * @param options Conversion options (precision, roundMode)
 */
export function massToWeight(
  mass: number,
  massUnit: MassUnit | string,
  forceUnit: ForceUnit | string,
  gravity = STANDARD_GRAVITY,
  options?: ConversionOptions
): number {
  validateNumber(mass, 'mass value', { allowNegative: options?.allowNegative ?? false });
  validateNumber(gravity, 'gravity acceleration', { min: 0 });

  const massInfo = massRegistry.requireUnit(massUnit, 'massUnit');
  const forceInfo = forceRegistry.requireUnit(forceUnit, 'forceUnit');

  // Convert mass to base kilograms (kg)
  const kg = mass * massInfo.factorToBase;

  // Compute force in Newtons: F = m (kg) * g (m/s²)
  const newtons = kg * gravity;

  // Convert Newtons to target force unit
  const result = newtons / forceInfo.factorToBase;

  return applyPrecision(result, options?.precision, options?.roundMode);
}

/**
 * Converts a measured force of weight back into physical mass under a gravitational acceleration.
 * Formula: m = W / g.
 *
 * @param force Force / weight value
 * @param forceUnit Unit of the input force
 * @param massUnit Unit of the desired mass output
 * @param gravity Acceleration due to gravity in m/s². Defaults to standard gravity (9.80665 m/s²).
 * @param options Conversion options (precision, roundMode)
 */
export function weightToMass(
  force: number,
  forceUnit: ForceUnit | string,
  massUnit: MassUnit | string,
  gravity = STANDARD_GRAVITY,
  options?: ConversionOptions
): number {
  validateNumber(force, 'force value', { allowNegative: options?.allowNegative ?? false });
  validateNumber(gravity, 'gravity acceleration', { min: 0, disallowZero: true });

  const forceInfo = forceRegistry.requireUnit(forceUnit, 'forceUnit');
  const massInfo = massRegistry.requireUnit(massUnit, 'massUnit');

  // Convert force to base Newtons (N)
  const newtons = force * forceInfo.factorToBase;

  // Compute mass in kilograms: m = F / g
  const kg = newtons / gravity;

  // Convert kilograms to target mass unit
  const result = kg / massInfo.factorToBase;

  return applyPrecision(result, options?.precision, options?.roundMode);
}

/**
 * Returns metadata for all supported mass units.
 */
export function getMassUnits(): MassUnitInfo[] {
  return massRegistry.getUnits();
}

/**
 * Returns metadata for all supported force/weight units.
 */
export function getWeightUnits(): ForceUnitInfo[] {
  return forceRegistry.getUnits();
}

/**
 * Retrieves unit metadata for either a mass or force unit.
 */
export function getWeightUnitInfo(unit: string): MassUnitInfo | ForceUnitInfo | undefined {
  const massMatch = massRegistry.getUnitInfo(unit);
  if (massMatch) return massMatch;
  return forceRegistry.getUnitInfo(unit);
}

/**
 * Checks if a string is a valid mass unit or alias.
 */
export function isValidMassUnit(unit: string): unit is MassUnit {
  return massRegistry.isValidUnit(unit);
}

/**
 * Checks if a string is a valid force unit or alias.
 */
export function isValidForceUnit(unit: string): unit is ForceUnit {
  return forceRegistry.isValidUnit(unit);
}
