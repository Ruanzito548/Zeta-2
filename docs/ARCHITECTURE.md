# Zeta 2 - Project Architecture

## Overview

Zeta 2 is a professional economic analysis platform for World of Warcraft Forever's Auction House. The system is designed with modularity, maintainability, and scalability as core principles.

This document outlines the system architecture, module responsibilities, and design decisions.

## Architectural Principles

### 1. Separation of Concerns
- **Business Logic** is isolated in dedicated modules
- **UI Components** are thin presentation layers
- **Services** handle Firebase and external API interactions
- **Types** define contracts between modules

### 2. Modularity
- Each feature has its own module with clear responsibilities
- Modules do not directly depend on each other's implementations
- Dependencies flow toward common core utilities and services

### 3. Type Safety
- Full TypeScript strict mode enabled
- All types are centralized in `src/types/`
- Shared interfaces ensure consistency across modules

### 4. Scalability
- Architecture supports multiple users and guilds
- Global data (items, recipes, prices) is shared
- Personal data is isolated per user
- Guild data has configurable visibility

## Directory Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Dashboard home
│   ├── professions/page.tsx     # Professions interface
│   ├── market/page.tsx          # Market analysis
│   ├── crafting/page.tsx        # Crafting analysis
│   ├── guild/page.tsx           # Guild management
│   ├── settings/page.tsx        # Settings
│   └── globals.css              # Global styles
│
├── components/                   # React components
│   ├── layout/                  # Layout components
│   │   ├── sidebar.tsx          # Navigation sidebar
│   │   ├── header.tsx           # Top header bar
│   │   └── dashboard-layout.tsx # Dashboard wrapper
│   ├── navigation/              # Navigation components
│   ├── ui/                      # Reusable UI components
│   ├── items/                   # Item display components
│   └── tables/                  # Table components
│
├── modules/                      # Business logic modules
│   ├── database/                # Database operations
│   ├── crafting/                # Crafting calculations
│   ├── disenchant/              # Disenchant analysis
│   ├── npc/                     # NPC interactions
│   ├── arbitrage/               # Arbitrage opportunities
│   ├── pricing/                 # Pricing logic
│   ├── professions/             # Profession management
│   └── guild/                   # Guild operations
│
├── services/                     # External service integrations
│   └── firebase/                # Firebase initialization
│       ├── client.ts            # Client-side Firebase
│       └── server.ts            # Server-side Firebase Admin
│
├── types/                        # TypeScript definitions
│   ├── item.ts                  # Item data structures
│   ├── recipe.ts                # Recipe data structures
│   ├── user.ts                  # User & character structures
│   ├── pricing.ts               # Pricing structures
│   ├── guild.ts                 # Guild structures
│   └── index.ts                 # Central export point
│
├── lib/                          # Utility functions
│   ├── validations/             # Input validation
│   └── utils/                   # Common utilities
│
├── hooks/                        # React custom hooks
│
└── config/                       # Configuration files
    └── firebase.ts              # Firebase configuration
```

## Core Modules

### Database Module (`src/modules/database/`)
Handles all data persistence and retrieval from Firestore.

**Responsibilities:**
- CRUD operations for items, recipes, prices
- Query optimization
- Data validation before persistence
- Transaction handling

### Crafting Module (`src/modules/crafting/`)
Analyzes crafting opportunities and profitability.

**Responsibilities:**
- Recipe cost calculation
- Profit margin analysis
- Material requirement aggregation
- Comparative analysis across recipes

### Pricing Module (`src/modules/pricing/`)
Centralized pricing calculations used across all features.

**Responsibilities:**
- Price aggregation from multiple sources
- Tax calculations
- Profit/loss calculations
- Price history tracking
- Comparison metrics

### Arbitrage Module (`src/modules/arbitrage/`)
Identifies buying and reselling opportunities.

**Responsibilities:**
- Price difference detection
- Opportunity ranking
- Risk assessment
- Profit estimation

### Professions Module (`src/modules/professions/`)
Manages character profession data and recipes.

**Responsibilities:**
- Profession skill tracking
- Known recipes management
- Profession-specific calculations
- Level-based recommendations

### Guild Module (`src/modules/guild/`)
Handles guild-level operations and shared data.

**Responsibilities:**
- Guild member management
- Shared data coordination
- Audit logging
- Permission enforcement

### Disenchant Module (`src/modules/disenchant/`)
Analyzes disenchanting opportunities.

**Responsibilities:**
- Disenchant material mapping
- Skill requirement validation
- Material yield estimation
- Value comparison

### NPC Module (`src/modules/npc/`)
Handles NPC vendor interactions and data.

**Responsibilities:**
- NPC vendor price lookups
- Vendor item availability
- Profit comparison vs Auction House
- Vendor flipping opportunities

## Firebase Collections

### Core Data Collections

#### `items`
```firestore
items/{itemId}
├── id: string
├── name: string
├── slug: string
├── externalIds: {wowhead, forever, ...}
├── classification: ItemClassification
├── quality?: ItemQuality
├── itemLevel?: number
├── requiredLevel?: number
├── maxStackSize?: number
├── vendorInformation?: {buyPrice, sellPrice, ...}
├── sources?: ItemSource[]
└── metadata: {createdAt, updatedAt, source, sourceTimestamp}
```

#### `recipes`
```firestore
recipes/{recipeId}
├── id: string
├── name: string
├── profession: Profession
├── skillRequired: number
├── producedItemId: string
├── producedQuantity: number
├── materials: RecipeMaterial[]
├── externalIds: {wowhead, forever, ...}
└── timestamps: {createdAt, updatedAt}
```

#### `item_prices`
```firestore
item_prices/{itemId}/{pricePointId}
├── itemId: string
├── buyPrice?: number
├── sellPrice?: number
├── avgPrice?: number
├── timestamp: Date
└── realm?: string
```

#### `price_history`
```firestore
price_history/{itemId}
├── itemId: string
├── prices: PricePoint[]
├── firstRecorded: Date
└── lastUpdated: Date
```

### User Data Collections

#### `users`
```firestore
users/{userId}
├── email: string
├── displayName?: string
├── profilePicture?: string
├── characters: string[] (array of character IDs)
├── primaryCharacterId?: string
├── guildId?: string
├── preferences: {theme, language, timezone, ...}
└── timestamps: {createdAt, updatedAt, lastLoginAt}
```

#### `characters`
```firestore
characters/{characterId}
├── userId: string
├── name: string
├── realm: string
├── class: string
├── race: string
├── level: number
├── professions: ProfessionLevel[]
├── guildId?: string
└── timestamps: {createdAt, updatedAt}
```

#### `guilds`
```firestore
guilds/{guildId}
├── name: string
├── realm: string
├── leader: string (userId)
├── members: GuildMember[]
├── dataVisibility: 'private' | 'members_only' | 'public'
├── settings: {shareMarketData, sharePricingData, ...}
└── timestamps: {createdAt, updatedAt}
```

### Admin Collections

#### `import_logs`
```firestore
import_logs/{logId}
├── timestamp: Date
├── source: string
├── totalProcessed: number
├── inserted: number
├── updated: number
├── errors: ImportError[]
└── status: 'pending' | 'processing' | 'completed' | 'failed'
```

## Security & Permissions

### Firebase Security Rules Strategy

**Public Data (Read-Only)**
- `items`: Public read access
- `recipes`: Public read access
- Aggregated `item_prices`: Public read access

**User Data**
- `users/{userId}`: Only the user can read/write their own document
- `characters/{characterId}`: Only the owner's user can read/write
- `characters` indexed by `userId` for efficient querying

**Guild Data**
- `guilds/{guildId}`: Read access based on membership and visibility settings
- Member write access controlled by role (leader/officer/member)

**Admin Operations**
- Restricted to Firebase Admin SDK (server-side)
- Authentication required via service account
- Audit logging for all sensitive operations

## Development Workflow

### Adding a New Feature

1. **Define Types** in `src/types/`
   - Create interfaces for all data structures
   - Ensure they align with Firebase model

2. **Create Module** in `src/modules/`
   - Implement business logic
   - Use types from `src/types/`
   - Avoid importing from other modules directly

3. **Add Database Operations** in `src/modules/database/`
   - Implement CRUD functions using Firestore
   - Add validation and error handling

4. **Create Components** in `src/components/`
   - Build UI using the module's logic
   - Keep components simple and focused

5. **Add Route** in `src/app/`
   - Create page component
   - Use DashboardLayout wrapper

6. **Document Changes**
   - Update ARCHITECTURE.md if adding modules
   - Update DATABASE.md if adding collections
   - Add code comments for complex logic

### Dependency Guidelines

✅ **Allowed**
- Modules importing from `src/types/`
- Modules importing from `src/services/firebase/`
- Modules importing from `src/lib/`
- Components importing from other components
- Components importing from modules

❌ **Not Allowed**
- Modules importing from other modules (use service layer)
- Modules importing from components
- Components containing business logic
- Circular dependencies

## Deployment & Configuration

### Environment Variables

**Client-Side** (prefix: `NEXT_PUBLIC_`)
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_USE_FIREBASE_EMULATOR=false
NEXT_PUBLIC_AUTH_EMULATOR_HOST=localhost:9099
NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST=localhost:8080
```

**Server-Side** (not exposed to client)
```
FIREBASE_ADMIN_SDK_KEY=<json_key>
```

### Local Development

Using Firebase Emulator Suite:
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Run: `firebase emulators:start`
3. Set `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true`
4. Connect to emulator via configuration

## Code Quality Standards

### TypeScript
- Strict mode enabled
- No `any` types without justification
- Explicit return types on functions
- Proper error typing

### Formatting & Linting
- ESLint configuration from Next.js
- Automatic formatting on save recommended
- 2-space indentation
- No unused imports

### Comments
- Only comment complex logic or non-obvious decisions
- Keep comments up-to-date with code changes
- Avoid obvious comments that restate the code

### File Naming
- Components: PascalCase (e.g., `Dashboard.tsx`)
- Modules: kebab-case (e.g., `pricing-calculator.ts`)
- Files with exports: index.ts for barrel exports

## Future Considerations

- WebSocket integration for real-time price updates
- Worker/scheduler for background tasks
- Caching strategy for frequently accessed data
- Analytics and monitoring integration
- API rate limiting for external services
- Pagination strategies for large datasets
