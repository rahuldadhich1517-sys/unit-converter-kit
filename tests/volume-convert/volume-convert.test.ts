import { describe, expect, it } from 'vitest';
import {
  convertVolume,
  getVolumeUnits,
  getVolumeUnitInfo,
  isValidVolumeUnit,
  type VolumeUnit
} from '../../src/volume-convert/index.js';
import { ConversionError } from '../../src/shared/errors.js';

describe('volume-convert', () => {
  it('registers all 17 supported volume units and metadata', () => {
    const units = getVolumeUnits();
    expect(units).toHaveLength(17);
    expect(isValidVolumeUnit('m3')).toBe(true);
    expect(isValidVolumeUnit('L')).toBe(true);
    expect(isValidVolumeUnit('us-gal')).toBe(true);
    expect(isValidVolumeUnit('imp-gal')).toBe(true);
    expect(getVolumeUnitInfo('us-gal')?.name).toContain('Gallon');
    expect(getVolumeUnitInfo('unknown')).toBeUndefined();
  });

  it('converts metric volume units accurately', () => {
    // 1 m3 = 1000 L
    expect(convertVolume(1, 'm3', 'L')).toBe(1000);
    // 1 L = 1000 mL = 1000 cm3
    expect(convertVolume(1, 'L', 'mL')).toBe(1000);
    expect(convertVolume(1, 'L', 'cm3')).toBe(1000);
    expect(convertVolume(1, 'mL', 'cm3')).toBe(1);
    expect(convertVolume(1, 'cm3', 'mm3')).toBe(1000);
  });

  it('converts cubic imperial units accurately', () => {
    // 1 ft3 = 1728 in3 (12^3)
    expect(convertVolume(1, 'ft3', 'in3')).toBe(1728);
    // 1 yd3 = 27 ft3 (3^3)
    expect(convertVolume(1, 'yd3', 'ft3')).toBe(27);
  });

  it('clearly distinguishes US gallon from Imperial gallon', () => {
    // US liquid gallon = 231 in3 = 3.785411784 L exact
    const usGalInLiters = convertVolume(1, 'us-gal', 'L');
    expect(usGalInLiters).toBe(3.785411784);

    // Imperial gallon = exactly 4.54609 L (Weights & Measures Act 1985)
    const impGalInLiters = convertVolume(1, 'imp-gal', 'L');
    expect(impGalInLiters).toBe(4.54609);

    expect(usGalInLiters).not.toBe(impGalInLiters);
    // Imperial gallon is approximately 1.20095 US gallons
    expect(convertVolume(1, 'imp-gal', 'us-gal')).toBeCloseTo(1.20095, 4);
  });

  it('converts US fluid units accurately (1 gal = 4 qt = 8 pt = 16 cups = 128 fl oz)', () => {
    expect(convertVolume(1, 'us-gal', 'us-qt')).toBe(4);
    expect(convertVolume(1, 'us-gal', 'us-pt')).toBe(8);
    expect(convertVolume(1, 'us-gal', 'us-cup')).toBe(16);
    expect(convertVolume(1, 'us-gal', 'us-fl-oz')).toBe(128);
  });

  it('converts Imperial fluid units accurately (1 gal = 4 qt = 8 pt = 160 fl oz)', () => {
    expect(convertVolume(1, 'imp-gal', 'imp-qt')).toBe(4);
    expect(convertVolume(1, 'imp-gal', 'imp-pt')).toBe(8);
    expect(convertVolume(1, 'imp-gal', 'imp-fl-oz')).toBe(160);
  });

  it('rejects ambiguous unqualified aliases like "gallon"', () => {
    expect(isValidVolumeUnit('gallon')).toBe(false);
    expect(() => convertVolume(1, 'gallon', 'L')).toThrow(ConversionError);
  });

  it('validates negative volume by default', () => {
    expect(() => convertVolume(-5, 'L', 'mL')).toThrow(ConversionError);
    expect(convertVolume(-5, 'L', 'mL', { allowNegative: true })).toBe(-5000);
  });
});
