import { describe, expect, it } from 'vitest';
import {
  convertLength,
  getLengthUnits,
  getLengthUnitInfo,
  isValidLengthUnit,
  type LengthUnit
} from '../../src/length-convert/index.js';
import { ConversionError } from '../../src/shared/errors.js';

describe('length-convert', () => {
  const allUnits: LengthUnit[] = [
    'nm',
    'um',
    'mm',
    'cm',
    'm',
    'km',
    'in',
    'ft',
    'yd',
    'mi',
    'nmi'
  ];

  it('registers all 11 required length units', () => {
    const units = getLengthUnits();
    expect(units).toHaveLength(11);
    for (const unit of allUnits) {
      expect(isValidLengthUnit(unit)).toBe(true);
    }
  });

  it('retrieves unit info correctly', () => {
    expect(getLengthUnitInfo('m')?.name).toBe('Meter');
    expect(getLengthUnitInfo('nmi')?.factorToBase).toBe(1852);
    expect(getLengthUnitInfo('unknown')).toBeUndefined();
  });

  it('converts metric prefixes accurately', () => {
    expect(convertLength(1, 'm', 'nm')).toBe(1e9);
    expect(convertLength(1, 'm', 'um')).toBe(1e6);
    expect(convertLength(1, 'm', 'mm')).toBe(1000);
    expect(convertLength(1, 'm', 'cm')).toBe(100);
    expect(convertLength(1, 'km', 'm')).toBe(1000);
  });

  it('converts imperial and international standard units accurately', () => {
    // 1 in = 0.0254 m exact
    expect(convertLength(1, 'in', 'm')).toBe(0.0254);
    // 1 ft = 12 in = 0.3048 m exact
    expect(convertLength(1, 'ft', 'in')).toBe(12);
    expect(convertLength(1, 'ft', 'm')).toBe(0.3048);
    // 1 yd = 3 ft = 36 in = 0.9144 m exact
    expect(convertLength(1, 'yd', 'ft')).toBe(3);
    expect(convertLength(1, 'yd', 'm')).toBe(0.9144);
    // 1 mi = 5280 ft = 1609.344 m exact
    expect(convertLength(1, 'mi', 'ft')).toBe(5280);
    expect(convertLength(1, 'mi', 'm')).toBe(1609.344);
    // 1 nmi = 1852 m exact
    expect(convertLength(1, 'nmi', 'm')).toBe(1852);
  });

  it('tests roundtrip conversion across all unit pairs', () => {
    for (const u1 of allUnits) {
      for (const u2 of allUnits) {
        const converted = convertLength(10, u1, u2);
        const back = convertLength(converted, u2, u1);
        expect(back).toBeCloseTo(10, 6);
      }
    }
  });

  it('validates negative values by default', () => {
    expect(() => convertLength(-10, 'm', 'km')).toThrow(ConversionError);
    expect(convertLength(-10, 'm', 'km', { allowNegative: true })).toBe(-0.01);
  });

  it('supports decimal values and precision configuration', () => {
    const raw = convertLength(1.75, 'mi', 'km');
    const rounded = convertLength(1.75, 'mi', 'km', { precision: 3 });
    expect(raw).toBe(2.816352);
    expect(rounded).toBe(2.816);
  });
});
