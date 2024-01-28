import axios from "axios";
import { Budget } from "@/infrastructure/budget.tsx";
import { Payment } from "@/infrastructure/payment.tsx";
import { Type } from "@/infrastructure/transaction-type.tsx";
import { Owner } from "@/infrastructure/owner.tsx";
import { mockBackup } from "@/lib/makeData.ts";
import { baseApiCall, makeBaseRequest } from "@/infrastructure/base-api.ts";

axios.defaults.headers.post["Content-Type"] = "application/json";

export interface Backup {
  budgets: Budget[];
  payments: Payment[];
  types: Type[];
  owners: Owner[];
}


export async function fetchBackup(): Promise<Backup | null> {
  const config = makeBaseRequest("backup", "GET")

  const { data, error } = await baseApiCall<Backup>({ config, demoModeDataGenerator: mockBackup });

  if(error) {
    console.log("Error while getting backup:", error);
  }

  return data ?? null;
}
