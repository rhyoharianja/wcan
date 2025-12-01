import { BaseService } from './BaseService.js';
import {
  MessagePayload,
  MessageResponse,
  TemplateComponent,
  InteractiveObject,
  LocationObject,
  ContactObject
} from '../types/messages.js';

export class MessageService extends BaseService {
  /**
   * Generic method to send any message payload
   */
  async sendMessage(payload: MessagePayload): Promise<MessageResponse> {
    const response = await this.http.post<MessageResponse>('/messages', payload);
    return response.data;
  }

  /**
   * Send a text message
   */
  async sendText(to: string, body: string, previewUrl: boolean = false): Promise<MessageResponse> {
    return this.sendMessage({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: { body, preview_url: previewUrl }
    });
  }

  /**
   * Send an image message
   */
  async sendImage(to: string, mediaIdOrUrl: string, caption?: string): Promise<MessageResponse> {
    const mediaObj = mediaIdOrUrl.startsWith('http') ? { link: mediaIdOrUrl } : { id: mediaIdOrUrl };
    if (caption) Object.assign(mediaObj, { caption });

    return this.sendMessage({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'image',
      image: mediaObj
    });
  }

  /**
   * Send a document message
   */
  async sendDocument(to: string, mediaIdOrUrl: string, caption?: string, filename?: string): Promise<MessageResponse> {
    const mediaObj = mediaIdOrUrl.startsWith('http') ? { link: mediaIdOrUrl } : { id: mediaIdOrUrl };
    if (caption) Object.assign(mediaObj, { caption });
    if (filename) Object.assign(mediaObj, { filename });

    return this.sendMessage({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'document',
      document: mediaObj
    });
  }

  /**
   * Send an audio message
   */
  async sendAudio(to: string, mediaIdOrUrl: string): Promise<MessageResponse> {
    const mediaObj = mediaIdOrUrl.startsWith('http') ? { link: mediaIdOrUrl } : { id: mediaIdOrUrl };

    return this.sendMessage({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'audio',
      audio: mediaObj
    });
  }

  /**
   * Send a video message
   */
  async sendVideo(to: string, mediaIdOrUrl: string, caption?: string): Promise<MessageResponse> {
    const mediaObj = mediaIdOrUrl.startsWith('http') ? { link: mediaIdOrUrl } : { id: mediaIdOrUrl };
    if (caption) Object.assign(mediaObj, { caption });

    return this.sendMessage({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'video',
      video: mediaObj
    });
  }

  /**
   * Send a sticker message
   */
  async sendSticker(to: string, mediaIdOrUrl: string): Promise<MessageResponse> {
    const mediaObj = mediaIdOrUrl.startsWith('http') ? { link: mediaIdOrUrl } : { id: mediaIdOrUrl };

    return this.sendMessage({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'sticker',
      sticker: mediaObj
    });
  }

  /**
   * Send a location message
   */
  async sendLocation(to: string, location: LocationObject): Promise<MessageResponse> {
    return this.sendMessage({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'location',
      location
    });
  }

  /**
   * Send a contact message
   */
  async sendContacts(to: string, contacts: ContactObject[]): Promise<MessageResponse> {
    return this.sendMessage({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'contacts',
      contacts
    });
  }

  /**
   * Send a template message
   */
  async sendTemplate(
    to: string,
    templateName: string,
    languageCode: string,
    components: TemplateComponent[] = []
  ): Promise<MessageResponse> {
    const template: any = {
      name: templateName,
      language: { code: languageCode }
    };
    if (components.length > 0) {
      template.components = components;
    }

    return this.sendMessage({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'template',
      template
    });
  }

  /**
   * Send an interactive message
   */
  async sendInteractive(to: string, interactive: InteractiveObject): Promise<MessageResponse> {
    return this.sendMessage({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'interactive',
      interactive
    });
  }

  /**
   * React to a message
   */
  async sendReaction(to: string, messageId: string, emoji: string): Promise<MessageResponse> {
    return this.sendMessage({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'reaction',
      reaction: {
        message_id: messageId,
        emoji
      }
    });
  }
}
