import { BaseService } from './BaseService.js';

export class BusinessAccountService extends BaseService {
  /**
   * Get WABA Details
   * This requires querying the WABA ID, not the Phone Number ID.
   * We'll override the URL.
   */
  async getWABAInfo(): Promise<any> {
    const response = await this.http.get(`/${this.config.WA_BUSINESS_ACCOUNT_ID}`, {
      baseURL: `${this.config.WA_BASE_URL}${this.config.WA_VERSION}`
    });
    return response.data;
  }

  /**
   * Get Phone Numbers attached to this WABA
   */
  async getPhoneNumbers(): Promise<any> {
    const response = await this.http.get(`/${this.config.WA_BUSINESS_ACCOUNT_ID}/phone_numbers`, {
      baseURL: `${this.config.WA_BASE_URL}${this.config.WA_VERSION}`
    });
    return response.data;
  }
}
