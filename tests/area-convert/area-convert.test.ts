import { describe, expect, it } from 'vitest';
import {
  convertArea,
  getAreaUnits,
  getAreaUnitInfo,
  isValidAreaUnit,
  getAreaConversionFactor,
  type AreaUnit
} from '../../src/area-convert/index.js';
import { ConversionError } from '../../src/shared/errors.js';

describe('area-convert', () => {
  const allUnits: AreaUnit[] = ['mm2', 'cm2', 'm2', 'km2', 'in2', 'ft2', 'yd2', 'mi2', 'ac', 'ha'];

  it('provides metadata for all 10 supported area units', () => {
    const units = getAreaUnits();
    expect(units).toHaveLength(10);
    const unitIds = units.map(u => u.id);
    for (const unit of allUnits) {
      expect(unitIds).toContain(unit);
    }
  });

  it('retrieves unit info and validates correctly', () => {
    expect(getAreaUnitInfo('m2')?.name).toBe('Square Meter');
    expect(getAreaUnitInfo('ha')?.symbol).toBe('ha');
    expect(getAreaUnitInfo('acre')?.id).toBe('ac');
    expect(getAreaUnitInfo('unknown')).toBeUndefined();

    expect(isValidAreaUnit('m2')).toBe(true);
    expect(isValidAreaUnit('sq_ft')).toBe(true);
    expect(isValidAreaUnit('non_existent')).toBe(false);
  });

  it('converts accurately between metric area units', () => {
    // 1 m2 = 1,000,000 mm2
    expect(convertArea(1, 'm2', 'mm2')).toBe(1000000);
    // 1 m2 = 10,000 cm2
    expect(convertArea(1, 'm2', 'cm2')).toBe(10000);
    // 1 km2 = 1,000,000 m2
    expect(convertArea(1, 'km2', 'm2')).toBe(1000000);
    // 1 ha = 10,000 m2
    expect(convertArea(1, 'ha', 'm2')).toBe(10000);
    expect(convertArea(100, 'ha', 'km2')).toBe(1);
  });

  it('converts accurately between imperial units and metric reference', () => {
    // 1 in2 = 0.00064516 m2 exact
    expect(convertArea(1, 'in2', 'm2')).toBe(0.00064516);
    // 1 ft2 = 144 in2 = 0.09290304 m2 exact
    expect(convertArea(1, 'ft2', 'in2')).toBe(144);
    expect(convertArea(1, 'ft2', 'm2')).toBe(0.09290304);
    // 1 yd2 = 9 ft2 = 0.83612736 m2 exact
    expect(convertArea(1, 'yd2', 'ft2')).toBe(9);
    expect(convertArea(1, 'yd2', 'm2')).toBe(0.83612736);
    // 1 mi2 = 640 acres
    expect(convertArea(1, 'mi2', 'ac')).toBe(640);
    // 1 acre = 43,560 sq ft
    expect(convertArea(1, 'ac', 'ft2')).toBe(43560);
  });

  it('tests all unit pairs through canonical base unit roundtrip', () => {
    for (const unit of allUnits) {
      const toBase = convertArea(10, unit, 'm2');
      const fromBase = convertArea(toBase, 'm2', unit);
      expect(fromBase).toBeCloseTo(10, 8);
    }
  });

  it('calculates conversion factors correctly', () => {
    expect(getAreaConversionFactor('km2', 'm2')).toBe(1000000);
    expect(getAreaConversionFactor('m2', 'ha')).toBe(0.0001);
  });

  it('supports decimal inputs and configurable precision', () => {
    const raw = convertArea(1.5, 'ha', 'ac');
    const rounded = convertArea(1.5, 'ha', 'ac', { precision: 2 });
    expect(raw).toBeGreaterThan(3.7);
    expect(rounded).toBe(3.71);
  });

  it('validates negative values for physical area by default', () => {
    expect(() => convertArea(-5, 'm2', 'ft2')).toThrow(ConversionError);
    // Allowed when allowNegative: true
    expect(convertArea(-5, 'm2', 'm2', { allowNegative: true })).toBe(-5);
  });

  it('rejects invalid units and invalid numbers', () => {
    expect(() => convertArea(10, 'invalid', 'm2')).toThrow(ConversionError);
    expect(() => convertArea(10, 'm2', 'invalid')).toThrow(ConversionError);
    expect(() => convertArea(NaN, 'm2', 'ft2')).toThrow(ConversionError);
  });
});
