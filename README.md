# @rahul_dadhich15/unit-converter-kit

> A production-ready, zero-runtime-dependency unit conversion library engineered for browser applications, React, Vite, Node.js, and TypeScript.

[![CI](https://github.com/rahuldadhich15/unit-converter-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/rahuldadhich15/unit-converter-kit/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/badge/npm-0.1.0-orange.svg)](https://www.npmjs.com/package/@rahul_dadhich15/unit-converter-kit)
[![Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)]()

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Architecture & Conversion Model](#architecture--conversion-model)
- [Subpath Imports & Tree-Shaking](#subpath-imports--tree-shaking)
- [The 11 Conversion Modules](#the-11-conversion-modules)
  - [1. Area Converter (`area-convert`)](#1-area-converter-area-convert)
  - [2. Data Storage Converter (`data-storage-convert`)](#2-data-storage-converter-data-storage-convert)
  - [3. Energy Converter (`energy-convert`)](#3-energy-converter-energy-convert)
  - [4. File Size Converter (`file-size-convert`)](#4-file-size-converter-file-size-convert)
  - [5. Length Converter (`length-convert`)](#5-length-converter-length-convert)
  - [6. Power Converter (`power-convert`)](#6-power-converter-power-convert)
  - [7. Pressure Converter (`pressure-convert`)](#7-pressure-converter-pressure-convert)
  - [8. Speed Converter (`speed-convert`)](#8-speed-converter-speed-convert)
  - [9. Temperature Converter (`temperature-convert`)](#9-temperature-converter-temperature-convert)
  - [10. Volume Converter (`volume-convert`)](#10-volume-converter-volume-convert)
  - [11. Weight & Mass Converter (`weight-convert`)](#11-weight--mass-converter-weight-convert)
- [Precision & Numerical Correctness](#precision--numerical-correctness)
- [Error Handling](#error-handling)
- [Scientific Standards & Reference Constants](#scientific-standards--reference-constants)
- [Browser Compatibility & Environments](#browser-compatibility--environments)
- [Development, Testing & Build Scripts](#development-testing--build-scripts)
- [License](#license)

---

## Overview

`@rahul_dadhich15/unit-converter-kit` is a comprehensive mathematical and scientific measurement conversion toolkit written in pure TypeScript. It contains **11 specialized conversion utilities** covering over 100 units across physical, computational, and thermodynamic domains.

All calculations execute completely client-side in native JavaScript memory with **zero runtime dependencies**, no backend, no APIs, and no DOM requirements.

---

## Key Features

- **Zero Runtime Dependencies**: Exactly 0 external dependencies for minimal bundle impact.
- **Tree-Shakeable Subpaths**: Import all utilities from the root package or import individual modules via subpaths (e.g. `@rahul_dadhich15/unit-converter-kit/length-convert`).
- **Physical Correctness**: Strict distinction between mass and weight force, absolute and gauge pressure, and SI decimal vs. IEC binary storage.
- **Standards-Based Accuracy**: Grounded in official reference constants from CODATA, NIST, ISO 80000, CGPM, and BIPM.
- **Dual Output**: Full ESM (`.js`) and CommonJS (`.cjs`) builds with complete TypeScript declarations (`.d.ts` and `.d.cts`).
- **Configurable Precision**: Unrounded IEEE 754 precision by default, with optional decimal place rounding and rounding modes (`round`, `floor`, `ceil`).
- **BigInt Support**: Exact integer byte handling for digital data storage and human-readable file sizes.
- **Exhaustive Test Coverage**: Over 110 unit and integration tests with >99% statement coverage and >92% branch coverage.

---

## Installation

```bash
# npm
npm install @rahul_dadhich15/unit-converter-kit

# pnpm
pnpm add @rahul_dadhich15/unit-converter-kit

# yarn
yarn add @rahul_dadhich15/unit-converter-kit
```

---

## Quick Start

```ts
import {
  convertLength,
  convertArea,
  convertTemperature,
  convertVolume,
  convertMass,
  formatFileSize
} from '@rahul_dadhich15/unit-converter-kit';

// Length
convertLength(10, 'km', 'mi', { precision: 2 }); // 6.21

// Area
convertArea(100, 'm2', 'ft2', { precision: 2 }); // 1076.39

// Temperature (affine transformation)
convertTemperature(100, 'C', 'F'); // 212

// Volume (US vs Imperial distinction)
convertVolume(1, 'us-gal', 'L', { precision: 3 }); // 3.785

// Mass
convertMass(70, 'kg', 'lb', { precision: 2 }); // 154.32

// Human-readable file size formatting
formatFileSize(1536); // "1.5 KiB"
formatFileSize(1000000, { system: 'decimal' }); // "1 MB"
```

---

## Architecture & Conversion Model

Every physical dimension follows a canonical base-unit conversion architecture:

$$\text{Input Value} \xrightarrow{\times \text{factor}_{\text{from}}} \text{Canonical Base Unit} \xrightarrow{\div \text{factor}_{\text{to}}} \text{Target Unit}$$

| Dimension Category | Canonical Base Unit | Formula Model |
| :--- | :--- | :--- |
| **Area** | Square meter ($\text{m}^2$) | Factor |
| **Data Storage** | Byte ($\text{B}$) | Factor (powers of 1000 and 1024) |
| **Energy** | Joule ($\text{J}$) | Factor |
| **File Size** | Byte ($\text{B}$) | Exact BigInt / Factor |
| **Length** | Meter ($\text{m}$) | Factor |
| **Power** | Watt ($\text{W}$) | Factor |
| **Pressure** | Pascal ($\text{Pa}$) | Factor |
| **Speed** | Meter per second ($\text{m/s}$) | Factor |
| **Temperature** | Kelvin ($\text{K}$) | Affine Scale ($\text{Value} \times a + b$) |
| **Volume** | Cubic meter ($\text{m}^3$) | Factor |
| **Mass** | Kilogram ($\text{kg}$) | Factor |
| **Force / Weight** | Newton ($\text{N}$) | Factor & $F = m \cdot g$ |

---

## Subpath Imports & Tree-Shaking

Every module can be imported independently without pulling in other utilities:

```ts
import { convertArea } from '@rahul_dadhich15/unit-converter-kit/area-convert';
import { convertDataStorage } from '@rahul_dadhich15/unit-converter-kit/data-storage-convert';
import { convertEnergy } from '@rahul_dadhich15/unit-converter-kit/energy-convert';
import { convertFileSize, formatFileSize } from '@rahul_dadhich15/unit-converter-kit/file-size-convert';
import { convertLength } from '@rahul_dadhich15/unit-converter-kit/length-convert';
import { convertPower } from '@rahul_dadhich15/unit-converter-kit/power-convert';
import { convertPressure } from '@rahul_dadhich15/unit-converter-kit/pressure-convert';
import { convertSpeed } from '@rahul_dadhich15/unit-converter-kit/speed-convert';
import { convertTemperature } from '@rahul_dadhich15/unit-converter-kit/temperature-convert';
import { convertVolume } from '@rahul_dadhich15/unit-converter-kit/volume-convert';
import { convertMass, convertWeight, massToWeight } from '@rahul_dadhich15/unit-converter-kit/weight-convert';
```

---

## The 11 Conversion Modules

### 1. Area Converter (`area-convert`)

Converts 2D surface area measurements. Physical area cannot be negative by default.

#### API
- `convertArea(value, from, to, options?)`
- `getAreaUnits()`
- `getAreaUnitInfo(unit)`
- `isValidAreaUnit(unit)`
- `getAreaConversionFactor(from, to)`

#### Supported Units
| Unit ID | Name | Symbol | Factor to Base ($\text{m}^2$) |
| :--- | :--- | :--- | :--- |
| `mm2` | Square Millimeter | $\text{mm}^2$ | $10^{-6}$ |
| `cm2` | Square Centimeter | $\text{cm}^2$ | $10^{-4}$ |
| `m2` | Square Meter (Base) | $\text{m}^2$ | $1$ |
| `km2` | Square Kilometer | $\text{km}^2$ | $10^6$ |
| `in2` | Square Inch | $\text{in}^2$ | $0.00064516$ |
| `ft2` | Square Foot | $\text{ft}^2$ | $0.09290304$ |
| `yd2` | Square Yard | $\text{yd}^2$ | $0.83612736$ |
| `mi2` | Square Mile | $\text{mi}^2$ | $2,589,988.110336$ |
| `ac` | Acre (International) | $\text{ac}$ | $4,046.8564224$ |
| `ha` | Hectare | $\text{ha}$ | $10,000$ |

```ts
import { convertArea } from '@rahul_dadhich15/unit-converter-kit/area-convert';

convertArea(1, 'ha', 'ac', { precision: 2 }); // 2.47
```

---

### 2. Data Storage Converter (`data-storage-convert`)

Distinguishes standard SI decimal storage ($1000^n$) from IEC binary storage ($1024^n$). Decimal `kB` and binary `KiB` are **never treated as equivalent**.

#### API
- `convertDataStorage(value, from, to, options?)`
- `getDataStorageUnits()`
- `getDataStorageUnitInfo(unit)`
- `getDataStorageBreakdown(bytes, system?)`
- `isValidDataStorageUnit(unit)`

#### Supported Units
- **Decimal Bytes (SI)**: `B`, `kB` ($10^3$), `MB` ($10^6$), `GB` ($10^9$), `TB` ($10^{12}$), `PB` ($10^{15}$), `EB` ($10^{18}$)
- **Binary Bytes (IEC)**: `KiB` ($2^{10}$), `MiB` ($2^{20}$), `GiB` ($2^{30}$), `TiB` ($2^{40}$), `PiB` ($2^{50}$), `EiB` ($2^{60}$)
- **Decimal Bits (SI)**: `b`, `kb`, `Mb`, `Gb`, `Tb`, `Pb`, `Eb`
- **Binary Bits (IEC)**: `Kib`, `Mib`, `Gib`, `Tib`, `Pib`, `Eib`

```ts
import { convertDataStorage, getDataStorageBreakdown } from '@rahul_dadhich15/unit-converter-kit/data-storage-convert';

convertDataStorage(1, 'KiB', 'B'); // 1024
convertDataStorage(1, 'kB', 'B');  // 1000

// Hierarchical breakdown: 1536 bytes = 1 KiB + 512 B
const breakdown = getDataStorageBreakdown(1536, 'binary');
```

> [!NOTE]
> Following BIPM / IEC standards, `KB` is interpreted as decimal kilobyte (`kB`, 1000 bytes). For 1024 bytes, use `KiB`.

---

### 3. Energy Converter (`energy-convert`)

Converts thermodynamic, electrical, and atomic energy units.

#### API
- `convertEnergy(value, from, to, options?)`
- `getEnergyUnits()`
- `getEnergyUnitInfo(unit)`
- `isValidEnergyUnit(unit)`

#### Supported Units
| Unit ID | Name | Symbol | Factor to Base ($\text{J}$) | Standard / Convention |
| :--- | :--- | :--- | :--- | :--- |
| `J` | Joule (Base) | $\text{J}$ | $1$ | SI derived unit ($1\text{ N}\cdot\text{m}$) |
| `kJ` | Kilojoule | $\text{kJ}$ | $1,000$ | $10^3\text{ J}$ |
| `MJ` | Megajoule | $\text{MJ}$ | $10^6$ | $10^6\text{ J}$ |
| `Wh` | Watt-hour | $\text{Wh}$ | $3,600$ | $1\text{ W} \times 3600\text{ s}$ |
| `kWh` | Kilowatt-hour | $\text{kWh}$ | $3.6 \times 10^6$ | $1000\text{ W} \times 3600\text{ s}$ |
| `MWh` | Megawatt-hour | $\text{MWh}$ | $3.6 \times 10^9$ | $10^6\text{ W} \times 3600\text{ s}$ |
| `cal` | Calorie (Thermochemical) | $\text{cal}$ | $4.184$ | Exactly $4.184\text{ J}$ (ISO 80000-5) |
| `kcal` | Kilocalorie | $\text{kcal}$ | $4,184$ | Exactly $4,184\text{ J}$ |
| `eV` | Electronvolt | $\text{eV}$ | $1.602176634 \times 10^{-19}$ | CODATA 2018/2022 exact |
| `BTU` | British Thermal Unit (IT) | $\text{BTU}$ | $1055.05585262$ | International Table (ISO 31-4) |

```ts
import { convertEnergy } from '@rahul_dadhich15/unit-converter-kit/energy-convert';

convertEnergy(1, 'kWh', 'J'); // 3600000
convertEnergy(1, 'cal', 'J'); // 4.184
```

---

### 4. File Size Converter (`file-size-convert`)

Specialized for actual file sizes, human-readable display, user input parsing, and exact integer byte counts using `BigInt`.

#### API
- `convertFileSize(bytes, to, options?)`
- `formatFileSize(bytes, options?)`
- `parseFileSize(input)`
- `getFileSizeBreakdown(bytes, system?)`
- `getFileSizeUnits()`

```ts
import { formatFileSize, parseFileSize } from '@rahul_dadhich15/unit-converter-kit/file-size-convert';

formatFileSize(1536); // "1.5 KiB"
formatFileSize(1000000, { system: 'decimal' }); // "1 MB"
formatFileSize(1048576, { fullUnitNames: true }); // "1 Mebibytes"

// Parse user input strings
parseFileSize("1.5 MB"); // { bytes: 1500000n, value: 1.5, unit: "MB", system: "decimal" }
parseFileSize("1024 KiB"); // { bytes: 1048576n, value: 1024, unit: "KiB", system: "binary" }
```

---

### 5. Length Converter (`length-convert`)

Converts distance and length measurements from nanometers to nautical miles.

#### API
- `convertLength(value, from, to, options?)`
- `getLengthUnits()`
- `getLengthUnitInfo(unit)`
- `isValidLengthUnit(unit)`

#### Supported Units
| Unit ID | Name | Symbol | Factor to Base ($\text{m}$) |
| :--- | :--- | :--- | :--- |
| `nm` | Nanometer | $\text{nm}$ | $10^{-9}$ |
| `um` | Micrometer | $\mu\text{m}$ | $10^{-6}$ |
| `mm` | Millimeter | $\text{mm}$ | $0.001$ |
| `cm` | Centimeter | $\text{cm}$ | $0.01$ |
| `m` | Meter (Base) | $\text{m}$ | $1$ |
| `km` | Kilometer | $\text{km}$ | $1,000$ |
| `in` | Inch (International) | $\text{in}$ | $0.0254$ |
| `ft` | Foot | $\text{ft}$ | $0.3048$ |
| `yd` | Yard | $\text{yd}$ | $0.9144$ |
| `mi` | Mile (Statute) | $\text{mi}$ | $1,609.344$ |
| `nmi` | Nautical Mile | $\text{nmi}$ | $1,852$ (exact) |

---

### 6. Power Converter (`power-convert`)

Converts power measurements and distinguishes mechanical horsepower from metric horsepower (PS).

#### API
- `convertPower(value, from, to, options?)`
- `getPowerUnits()`
- `getPowerUnitInfo(unit)`
- `isValidPowerUnit(unit)`

#### Supported Units
| Unit ID | Name | Symbol | Factor to Base ($\text{W}$) |
| :--- | :--- | :--- | :--- |
| `mW` | Milliwatt | $\text{mW}$ | $0.001$ |
| `W` | Watt (Base) | $\text{W}$ | $1$ |
| `kW` | Kilowatt | $\text{kW}$ | $1,000$ |
| `MW` | Megawatt | $\text{MW}$ | $10^6$ |
| `GW` | Gigawatt | $\text{GW}$ | $10^9$ |
| `hp` | Mechanical Horsepower | $\text{hp}$ | $745.6998715822702$ ($550\text{ ft}\cdot\text{lbf/s}$) |
| `PS` | Metric Horsepower | $\text{PS}$ | $735.49875$ ($75\text{ kgf}\cdot\text{m/s}$) |
| `BTU/h` | BTU per hour | $\text{BTU/h}$ | $0.2930710701722222$ |

---

### 7. Pressure Converter (`pressure-convert`)

Converts absolute pressure measurements. Rejects negative pressure values by default.

#### API
- `convertPressure(value, from, to, options?)`
- `getPressureUnits()`
- `getPressureUnitInfo(unit)`
- `isValidPressureUnit(unit)`

#### Supported Units
| Unit ID | Name | Symbol | Factor to Base ($\text{Pa}$) | Note |
| :--- | :--- | :--- | :--- | :--- |
| `Pa` | Pascal (Base) | $\text{Pa}$ | $1$ | $1\text{ N/m}^2$ |
| `kPa` | Kilopascal | $\text{kPa}$ | $1,000$ | $10^3\text{ Pa}$ |
| `MPa` | Megapascal | $\text{MPa}$ | $10^6$ | $10^6\text{ Pa}$ |
| `bar` | Bar | $\text{bar}$ | $100,000$ | Exactly $10^5\text{ Pa}$ |
| `mbar` | Millibar | $\text{mbar}$ | $100$ | Exactly $1\text{ hPa}$ |
| `atm` | Standard Atmosphere | $\text{atm}$ | $101,325$ | 10th CGPM (1954) exact |
| `psi` | Pounds per Square Inch | $\text{psi}$ | $6,894.757293168361$ | $1\text{ lbf/in}^2$ |
| `Torr` | Torr | $\text{Torr}$ | $101,325 / 760 \approx 133.322368$ | Exactly $1/760\text{ atm}$ |
| `mmHg` | Millimeter of Mercury | $\text{mmHg}$ | $133.322387415$ | Conventional density definition |

> [!IMPORTANT]
> `Torr` ($101,325 / 760\text{ Pa}$) and `mmHg` ($133.322387415\text{ Pa}$) are mathematically distinct and strictly separated.

---

### 8. Speed Converter (`speed-convert`)

Converts velocity measurements. Preserves signed velocity (negative values allowed) for vector calculations. Mach is excluded because it varies based on altitude and temperature.

#### API
- `convertSpeed(value, from, to, options?)`
- `getSpeedUnits()`
- `getSpeedUnitInfo(unit)`
- `isValidSpeedUnit(unit)`

#### Supported Units
| Unit ID | Name | Symbol | Factor to Base ($\text{m/s}$) |
| :--- | :--- | :--- | :--- |
| `m/s` | Meter per Second (Base) | $\text{m/s}$ | $1$ |
| `km/h` | Kilometer per Hour | $\text{km/h}$ | $1 / 3.6 \approx 0.277778$ |
| `mph` | Mile per Hour | $\text{mph}$ | $0.44704$ (exact) |
| `ft/s` | Foot per Second | $\text{ft/s}$ | $0.3048$ (exact) |
| `kn` | Knot | $\text{kn}$ | $1852 / 3600 \approx 0.514444$ |

---

### 9. Temperature Converter (`temperature-convert`)

Implements true affine transformation formulas ($y = m \cdot x + b$) rather than multiplicative ratios. Rejects temperatures below physical absolute zero ($0\text{ K}$, $-273.15\text{ }^\circ\text{C}$, $-459.67\text{ }^\circ\text{F}$) by default.

#### API
- `convertTemperature(value, from, to, options?)`
- `celsiusToFahrenheit(celsius, options?)`
- `fahrenheitToCelsius(fahrenheit, options?)`
- `celsiusToKelvin(celsius, options?)`
- `kelvinToCelsius(kelvin, options?)`
- `getTemperatureUnits()`
- `getTemperatureUnitInfo(unit)`
- `isValidTemperatureUnit(unit)`

#### Conversion Formulas
- $\text{K} = \text{C} + 273.15$
- $\text{C} = \text{K} - 273.15$
- $\text{F} = \text{C} \times \frac{9}{5} + 32$
- $\text{C} = (\text{F} - 32) \times \frac{5}{9}$

```ts
import { convertTemperature, celsiusToFahrenheit } from '@rahul_dadhich15/unit-converter-kit/temperature-convert';

celsiusToFahrenheit(0);   // 32
celsiusToFahrenheit(100); // 212
celsiusToFahrenheit(-40); // -40

// Values below absolute zero throw a ConversionError unless explicitly allowed:
convertTemperature(-300, 'C', 'K'); // throws ConversionError (OUT_OF_RANGE)
convertTemperature(-300, 'C', 'K', { allowBelowAbsoluteZero: true }); // -26.85
```

---

### 10. Volume Converter (`volume-convert`)

Supports metric, US customary liquid, and British Imperial fluid units. Ambiguous unit identifiers without a system qualifier (such as `"gallon"` or `"pint"`) are intentionally rejected.

#### API
- `convertVolume(value, from, to, options?)`
- `getVolumeUnits()`
- `getVolumeUnitInfo(unit)`
- `isValidVolumeUnit(unit)`

#### Supported Units
- **Metric**: `mm3`, `cm3`, `mL` ($10^{-6}\text{ m}^3$), `L` ($10^{-3}\text{ m}^3$), `m3` (Base)
- **Cubic Imperial / US**: `in3`, `ft3`, `yd3`
- **US Customary Fluid**:
  - `us-fl-oz`: $29.5735295625\text{ mL}$
  - `us-cup`: $8\text{ US fl oz} = 236.5882365\text{ mL}$
  - `us-pt`: $16\text{ US fl oz} = 473.176473\text{ mL}$
  - `us-qt`: $32\text{ US fl oz} = 946.352946\text{ mL}$
  - `us-gal`: $231\text{ in}^3 = 3.785411784\text{ L}$
- **Imperial Fluid**:
  - `imp-fl-oz`: $28.4130625\text{ mL}$
  - `imp-pt`: $20\text{ Imp fl oz} = 568.26125\text{ mL}$
  - `imp-qt`: $40\text{ Imp fl oz} = 1.1365225\text{ L}$
  - `imp-gal`: Exactly $4.54609\text{ L}$

```ts
import { convertVolume } from '@rahul_dadhich15/unit-converter-kit/volume-convert';

convertVolume(1, 'imp-gal', 'us-gal', { precision: 4 }); // 1.2009
```

---

### 11. Weight & Mass Converter (`weight-convert`)

Strictly separates physical **mass** (quantity of matter) from **force / weight** (gravitational pull on mass). Under Newtonian physics ($F = m \cdot g$), mass cannot be converted to force without a gravitational acceleration.

#### API
- `convertMass(value, from, to, options?)`
- `convertWeight(value, from, to, options?)`
- `massToWeight(mass, massUnit, forceUnit, gravity?, options?)`
- `weightToMass(force, forceUnit, massUnit, gravity?, options?)`
- `getMassUnits()`
- `getWeightUnits()`
- `getWeightUnitInfo(unit)`
- `isValidMassUnit(unit)`
- `isValidForceUnit(unit)`
- `STANDARD_GRAVITY` (constant: $9.80665\text{ m/s}^2$)

#### Supported Mass Units
`ug`, `mg`, `g`, `kg` (Base), `t` (Metric Tonne), `oz` (Avoirdupois), `lb` ($0.45359237\text{ kg}$ exact), `st` ($14\text{ lb}$), `us-ton` ($2,000\text{ lb}$), `imperial-ton` ($2,240\text{ lb}$)

#### Supported Force Units
`N` (Base), `kN`, `MN`, `lbf` ($4.4482216152605\text{ N}$ exact), `kgf` ($9.80665\text{ N}$ exact), `dyn` ($10^{-5}\text{ N}$)

```ts
import {
  convertMass,
  convertWeight,
  massToWeight,
  weightToMass,
  STANDARD_GRAVITY
} from '@rahul_dadhich15/unit-converter-kit/weight-convert';

// Pure mass conversion
convertMass(1, 'lb', 'kg'); // 0.45359237

// Pure force conversion
convertWeight(1, 'kgf', 'N'); // 9.80665

// Mass to Weight on Earth (default gravity: 9.80665 m/s²)
massToWeight(1, 'kg', 'N'); // 9.80665

// Mass to Weight on the Moon (gravity: 1.62 m/s²)
massToWeight(100, 'kg', 'N', 1.62); // 162

// Weight to Mass
weightToMass(9.80665, 'N', 'kg'); // 1
```

---

## Precision & Numerical Correctness

JavaScript represents numbers using IEEE 754 double-precision floating point (64-bit). Inherent binary float artifacts (such as `0.1 + 0.2 = 0.30000000000000004` or `0.3048 / 0.0254 = 12.000000000000002`) are cleaned using scientific significance shifting while retaining full unrounded numerical precision (up to 15 significant digits).

When exact rounding is desired:

```ts
// Unrounded by default:
convertLength(10, 'km', 'mi'); // 6.21371192237334

// Configurable precision:
convertLength(10, 'km', 'mi', { precision: 2 }); // 6.21
convertLength(10, 'km', 'mi', { precision: 4, roundMode: 'floor' }); // 6.2137
```

---

## Error Handling

All invalid arguments throw typed instances of `ConversionError`:

```ts
import { ConversionError } from '@rahul_dadhich15/unit-converter-kit';

try {
  convertLength(-5, 'm', 'ft');
} catch (error) {
  if (error instanceof ConversionError) {
    console.error(error.code);    // 'OUT_OF_RANGE'
    console.error(error.message); // 'length value cannot be negative (received -5)'
    console.error(error.details); // { field: 'length value', received: -5 }
  }
}
```

### Error Codes
- `INVALID_INPUT`: Thrown when an input is `NaN`, infinite, or not a number.
- `UNKNOWN_UNIT`: Thrown when a unit identifier or alias is unmapped.
- `OUT_OF_RANGE`: Thrown when values violate physical boundaries (e.g. negative area or temperature below absolute zero).
- `PRECISION_ERROR`: Thrown when precision parameters are out of range.

---

## Scientific Standards & Reference Constants

| Value / Constant | Symbol / Value | Standard Source |
| :--- | :--- | :--- |
| **Standard Gravity** | $g_0 = 9.80665\text{ m/s}^2$ | 3rd CGPM (1901) |
| **Standard Atmosphere** | $1\text{ atm} = 101,325\text{ Pa}$ | 10th CGPM (1954) |
| **Elementary Charge (eV)** | $1\text{ eV} = 1.602176634 \times 10^{-19}\text{ J}$ | CODATA 2018 / 2022 |
| **International Pound** | $1\text{ lb} = 0.45359237\text{ kg}$ | International Yard & Pound Agreement (1959) |
| **International Inch** | $1\text{ in} = 0.0254\text{ m}$ | International Yard & Pound Agreement (1959) |
| **Imperial Gallon** | $1\text{ gal (Imp)} = 4.54609\text{ L}$ | UK Weights and Measures Act (1985) |
| **US Liquid Gallon** | $1\text{ gal (US)} = 231\text{ in}^3 = 3.785411784\text{ L}$ | NIST Handbook 44 |
| **Thermochemical Calorie** | $1\text{ cal} = 4.184\text{ J}$ | ISO 80000-5 / NIST |
| **International Table BTU** | $1\text{ BTU} = 1055.05585262\text{ J}$ | ISO 31-4 / 5th ICPS |

---

## Browser Compatibility & Environments

- **Browsers**: All modern browsers supporting ES2022+ (Chrome, Firefox, Safari, Edge).
- **Frontend Frameworks**: React, Vite, Next.js, Vue, Svelte, Angular, Solid.
- **Node.js**: Verified on Node 22 and Node 24.
- **Backend / Server APIs**: Zero required.
- **State**: Completely pure functions with zero global state.

---

## Development, Testing & Build Scripts

```bash
# Install dependencies
npm install

# Run type checking
npm run typecheck

# Run linter
npm run lint

# Run all tests
npm test

# Run tests with coverage reports
npm run test:coverage

# Build ESM, CJS, and DTS distributions
npm run build

# Run ESM and CommonJS smoke tests
npm run test:smoke

# Run isolated consumer verification (pack -> tarball -> clean install -> verify)
npm run test:consumer
```

---

## License

MIT © [Rahul Dadhich](LICENSE)
