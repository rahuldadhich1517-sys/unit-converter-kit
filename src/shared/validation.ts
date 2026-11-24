import { ConversionError } from './errors.js';

export interface NumberValidationOptions {
  allowNegative?: boolean;
  min?: number;
  max?: number;
  disallowZero?: boolean;
}

/**
 * Validates that an input is a finite, valid JavaScript number.
 */
export function validateNumber(
  value: unknown,
  fieldName = 'value',
  options: NumberValidationOptions = {}
): number {
  if (typeof value !== 'number') {
    throw new ConversionError(
      `Expected ${fieldName} to be a number, received ${typeof value}`,
      'INVALID_INPUT',
      { field: fieldName, received: value }
    );
  }

  if (Number.isNaN(value)) {
    throw new ConversionError(
      `Expected ${fieldName} to be a valid number, received NaN`,
      'INVALID_INPUT',
      { field: fieldName, received: NaN }
    );
  }

  if (!Number.isFinite(value)) {
    throw new ConversionError(
      `Expected ${fieldName} to be finite, received ${value > 0 ? '+Infinity' : '-Infinity'}`,
      'INVALID_INPUT',
      { field: fieldName, received: value }
    );
  }

  if (options.allowNegative === false && value < 0) {
    throw new ConversionError(
      `${fieldName} cannot be negative (received ${value})`,
      'OUT_OF_RANGE',
      { field: fieldName, received: value }
    );
  }

  if (options.disallowZero && value === 0) {
    throw new ConversionError(
      `${fieldName} cannot be zero`,
      'OUT_OF_RANGE',
      { field: fieldName, received: value }
    );
  }

  if (options.min !== undefined && value < options.min) {
    throw new ConversionError(
      `${fieldName} must be >= ${options.min} (received ${value})`,
      'OUT_OF_RANGE',
      { field: fieldName, received: value, min: options.min }
    );
  }

  if (options.max !== undefined && value > options.max) {
    throw new ConversionError(
      `${fieldName} must be <= ${options.max} (received ${value})`,
      'OUT_OF_RANGE',
      { field: fieldName, received: value, max: options.max }
    );
  }

  return value;
}
