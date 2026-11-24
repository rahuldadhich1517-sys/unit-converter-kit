/**
 * Custom error types for unit-converter-kit
 */

export type ConversionErrorCode =
  | 'INVALID_INPUT'
  | 'UNKNOWN_UNIT'
  | 'INCOMPATIBLE_UNITS'
  | 'OUT_OF_RANGE'
  | 'PRECISION_ERROR';

export class ConversionError extends Error {
  public readonly code: ConversionErrorCode;
  public readonly details?: Record<string, unknown>;

  constructor(message: string, code: ConversionErrorCode, details?: Record<string, unknown>) {
    super(message);
    this.name = 'ConversionError';
    this.code = code;
    this.details = details;

    // Restore prototype chain for instanceof checks across environments
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
