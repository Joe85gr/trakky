import { makeTypes } from "@/lib/makeData.ts";
import { baseApiCall, makeBaseRequest } from "@/infrastructure/base-api.ts";

export interface Type {
  id: number;
  name: string;
}

export async function fetchTypes(): Promise<Type[]> {
  const config = makeBaseRequest("types", "GET")

  const { data, error } = await baseApiCall<Type[]>({ config, demoModeDataGenerator: makeTypes });

  console.log("fetchTypes:", error);

  return data ?? [];
}

export async function AddTypes(types: Type[]): Promise<boolean> {
  const config = makeBaseRequest("types", "POST")
  config.data = types;

  const { data, error } = await baseApiCall<boolean>({ config });

  console.log("AddTypes:", error);

  return data ?? false;
}

export async function DeleteTypes(ids: number[]): Promise<boolean> {
  const config = makeBaseRequest("types", "DELETE")
  config.data = ids;

  const { data, error } = await baseApiCall<boolean>({ config });

  console.log("DeleteTypes:", error);

  return data ?? false;
}
