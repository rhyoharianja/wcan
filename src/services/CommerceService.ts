import { BaseService } from './BaseService.js';

export class CommerceService extends BaseService {
  /**
   * Get Catalogs associated with the WABA
   */
  async getCatalogs(): Promise<any> {
    const response = await this.http.get(`/${this.config.WA_BUSINESS_ACCOUNT_ID}/owned_product_catalogs`, {
      baseURL: `${this.config.WA_BASE_URL}${this.config.WA_VERSION}`
    });
    return response.data;
  }

  /**
   * Send a Product Message (Single Product)
   * This is actually a message type, but we can expose a helper here or rely on MessageService.
   * Let's keep it in MessageService as 'interactive' type, but maybe add a helper here?
   * No, better to keep message sending in MessageService.
   * This service will focus on Catalog management if API allows, but usually Catalog mgmt is done via Commerce Manager API, not WhatsApp API directly.
   * However, we can list catalogs.
   */
}
