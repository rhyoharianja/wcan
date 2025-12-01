import { EnvConfig, getEnvConfig } from './config/env.config.js';
import { MessageService } from './services/MessageService.js';
import { MediaService } from './services/MediaService.js';
import { WebhookVerifier } from './webhooks/WebhookVerifier.js';
import { BusinessProfileService } from './services/BusinessProfileService.js';
import { PhoneNumberService } from './services/PhoneNumberService.js';
import { BusinessAccountService } from './services/BusinessAccountService.js';
import { QRCodeService } from './services/QRCodeService.js';
import { TemplateService } from './services/TemplateService.js';
import { AnalyticsService } from './services/AnalyticsService.js';
import { CommerceService } from './services/CommerceService.js';
import { WebhookSubscriptionService } from './services/WebhookSubscriptionService.js';
import { UserService } from './services/UserService.js';
import { FlowService } from './services/FlowService.js';

export class WhatsAppClient {
  public messages: MessageService;
  public media: MediaService;
  public webhooks: WebhookVerifier;
  public profile: BusinessProfileService;
  public phoneNumbers: PhoneNumberService;
  public business: BusinessAccountService;
  public qrCodes: QRCodeService;
  public templates: TemplateService;
  public analytics: AnalyticsService;
  public commerce: CommerceService;
  public subscriptions: WebhookSubscriptionService;
  public users: UserService;
  public flows: FlowService;
  private config: EnvConfig;

  constructor(config?: Partial<EnvConfig>) {
    // If config is fully provided, use it (after validation if we wanted, but let's assume it's correct or partial override)
    // If not, load from env.

    // Strategy: Load env config first, then override with passed config.
    // If env is missing vars, getEnvConfig throws.
    // If the user wants to rely PURELY on passed config and ignore env, this might be an issue if they don't have .env file.
    // But the blueprint emphasizes environment variables.

    // Let's try to load env, but catch error if config is provided.
    let envConfig: EnvConfig | Partial<EnvConfig> = {};
    try {
      envConfig = getEnvConfig();
    } catch (e) {
      // If env is invalid but user provided config, we might be okay if the merged result is valid.
      // But for now, let's assume env is primary as per blueprint.
      // However, to be flexible:
      if (!config) throw e;
    }

    this.config = { ...envConfig, ...config } as EnvConfig;

    // Final validation to ensure we have everything
    if (!this.config.WA_ACCESS_TOKEN || !this.config.WA_PHONE_NUMBER_ID) {
      throw new Error("Missing required configuration: WA_ACCESS_TOKEN or WA_PHONE_NUMBER_ID");
    }

    this.messages = new MessageService(this.config);
    this.media = new MediaService(this.config);
    this.webhooks = new WebhookVerifier(this.config);
    this.profile = new BusinessProfileService(this.config);
    this.phoneNumbers = new PhoneNumberService(this.config);
    this.business = new BusinessAccountService(this.config);
    this.qrCodes = new QRCodeService(this.config);
    this.templates = new TemplateService(this.config);
    this.analytics = new AnalyticsService(this.config);
    this.commerce = new CommerceService(this.config);
    this.subscriptions = new WebhookSubscriptionService(this.config);
    this.users = new UserService(this.config);
    this.flows = new FlowService(this.config);
  }
}
