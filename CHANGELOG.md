# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-11-24

### Added
- Initial production-ready release of `@rahul_dadhich15/unit-converter-kit`.
- **Zero runtime dependencies** architecture with 100% pure TypeScript calculations.
- Comprehensive support for 11 unit conversion categories:
  - `area-convert`: Square millimeter, square centimeter, square meter, square kilometer, square inch, square foot, square yard, square mile, acre, hectare.
  - `data-storage-convert`: Bits, bytes, decimal SI units (kB, MB, GB, TB, PB, EB), and binary IEC units (KiB, MiB, GiB, TiB, PiB, EiB) plus bit-based multiples.
  - `energy-convert`: Joule, kilojoule, megajoule, watt-hour, kilowatt-hour, megawatt-hour, thermochemical calorie, kilocalorie, electronvolt (CODATA exact), and British thermal unit (IT BTU).
  - `file-size-convert`: Auto human-readable formatting, decimal/binary scaling, parsing strings, BigInt byte counts, and hierarchical component breakdown.
  - `length-convert`: Nanometer, micrometer, millimeter, centimeter, meter, kilometer, inch, foot, yard, mile, and nautical mile.
  - `power-convert`: Milliwatt, watt, kilowatt, megawatt, gigawatt, mechanical horsepower (Imperial), metric horsepower (PS), and BTU per hour (BTU/h).
  - `pressure-convert`: Pascal, kilopascal, megapascal, bar, millibar, standard atmosphere (101,325 Pa), PSI, Torr (1/760 atm), and conventional millimeter of mercury (mmHg).
  - `speed-convert`: Meter per second, kilometer per hour, mile per hour, foot per second, and knot. Signed velocity preserved.
  - `temperature-convert`: Degree Celsius, degree Fahrenheit, and Kelvin with physical absolute zero validation and affine formulas.
  - `volume-convert`: Metric (mm³, cm³, mL, L, m³), US customary (in³, ft³, yd³, us-fl-oz, us-cup, us-pt, us-qt, us-gal), and Imperial (imp-fl-oz, imp-pt, imp-qt, imp-gal).
  - `weight-convert`: Strict distinction between mass (µg, mg, g, kg, t, oz, lb, st, US short ton, UK long ton) and force/weight (N, kN, MN, lbf, kgf, dyn) with configurable gravitational acceleration.
- Root exports and 11 distinct subpath exports (`/area-convert`, `/data-storage-convert`, etc.).
- Dual ESM and CommonJS builds with complete TypeScript declaration files (`.d.ts` and `.d.cts`).
- Strict unit validation, configurable decimal precision, and custom `ConversionError` hierarchy.
