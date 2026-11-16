/**
 * Item Normalizer
 * Converts raw API data to normalized format
 */

import type { ForeverDBItem, NormalizedItem } from '../types';
import type { ItemClassification, ItemQuality } from '@/types/item';

/**
 * Map ForeverDB quality codes to our quality values
 */
const qualityMap: Record<number, ItemQuality> = {
  0: 'poor',
  1: 'common',
  2: 'uncommon',
  3: 'rare',
  4: 'epic',
  5: 'legendary',
};

/**
 * Map ForeverDB class codes to our classification
 */
const classificationMap: Record<number, ItemClassification> = {
  0: 'misc', // Consumable
  1: 'weapon',
  2: 'armor',
  3: 'misc', // Reagent
  4: 'misc', // Projectile
  5: 'misc', // Quiver
  6: 'quest',
  7: 'misc', // Key
  8: 'misc', // Miscellaneous
  9: 'armor', // Armor
  10: 'misc', // Recipe
  11: 'misc', // Money (not in our types, fallback to misc)
  12: 'misc', // Generic (deprecated)
  13: 'misc', // Material
  14: 'armor', // Armor
  15: 'misc', // Currency
  16: 'gem',
  17: 'misc', // Blizzard
  18: 'misc', // Bind Equip
  19: 'misc', // Itemset
  20: 'other',
};

export class ItemNormalizer {
  /**
   * Normalize a single ForeverDB item
   */
  static normalize(item: ForeverDBItem, sourceKey: string): NormalizedItem {
    return {
      externalIds: {
        forever: item.id,
      },
      name: item.name,
      classification: classificationMap[item.class] || 'other',
      quality: qualityMap[item.quality],
      itemLevel: item.itemLevel,
      requiredLevel: item.requiredLevel,
      maxStackSize: item.maxStackSize,
      sellPrice: item.sellPrice,
      buyPrice: item.buyPrice,
      icon: item.icon,
      description: item.description,
      sourceKey,
      rawData: {
        foreverdb: {
          id: item.id,
          name: item.name,
          quality: item.quality,
          class: item.class,
          subclass: item.subclass,
          binding: item.binding,
          betaEvent: item.betaEvent,
          speculation: item.speculation,
        },
      },
    };
  }

  /**
   * Create internal ID from normalized item
   */
  static createInternalId(normalized: NormalizedItem): string {
    // Format: type-forever-{id}
    // Example: item-forever-19019
    const forever = normalized.externalIds.forever;
    if (typeof forever === 'number') {
      return `item-forever-${forever}`;
    }
    throw new Error('Invalid external ID format');
  }

  /**
   * Validate normalized item has required fields
   */
  static validate(normalized: NormalizedItem): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!normalized.name || normalized.name.trim().length === 0) {
      errors.push('Name is required');
    }

    if (!normalized.classification) {
      errors.push('Classification is required');
    }

    if (!normalized.externalIds.forever) {
      errors.push('External ID (forever) is required');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if item has meaningful data
   */
  static hasMinimalData(normalized: NormalizedItem): boolean {
    // Item must have at least: name and external ID
    return (
      !!normalized.name &&
      !!normalized.externalIds.forever
    );
  }
}
