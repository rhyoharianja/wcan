import { BaseService } from './BaseService.js';

export interface AnalyticsParams {
  start: number; // Unix timestamp
  end: number;   // Unix timestamp
  granularity: 'DAILY' | 'MONTHLY' | 'HALF_HOUR';
  phone_numbers?: string[];
}

export interface AnalyticsDataPoint {
  start: number;
  end: number;
  phone_number: string;
  country: string;
  conversation_type: string;
  conversation_direction: string;
  conversation_category: string;
  cost: number;
  count: number;
}

export interface AnalyticsResponse {
  data: {
    data_points: AnalyticsDataPoint[];
  }[];
}

export class AnalyticsService extends BaseService {
  /**
   * Get Analytics
   */
  async getAnalytics(params: AnalyticsParams): Promise<AnalyticsResponse> {
    const response = await this.http.get(`/${this.config.WA_BUSINESS_ACCOUNT_ID}/analytics`, {
      baseURL: `${this.config.WA_BASE_URL}${this.config.WA_VERSION}`,
      params
    });
    return response.data;
  }
}
