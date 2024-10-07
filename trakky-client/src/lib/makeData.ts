import { Payment, Budget } from '@/models/dtos';

import payments from './mockPayments.json';
import budgets from './mockBudgets.json';

interface ImportedData {
  date: string;
}

const sortByDate = (a: ImportedData, b: ImportedData) => {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);
  return dateB.getTime() - dateA.getTime(); // Sorts in descending order
};

export function mockPayments() {
  return payments.sort(sortByDate) as unknown as Payment[];
}

export function mockBudgets() {
  return budgets.sort(sortByDate) as unknown as Budget[];
}

export function mockOwners() {
  return [
    { id: 1, name: 'Donald' },
    { id: 2, name: 'Goofy' },
  ];
}

export function mockTypes() {
  return [
    { id: 1, name: 'Food' },
    { id: 2, name: 'General' },
    { id: 3, name: 'Personal' },
    { id: 4, name: 'Travel' },
    { id: 5, name: 'House' },
  ];
}

export function mockCategories() {
  return [
    { id: 1, name: 'Food', iconId: 1 },
    { id: 2, name: 'Travel', iconId: 5 },
    { id: 3, name: 'General', iconId: 4 },
    { id: 4, name: 'Personal', iconId: 6 },
    { id: 5, name: 'House', iconId: 2 },
  ];
}

export function mockIcons() {
  return [
    { id: 1, name: 'Utensils' },
    { id: 2, name: 'HeartIcon' },
    { id: 3, name: 'HandCoins' },
    { id: 4, name: 'HomeIcon' },
    { id: 5, name: 'Plane' },
    { id: 6, name: 'Gift' },
  ];
}
