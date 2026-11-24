/**
 * Shared type definitions for unit-converter-kit
 */

export type UnitCategory =
  | 'area'
  | 'data-storage'
  | 'file-size'
  | 'energy'
  | 'length'
  | 'power'
  | 'pressure'
  | 'speed'
  | 'temperature'
  | 'volume'
  | 'mass'
  | 'force';

export type MeasurementSystem =
  | 'si'
  | 'metric'
  | 'imperial'
  | 'us-customary'
  | 'binary'
  | 'iec'
  | 'other';

export type RoundMode = 'round' | 'floor' | 'ceil';

export interface ConversionOptions {
  /**
   * Number of decimal places to round to.
   * If omitted or undefined, unrounded full floating-point precision is returned.
   */
  precision?: number;
  /**
   * Rounding mode to apply when precision is specified. Default is 'round'.
   */
  roundMode?: RoundMode;
  /**
   * Whether to allow negative values. If false and value < 0, an error is thrown.
   */
  allowNegative?: boolean;
}

export interface UnitInfo<TId extends string = string> {
  id: TId;
  name: string;
  symbol: string;
  category: UnitCategory;
  system?: MeasurementSystem;
  factorToBase: number;
  aliases?: readonly string[];
  description?: string;
}
