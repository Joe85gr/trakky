export const demoMode = true;


export enum Endpoint {
  Payments = "payments",
  Budgets = "budgets",
  Types = "types",
  Owners = "owners",
  Backup = "backup",
  HealthCheck = "health-check"
}

export enum StorageKey {
  OpenIdConfig = "openid_config",
  ShowBudget = "show_budget",
  ShowMaxBudget = "show_max_budget",
  SelectedYear = "selected_year",
  ActiveColumns = "active_columns"
}