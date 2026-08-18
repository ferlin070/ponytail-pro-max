#!/usr/bin/env node
/**
 * Shared domain templates for brief + seed. Each domain generates real,
 * typecheck-clean, unit-tested files (vanilla and React variants) so the
 * 90-minute clock starts with a working domain model, not empty stubs.
 *
 * All templates honour tsconfig strictness: noUncheckedIndexedAccess (?? on
 * array reads), noUnusedLocals/Parameters (no stray imports/params).
 */

const DOMAINS = {
  finance: {
    key: 'finance',
    kind: 'Expense',
    detect: /\b(money|expense|budget|wallet|finance|bank|spend|salary|income|bill|cost)\b|(belanja|perbelanjaan|belanjawan|dompet|kewangan|bayar|harga|simpanan|kategori)/,
    categories: ['Food', 'Bills', 'Transport', 'Shopping', 'Other'],
    names: ['Groceries', 'Rent', 'Coffee', 'Fuel', 'Internet', 'Movie night', 'Taxi', 'Lunch'],
    types: `// Domain types — the single source of truth for this app.
export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  createdAt: number;
}
`,
    schema: `// Pure domain logic for expenses. Side-effect free + unit-tested.
import type { Expense } from './types';

export const CATEGORIES = ['Food', 'Bills', 'Transport', 'Shopping', 'Other'] as const;

export function isExpense(v: unknown): v is Expense {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.title === 'string' &&
    typeof o.amount === 'number' && o.amount >= 0 &&
    typeof o.category === 'string' &&
    typeof o.date === 'string' &&
    typeof o.createdAt === 'number'
  );
}

export function sumExpenses(items: Expense[]): number {
  return items.reduce((t, e) => t + e.amount, 0);
}

export function totalByCategory(items: Expense[], category: string): number {
  return items.filter((e) => e.category === category).reduce((t, e) => t + e.amount, 0);
}

export function countExpenses(items: Expense[]): number {
  return items.length;
}

export function formatCurrency(amount: number): string {
  return 'RM ' + amount.toFixed(2);
}
`,
    storage: `// Persistence for expenses — error-safe createStore + domain guard.
import { createStore } from './lib/storage';
import type { Expense } from './types';
import { isExpense } from './schema';

export const expenseStore = createStore<Expense>('app:expenses:v1', isExpense);
export type { Expense };
`,
    test: `import { describe, it, expect } from 'vitest';
import { isExpense, sumExpenses, totalByCategory, countExpenses, formatCurrency } from '../schema';
import type { Expense } from '../types';

const items: Expense[] = [
  { id: '1', title: 'Rent', amount: 1000, category: 'Bills', date: '2026-08-01', createdAt: 1 },
  { id: '2', title: 'Coffee', amount: 8.5, category: 'Food', date: '2026-08-02', createdAt: 2 },
  { id: '3', title: 'Fuel', amount: 60, category: 'Transport', date: '2026-08-03', createdAt: 3 },
];

describe('expenses', () => {
  it('validates records with the type guard', () => {
    for (const it of items) expect(isExpense(it)).toBe(true);
    expect(isExpense({ nope: 1 })).toBe(false);
  });

  it('sums, totals by category, counts', () => {
    expect(sumExpenses(items)).toBe(1068.5);
    expect(totalByCategory(items, 'Food')).toBe(8.5);
    expect(countExpenses(items)).toBe(3);
  });

  it('formats currency', () => {
    expect(formatCurrency(12.5)).toBe('RM 12.50');
  });
});
`,
    seed: (i, names, cats, daysAgoISO) => `({
    title: ${JSON.stringify(names)}[i % ${names.length}] ?? 'Item',
    amount: Math.round(((i + 1) * 13.7) * 100) / 100,
    category: ${JSON.stringify(cats)}[i % ${cats.length}] ?? 'Other',
    date: daysAgoISO(i),
  })`,
    rtypes: `// Domain types — the single source of truth for this app.
export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  createdAt: number;
}
`,
    rdomain: `// Pure domain logic for expenses. Side-effect free + unit-tested.
import type { Expense } from './types';

export function isExpense(v: unknown): v is Expense {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.title === 'string' &&
    typeof o.amount === 'number' && o.amount >= 0 &&
    typeof o.category === 'string' &&
    typeof o.date === 'string' &&
    typeof o.createdAt === 'number'
  );
}

export function sumExpenses(items: Expense[]): number {
  return items.reduce((t, e) => t + e.amount, 0);
}

export function totalByCategory(items: Expense[], category: string): number {
  return items.filter((e) => e.category === category).reduce((t, e) => t + e.amount, 0);
}

export function formatCurrency(amount: number): string {
  return 'RM ' + amount.toFixed(2);
}
`,
    rstore: `// Persistence hook-in: export the type + guard for useLocalStorage.
export type { Expense as Item } from './types';
export { isExpense as isItem } from './domain';
`,
    rtest: `import { describe, it, expect } from 'vitest';
import { isExpense, sumExpenses, totalByCategory } from '../domain';
import type { Expense } from '../types';

const items: Expense[] = [
  { id: '1', title: 'Rent', amount: 1000, category: 'Bills', date: '2026-08-01', createdAt: 1 },
  { id: '2', title: 'Coffee', amount: 8.5, category: 'Food', date: '2026-08-02', createdAt: 2 },
];

describe('expenses', () => {
  it('validates records', () => {
    for (const it of items) expect(isExpense(it)).toBe(true);
  });
  it('totals', () => {
    expect(sumExpenses(items)).toBe(1008.5);
    expect(totalByCategory(items, 'Food')).toBe(8.5);
  });
});
`,
  },

  ecommerce: {
    key: 'ecommerce',
    kind: 'Product',
    detect: /\b(store|shop|ecommerce|product|cart|order|catalog|checkout|inventory|stock|price)\b|(kedai|produk|troli|pesanan|katalog|stok)/,
    categories: ['Food', 'Drinks', 'Household', 'Electronics', 'Other'],
    names: ['Bread', 'Milk', 'Rice 5kg', 'USB-C cable', 'Notebook', 'Shampoo', 'Coffee beans', 'Detergent'],
    types: `// Domain types — the single source of truth for this app.
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  createdAt: number;
}
`,
    schema: `// Pure domain logic for products. Side-effect free + unit-tested.
import type { Product } from './types';

export const CATEGORIES = ['Food', 'Drinks', 'Household', 'Electronics', 'Other'] as const;

export function isProduct(v: unknown): v is Product {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.name === 'string' &&
    typeof o.price === 'number' && o.price >= 0 &&
    typeof o.stock === 'number' && o.stock >= 0 &&
    typeof o.category === 'string' &&
    typeof o.createdAt === 'number'
  );
}

export function inventoryValue(items: Product[]): number {
  return items.reduce((t, p) => t + p.price * p.stock, 0);
}

export function lowStock(items: Product[], threshold = 5): Product[] {
  return items.filter((p) => p.stock < threshold);
}

export function formatPrice(amount: number): string {
  return 'RM ' + amount.toFixed(2);
}
`,
    storage: `// Persistence for products — error-safe createStore + domain guard.
import { createStore } from './lib/storage';
import type { Product } from './types';
import { isProduct } from './schema';

export const productStore = createStore<Product>('app:products:v1', isProduct);
export type { Product };
`,
    test: `import { describe, it, expect } from 'vitest';
import { isProduct, inventoryValue, lowStock, formatPrice } from '../schema';
import type { Product } from '../types';

const items: Product[] = [
  { id: '1', name: 'Bread', price: 3.5, stock: 12, category: 'Food', createdAt: 1 },
  { id: '2', name: 'Milk', price: 6, stock: 2, category: 'Food', createdAt: 2 },
  { id: '3', name: 'USB-C cable', price: 25, stock: 0, category: 'Electronics', createdAt: 3 },
];

describe('products', () => {
  it('validates records with the type guard', () => {
    for (const it of items) expect(isProduct(it)).toBe(true);
    expect(isProduct({ nope: 1 })).toBe(false);
  });

  it('values inventory and finds low stock', () => {
    expect(inventoryValue(items)).toBe(54);
    expect(lowStock(items).map((p) => p.name)).toEqual(['Milk', 'USB-C cable']);
  });

  it('formats price', () => {
    expect(formatPrice(12.5)).toBe('RM 12.50');
  });
});
`,
    seed: (i, names, cats) => `({
    name: ${JSON.stringify(names)}[i % ${names.length}] ?? 'Item',
    price: Math.round(((i + 1) * 4.75) * 100) / 100,
    stock: (i * 3) % 15,
    category: ${JSON.stringify(cats)}[i % ${cats.length}] ?? 'Other',
  })`,
    rtypes: `// Domain types — the single source of truth for this app.
export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  createdAt: number;
}
`,
    rdomain: `// Pure domain logic for products. Side-effect free + unit-tested.
import type { Product } from './types';

export function isProduct(v: unknown): v is Product {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.name === 'string' &&
    typeof o.price === 'number' && o.price >= 0 &&
    typeof o.stock === 'number' && o.stock >= 0 &&
    typeof o.category === 'string' &&
    typeof o.createdAt === 'number'
  );
}

export function inventoryValue(items: Product[]): number {
  return items.reduce((t, p) => t + p.price * p.stock, 0);
}

export function lowStock(items: Product[], threshold = 5): Product[] {
  return items.filter((p) => p.stock < threshold);
}

export function formatPrice(amount: number): string {
  return 'RM ' + amount.toFixed(2);
}
`,
    rstore: `// Persistence hook-in: export the type + guard for useLocalStorage.
export type { Product as Item } from './types';
export { isProduct as isItem } from './domain';
`,
    rtest: `import { describe, it, expect } from 'vitest';
import { isProduct, inventoryValue, lowStock } from '../domain';
import type { Product } from '../types';

const items: Product[] = [
  { id: '1', name: 'Bread', price: 3.5, stock: 12, category: 'Food', createdAt: 1 },
  { id: '2', name: 'Milk', price: 6, stock: 2, category: 'Food', createdAt: 2 },
];

describe('products', () => {
  it('validates records', () => {
    for (const it of items) expect(isProduct(it)).toBe(true);
  });
  it('values inventory and finds low stock', () => {
    expect(inventoryValue(items)).toBe(54);
    expect(lowStock(items).map((p) => p.name)).toEqual(['Milk']);
  });
});
`,
  },

  task: {
    key: 'task',
    kind: 'Task',
    detect: /\b(task|todo|kanban|board|project|issue|sprint|reminder|note|plan)\b|(senarai|tugasan|projek|peringatan)/,
    names: ['Write report', 'Call client', 'Buy groceries', 'Fix bug #42', 'Plan sprint', 'Clean inbox', 'Review PR', 'Morning run'],
    types: `// Domain types — the single source of truth for this app.
export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  done: boolean;
  priority: Priority;
  createdAt: number;
}
`,
    schema: `// Pure domain logic for tasks. Side-effect free + unit-tested.
import type { Task, Priority } from './types';

export const PRIORITIES: readonly Priority[] = ['low', 'medium', 'high'];

export function isTask(v: unknown): v is Task {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.title === 'string' &&
    typeof o.done === 'boolean' &&
    PRIORITIES.includes(o.priority as Priority) &&
    typeof o.createdAt === 'number'
  );
}

export function openTasks(items: Task[]): Task[] {
  return items.filter((t) => !t.done);
}

export function doneCount(items: Task[]): number {
  return items.filter((t) => t.done).length;
}

export function byPriority(items: Task[], priority: Priority): Task[] {
  return items.filter((t) => t.priority === priority);
}
`,
    storage: `// Persistence for tasks — error-safe createStore + domain guard.
import { createStore } from './lib/storage';
import type { Task } from './types';
import { isTask } from './schema';

export const taskStore = createStore<Task>('app:tasks:v1', isTask);
export type { Task };
`,
    test: `import { describe, it, expect } from 'vitest';
import { isTask, openTasks, doneCount, byPriority } from '../schema';
import type { Task } from '../types';

const items: Task[] = [
  { id: '1', title: 'Fix bug', done: true, priority: 'high', createdAt: 1 },
  { id: '2', title: 'Write report', done: false, priority: 'high', createdAt: 2 },
  { id: '3', title: 'Clean inbox', done: false, priority: 'low', createdAt: 3 },
];

describe('tasks', () => {
  it('validates records', () => {
    for (const it of items) expect(isTask(it)).toBe(true);
    expect(isTask({ nope: 1 })).toBe(false);
  });

  it('counts open and done', () => {
    expect(openTasks(items).length).toBe(2);
    expect(doneCount(items)).toBe(1);
  });

  it('filters by priority', () => {
    expect(byPriority(items, 'high').length).toBe(2);
  });
});
`,
    seed: (i, names) => `({
    title: ${JSON.stringify(names)}[i % ${names.length}] ?? 'Item',
    done: i % 3 === 0,
    priority: (['low', 'medium', 'high'] as const)[i % 3] ?? 'medium',
  })`,
    rtypes: `// Domain types — the single source of truth for this app.
export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  done: boolean;
  priority: Priority;
  createdAt: number;
}
`,
    rdomain: `// Pure domain logic for tasks. Side-effect free + unit-tested.
import type { Task, Priority } from './types';

export const PRIORITIES: readonly Priority[] = ['low', 'medium', 'high'];

export function isTask(v: unknown): v is Task {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return (
    typeof o.id === 'string' &&
    typeof o.title === 'string' &&
    typeof o.done === 'boolean' &&
    PRIORITIES.includes(o.priority as Priority) &&
    typeof o.createdAt === 'number'
  );
}

export function openTasks(items: Task[]): Task[] {
  return items.filter((t) => !t.done);
}

export function doneCount(items: Task[]): number {
  return items.filter((t) => t.done).length;
}
`,
    rstore: `// Persistence hook-in: export the type + guard for useLocalStorage.
export type { Task as Item } from './types';
export { isTask as isItem } from './domain';
`,
    rtest: `import { describe, it, expect } from 'vitest';
import { isTask, openTasks, doneCount } from '../domain';
import type { Task } from '../types';

const items: Task[] = [
  { id: '1', title: 'Fix bug', done: true, priority: 'high', createdAt: 1 },
  { id: '2', title: 'Write report', done: false, priority: 'high', createdAt: 2 },
];

describe('tasks', () => {
  it('validates records', () => {
    for (const it of items) expect(isTask(it)).toBe(true);
  });
  it('counts open and done', () => {
    expect(openTasks(items).length).toBe(1);
    expect(doneCount(items)).toBe(1);
  });
});
`,
  },
};

const GENERIC = {
  key: 'generic',
  kind: 'Item',
  names: ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta'],
  types: `// Domain types — the single source of truth for this app.
export interface Item {
  id: string;
  name: string;
  createdAt: number;
}
`,
  schema: `// Pure domain logic. Side-effect free + unit-tested.
import type { Item } from './types';

export function isItem(v: unknown): v is Item {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return typeof o.id === 'string' && typeof o.name === 'string' && typeof o.createdAt === 'number';
}

export function countItems(items: Item[]): number {
  return items.length;
}

export function search(items: Item[], query: string): Item[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((i) => i.name.toLowerCase().includes(q));
}
`,
  storage: `// Persistence — error-safe createStore + domain guard.
import { createStore } from './lib/storage';
import type { Item } from './types';
import { isItem } from './schema';

export const itemStore = createStore<Item>('app:items:v1', isItem);
export type { Item };
`,
  test: `import { describe, it, expect } from 'vitest';
import { isItem, countItems, search } from '../schema';
import type { Item } from '../types';

const items: Item[] = [
  { id: '1', name: 'Milk', createdAt: 1 },
  { id: '2', name: 'Bread', createdAt: 2 },
];

describe('items', () => {
  it('validates records', () => {
    for (const it of items) expect(isItem(it)).toBe(true);
    expect(isItem({ nope: 1 })).toBe(false);
  });

  it('counts and searches', () => {
    expect(countItems(items)).toBe(2);
    expect(search(items, 'milk').length).toBe(1);
  });
});
`,
  seed: (i, names) => `({
    name: ${JSON.stringify(names)}[i % ${names.length}] ?? 'Item',
  })`,
  rtypes: `// Domain types — the single source of truth for this app.
export interface Item {
  id: string;
  name: string;
  createdAt: number;
}
`,
  rdomain: `// Pure domain logic. Side-effect free + unit-tested.
import type { Item } from './types';

export function isItem(v: unknown): v is Item {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  return typeof o.id === 'string' && typeof o.name === 'string' && typeof o.createdAt === 'number';
}

export function countItems(items: Item[]): number {
  return items.length;
}

export function search(items: Item[], query: string): Item[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((i) => i.name.toLowerCase().includes(q));
}
`,
  rstore: `// Persistence hook-in: export the type + guard for useLocalStorage.
export type { Item } from './types';
export { isItem } from './domain';
`,
  rtest: `import { describe, it, expect } from 'vitest';
import { isItem, countItems, search } from '../domain';
import type { Item } from '../types';

const items: Item[] = [
  { id: '1', name: 'Milk', createdAt: 1 },
  { id: '2', name: 'Bread', createdAt: 2 },
];

describe('items', () => {
  it('validates records', () => {
    for (const it of items) expect(isItem(it)).toBe(true);
  });
  it('counts and searches', () => {
    expect(countItems(items)).toBe(2);
    expect(search(items, 'milk').length).toBe(1);
  });
});
`,
};

const ORDER = ['finance', 'ecommerce', 'task'];
const GUARD_TO_KEY = { isExpense: 'finance', isProduct: 'ecommerce', isTask: 'task', isItem: 'generic' };

export function detectDomain(text) {
  const lower = text.toLowerCase();
  for (const key of ORDER) {
    if (DOMAINS[key].detect.test(lower)) return DOMAINS[key];
  }
  return GENERIC;
}

/** Prefer the domain already compiled into src/schema.ts (ground truth). */
export function detectByGuard(schemaSrc) {
  const m = /export function (is[A-Za-z]+)\(/.exec(schemaSrc || '');
  const key = m ? GUARD_TO_KEY[m[1]] : undefined;
  return key ? DOMAINS[key] ?? GENERIC : null;
}

/** seedData.ts body for a domain (vanilla variant). */
export function seedDataTemplate(domain, count) {
  const kind = domain.kind;
  const names = domain.names ?? GENERIC.names;
  const cats = domain.categories ?? [];
  const factory = domain.seed ?? GENERIC.seed;
  const guard = `is${kind}`;
  const body = factory('i', 'NAMES', 'CATEGORIES', 'daysAgoISO');
  const dateImport = body.includes('daysAgoISO') ? ', daysAgoISO' : '';
  return `// Starter data for this app. Edit freely — fields must match the guard in src/storage.ts.
import { makeSeed${dateImport} } from './lib/seed';
import { ${guard} } from './schema';
import type { ${kind} } from './types';

export type SeedItem = ${kind};

export { ${guard} as isSeedItem };

export function seedItems(count: number = ${count}): SeedItem[] {
  return makeSeed<SeedItem>(count, (i) => ${body});
}
`;
}

/** seedData.ts body for a domain (React variant). */
export function seedDataTemplateReact(domain, count) {
  const kind = domain.kind;
  const names = domain.names ?? GENERIC.names;
  const cats = domain.categories ?? [];
  const factory = domain.seed ?? GENERIC.seed;
  const guard = `is${kind}`;
  const body = factory('i', 'NAMES', 'CATEGORIES', 'daysAgoISO');
  const dateImport = body.includes('daysAgoISO') ? ', daysAgoISO' : '';
  return `// Starter data for this app. Edit freely — fields must match the guard in src/store.ts.
import { makeSeed${dateImport} } from './lib/seed';
import { ${guard} } from './domain';
import type { ${kind} } from './types';

export type SeedItem = ${kind};

export { ${guard} as isSeedItem };

export function seedItems(count: number = ${count}): SeedItem[] {
  return makeSeed<SeedItem>(count, (i) => ${body});
}
`;
}

export const SEED_TEST = `// Seed data test — every record validates against its own guard.
import { describe, it, expect } from 'vitest';
import { seedItems, isSeedItem } from '../seedData';

describe('seed data', () => {
  it('generates the requested count with unique ids', () => {
    const items = seedItems(6);
    expect(items).toHaveLength(6);
    expect(new Set(items.map((i) => i.id)).size).toBe(6);
  });

  it('every record passes its own type guard', () => {
    for (const item of seedItems(10)) expect(isSeedItem(item)).toBe(true);
  });
});
`;

export { GENERIC };