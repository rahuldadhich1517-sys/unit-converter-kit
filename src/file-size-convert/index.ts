import {
  ConversionError,
  type ConversionOptions,
  type UnitInfo,
  applyPrecision,
  validateNumber
} from '../shared/index.js';

export type FileSizeUnit =
  | 'B'
  | 'kB'
  | 'MB'
  | 'GB'
  | 'TB'
  | 'PB'
  | 'EB'
  | 'KiB'
  | 'MiB'
  | 'GiB'
  | 'TiB'
  | 'PiB'
  | 'EiB';

export interface FileSizeUnitInfo extends UnitInfo<FileSizeUnit> {
  category: 'file-size';
  system: 'metric' | 'iec';
  base: 1000 | 1024 | 1;
  exponent: number;
}

export interface FileSizeConvertOptions extends ConversionOptions {
  /**
   * Whether to allow negative file size.
   * @default false
   */
  allowNegative?: boolean;
}

export interface FileSizeFormatOptions {
  /**
   * Measurement system to use when auto-formatting: 'decimal' (powers of 1000) or 'binary' (powers of 1024).
   * @default 'binary'
   */
  system?: 'decimal' | 'binary';
  /**
   * Target unit to format in. If omitted, automatically selects the most appropriate human-readable unit.
   */
  unit?: FileSizeUnit;
  /**
   * Number of decimal places.
   * @default 2
   */
  precision?: number;
  /**
   * Whether to use full unit names instead of symbols (e.g. "Megabytes" instead of "MB").
   * @default false
   */
  fullUnitNames?: boolean;
  /**
   * Space string between number and unit.
   * @default " "
   */
  spacer?: string;
}

export interface FileSizeParseResult {
  bytes: bigint;
  value: number;
  unit: FileSizeUnit;
  system: 'decimal' | 'binary';
}

export interface FileSizeBreakdownUnit {
  unit: FileSizeUnit;
  symbol: string;
  name: string;
  value: bigint;
}

export interface FileSizeBreakdown {
  totalBytes: bigint;
  system: 'decimal' | 'binary';
  components: FileSizeBreakdownUnit[];
}

const FILE_SIZE_UNITS: readonly FileSizeUnitInfo[] = [
  {
    id: 'B',
    name: 'Bytes',
    symbol: 'B',
    category: 'file-size',
    system: 'metric',
    base: 1,
    exponent: 0,
    factorToBase: 1,
    aliases: ['byte', 'bytes', 'b'],
    description: 'Base unit of file size (1 Byte = 8 bits)'
  },
  // Decimal SI
  {
    id: 'kB',
    name: 'Kilobytes',
    symbol: 'kB',
    category: 'file-size',
    system: 'metric',
    base: 1000,
    exponent: 1,
    factorToBase: 1000,
    aliases: ['KB', 'kilobyte', 'kilobytes', 'kb'],
    description: '1,000 bytes (decimal SI)'
  },
  {
    id: 'MB',
    name: 'Megabytes',
    symbol: 'MB',
    category: 'file-size',
    system: 'metric',
    base: 1000,
    exponent: 2,
    factorToBase: 1000000,
    aliases: ['megabyte', 'megabytes', 'mb'],
    description: '1,000,000 bytes (decimal SI)'
  },
  {
    id: 'GB',
    name: 'Gigabytes',
    symbol: 'GB',
    category: 'file-size',
    system: 'metric',
    base: 1000,
    exponent: 3,
    factorToBase: 1000000000,
    aliases: ['gigabyte', 'gigabytes', 'gb'],
    description: '1,000,000,000 bytes (decimal SI)'
  },
  {
    id: 'TB',
    name: 'Terabytes',
    symbol: 'TB',
    category: 'file-size',
    system: 'metric',
    base: 1000,
    exponent: 4,
    factorToBase: 1000000000000,
    aliases: ['terabyte', 'terabytes', 'tb'],
    description: '10^12 bytes (decimal SI)'
  },
  {
    id: 'PB',
    name: 'Petabytes',
    symbol: 'PB',
    category: 'file-size',
    system: 'metric',
    base: 1000,
    exponent: 5,
    factorToBase: 1000000000000000,
    aliases: ['petabyte', 'petabytes', 'pb'],
    description: '10^15 bytes (decimal SI)'
  },
  {
    id: 'EB',
    name: 'Exabytes',
    symbol: 'EB',
    category: 'file-size',
    system: 'metric',
    base: 1000,
    exponent: 6,
    factorToBase: 1000000000000000000,
    aliases: ['exabyte', 'exabytes', 'eb'],
    description: '10^18 bytes (decimal SI)'
  },
  // Binary IEC
  {
    id: 'KiB',
    name: 'Kibibytes',
    symbol: 'KiB',
    category: 'file-size',
    system: 'iec',
    base: 1024,
    exponent: 1,
    factorToBase: 1024,
    aliases: ['kibibyte', 'kibibytes', 'kib'],
    description: '1,024 bytes (binary IEC)'
  },
  {
    id: 'MiB',
    name: 'Mebibytes',
    symbol: 'MiB',
    category: 'file-size',
    system: 'iec',
    base: 1024,
    exponent: 2,
    factorToBase: 1048576,
    aliases: ['mebibyte', 'mebibytes', 'mib'],
    description: '1,048,576 bytes (binary IEC)'
  },
  {
    id: 'GiB',
    name: 'Gibibytes',
    symbol: 'GiB',
    category: 'file-size',
    system: 'iec',
    base: 1024,
    exponent: 3,
    factorToBase: 1073741824,
    aliases: ['gibibyte', 'gibibytes', 'gib'],
    description: '1,073,741,824 bytes (binary IEC)'
  },
  {
    id: 'TiB',
    name: 'Tebibytes',
    symbol: 'TiB',
    category: 'file-size',
    system: 'iec',
    base: 1024,
    exponent: 4,
    factorToBase: 1099511627776,
    aliases: ['tebibyte', 'tebibytes', 'tib'],
    description: '1,099,511,627,776 bytes (binary IEC)'
  },
  {
    id: 'PiB',
    name: 'Pebibytes',
    symbol: 'PiB',
    category: 'file-size',
    system: 'iec',
    base: 1024,
    exponent: 5,
    factorToBase: 1125899906842624,
    aliases: ['pebibyte', 'pebibytes', 'pib'],
    description: '1,125,899,906,842,624 bytes (binary IEC)'
  },
  {
    id: 'EiB',
    name: 'Exbibytes',
    symbol: 'EiB',
    category: 'file-size',
    system: 'iec',
    base: 1024,
    exponent: 6,
    factorToBase: 1152921504606846976,
    aliases: ['exbibyte', 'exbibytes', 'eib'],
    description: '1,152,921,504,606,846,976 bytes (binary IEC)'
  }
];

const unitMap = new Map<FileSizeUnit, FileSizeUnitInfo>();
const aliasMap = new Map<string, FileSizeUnit>();

for (const unit of FILE_SIZE_UNITS) {
  unitMap.set(unit.id, Object.freeze({ ...unit }));
  aliasMap.set(unit.id, unit.id);
  aliasMap.set(unit.id.toLowerCase(), unit.id);
  aliasMap.set(unit.symbol, unit.id);
  aliasMap.set(unit.symbol.toLowerCase(), unit.id);
  if (unit.aliases) {
    for (const alias of unit.aliases) {
      aliasMap.set(alias, unit.id);
      aliasMap.set(alias.toLowerCase(), unit.id);
    }
  }
}

function resolveFileSizeUnit(unit: string): FileSizeUnit | undefined {
  if (typeof unit !== 'string') return undefined;
  if (unitMap.has(unit as FileSizeUnit)) {
    return unit as FileSizeUnit;
  }
  const match = aliasMap.get(unit) || aliasMap.get(unit.trim());
  if (match) return match;
  return aliasMap.get(unit.trim().toLowerCase());
}

/**
 * Converts a byte count (number or BigInt) to a specific FileSizeUnit.
 */
export function convertFileSize(
  bytes: number | bigint,
  to: FileSizeUnit | string,
  options?: FileSizeConvertOptions
): number {
  const allowNegative = options?.allowNegative ?? false;
  let numericBytes: number;

  if (typeof bytes === 'bigint') {
    if (!allowNegative && bytes < 0n) {
      throw new ConversionError(`File size cannot be negative (received ${bytes}n)`, 'OUT_OF_RANGE', { bytes });
    }
    numericBytes = Number(bytes);
  } else {
    validateNumber(bytes, 'bytes', { allowNegative });
    numericBytes = bytes;
  }

  const toId = resolveFileSizeUnit(to);
  if (!toId) {
    throw new ConversionError(`Unknown file size unit: "${to}"`, 'UNKNOWN_UNIT', { unit: to });
  }

  const toInfo = unitMap.get(toId)!;
  const result = numericBytes / toInfo.factorToBase;

  return applyPrecision(result, options?.precision, options?.roundMode);
}

/**
 * Formats a byte count into a human-readable file size string.
 */
export function formatFileSize(
  bytes: number | bigint,
  options?: FileSizeFormatOptions
): string {
  const allowNegative = false;
  let numericBytes: number;

  if (typeof bytes === 'bigint') {
    if (bytes < 0n) {
      throw new ConversionError(`File size cannot be negative (received ${bytes}n)`, 'OUT_OF_RANGE', { bytes });
    }
    numericBytes = Number(bytes);
  } else {
    validateNumber(bytes, 'bytes', { allowNegative });
    numericBytes = bytes;
  }

  const system = options?.system ?? 'binary';
  const precision = options?.precision ?? 2;
  const spacer = options?.spacer ?? ' ';
  const fullNames = options?.fullUnitNames ?? false;

  if (options?.unit) {
    const targetUnitId = resolveFileSizeUnit(options.unit);
    if (!targetUnitId) {
      throw new ConversionError(`Unknown file size unit: "${options.unit}"`, 'UNKNOWN_UNIT', { unit: options.unit });
    }
    const info = unitMap.get(targetUnitId)!;
    const value = numericBytes / info.factorToBase;
    const rounded = applyPrecision(value, precision, 'round');
    const label = fullNames ? info.name : info.symbol;
    return `${rounded}${spacer}${label}`;
  }

  // Auto-select unit
  const unitsInOrder: FileSizeUnit[] = system === 'binary'
    ? ['EiB', 'PiB', 'TiB', 'GiB', 'MiB', 'KiB', 'B']
    : ['EB', 'PB', 'TB', 'GB', 'MB', 'kB', 'B'];

  for (const unitId of unitsInOrder) {
    const info = unitMap.get(unitId)!;
    if (numericBytes >= info.factorToBase || unitId === 'B') {
      const val = numericBytes / info.factorToBase;
      // If unit is B, format as integer
      const activePrecision = unitId === 'B' ? 0 : precision;
      const rounded = applyPrecision(val, activePrecision, 'round');
      const label = fullNames ? info.name : info.symbol;
      return `${rounded}${spacer}${label}`;
    }
  }

  return `0${spacer}${fullNames ? 'Bytes' : 'B'}`;
}

/**
 * Parses common human-readable file-size strings (e.g., "1.5 MB", "1024 KiB", "500 bytes").
 */
export function parseFileSize(input: string): FileSizeParseResult {
  if (typeof input !== 'string') {
    throw new ConversionError(`Expected file size string, received ${typeof input}`, 'INVALID_INPUT', { input });
  }

  const trimmed = input.trim();
  if (trimmed.length === 0) {
    throw new ConversionError('File size string cannot be empty', 'INVALID_INPUT', { input });
  }

  // Match: optional sign, digits, optional decimal point and digits, optional whitespace, unit
  const match = trimmed.match(/^([-+]?[0-9]+(?:\.[0-9]+)?)\s*([a-zA-Zµμ]+)?$/);
  if (!match || !match[1]) {
    throw new ConversionError(`Cannot parse file size string: "${input}"`, 'INVALID_INPUT', { input });
  }

  const numPart = parseFloat(match[1]);
  if (Number.isNaN(numPart) || !Number.isFinite(numPart)) {
    throw new ConversionError(`Invalid numeric part in file size: "${match[1]}"`, 'INVALID_INPUT', { input });
  }

  if (numPart < 0) {
    throw new ConversionError(`Parsed file size cannot be negative: ${numPart}`, 'OUT_OF_RANGE', { input });
  }

  const rawUnit = match[2] || 'B';
  const resolvedUnit = resolveFileSizeUnit(rawUnit);

  if (!resolvedUnit) {
    throw new ConversionError(`Unknown file size unit: "${rawUnit}"`, 'UNKNOWN_UNIT', { input, rawUnit });
  }

  const info = unitMap.get(resolvedUnit)!;
  const factor = BigInt(Math.floor(info.factorToBase));

  // Compute exact BigInt bytes
  let bytesBigInt: bigint;
  if (Number.isInteger(numPart)) {
    bytesBigInt = BigInt(numPart) * factor;
  } else {
    // Decimal: calculate with precision
    bytesBigInt = BigInt(Math.round(numPart * info.factorToBase));
  }

  return {
    bytes: bytesBigInt,
    value: numPart,
    unit: resolvedUnit,
    system: info.system === 'iec' ? 'binary' : 'decimal'
  };
}

/**
 * Decomposes a byte count into hierarchical components (e.g., GiB, MiB, KiB, B).
 */
export function getFileSizeBreakdown(
  bytes: number | bigint,
  system: 'decimal' | 'binary' = 'binary'
): FileSizeBreakdown {
  let totalBytesBigInt: bigint;
  if (typeof bytes === 'bigint') {
    if (bytes < 0n) {
      throw new ConversionError('Byte count cannot be negative for breakdown', 'OUT_OF_RANGE', { bytes });
    }
    totalBytesBigInt = bytes;
  } else {
    validateNumber(bytes, 'bytes', { allowNegative: false });
    totalBytesBigInt = BigInt(Math.floor(bytes));
  }

  const unitsInOrder: FileSizeUnit[] = system === 'binary'
    ? ['EiB', 'PiB', 'TiB', 'GiB', 'MiB', 'KiB', 'B']
    : ['EB', 'PB', 'TB', 'GB', 'MB', 'kB', 'B'];

  const components: FileSizeBreakdownUnit[] = [];
  let remaining = totalBytesBigInt;

  for (const unitId of unitsInOrder) {
    const info = unitMap.get(unitId)!;
    const factorBigInt = BigInt(Math.floor(info.factorToBase));

    if (remaining >= factorBigInt || unitId === 'B') {
      const count = remaining / factorBigInt;
      if (count > 0n || (unitId === 'B' && components.length === 0)) {
        components.push({
          unit: unitId,
          symbol: info.symbol,
          name: info.name,
          value: count
        });
        remaining %= factorBigInt;
      }
    }
  }

  return {
    totalBytes: totalBytesBigInt,
    system,
    components
  };
}

/**
 * Returns metadata for all supported file size units.
 */
export function getFileSizeUnits(): FileSizeUnitInfo[] {
  return Array.from(unitMap.values());
}
