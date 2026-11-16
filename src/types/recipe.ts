/**
 * Recipe type definitions
 * Represents crafting recipes in World of Warcraft Forever
 */

export type Profession =
  | 'alchemy'
  | 'blacksmithing'
  | 'cookery'
  | 'disenchanting'
  | 'enchanting'
  | 'engineering'
  | 'herbalism'
  | 'jewel_crafting'
  | 'leather_working'
  | 'mining'
  | 'skinning'
  | 'tailoring'
  | 'transmutation'
  | 'other';

export interface RecipeMaterial {
  itemId: string;
  quantity: number;
  optional?: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  slug: string;
  profession: Profession;
  skillRequired: number;
  producedItemId: string;
  producedQuantity: number;
  materials: RecipeMaterial[];
  externalIds: {
    wowhead?: number;
    forever?: number;
    [key: string]: number | string | undefined;
  };
  source: string;
  sourceTimestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRecipeInput {
  name: string;
  slug: string;
  profession: Profession;
  skillRequired: number;
  producedItemId: string;
  producedQuantity: number;
  materials: RecipeMaterial[];
  externalIds: {
    wowhead?: number;
    forever?: number;
    [key: string]: number | string | undefined;
  };
  source: string;
}

export interface UpdateRecipeInput {
  name?: string;
  slug?: string;
  profession?: Profession;
  skillRequired?: number;
  producedItemId?: string;
  producedQuantity?: number;
  materials?: RecipeMaterial[];
}
