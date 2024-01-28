import { makeBudgets } from "@/lib/makeData.ts";
import axios from "axios";
import { baseApiCall, makeBaseRequest } from "@/infrastructure/base-api.ts";

axios.defaults.headers.post["Content-Type"] = "application/json";

export interface Budget {
  id: string;
  date: Date;
  budget: number;
  maxBudget: number;
}

export async function fetchBudgets(): Promise<Budget[]> {
  const config = makeBaseRequest("budgets", "GET")

  const { data, error } = await baseApiCall<Budget[]>({ config, demoModeDataGenerator: makeBudgets });

  if(error) {
    console.log("Error while getting budgets:", error);
  }

  return data ?? [];

}


export async function AddBudgets(budgets: Budget[]): Promise<boolean> {
  const config = makeBaseRequest("budgets", "POST")
  config.data = budgets;

  const { data, error } = await baseApiCall<boolean>({ config, demoModeDataGenerator: () => true });

  if(error) {
    console.log("Error while adding budgets:", error);
  }

  return data ?? false;
}

export async function EditBudget(budget: Budget): Promise<boolean> {
  const config = makeBaseRequest("budget", "PUT")
  config.data = budget;

  const { data, error } = await baseApiCall<boolean>({ config, demoModeDataGenerator: () => true });

  if(error) {
    console.log("Error while editing budget:", error);
  }

  return data ?? false;
}

export async function DeleteBudgets(ids: number[]): Promise<boolean> {
  const config = makeBaseRequest("budgets", "DELETE")
  config.data = ids;

  const { data, error } = await baseApiCall<boolean>({ config, demoModeDataGenerator: () => true });

  if(error) {
    console.log("Error while deleting budgets:", error);
  }

  return data ?? false;
}
