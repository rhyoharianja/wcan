export class WhatsAppAPIError extends Error {
  public code: number;
  public subcode?: number;
  public type?: string;
  public traceId?: string;
  public errorData?: any;
  public userTitle?: string;
  public userMessage?: string;

  constructor(error: any) {
    const message = error.message || "Unknown WhatsApp API Error";
    super(message);
    this.name = "WhatsAppAPIError";
    this.code = error.code || 0;
    this.subcode = error.error_subcode;
    this.type = error.type;
    this.traceId = error.fbtrace_id;
    this.errorData = error.error_data;
    this.userTitle = error.error_user_title;
    this.userMessage = error.error_user_msg;
  }

  toString() {
    return `[WhatsAppAPIError] ${this.code}${this.subcode ? `:${this.subcode}` : ''} - ${this.message} (Trace: ${this.traceId})`;
  }
}
