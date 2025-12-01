import { BaseService } from './BaseService.js';

export class UserService extends BaseService {
  /**
   * Block a User
   */
  async blockUser(phoneNumber: string): Promise<{ success: boolean }> {
    const response = await this.http.post(`/${this.config.WA_PHONE_NUMBER_ID}/block`, {
      block_user: phoneNumber
    });
    return response.data;
  }

  /**
   * Unblock a User
   */
  async unblockUser(phoneNumber: string): Promise<{ success: boolean }> {
    const response = await this.http.post(`/${this.config.WA_PHONE_NUMBER_ID}/block`, {
      unblock_user: phoneNumber
    });
    return response.data;
  }

  /**
   * Get Block List
   */
  async getBlockList(): Promise<any> {
    const response = await this.http.get(`/${this.config.WA_PHONE_NUMBER_ID}/block`);
    return response.data;
  }
}
