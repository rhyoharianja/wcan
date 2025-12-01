import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { EnvConfig } from '../config/env.config.js';
import { WhatsAppAPIError } from '../utils/WhatsAppError.js';

export abstract class BaseService {
  protected http: AxiosInstance;
  protected config: EnvConfig;

  constructor(config: EnvConfig) {
    this.config = config;
    this.http = axios.create({
      baseURL: `${config.WA_BASE_URL}${config.WA_VERSION}/${config.WA_PHONE_NUMBER_ID}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.initializeInterceptors();
  }

  private initializeInterceptors() {
    // Request Interceptor: Add Authorization Header
    this.http.interceptors.request.use((req) => {
      req.headers['Authorization'] = `Bearer ${this.config.WA_ACCESS_TOKEN}`;
      return req;
    });

    // Response Interceptor: Handle Errors
    this.http.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.data && error.response.data.error) {
          throw new WhatsAppAPIError(error.response.data.error);
        }
        throw error;
      }
    );
  }
}
