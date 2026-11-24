import { describe, expect, it } from 'vitest';
import * as UnitConverterKit from '../../src/index.js';

describe('unit-converter-kit root exports', () => {
  it('exports all 11 primary conversion functions', () => {
    expect(typeof UnitConverterKit.convertArea).toBe('function');
    expect(typeof UnitConverterKit.convertDataStorage).toBe('function');
    expect(typeof UnitConverterKit.convertFileSize).toBe('function');
    expect(typeof UnitConverterKit.formatFileSize).toBe('function');
    expect(typeof UnitConverterKit.convertEnergy).toBe('function');
    expect(typeof UnitConverterKit.convertLength).toBe('function');
    expect(typeof UnitConverterKit.convertPower).toBe('function');
    expect(typeof UnitConverterKit.convertPressure).toBe('function');
    expect(typeof UnitConverterKit.convertSpeed).toBe('function');
    expect(typeof UnitConverterKit.convertTemperature).toBe('function');
    expect(typeof UnitConverterKit.convertVolume).toBe('function');
    expect(typeof UnitConverterKit.convertMass).toBe('function');
    expect(typeof UnitConverterKit.convertWeight).toBe('function');
    expect(typeof UnitConverterKit.massToWeight).toBe('function');
    expect(typeof UnitConverterKit.weightToMass).toBe('function');
  });

  it('exports shared utilities and errors', () => {
    expect(UnitConverterKit.ConversionError).toBeDefined();
    expect(typeof UnitConverterKit.applyPrecision).toBe('function');
    expect(typeof UnitConverterKit.validateNumber).toBe('function');
    expect(UnitConverterKit.STANDARD_GRAVITY).toBe(9.80665);
  });

  it('runs sample conversions from all 11 utilities via root export', () => {
    // 1. Area
    expect(UnitConverterKit.convertArea(100, 'm2', 'ft2', { precision: 2 })).toBe(1076.39);
    // 2. Data Storage
    expect(UnitConverterKit.convertDataStorage(1, 'GiB', 'MB')).toBe(1073.741824);
    // 3. File Size
    expect(UnitConverterKit.formatFileSize(1536)).toBe('1.5 KiB');
    // 4. Energy
    expect(UnitConverterKit.convertEnergy(1, 'kWh', 'J')).toBe(3600000);
    // 5. Length
    expect(UnitConverterKit.convertLength(10, 'km', 'mi', { precision: 2 })).toBe(6.21);
    // 6. Power
    expect(UnitConverterKit.convertPower(1, 'kW', 'W')).toBe(1000);
    // 7. Pressure
    expect(UnitConverterKit.convertPressure(1, 'bar', 'psi', { precision: 2 })).toBe(14.5);
    // 8. Speed
    expect(UnitConverterKit.convertSpeed(100, 'km/h', 'mph', { precision: 2 })).toBe(62.14);
    // 9. Temperature
    expect(UnitConverterKit.convertTemperature(100, 'C', 'F')).toBe(212);
    // 10. Volume
    expect(UnitConverterKit.convertVolume(1, 'us-gal', 'L', { precision: 3 })).toBe(3.785);
    // 11. Weight (Mass & Force)
    expect(UnitConverterKit.convertMass(70, 'kg', 'lb', { precision: 2 })).toBe(154.32);
    expect(UnitConverterKit.convertWeight(100, 'N', 'lbf', { precision: 2 })).toBe(22.48);
  });
});
