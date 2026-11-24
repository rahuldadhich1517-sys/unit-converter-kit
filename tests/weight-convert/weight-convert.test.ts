import { describe, expect, it } from 'vitest';
import {
  convertMass,
  convertWeight,
  massToWeight,
  weightToMass,
  getMassUnits,
  getWeightUnits,
  getWeightUnitInfo,
  isValidMassUnit,
  isValidForceUnit,
  STANDARD_GRAVITY
} from '../../src/weight-convert/index.js';
import { ConversionError } from '../../src/shared/errors.js';

describe('weight-convert (mass and force)', () => {
  it('registers all 10 mass units and 6 force units', () => {
    const massUnits = getMassUnits();
    expect(massUnits).toHaveLength(10);
    const forceUnits = getWeightUnits();
    expect(forceUnits).toHaveLength(6);

    expect(isValidMassUnit('kg')).toBe(true);
    expect(isValidMassUnit('lb')).toBe(true);
    expect(isValidMassUnit('N')).toBe(false);

    expect(isValidForceUnit('N')).toBe(true);
    expect(isValidForceUnit('lbf')).toBe(true);
    expect(isValidForceUnit('kg')).toBe(false);
  });

  describe('convertMass', () => {
    it('converts metric mass units accurately', () => {
      expect(convertMass(1, 'kg', 'g')).toBe(1000);
      expect(convertMass(1, 'g', 'mg')).toBe(1000);
      expect(convertMass(1, 'mg', 'ug')).toBe(1000);
      expect(convertMass(1, 't', 'kg')).toBe(1000);
    });

    it('converts imperial mass units accurately (1 lb = 0.45359237 kg)', () => {
      // International avoirdupois pound exact
      expect(convertMass(1, 'lb', 'kg')).toBe(0.45359237);
      // 1 lb = 16 oz
      expect(convertMass(1, 'lb', 'oz')).toBe(16);
      // 1 stone = 14 lb
      expect(convertMass(1, 'st', 'lb')).toBe(14);
      // US short ton = 2000 lb
      expect(convertMass(1, 'us-ton', 'lb')).toBe(2000);
      // UK long ton = 2240 lb
      expect(convertMass(1, 'imperial-ton', 'lb')).toBe(2240);
    });

    it('validates negative mass by default', () => {
      expect(() => convertMass(-5, 'kg', 'lb')).toThrow(ConversionError);
      expect(convertMass(-5, 'kg', 'lb', { allowNegative: true })).toBeCloseTo(-11.0231, 3);
    });
  });

  describe('convertWeight (force)', () => {
    it('converts force units accurately', () => {
      expect(convertWeight(1, 'kN', 'N')).toBe(1000);
      expect(convertWeight(1, 'MN', 'kN')).toBe(1000);
      // 1 kgf = 9.80665 N exact
      expect(convertWeight(1, 'kgf', 'N')).toBe(9.80665);
      // 1 lbf = 4.4482216152605 N exact
      expect(convertWeight(1, 'lbf', 'N')).toBe(4.4482216152605);
      // 1 dyn = 1e-5 N
      expect(convertWeight(1, 'dyn', 'N')).toBe(1e-5);
    });
  });

  describe('massToWeight and weightToMass with gravity', () => {
    it('strictly requires gravity to convert mass to weight force', () => {
      // Under default standard gravity (9.80665 m/s²), 1 kg weighs 9.80665 N
      expect(massToWeight(1, 'kg', 'N')).toBe(9.80665);
      // 1 lb under standard gravity exerts exactly 1 lbf
      expect(massToWeight(1, 'lb', 'lbf')).toBeCloseTo(1, 10);
    });

    it('supports custom gravitational acceleration (e.g. Moon gravity ≈ 1.62 m/s²)', () => {
      const moonWeightN = massToWeight(100, 'kg', 'N', 1.62);
      expect(moonWeightN).toBe(162);

      const earthWeightN = massToWeight(100, 'kg', 'N', STANDARD_GRAVITY);
      expect(earthWeightN).toBe(980.665);
    });

    it('converts weight back to mass accurately (weightToMass)', () => {
      expect(weightToMass(9.80665, 'N', 'kg')).toBe(1);
      expect(weightToMass(162, 'N', 'kg', 1.62)).toBe(100);
    });

    it('supports precision and rounding options for massToWeight and weightToMass', () => {
      const w = massToWeight(10, 'kg', 'N', STANDARD_GRAVITY, { precision: 1 });
      expect(w).toBe(98.1);
      const m = weightToMass(98.1, 'N', 'kg', STANDARD_GRAVITY, { precision: 1 });
      expect(m).toBe(10);
    });

    it('handles negative mass/weight when allowNegative is true', () => {
      expect(massToWeight(-10, 'kg', 'N', STANDARD_GRAVITY, { allowNegative: true })).toBe(-98.0665);
      expect(weightToMass(-98.0665, 'N', 'kg', STANDARD_GRAVITY, { allowNegative: true })).toBe(-10);
    });
  });

  describe('getWeightUnitInfo', () => {
    it('returns info for both mass and force units', () => {
      expect(getWeightUnitInfo('kg')?.category).toBe('mass');
      expect(getWeightUnitInfo('N')?.category).toBe('force');
      expect(getWeightUnitInfo('unknown')).toBeUndefined();
    });
  });
});
