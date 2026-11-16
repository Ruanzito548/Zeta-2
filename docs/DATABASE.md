# Zeta 2 - Database Schema & Models

## Overview

This document defines the Firestore database schema for Zeta 2, including collection structures, relationships, and data constraints.

## Collection Design Principles

1. **Normalization**: Avoid unnecessary nesting to reduce read costs
2. **Query Efficiency**: Structure supports common query patterns
3. **Scalability**: Design handles growth from dozens to thousands of items
4. **Flexibility**: Allow for future expansions without major restructuring
5. **Consistency**: Data integrity through validation and transactions

## Core Collections

### Items Collection

**Path**: `items/{itemId}`

Stores information about all World of Warcraft Forever items.

```typescript
{
  id: string                      // Unique identifier (generated)
  name: string                    // Item name
  slug: string                    // URL-friendly identifier
  externalIds: {
    wowhead?: number              // Wowhead item ID
    forever?: number              // WoW Forever item ID
    [key: string]: number|string  // Other source IDs
  }
  classification: ItemClassification  // armor, weapon, recipe, etc.
  quality?: ItemQuality           // poor, common, uncommon, rare, epic, etc.
  itemLevel?: number              // Item level (if applicable)
  requiredLevel?: number          // Required character level
  maxStackSize?: number           // Max stack size in bags
  vendorInformation?: {
    buyPrice?: number             // NPC buy price (in copper)
    sellPrice?: number            // NPC sell price (in copper)
    vendorName?: string           // NPC vendor name
    vendorLocation?: string       // NPC location
  }
  sources?: [{
    type: string                  // quest, vendor, drop, craft, etc.
    source: string                // Description of source
    rarity?: string               // common, uncommon, rare, very_rare
  }]
  metadata: {
    createdAt: Timestamp
    updatedAt: Timestamp
    source: string                // Data import source (forever, wowhead, etc.)
    sourceTimestamp: Timestamp    // When this was last updated from source
  }
}
```

**Indexes**:
- `name` (ascending)
- `classification` (ascending)
- `quality` (ascending)
- `metadata.updatedAt` (descending)
- Composite: `classification`, `quality`, `itemLevel`

**Read Patterns**:
- Get item by ID
- Search by name (prefix search recommended to avoid full scan)
- Filter by classification
- Filter by quality range
- Recent updates

---

### Recipes Collection

**Path**: `recipes/{recipeId}`

Stores crafting recipes and their requirements.

```typescript
{
  id: string                      // Unique identifier
  name: string                    // Recipe name
  slug: string                    // URL-friendly identifier
  profession: Profession          // alchemy, blacksmithing, etc.
  skillRequired: number           // Required profession skill level
  producedItemId: string          // References items/{itemId}
  producedQuantity: number        // How many items this recipe produces
  materials: [{
    itemId: string                // References items/{itemId}
    quantity: number              // Quantity needed
    optional?: boolean            // Optional material
  }]
  externalIds: {
    wowhead?: number
    forever?: number
    [key: string]: number|string
  }
  source: string                  // Data import source
  sourceTimestamp: Timestamp      // When imported
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**Indexes**:
- `profession` (ascending)
- `skillRequired` (ascending)
- `producedItemId` (ascending)
- Composite: `profession`, `skillRequired`
- Composite: `producedItemId`, `profession`

**Read Patterns**:
- Get recipe by ID
- Find recipes for a profession
- Find recipes requiring certain items
- Find recipes producing an item
- Recipes by skill level

---

### Item Prices Collection

**Path**: `item_prices/{itemId}`

**Subcollection**: `price_points/{pointId}`

Stores current and historical pricing data.

```typescript
{
  itemId: string                  // Parent document ID
  price_points: {
    pointId: {
      itemId: string              // Duplicate for query flexibility
      buyPrice?: number           // Current buy price (in copper)
      sellPrice?: number          // Current sell price (in copper)
      avgPrice?: number           // Average of buy/sell
      minBuyout?: number          // Minimum buyout on AH
      quantity?: number           // Quantity available
      timestamp: Timestamp        // When this price was recorded
      realm?: string              // Realm name (if multi-realm)
    }
  }
}
```

**Alternative Structure (Flattened)**:
If subcollections cause issues, store in main collection:

```typescript
{
  itemId: string
  currentBuyPrice?: number
  currentSellPrice?: number
  currentTimestamp: Timestamp
  lastUpdated: Timestamp
  
  // Keep price_history for analysis
  recentPrices?: [{
    buyPrice: number
    sellPrice: number
    timestamp: Timestamp
  }]  // Keep last 100 prices
}
```

**Indexes**:
- `itemId` (ascending)
- `timestamp` (descending)
- Composite: `itemId`, `timestamp`

**Write Strategy**:
- Update current prices atomically
- Archive old prices (retention: configurable, suggest 90 days)
- Batch writes for bulk updates

**Read Patterns**:
- Get current price for item
- Get price history (last 7 days, 30 days, etc.)
- Compare prices across realms
- Trend analysis queries

---

### Price History Collection

**Path**: `price_history/{itemId}`

Aggregated historical pricing for analysis.

```typescript
{
  itemId: string                  // Which item
  prices: [{
    buyPrice?: number
    sellPrice?: number
    avgPrice?: number
    timestamp: Timestamp
    realm?: string
  }]
  firstRecorded: Timestamp        // When this item was first tracked
  lastUpdated: Timestamp          // Last price update
}
```

**Note**: Consider archiving old records to separate collection to manage document size.

---

### Users Collection

**Path**: `users/{userId}`

User account information and preferences.

```typescript
{
  id: string                      // User ID (from Firebase Auth)
  email: string                   // Email address
  displayName?: string            // Display name
  profilePicture?: string         // URL to profile picture
  characters: string[]            // Array of character IDs
  primaryCharacterId?: string     // References characters/{characterId}
  guildId?: string                // References guilds/{guildId}
  preferences: {
    theme?: 'light' | 'dark' | 'system'
    language?: string             // ISO language code
    timezone?: string             // IANA timezone
    notifications?: boolean       // Email notifications enabled
    [key: string]: any
  }
  createdAt: Timestamp
  updatedAt: Timestamp
  lastLoginAt?: Timestamp
}
```

**Indexes**:
- `email` (ascending, unique)
- `guildId` (ascending)
- `createdAt` (descending)

**Security**: 
- Only readable/writable by the authenticated user
- Email field should not be searchable by other users

---

### Characters Collection

**Path**: `characters/{characterId}`

Character information linked to users.

```typescript
{
  id: string                      // Character ID
  userId: string                  // References users/{userId}
  name: string                    // Character name
  realm: string                   // Server name
  class: string                   // Warrior, Mage, etc.
  race: string                    // Human, Orc, etc.
  level: number                   // Character level
  professions: [{
    profession: Profession        // Which profession
    level: number                 // Current skill level
    maxLevel: number              // Maximum possible level
  }]
  guildId?: string                // References guilds/{guildId}
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**Indexes**:
- `userId` (ascending)
- `guildId` (ascending)
- `name` (ascending)
- Composite: `userId`, `createdAt`

**Security**:
- Readable/writable only by character owner
- Searchable by guild members (with restrictions)

---

### Guilds Collection

**Path**: `guilds/{guildId}`

Guild information and membership.

```typescript
{
  id: string                      // Guild ID
  name: string                    // Guild name
  realm: string                   // Guild realm
  leader: string                  // References users/{userId}
  members: [{
    userId: string
    characterId: string
    role: 'member' | 'officer' | 'leader'
    joinedAt: Timestamp
  }]
  dataVisibility: 'private' | 'members_only' | 'public'
  settings: {
    shareMarketData: boolean      // Share price data
    sharePricingData: boolean     // Share pricing analysis
    shareRecipeData: boolean      // Share recipe data
    sharingLevel: 'none' | 'members' | 'trusted_members' | 'all'
  }
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**Indexes**:
- `leader` (ascending)
- `name` (ascending)
- `realm` (ascending)

**Subcollection**: `audit_log` (optional)
```typescript
// guilds/{guildId}/audit_log/{logId}
{
  id: string
  userId: string
  action: string                  // 'member_joined', 'price_updated', etc.
  details: Record<string, any>
  timestamp: Timestamp
}
```

---

### Import Logs Collection

**Path**: `import_logs/{logId}`

Track data imports for auditing and debugging.

```typescript
{
  id: string
  timestamp: Timestamp            // When import started
  source: string                  // 'forever', 'wowhead', 'foreverdb', etc.
  sourceUrl?: string              // URL of data source
  status: 'pending' | 'processing' | 'completed' | 'failed'
  stats: {
    totalProcessed: number        // Total records read
    inserted: number              // New records added
    updated: number               // Existing records updated
    skipped: number               // Records skipped
    errors: number                // Records with errors
  }
  errors: [{
    recordId?: string
    error: string
    details?: string
  }]
  completedAt?: Timestamp
  duration?: number               // Duration in milliseconds
}
```

**Indexes**:
- `source` (ascending)
- `status` (ascending)
- `timestamp` (descending)
- Composite: `source`, `timestamp`

---

## Relationships

### Item → Recipes
- **Type**: One-to-Many
- **Link**: `recipes.producedItemId` → `items.id`
- **Query**: Find all recipes that produce an item

### Item → Recipes Materials
- **Type**: Many-to-Many
- **Link**: `recipes.materials[].itemId` → `items.id`
- **Query**: Find all recipes using an item as material

### User → Characters
- **Type**: One-to-Many
- **Link**: `characters.userId` → `users.id`
- **Query**: Get all characters for a user

### Character → Guild
- **Type**: Many-to-One
- **Link**: `characters.guildId` → `guilds.id`
- **Query**: Find all guild members

### User → Guild
- **Type**: Many-to-Many
- **Link**: Via `characters` → `guilds`
- **Query**: User's guilds, Guild's members

### Item → Price History
- **Type**: One-to-Many
- **Link**: `price_history.itemId` → `items.id` (or use subcollection)
- **Query**: Get price history for item

---

## Write Operations & Transactions

### Atomic Price Update
```
1. Lock price document
2. Update current price
3. Archive old price (append to history)
4. Update lastUpdated timestamp
5. Commit transaction
```

### Recipe + Item Creation
```
1. Create item document
2. Create recipe document referencing item
3. Add to import log
4. Commit transaction
```

### Guild Member Addition
```
1. Add to guild members array
2. Update character's guildId
3. Add audit log entry
4. Commit transaction
```

---

## Firestore Costs Optimization

### Storage
- Average item: ~500 bytes
- 100,000 items: ~50 MB
- Price history (90 days): ~1 MB per 100 items

### Reads
- Document read: 1 read unit
- Query: 1 read unit per document examined
- Real-time listener: 1 read unit on each update

### Writes
- Document write: 1 write unit
- Batch write: 1 write per document (up to 500/batch)
- Transaction: Based on actual writes

### Optimization Strategies
1. **Batch Imports**: Use batch writes for bulk operations
2. **Pagination**: Implement cursor-based pagination for large result sets
3. **Indexing**: Create composite indexes only for common queries
4. **Archiving**: Move old price history to archive collection
5. **Caching**: Client-side caching for frequently accessed data

---

## Migration & Versioning

### Schema Versioning
Document version in metadata if schema changes are needed:
```typescript
metadata: {
  version: 1,
  createdAt: Timestamp,
  updatedAt: Timestamp,
}
```

### Backward Compatibility
- New optional fields added with defaults
- Old queries continue working
- Migration scripts for large changes
- Test on staging/emulator first

---

## Data Validation Rules

### Items
- `name`: Required, non-empty, max 255 chars
- `slug`: Required, matches /^[a-z0-9-]+$/
- `classification`: Must be valid ItemClassification
- `itemLevel`: Optional, min 0, max 1000
- `requiredLevel`: Optional, min 1, max 70

### Recipes
- `profession`: Must be valid Profession
- `skillRequired`: Min 0, max 300
- `producedQuantity`: Min 1
- `materials`: Array with 1-20 items

### Prices
- `buyPrice`: Must be positive number
- `sellPrice`: Must be positive number
- `timestamp`: Must be valid date

---

## Disaster Recovery

### Backups
- Automatic Firestore backups (enable in console)
- Export important collections regularly
- Test restore procedures quarterly

### Data Integrity
- Input validation on all writes
- Audit logs for sensitive operations
- Checksums for imported data
- Duplicate detection for items

---

## Future Extensions

- **Multi-realm Support**: Add realm field to price collections
- **Account Linking**: Support multiple accounts per user
- **API Keys**: Authentication for external integrations
- **Webhooks**: Trigger actions on data changes
- **Full-text Search**: Consider Algolia or similar for search
