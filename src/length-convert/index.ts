import {
  type ConversionOptions,
  type UnitInfo,
  UnitRegistry,
  validateNumber
} from '../shared/index.js';

export type LengthUnit =
  | 'nm'
  | 'um'
  | 'mm'
  | 'cm'
  | 'm'
  | 'km'
  | 'in'
  | 'ft'
  | 'yd'
  | 'mi'
  | 'nmi';

export interface LengthUnitInfo extends UnitInfo<LengthUnit> {
  category: 'length';
}

export interface LengthConversionOptions extends ConversionOptions {
  /**
   * Whether to allow negative length / displacement values.
   * @default false
   */
  allowNegative?: boolean;
}

const LENGTH_UNITS: readonly LengthUnitInfo[] = [
  {
    id: 'nm',
    name: 'Nanometer',
    symbol: 'nm',
    category: 'length',
    system: 'si',
    factorToBase: 1e-9,
    aliases: ['nanometer', 'nanometre', 'nanometers', 'nanometres'],
    description: 'One billionth of a meter (10^-9 m)'
  },
  {
    id: 'um',
    name: 'Micrometer',
    symbol: 'µm',
    category: 'length',
    system: 'si',
    factorToBase: 1e-6,
    aliases: ['µm', 'micron', 'micrometer', 'micrometre', 'micrometers', 'micrometres'],
    description: 'One millionth of a meter (10^-6 m)'
  },
  {
    id: 'mm',
    name: 'Millimeter',
    symbol: 'mm',
    category: 'length',
    system: 'metric',
    factorToBase: 0.001,
    aliases: ['millimeter', 'millimetre', 'millimeters', 'millimetres'],
    description: 'One thousandth of a meter'
  },
  {
    id: 'cm',
    name: 'Centimeter',
    symbol: 'cm',
    category: 'length',
    system: 'metric',
    factorToBase: 0.01,
    aliases: ['centimeter', 'centimetre', 'centimeters', 'centimetres'],
    description: 'One hundredth of a meter'
  },
  {
    id: 'm',
    name: 'Meter',
    symbol: 'm',
    category: 'length',
    system: 'si',
    factorToBase: 1, // canonical base unit
    aliases: ['meter', 'metre', 'meters', 'metres'],
    description: 'SI base unit of length'
  },
  {
    id: 'km',
    name: 'Kilometer',
    symbol: 'km',
    category: 'length',
    system: 'metric',
    factorToBase: 1000,
    aliases: ['kilometer', 'kilometre', 'kilometers', 'kilometres'],
    description: 'One thousand meters'
  },
  {
    id: 'in',
    name: 'Inch',
    symbol: 'in',
    category: 'length',
    system: 'imperial',
    factorToBase: 0.0254, // exact international inch definition
    aliases: ['inch', 'inches', '"'],
    description: 'International inch, exactly 0.0254 meters'
  },
  {
    id: 'ft',
    name: 'Foot',
    symbol: 'ft',
    category: 'length',
    system: 'imperial',
    factorToBase: 0.3048, // 12 * 0.0254 exact
    aliases: ['foot', 'feet', "'"],
    description: 'International foot, exactly 0.3048 meters'
  },
  {
    id: 'yd',
    name: 'Yard',
    symbol: 'yd',
    category: 'length',
    system: 'imperial',
    factorToBase: 0.9144, // 3 * 0.3048 exact
    aliases: ['yard', 'yards'],
    description: 'International yard, exactly 0.9144 meters'
  },
  {
    id: 'mi',
    name: 'Mile',
    symbol: 'mi',
    category: 'length',
    system: 'imperial',
    factorToBase: 1609.344, // 5280 * 0.3048 exact
    aliases: ['mile', 'miles'],
    description: 'International statute mile, exactly 1,609.344 meters'
  },
  {
    id: 'nmi',
    name: 'Nautical Mile',
    symbol: 'nmi',
    category: 'length',
    system: 'other',
    factorToBase: 1852, // First International Extraordinary Hydrographic Conference (1929) exact
    aliases: ['NM', 'nm_nautical', 'nautical_mile', 'nautical-mile', 'nautical_miles'],
    description: 'International nautical mile, exactly 1,852 meters'
  }
];

const registry = new UnitRegistry<LengthUnit, LengthUnitInfo>('length', 'm', LENGTH_UNITS);

/**
 * Converts length between supported units.
 */
export function convertLength(
  value: number,
  from: LengthUnit | string,
  to: LengthUnit | string,
  options?: LengthConversionOptions
): number {
  const allowNegative = options?.allowNegative ?? false;
  validateNumber(value, 'length value', { allowNegative });
  return registry.convertLinear(value, from, to, options);
}

/**
 * Returns metadata for all supported length units.
 */
export function getLengthUnits(): LengthUnitInfo[] {
  return registry.getUnits();
}

/**
 * Retrieves unit metadata for a specific length unit or alias.
 */
export function getLengthUnitInfo(unit: LengthUnit | string): LengthUnitInfo | undefined {
  return registry.getUnitInfo(unit);
}

/**
 * Checks if the unit string is a valid length unit or alias.
 */
export function isValidLengthUnit(unit: string): unit is LengthUnit {
  return registry.isValidUnit(unit);
}
