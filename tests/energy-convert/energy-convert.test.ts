import { describe, expect, it } from 'vitest';
import {
  convertEnergy,
  getEnergyUnits,
  getEnergyUnitInfo,
  isValidEnergyUnit,
  type EnergyUnit
} from '../../src/energy-convert/index.js';
import { ConversionError } from '../../src/shared/errors.js';

describe('energy-convert', () => {
  const allUnits: EnergyUnit[] = ['J', 'kJ', 'MJ', 'Wh', 'kWh', 'MWh', 'cal', 'kcal', 'eV', 'BTU'];

  it('registers all 10 required energy units', () => {
    const units = getEnergyUnits();
    expect(units).toHaveLength(10);
    for (const unit of allUnits) {
      expect(isValidEnergyUnit(unit)).toBe(true);
    }
  });

  it('provides explicit standards documentation in unit info', () => {
    const calInfo = getEnergyUnitInfo('cal');
    expect(calInfo?.standardConvention).toContain('Thermochemical calorie: exactly 4.184 J');

    const btuInfo = getEnergyUnitInfo('BTU');
    expect(btuInfo?.standardConvention).toContain('International Table (IT) BTU');

    const evInfo = getEnergyUnitInfo('eV');
    expect(evInfo?.standardConvention).toContain('CODATA');
  });

  it('converts joule, watt-hour, and kilowatt-hour correctly', () => {
    // 1 Wh = 3600 J
    expect(convertEnergy(1, 'Wh', 'J')).toBe(3600);
    // 1 kWh = 3.6 x 10^6 J = 3.6 MJ
    expect(convertEnergy(1, 'kWh', 'J')).toBe(3600000);
    expect(convertEnergy(1, 'kWh', 'MJ')).toBe(3.6);
    expect(convertEnergy(1, 'MWh', 'kWh')).toBe(1000);
  });

  it('converts thermochemical calorie and kilocalorie accurately', () => {
    // 1 cal = 4.184 J exact
    expect(convertEnergy(1, 'cal', 'J')).toBe(4.184);
    // 1 kcal = 4184 J exact
    expect(convertEnergy(1, 'kcal', 'J')).toBe(4184);
    expect(convertEnergy(1, 'kcal', 'cal')).toBe(1000);
  });

  it('converts electronvolt (eV) accurately', () => {
    // 1 eV = 1.602176634e-19 J
    expect(convertEnergy(1, 'eV', 'J')).toBe(1.602176634e-19);
    expect(convertEnergy(1.602176634e-19, 'J', 'eV')).toBeCloseTo(1, 10);
  });

  it('converts British thermal unit (BTU) accurately', () => {
    // 1 BTU (IT) = 1055.05585262 J
    expect(convertEnergy(1, 'BTU', 'J')).toBe(1055.05585262);
  });

  it('supports decimal inputs and precision rounding', () => {
    const raw = convertEnergy(2.5, 'kWh', 'cal');
    const rounded = convertEnergy(2.5, 'kWh', 'cal', { precision: 2 });
    expect(raw).toBeGreaterThan(2000000);
    expect(Number.isFinite(rounded)).toBe(true);
  });

  it('rejects invalid inputs and unknown units', () => {
    expect(() => convertEnergy(10, 'foobar', 'J')).toThrow(ConversionError);
    expect(() => convertEnergy(NaN, 'J', 'Wh')).toThrow(ConversionError);
  });
});
