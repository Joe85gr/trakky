import {
  mockBudgets,
  mockCategories,
  mockOwners,
  mockPayments,
} from '@/lib/makeData';
import { Budget, Category, Owner, Payment } from '@/models/dtos';
import 'fake-indexeddb/auto';
import Dexie, { type EntityTable } from 'dexie';

const db = new Dexie('trakky-demo') as Dexie & {
  payments: EntityTable<Payment, 'id'>;
  owners: EntityTable<Owner, 'id'>;
  budgets: EntityTable<Budget, 'id'>;
  categories: EntityTable<Category, 'id'>;
};

db.version(2).stores({
  payments: '++id, amount, type, owner, description, date',
  owners: '++id, name',
  budgets: '++id, date, budget, maxBudget',
  categories: '++id, name, iconId',
});

db.on('populate', async () => {
  db.payments.bulkAdd(mockPayments());
  db.budgets.bulkAdd(mockBudgets());
  db.owners.bulkAdd(mockOwners());
  db.categories.bulkAdd(mockCategories());
});

export default db;
