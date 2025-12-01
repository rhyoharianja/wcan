import { BaseService } from './BaseService.js';
import FormData from 'form-data';
import fs from 'fs';

export interface MediaUploadResponse {
  id: string;
}

export interface MediaUrlResponse {
  url: string;
  mime_type: string;
  sha256: string;
  file_size: number;
  id: string;
  messaging_product: string;
}

export class MediaService extends BaseService {
  /**
   * Upload media to WhatsApp Cloud API
   * @param filePath Absolute path to the file
   */
  async uploadMedia(filePath: string): Promise<MediaUploadResponse> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found at path: ${filePath}`);
    }

    const form = new FormData();
    form.append('messaging_product', 'whatsapp');
    form.append('file', fs.createReadStream(filePath));

    const response = await this.http.post(`/${this.config.WA_PHONE_NUMBER_ID}/media`, form, {
      headers: {
        ...form.getHeaders(),
      },
    });
    return response.data;
  }

  /**
   * Get the URL for a media ID
   */
  async getMediaUrl(mediaId: string): Promise<MediaUrlResponse> {
    // Note: This endpoint is at the root version level, not under phone number ID
    // But BaseService baseURL includes phone number ID.
    // We need to override the baseURL or use a relative path that goes up?
    // Actually, GET /<MEDIA_ID> is at the root graph level usually: https://graph.facebook.com/v24.0/<MEDIA_ID>
    // My BaseService baseURL is https://graph.facebook.com/v24.0/<PHONE_ID>
    // So I should use `../${mediaId}` or create a new request.
    // Or better, just use the absolute URL construction.

    // Let's use a cleaner approach: override baseURL in the request config
    const response = await this.http.get(`/${mediaId}`, {
      baseURL: `https://graph.facebook.com/${this.config.WA_VERSION}`
    });
    return response.data;
  }

  /**
   * Download media binary from a URL
   */
  async downloadMedia(url: string): Promise<Buffer> {
    // The URL provided by getMediaUrl is a full URL.
    // We need to send the Authorization header.
    const response = await this.http.get(url, {
      responseType: 'arraybuffer',
    });
    return Buffer.from(response.data);
  }
}
