import { describe, expect, it } from 'vitest';
import {
  convertPressure,
  getPressureUnits,
  getPressureUnitInfo,
  isValidPressureUnit,
  type PressureUnit
} from '../../src/pressure-convert/index.js';
import { ConversionError } from '../../src/shared/errors.js';

describe('pressure-convert', () => {
  const allUnits: PressureUnit[] = ['Pa', 'kPa', 'MPa', 'bar', 'mbar', 'atm', 'psi', 'Torr', 'mmHg'];

  it('registers all 9 required pressure units and metadata', () => {
    const units = getPressureUnits();
    expect(units).toHaveLength(9);
    for (const unit of allUnits) {
      expect(isValidPressureUnit(unit)).toBe(true);
    }
    expect(getPressureUnitInfo('bar')?.symbol).toBe('bar');
    expect(getPressureUnitInfo('unknown')).toBeUndefined();
  });

  it('converts bar, mbar, atmosphere, and pascals accurately', () => {
    // 1 bar = 100,000 Pa exact
    expect(convertPressure(1, 'bar', 'Pa')).toBe(100000);
    // 1 mbar = 100 Pa exact
    expect(convertPressure(1, 'mbar', 'Pa')).toBe(100);
    expect(convertPressure(1000, 'mbar', 'bar')).toBe(1);
    // 1 atm = 101,325 Pa exact
    expect(convertPressure(1, 'atm', 'Pa')).toBe(101325);
    // 1 kPa = 1,000 Pa, 1 MPa = 1,000,000 Pa
    expect(convertPressure(1, 'MPa', 'kPa')).toBe(1000);
  });

  it('converts PSI accurately', () => {
    // 1 psi ≈ 6,894.757 Pa
    expect(convertPressure(1, 'psi', 'Pa')).toBeCloseTo(6894.757, 2);
    expect(convertPressure(1, 'atm', 'psi')).toBeCloseTo(14.69595, 4);
  });

  it('distinguishes Torr from mmHg', () => {
    // 1 Torr = 101325 / 760 Pa ≈ 133.3223684 Pa
    // 1 mmHg = 133.322387415 Pa
    const torrInPa = convertPressure(1, 'Torr', 'Pa');
    const mmhgInPa = convertPressure(1, 'mmHg', 'Pa');

    expect(torrInPa).toBeCloseTo(133.322368, 5);
    expect(mmhgInPa).toBeCloseTo(133.322387, 5);
    expect(torrInPa).not.toBe(mmhgInPa);
    // 760 Torr = exactly 1 standard atmosphere
    expect(convertPressure(760, 'Torr', 'atm')).toBe(1);
  });

  it('supports decimal inputs and precision rounding', () => {
    const rounded = convertPressure(2.5, 'bar', 'psi', { precision: 2 });
    expect(rounded).toBe(36.26);
  });

  it('validates negative values for absolute pressure by default', () => {
    expect(() => convertPressure(-1, 'bar', 'Pa')).toThrow(ConversionError);
    expect(convertPressure(-1, 'bar', 'Pa', { allowNegative: true })).toBe(-100000);
  });

  it('rejects unknown pressure units', () => {
    expect(() => convertPressure(100, 'pascal_gauge', 'Pa')).toThrow(ConversionError);
  });
});
