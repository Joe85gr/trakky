import { makeTypes } from '@/lib/makeData';
import {
  baseApiCall,
  baseRequestData,
  makeBaseRequest,
} from '@/infrastructure/base-api';
import { Endpoint } from '@/constants';
import { Type } from '@/models/dtos';

export async function getTypes(signal?: AbortSignal) {
  const config = makeBaseRequest(Endpoint.Types, 'GET');
  config.signal = signal;

  const { data, error } = await baseApiCall<Type[]>({
    request: config,
    demoModeData: makeTypes,
  });

  return { data: data ?? [], error };
}

export async function AddTypes(types: Type[]): Promise<boolean> {
  const config = makeBaseRequest(Endpoint.Types, 'POST');
  config.data = baseRequestData(types);

  const { data, error } = await baseApiCall<boolean>({ request: config });

  if (error) {
    console.error('Error while adding types:', error);
  }

  return data ?? false;
}

export async function DeleteTypes(ids: number[]): Promise<boolean> {
  const config = makeBaseRequest(Endpoint.Types, 'DELETE');
  config.data = baseRequestData(ids);

  const { data, error } = await baseApiCall<boolean>({ request: config });

  if (error) {
    console.error('Error while deleting types:', error);
  }

  return data ?? false;
}
