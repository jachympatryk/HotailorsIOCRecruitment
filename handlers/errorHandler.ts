import {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

export const handleError = async (
  error: AxiosError,
  instance: AxiosInstance,
  maxRetries: number,
  retryDelay: number
): Promise<AxiosResponse> => {
  const config = error.config as AxiosRequestConfig & {
    __retryCount?: number;
  };

  if (!config) {
    return Promise.reject(error);
  }

  config.__retryCount = config.__retryCount || 0;

  if (config.__retryCount >= maxRetries) {
    return Promise.reject(error);
  }

  config.__retryCount += 1;

  const backoff = new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, retryDelay);
  });

  await backoff;
  return instance(config);
};
