import { describe, expect, it } from 'vitest';
import {
  convertSpeed,
  getSpeedUnits,
  getSpeedUnitInfo,
  isValidSpeedUnit,
  type SpeedUnit
} from '../../src/speed-convert/index.js';
import { ConversionError } from '../../src/shared/errors.js';

describe('speed-convert', () => {
  const allUnits: SpeedUnit[] = ['m/s', 'km/h', 'mph', 'ft/s', 'kn'];

  it('registers all 5 required speed units and metadata', () => {
    const units = getSpeedUnits();
    expect(units).toHaveLength(5);
    for (const unit of allUnits) {
      expect(isValidSpeedUnit(unit)).toBe(true);
    }
    expect(getSpeedUnitInfo('kn')?.symbol).toBe('kn');
    expect(getSpeedUnitInfo('unknown')).toBeUndefined();
  });

  it('converts m/s, km/h, and mph accurately', () => {
    // 1 m/s = 3.6 km/h exact
    expect(convertSpeed(1, 'm/s', 'km/h')).toBe(3.6);
    expect(convertSpeed(36, 'km/h', 'm/s')).toBe(10);

    // 1 mph = 0.44704 m/s exact
    expect(convertSpeed(1, 'mph', 'm/s')).toBe(0.44704);
    expect(convertSpeed(60, 'mph', 'km/h')).toBeCloseTo(96.56064, 4);

    // 1 ft/s = 0.3048 m/s exact
    expect(convertSpeed(1, 'ft/s', 'm/s')).toBe(0.3048);

    // 1 knot = 1.852 km/h
    expect(convertSpeed(1, 'kn', 'km/h')).toBe(1.852);
  });

  it('preserves signed velocity values by default', () => {
    expect(convertSpeed(-10, 'm/s', 'km/h')).toBe(-36);
    expect(() => convertSpeed(-10, 'm/s', 'km/h', { allowNegative: false })).toThrow(ConversionError);
  });

  it('supports decimal inputs and precision rounding', () => {
    const rounded = convertSpeed(100, 'km/h', 'mph', { precision: 2 });
    expect(rounded).toBe(62.14);
  });

  it('rejects unknown speed units', () => {
    expect(() => convertSpeed(100, 'mach', 'km/h')).toThrow(ConversionError);
  });
});
