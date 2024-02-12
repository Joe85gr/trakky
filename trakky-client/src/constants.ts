export const serverUrl = "https://trakky-api.rainingdreams.co.uk/api";
export const clientId = "CLIENT_ID";

export const demoMode = import.meta.env.VITE_DEMO_MODE === 'true';

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