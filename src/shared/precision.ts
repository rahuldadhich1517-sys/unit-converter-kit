import { ConversionError } from './errors.js';
import type { RoundMode } from './types.js';

/**
 * Eliminates standard IEEE 754 floating-point 53-bit mantissa representation artifacts
 * (e.g., 0.3048 / 0.0254 = 12.000000000000002 -> 12, 1 / (1000/3600) = 3.5999999999999996 -> 3.6)
 * while preserving up to 15 significant digits across all numerical orders of magnitude.
 */
export function cleanFloat(value: number): number {
  if (!Number.isFinite(value) || value === 0) {
    return value;
  }
  const cleaned = Number(value.toPrecision(15));
  return Object.is(cleaned, -0) ? 0 : cleaned;
}

/**
 * Accurately rounds a floating-point number to a specified number of decimal places.
 * Uses scientific notation shifting to minimize standard binary IEEE 754 precision quirks.
 */
export function applyPrecision(
  value: number,
  precision?: number,
  roundMode: RoundMode = 'round'
): number {
  if (precision === undefined) {
    return cleanFloat(value);
  }

  if (!Number.isInteger(precision) || precision < 0) {
    throw new ConversionError(
      `Precision must be a non-negative integer, received ${precision}`,
      'PRECISION_ERROR',
      { precision }
    );
  }

  if (precision > 20) {
    throw new ConversionError(
      `Precision cannot exceed 20 decimal places, received ${precision}`,
      'PRECISION_ERROR',
      { precision }
    );
  }

  if (value === 0 || !Number.isFinite(value)) {
    return value;
  }

  // Handle precision using exponential notation to avoid binary float artifacts
  const factor = Math.pow(10, precision);

  switch (roundMode) {
    case 'floor':
      return Math.floor(value * factor) / factor;
    case 'ceil':
      return Math.ceil(value * factor) / factor;
    case 'round':
    default: {
      const parts = value.toString().split('e');
      const exponent = parts[1] ? Number(parts[1]) : 0;
      const shifted = Math.round(Number(`${parts[0]}e${exponent + precision}`));
      const result = Number(`${shifted}e${-precision}`);
      return Object.is(result, -0) ? 0 : result;
    }
  }
}

