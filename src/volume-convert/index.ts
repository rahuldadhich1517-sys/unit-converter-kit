import {
  type ConversionOptions,
  type UnitInfo,
  UnitRegistry,
  validateNumber
} from '../shared/index.js';

export type VolumeUnit =
  // Metric
  | 'mm3'
  | 'cm3'
  | 'mL'
  | 'L'
  | 'm3'
  // US Customary / Imperial cubic
  | 'in3'
  | 'ft3'
  | 'yd3'
  // US Customary Fluid
  | 'us-fl-oz'
  | 'us-cup'
  | 'us-pt'
  | 'us-qt'
  | 'us-gal'
  // Imperial Fluid
  | 'imp-fl-oz'
  | 'imp-pt'
  | 'imp-qt'
  | 'imp-gal';

export interface VolumeUnitInfo extends UnitInfo<VolumeUnit> {
  category: 'volume';
  standardConvention: string;
}

export interface VolumeConversionOptions extends ConversionOptions {
  /**
   * Whether to allow negative volume values. Physical volume is non-negative by default.
   * @default false
   */
  allowNegative?: boolean;
}

const VOLUME_UNITS: readonly VolumeUnitInfo[] = [
  // Metric
  {
    id: 'mm3',
    name: 'Cubic Millimeter',
    symbol: 'mm³',
    category: 'volume',
    system: 'metric',
    factorToBase: 1e-9, // (1e-3)^3
    standardConvention: '10^-9 m³',
    aliases: ['mm³', 'cubic_millimeter', 'cu_mm'],
    description: 'One billionth of a cubic meter'
  },
  {
    id: 'cm3',
    name: 'Cubic Centimeter',
    symbol: 'cm³',
    category: 'volume',
    system: 'metric',
    factorToBase: 1e-6, // (1e-2)^3
    standardConvention: '10^-6 m³ (exactly 1 mL)',
    aliases: ['cm³', 'cubic_centimeter', 'cc', 'cu_cm'],
    description: 'One millionth of a cubic meter, exactly equal to 1 mL'
  },
  {
    id: 'mL',
    name: 'Milliliter',
    symbol: 'mL',
    category: 'volume',
    system: 'metric',
    factorToBase: 1e-6,
    standardConvention: '10^-3 L = 10^-6 m³',
    aliases: ['ml', 'milliliter', 'millilitre'],
    description: 'Metric volume unit, exactly 1 cm³'
  },
  {
    id: 'L',
    name: 'Liter',
    symbol: 'L',
    category: 'volume',
    system: 'metric',
    factorToBase: 0.001, // 1 dm^3
    standardConvention: '1 dm³ = 0.001 m³',
    aliases: ['l', 'liter', 'litre', 'liters', 'litres'],
    description: 'Special name for the cubic decimeter (0.001 m³)'
  },
  {
    id: 'm3',
    name: 'Cubic Meter',
    symbol: 'm³',
    category: 'volume',
    system: 'si',
    factorToBase: 1, // canonical base unit
    standardConvention: 'SI derived unit of volume (canonical base unit)',
    aliases: ['m³', 'cubic_meter', 'cu_m'],
    description: 'SI base derived unit of volume'
  },

  // Imperial & US Customary Cubic
  {
    id: 'in3',
    name: 'Cubic Inch',
    symbol: 'in³',
    category: 'volume',
    system: 'imperial',
    factorToBase: 0.000016387064, // (0.0254)^3 exact
    standardConvention: '(0.0254 m)³ = 0.000016387064 m³ (exact)',
    aliases: ['in³', 'cubic_inch', 'cu_in'],
    description: 'Cubic inch, exactly 16.387064 cm³'
  },
  {
    id: 'ft3',
    name: 'Cubic Foot',
    symbol: 'ft³',
    category: 'volume',
    system: 'imperial',
    factorToBase: 0.028316846592, // (0.3048)^3 exact
    standardConvention: '(0.3048 m)³ = 0.028316846592 m³ (exact)',
    aliases: ['ft³', 'cubic_foot', 'cu_ft'],
    description: 'Cubic foot, exactly 28.316846592 Liters'
  },
  {
    id: 'yd3',
    name: 'Cubic Yard',
    symbol: 'yd³',
    category: 'volume',
    system: 'imperial',
    factorToBase: 0.764554857984, // (0.9144)^3 exact
    standardConvention: '(0.9144 m)³ = 0.764554857984 m³ (exact)',
    aliases: ['yd³', 'cubic_yard', 'cu_yd'],
    description: 'Cubic yard, exactly 0.764554857984 m³'
  },

  // US Customary Fluid Units
  {
    id: 'us-fl-oz',
    name: 'US Fluid Ounce',
    symbol: 'fl oz (US)',
    category: 'volume',
    system: 'us-customary',
    factorToBase: 0.0000295735295625, // 231 / 128 in^3 = 29.5735295625 mL exact
    standardConvention: '1/128 US gallon = 29.5735295625 mL (exact)',
    aliases: ['us_fl_oz', 'us-fluid-ounce', 'us_fluid_ounce'],
    description: 'US customary fluid ounce (approx. 29.57 mL)'
  },
  {
    id: 'us-cup',
    name: 'US Customary Cup',
    symbol: 'cup (US)',
    category: 'volume',
    system: 'us-customary',
    factorToBase: 0.0002365882365, // 8 US fl oz exact
    standardConvention: '8 US fluid ounces = 236.5882365 mL (exact)',
    aliases: ['us_cup', 'us-customary-cup'],
    description: 'US customary cup (8 US fluid ounces)'
  },
  {
    id: 'us-pt',
    name: 'US Liquid Pint',
    symbol: 'pt (US)',
    category: 'volume',
    system: 'us-customary',
    factorToBase: 0.000473176473, // 16 US fl oz exact
    standardConvention: '16 US fluid ounces = 473.176473 mL (exact)',
    aliases: ['us_pt', 'us_pint', 'us-pint', 'us-liquid-pint'],
    description: 'US liquid pint (16 US fluid ounces)'
  },
  {
    id: 'us-qt',
    name: 'US Liquid Quart',
    symbol: 'qt (US)',
    category: 'volume',
    system: 'us-customary',
    factorToBase: 0.000946352946, // 32 US fl oz exact
    standardConvention: '32 US fluid ounces = 946.352946 mL (exact)',
    aliases: ['us_qt', 'us_quart', 'us-quart', 'us-liquid-quart'],
    description: 'US liquid quart (32 US fluid ounces)'
  },
  {
    id: 'us-gal',
    name: 'US Liquid Gallon',
    symbol: 'gal (US)',
    category: 'volume',
    system: 'us-customary',
    factorToBase: 0.003785411784, // 231 in^3 exact = 3.785411784 L
    standardConvention: '231 cubic inches = 3.785411784 L (exact NIST definition)',
    aliases: ['us_gal', 'us_gallon', 'us-gallon', 'us-liquid-gallon'],
    description: 'US liquid gallon (defined as exactly 231 cubic inches)'
  },

  // Imperial Fluid Units
  {
    id: 'imp-fl-oz',
    name: 'Imperial Fluid Ounce',
    symbol: 'fl oz (Imp)',
    category: 'volume',
    system: 'imperial',
    factorToBase: 0.0000284130625, // 4.54609 / 160 L exact
    standardConvention: '1/160 Imperial gallon = 28.4130625 mL (exact Weights & Measures Act)',
    aliases: ['imp_fl_oz', 'imperial-fl-oz', 'imperial_fl_oz', 'imperial-fluid-ounce'],
    description: 'Imperial fluid ounce (exactly 28.4130625 mL)'
  },
  {
    id: 'imp-pt',
    name: 'Imperial Pint',
    symbol: 'pt (Imp)',
    category: 'volume',
    system: 'imperial',
    factorToBase: 0.00056826125, // 20 Imp fl oz exact
    standardConvention: '20 Imperial fluid ounces = 568.26125 mL (exact)',
    aliases: ['imp_pt', 'imperial_pt', 'imperial_pint', 'imperial-pint'],
    description: 'Imperial pint (20 Imperial fluid ounces, approx 568.26 mL)'
  },
  {
    id: 'imp-qt',
    name: 'Imperial Quart',
    symbol: 'qt (Imp)',
    category: 'volume',
    system: 'imperial',
    factorToBase: 0.0011365225, // 40 Imp fl oz exact
    standardConvention: '40 Imperial fluid ounces = 1.1365225 L (exact)',
    aliases: ['imp_qt', 'imperial_qt', 'imperial_quart', 'imperial-quart'],
    description: 'Imperial quart (40 Imperial fluid ounces, approx 1.1365 L)'
  },
  {
    id: 'imp-gal',
    name: 'Imperial Gallon',
    symbol: 'gal (Imp)',
    category: 'volume',
    system: 'imperial',
    factorToBase: 0.00454609, // exactly 4.54609 L
    standardConvention: 'Exactly 4.54609 Liters (Weights and Measures Act 1985)',
    aliases: ['imp_gal', 'imperial_gal', 'imperial_gallon', 'imperial-gallon'],
    description: 'Imperial gallon, defined as exactly 4.54609 Liters'
  }
];

const registry = new UnitRegistry<VolumeUnit, VolumeUnitInfo>('volume', 'm3', VOLUME_UNITS);

/**
 * Converts volume between supported metric, US customary, and imperial units.
 * Note: Ambiguous terms like "gallon" or "pint" without qualification are rejected;
 * specify 'us-gal' or 'imp-gal' explicitly.
 */
export function convertVolume(
  value: number,
  from: VolumeUnit | string,
  to: VolumeUnit | string,
  options?: VolumeConversionOptions
): number {
  const allowNegative = options?.allowNegative ?? false;
  validateNumber(value, 'volume value', { allowNegative });
  return registry.convertLinear(value, from, to, options);
}

/**
 * Returns metadata for all supported volume units.
 */
export function getVolumeUnits(): VolumeUnitInfo[] {
  return registry.getUnits();
}

/**
 * Retrieves unit metadata for a specific volume unit or alias.
 */
export function getVolumeUnitInfo(unit: VolumeUnit | string): VolumeUnitInfo | undefined {
  return registry.getUnitInfo(unit);
}

/**
 * Checks if a string is a valid volume unit or alias.
 */
export function isValidVolumeUnit(unit: string): unit is VolumeUnit {
  return registry.isValidUnit(unit);
}
