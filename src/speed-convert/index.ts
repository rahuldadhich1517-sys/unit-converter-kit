import {
  type ConversionOptions,
  type UnitInfo,
  UnitRegistry,
  validateNumber
} from '../shared/index.js';

export type SpeedUnit =
  | 'm/s'
  | 'km/h'
  | 'mph'
  | 'ft/s'
  | 'kn';

export interface SpeedUnitInfo extends UnitInfo<SpeedUnit> {
  category: 'speed';
}

export interface SpeedConversionOptions extends ConversionOptions {
  /**
   * Whether to allow negative values (representing signed velocity).
   * @default true
   */
  allowNegative?: boolean;
}

const SPEED_UNITS: readonly SpeedUnitInfo[] = [
  {
    id: 'm/s',
    name: 'Meter per Second',
    symbol: 'm/s',
    category: 'speed',
    system: 'si',
    factorToBase: 1, // canonical base unit
    aliases: ['mps', 'meter_per_second', 'metre_per_second'],
    description: 'SI base derived unit of speed and velocity'
  },
  {
    id: 'km/h',
    name: 'Kilometer per Hour',
    symbol: 'km/h',
    category: 'speed',
    system: 'metric',
    factorToBase: 1000 / 3600, // 1 / 3.6 ≈ 0.2777777777777778
    aliases: ['kph', 'kmh', 'kilometer_per_hour', 'kilometre_per_hour'],
    description: 'Common vehicle speed unit (1 km/h = 1/3.6 m/s)'
  },
  {
    id: 'mph',
    name: 'Mile per Hour',
    symbol: 'mph',
    category: 'speed',
    system: 'imperial',
    factorToBase: 1609.344 / 3600, // exactly 0.44704 m/s
    aliases: ['mi/h', 'mile_per_hour', 'miles_per_hour'],
    description: 'Imperial unit of speed, exactly 0.44704 m/s'
  },
  {
    id: 'ft/s',
    name: 'Foot per Second',
    symbol: 'ft/s',
    category: 'speed',
    system: 'imperial',
    factorToBase: 0.3048, // exactly 0.3048 m/s
    aliases: ['fps', 'foot_per_second', 'feet_per_second'],
    description: 'Imperial unit of speed, exactly 0.3048 m/s'
  },
  {
    id: 'kn',
    name: 'Knot',
    symbol: 'kn',
    category: 'speed',
    system: 'other',
    factorToBase: 1852 / 3600, // exactly 1 nautical mile per hour = 1852/3600 m/s ≈ 0.514444 m/s
    aliases: ['kt', 'knot', 'knots', 'nautical_mile_per_hour'],
    description: 'One nautical mile per hour (1,852 / 3,600 m/s)'
  }
];

const registry = new UnitRegistry<SpeedUnit, SpeedUnitInfo>('speed', 'm/s', SPEED_UNITS);

/**
 * Converts speed or velocity between supported units.
 * Supports signed velocity by default (negative values allowed unless allowNegative is explicitly set to false).
 * Note: Mach is intentionally omitted because it depends on medium temperature and pressure.
 */
export function convertSpeed(
  value: number,
  from: SpeedUnit | string,
  to: SpeedUnit | string,
  options?: SpeedConversionOptions
): number {
  const allowNegative = options?.allowNegative ?? true;
  validateNumber(value, 'speed value', { allowNegative });
  return registry.convertLinear(value, from, to, options);
}

/**
 * Returns metadata for all supported speed units.
 */
export function getSpeedUnits(): SpeedUnitInfo[] {
  return registry.getUnits();
}

/**
 * Retrieves unit metadata for a specific speed unit or alias.
 */
export function getSpeedUnitInfo(unit: SpeedUnit | string): SpeedUnitInfo | undefined {
  return registry.getUnitInfo(unit);
}

/**
 * Checks if the unit string is a valid speed unit or alias.
 */
export function isValidSpeedUnit(unit: string): unit is SpeedUnit {
  return registry.isValidUnit(unit);
}
