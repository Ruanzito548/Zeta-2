/**
 * ForeverDB Adapter
 * Connects to ForeverDB API for item data
 */

import type { DataSourceAdapter, ForeverDBItem } from '../types';

export class ForeverDBAdapter implements DataSourceAdapter {
  name = 'ForeverDB';
  key = 'foreverdb';
  
  private apiKey: string;
  private baseUrl = 'https://foreverdb.net/api/v1';
  private itemCount: number | null = null;

  constructor(apiKey?: string) {
    // Get from environment if not provided
    this.apiKey = apiKey || process.env.FOREVERDB_API_KEY || '';
  }

  async validateConnection(): Promise<boolean> {
    try {
      if (!this.apiKey) {
        console.warn('ForeverDB API key not configured');
        return false;
      }

      // Try to fetch metadata to validate connection
      const response = await fetch(`${this.baseUrl}/meta`, {
        headers: {
          'X-API-Key': this.apiKey,
          'User-Agent': 'Zeta2-Importer/1.0',
        },
      });

      if (response.status === 401) {
        console.error('ForeverDB: Invalid API key');
        return false;
      }

      if (response.status === 429) {
        console.error('ForeverDB: Rate limit exceeded');
        return false;
      }

      if (!response.ok) {
        console.error(`ForeverDB: HTTP ${response.status}`);
        return false;
      }

      const data = await response.json();
      
      // Cache item count from metadata
      if (data.items) {
        this.itemCount = data.items;
      }

      return true;
    } catch (error) {
      console.error('ForeverDB connection validation failed:', error);
      return false;
    }
  }

  async getItemCount(): Promise<number> {
    if (this.itemCount !== null && this.itemCount !== undefined) {
      return this.itemCount;
    }

    try {
      const response = await fetch(`${this.baseUrl}/meta`, {
        headers: {
          'X-API-Key': this.apiKey,
          'User-Agent': 'Zeta2-Importer/1.0',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const count = typeof data.items === 'number' ? data.items : 0;
      this.itemCount = count;
      return count;
    } catch (error) {
      console.error('Failed to get ForeverDB item count:', error);
      return 0;
    }
  }

  async fetchItems(limit: number, offset: number): Promise<ForeverDBItem[]> {
    try {
      // Validate limit
      const maxLimit = 100;
      const actualLimit = Math.min(limit, maxLimit);

      const response = await fetch(
        `${this.baseUrl}/items?limit=${actualLimit}&offset=${offset}`,
        {
          headers: {
            'X-API-Key': this.apiKey,
            'User-Agent': 'Zeta2-Importer/1.0',
          },
        },
      );

      if (response.status === 402) {
        console.error('ForeverDB: Subscription required');
        return [];
      }

      if (response.status === 429) {
        console.error('ForeverDB: Rate limit exceeded');
        // Return empty to trigger retry in importer
        return [];
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Failed to fetch items from ForeverDB:', error);
      return [];
    }
  }

  async getItem(id: number): Promise<ForeverDBItem | null> {
    try {
      const response = await fetch(`${this.baseUrl}/items/${id}`, {
        headers: {
          'X-API-Key': this.apiKey,
          'User-Agent': 'Zeta2-Importer/1.0',
        },
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.data || null;
    } catch (error) {
      console.error(`Failed to fetch item ${id} from ForeverDB:`, error);
      return null;
    }
  }
}
