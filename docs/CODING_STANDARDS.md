# Zeta 2 - Coding Standards & Guidelines

## Philosophy

Write code that is **simple**, **maintainable**, and **understandable**. Favor clarity over cleverness. Future maintainers (including yourself) should be able to understand the code without extensive comments.

## TypeScript Standards

### Type Definitions

✅ **Do**:
```typescript
// Explicit return types
function calculateProfit(cost: number, revenue: number): number {
  return revenue - cost;
}

// Proper generics
function arrayToMap<T extends { id: string }>(items: T[]): Map<string, T> {
  return new Map(items.map(item => [item.id, item]));
}

// Union types for variants
type Result<T> = { success: true; data: T } | { success: false; error: string };

// Const assertions for literal types
const PROFESSIONS = ['alchemy', 'blacksmithing'] as const;
type Profession = typeof PROFESSIONS[number];
```

❌ **Don't**:
```typescript
// Implicit any
const calculateProfit = (cost, revenue) => revenue - cost;

// Using any
function processItem(item: any): any {
  return item.transform();
}

// Over-generic
type Container<T, U, V, W> = { a: T; b: U; c: V; d: W };
```

### Strict Mode

All code runs in TypeScript strict mode:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitThis": true
  }
}
```

**Always**:
- Provide explicit types for function parameters
- Provide explicit return types for functions
- Handle null/undefined explicitly
- Use exhaustiveness checks for unions

### Error Handling

```typescript
// Good: Explicit error handling
async function getItem(id: string): Promise<Item> {
  try {
    const doc = await getDoc(doc(firestore, 'items', id));
    if (!doc.exists()) {
      throw new ItemNotFoundError(id);
    }
    return doc.data() as Item;
  } catch (error) {
    if (error instanceof ItemNotFoundError) {
      logger.warn(`Item not found: ${id}`);
      return null;
    }
    logger.error('Database error', error);
    throw error;
  }
}

// Define custom errors
class ItemNotFoundError extends Error {
  constructor(itemId: string) {
    super(`Item not found: ${itemId}`);
    this.name = 'ItemNotFoundError';
  }
}
```

## Code Organization

### File Size

✅ Files should be **under 300 lines** (excluding imports and comments)

If a file exceeds this:
1. Split into multiple files
2. Extract helper functions to utilities
3. Create service classes if needed

**Example**:
```
components/
├── item-card/
│   ├── item-card.tsx           (200 lines)
│   ├── item-card-header.tsx    (50 lines)
│   ├── item-card-footer.tsx    (50 lines)
│   └── index.ts                (1 line)
```

### Module Responsibilities

Each module should have **one primary responsibility**:

✅ **Good module structure**:
```
modules/pricing/
├── pricing-calculator.ts       # Profit calculations
├── tax-calculator.ts           # Tax calculations
├── comparison-builder.ts       # Price comparisons
├── types.ts                    # Shared types
└── index.ts                    # Exports
```

❌ **Bad module structure**:
```
modules/
├── everything.ts               # 2000 lines, does everything
```

### Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Files | kebab-case | `pricing-calculator.ts` |
| Directories | kebab-case | `src/modules/item-database/` |
| Classes | PascalCase | `class ItemCalculator` |
| Functions | camelCase | `function calculateProfit()` |
| Constants | UPPER_SNAKE_CASE | `const TAX_PERCENTAGE = 0.05;` |
| Interfaces | PascalCase | `interface ItemData` |
| Booleans | Prefix is/has/can/should | `isValid`, `hasError`, `canProcess` |
| React Components | PascalCase | `function Dashboard()` |
| Hooks | Prefix use | `function useItemPrices()` |

### Imports & Exports

```typescript
// 1. External dependencies
import { useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';

// 2. Internal absolute imports (use @/)
import { DashboardLayout } from '@/components/layout';
import { calculateProfit } from '@/modules/pricing';

// 3. Local relative imports
import { formatPrice } from '../utils';

// Barrel exports (index.ts)
export { Sidebar } from './sidebar';
export { Header } from './header';
export { DashboardLayout } from './dashboard-layout';

// But NOT default exports from barrels
// ❌ export default DashboardLayout;
```

## Component Standards

### React Components

```typescript
// Good: Clear prop types, documented
interface DashboardProps {
  userId: string;
  defaultView?: 'list' | 'grid';
}

export function Dashboard({ userId, defaultView = 'list' }: DashboardProps) {
  const [view, setView] = useState<typeof defaultView>(defaultView);

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

### Component Guidelines

1. **Keep components focused**: One responsibility per component
2. **Prop drilling**: Use context for deeply nested props, not excessive props
3. **Hooks**: Extract complex logic into custom hooks
4. **Performance**: Use `useMemo`/`useCallback` only when profiling shows issues

```typescript
// Extract complex logic into hook
function useItemPrices(itemId: string) {
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Fetch logic here
  }, [itemId]);

  return { prices, loading, error };
}

// Component is clean and focused
export function PriceChart({ itemId }: { itemId: string }) {
  const { prices, loading } = useItemPrices(itemId);
  
  if (loading) return <div>Loading...</div>;
  
  return <Chart data={prices} />;
}
```

## Comments & Documentation

### When to Comment

✅ **Write comments for**:
- **Why** (not what): `// Sort descending to show newest prices first`
- **Non-obvious logic**: Complex algorithms, regex patterns
- **Business rules**: Domain-specific decisions
- **Workarounds**: Explain why the workaround exists
- **Public APIs**: Document parameters and return values (use JSDoc)

```typescript
/**
 * Calculate the net profit after taxes for a given transaction.
 * 
 * Note: Assumes AH tax rate of 5%. This may change per realm.
 * @see docs/PRICING.md for tax calculation details
 * 
 * @param grossProfit - Profit before taxes
 * @param taxRate - Tax rate as decimal (e.g., 0.05 for 5%)
 * @returns Net profit after taxes
 */
function calculateNetProfit(grossProfit: number, taxRate: number): number {
  return grossProfit * (1 - taxRate);
}
```

❌ **Don't comment**:
```typescript
// ❌ Obvious comment, adds no value
// Increment counter
count++;

// ❌ Comment that repeats code
// Set the user's name
user.name = 'John';

// ❌ Outdated comments
// Legacy function - still used by feature X (feature X was removed in v2)
function calculateOldPrice() {
  // ...
}
```

### Self-Documenting Code

Prefer code clarity over comments:

```typescript
// ✅ Clear variable names and structure
function calculateCraftingProfitability(
  recipe: Recipe,
  currentMaterialPrices: Map<string, number>,
): ProfitAnalysis {
  const totalMaterialCost = sumMaterialCosts(
    recipe.materials,
    currentMaterialPrices,
  );
  
  const producedItemValue = lookupCurrentPrice(
    recipe.producedItemId,
  );
  
  const grossProfit = producedItemValue - totalMaterialCost;
  const netProfit = applyTaxes(grossProfit);
  
  return { grossProfit, netProfit, profitPercentage: /* ... */ };
}

// ❌ Unclear without comments
function calc(r, p) {
  const c = [...r.m].reduce((sum, m) => sum + (p.get(m.id) || 0), 0);
  const v = p.get(r.p);
  return { g: v - c, n: (v - c) * 0.95 };
}
```

## Testing Standards

### Test Coverage

Focus on **business logic**, not implementation details:

✅ **Test these**:
- Profit calculations (edge cases: 0, negative, large numbers)
- Material requirement aggregation
- Price filtering and comparisons
- Error scenarios

❌ **Don't test**:
- Render snapshot tests
- Component mounting/unmounting
- Library behavior (Firebase, React)

### Example Test

```typescript
describe('PricingCalculator', () => {
  describe('calculateNetProfit', () => {
    it('should deduct 5% tax from gross profit', () => {
      const result = calculateNetProfit(100, 0.05);
      expect(result).toEqual(95);
    });

    it('should handle zero profit', () => {
      const result = calculateNetProfit(0, 0.05);
      expect(result).toEqual(0);
    });

    it('should handle negative profit (loss)', () => {
      const result = calculateNetProfit(-50, 0.05);
      expect(result).toEqual(-47.5);
    });
  });
});
```

## Performance Guidelines

### Database Queries

```typescript
// ✅ Efficient: Specific query with index
const expensiveItems = await firestore
  .collection('items')
  .where('itemLevel', '>=', 100)
  .where('quality', '==', 'epic')
  .orderBy('itemLevel', 'desc')
  .limit(50)
  .get();

// ❌ Inefficient: Fetches all items, then filters
const allItems = await firestore.collection('items').get();
const expensiveItems = allItems.docs
  .map(d => d.data())
  .filter(item => item.itemLevel >= 100 && item.quality === 'epic')
  .sort((a, b) => b.itemLevel - a.itemLevel)
  .slice(0, 50);
```

### Avoid N+1 Queries

```typescript
// ❌ N+1 problem: One query per item
for (const itemId of itemIds) {
  const doc = await getDoc(doc(firestore, 'items', itemId));
  items.push(doc.data());
}

// ✅ Single batch query
const docs = await Promise.all(
  itemIds.map(id => getDoc(doc(firestore, 'items', id)))
);
const items = docs.map(d => d.data());

// ✅ Or use 'in' operator
const batch = itemIds.slice(0, 10); // Firebase limit
const docs = await firestore
  .collection('items')
  .where('__name__', 'in', batch)
  .get();
```

## API Design

### Consistent Patterns

```typescript
// Async operations return Promise<Result>
type Result<T> = { success: true; data: T } | { success: false; error: Error };

async function createItem(input: CreateItemInput): Promise<Result<Item>> {
  try {
    const item = await database.create(input);
    return { success: true, data: item };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

// Alternative: Throw on error (also acceptable)
async function createItem(input: CreateItemInput): Promise<Item> {
  return database.create(input); // Throws on error
}
```

### Input Validation

```typescript
// Validate at module boundary
export async function createItem(input: CreateItemInput): Promise<Item> {
  const validation = validateItemInput(input);
  if (!validation.valid) {
    throw new ValidationError(validation.errors);
  }
  
  // Input is now guaranteed valid
  return await database.create(input);
}

function validateItemInput(input: unknown): ValidationResult {
  if (typeof input !== 'object' || !input) {
    return { valid: false, errors: ['Input must be an object'] };
  }
  
  const item = input as Record<string, unknown>;
  const errors: string[] = [];
  
  if (typeof item.name !== 'string' || !item.name) {
    errors.push('name is required');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
```

## Security Practices

### Never Trust Client Input

```typescript
// ❌ BAD: Trusting user input directly
app.post('/api/users', (req, res) => {
  const user = req.body; // Could be anything
  firestore.collection('users').add(user);
});

// ✅ GOOD: Validate and sanitize
app.post('/api/users', (req, res) => {
  const result = validateUserInput(req.body);
  if (!result.valid) {
    return res.status(400).json({ error: result.errors });
  }
  
  const user: User = {
    id: generateId(),
    email: result.data.email,
    displayName: result.data.displayName || null,
    createdAt: new Date(),
  };
  
  firestore.collection('users').add(user);
});
```

### Secure Firestore Rules

```typescript
// Always validate on server-side
// Client-side rules are convenience, not security

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read, authenticated write
    match /items/{document=**} {
      allow read: if true;
      allow write: if request.auth.uid != null;
    }
    
    // User data: only readable/writable by owner
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

## Deployment Checklist

Before deploying:

- [ ] No `console.log()` statements (use logger)
- [ ] No `any` types remaining
- [ ] TypeScript builds without errors
- [ ] ESLint passes
- [ ] Tests pass
- [ ] Environment variables configured
- [ ] No secrets in code
- [ ] Performance profiled
- [ ] Database indexes created
- [ ] Firestore rules updated
