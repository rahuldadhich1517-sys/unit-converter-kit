/**
 * @rahul_dadhich15/unit-converter-kit
 *
 * Production-ready, zero-runtime-dependency unit conversion library.
 * Designed for browser-based applications, Vite, React, Node, and TypeScript.
 */

// Shared errors, types, precision & validation
export {
  ConversionError,
  type ConversionErrorCode,
  type ConversionOptions,
  type UnitInfo,
  type UnitCategory,
  type MeasurementSystem,
  type RoundMode,
  applyPrecision,
  validateNumber
} from './shared/index.js';

// 1. Area Convert
export {
  convertArea,
  getAreaUnits,
  getAreaUnitInfo,
  isValidAreaUnit,
  getAreaConversionFactor,
  type AreaUnit,
  type AreaUnitInfo,
  type AreaConversionOptions
} from './area-convert/index.js';

// 2. Data Storage Convert
export {
  convertDataStorage,
  getDataStorageUnits,
  getDataStorageUnitInfo,
  getDataStorageBreakdown,
  isValidDataStorageUnit,
  type DataStorageUnit,
  type DataStorageUnitInfo,
  type DataStorageConversionOptions,
  type DataStorageBreakdown,
  type StorageBreakdownUnit,
  type DecimalByteUnit,
  type BinaryByteUnit,
  type DecimalBitUnit,
  type BinaryBitUnit
} from './data-storage-convert/index.js';

// 3. Energy Convert
export {
  convertEnergy,
  getEnergyUnits,
  getEnergyUnitInfo,
  isValidEnergyUnit,
  type EnergyUnit,
  type EnergyUnitInfo
} from './energy-convert/index.js';

// 4. File Size Convert
export {
  convertFileSize,
  formatFileSize,
  parseFileSize,
  getFileSizeBreakdown,
  getFileSizeUnits,
  type FileSizeUnit,
  type FileSizeUnitInfo,
  type FileSizeConvertOptions,
  type FileSizeFormatOptions,
  type FileSizeParseResult,
  type FileSizeBreakdown,
  type FileSizeBreakdownUnit
} from './file-size-convert/index.js';

// 5. Length Convert
export {
  convertLength,
  getLengthUnits,
  getLengthUnitInfo,
  isValidLengthUnit,
  type LengthUnit,
  type LengthUnitInfo,
  type LengthConversionOptions
} from './length-convert/index.js';

// 6. Power Convert
export {
  convertPower,
  getPowerUnits,
  getPowerUnitInfo,
  isValidPowerUnit,
  type PowerUnit,
  type PowerUnitInfo,
  type PowerConversionOptions
} from './power-convert/index.js';

// 7. Pressure Convert
export {
  convertPressure,
  getPressureUnits,
  getPressureUnitInfo,
  isValidPressureUnit,
  type PressureUnit,
  type PressureUnitInfo,
  type PressureConversionOptions
} from './pressure-convert/index.js';

// 8. Speed Convert
export {
  convertSpeed,
  getSpeedUnits,
  getSpeedUnitInfo,
  isValidSpeedUnit,
  type SpeedUnit,
  type SpeedUnitInfo,
  type SpeedConversionOptions
} from './speed-convert/index.js';

// 9. Temperature Convert
export {
  convertTemperature,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  celsiusToKelvin,
  kelvinToCelsius,
  getTemperatureUnits,
  getTemperatureUnitInfo,
  isValidTemperatureUnit,
  type TemperatureUnit,
  type TemperatureUnitInfo,
  type TemperatureConversionOptions
} from './temperature-convert/index.js';

// 10. Volume Convert
export {
  convertVolume,
  getVolumeUnits,
  getVolumeUnitInfo,
  isValidVolumeUnit,
  type VolumeUnit,
  type VolumeUnitInfo,
  type VolumeConversionOptions
} from './volume-convert/index.js';

// 11. Weight Convert (Mass & Force)
export {
  convertMass,
  convertWeight,
  massToWeight,
  weightToMass,
  getMassUnits,
  getWeightUnits,
  getWeightUnitInfo,
  isValidMassUnit,
  isValidForceUnit,
  STANDARD_GRAVITY,
  type MassUnit,
  type ForceUnit,
  type MassUnitInfo,
  type ForceUnitInfo,
  type MassConversionOptions,
  type ForceConversionOptions
} from './weight-convert/index.js';
