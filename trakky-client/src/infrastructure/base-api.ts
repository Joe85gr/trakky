import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { ApiResponse } from "../models/api-response";
import { AppError } from "../models/app-error";
import { demoMode, serverUrl } from "@/constants.ts";
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

export const makeBaseRequest = (endpoint: string, method: string): AxiosRequestConfig => {
  return {
    url: `${serverUrl}/${endpoint}`,
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };
}

export const baseApiCall = async <T>(options: {
  config: AxiosRequestConfig;
  demoModeDataGenerator?: () => T
}): Promise<ApiResponse<T>> => {
  if(demoMode && options.demoModeDataGenerator) {
    return {
      data: options.demoModeDataGenerator(),
      error: null,
    };
  }

  try {
    const response: AxiosResponse = await axios(options.config);

    const { data } = response;

    return {
      data: data as T,
      error: null,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      console.log("axiosError", axiosError)

      const { response } = axiosError;

      let message = "Could not connect to the server.";

      if (response && response.statusText) {
        message = response.statusText;
      }

      if (axiosError.message) {
        message = axiosError.message;
      }

      if (response && response.data && (response.data as AppError).error) {
        message = (response.data as AppError).error;
      }

      return {
        data: null,
        error: {
          error: message,
        },
      };
    }

    return {
      data: null,
      error: {
        error: (error as Error).message,
      },
    };
  }
};
