import { describe, expect, it } from 'vitest';
import {
  convertPower,
  getPowerUnits,
  getPowerUnitInfo,
  isValidPowerUnit,
  type PowerUnit
} from '../../src/power-convert/index.js';
import { ConversionError } from '../../src/shared/errors.js';

describe('power-convert', () => {
  const allUnits: PowerUnit[] = ['mW', 'W', 'kW', 'MW', 'GW', 'hp', 'PS', 'BTU/h'];

  it('registers all 8 required power units and metadata', () => {
    const units = getPowerUnits();
    expect(units).toHaveLength(8);
    for (const unit of allUnits) {
      expect(isValidPowerUnit(unit)).toBe(true);
    }
    expect(getPowerUnitInfo('hp')?.name).toContain('Horsepower');
    expect(getPowerUnitInfo('unknown')).toBeUndefined();
  });

  it('converts SI watt multiples accurately', () => {
    expect(convertPower(1, 'W', 'mW')).toBe(1000);
    expect(convertPower(1, 'kW', 'W')).toBe(1000);
    expect(convertPower(1, 'MW', 'kW')).toBe(1000);
    expect(convertPower(1, 'GW', 'MW')).toBe(1000);
  });

  it('strictly distinguishes mechanical horsepower from metric horsepower (PS)', () => {
    // Mechanical horsepower: 550 ft·lbf/s = 745.69987158227022 W
    const hpInW = convertPower(1, 'hp', 'W');
    expect(hpInW).toBeCloseTo(745.69987, 4);

    // Metric horsepower: 75 kgf·m/s = 735.49875 W
    const psInW = convertPower(1, 'PS', 'W');
    expect(psInW).toBe(735.49875);

    expect(hpInW).not.toBe(psInW);
    expect(convertPower(1, 'hp', 'PS')).toBeCloseTo(1.01387, 4);
  });

  it('converts BTU/h based on International Table BTU standard', () => {
    // 1055.05585262 / 3600 W ≈ 0.293071 W
    const btuPerHourInW = convertPower(1, 'BTU/h', 'W');
    expect(btuPerHourInW).toBeCloseTo(0.293071, 5);
  });

  it('supports decimal inputs and precision rounding', () => {
    const rounded = convertPower(150, 'hp', 'kW', { precision: 2 });
    // 150 * 745.6998715822702 / 1000 = 111.85498... -> 111.85
    expect(rounded).toBe(111.85);
  });

  it('validates negative power and unknown units', () => {
    expect(() => convertPower(-100, 'kW', 'W')).toThrow(ConversionError);
    expect(() => convertPower(100, 'unknown', 'W')).toThrow(ConversionError);
  });
});
