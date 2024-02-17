import { baseApiCall, makeBaseRequest } from '@/infrastructure/base-api';
import { Endpoint } from '@/constants';

async function serverIsDown(signal?: AbortSignal) {
  const config = makeBaseRequest(Endpoint.HealthCheck, 'GET', signal);

  const { data } = await baseApiCall<boolean>({
    request: config,
    demoModeData: () => false,
  });

  // TODO: return error as well and handle
  return !data;
}

export default serverIsDown;
