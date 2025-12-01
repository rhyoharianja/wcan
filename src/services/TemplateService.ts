import { BaseService } from './BaseService.js';
import { TemplateComponent } from '../types/messages.js';

export interface Template {
  name: string;
  language: string;
  status: string;
  category: string;
  id: string;
  components: TemplateComponent[];
}

export interface TemplateListResponse {
  data: Template[];
  paging: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

export interface CreateTemplateRequest {
  name: string;
  category: 'AUTHENTICATION' | 'MARKETING' | 'UTILITY';
  allow_category_change?: boolean;
  language: string;
  components: TemplateComponent[];
}

export class TemplateService extends BaseService {
  /**
   * Get All Templates
   * Note: Templates are WABA-level resources, not Phone Number level.
   */
  async getTemplates(limit: number = 25): Promise<TemplateListResponse> {
    const response = await this.http.get(`/${this.config.WA_BUSINESS_ACCOUNT_ID}/message_templates`, {
      baseURL: `${this.config.WA_BASE_URL}${this.config.WA_VERSION}`,
      params: { limit }
    });
    return response.data;
  }

  /**
   * Create Template
   */
  async createTemplate(template: CreateTemplateRequest): Promise<{ id: string }> {
    const response = await this.http.post(`/${this.config.WA_BUSINESS_ACCOUNT_ID}/message_templates`, template, {
      baseURL: `https://graph.facebook.com/${this.config.WA_VERSION}`
    });
    return response.data;
  }

  /**
   * Delete Template
   */
  async deleteTemplate(name: string): Promise<{ success: boolean }> {
    // Deleting by name requires query param
    const response = await this.http.delete(`/${this.config.WA_BUSINESS_ACCOUNT_ID}/message_templates`, {
      baseURL: `${this.config.WA_BASE_URL}${this.config.WA_VERSION}`,
      params: { name }
    });
    return response.data;
  }
}
