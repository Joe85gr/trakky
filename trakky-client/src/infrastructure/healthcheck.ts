import { baseApiCall, makeBaseRequest } from '@/infrastructure/base-api';
import { Endpoint } from '@/constants';

async function serverIsDown(signal?: AbortSignal) {
  const config = makeBaseRequest(Endpoint.HealthCheck, 'GET', signal);

  const { data, error } = await baseApiCall<boolean>({
    request: config,
    demoModeData: () => false,
  });

  if (error) {
    console.log('Error while performing health check:', error);
  }

  return !data ?? true;
}

export default serverIsDown;
