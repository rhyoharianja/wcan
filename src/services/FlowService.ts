import { BaseService } from './BaseService.js';

export interface Flow {
  id: string;
  name: string;
  status: 'DRAFT' | 'PUBLISHED' | 'DEPRECATED';
  categories: string[];
}

export class FlowService extends BaseService {
  /**
   * Create a Flow
   */
  async createFlow(name: string, categories: string[]): Promise<{ id: string }> {
    const response = await this.http.post(`/${this.config.WA_BUSINESS_ACCOUNT_ID}/flows`, {
      name,
      categories
    }, {
      baseURL: `${this.config.WA_BASE_URL}${this.config.WA_VERSION}`
    });
    return response.data;
  }

  /**
   * Get List of Flows
   */
  async getFlows(): Promise<{ data: Flow[] }> {
    const response = await this.http.get(`/${this.config.WA_BUSINESS_ACCOUNT_ID}/flows`, {
      baseURL: `${this.config.WA_BASE_URL}${this.config.WA_VERSION}`
    });
    return response.data;
  }

  /**
   * Publish a Flow
   */
  async publishFlow(flowId: string): Promise<{ success: boolean }> {
    const response = await this.http.post(`/${flowId}/publish`, {}, {
      baseURL: `${this.config.WA_BASE_URL}${this.config.WA_VERSION}`
    });
    return response.data;
  }

  /**
   * Update Flow JSON
   */
  async updateFlowJson(flowId: string, json: any): Promise<{ success: boolean }> {
    // This typically requires uploading a file or sending JSON structure
    // Simplified implementation for JSON payload
    // Note: The actual API might require file upload for large flows
    const response = await this.http.post(`/${flowId}/assets`, {
      name: 'flow.json',
      asset_type: 'FLOW_JSON',
      file: json // If API accepts direct JSON, otherwise needs file upload logic similar to MediaService
    }, {
      baseURL: `${this.config.WA_BASE_URL}${this.config.WA_VERSION}`
    });
    return response.data;
  }
}
