interface Balance {
  amount: number;
}

export interface OwedBalance extends Balance {
  to: string;
}

export interface DebitorBalance {
  name: string;
  owed: OwedBalance[];
}
