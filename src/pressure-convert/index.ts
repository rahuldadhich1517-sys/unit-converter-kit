import {
  type ConversionOptions,
  type UnitInfo,
  UnitRegistry,
  validateNumber
} from '../shared/index.js';

export type PressureUnit =
  | 'Pa'
  | 'kPa'
  | 'MPa'
  | 'bar'
  | 'mbar'
  | 'atm'
  | 'psi'
  | 'Torr'
  | 'mmHg';

export interface PressureUnitInfo extends UnitInfo<PressureUnit> {
  category: 'pressure';
  standardConvention: string;
}

export interface PressureConversionOptions extends ConversionOptions {
  /**
   * Whether to allow negative pressure values. Absolute pressure is strictly non-negative by default.
   * @default false
   */
  allowNegative?: boolean;
}

const PRESSURE_UNITS: readonly PressureUnitInfo[] = [
  {
    id: 'Pa',
    name: 'Pascal',
    symbol: 'Pa',
    category: 'pressure',
    system: 'si',
    factorToBase: 1, // canonical base unit
    standardConvention: 'SI unit of pressure (1 Newton per square meter = 1 N/m²)',
    aliases: ['pascal', 'pascals'],
    description: 'SI derived unit of pressure'
  },
  {
    id: 'kPa',
    name: 'Kilopascal',
    symbol: 'kPa',
    category: 'pressure',
    system: 'si',
    factorToBase: 1000,
    standardConvention: '10^3 Pascals',
    aliases: ['kilopascal', 'kilopascals'],
    description: 'One thousand pascals'
  },
  {
    id: 'MPa',
    name: 'Megapascal',
    symbol: 'MPa',
    category: 'pressure',
    system: 'si',
    factorToBase: 1000000,
    standardConvention: '10^6 Pascals',
    aliases: ['megapascal', 'megapascals'],
    description: 'One million pascals'
  },
  {
    id: 'bar',
    name: 'Bar',
    symbol: 'bar',
    category: 'pressure',
    system: 'metric',
    factorToBase: 100000, // 10^5 Pa exact
    standardConvention: 'Exactly 100,000 Pa (100 kPa)',
    aliases: ['bars'],
    description: 'Metric unit of pressure, exactly 100,000 Pascals'
  },
  {
    id: 'mbar',
    name: 'Millibar',
    symbol: 'mbar',
    category: 'pressure',
    system: 'metric',
    factorToBase: 100, // 1 hPa exact
    standardConvention: 'Exactly 100 Pa (1 hPa)',
    aliases: ['millibar', 'millibars', 'hPa'],
    description: 'One thousandth of a bar (100 Pa), equivalent to hectopascal'
  },
  {
    id: 'atm',
    name: 'Standard Atmosphere',
    symbol: 'atm',
    category: 'pressure',
    system: 'other',
    factorToBase: 101325, // 10th CGPM (1954) exact standard
    standardConvention: '10th CGPM standard atmosphere: exactly 101,325 Pa',
    aliases: ['atmosphere', 'atmospheres'],
    description: 'Standard atmosphere, defined as exactly 101,325 Pascals'
  },
  {
    id: 'psi',
    name: 'Pounds per Square Inch',
    symbol: 'psi',
    category: 'pressure',
    system: 'imperial',
    factorToBase: 6894.757293168361, // 4.4482216152605 / 0.0254^2 exact
    standardConvention: '1 lbf / 1 in² = 6,894.757293168361 Pa (exact NIST definition)',
    aliases: ['PSI', 'lbf/in2', 'lb/in2'],
    description: 'Imperial pressure unit: pounds-force per square inch'
  },
  {
    id: 'Torr',
    name: 'Torr',
    symbol: 'Torr',
    category: 'pressure',
    system: 'other',
    factorToBase: 101325 / 760, // Exactly 1/760 of an atm ≈ 133.32236842105263 Pa
    standardConvention: 'Exactly 1/760 of a standard atmosphere = 101,325 / 760 Pa ≈ 133.322368 Pa',
    aliases: ['torr'],
    description: 'Defined as exactly 1/760 standard atmosphere (distinguished from mmHg)'
  },
  {
    id: 'mmHg',
    name: 'Millimeter of Mercury (Conventional)',
    symbol: 'mmHg',
    category: 'pressure',
    system: 'other',
    factorToBase: 133.322387415, // ISO 31-3 / NIST: 13.5951 g/cm³ * 9.80665 m/s² * 1 mm
    standardConvention: 'Conventional millimeter of mercury: 13.5951 g/cm³ * 9.80665 m/s² * 1 mm = 133.322387415 Pa',
    aliases: ['mm_hg', 'millimeter_of_mercury'],
    description: 'Conventional millimeter of mercury, defined as 133.322387415 Pa (distinguished from Torr)'
  }
];

const registry = new UnitRegistry<PressureUnit, PressureUnitInfo>('pressure', 'Pa', PRESSURE_UNITS);

/**
 * Converts pressure between supported units.
 * Supports absolute pressure conversions. Negative values rejected by default.
 */
export function convertPressure(
  value: number,
  from: PressureUnit | string,
  to: PressureUnit | string,
  options?: PressureConversionOptions
): number {
  const allowNegative = options?.allowNegative ?? false;
  validateNumber(value, 'pressure value', { allowNegative });
  return registry.convertLinear(value, from, to, options);
}

/**
 * Returns metadata for all supported pressure units.
 */
export function getPressureUnits(): PressureUnitInfo[] {
  return registry.getUnits();
}

/**
 * Retrieves unit metadata for a specific pressure unit or alias.
 */
export function getPressureUnitInfo(unit: PressureUnit | string): PressureUnitInfo | undefined {
  return registry.getUnitInfo(unit);
}

/**
 * Checks if the unit string is a valid pressure unit or alias.
 */
export function isValidPressureUnit(unit: string): unit is PressureUnit {
  return registry.isValidUnit(unit);
}
