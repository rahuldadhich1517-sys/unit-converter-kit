import { describe, expect, it } from 'vitest';
import {
  convertTemperature,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  celsiusToKelvin,
  kelvinToCelsius,
  getTemperatureUnits,
  getTemperatureUnitInfo,
  isValidTemperatureUnit,
  type TemperatureUnit
} from '../../src/temperature-convert/index.js';
import { ConversionError } from '../../src/shared/errors.js';

describe('temperature-convert', () => {
  const allUnits: TemperatureUnit[] = ['C', 'F', 'K'];

  it('registers all 3 required temperature units', () => {
    const units = getTemperatureUnits();
    expect(units).toHaveLength(3);
    for (const unit of allUnits) {
      expect(isValidTemperatureUnit(unit)).toBe(true);
    }
  });

  it('converts freezing point of water (0 °C = 32 °F = 273.15 K)', () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
    expect(fahrenheitToCelsius(32)).toBe(0);
    expect(celsiusToKelvin(0)).toBe(273.15);
    expect(kelvinToCelsius(273.15)).toBe(0);
  });

  it('converts boiling point of water (100 °C = 212 °F = 373.15 K)', () => {
    expect(celsiusToFahrenheit(100)).toBe(212);
    expect(fahrenheitToCelsius(212)).toBe(100);
    expect(celsiusToKelvin(100)).toBe(373.15);
    expect(kelvinToCelsius(373.15)).toBe(100);
  });

  it('converts -40 degrees (cross-over point where °C === °F)', () => {
    expect(celsiusToFahrenheit(-40)).toBe(-40);
    expect(fahrenheitToCelsius(-40)).toBe(-40);
  });

  it('handles absolute zero correctly across all 3 units', () => {
    // Absolute zero: 0 K = -273.15 °C = -459.67 °F
    expect(convertTemperature(0, 'K', 'C')).toBe(-273.15);
    expect(convertTemperature(0, 'K', 'F')).toBeCloseTo(-459.67, 2);
    expect(convertTemperature(-273.15, 'C', 'K')).toBe(0);
    expect(convertTemperature(-459.67, 'F', 'K')).toBeCloseTo(0, 4);
  });

  it('validates against temperatures below physical absolute zero by default', () => {
    expect(() => convertTemperature(-273.16, 'C', 'K')).toThrow(ConversionError);
    expect(() => convertTemperature(-460, 'F', 'C')).toThrow(ConversionError);
    expect(() => convertTemperature(-1, 'K', 'C')).toThrow(ConversionError);

    // Permitted when allowBelowAbsoluteZero: true
    expect(convertTemperature(-10, 'K', 'C', { allowBelowAbsoluteZero: true })).toBe(-283.15);
  });

  it('tolerates small floating-point error near absolute zero', () => {
    // E.g., -273.15000000000005 is within epsilon
    expect(() => convertTemperature(-273.1500000000001, 'C', 'K')).not.toThrow();
  });

  it('supports decimal precision configuration', () => {
    const raw = convertTemperature(98.6, 'F', 'C');
    const rounded = convertTemperature(98.6, 'F', 'C', { precision: 2 });
    expect(raw).toBe(37);
    expect(rounded).toBe(37);
  });

  it('retrieves unit info correctly', () => {
    expect(getTemperatureUnitInfo('C')?.name).toBe('Celsius');
    expect(getTemperatureUnitInfo('unknown')).toBeUndefined();
    // Test same unit conversion
    expect(convertTemperature(25, 'C', 'C')).toBe(25);
  });

  it('rejects unknown temperature units', () => {
    expect(() => convertTemperature(100, 'Rankine', 'C')).toThrow(ConversionError);
    expect(() => convertTemperature(100, 'C', 'Rankine')).toThrow(ConversionError);
  });
});
