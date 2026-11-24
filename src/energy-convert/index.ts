import {
  type ConversionOptions,
  type UnitInfo,
  UnitRegistry,
  validateNumber
} from '../shared/index.js';

export type EnergyUnit =
  | 'J'
  | 'kJ'
  | 'MJ'
  | 'Wh'
  | 'kWh'
  | 'MWh'
  | 'cal'
  | 'kcal'
  | 'eV'
  | 'BTU';

export interface EnergyUnitInfo extends UnitInfo<EnergyUnit> {
  category: 'energy';
  standardConvention: string;
}

const ENERGY_UNITS: readonly EnergyUnitInfo[] = [
  {
    id: 'J',
    name: 'Joule',
    symbol: 'J',
    category: 'energy',
    system: 'si',
    factorToBase: 1, // canonical base unit
    standardConvention: 'SI base derived unit (1 N·m = 1 W·s = 1 kg·m²/s²)',
    aliases: ['joule', 'joules'],
    description: 'SI unit of energy, work, and amount of heat'
  },
  {
    id: 'kJ',
    name: 'Kilojoule',
    symbol: 'kJ',
    category: 'energy',
    system: 'si',
    factorToBase: 1000,
    standardConvention: '10^3 Joules',
    aliases: ['kilojoule', 'kilojoules'],
    description: 'One thousand joules'
  },
  {
    id: 'MJ',
    name: 'Megajoule',
    symbol: 'MJ',
    category: 'energy',
    system: 'si',
    factorToBase: 1000000,
    standardConvention: '10^6 Joules',
    aliases: ['megajoule', 'megajoules'],
    description: 'One million joules'
  },
  {
    id: 'Wh',
    name: 'Watt-hour',
    symbol: 'Wh',
    category: 'energy',
    system: 'metric',
    factorToBase: 3600,
    standardConvention: '1 W * 3600 s = 3,600 J (exact)',
    aliases: ['wh', 'watt-hour', 'watt_hour'],
    description: 'Unit of energy equivalent to one watt of power sustained for one hour'
  },
  {
    id: 'kWh',
    name: 'Kilowatt-hour',
    symbol: 'kWh',
    category: 'energy',
    system: 'metric',
    factorToBase: 3600000,
    standardConvention: '1000 W * 3600 s = 3,600,000 J (exact)',
    aliases: ['kwh', 'kilowatt-hour', 'kilowatt_hour'],
    description: 'Common electricity consumption unit (3.6 MJ)'
  },
  {
    id: 'MWh',
    name: 'Megawatt-hour',
    symbol: 'MWh',
    category: 'energy',
    system: 'metric',
    factorToBase: 3600000000,
    standardConvention: '10^6 W * 3600 s = 3.6 * 10^9 J (exact)',
    aliases: ['mwh', 'megawatt-hour', 'megawatt_hour'],
    description: 'Large-scale electricity generation unit (3.6 GJ)'
  },
  {
    id: 'cal',
    name: 'Calorie (Thermochemical)',
    symbol: 'cal',
    category: 'energy',
    system: 'other',
    factorToBase: 4.184, // Thermochemical calorie (ISO 80000-5 / NIST exact standard)
    standardConvention: 'Thermochemical calorie: exactly 4.184 J (NIST / IUPAC)',
    aliases: ['calorie', 'calories', 'cal_th'],
    description: 'Thermochemical calorie, exactly defined as 4.184 Joules'
  },
  {
    id: 'kcal',
    name: 'Kilocalorie (Thermochemical)',
    symbol: 'kcal',
    category: 'energy',
    system: 'other',
    factorToBase: 4184,
    standardConvention: 'Thermochemical kilocalorie: exactly 4,184 J (commonly dietary Calorie)',
    aliases: ['kilocalorie', 'kilocalories', 'Calorie', 'Cal'],
    description: 'One thousand thermochemical calories (4,184 J)'
  },
  {
    id: 'eV',
    name: 'Electronvolt',
    symbol: 'eV',
    category: 'energy',
    system: 'si',
    factorToBase: 1.602176634e-19, // CODATA 2018/2022 exact elementary charge e in J
    standardConvention: 'CODATA 2018/2022 exact value: 1.602176634 * 10^-19 J',
    aliases: ['ev', 'electronvolt', 'electronvolts'],
    description: 'Amount of kinetic energy gained by an electron accelerating through one volt'
  },
  {
    id: 'BTU',
    name: 'British Thermal Unit (IT)',
    symbol: 'BTU',
    category: 'energy',
    system: 'imperial',
    factorToBase: 1055.05585262, // International Table (IT) BTU (ISO 31-4)
    standardConvention: 'International Table (IT) BTU: exactly 1055.05585262 J (ISO 31-4 / 5th ICPS)',
    aliases: ['btu', 'Btu'],
    description: 'International Table British Thermal Unit (1055.05585262 J)'
  }
];

const registry = new UnitRegistry<EnergyUnit, EnergyUnitInfo>('energy', 'J', ENERGY_UNITS);

/**
 * Converts energy between supported units.
 */
export function convertEnergy(
  value: number,
  from: EnergyUnit | string,
  to: EnergyUnit | string,
  options?: ConversionOptions
): number {
  validateNumber(value, 'energy value', { allowNegative: options?.allowNegative });
  return registry.convertLinear(value, from, to, options);
}

/**
 * Returns metadata for all registered energy units.
 */
export function getEnergyUnits(): EnergyUnitInfo[] {
  return registry.getUnits();
}

/**
 * Retrieves unit metadata for a specific energy unit or alias.
 */
export function getEnergyUnitInfo(unit: EnergyUnit | string): EnergyUnitInfo | undefined {
  return registry.getUnitInfo(unit);
}

/**
 * Checks if the unit string is a valid energy unit or alias.
 */
export function isValidEnergyUnit(unit: string): unit is EnergyUnit {
  return registry.isValidUnit(unit);
}
