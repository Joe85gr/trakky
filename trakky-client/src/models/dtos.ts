export interface Payment {
  id?: string;
  amount: number;
  type: string;
  owner: string;
  description: string;
  date: string;
}

export interface PaymentToShare extends Payment {
  toShare: boolean;
  ownerIds?: number[];
}

export interface Owner {
  id: number;
  name: string;
}

export interface SharedExpenses {
  Id?: number;
  PaymentId: number;
  OwnerId: number;
  Complete: boolean;
}

export interface Budget {
  id: string;
  date: string;
  budget: number;
  maxBudget: number;
}

export interface Type {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  iconId: number;
}

export interface Icon {
  id: number;
  name: string;
}

export interface Backup {
  budgets: Budget[];
  payments: Payment[];
  types: Type[];
  owners: Owner[];
}
