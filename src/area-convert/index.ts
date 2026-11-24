import {
  type ConversionOptions,
  type UnitInfo,
  UnitRegistry,
  validateNumber
} from '../shared/index.js';

export type AreaUnit =
  | 'mm2'
  | 'cm2'
  | 'm2'
  | 'km2'
  | 'in2'
  | 'ft2'
  | 'yd2'
  | 'mi2'
  | 'ac'
  | 'ha';

export interface AreaUnitInfo extends UnitInfo<AreaUnit> {
  category: 'area';
}

export interface AreaConversionOptions extends ConversionOptions {
  /**
   * Whether to allow negative area values. Physical area is non-negative by default (false).
   * @default false
   */
  allowNegative?: boolean;
}

const AREA_UNITS: readonly AreaUnitInfo[] = [
  {
    id: 'mm2',
    name: 'Square Millimeter',
    symbol: 'mm²',
    category: 'area',
    system: 'metric',
    factorToBase: 0.000001, // 1e-6
    aliases: ['mm²', 'sq_mm', 'square_millimeter', 'square-millimeter'],
    description: 'One millionth of a square meter'
  },
  {
    id: 'cm2',
    name: 'Square Centimeter',
    symbol: 'cm²',
    category: 'area',
    system: 'metric',
    factorToBase: 0.0001, // 1e-4
    aliases: ['cm²', 'sq_cm', 'square_centimeter', 'square-centimeter'],
    description: 'One ten-thousandth of a square meter'
  },
  {
    id: 'm2',
    name: 'Square Meter',
    symbol: 'm²',
    category: 'area',
    system: 'si',
    factorToBase: 1,
    aliases: ['m²', 'sq_m', 'square_meter', 'square-meter'],
    description: 'SI derived unit of area (canonical base unit)'
  },
  {
    id: 'km2',
    name: 'Square Kilometer',
    symbol: 'km²',
    category: 'area',
    system: 'metric',
    factorToBase: 1000000, // 1e6
    aliases: ['km²', 'sq_km', 'square_kilometer', 'square-kilometer'],
    description: 'One million square meters'
  },
  {
    id: 'in2',
    name: 'Square Inch',
    symbol: 'in²',
    category: 'area',
    system: 'imperial',
    factorToBase: 0.00064516, // (0.0254)^2 exact
    aliases: ['in²', 'sq_in', 'square_inch', 'square-inch', 'sqin'],
    description: 'Imperial/US customary square inch (exact 0.00064516 m²)'
  },
  {
    id: 'ft2',
    name: 'Square Foot',
    symbol: 'ft²',
    category: 'area',
    system: 'imperial',
    factorToBase: 0.09290304, // (0.3048)^2 exact
    aliases: ['ft²', 'sq_ft', 'square_foot', 'square-foot', 'sqft'],
    description: 'Imperial/US customary square foot (exact 0.09290304 m²)'
  },
  {
    id: 'yd2',
    name: 'Square Yard',
    symbol: 'yd²',
    category: 'area',
    system: 'imperial',
    factorToBase: 0.83612736, // (0.9144)^2 exact
    aliases: ['yd²', 'sq_yd', 'square_yard', 'square-yard', 'sqyd'],
    description: 'Imperial/US customary square yard (exact 0.83612736 m²)'
  },
  {
    id: 'mi2',
    name: 'Square Mile',
    symbol: 'mi²',
    category: 'area',
    system: 'imperial',
    factorToBase: 2589988.110336, // (1609.344)^2 exact
    aliases: ['mi²', 'sq_mi', 'square_mile', 'square-mile', 'sqmi'],
    description: 'Imperial/US customary square mile (exact 2,589,988.110336 m²)'
  },
  {
    id: 'ac',
    name: 'Acre',
    symbol: 'ac',
    category: 'area',
    system: 'imperial',
    factorToBase: 4046.8564224, // 43560 * 0.09290304 exact international acre
    aliases: ['acre', 'acres'],
    description: 'International acre (exact 4,046.8564224 m²)'
  },
  {
    id: 'ha',
    name: 'Hectare',
    symbol: 'ha',
    category: 'area',
    system: 'metric',
    factorToBase: 10000,
    aliases: ['hectare', 'hectares'],
    description: 'Non-SI metric unit of area, equal to 10,000 m²'
  }
];

const registry = new UnitRegistry<AreaUnit, AreaUnitInfo>('area', 'm2', AREA_UNITS);

/**
 * Converts a numerical area value from one unit to another.
 * Physical area values cannot be negative by default.
 */
export function convertArea(
  value: number,
  from: AreaUnit | string,
  to: AreaUnit | string,
  options?: AreaConversionOptions
): number {
  // Physical area is non-negative by default
  const allowNegative = options?.allowNegative ?? false;
  validateNumber(value, 'area value', { allowNegative });

  return registry.convertLinear(value, from, to, {
    ...options,
    allowNegative
  });
}

/**
 * Returns metadata for all supported area units.
 */
export function getAreaUnits(): AreaUnitInfo[] {
  return registry.getUnits();
}

/**
 * Retrieves metadata for a specific area unit or alias.
 */
export function getAreaUnitInfo(unit: AreaUnit | string): AreaUnitInfo | undefined {
  return registry.getUnitInfo(unit);
}

/**
 * Type guard checking if a string is a recognized area unit or alias.
 */
export function isValidAreaUnit(unit: string): unit is AreaUnit {
  return registry.isValidUnit(unit);
}

/**
 * Calculates the direct conversion factor between two area units: `to = from * factor`.
 */
export function getAreaConversionFactor(from: AreaUnit | string, to: AreaUnit | string): number {
  return registry.getConversionFactor(from, to);
}
