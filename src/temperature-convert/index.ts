import {
  ConversionError,
  type ConversionOptions,
  type UnitInfo,
  applyPrecision,
  validateNumber
} from '../shared/index.js';

export type TemperatureUnit = 'C' | 'F' | 'K';

export interface TemperatureUnitInfo extends UnitInfo<TemperatureUnit> {
  category: 'temperature';
  absoluteZero: number;
}

export interface TemperatureConversionOptions extends ConversionOptions {
  /**
   * Whether to allow temperatures below physical absolute zero (0 K, -273.15 °C, -459.67 °F).
   * @default false
   */
  allowBelowAbsoluteZero?: boolean;
}

const EPSILON = 1e-9;

const TEMPERATURE_UNITS: readonly TemperatureUnitInfo[] = [
  {
    id: 'C',
    name: 'Celsius',
    symbol: '°C',
    category: 'temperature',
    system: 'metric',
    factorToBase: 1, // affine scale, base offset applied separately
    absoluteZero: -273.15,
    aliases: ['celsius', '°C', 'degC', 'deg_c', 'degree_celsius'],
    description: 'Degree Celsius, defined relative to Kelvin (0 °C = 273.15 K)'
  },
  {
    id: 'F',
    name: 'Fahrenheit',
    symbol: '°F',
    category: 'temperature',
    system: 'imperial',
    factorToBase: 5 / 9,
    absoluteZero: -459.67,
    aliases: ['fahrenheit', '°F', 'degF', 'deg_f', 'degree_fahrenheit'],
    description: 'Degree Fahrenheit (32 °F = 0 °C, 212 °F = 100 °C)'
  },
  {
    id: 'K',
    name: 'Kelvin',
    symbol: 'K',
    category: 'temperature',
    system: 'si',
    factorToBase: 1,
    absoluteZero: 0,
    aliases: ['kelvin', 'degK', 'deg_k', 'degrees_kelvin'],
    description: 'SI base unit of thermodynamic temperature (canonical base unit)'
  }
];

const unitMap = new Map<TemperatureUnit, TemperatureUnitInfo>();
const aliasMap = new Map<string, TemperatureUnit>();

for (const unit of TEMPERATURE_UNITS) {
  unitMap.set(unit.id, Object.freeze({ ...unit }));
  aliasMap.set(unit.id, unit.id);
  aliasMap.set(unit.symbol, unit.id);
  if (unit.aliases) {
    for (const alias of unit.aliases) {
      aliasMap.set(alias, unit.id);
    }
  }
}

export function resolveTemperatureUnit(unit: string): TemperatureUnit | undefined {
  if (typeof unit !== 'string') return undefined;
  if (unitMap.has(unit as TemperatureUnit)) {
    return unit as TemperatureUnit;
  }
  const match = aliasMap.get(unit) || aliasMap.get(unit.trim());
  return match;
}

/**
 * Validates that a temperature value is not below absolute zero (subject to floating-point epsilon).
 */
function validateAbsoluteZero(value: number, unitId: TemperatureUnit): void {
  const info = unitMap.get(unitId)!;
  if (value < info.absoluteZero - EPSILON) {
    throw new ConversionError(
      `Temperature ${value} ${info.symbol} is below absolute zero (${info.absoluteZero} ${info.symbol})`,
      'OUT_OF_RANGE',
      { value, unit: unitId, absoluteZero: info.absoluteZero }
    );
  }
}

/**
 * Converts any temperature to canonical Kelvin (K).
 */
function toKelvin(value: number, from: TemperatureUnit): number {
  switch (from) {
    case 'K':
      return value;
    case 'C':
      return value + 273.15;
    case 'F':
      return (value + 459.67) * (5 / 9);
  }
}

/**
 * Converts canonical Kelvin (K) to target temperature unit.
 */
function fromKelvin(kelvin: number, to: TemperatureUnit): number {
  switch (to) {
    case 'K':
      return kelvin;
    case 'C':
      return kelvin - 273.15;
    case 'F':
      return kelvin * (9 / 5) - 459.67;
  }
}

/**
 * Converts a temperature value from one unit to another using affine transformations.
 * Rejects values below absolute zero by default.
 */
export function convertTemperature(
  value: number,
  from: TemperatureUnit | string,
  to: TemperatureUnit | string,
  options?: TemperatureConversionOptions
): number {
  validateNumber(value, 'temperature value');

  const fromId = resolveTemperatureUnit(from);
  if (!fromId) {
    throw new ConversionError(
      `Unknown temperature unit: "${from}". Supported units: C, F, K`,
      'UNKNOWN_UNIT',
      { unit: from, category: 'temperature' }
    );
  }

  const toId = resolveTemperatureUnit(to);
  if (!toId) {
    throw new ConversionError(
      `Unknown temperature unit: "${to}". Supported units: C, F, K`,
      'UNKNOWN_UNIT',
      { unit: to, category: 'temperature' }
    );
  }

  const allowBelow = options?.allowBelowAbsoluteZero ?? false;
  if (!allowBelow) {
    validateAbsoluteZero(value, fromId);
  }

  if (fromId === toId) {
    return applyPrecision(value, options?.precision, options?.roundMode);
  }

  // Direct fast-path for C <-> F to avoid intermediate floating-point rounding quirks
  let result: number;
  if (fromId === 'C' && toId === 'F') {
    result = value * (9 / 5) + 32;
  } else if (fromId === 'F' && toId === 'C') {
    result = (value - 32) * (5 / 9);
  } else {
    const kelvin = toKelvin(value, fromId);
    result = fromKelvin(kelvin, toId);
  }

  // Handle -0 floating point artifact
  if (Object.is(result, -0)) {
    result = 0;
  }

  return applyPrecision(result, options?.precision, options?.roundMode);
}

/**
 * Helper: converts Celsius to Fahrenheit.
 */
export function celsiusToFahrenheit(celsius: number, options?: ConversionOptions): number {
  return convertTemperature(celsius, 'C', 'F', options);
}

/**
 * Helper: converts Fahrenheit to Celsius.
 */
export function fahrenheitToCelsius(fahrenheit: number, options?: ConversionOptions): number {
  return convertTemperature(fahrenheit, 'F', 'C', options);
}

/**
 * Helper: converts Celsius to Kelvin.
 */
export function celsiusToKelvin(celsius: number, options?: ConversionOptions): number {
  return convertTemperature(celsius, 'C', 'K', options);
}

/**
 * Helper: converts Kelvin to Celsius.
 */
export function kelvinToCelsius(kelvin: number, options?: ConversionOptions): number {
  return convertTemperature(kelvin, 'K', 'C', options);
}

/**
 * Returns metadata for all supported temperature units.
 */
export function getTemperatureUnits(): TemperatureUnitInfo[] {
  return Array.from(unitMap.values());
}

/**
 * Retrieves metadata for a specific temperature unit or alias.
 */
export function getTemperatureUnitInfo(unit: TemperatureUnit | string): TemperatureUnitInfo | undefined {
  const id = resolveTemperatureUnit(unit);
  if (!id) return undefined;
  return unitMap.get(id);
}

/**
 * Checks if a string is a valid temperature unit or alias.
 */
export function isValidTemperatureUnit(unit: string): unit is TemperatureUnit {
  return resolveTemperatureUnit(unit) !== undefined;
}
