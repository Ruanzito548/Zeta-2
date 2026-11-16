/**
 * Database Importer Types
 * Type definitions for the item import system
 */

import type { Item, ExternalIds, ItemClassification, ItemQuality } from '@/types/item';

/**
 * Raw item data from ForeverDB
 */
export interface ForeverDBItem {
  id: number;
  name: string;
  quality: number; // 0=Poor, 1=Common, 2=Uncommon, 3=Rare, 4=Epic, 5=Legendary
  class: number; // Item class ID
  subclass: number; // Item subclass ID
  requiredLevel?: number;
  itemLevel?: number;
  maxStackSize?: number;
  sellPrice?: number;
  buyPrice?: number;
  icon?: string;
  description?: string;
  binding?: number;
  statsCount?: number;
  specs?: Array<{ key: string; value: string }>;
  betaEvent?: boolean;
  speculation?: boolean;
  liveClient?: Record<string, unknown>;
  dataFromBuild?: Record<string, unknown>;
}

/**
 * Normalized item for storage
 */
export interface NormalizedItem {
  externalIds: ExternalIds;
  name: string;
  classification: ItemClassification;
  quality?: ItemQuality;
  itemLevel?: number;
  requiredLevel?: number;
  maxStackSize?: number;
  sellPrice?: number;
  buyPrice?: number;
  icon?: string;
  description?: string;
  sourceKey: string; // 'foreverdb', 'wowforever', etc.
  rawData: Record<string, unknown>;
}

/**
 * Result of importing an item
 */
export type ImportResult =
  | {
      type: 'created';
      itemId: string;
      item: Item;
    }
  | {
      type: 'updated';
      itemId: string;
      changes: string[];
      item: Item;
    }
  | {
      type: 'duplicate';
      itemId: string;
      duplicateOf: string;
      reason: string;
    }
  | {
      type: 'error';
      itemId?: string;
      error: string;
    };

/**
 * Import session state
 */
export interface ImportSession {
  id: string;
  source: string;
  status: 'idle' | 'analyzing' | 'running' | 'paused' | 'completed' | 'failed';
  mode: 'dry-run' | 'import';
  startTime: Date;
  endTime?: Date;
  totalAvailable: number;
  processed: number;
  created: number;
  updated: number;
  duplicates: number;
  errors: number;
  results: ImportResult[];
  checkpoint: {
    offset: number;
    lastItemId?: string;
  };
  error?: string;
}

/**
 * Data source adapter interface
 */
export interface DataSourceAdapter {
  name: string;
  key: string;
  
  /**
   * Get total count of available items
   */
  getItemCount(): Promise<number>;
  
  /**
   * Fetch items with pagination
   */
  fetchItems(limit: number, offset: number): Promise<ForeverDBItem[]>;
  
  /**
   * Get a single item by ID
   */
  getItem(id: number): Promise<ForeverDBItem | null>;
  
  /**
   * Validate the connection and API key
   */
  validateConnection(): Promise<boolean>;
}

/**
 * Import statistics
 */
export interface ImportStats {
  totalProcessed: number;
  totalCreated: number;
  totalUpdated: number;
  totalDuplicates: number;
  totalErrors: number;
  successRate: number;
  duration: number; // milliseconds
  itemsPerSecond: number;
  errors: Array<{
    itemId?: string;
    message: string;
  }>;
}

/**
 * Deduplication result
 */
export interface DeduplicationResult {
  externalId: string;
  existingItemId?: string;
  isDuplicate: boolean;
  confidence: number; // 0-1
  reason: string;
}

/**
 * Item mapping for external IDs
 */
export interface ItemMapping {
  itemId: string;
  externalIds: ExternalIds;
  sources: string[];
  createdAt: Date;
  updatedAt: Date;
}
