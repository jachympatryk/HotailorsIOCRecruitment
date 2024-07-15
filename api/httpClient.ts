import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import * as yup from 'yup';
import { injectable } from 'inversify';
import { HTTP_CLIENT_CONFIG } from '../config/config';
import { handleError } from '../handlers';

@injectable()
class HttpClient {
  private readonly _instance: AxiosInstance;
  private readonly _maxRetries: number;
  private readonly _retryDelay: number;

  constructor(
    maxRetries = HTTP_CLIENT_CONFIG.maxRetries,
    retryDelay = HTTP_CLIENT_CONFIG.retryDelay
  ) {
    this._instance = axios.create();
    this._maxRetries = maxRetries;
    this._retryDelay = retryDelay;

    this._instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) =>
        handleError(error, this._instance, this._maxRetries, this._retryDelay)
    );
  }

  public async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this._instance.get<T>(url, config);
  }

  public async getWithSchema<T extends yup.AnyObject>(
    url: string,
    schema: yup.ObjectSchema<T>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this._instance.get(url, config);
    await schema.validate(response.data);

    return response.data;
  }
}

export default HttpClient;
