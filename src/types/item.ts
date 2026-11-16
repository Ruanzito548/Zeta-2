/**
 * Item type definitions
 * Represents a World of Warcraft Forever item in the system
 */

export type ItemClassification =
  | 'armor'
  | 'weapon'
  | 'recipe'
  | 'consumable'
  | 'material'
  | 'gem'
  | 'misc'
  | 'quest'
  | 'other';

export type ItemQuality =
  | 'poor'
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'artifact';

export interface VendorInformation {
  buyPrice?: number;
  sellPrice?: number;
  vendorName?: string;
  vendorLocation?: string;
}

export interface ItemSource {
  type: 'quest' | 'vendor' | 'drop' | 'craft' | 'dungeon' | 'raid' | 'other';
  source: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'very_rare';
}

export interface ExternalIds {
  wowhead?: number;
  forever?: number;
  [key: string]: number | string | undefined;
}

export interface ItemMetadata {
  createdAt: Date;
  updatedAt: Date;
  source: string;
  sourceTimestamp: Date;
}

export interface Item {
  id: string;
  name: string;
  slug: string;
  externalIds: ExternalIds;
  classification: ItemClassification;
  quality?: ItemQuality;
  itemLevel?: number;
  requiredLevel?: number;
  maxStackSize?: number;
  vendorInformation?: VendorInformation;
  sources?: ItemSource[];
  metadata: ItemMetadata;
}

export interface CreateItemInput {
  name: string;
  slug: string;
  externalIds: ExternalIds;
  classification: ItemClassification;
  quality?: ItemQuality;
  itemLevel?: number;
  requiredLevel?: number;
  maxStackSize?: number;
  vendorInformation?: VendorInformation;
  sources?: ItemSource[];
}

export interface UpdateItemInput {
  name?: string;
  slug?: string;
  externalIds?: Partial<ExternalIds>;
  classification?: ItemClassification;
  quality?: ItemQuality;
  itemLevel?: number;
  requiredLevel?: number;
  maxStackSize?: number;
  vendorInformation?: VendorInformation;
  sources?: ItemSource[];
}
