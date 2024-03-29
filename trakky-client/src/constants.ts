export const demoMode = import.meta.env.VITE_DEMO_MODE === 'true';

export enum Endpoint {
  Payments = 'payments',
  Budgets = 'budgets',
  Types = 'types',
  Owners = 'owners',
  Backup = 'backup',
  HealthCheck = 'health-check',
}

export enum StorageKey {
  ShowBudget = 'show_budget',
  ShowMaxBudget = 'show_max_budget',
  SelectedYear = 'selected_year',
  SelectedMonth = 'selected_month',
  ActiveColumns = 'active_columns',
}
