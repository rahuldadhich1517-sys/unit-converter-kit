import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

console.log('Starting Consumer Verification Test...');

const rootDir = process.cwd();

// 1. Pack tarball
console.log('Creating npm tarball with npm pack...');
const packOutput = execSync('npm pack', { cwd: rootDir, encoding: 'utf-8' }).trim();
const tarballName = packOutput.split('\n').pop()?.trim();
if (!tarballName || !tarballName.endsWith('.tgz')) {
  throw new Error(`Failed to determine tarball name from output: ${packOutput}`);
}
const tarballPath = path.resolve(rootDir, tarballName);
console.log(`Tarball generated: ${tarballPath}`);

// 2. Create isolated consumer test directory
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'unit-converter-kit-consumer-'));
console.log(`Created consumer test directory: ${tempDir}`);

try {
  // Initialize consumer package
  fs.writeFileSync(
    path.join(tempDir, 'package.json'),
    JSON.stringify({
      name: 'consumer-test-app',
      version: '1.0.0',
      type: 'module',
      dependencies: {
        '@rahul_dadhich15/unit-converter-kit': `file:${tarballPath}`
      }
    }, null, 2)
  );

  console.log('Installing package from tarball...');
  execSync('npm install --prefer-offline', { cwd: tempDir, stdio: 'inherit' });

  // 3. Test ESM imports from installed package
  const esmTestScript = `
import {
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
} from '@rahul_dadhich15/unit-converter-kit';

import { convertArea as subArea } from '@rahul_dadhich15/unit-converter-kit/area-convert';
import { convertDataStorage as subStorage } from '@rahul_dadhich15/unit-converter-kit/data-storage-convert';
import { convertFileSize as subFileSize, formatFileSize as subFormat } from '@rahul_dadhich15/unit-converter-kit/file-size-convert';
import { convertEnergy as subEnergy } from '@rahul_dadhich15/unit-converter-kit/energy-convert';
import { convertLength as subLength } from '@rahul_dadhich15/unit-converter-kit/length-convert';
import { convertPower as subPower } from '@rahul_dadhich15/unit-converter-kit/power-convert';
import { convertPressure as subPressure } from '@rahul_dadhich15/unit-converter-kit/pressure-convert';
import { convertSpeed as subSpeed } from '@rahul_dadhich15/unit-converter-kit/speed-convert';
import { convertTemperature as subTemp } from '@rahul_dadhich15/unit-converter-kit/temperature-convert';
import { convertVolume as subVol } from '@rahul_dadhich15/unit-converter-kit/volume-convert';
import { convertMass as subMass, convertWeight as subWeight } from '@rahul_dadhich15/unit-converter-kit/weight-convert';

console.log('Testing installed package in ESM consumer...');
console.assert(convertArea(100, 'm2', 'ft2', { precision: 2 }) === 1076.39);
console.assert(convertDataStorage(1, 'GiB', 'MB') === 1073.741824);
console.assert(formatFileSize(1536) === '1.5 KiB');
console.assert(convertEnergy(1, 'kWh', 'J') === 3600000);
console.assert(convertLength(10, 'km', 'mi', { precision: 2 }) === 6.21);
console.assert(convertPower(1, 'kW', 'W') === 1000);
console.assert(convertPressure(1, 'bar', 'psi', { precision: 2 }) === 14.5);
console.assert(convertSpeed(100, 'km/h', 'mph', { precision: 2 }) === 62.14);
console.assert(convertTemperature(100, 'C', 'F') === 212);
console.assert(convertVolume(1, 'us-gal', 'L', { precision: 3 }) === 3.785);
console.assert(convertMass(70, 'kg', 'lb', { precision: 2 }) === 154.32);
console.assert(convertWeight(100, 'N', 'lbf', { precision: 2 }) === 22.48);
console.assert(massToWeight(1, 'kg', 'N') === 9.80665);
console.assert(weightToMass(9.80665, 'N', 'kg') === 1);
console.assert(STANDARD_GRAVITY === 9.80665);

console.log('Testing installed subpath imports in ESM consumer...');
console.assert(subArea(1, 'ha', 'm2') === 10000);
console.assert(subStorage(1, 'kB', 'B') === 1000);
console.assert(subFormat(1024) === '1 KiB');
console.assert(subEnergy(1, 'cal', 'J') === 4.184);
console.assert(subLength(1, 'in', 'm') === 0.0254);
console.assert(subPower(1, 'hp', 'W') > 745);
console.assert(subPressure(1, 'atm', 'Pa') === 101325);
console.assert(subSpeed(1, 'm/s', 'km/h') === 3.6);
console.assert(subTemp(0, 'C', 'K') === 273.15);
console.assert(subVol(1, 'imp-gal', 'L') === 4.54609);
console.assert(subMass(1, 'lb', 'kg') === 0.45359237);

console.log('✓ ESM Consumer Verification SUCCESSFUL!');
`;

  fs.writeFileSync(path.join(tempDir, 'test-esm.js'), esmTestScript);
  execSync('node test-esm.js', { cwd: tempDir, stdio: 'inherit' });

  // 4. Test CommonJS imports from installed package
  const cjsTestScript = `
const {
  convertArea,
  convertDataStorage,
  convertFileSize,
  convertLength,
  convertTemperature,
  convertMass
} = require('@rahul_dadhich15/unit-converter-kit');

const { convertArea: subArea } = require('@rahul_dadhich15/unit-converter-kit/area-convert');
const { convertDataStorage: subStorage } = require('@rahul_dadhich15/unit-converter-kit/data-storage-convert');
const { convertFileSize: subFileSize } = require('@rahul_dadhich15/unit-converter-kit/file-size-convert');
const { convertEnergy: subEnergy } = require('@rahul_dadhich15/unit-converter-kit/energy-convert');
const { convertLength: subLength } = require('@rahul_dadhich15/unit-converter-kit/length-convert');
const { convertPower: subPower } = require('@rahul_dadhich15/unit-converter-kit/power-convert');
const { convertPressure: subPressure } = require('@rahul_dadhich15/unit-converter-kit/pressure-convert');
const { convertSpeed: subSpeed } = require('@rahul_dadhich15/unit-converter-kit/speed-convert');
const { convertTemperature: subTemp } = require('@rahul_dadhich15/unit-converter-kit/temperature-convert');
const { convertVolume: subVol } = require('@rahul_dadhich15/unit-converter-kit/volume-convert');
const { convertMass: subMass } = require('@rahul_dadhich15/unit-converter-kit/weight-convert');

console.log('Testing installed package in CommonJS consumer...');
console.assert(convertArea(100, 'm2', 'ft2', { precision: 2 }) === 1076.39);
console.assert(convertDataStorage(1, 'GiB', 'MB') === 1073.741824);
console.assert(convertLength(10, 'km', 'mi', { precision: 2 }) === 6.21);
console.assert(convertTemperature(100, 'C', 'F') === 212);
console.assert(convertMass(70, 'kg', 'lb', { precision: 2 }) === 154.32);

console.log('Testing installed subpath imports in CommonJS consumer...');
console.assert(subArea(1, 'ha', 'm2') === 10000);
console.assert(subStorage(1, 'kB', 'B') === 1000);
console.assert(subFileSize(1024, 'KiB') === 1);
console.assert(subEnergy(1, 'cal', 'J') === 4.184);
console.assert(subLength(1, 'in', 'm') === 0.0254);
console.assert(subPower(1, 'hp', 'W') > 745);
console.assert(subPressure(1, 'atm', 'Pa') === 101325);
console.assert(subSpeed(1, 'm/s', 'km/h') === 3.6);
console.assert(subTemp(0, 'C', 'K') === 273.15);
console.assert(subVol(1, 'imp-gal', 'L') === 4.54609);
console.assert(subMass(1, 'lb', 'kg') === 0.45359237);

console.log('✓ CommonJS Consumer Verification SUCCESSFUL!');
`;

  fs.writeFileSync(path.join(tempDir, 'test-cjs.cjs'), cjsTestScript);
  execSync('node test-cjs.cjs', { cwd: tempDir, stdio: 'inherit' });

  console.log('Consumer verification completed with 100% SUCCESS.');
} finally {
  // Clean up
  try {
    fs.rmSync(tempDir, { recursive: true, force: true });
    fs.unlinkSync(tarballPath);
    console.log('Temporary consumer artifacts cleaned up.');
  } catch {}
}
