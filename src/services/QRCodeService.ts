import { BaseService } from './BaseService.js';

export interface QRCodeResponse {
  code: string;
  prefilled_message: string;
  deep_link_url: string;
  qr_image_url: string;
}

export interface QRCodeListResponse {
  data: QRCodeResponse[];
}

export class QRCodeService extends BaseService {
  /**
   * Create a QR Code
   */
  async createQRCode(prefilledMessage: string, imageFormat: 'png' | 'svg' = 'png'): Promise<QRCodeResponse> {
    const response = await this.http.post<QRCodeResponse>('/message_qrdls', {
      prefilled_message: prefilledMessage,
      generate_qr_image: imageFormat
    });
    return response.data;
  }

  /**
   * Get List of QR Codes
   */
  async getQRCodes(): Promise<QRCodeListResponse> {
    const response = await this.http.get<QRCodeListResponse>('/message_qrdls');
    return response.data;
  }

  /**
   * Get a specific QR Code
   */
  async getQRCode(code: string): Promise<QRCodeResponse> {
    const response = await this.http.get<QRCodeResponse>(`/message_qrdls/${code}`);
    return response.data;
  }

  /**
   * Update a QR Code
   */
  async updateQRCode(code: string, prefilledMessage: string): Promise<QRCodeResponse> {
    const response = await this.http.post<QRCodeResponse>(`/message_qrdls/${code}`, {
      prefilled_message: prefilledMessage
    });
    return response.data;
  }

  /**
   * Delete a QR Code
   */
  async deleteQRCode(code: string): Promise<{ success: boolean }> {
    const response = await this.http.delete<{ success: boolean }>(`/message_qrdls/${code}`);
    return response.data;
  }
}
