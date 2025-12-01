import crypto from 'crypto';
import { EnvConfig } from '../config/env.config.js';

export class WebhookVerifier {
  constructor(private config: EnvConfig) { }

  /**
   * Handle the Webhook verification handshake (GET request)
   */
  verifyGetRequest(params: Record<string, any>): string {
    const mode = params['hub.mode'];
    const token = params['hub.verify_token'];
    const challenge = params['hub.challenge'];

    if (mode === 'subscribe' && token === this.config.WA_VERIFY_TOKEN) {
      if (!challenge) {
        throw new Error('Missing hub.challenge');
      }
      return challenge;
    }
    throw new Error('Webhook verification failed: Invalid token or mode');
  }

  /**
   * Validate the X-Hub-Signature-256 header (POST request)
   * @param payload Raw request body buffer
   * @param signature The X-Hub-Signature-256 header value
   */
  validateSignature(payload: Buffer, signature: string): boolean {
    if (!signature) return false;

    // Signature format: sha256=HASH
    const parts = signature.split('=');
    if (parts.length !== 2 || parts[0] !== 'sha256') {
      return false;
    }

    const signatureHash = parts[1];

    const hash = crypto
      .createHmac('sha256', this.config.WA_APP_SECRET)
      .update(payload)
      .digest('hex');

    const source = Buffer.from(signatureHash);
    const target = Buffer.from(hash);

    if (source.length !== target.length) {
      return false;
    }

    return crypto.timingSafeEqual(source, target);
  }
}
