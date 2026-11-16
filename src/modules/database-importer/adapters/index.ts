/**
 * Adapter Registry
 * Central place to manage all data source adapters
 */

import type { DataSourceAdapter } from '../types';
import { ForeverDBAdapter } from './ForeverDBAdapter';

export interface AdapterConfig {
  foreverdb?: {
    apiKey: string;
  };
}

export class AdapterRegistry {
  private adapters: Map<string, DataSourceAdapter> = new Map();

  constructor(config?: AdapterConfig) {
    this.registerAdapters(config);
  }

  private registerAdapters(config?: AdapterConfig): void {
    // Register ForeverDB adapter
    const foreverdbKey = config?.foreverdb?.apiKey;
    this.adapters.set('foreverdb', new ForeverDBAdapter(foreverdbKey));
  }

  /**
   * Get adapter by key
   */
  getAdapter(key: string): DataSourceAdapter | null {
    return this.adapters.get(key) || null;
  }

  /**
   * List all available adapters
   */
  getAvailableAdapters(): DataSourceAdapter[] {
    return Array.from(this.adapters.values());
  }

  /**
   * Register a new adapter
   */
  registerAdapter(adapter: DataSourceAdapter): void {
    this.adapters.set(adapter.key, adapter);
  }

  /**
   * Check which adapters are ready
   */
  async getReadyAdapters(): Promise<DataSourceAdapter[]> {
    const adapters = this.getAvailableAdapters();
    const ready: DataSourceAdapter[] = [];

    for (const adapter of adapters) {
      try {
        const isValid = await adapter.validateConnection();
        if (isValid) {
          ready.push(adapter);
        }
      } catch (error) {
        console.error(`Adapter ${adapter.name} validation failed:`, error);
      }
    }

    return ready;
  }
}

// Export singleton
let registryInstance: AdapterRegistry | null = null;

export function getAdapterRegistry(config?: AdapterConfig): AdapterRegistry {
  if (!registryInstance) {
    registryInstance = new AdapterRegistry(config);
  }
  return registryInstance;
}
