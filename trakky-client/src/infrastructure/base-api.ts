import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { demoMode } from '@/constants';
import { serverUrl } from '@/authConfig';
import { AppError } from '../models/app-error';
import { ApiResponse } from '../models/api-response';

export enum ErrorMessage {
  NO_CONNECTION = 'Could not connect to the server.',
  UNAUTHORIZED = 'Unauthorized.',
  FORBIDDEN = 'Forbidden.',
  NOT_FOUND = 'Not found.',
  INTERNAL_SERVER_ERROR = 'Internal server error.',
  BAD_REQUEST = 'Bad request.',
  UNKNOWN_ERROR = 'An unknown error occurred.',
}

export const makeBaseRequest = (
  endpoint: string,
  method: string,
  signal?: AbortSignal
): AxiosRequestConfig => {
  return {
    url: `${serverUrl}/${endpoint}`,
    method,
    signal,
    headers: {
      'content-type': 'application/json',
    },
  };
};

export const baseApiCall = async <T>(options: {
  request: AxiosRequestConfig;
  demoModeData?: () => T;
}): Promise<ApiResponse<T>> => {
  if (demoMode && options.demoModeData) {
    return {
      data: options.demoModeData(),
      error: null,
    };
  }

  try {
    const token = localStorage.getItem('ROCP_token')?.replace(/"/g, '');
    if (token && options.request.headers) {
      // eslint-disable-next-line no-param-reassign
      options.request.headers.Authorization = `Bearer ${token}`;
    }

    const response: AxiosResponse = await axios(options.request);
    const { data } = response;

    return {
      data: data as T,
      error: null,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      const { response } = axiosError;

      let message: string;

      if (response && response.data && (response.data as AppError).error) {
        message = (response.data as AppError).error;
      } else if (axiosError.message) {
        message = axiosError.message;
      } else if (response && response.statusText) {
        message = response.statusText;
      } else {
        message = ErrorMessage.NO_CONNECTION;
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

export const baseRequestData = <T>(data: T) => {
  return {
    data,
  };
};
