import { BaseService } from './BaseService.js';

export interface BusinessProfile {
  about?: string;
  address?: string;
  description?: string;
  email?: string;
  profile_picture_url?: string;
  websites?: string[];
  vertical?: string;
}

export interface BusinessProfileResponse {
  data: BusinessProfile[];
}

export class BusinessProfileService extends BaseService {
  /**
   * Get Business Profile
   */
  async getProfile(fields?: string[]): Promise<BusinessProfileResponse> {
    const defaultFields = ['about', 'address', 'description', 'email', 'profile_picture_url', 'websites', 'vertical'];
    const fieldsParam = (fields || defaultFields).join(',');

    const response = await this.http.get<BusinessProfileResponse>('/whatsapp_business_profile', {
      params: { fields: fieldsParam }
    });
    return response.data;
  }

  /**
   * Update Business Profile
   */
  async updateProfile(profile: BusinessProfile): Promise<{ success: boolean }> {
    const payload = {
      messaging_product: 'whatsapp',
      ...profile
    };

    const response = await this.http.post('/whatsapp_business_profile', payload);
    return response.data;
  }
}
