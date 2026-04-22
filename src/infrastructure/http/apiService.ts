import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import apiInstance from './apiInstance';
import { errorResponseAdapter } from './errorResponseAdapter';

type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

type RequestParams<T = unknown> = {
  url: string;
  data?: T;
  config?: AxiosRequestConfig;
};

type Methods = {
  get: ({ url, config }: RequestParams) => Promise<AxiosResponse>;
  post: <T>({ url, data, config }: RequestParams<T>) => Promise<AxiosResponse>;
  put: <T>({ url, data, config }: RequestParams<T>) => Promise<AxiosResponse>;
  patch: <T>({ url, data, config }: RequestParams<T>) => Promise<AxiosResponse>;
  delete: ({ url, config }: RequestParams) => Promise<AxiosResponse>;
};

const methods: Methods = {
  get: async ({ url, config }) => apiInstance.get(url, config),
  post: async ({ url, data, config }) => apiInstance.post(url, data, config),
  put: async ({ url, data, config }) => apiInstance.put(url, data, config),
  patch: async ({ url, data, config }) => apiInstance.patch(url, data, config),
  delete: async ({ url, config }) => apiInstance.delete(url, config),
};

const request = async <T>({
  url,
  method,
  data,
  config,
}: RequestParams<T> & { method: HttpMethod }) => {
  try {
    return await methods[method]({ url, data, config } as RequestParams<T>);
  } catch (error) {
    throw errorResponseAdapter(error);
  }
};

export const ApiService = {
  get: async ({ url, config }: RequestParams) => request({ url, method: 'get', config }),
  post: async <T>({ url, data, config }: RequestParams<T>) => request({ url, method: 'post', data, config }),
  put: async <T>({ url, data, config }: RequestParams<T>) => request({ url, method: 'put', data, config }),
  patch: async <T>({ url, data, config }: RequestParams<T>) => request({ url, method: 'patch', data, config }),
  delete: async ({ url, config }: RequestParams) => request({ url, method: 'delete', config }),
};

