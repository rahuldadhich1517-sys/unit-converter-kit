import { ConversionError } from './errors.js';
import { applyPrecision } from './precision.js';
import type { ConversionOptions, UnitCategory, UnitInfo } from './types.js';
import { validateNumber } from './validation.js';

export class UnitRegistry<TId extends string, TInfo extends UnitInfo<TId> = UnitInfo<TId>> {
  private readonly units: Map<TId, TInfo> = new Map();
  private readonly aliasMap: Map<string, TId> = new Map();
  public readonly canonicalBaseUnit: TId;
  public readonly category: UnitCategory;

  constructor(category: UnitCategory, canonicalBaseUnit: TId, unitList: readonly TInfo[]) {
    this.category = category;
    this.canonicalBaseUnit = canonicalBaseUnit;

    for (const unit of unitList) {
      this.units.set(unit.id, Object.freeze({ ...unit }));
      this.aliasMap.set(unit.id, unit.id);
      this.aliasMap.set(unit.symbol, unit.id);
      if (unit.aliases) {
        for (const alias of unit.aliases) {
          this.aliasMap.set(alias, unit.id);
        }
      }
    }
  }

  /**
   * Returns all registered units.
   */
  getUnits(): TInfo[] {
    return Array.from(this.units.values());
  }

  /**
   * Resolves a unit name, symbol, or unambiguous alias to canonical unit ID.
   */
  resolveUnitId(unit: string): TId | undefined {
    if (typeof unit !== 'string') return undefined;
    if (this.units.has(unit as TId)) {
      return unit as TId;
    }
    const directMatch = this.aliasMap.get(unit);
    if (directMatch) return directMatch;

    return this.aliasMap.get(unit.trim());
  }

  /**
   * Returns metadata for the given unit or undefined if not recognized.
   */
  getUnitInfo(unit: string): TInfo | undefined {
    const id = this.resolveUnitId(unit);
    if (!id) return undefined;
    return this.units.get(id);
  }

  /**
   * Checks whether the given string is a valid unit or alias.
   */
  isValidUnit(unit: string): unit is TId {
    return this.resolveUnitId(unit) !== undefined;
  }

  /**
   * Retrieves unit info, throwing a descriptive ConversionError if unknown.
   */
  requireUnit(unit: string, fieldName = 'unit'): TInfo {
    const info = this.getUnitInfo(unit);
    if (!info) {
      const validUnits = Array.from(this.units.keys()).join(', ');
      throw new ConversionError(
        `Unknown ${this.category} unit: "${unit}" for ${fieldName}. Supported units: ${validUnits}`,
        'UNKNOWN_UNIT',
        { unit, field: fieldName, category: this.category }
      );
    }
    return info;
  }

  /**
   * Computes the conversion factor from one unit to another.
   * `result = value * factor`
   */
  getConversionFactor(fromUnit: string, toUnit: string): number {
    const from = this.requireUnit(fromUnit, 'from');
    const to = this.requireUnit(toUnit, 'to');
    return applyPrecision(from.factorToBase / to.factorToBase);
  }

  /**
   * Converts a linear numerical value from one unit to another using the canonical base unit.
   */
  convertLinear(
    value: number,
    fromUnit: string,
    toUnit: string,
    options?: ConversionOptions
  ): number {
    validateNumber(value, 'value', { allowNegative: options?.allowNegative });
    const from = this.requireUnit(fromUnit, 'from');
    const to = this.requireUnit(toUnit, 'to');

    if (from.id === to.id) {
      return applyPrecision(value, options?.precision, options?.roundMode);
    }

    const valueInBase = value * from.factorToBase;
    const result = valueInBase / to.factorToBase;

    return applyPrecision(result, options?.precision, options?.roundMode);
  }
}
