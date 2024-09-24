import { Usage } from '@baseline/types/usage';
import { RequestHandler } from './request-handler';

export const getUsage = async (
  requestHandler: RequestHandler,
): Promise<Usage> => {
  const response = await requestHandler.request<Usage>({
    method: 'GET',
    url: `usage/me`,
    hasAuthentication: true,
  });
  if ('data' in response) {
    return response.data;
  }
  throw response;
};
