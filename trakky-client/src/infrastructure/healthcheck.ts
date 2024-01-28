import { baseApiCall, makeBaseRequest } from "@/infrastructure/base-api.ts";
export async function serverIsDown() {

  const config = makeBaseRequest("health-check", "GET")

  const { data, error } = await baseApiCall<boolean>({ config, demoModeDataGenerator: () => false });

  if(error) {
    console.log("Error while performing health check:", error);
  }

  return !data ?? true;
}
