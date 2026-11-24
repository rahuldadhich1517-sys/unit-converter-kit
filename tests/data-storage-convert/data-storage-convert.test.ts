import { describe, expect, it } from 'vitest';
import {
  convertDataStorage,
  getDataStorageUnits,
  getDataStorageUnitInfo,
  getDataStorageBreakdown,
  isValidDataStorageUnit,
  type DataStorageUnit
} from '../../src/data-storage-convert/index.js';
import { ConversionError } from '../../src/shared/errors.js';

describe('data-storage-convert', () => {
  it('registers all required SI, IEC, byte and bit units', () => {
    const units = getDataStorageUnits();
    expect(units.length).toBeGreaterThanOrEqual(26);
    expect(isValidDataStorageUnit('B')).toBe(true);
    expect(isValidDataStorageUnit('kB')).toBe(true);
    expect(isValidDataStorageUnit('KiB')).toBe(true);
    expect(isValidDataStorageUnit('b')).toBe(true);
    expect(isValidDataStorageUnit('kb')).toBe(true);
    expect(isValidDataStorageUnit('Kib')).toBe(true);
  });

  it('converts bits to bytes accurately (1 Byte = 8 bits)', () => {
    expect(convertDataStorage(8, 'b', 'B')).toBe(1);
    expect(convertDataStorage(1, 'B', 'b')).toBe(8);
    expect(convertDataStorage(1024, 'b', 'B')).toBe(128);
  });

  it('clearly distinguishes decimal kB (1000 B) from binary KiB (1024 B)', () => {
    expect(convertDataStorage(1, 'kB', 'B')).toBe(1000);
    expect(convertDataStorage(1, 'KiB', 'B')).toBe(1024);
    expect(convertDataStorage(1, 'MB', 'B')).toBe(1000000);
    expect(convertDataStorage(1, 'MiB', 'B')).toBe(1048576);
    expect(convertDataStorage(1, 'GB', 'B')).toBe(1e9);
    expect(convertDataStorage(1, 'GiB', 'B')).toBe(1073741824);
    expect(convertDataStorage(1, 'TB', 'B')).toBe(1e12);
    expect(convertDataStorage(1, 'TiB', 'B')).toBe(1099511627776);

    // Decimal kB and binary KiB are never treated as equivalent
    const kibInKb = convertDataStorage(1, 'KiB', 'kB');
    expect(kibInKb).toBe(1.024);
  });

  it('handles ambiguous alias KB as decimal kB with metadata documentation', () => {
    const info = getDataStorageUnitInfo('KB');
    expect(info?.id).toBe('kB');
    expect(convertDataStorage(1, 'KB', 'B')).toBe(1000);
  });

  it('supports decimal inputs and configurable precision', () => {
    const converted = convertDataStorage(1.5, 'GiB', 'MB', { precision: 2 });
    // 1.5 * 1073741824 / 1000000 = 1610.612736 MB -> 1610.61
    expect(converted).toBe(1610.61);
  });

  it('supports BigInt inputs for large storage calculations', () => {
    const bytesBigInt = 1073741824n; // 1 GiB
    expect(convertDataStorage(bytesBigInt, 'B', 'GiB')).toBe(1);
  });

  it('decomposes byte count in getDataStorageBreakdown for decimal and binary', () => {
    const binaryBreakdown = getDataStorageBreakdown(1536, 'binary');
    expect(binaryBreakdown.totalBytes).toBe(1536);
    expect(binaryBreakdown.system).toBe('binary');
    expect(binaryBreakdown.components[0]?.unit).toBe('KiB');
    expect(binaryBreakdown.components[0]?.value).toBe(1);
    expect(binaryBreakdown.components[1]?.unit).toBe('B');
    expect(binaryBreakdown.components[1]?.value).toBe(512);

    const decimalBreakdown = getDataStorageBreakdown(1500, 'decimal');
    expect(decimalBreakdown.components[0]?.unit).toBe('kB');
    expect(decimalBreakdown.components[0]?.value).toBe(1);
    expect(decimalBreakdown.components[1]?.unit).toBe('B');
    expect(decimalBreakdown.components[1]?.value).toBe(500);
  });

  it('validates negative storage and unknown units', () => {
    expect(() => convertDataStorage(-100, 'MB', 'GB')).toThrow(ConversionError);
    expect(() => convertDataStorage(-100n, 'MB', 'GB')).toThrow(ConversionError);
    expect(() => convertDataStorage(100, 'unknown', 'MB')).toThrow(ConversionError);
    expect(() => convertDataStorage(100, 'MB', 'unknown')).toThrow(ConversionError);
  });
});
