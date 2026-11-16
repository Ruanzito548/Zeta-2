/**
 * Pricing type definitions
 * Centralized pricing and economic data structures
 */

export type PricingSource = 'auction_house' | 'npc' | 'calculated' | 'manual';

export interface Price {
  itemId: string;
  source: PricingSource;
  buyPrice?: number;
  sellPrice?: number;
  quantity?: number;
  timestamp: Date;
  realm?: string;
}

export interface PricePoint {
  id: string;
  itemId: string;
  buyPrice?: number;
  sellPrice?: number;
  avgPrice?: number;
  minBuyout?: number;
  timestamp: Date;
  realm?: string;
}

export interface PriceHistory {
  itemId: string;
  prices: PricePoint[];
  firstRecorded: Date;
  lastUpdated: Date;
}

export interface CraftingCost {
  recipeId: string;
  itemId: string;
  materialsCost: number;
  profitMargin: number;
  profitPercentage: number;
  timestamp: Date;
  assumptions: {
    materialPrices: Record<string, number>;
    craftQuantity: number;
  };
}

export interface PricingComparison {
  itemId: string;
  auctionHouseBuy?: number;
  auctionHouseSell?: number;
  npcBuy?: number;
  npcSell?: number;
  craftingCost?: number;
  profitOpportunity?: {
    type: 'arbitrage' | 'crafting' | 'disenchant' | 'vendor_flip';
    profit: number;
    roi: number;
  };
  timestamp: Date;
}

export interface PricingTaxes {
  auctionHouseFeePercent: number;
  taxableAmount: number;
  totalTax: number;
  netProfit: number;
}

export interface PricingResult {
  itemId: string;
  quantity: number;
  buyPrice: number;
  sellPrice: number;
  taxes: PricingTaxes;
  grossProfit: number;
  netProfit: number;
  roi: number;
  profitPerUnit: number;
}
