import { demoMode, serverUrl } from "@/constants.ts";
import { makeOwners } from "@/lib/makeData.ts";
import axios from "axios";

axios.defaults.headers.post["Content-Type"] = "application/json";

export interface Owner {
  id: number;
  name: string;
}

export async function fetchOwners(): Promise<Owner[]> {
  if (demoMode) return makeOwners();

  let response = await axios.get(`${serverUrl}/owners`);
  return (await response.data) as Owner[];
}