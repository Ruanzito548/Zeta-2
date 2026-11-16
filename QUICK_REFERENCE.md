# Zeta 2 - Quick Reference Guide

## Common Tasks Cheat Sheet

### Starting Development

```bash
# First time setup
npm install
cp .env.example .env.local
# Edit .env.local with Firebase credentials

# Start dev server
npm run dev

# Production build
npm run build
npm start
```

### File Organization Quick Map

```
Need to...                          Look in...
─────────────────────────────────────────────────────
Add a new page                      src/app/[name]/page.tsx
Define a data type                  src/types/[type].ts
Write business logic                src/modules/[feature]/
Create a UI component               src/components/[category]/
Access Firebase (client)            src/services/firebase/client.ts
Server-side DB operations           src/modules/database/
Reusable utilities                  src/lib/utils/
Input validation                    src/lib/validations/
Custom React hooks                  src/hooks/
Configuration                       src/config/firebase.ts
Environment variables               .env.local (use .env.example as template)
```

### TypeScript Quick Tips

```typescript
// Always define prop types
interface DashboardProps {
  userId: string;
  defaultView?: 'list' | 'grid';
}

// Always define return types
function calculateProfit(cost: number, revenue: number): number {
  return revenue - cost;
}

// Use enums for constants
enum Profession {
  Alchemy = 'alchemy',
  Blacksmithing = 'blacksmithing',
}

// Use interfaces for data contracts
interface Item {
  id: string;
  name: string;
  price: number;
}

// Never use 'any'
// ❌ function process(data: any) { }
// ✅ function process(data: ItemData) { }
```

### React Component Pattern

```typescript
// Good component structure
interface MyComponentProps {
  title: string;
  items: Item[];
  onSelect?: (item: Item) => void;
}

export function MyComponent({ title, items, onSelect }: MyComponentProps) {
  const [state, setState] = useState<string>('');

  return (
    <div>
      <h1>{title}</h1>
      {/* JSX here */}
    </div>
  );
}
```

### Database Patterns

```typescript
// Add to src/modules/database/items.ts (create if needed)

import { getAdminFirestoreInstance } from '@/services/firebase/server';
import { Item } from '@/types';

// Get single item
export async function getItem(id: string): Promise<Item | null> {
  const firestore = getAdminFirestoreInstance();
  const doc = await firestore.collection('items').doc(id).get();
  return doc.exists ? (doc.data() as Item) : null;
}

// Query items
export async function findItems(classification: string): Promise<Item[]> {
  const firestore = getAdminFirestoreInstance();
  const snapshot = await firestore
    .collection('items')
    .where('classification', '==', classification)
    .limit(100)
    .get();
  return snapshot.docs.map(doc => doc.data() as Item);
}

// Add/update
export async function saveItem(item: Item): Promise<void> {
  const firestore = getAdminFirestoreInstance();
  await firestore.collection('items').doc(item.id).set(item, { merge: true });
}
```

### Add a New Route

```typescript
// 1. Create directory
//    src/app/my-feature/

// 2. Create page.tsx
//    src/app/my-feature/page.tsx

import { DashboardLayout } from '@/components/layout';

export default function MyFeaturePage() {
  return (
    <DashboardLayout>
      <h1>My Feature</h1>
      <p>Content goes here</p>
    </DashboardLayout>
  );
}

// 3. Update sidebar navigation in src/components/layout/sidebar.tsx
//    Add to navigationItems array
```

### Add a New Type

```typescript
// 1. Create file: src/types/my-type.ts

export interface MyData {
  id: string;
  name: string;
  value: number;
}

export interface CreateMyDataInput {
  name: string;
  value: number;
}

// 2. Export from src/types/index.ts
export * from './my-type';

// 3. Use in components and modules
import { MyData } from '@/types';
```

### Create a New Module

```typescript
// 1. Create directory: src/modules/my-module/

// 2. Create functions: src/modules/my-module/my-function.ts
export function calculateSomething(input: number): number {
  return input * 2;
}

// 3. Create index: src/modules/my-module/index.ts
export { calculateSomething } from './my-function';

// 4. Use in components or other modules
import { calculateSomething } from '@/modules/my-module';
```

### Error Handling Pattern

```typescript
// Good: Explicit error handling
async function fetchData(id: string): Promise<Result<Data>> {
  try {
    const data = await firestore.collection('data').doc(id).get();
    if (!data.exists) {
      return { success: false, error: new Error('Not found') };
    }
    return { success: true, data: data.data() as Data };
  } catch (error) {
    console.error('Database error:', error);
    return { success: false, error: error as Error };
  }
}

// In component
const result = await fetchData('123');
if (result.success) {
  console.log(result.data);
} else {
  console.error(result.error.message);
}
```

### Styling with Tailwind

```typescript
// Good: Use Tailwind classes
export function Card() {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
        Title
      </h2>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Content
      </p>
    </div>
  );
}

// Follow pattern: light/dark variants with dark: prefix
```

### Testing Patterns

```typescript
// src/modules/my-module/__tests__/my-function.test.ts

describe('calculateSomething', () => {
  it('should double the input', () => {
    const result = calculateSomething(5);
    expect(result).toEqual(10);
  });

  it('should handle zero', () => {
    const result = calculateSomething(0);
    expect(result).toEqual(0);
  });

  it('should handle negative numbers', () => {
    const result = calculateSomething(-3);
    expect(result).toEqual(-6);
  });
});
```

## Documentation Reference

| Document | Contains | Use for |
|----------|----------|---------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design | Understanding structure & modules |
| [DATABASE.md](docs/DATABASE.md) | Schema & collections | Database operations & queries |
| [DATA_IMPORT.md](docs/DATA_IMPORT.md) | Import strategy | Building data importers |
| [CODING_STANDARDS.md](docs/CODING_STANDARDS.md) | Code guidelines | Writing good code |
| [ROADMAP.md](docs/ROADMAP.md) | Project timeline | Understanding phases |
| [README.md](README.md) | Setup & overview | Getting started |
| [PHASE_1_REPORT.md](PHASE_1_REPORT.md) | Foundation summary | Understanding what was built |

## Git Commands

```bash
# Check status
git status

# Stage changes
git add .

# Commit with message
git commit -m "feat: add new feature description"

# Common prefixes: feat, fix, docs, refactor, test, chore

# Push changes
git push origin main

# View logs
git log --oneline
```

## Useful npm Scripts

```bash
npm run dev              # Start development server
npm run build           # Create production build
npm start              # Run production build
npm run lint           # Run ESLint
npx tsc --noEmit       # Type check without emitting
```

## Firebase Emulator

```bash
# Install Firebase CLI (one time)
npm install -g firebase-tools

# Start emulator
firebase emulators:start

# In .env.local, set:
# NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true
# NEXT_PUBLIC_AUTH_EMULATOR_HOST=localhost:9099
# NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST=localhost:8080
```

## Common Issues & Solutions

```
Issue: "Firebase configuration is missing"
→ Solution: Check .env.local has all NEXT_PUBLIC_FIREBASE_* variables

Issue: TypeScript errors
→ Solution: Run npx tsc --noEmit to see all errors
→ Solution: Check src/types/ for missing type definitions

Issue: Build fails
→ Solution: Run npm run build to see detailed error
→ Solution: Check for console.log() (use logger instead)
→ Solution: Verify no 'any' types

Issue: Component not rendering
→ Solution: Check DashboardLayout is imported correctly
→ Solution: Verify page.tsx is in correct directory
→ Solution: Check tsconfig paths: @/* points to src/*

Issue: Firestore queries return nothing
→ Solution: Verify data exists in collection
→ Solution: Check where() conditions match data
→ Solution: Create firestore indexes if needed
```

## Module Structure Template

```
src/modules/my-feature/
├── index.ts                    # Export public API
├── my-feature.ts              # Main functions
├── my-feature-calculator.ts   # Calculations
├── types.ts                   # Feature types (if needed)
└── __tests__/
    └── my-feature.test.ts     # Tests
```

## Import Patterns

```typescript
// ✅ Correct patterns

// From types
import { Item, Recipe } from '@/types';

// From modules
import { calculateProfit } from '@/modules/pricing';

// From components
import { Dashboard Layout, Sidebar } from '@/components/layout';

// From services
import { getFirebaseAuth } from '@/services/firebase/client';

// From utilities
import { formatPrice } from '@/lib/utils';

// Local relative
import { helper } from '../utils';

// ❌ Avoid

// Importing from other modules' internals
import { internalFunction } from '@/modules/module-a/internal';

// Circular imports
// Module A imports from B, B imports from A

// Importing from deep paths
import { something } from '@/modules/a/b/c/d/file';
```

## Performance Tips

```typescript
// ❌ Slow: N+1 queries
for (const id of itemIds) {
  const item = await getItem(id);
}

// ✅ Fast: Batch query
const items = await getItems(itemIds);

// ❌ Slow: Fetch all then filter
const all = await getItems();
const expensive = all.filter(item => item.price > 1000);

// ✅ Fast: Filter in query
const expensive = await getItems({ minPrice: 1000 });

// ❌ Slow: Multiple renders
function Component() {
  const data = fetchData(); // Called on every render
  return <div>{data}</div>;
}

// ✅ Fast: Memoized
function Component() {
  const data = useMemo(() => fetchData(), []);
  return <div>{data}</div>;
}
```

## Next: Phase 2 Preparation

Before starting Phase 2:
1. ✅ Understand current architecture (review docs)
2. ✅ Set up Firebase credentials
3. ✅ Verify dev environment runs (`npm run dev`)
4. ✅ Create account in Firebase Console
5. ✅ Review data sources (WoW Forever Armory, ForeverDB)

Phase 2 will focus on:
- Investigating actual data sources
- Building data import pipeline
- Populating database with items

Good luck! 🚀
