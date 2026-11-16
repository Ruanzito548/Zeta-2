/**
 * Database Import Service
 * Main import engine that orchestrates the import process
 * Runs only on the server using Firebase Admin SDK
 */

import type {
  DataSourceAdapter,
  ForeverDBItem,
  NormalizedItem,
  ImportResult,
  ImportStats,
  ImportSession,
} from '../types';
import { ItemNormalizer } from '../utils/normalizer';
import { DeduplicationService } from '../utils/deduplication';
import { createSlug } from '../utils/slug';
import type { Item, CreateItemInput } from '@/types/item';
import type { FirestoreDB, FirestoreBatch, FirestoreDocRef } from '../types/firestore';

/**
 * Database Importer
 * Server-side only service for importing items
 */
export class DatabaseImporter {
  private db: FirestoreDB;
  private adapter: DataSourceAdapter;
  private session: ImportSession | null = null;
  private sessionRef: FirestoreDocRef | null = null;

  constructor(db: FirestoreDB, adapter: DataSourceAdapter) {
    if (!db) {
      throw new Error('Firestore instance required');
    }
    this.db = db;
    this.adapter = adapter;
  }

  /**
   * Analyze a data source
   * Returns available item count and sample data
   */
  async analyzeSource(): Promise<{
    totalAvailable: number;
    sampleItems: NormalizedItem[];
    success: boolean;
    error?: string;
  }> {
    try {
      // Check connection
      const isValid = await this.adapter.validateConnection();
      if (!isValid) {
        return {
          totalAvailable: 0,
          sampleItems: [],
          success: false,
          error: `${this.adapter.name} connection failed`,
        };
      }

      // Get total count
      const totalAvailable = await this.adapter.getItemCount();

      // Fetch sample
      const sampleRaw = await this.adapter.fetchItems(10, 0);
      const sampleItems = sampleRaw
        .map((item) => ItemNormalizer.normalize(item, this.adapter.key))
        .filter((item) => {
          const validation = ItemNormalizer.validate(item);
          return validation.valid && ItemNormalizer.hasMinimalData(item);
        });

      return {
        totalAvailable,
        sampleItems,
        success: true,
      };
    } catch (error) {
      return {
        totalAvailable: 0,
        sampleItems: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Start a new import session
   */
  async startImportSession(
    mode: 'dry-run' | 'import',
    limit?: number,
  ): Promise<ImportSession> {
    try {
      // Get analysis
      const analysis = await this.analyzeSource();
      if (!analysis.success) {
        throw new Error(analysis.error || 'Analysis failed');
      }

      // Create session document
      const sessionId = `import-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const totalAvailable = limit || analysis.totalAvailable;

      this.session = {
        id: sessionId,
        source: this.adapter.key,
        status: 'idle',
        mode,
        startTime: new Date(),
        totalAvailable,
        processed: 0,
        created: 0,
        updated: 0,
        duplicates: 0,
        errors: 0,
        results: [],
        checkpoint: {
          offset: 0,
        },
      };

      // Save to Firestore if importing (not dry-run)
      if (mode === 'import') {
        this.sessionRef = this.db.collection('import_sessions').doc(sessionId);
        await this.sessionRef.set(this.session as unknown as Record<string, unknown>);
      }

      return this.session;
    } catch (error) {
      throw new Error(`Failed to start import session: ${error}`);
    }
  }

  /**
   * Run import with batching and checkpoint support
   */
  async runImport(session: ImportSession, batchSize: number = 100): Promise<ImportStats> {
    if (!this.session) {
      this.session = session;
    }

    const startTime = Date.now();
    const errors: Array<{ itemId?: string; message: string }> = [];
    let offset = session.checkpoint.offset;

    try {
      this.session.status = 'running';
      await this.updateSessionDocument();

      while (offset < this.session.totalAvailable) {
        try {
          // Fetch batch
          const rawItems = await this.adapter.fetchItems(batchSize, offset);
          if (rawItems.length === 0) {
            break;
          }

          // Process batch
          const batch = this.db.batch() as FirestoreBatch;
          const batchResults: ImportResult[] = [];

          for (const rawItem of rawItems) {
            try {
              const result = await this.processItem(rawItem, batch);
              batchResults.push(result);

              // Update statistics
              switch (result.type) {
                case 'created':
                  this.session.created++;
                  break;
                case 'updated':
                  this.session.updated++;
                  break;
                case 'duplicate':
                  this.session.duplicates++;
                  break;
                case 'error':
                  this.session.errors++;
                  errors.push({
                    itemId: result.itemId,
                    message: result.error,
                  });
                  break;
              }

              this.session.results.push(result);
            } catch (itemError) {
              this.session.errors++;
              const message = itemError instanceof Error ? itemError.message : 'Unknown error';
              errors.push({
                itemId: `${rawItem.id}`,
                message,
              });
            }

            this.session.processed++;
          }

          // Commit batch if importing
          if (this.session.mode === 'import' && (batch._writes?.length ?? 0) > 0) {
            await batch.commit();
          }

          offset += rawItems.length;

          // Update checkpoint
          this.session.checkpoint.offset = offset;
          if (this.session.mode === 'import') {
            await this.updateSessionDocument();
          }

          // Log progress
          console.log(
            `[${this.adapter.name}] Progress: ${this.session.processed}/${this.session.totalAvailable}`,
          );
        } catch (batchError) {
          console.error('Batch processing error:', batchError);
          this.session.error = batchError instanceof Error ? batchError.message : 'Batch error';
          throw batchError;
        }
      }

      this.session.status = 'completed';
      this.session.endTime = new Date();

      if (this.session.mode === 'import') {
        await this.updateSessionDocument();
      }

      const duration = Date.now() - startTime;
      const successRate = this.session.created + this.session.updated;
      const itemsPerSecond = this.session.processed / (duration / 1000);

      return {
        totalProcessed: this.session.processed,
        totalCreated: this.session.created,
        totalUpdated: this.session.updated,
        totalDuplicates: this.session.duplicates,
        totalErrors: this.session.errors,
        successRate,
        duration,
        itemsPerSecond,
        errors,
      };
    } catch (error) {
      this.session.status = 'failed';
      this.session.error = error instanceof Error ? error.message : 'Import failed';
      this.session.endTime = new Date();

      if (this.session.mode === 'import') {
        await this.updateSessionDocument();
      }

      throw error;
    }
  }

  /**
   * Process a single item
   */
  private async processItem(
    rawItem: ForeverDBItem,
    batch: FirestoreBatch,
  ): Promise<ImportResult> {
    try {
      // Normalize
      const normalized = ItemNormalizer.normalize(rawItem, this.adapter.key);

      // Validate
      const validation = ItemNormalizer.validate(normalized);
      if (!validation.valid) {
        return {
          type: 'error',
          itemId: `${rawItem.id}`,
          error: validation.errors.join(', '),
        };
      }

      if (!ItemNormalizer.hasMinimalData(normalized)) {
        return {
          type: 'error',
          itemId: `${rawItem.id}`,
          error: 'Item does not have minimal required data',
        };
      }

      // Create internal ID
      const internalId = ItemNormalizer.createInternalId(normalized);

      // Check for existing item
      const existingDocRef = this.db.collection('items').doc(internalId);
      const existingDoc = await existingDocRef.get();

      if (existingDoc.exists) {
        // Item exists - check if we should update
        const existingItem = existingDoc.data() as unknown as Item;
        const { canUpdate, changes } = DeduplicationService.canUpdateItem(
          existingItem,
          normalized,
        );

        if (canUpdate) {
          // Update existing item
          const updateData: Partial<Item> = {
            ...existingItem,
            ...this.normalizedToUpdateInput(normalized),
            metadata: {
              ...existingItem.metadata,
              updatedAt: new Date(),
              source: this.adapter.key,
              sourceTimestamp: new Date(),
            },
          };

          if (this.session?.mode === 'import') {
            batch.update(existingDocRef, updateData as unknown as Record<string, unknown>);
          }

          return {
            type: 'updated',
            itemId: internalId,
            changes,
            item: updateData as Item,
          };
        } else {
          // Item exists and doesn't need update
          return {
            type: 'duplicate',
            itemId: internalId,
            duplicateOf: internalId,
            reason: 'Item already exists and no improvements',
          };
        }
      } else {
        // Create new item
        const newItem: CreateItemInput = {
          name: normalized.name,
          slug: createSlug(normalized.name),
          externalIds: normalized.externalIds,
          classification: normalized.classification,
          quality: normalized.quality,
          itemLevel: normalized.itemLevel,
          requiredLevel: normalized.requiredLevel,
          maxStackSize: normalized.maxStackSize,
          vendorInformation: normalized.sellPrice
            ? {
                sellPrice: normalized.sellPrice,
                buyPrice: normalized.buyPrice,
              }
            : undefined,
        };

        const itemToCreate: Item = {
          ...newItem,
          id: internalId,
          slug: newItem.slug,
          metadata: {
            createdAt: new Date(),
            updatedAt: new Date(),
            source: this.adapter.key,
            sourceTimestamp: new Date(),
          },
        };

        if (this.session?.mode === 'import') {
          batch.set(existingDocRef, itemToCreate as unknown as Record<string, unknown>);
        }

        return {
          type: 'created',
          itemId: internalId,
          item: itemToCreate,
        };
      }
    } catch (error) {
      return {
        type: 'error',
        itemId: `${rawItem.id}`,
        error: error instanceof Error ? error.message : 'Processing failed',
      };
    }
  }

  /**
   * Convert normalized item to update input
   */
  private normalizedToUpdateInput(normalized: NormalizedItem): Record<string, unknown> {
    return {
      name: normalized.name,
      quality: normalized.quality,
      itemLevel: normalized.itemLevel,
      requiredLevel: normalized.requiredLevel,
      maxStackSize: normalized.maxStackSize,
      vendorInformation: normalized.sellPrice
        ? {
            sellPrice: normalized.sellPrice,
            buyPrice: normalized.buyPrice,
          }
        : undefined,
      externalIds: (prev: Record<string, unknown>) => ({
        ...prev,
        ...normalized.externalIds,
      }),
    };
  }

  /**
   * Update session document in Firestore
   */
  private async updateSessionDocument(): Promise<void> {
    if (!this.sessionRef || !this.session) return;

    const sessionData = {
      status: this.session.status,
      processed: this.session.processed,
      created: this.session.created,
      updated: this.session.updated,
      duplicates: this.session.duplicates,
      errors: this.session.errors,
      checkpoint: this.session.checkpoint,
      error: this.session.error,
      updatedAt: new Date(),
    };

    await this.sessionRef.update(sessionData as unknown as Record<string, unknown>);
  }

  /**
   * Pause the import session
   */
  async pauseImport(): Promise<void> {
    if (this.session) {
      this.session.status = 'paused';
      await this.updateSessionDocument();
    }
  }

  /**
   * Resume the import session
   */
  async resumeImport(batchSize?: number): Promise<ImportStats> {
    if (!this.session) {
      throw new Error('No active import session');
    }
    return this.runImport(this.session, batchSize);
  }

  /**
   * Cancel the import session
   */
  async cancelImport(): Promise<void> {
    if (this.session) {
      this.session.status = 'failed';
      this.session.error = 'Cancelled by user';
      await this.updateSessionDocument();
    }
  }

  /**
   * Get current session
   */
  getCurrentSession(): ImportSession | null {
    return this.session;
  }
}
