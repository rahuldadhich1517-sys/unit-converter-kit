import { describe, expect, it } from 'vitest';
import {
  ConversionError,
  applyPrecision,
  validateNumber,
  UnitRegistry,
  type UnitInfo
} from '../../src/shared/index.js';

describe('Shared modules', () => {
  describe('validateNumber', () => {
    it('accepts valid finite numbers', () => {
      expect(validateNumber(0)).toBe(0);
      expect(validateNumber(42.5)).toBe(42.5);
      expect(validateNumber(-10)).toBe(-10);
    });

    it('rejects non-numbers', () => {
      expect(() => validateNumber('42')).toThrow(ConversionError);
      expect(() => validateNumber(null)).toThrow(ConversionError);
      expect(() => validateNumber(undefined)).toThrow(ConversionError);
      expect(() => validateNumber({})).toThrow(ConversionError);
    });

    it('rejects NaN and Infinities', () => {
      expect(() => validateNumber(NaN)).toThrow(ConversionError);
      expect(() => validateNumber(Infinity)).toThrow(ConversionError);
      expect(() => validateNumber(-Infinity)).toThrow(ConversionError);
    });

    it('enforces allowNegative: false', () => {
      expect(() => validateNumber(-0.0001, 'val', { allowNegative: false })).toThrow(ConversionError);
      expect(validateNumber(0, 'val', { allowNegative: false })).toBe(0);
      expect(validateNumber(10, 'val', { allowNegative: false })).toBe(10);
    });

    it('enforces min and max options', () => {
      expect(() => validateNumber(5, 'val', { min: 10 })).toThrow(ConversionError);
      expect(() => validateNumber(15, 'val', { max: 10 })).toThrow(ConversionError);
      expect(validateNumber(10, 'val', { min: 10, max: 10 })).toBe(10);
    });

    it('enforces disallowZero option', () => {
      expect(() => validateNumber(0, 'val', { disallowZero: true })).toThrow(ConversionError);
      expect(validateNumber(1, 'val', { disallowZero: true })).toBe(1);
    });
  });

  describe('applyPrecision', () => {
    it('returns unrounded value when precision is undefined', () => {
      expect(applyPrecision(1.23456789)).toBe(1.23456789);
    });

    it('rounds correctly with default roundMode="round"', () => {
      expect(applyPrecision(1.23456, 2)).toBe(1.23);
      expect(applyPrecision(1.23556, 2)).toBe(1.24);
      expect(applyPrecision(1.005, 2)).toBe(1.01);
      expect(applyPrecision(0, 4)).toBe(0);
    });

    it('handles floor and ceil rounding modes', () => {
      expect(applyPrecision(1.239, 2, 'floor')).toBe(1.23);
      expect(applyPrecision(1.231, 2, 'ceil')).toBe(1.24);
    });

    it('prevents negative zero (-0)', () => {
      expect(Object.is(applyPrecision(-0.0001, 2), 0)).toBe(true);
    });

    it('rejects invalid precision values', () => {
      expect(() => applyPrecision(10, -1)).toThrow(ConversionError);
      expect(() => applyPrecision(10, 1.5)).toThrow(ConversionError);
      expect(() => applyPrecision(10, 25)).toThrow(ConversionError);
    });

    it('handles non-finite or 0 values without error', () => {
      expect(applyPrecision(0, 2)).toBe(0);
      expect(applyPrecision(Infinity, 2)).toBe(Infinity);
    });
  });

  describe('UnitRegistry', () => {
    const testUnits: UnitInfo<'meter' | 'kilometer'>[] = [
      {
        id: 'meter',
        name: 'Meter',
        symbol: 'm',
        category: 'length',
        factorToBase: 1,
        aliases: ['m', 'metre']
      },
      {
        id: 'kilometer',
        name: 'Kilometer',
        symbol: 'km',
        category: 'length',
        factorToBase: 1000,
        aliases: ['km', 'kilometre']
      }
    ];

    const registry = new UnitRegistry<'meter' | 'kilometer'>('length', 'meter', testUnits);

    it('lists all registered units', () => {
      expect(registry.getUnits()).toHaveLength(2);
      expect(registry.getUnits().map(u => u.id)).toEqual(['meter', 'kilometer']);
    });

    it('resolves units by ID, symbol and aliases', () => {
      expect(registry.resolveUnitId('meter')).toBe('meter');
      expect(registry.resolveUnitId('m')).toBe('meter');
      expect(registry.resolveUnitId('metre')).toBe('meter');
      expect(registry.resolveUnitId('km')).toBe('kilometer');
      expect(registry.resolveUnitId('invalid')).toBeUndefined();
    });

    it('checks validity correctly', () => {
      expect(registry.isValidUnit('meter')).toBe(true);
      expect(registry.isValidUnit('km')).toBe(true);
      expect(registry.isValidUnit('lightyear')).toBe(false);
    });

    it('calculates conversion factors', () => {
      expect(registry.getConversionFactor('kilometer', 'meter')).toBe(1000);
      expect(registry.getConversionFactor('meter', 'kilometer')).toBe(0.001);
    });

    it('converts linearly with precision', () => {
      expect(registry.convertLinear(5, 'kilometer', 'meter')).toBe(5000);
      expect(registry.convertLinear(1500, 'meter', 'kilometer')).toBe(1.5);
      expect(registry.convertLinear(1.23456, 'meter', 'meter', { precision: 2 })).toBe(1.23);
    });

    it('throws ConversionError for unknown unit', () => {
      expect(() => registry.requireUnit('parsec', 'from')).toThrow(ConversionError);
    });
  });
});
