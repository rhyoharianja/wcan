export type MessageType = 'text' | 'image' | 'audio' | 'document' | 'video' | 'sticker' | 'location' | 'contacts' | 'interactive' | 'template' | 'reaction';

export interface BaseMessage {
  messaging_product: 'whatsapp';
  recipient_type?: 'individual';
  to: string;
  type?: MessageType;
  context?: {
    message_id: string;
  };
}

export interface TextObject {
  preview_url?: boolean;
  body: string;
}

export interface MediaObject {
  id?: string;
  link?: string;
  caption?: string;
  filename?: string; // For documents
  provider?: string; // For stickers
}

export interface LocationObject {
  longitude: number;
  latitude: number;
  name?: string;
  address?: string;
}

export interface ContactObject {
  addresses?: Array<{
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    country_code?: string;
    type?: string;
  }>;
  birthday?: string;
  emails?: Array<{
    email?: string;
    type?: string;
  }>;
  name: {
    formatted_name: string;
    first_name?: string;
    last_name?: string;
    middle_name?: string;
    suffix?: string;
    prefix?: string;
  };
  org?: {
    company?: string;
    department?: string;
    title?: string;
  };
  phones?: Array<{
    phone?: string;
    type?: string;
    wa_id?: string;
  }>;
  urls?: Array<{
    url?: string;
    type?: string;
  }>;
}

export interface ReactionObject {
  message_id: string;
  emoji: string;
}

// Template Types
export type TemplateComponentType = 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTON';

export interface TemplateParameter {
  type: 'text' | 'currency' | 'date_time' | 'image' | 'document' | 'video' | 'payload';
  text?: string;
  currency?: {
    fallback_value: string;
    code: string;
    amount_1000: number;
  };
  date_time?: {
    fallback_value: string;
  };
  image?: MediaObject;
  document?: MediaObject;
  video?: MediaObject;
  payload?: string; // For button payloads
}

export interface TemplateComponent {
  type: TemplateComponentType;
  sub_type?: 'url' | 'quick_reply'; // For buttons
  index?: string; // For buttons
  parameters: TemplateParameter[];
}

export interface TemplateObject {
  name: string;
  language: {
    code: string;
  };
  components?: TemplateComponent[];
}

// Interactive Types
export type InteractiveType = 'button' | 'list' | 'product' | 'product_list' | 'flow';

export interface InteractiveAction {
  button?: string;
  buttons?: Array<{
    type: 'reply';
    reply: {
      id: string;
      title: string;
    };
  }>;
  sections?: Array<{
    title?: string;
    rows: Array<{
      id: string;
      title: string;
      description?: string;
    }>;
  }>;
  catalog_id?: string;
  product_retailer_id?: string;
}

export interface InteractiveObject {
  type: InteractiveType;
  header?: {
    type: 'text' | 'video' | 'image' | 'document';
    text?: string;
    video?: MediaObject;
    image?: MediaObject;
    document?: MediaObject;
  };
  body: {
    text: string;
  };
  footer?: {
    text: string;
  };
  action: InteractiveAction;
}

// Union Type for Payloads
export interface TextMessagePayload extends BaseMessage {
  type: 'text';
  text: TextObject;
}

export interface MediaMessagePayload extends BaseMessage {
  type: 'image' | 'audio' | 'document' | 'video' | 'sticker';
  image?: MediaObject;
  audio?: MediaObject;
  document?: MediaObject;
  video?: MediaObject;
  sticker?: MediaObject;
}

export interface LocationMessagePayload extends BaseMessage {
  type: 'location';
  location: LocationObject;
}

export interface ContactMessagePayload extends BaseMessage {
  type: 'contacts';
  contacts: ContactObject[];
}

export interface TemplateMessagePayload extends BaseMessage {
  type: 'template';
  template: TemplateObject;
}

export interface InteractiveMessagePayload extends BaseMessage {
  type: 'interactive';
  interactive: InteractiveObject;
}

export interface ReactionMessagePayload extends BaseMessage {
  type: 'reaction';
  reaction: ReactionObject;
}

export type MessagePayload =
  | TextMessagePayload
  | MediaMessagePayload
  | LocationMessagePayload
  | ContactMessagePayload
  | TemplateMessagePayload
  | InteractiveMessagePayload
  | ReactionMessagePayload;

export interface MessageResponse {
  messaging_product: 'whatsapp';
  contacts: Array<{
    input: string;
    wa_id: string;
  }>;
  messages: Array<{
    id: string;
  }>;
}
