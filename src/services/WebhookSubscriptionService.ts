import { BaseService } from './BaseService.js';

export class WebhookSubscriptionService extends BaseService {
  /**
   * Subscribe App to WABA Webhooks
   */
  async subscribeToWABA(): Promise<{ success: boolean }> {
    const response = await this.http.post(`/${this.config.WA_BUSINESS_ACCOUNT_ID}/subscribed_apps`, {}, {
      baseURL: `${this.config.WA_BASE_URL}${this.config.WA_VERSION}`
    });
    return response.data;
  }

  /**
   * Unsubscribe App from WABA Webhooks
   */
  async unsubscribeFromWABA(): Promise<{ success: boolean }> {
    const response = await this.http.delete(`/${this.config.WA_BUSINESS_ACCOUNT_ID}/subscribed_apps`, {
      baseURL: `${this.config.WA_BASE_URL}${this.config.WA_VERSION}`
    });
    return response.data;
  }

  /**
   * List Subscribed Apps
   */
  async getSubscribedApps(): Promise<any> {
    const response = await this.http.get(`/${this.config.WA_BUSINESS_ACCOUNT_ID}/subscribed_apps`, {
      baseURL: `${this.config.WA_BASE_URL}${this.config.WA_VERSION}`
    });
    return response.data;
  }
}
