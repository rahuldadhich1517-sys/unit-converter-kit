import { describe, expect, it } from 'vitest';
import {
  convertFileSize,
  formatFileSize,
  parseFileSize,
  getFileSizeBreakdown,
  getFileSizeUnits
} from '../../src/file-size-convert/index.js';
import { ConversionError } from '../../src/shared/errors.js';

describe('file-size-convert', () => {
  it('registers all required decimal and binary file size units', () => {
    const units = getFileSizeUnits();
    expect(units.length).toBeGreaterThanOrEqual(13);
  });

  describe('formatFileSize', () => {
    it('formats bytes into binary human-readable units by default', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(500)).toBe('500 B');
      expect(formatFileSize(1024)).toBe('1 KiB');
      expect(formatFileSize(1048576)).toBe('1 MiB');
      expect(formatFileSize(1073741824)).toBe('1 GiB');
      expect(formatFileSize(1099511627776)).toBe('1 TiB');
    });

    it('formats bytes into decimal human-readable units when requested', () => {
      expect(formatFileSize(1000, { system: 'decimal' })).toBe('1 kB');
      expect(formatFileSize(1000000, { system: 'decimal' })).toBe('1 MB');
      expect(formatFileSize(1000000000, { system: 'decimal' })).toBe('1 GB');
    });

    it('formats with custom precision, target unit, and full names', () => {
      expect(formatFileSize(1536, { precision: 2 })).toBe('1.5 KiB');
      expect(formatFileSize(1536, { unit: 'B' })).toBe('1536 B');
      expect(formatFileSize(1048576, { fullUnitNames: true })).toBe('1 Mebibytes');
      expect(formatFileSize(1000000, { system: 'decimal', fullUnitNames: true })).toBe('1 Megabytes');
      expect(formatFileSize(1024, { spacer: '' })).toBe('1KiB');
    });

    it('supports BigInt byte counts for large file sizes', () => {
      const largeBytes = 1073741824n * 50n; // 50 GiB
      expect(formatFileSize(largeBytes)).toBe('50 GiB');
    });

    it('rejects negative values and unknown units in formatFileSize', () => {
      expect(() => formatFileSize(-100)).toThrow(ConversionError);
      expect(() => formatFileSize(-100n)).toThrow(ConversionError);
      expect(() => formatFileSize(1024, { unit: 'invalid' as any })).toThrow(ConversionError);
    });
  });

  describe('convertFileSize', () => {
    it('converts between byte counts and target units accurately', () => {
      expect(convertFileSize(1024, 'KiB')).toBe(1);
      expect(convertFileSize(1000, 'kB')).toBe(1);
      expect(convertFileSize(1073741824, 'GiB')).toBe(1);
      expect(convertFileSize(1073741824n, 'MiB')).toBe(1024);
    });

    it('supports configurable precision and negative option', () => {
      expect(convertFileSize(1500, 'KiB', { precision: 2 })).toBe(1.46);
      expect(() => convertFileSize(-1024, 'KiB')).toThrow(ConversionError);
      expect(() => convertFileSize(-1024n, 'KiB')).toThrow(ConversionError);
      expect(convertFileSize(-1024, 'KiB', { allowNegative: true })).toBe(-1);
      expect(convertFileSize(-1024n, 'KiB', { allowNegative: true })).toBe(-1);
      expect(() => convertFileSize(1024, 'unknown')).toThrow(ConversionError);
    });
  });

  describe('parseFileSize', () => {
    it('parses valid human-readable file size strings', () => {
      const res1 = parseFileSize('1.5 MB');
      expect(res1.bytes).toBe(1500000n);
      expect(res1.value).toBe(1.5);
      expect(res1.unit).toBe('MB');
      expect(res1.system).toBe('decimal');

      const res2 = parseFileSize('1024 KiB');
      expect(res2.bytes).toBe(1048576n);
      expect(res2.value).toBe(1024);
      expect(res2.unit).toBe('KiB');
      expect(res2.system).toBe('binary');

      const res3 = parseFileSize('500 bytes');
      expect(res3.bytes).toBe(500n);
      expect(res3.unit).toBe('B');

      const res4 = parseFileSize('2 GB');
      expect(res4.bytes).toBe(2000000000n);
    });

    it('throws ConversionError for malformed strings or negative inputs', () => {
      expect(() => parseFileSize('')).toThrow(ConversionError);
      expect(() => parseFileSize('not-a-size')).toThrow(ConversionError);
      expect(() => parseFileSize('-5 MB')).toThrow(ConversionError);
      expect(() => parseFileSize('100 unknown_unit')).toThrow(ConversionError);
    });
  });

  describe('getFileSizeBreakdown', () => {
    it('breaks down byte counts hierarchically', () => {
      const breakdown = getFileSizeBreakdown(1073741824n + 1048576n * 2n + 512n, 'binary');
      expect(breakdown.system).toBe('binary');
      expect(breakdown.components).toHaveLength(3);
      expect(breakdown.components[0]?.unit).toBe('GiB');
      expect(breakdown.components[0]?.value).toBe(1n);
      expect(breakdown.components[1]?.unit).toBe('MiB');
      expect(breakdown.components[1]?.value).toBe(2n);
      expect(breakdown.components[2]?.unit).toBe('B');
      expect(breakdown.components[2]?.value).toBe(512n);

      // Number input and decimal system
      const decBreakdown = getFileSizeBreakdown(1500, 'decimal');
      expect(decBreakdown.system).toBe('decimal');
      expect(decBreakdown.components[0]?.unit).toBe('kB');
      expect(decBreakdown.components[0]?.value).toBe(1n);
      expect(decBreakdown.components[1]?.unit).toBe('B');
      expect(decBreakdown.components[1]?.value).toBe(500n);
    });

    it('rejects negative byte counts', () => {
      expect(() => getFileSizeBreakdown(-100)).toThrow(ConversionError);
      expect(() => getFileSizeBreakdown(-100n)).toThrow(ConversionError);
    });
  });
});
