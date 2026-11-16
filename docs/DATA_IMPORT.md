# Zeta 2 - Data Import Strategy

## Overview

The database importer is a critical component that populates Zeta 2 with World of Warcraft Forever item and recipe data. This document outlines the import strategy, sources, and implementation guidelines.

## Import Sources

### Primary Sources

#### 1. WoW Forever Armory/KB
- **URL**: https://github.com/gBlaku/wow-forever-kb
- **Format**: JSON/CSV or database export
- **Data**: Items, recipes, professions
- **Update Frequency**: Monthly or on-demand

#### 2. ForeverDB
- **URL**: https://foreverdb.net/developers
- **API**: RESTful API or JSON endpoints
- **Data**: Items, prices, market data
- **Rate Limit**: Check documentation

#### 3. Wowhead (Secondary)
- **URL**: https://www.wowhead.com/forever/
- **Format**: Web scraping or API (if available)
- **Data**: Items, recipes, sources
- **Note**: Use only as fallback, respect ToS

## Import Process

### Phase 1: Inspection & Validation

**Before importing:**

1. **Examine Source Format**
   - Download sample data
   - Identify data structure
   - Document all fields
   - Note any inconsistencies

2. **Map External IDs**
   - Identify unique identifiers in source
   - Document mapping between sources
   - Create deduplication strategy
   - Plan for future source additions

3. **Validate Data Quality**
   - Check for missing required fields
   - Identify outliers or anomalies
   - Estimate data completeness
   - Review naming conventions

### Phase 2: Preprocessing

**Before database writes:**

1. **Data Normalization**
   - Standardize names (title case, etc.)
   - Convert units (copper for prices)
   - Normalize boolean values
   - Clean whitespace

2. **External ID Mapping**
   - Create mapping table: `externalIds`
   - Track ID across sources
   - Flag conflicting IDs for manual review
   - Build reverse index

3. **Classification**
   - Categorize items correctly
   - Set quality tiers
   - Assign item levels
   - Identify special types

### Phase 3: Deduplication & Merging

**Identify and handle duplicates:**

1. **Exact Matches**
   - Same name and stats
   - Different sources for same item
   - Merge external IDs

2. **Partial Matches**
   - Similar names (fuzzy matching)
   - Different external IDs
   - Manual verification required
   - Flag for review

3. **New Items**
   - No existing match found
   - Marked for creation
   - Assigned unique system ID

### Phase 4: Validation

**Verify data integrity:**

```javascript
// Example validation rules
const validations = {
  item: {
    name: { required: true, maxLength: 255 },
    classification: { required: true, enum: [...] },
    externalIds: { required: true, minProperties: 1 },
  },
  recipe: {
    profession: { required: true, enum: [...] },
    producedItemId: { required: true, format: 'valid-item-id' },
    materials: { required: true, minItems: 1, maxItems: 20 },
  },
};
```

### Phase 5: Import Execution

**Atomic batch operations:**

1. **Batch Processing**
   - Process in chunks of 100-500 items
   - Commit each batch atomically
   - Log progress and errors
   - Allow resumption on failure

2. **Write Optimization**
   - Use batch writes (Firebase limit: 500/batch)
   - Parallel processing where possible
   - Implement exponential backoff for retries
   - Track write costs

3. **Error Handling**
   - Log all validation errors
   - Continue on non-critical errors
   - Collect errors for post-import review
   - Provide detailed error messages

### Phase 6: Post-Import Verification

**Quality assurance:**

1. **Statistics Report**
   - Total items imported
   - Duplicates found/merged
   - New items created
   - Errors/warnings encountered
   - Import duration

2. **Data Verification**
   - Sample random items (5-10%)
   - Verify external ID mapping
   - Check relationships (recipes → items)
   - Confirm counts match source

3. **Business Logic Tests**
   - Recipe calculations work
   - Price lookups successful
   - Filtering/searching functional
   - Performance acceptable

## Implementation Details

### Client-Side Import (Not Recommended)

❌ **Don't do this**:
```javascript
// BAD: 10,000+ items in browser
const items = [...allItems];
items.forEach(item => {
  addDoc(collection(firestore, 'items'), item);
});
```

### Server-Side Import (Recommended)

✅ **Do this**:

```typescript
// Server function: lib/import-items.ts
import { getAdminFirestoreInstance } from '@/services/firebase/server';

export async function importItemsFromSource(source: string) {
  const firestore = getAdminFirestoreInstance();
  const batch = firestore.batch();
  let batchCount = 0;
  const BATCH_SIZE = 500;

  const items = await fetchSourceData(source);
  const normalizedItems = normalizeData(items);
  const deduplicatedItems = deduplicateItems(normalizedItems);

  for (const item of deduplicatedItems) {
    const docRef = firestore.collection('items').doc(item.id);
    batch.set(docRef, item, { merge: false });

    batchCount++;
    if (batchCount === BATCH_SIZE) {
      await batch.commit();
      batch = firestore.batch();
      batchCount = 0;
      console.log(`Committed ${deduplicatedItems.indexOf(item) + 1} items`);
    }
  }

  if (batchCount > 0) {
    await batch.commit();
  }

  return {
    total: deduplicatedItems.length,
    timestamp: new Date(),
  };
}
```

### Local Testing with SQLite

```typescript
// Local temporary processing with SQLite
import Database from 'better-sqlite3';

const db = new Database(':memory:');

// Create staging tables
db.exec(`
  CREATE TABLE staging_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    external_id_wowhead INTEGER,
    external_id_forever INTEGER,
    classification TEXT NOT NULL,
    ...
  );
  
  CREATE TABLE staging_recipes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    profession TEXT NOT NULL,
    produced_item_id TEXT NOT NULL,
    ...
  );
`);

// Load data into staging
const insertItem = db.prepare('INSERT INTO staging_items VALUES (?, ?, ...)');
for (const item of sourceData) {
  insertItem.run(item.id, item.name, ...);
}

// Deduplication query
const duplicates = db.prepare(`
  SELECT name, COUNT(*) as count
  FROM staging_items
  GROUP BY name
  HAVING count > 1
`).all();

// Export to JSON for Firestore
const finalData = db.prepare('SELECT * FROM staging_items').all();
fs.writeFileSync('items.json', JSON.stringify(finalData, null, 2));
```

## Wowhead Link Parsing

Future feature preparation (not yet implemented):

```typescript
// Parsing: https://www.wowhead.com/forever/item=2870/shining-silver-breastplate

interface WowheadLink {
  itemId: number;
  itemName: string;
  source: 'wowhead';
  url: string;
}

export function parseWowheadLink(url: string): WowheadLink {
  const match = url.match(/\/item=(\d+)\/([\w-]+)/);
  if (!match) throw new Error('Invalid Wowhead URL');

  const [, itemId, itemName] = match;
  return {
    itemId: parseInt(itemId),
    itemName: decodeURIComponent(itemName).replace(/-/g, ' '),
    source: 'wowhead',
    url,
  };
}

// Lookup in database
export async function lookupWowheadItem(link: WowheadLink): Promise<Item | null> {
  const firestore = getFirebaseFirestore();
  
  // Primary: Search by external ID
  const byExtId = await firestore
    .collection('items')
    .where('externalIds.wowhead', '==', link.itemId)
    .limit(1)
    .get();
  
  if (!byExtId.empty) {
    return byExtId.docs[0].data();
  }

  // Secondary: Search by name (if no match)
  const byName = await firestore
    .collection('items')
    .where('name', '==', link.itemName)
    .limit(1)
    .get();

  return byName.empty ? null : byName.docs[0].data();
}
```

## Idempotency & Resumption

**Key Requirements:**

1. **Idempotent Operations**
   - Running import twice = same result
   - Use unique IDs (external IDs)
   - Merge updates instead of replacing
   - Don't duplicate on retry

2. **Resumable Imports**
   - Track checkpoint of last successful item
   - Skip already-imported items
   - Don't re-import unchanged data
   - Log all progress

3. **Implementation**:
   ```typescript
   // Track import progress
   const importLog = {
     source: 'forever',
     startTime: new Date(),
     checkpoint: 0,
     processedItems: 0,
     status: 'processing',
   };

   const sourceItems = await getSourceData();
   const existingIds = new Set(await getExistingItemIds());

   for (let i = importLog.checkpoint; i < sourceItems.length; i++) {
     const item = sourceItems[i];
     
     if (existingIds.has(item.externalId)) {
       // Update only if changed
       await updateItemIfChanged(item);
     } else {
       // Insert new item
       await createItem(item);
     }
     
     importLog.checkpoint = i + 1;
     if (i % 100 === 0) {
       await saveImportLog(importLog);
     }
   }
   ```

## Monitoring & Logging

**What to log:**

```json
{
  "logId": "import-forever-20240101-001",
  "timestamp": "2024-01-01T10:00:00Z",
  "source": "forever",
  "status": "completed",
  "stats": {
    "totalProcessed": 50000,
    "inserted": 12000,
    "updated": 35000,
    "skipped": 3000,
    "errors": 0
  },
  "errors": [
    {
      "recordId": "item-12345",
      "field": "classification",
      "error": "Invalid classification type",
      "value": "unknown"
    }
  ],
  "duration": 180000,
  "costEstimate": {
    "writes": 47000,
    "estimatedCost": "$0.235"
  }
}
```

## Next Steps (Post-Foundation Phase)

1. **Data Source Investigation**
   - Connect to WoW Forever Armory
   - Connect to ForeverDB API
   - Inspect actual data formats
   - Create mapping documentation

2. **Importer Implementation**
   - Build data fetcher for each source
   - Implement normalization pipeline
   - Build deduplication logic
   - Create staging/validation layer

3. **Testing**
   - Test with sample data locally
   - Verify Firestore writes
   - Validate data integrity
   - Performance testing

4. **Automation**
   - Schedule periodic imports
   - Set up monitoring/alerts
   - Implement update checking
   - Create admin import UI
