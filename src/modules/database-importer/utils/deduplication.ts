/**
 * Deduplication Service
 * Identifies and handles duplicate items
 */

import type { NormalizedItem } from '../types';
import type { Item, ExternalIds } from '@/types/item';

export class DeduplicationService {
  /**
   * Check if two items are likely the same
   * Returns confidence score and reason
   */
  static compareItems(item1: NormalizedItem, item2: NormalizedItem): {
    isSame: boolean;
    confidence: number;
    reasons: string[];
  } {
    const reasons: string[] = [];
    let matches = 0;
    let totalChecks = 0;

    // Check 1: Exact name match (high confidence)
    totalChecks++;
    if (item1.name.toLowerCase() === item2.name.toLowerCase()) {
      matches += 2;
      reasons.push('Exact name match');
    }

    // Check 2: Similar name (Levenshtein distance < 2)
    totalChecks++;
    const distance = this.levenshteinDistance(
      item1.name.toLowerCase(),
      item2.name.toLowerCase(),
    );
    if (distance <= 2) {
      matches += 1;
      reasons.push(`Similar name (distance: ${distance})`);
    }

    // Check 3: Same classification and quality
    totalChecks++;
    if (
      item1.classification === item2.classification &&
      item1.quality === item2.quality
    ) {
      matches += 1;
      reasons.push('Same classification and quality');
    }

    // Check 4: Same item level
    totalChecks++;
    if (
      item1.itemLevel &&
      item2.itemLevel &&
      item1.itemLevel === item2.itemLevel
    ) {
      matches += 1;
      reasons.push(`Same item level (${item1.itemLevel})`);
    }

    // Check 5: Same required level
    totalChecks++;
    if (
      item1.requiredLevel &&
      item2.requiredLevel &&
      item1.requiredLevel === item2.requiredLevel
    ) {
      matches += 1;
      reasons.push(`Same required level (${item1.requiredLevel})`);
    }

    // Check 6: Same max stack size
    totalChecks++;
    if (
      item1.maxStackSize &&
      item2.maxStackSize &&
      item1.maxStackSize === item2.maxStackSize
    ) {
      matches += 0.5;
      reasons.push(`Same max stack (${item1.maxStackSize})`);
    }

    const confidence = Math.min(1, matches / totalChecks);
    const isSame = confidence >= 0.6; // 60% confidence threshold

    return { isSame, confidence, reasons };
  }

  /**
   * Check if external ID already exists in item
   */
  static hasExternalId(item: Item, sourceKey: string, id: string | number): boolean {
    const key = sourceKey as keyof ExternalIds;
    return item.externalIds[key] === id;
  }

  /**
   * Check if item can be updated with new data
   * Returns true if new data has better information
   */
  static canUpdateItem(
    existingItem: Item,
    newNormalized: NormalizedItem,
  ): { canUpdate: boolean; changes: string[] } {
    const changes: string[] = [];

    // Don't overwrite existing data with empty data
    if (!newNormalized.name && existingItem.name) {
      return { canUpdate: false, changes: [] };
    }

    // Check if new data has more information
    if (
      !existingItem.itemLevel &&
      newNormalized.itemLevel
    ) {
      changes.push('Added item level');
    }

    if (
      !existingItem.requiredLevel &&
      newNormalized.requiredLevel
    ) {
      changes.push('Added required level');
    }

    if (
      !existingItem.vendorInformation &&
      newNormalized.sellPrice
    ) {
      changes.push('Added vendor information');
    }

    // Can update if we have improvements
    return { canUpdate: changes.length > 0, changes };
  }

  /**
   * Levenshtein distance between two strings
   * Measures how different two strings are
   */
  private static levenshteinDistance(a: string, b: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1, // deletion
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }
}
