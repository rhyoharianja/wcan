import { BaseService } from './BaseService.js';

export interface PhoneNumberResponse {
  data: Array<{
    verified_name: string;
    display_phone_number: string;
    id: string;
    quality_rating: string;
  }>;
}

export interface MigrationOptions {
  backup: {
    data: string;
    password: string;
  };
}

export class PhoneNumberService extends BaseService {
  /**
   * Register Phone Number
   * 
   * @param pin - A 6-digit pin for two-step verification.
   * @param migrationOptions - Optional parameters for migrating from On-Premises API.
   */
  async register(pin: string, migrationOptions?: MigrationOptions): Promise<{ success: boolean }> {
    const payload: any = {
      messaging_product: 'whatsapp',
      pin
    };

    if (migrationOptions) {
      payload.backup = migrationOptions.backup;
    }

    const response = await this.http.post('/register', payload);
    return response.data;
  }

  /**
   * Deregister Phone Number
   */
  async deregister(): Promise<{ success: boolean }> {
    const response = await this.http.post('/deregister', {
      messaging_product: 'whatsapp'
    });
    return response.data;
  }

  /**
   * Get Phone Number ID and Status
   * Note: This usually requires WABA ID, but we can try to query the phone number node directly if we have the ID.
   * However, the Postman collection shows getting phone numbers from WABA.
   * Since BaseService is scoped to Phone Number ID, we might need a WABA-scoped service for listing numbers.
   * But for "Get Phone Number" details of the CURRENT ID, we can query the node.
   */
  async getMyPhoneNumber(): Promise<any> {
    // This endpoint returns details about the specific phone number ID
    const response = await this.http.get('/');
    return response.data;
  }
}
