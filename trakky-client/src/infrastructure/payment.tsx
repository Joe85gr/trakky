import { mockPayments } from "@/lib/makeData.ts";
import { baseApiCall, makeBaseRequest } from "@/infrastructure/base-api.ts";

export interface Payment {
  id: string;
  amount: number;
  type: string;
  owner: string;
  description: string;
  date: string;
}

export async function FetchPayments(): Promise<Payment[]> {
  const config = makeBaseRequest("payments", "GET")

  const { data, error } = await baseApiCall<Payment[]>({ config, demoModeDataGenerator: mockPayments });

  if(error) {
    console.log("Error while getting payments:", error);
  }

  return data ?? [];
}

export async function AddPayments(payments: Payment[]): Promise<boolean> {
  const config = makeBaseRequest("payments", "POST")

  config.data = payments;

  const { data, error } = await baseApiCall<boolean>({ config, demoModeDataGenerator: () => true });

  if(error) {
    console.log("Error while editing payments:", error);
  }

  return data ?? false;
}

export async function UploadPayments(file: File): Promise<null | string> {

  const config = makeBaseRequest("upload/payments", "POST")

  const formData = new FormData();
  formData.append("file", file);

  config.data = formData;

  if(config.headers) {
    config.headers["Content-Type"] = "multipart/form-data";
  }

  const { data, error } = await baseApiCall<boolean>({ config, demoModeDataGenerator: () => true });

  if(error) {
    console.log("Error while uploading payments:", error);
  }

  return data ? "" : error?.error ?? "Unknown error";
}

export async function EditPayment(payment: Payment): Promise<boolean> {
  const config = makeBaseRequest("payment", "PUT")
  config.data = payment;

  const { data, error } = await baseApiCall<boolean>({ config, demoModeDataGenerator: () => true });

  if(error) {
    console.log("Error while editing payments:", error);
  }

  return data ?? false;
}

export async function DeletePayments(ids: number[]): Promise<boolean> {
  const config = makeBaseRequest("payments", "DELETE")
  config.data = ids;

  const { data, error } = await baseApiCall<boolean>({ config, demoModeDataGenerator: () => true });

  if(error) {
    console.log("Error while delete payments:", error);
  }

  return data ?? false;
}
