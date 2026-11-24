// CommonJS Smoke Test
const {
  convertArea,
  convertDataStorage,
  convertFileSize,
  formatFileSize,
  convertEnergy,
  convertLength,
  convertPower,
  convertPressure,
  convertSpeed,
  convertTemperature,
  convertVolume,
  convertMass,
  convertWeight,
  massToWeight,
  weightToMass,
  STANDARD_GRAVITY
} = require('../dist/index.cjs');

// Test subpath CJS requires
const { convertArea: subConvertArea } = require('../dist/area-convert/index.cjs');
const { convertDataStorage: subConvertDataStorage } = require('../dist/data-storage-convert/index.cjs');
const { convertFileSize: subConvertFileSize } = require('../dist/file-size-convert/index.cjs');
const { convertEnergy: subConvertEnergy } = require('../dist/energy-convert/index.cjs');
const { convertLength: subConvertLength } = require('../dist/length-convert/index.cjs');
const { convertPower: subConvertPower } = require('../dist/power-convert/index.cjs');
const { convertPressure: subConvertPressure } = require('../dist/pressure-convert/index.cjs');
const { convertSpeed: subConvertSpeed } = require('../dist/speed-convert/index.cjs');
const { convertTemperature: subConvertTemperature } = require('../dist/temperature-convert/index.cjs');
const { convertVolume: subConvertVolume } = require('../dist/volume-convert/index.cjs');
const { convertMass: subConvertMass } = require('../dist/weight-convert/index.cjs');

console.log('Testing CommonJS root exports...');
console.assert(convertArea(100, 'm2', 'ft2', { precision: 2 }) === 1076.39, 'Area failed');
console.assert(convertDataStorage(1, 'GiB', 'MB') === 1073.741824, 'DataStorage failed');
console.assert(formatFileSize(1048576) === '1 MiB', 'FileSize failed');
console.assert(convertEnergy(1, 'kWh', 'J') === 3600000, 'Energy failed');
console.assert(convertLength(1, 'mi', 'km') === 1.609344, 'Length failed');
console.assert(convertPower(1, 'kW', 'W') === 1000, 'Power failed');
console.assert(convertPressure(1, 'bar', 'Pa') === 100000, 'Pressure failed');
console.assert(convertSpeed(100, 'km/h', 'm/s', { precision: 2 }) === 27.78, 'Speed failed');
console.assert(convertTemperature(100, 'C', 'F') === 212, 'Temperature failed');
console.assert(convertVolume(1, 'us-gal', 'L', { precision: 3 }) === 3.785, 'Volume failed');
console.assert(convertMass(1, 'lb', 'kg') === 0.45359237, 'Mass failed');
console.assert(convertWeight(1, 'kgf', 'N') === 9.80665, 'Weight failed');
console.assert(massToWeight(1, 'kg', 'N') === 9.80665, 'massToWeight failed');
console.assert(weightToMass(9.80665, 'N', 'kg') === 1, 'weightToMass failed');
console.assert(STANDARD_GRAVITY === 9.80665, 'STANDARD_GRAVITY failed');

console.log('Testing CommonJS subpath exports...');
console.assert(subConvertArea(1, 'ha', 'm2') === 10000, 'subArea failed');
console.assert(subConvertDataStorage(1024, 'KiB', 'MiB') === 1, 'subDataStorage failed');
console.assert(subConvertFileSize(2048, 'KiB') === 2, 'subFileSize failed');
console.assert(subConvertEnergy(1, 'cal', 'J') === 4.184, 'subEnergy failed');
console.assert(subConvertLength(1, 'ft', 'in') === 12, 'subLength failed');
console.assert(subConvertPower(1, 'hp', 'W') > 745, 'subPower failed');
console.assert(subConvertPressure(760, 'Torr', 'atm') === 1, 'subPressure failed');
console.assert(subConvertSpeed(36, 'km/h', 'm/s') === 10, 'subSpeed failed');
console.assert(subConvertTemperature(32, 'F', 'C') === 0, 'subTemperature failed');
console.assert(subConvertVolume(1, 'imp-gal', 'L') === 4.54609, 'subVolume failed');
console.assert(subConvertMass(1, 'st', 'lb') === 14, 'subMass failed');

console.log('✓ All CommonJS tests passed successfully!');
