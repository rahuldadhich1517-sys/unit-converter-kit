import {
  ConversionError,
  type ConversionOptions,
  type UnitInfo,
  applyPrecision,
  validateNumber
} from '../shared/index.js';

export type DecimalByteUnit = 'B' | 'kB' | 'MB' | 'GB' | 'TB' | 'PB' | 'EB';
export type BinaryByteUnit = 'KiB' | 'MiB' | 'GiB' | 'TiB' | 'PiB' | 'EiB';
export type DecimalBitUnit = 'b' | 'kb' | 'Mb' | 'Gb' | 'Tb' | 'Pb' | 'Eb';
export type BinaryBitUnit = 'Kib' | 'Mib' | 'Gib' | 'Tib' | 'Pib' | 'Eib';

export type DataStorageUnit =
  | DecimalByteUnit
  | BinaryByteUnit
  | DecimalBitUnit
  | BinaryBitUnit;

export interface DataStorageUnitInfo extends UnitInfo<DataStorageUnit> {
  category: 'data-storage';
  unitType: 'byte' | 'bit';
  base: 1000 | 1024 | 1;
  exponent: number;
  factorInBits: number;
}

export interface DataStorageConversionOptions extends ConversionOptions {
  /**
   * Whether to allow negative data storage amounts.
   * @default false
   */
  allowNegative?: boolean;
}

export interface StorageBreakdownUnit {
  unit: DataStorageUnit;
  symbol: string;
  name: string;
  value: number;
}

export interface DataStorageBreakdown {
  totalBytes: number | bigint;
  system: 'decimal' | 'binary';
  components: StorageBreakdownUnit[];
}

const DATA_STORAGE_UNITS: readonly DataStorageUnitInfo[] = [
  // Bits
  {
    id: 'b',
    name: 'Bit',
    symbol: 'b',
    category: 'data-storage',
    system: 'si',
    unitType: 'bit',
    base: 1,
    exponent: 0,
    factorInBits: 1,
    factorToBase: 0.125, // 1/8 byte
    aliases: ['bit', 'bits'],
    description: 'Basic unit of information (1/8 of a byte)'
  },
  {
    id: 'kb',
    name: 'Kilobit',
    symbol: 'kb',
    category: 'data-storage',
    system: 'si',
    unitType: 'bit',
    base: 1000,
    exponent: 1,
    factorInBits: 1000,
    factorToBase: 125,
    aliases: ['kbit', 'kilobits'],
    description: '1,000 bits'
  },
  {
    id: 'Mb',
    name: 'Megabit',
    symbol: 'Mb',
    category: 'data-storage',
    system: 'si',
    unitType: 'bit',
    base: 1000,
    exponent: 2,
    factorInBits: 1000000,
    factorToBase: 125000,
    aliases: ['Mbit', 'megabits'],
    description: '1,000,000 bits'
  },
  {
    id: 'Gb',
    name: 'Gigabit',
    symbol: 'Gb',
    category: 'data-storage',
    system: 'si',
    unitType: 'bit',
    base: 1000,
    exponent: 3,
    factorInBits: 1e9,
    factorToBase: 125000000,
    aliases: ['Gbit', 'gigabits'],
    description: '1,000,000,000 bits'
  },
  {
    id: 'Tb',
    name: 'Terabit',
    symbol: 'Tb',
    category: 'data-storage',
    system: 'si',
    unitType: 'bit',
    base: 1000,
    exponent: 4,
    factorInBits: 1e12,
    factorToBase: 125000000000,
    aliases: ['Tbit', 'terabits'],
    description: '10^12 bits'
  },
  {
    id: 'Pb',
    name: 'Petabit',
    symbol: 'Pb',
    category: 'data-storage',
    system: 'si',
    unitType: 'bit',
    base: 1000,
    exponent: 5,
    factorInBits: 1e15,
    factorToBase: 125000000000000,
    aliases: ['Pbit', 'petabits'],
    description: '10^15 bits'
  },
  {
    id: 'Eb',
    name: 'Exabit',
    symbol: 'Eb',
    category: 'data-storage',
    system: 'si',
    unitType: 'bit',
    base: 1000,
    exponent: 6,
    factorInBits: 1e18,
    factorToBase: 125000000000000000,
    aliases: ['Ebit', 'exabits'],
    description: '10^18 bits'
  },

  // Binary Bits (IEC)
  {
    id: 'Kib',
    name: 'Kibibit',
    symbol: 'Kib',
    category: 'data-storage',
    system: 'iec',
    unitType: 'bit',
    base: 1024,
    exponent: 1,
    factorInBits: 1024,
    factorToBase: 128,
    aliases: ['kibibit', 'kibibits'],
    description: '1,024 bits'
  },
  {
    id: 'Mib',
    name: 'Mebibit',
    symbol: 'Mib',
    category: 'data-storage',
    system: 'iec',
    unitType: 'bit',
    base: 1024,
    exponent: 2,
    factorInBits: 1048576,
    factorToBase: 131072,
    aliases: ['mebibit', 'mebibits'],
    description: '1,048,576 bits'
  },
  {
    id: 'Gib',
    name: 'Gibibit',
    symbol: 'Gib',
    category: 'data-storage',
    system: 'iec',
    unitType: 'bit',
    base: 1024,
    exponent: 3,
    factorInBits: 1073741824,
    factorToBase: 134217728,
    aliases: ['gibibit', 'gibibits'],
    description: '2^30 bits'
  },
  {
    id: 'Tib',
    name: 'Tebibit',
    symbol: 'Tib',
    category: 'data-storage',
    system: 'iec',
    unitType: 'bit',
    base: 1024,
    exponent: 4,
    factorInBits: 1099511627776,
    factorToBase: 137438953472,
    aliases: ['tebibit', 'tebibits'],
    description: '2^40 bits'
  },
  {
    id: 'Pib',
    name: 'Pebibit',
    symbol: 'Pib',
    category: 'data-storage',
    system: 'iec',
    unitType: 'bit',
    base: 1024,
    exponent: 5,
    factorInBits: 1125899906842624,
    factorToBase: 140737488355328,
    aliases: ['pebibit', 'pebibits'],
    description: '2^50 bits'
  },
  {
    id: 'Eib',
    name: 'Exbibit',
    symbol: 'Eib',
    category: 'data-storage',
    system: 'iec',
    unitType: 'bit',
    base: 1024,
    exponent: 6,
    factorInBits: 1152921504606846976,
    factorToBase: 144115188075855872,
    aliases: ['exbibit', 'exbibits'],
    description: '2^60 bits'
  },

  // Decimal Bytes (SI)
  {
    id: 'B',
    name: 'Byte',
    symbol: 'B',
    category: 'data-storage',
    system: 'si',
    unitType: 'byte',
    base: 1,
    exponent: 0,
    factorInBits: 8,
    factorToBase: 1, // canonical base unit
    aliases: ['byte', 'bytes'],
    description: 'Standard unit of digital information, equal to 8 bits'
  },
  {
    id: 'kB',
    name: 'Kilobyte',
    symbol: 'kB',
    category: 'data-storage',
    system: 'si',
    unitType: 'byte',
    base: 1000,
    exponent: 1,
    factorInBits: 8000,
    factorToBase: 1000,
    aliases: ['KB', 'kilobyte', 'kilobytes'],
    description: '1,000 bytes (SI decimal). Note: KB is treated as decimal kB.'
  },
  {
    id: 'MB',
    name: 'Megabyte',
    symbol: 'MB',
    category: 'data-storage',
    system: 'si',
    unitType: 'byte',
    base: 1000,
    exponent: 2,
    factorInBits: 8000000,
    factorToBase: 1000000,
    aliases: ['megabyte', 'megabytes'],
    description: '1,000,000 bytes (10^6 bytes)'
  },
  {
    id: 'GB',
    name: 'Gigabyte',
    symbol: 'GB',
    category: 'data-storage',
    system: 'si',
    unitType: 'byte',
    base: 1000,
    exponent: 3,
    factorInBits: 8e9,
    factorToBase: 1000000000,
    aliases: ['gigabyte', 'gigabytes'],
    description: '1,000,000,000 bytes (10^9 bytes)'
  },
  {
    id: 'TB',
    name: 'Terabyte',
    symbol: 'TB',
    category: 'data-storage',
    system: 'si',
    unitType: 'byte',
    base: 1000,
    exponent: 4,
    factorInBits: 8e12,
    factorToBase: 1000000000000,
    aliases: ['terabyte', 'terabytes'],
    description: '10^12 bytes'
  },
  {
    id: 'PB',
    name: 'Petabyte',
    symbol: 'PB',
    category: 'data-storage',
    system: 'si',
    unitType: 'byte',
    base: 1000,
    exponent: 5,
    factorInBits: 8e15,
    factorToBase: 1000000000000000,
    aliases: ['petabyte', 'petabytes'],
    description: '10^15 bytes'
  },
  {
    id: 'EB',
    name: 'Exabyte',
    symbol: 'EB',
    category: 'data-storage',
    system: 'si',
    unitType: 'byte',
    base: 1000,
    exponent: 6,
    factorInBits: 8e18,
    factorToBase: 1000000000000000000,
    aliases: ['exabyte', 'exabytes'],
    description: '10^18 bytes'
  },

  // Binary Bytes (IEC)
  {
    id: 'KiB',
    name: 'Kibibyte',
    symbol: 'KiB',
    category: 'data-storage',
    system: 'iec',
    unitType: 'byte',
    base: 1024,
    exponent: 1,
    factorInBits: 8192,
    factorToBase: 1024,
    aliases: ['kibibyte', 'kibibytes'],
    description: '1,024 bytes (2^10 bytes)'
  },
  {
    id: 'MiB',
    name: 'Mebibyte',
    symbol: 'MiB',
    category: 'data-storage',
    system: 'iec',
    unitType: 'byte',
    base: 1024,
    exponent: 2,
    factorInBits: 8388608,
    factorToBase: 1048576,
    aliases: ['mebibyte', 'mebibytes'],
    description: '1,048,576 bytes (2^20 bytes)'
  },
  {
    id: 'GiB',
    name: 'Gibibyte',
    symbol: 'GiB',
    category: 'data-storage',
    system: 'iec',
    unitType: 'byte',
    base: 1024,
    exponent: 3,
    factorInBits: 8589934592,
    factorToBase: 1073741824,
    aliases: ['gibibyte', 'gibibytes'],
    description: '1,073,741,824 bytes (2^30 bytes)'
  },
  {
    id: 'TiB',
    name: 'Tebibyte',
    symbol: 'TiB',
    category: 'data-storage',
    system: 'iec',
    unitType: 'byte',
    base: 1024,
    exponent: 4,
    factorInBits: 8796093022208,
    factorToBase: 1099511627776,
    aliases: ['tebibyte', 'tebibytes'],
    description: '1,099,511,627,776 bytes (2^40 bytes)'
  },
  {
    id: 'PiB',
    name: 'Pebibyte',
    symbol: 'PiB',
    category: 'data-storage',
    system: 'iec',
    unitType: 'byte',
    base: 1024,
    exponent: 5,
    factorInBits: 9007199254740992,
    factorToBase: 1125899906842624,
    aliases: ['pebibyte', 'pebibytes'],
    description: '1,125,899,906,842,624 bytes (2^50 bytes)'
  },
  {
    id: 'EiB',
    name: 'Exbibyte',
    symbol: 'EiB',
    category: 'data-storage',
    system: 'iec',
    unitType: 'byte',
    base: 1024,
    exponent: 6,
    factorInBits: 9223372036854775808,
    factorToBase: 1152921504606846976,
    aliases: ['exbibyte', 'exbibytes'],
    description: '1,152,921,504,606,846,976 bytes (2^60 bytes)'
  }
];

const unitMap = new Map<DataStorageUnit, DataStorageUnitInfo>();
const aliasMap = new Map<string, DataStorageUnit>();

for (const unit of DATA_STORAGE_UNITS) {
  unitMap.set(unit.id, Object.freeze({ ...unit }));
  aliasMap.set(unit.id, unit.id);
  aliasMap.set(unit.symbol, unit.id);
  if (unit.aliases) {
    for (const alias of unit.aliases) {
      aliasMap.set(alias, unit.id);
    }
  }
}

/**
 * Resolves a unit name, symbol or unambiguous alias to canonical DataStorageUnit.
 * Notice: 'KB' is resolved to 'kB' (decimal), while 'KiB' is binary.
 */
function resolveStorageUnitId(unit: string): DataStorageUnit | undefined {
  if (typeof unit !== 'string') return undefined;
  if (unitMap.has(unit as DataStorageUnit)) {
    return unit as DataStorageUnit;
  }
  const match = aliasMap.get(unit) || aliasMap.get(unit.trim());
  return match;
}

/**
 * Converts data storage values across bits, bytes, SI decimal, and IEC binary units.
 * Supports both number and BigInt inputs.
 */
export function convertDataStorage(
  value: number | bigint,
  from: DataStorageUnit | string,
  to: DataStorageUnit | string,
  options?: DataStorageConversionOptions
): number {
  const allowNegative = options?.allowNegative ?? false;

  let numericValue: number;
  if (typeof value === 'bigint') {
    if (!allowNegative && value < 0n) {
      throw new ConversionError(
        `Data storage cannot be negative (received ${value}n)`,
        'OUT_OF_RANGE',
        { field: 'value', received: value }
      );
    }
    numericValue = Number(value);
  } else {
    validateNumber(value, 'data storage value', { allowNegative });
    numericValue = value;
  }

  const fromId = resolveStorageUnitId(from);
  if (!fromId) {
    throw new ConversionError(
      `Unknown data storage unit: "${from}"`,
      'UNKNOWN_UNIT',
      { unit: from, category: 'data-storage' }
    );
  }

  const toId = resolveStorageUnitId(to);
  if (!toId) {
    throw new ConversionError(
      `Unknown data storage unit: "${to}"`,
      'UNKNOWN_UNIT',
      { unit: to, category: 'data-storage' }
    );
  }

  const fromInfo = unitMap.get(fromId)!;
  const toInfo = unitMap.get(toId)!;

  if (fromId === toId) {
    return applyPrecision(numericValue, options?.precision, options?.roundMode);
  }

  // Canonical base: Bytes (B)
  const bytes = numericValue * fromInfo.factorToBase;
  const result = bytes / toInfo.factorToBase;

  return applyPrecision(result, options?.precision, options?.roundMode);
}

/**
 * Returns all registered data storage units metadata.
 */
export function getDataStorageUnits(): DataStorageUnitInfo[] {
  return Array.from(unitMap.values());
}

/**
 * Retrieves unit metadata for a given data storage unit or alias.
 */
export function getDataStorageUnitInfo(unit: DataStorageUnit | string): DataStorageUnitInfo | undefined {
  const id = resolveStorageUnitId(unit);
  if (!id) return undefined;
  return unitMap.get(id);
}

/**
 * Type guard for DataStorageUnit.
 */
export function isValidDataStorageUnit(unit: string): unit is DataStorageUnit {
  return resolveStorageUnitId(unit) !== undefined;
}

/**
 * Decomposes a byte count into hierarchical components (e.g. GB + MB + kB + B).
 */
export function getDataStorageBreakdown(
  bytes: number | bigint,
  system: 'decimal' | 'binary' = 'binary'
): DataStorageBreakdown {
  if (typeof bytes === 'bigint') {
    if (bytes < 0n) {
      throw new ConversionError('Bytes count cannot be negative for breakdown', 'OUT_OF_RANGE', { bytes });
    }
  } else {
    validateNumber(bytes, 'bytes', { allowNegative: false });
  }

  const isBinary = system === 'binary';
  const unitsInOrder: DataStorageUnit[] = isBinary
    ? ['EiB', 'PiB', 'TiB', 'GiB', 'MiB', 'KiB', 'B']
    : ['EB', 'PB', 'TB', 'GB', 'MB', 'kB', 'B'];

  const components: StorageBreakdownUnit[] = [];
  let remainingBytes = typeof bytes === 'bigint' ? Number(bytes) : bytes;

  for (const unitId of unitsInOrder) {
    const info = unitMap.get(unitId)!;
    const factor = info.factorToBase;
    if (remainingBytes >= factor || unitId === 'B') {
      const count = Math.floor(remainingBytes / factor);
      if (count > 0 || (unitId === 'B' && components.length === 0)) {
        components.push({
          unit: unitId,
          symbol: info.symbol,
          name: info.name,
          value: count
        });
        remainingBytes -= count * factor;
      }
    }
  }

  return {
    totalBytes: bytes,
    system,
    components
  };
}
