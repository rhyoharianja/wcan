# WhatsApp Cloud API Node.js SDK (WCAN)

A production-grade, type-safe Node.js SDK for the WhatsApp Cloud API (v2025), built with TypeScript.

## Features

- **Type-Safe**: Strict TypeScript definitions for all payloads and responses.
- **Secure**: Environment variable validation and HMAC signature verification.
- **Modular**: Domain-driven service architecture.
- **Modern**: ESM and CJS support, Node.js v24+ optimized.

## Installation

```bash
npm install wcan
# or
yarn add wcan
# or
pnpm add wcan
```

## Configuration

Create a `.env` file in your project root:

```env
WA_ACCESS_TOKEN=your_system_user_access_token
WA_PHONE_NUMBER_ID=your_phone_number_id
WA_BUSINESS_ACCOUNT_ID=your_waba_id
WA_VERSION=v24.0
WA_APP_SECRET=your_app_secret
WA_VERIFY_TOKEN=your_verify_token
WA_BASE_URL=https://graph.facebook.com/
```

## Usage

### Initialization

```typescript
import { WhatsAppClient } from 'wcan';

// Config is automatically loaded from .env
const client = new WhatsAppClient();

// Or pass config manually
// const client = new WhatsAppClient({ WA_ACCESS_TOKEN: '...' });
```

### Sending Messages

#### Send Text Message
```typescript
await client.messages.sendText('15550234567', 'Hello World');
// With preview URL
await client.messages.sendText('15550234567', 'Check this out: https://example.com', true);
```

#### Send Media Messages
```typescript
// Image
await client.messages.sendImage('15550234567', 'https://example.com/image.png', 'Caption here');

// Document
await client.messages.sendDocument('15550234567', 'https://example.com/doc.pdf', 'My Doc', 'file.pdf');

// Audio
await client.messages.sendAudio('15550234567', 'https://example.com/audio.mp3');

// Video
await client.messages.sendVideo('15550234567', 'https://example.com/video.mp4', 'Watch this');

// Sticker
await client.messages.sendSticker('15550234567', 'https://example.com/sticker.webp');
```

#### Send Location
```typescript
await client.messages.sendLocation('15550234567', {
  latitude: 37.4847,
  longitude: -122.1477,
  name: 'Meta HQ',
  address: '1 Hacker Way'
});
```

#### Send Contacts
```typescript
await client.messages.sendContacts('15550234567', [
  {
    name: { formatted_name: 'John Doe', first_name: 'John' },
    phones: [{ phone: '+1234567890' }]
  }
]);
```

#### Send Interactive Messages
```typescript
// Reply Buttons
await client.messages.sendInteractive('15550234567', {
  type: 'button',
  body: { text: 'Choose an option' },
  action: {
    buttons: [
      { type: 'reply', reply: { id: 'yes', title: 'Yes' } },
      { type: 'reply', reply: { id: 'no', title: 'No' } }
    ]
  }
});

// List Message
await client.messages.sendInteractive('15550234567', {
  type: 'list',
  body: { text: 'Select a product' },
  action: {
    button: 'View List',
    sections: [
      {
        title: 'Section 1',
        rows: [
          { id: 'p1', title: 'Product 1', description: 'Description 1' }
        ]
      }
    ]
  }
});
```

#### Send Template
```typescript
await client.messages.sendTemplate('15550234567', 'hello_world', 'en_US');

// With components
await client.messages.sendTemplate('15550234567', 'otp_code', 'en_US', [
  {
    type: 'BODY',
    parameters: [
      { type: 'text', text: '123456' }
    ]
  }
]);
```

#### Send Reaction
```typescript
await client.messages.sendReaction('15550234567', 'wamid.HBgM...', '👍');
```

### Media Management

#### Upload Media
```typescript
const { id } = await client.media.uploadMedia('/path/to/image.png');
console.log('Uploaded Media ID:', id);
```

#### Download Media
```typescript
const { url } = await client.media.getMediaUrl('1234567890');
const buffer = await client.media.downloadMedia(url);
fs.writeFileSync('downloaded.png', buffer);
```

### Webhooks

#### Verify Webhook (GET)
Use this in your Express/Fastify route handler for the verification challenge.

```typescript
app.get('/webhook', (req, res) => {
  try {
    const challenge = client.webhooks.verifyGetRequest(req.query);
    res.send(challenge);
  } catch (error) {
    res.status(403).send();
  }
});
```

#### Validate Signature (POST)
**Critical**: You must use the raw request body buffer for validation.

```typescript
app.post('/webhook', (req, res) => {
  // Assuming you have the raw body buffer (e.g., using body-parser verify callback)
  const signature = req.headers['x-hub-signature-256'];
  const isValid = client.webhooks.validateSignature(req.rawBody, signature);

  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }

  // Process event...
});
```

### Business Profile

```typescript
// Get Profile
const profile = await client.profile.getProfile();

// Update Profile
await client.profile.updateProfile({
  about: 'We are a great company',
  address: '123 Main St',
  email: 'contact@example.com',
  websites: ['https://example.com'],
  vertical: 'RETAIL'
});
```

### Phone Number Management
Register or deregister a phone number.

```typescript
// Register a phone number with a PIN
await client.phoneNumber.register('123456');

// Deregister a phone number
await client.phoneNumber.deregister();

// Get current phone number details
const myPhone = await client.phoneNumber.getMyPhoneNumber();
console.log(myPhone);
```

### Migrating from On-Premises API
If you are migrating from the On-Premises API, you can provide the backup data during registration.

```typescript
await client.phoneNumber.register('123456', {
  backup: {
    data: 'YOUR_BACKUP_DATA_STRING',
    password: 'YOUR_BACKUP_PASSWORD'
  }
});
```

### Business Account (WABA)

```typescript
// Get WABA Details
const waba = await client.business.getWABAInfo();

// Get All Phone Numbers attached to WABA
const numbers = await client.business.getPhoneNumbers();
```

### QR Codes

```typescript
// Create QR Code
const qr = await client.qrCodes.createQRCode('Hello, I am interested in your product');
console.log('QR Image URL:', qr.qr_image_url);

// List QR Codes
const list = await client.qrCodes.getQRCodes();

// Update QR Code
await client.qrCodes.updateQRCode('qr_code_id', 'New prefilled message');

// Delete QR Code
await client.qrCodes.deleteQRCode('qr_code_id');
```

### Templates

```typescript
// Get Templates
const templates = await client.templates.getTemplates();

// Create Template
await client.templates.createTemplate({
  name: 'new_template',
  category: 'MARKETING',
  language: 'en_US',
  components: [
    { type: 'BODY', parameters: [{ type: 'text', text: 'Hello {{1}}' }] }
  ]
});

// Delete Template
await client.templates.deleteTemplate('new_template');
```

### Analytics

```typescript
// Get Analytics
const stats = await client.analytics.getAnalytics({
  start: 1672531200,
  end: 1675123200,
  granularity: 'DAILY'
});
```

### Webhook Subscriptions

```typescript
// Subscribe App
await client.subscriptions.subscribeToWABA();

// Unsubscribe App
await client.subscriptions.unsubscribeFromWABA();

// List Subscribed Apps
const apps = await client.subscriptions.getSubscribedApps();
```

### User Management

```typescript
// Block User
await client.users.blockUser('15550234567');

// Unblock User
await client.users.unblockUser('15550234567');

// Get Block List
const blocked = await client.users.getBlockList();
```

### Flows

```typescript
// Create Flow
const flow = await client.flows.createFlow('My Flow', ['SIGN_UP']);

// Publish Flow
await client.flows.publishFlow(flow.id);

// List Flows
const flows = await client.flows.getFlows();

// Update Flow JSON
await client.flows.updateFlowJson(flow.id, {
  version: '3.0',
  screens: [
    {
      id: 'WELCOME_SCREEN',
      title: 'Welcome',
      data: {},
      layout: {
        type: 'SingleColumnLayout',
        children: [
          {
            type: 'Text',
            label: 'Hello Flow!'
          }
        ]
      }
    }
  ]
});
```

### Commerce

```typescript
// Get Catalogs
const catalogs = await client.commerce.getCatalogs();
```

## Error Handling

The SDK throws typed `WhatsAppAPIError` objects.

```typescript
import { WhatsAppAPIError } from 'wcan';

try {
  await client.messages.sendText('...', '...');
} catch (error) {
  if (error instanceof WhatsAppAPIError) {
    console.error(`API Error ${error.code}: ${error.message}`);
    if (error.code === 130429) {
      // Handle rate limit
    }
  }
}
```

## License

ISC

## Payload Reference

### Sending Messages (Request Payloads)

The following JSON structures represent the raw payloads sent to the WhatsApp Cloud API by the SDK.

#### Text Message
```json
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "PHONE_NUMBER",
  "type": "text",
  "text": {
    "preview_url": false,
    "body": "text-message-content"
  }
}
```

#### Media Message (Image, Audio, Video, Document, Sticker)
```json
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "PHONE_NUMBER",
  "type": "image", // or audio, video, document, sticker
  "image": {
    "link": "https://image-url", // or "id": "MEDIA_ID"
    "caption": "Optional caption" // Supported for image, video, document
  }
}
```

#### Location Message
```json
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "PHONE_NUMBER",
  "type": "location",
  "location": {
    "latitude": "37.758056",
    "longitude": "-122.425332",
    "name": "META HQ",
    "address": "1 Hacker Way, Menlo Park, CA 94025"
  }
}
```

#### Contacts Message
```json
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "PHONE_NUMBER",
  "type": "contacts",
  "contacts": [
    {
      "name": {
        "formatted_name": "John Doe",
        "first_name": "John"
      },
      "phones": [
        {
          "phone": "+1234567890",
          "type": "WORK"
        }
      ]
    }
  ]
}
```

#### Interactive Message (List)
```json
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "PHONE_NUMBER",
  "type": "interactive",
  "interactive": {
    "type": "list",
    "header": { "type": "text", "text": "Header" },
    "body": { "text": "Body" },
    "footer": { "text": "Footer" },
    "action": {
      "button": "Button Label",
      "sections": [
        {
          "title": "Section 1",
          "rows": [
            { "id": "row1", "title": "Row 1", "description": "Description" }
          ]
        }
      ]
    }
  }
}
```

#### Interactive Message (Reply Button)
```json
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "PHONE_NUMBER",
  "type": "interactive",
  "interactive": {
    "type": "button",
    "body": { "text": "Body" },
    "action": {
      "buttons": [
        {
          "type": "reply",
          "reply": { "id": "btn1", "title": "Button 1" }
        }
      ]
    }
  }
}
```

#### Template Message
```json
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "PHONE_NUMBER",
  "type": "template",
  "template": {
    "name": "template_name",
    "language": { "code": "en_US" },
    "components": [
      {
        "type": "body",
        "parameters": [
          { "type": "text", "text": "Variable 1" }
        ]
      }
    ]
  }
}
```

#### Reaction Message
```json
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "PHONE_NUMBER",
  "type": "reaction",
  "reaction": {
    "message_id": "wamid.ID",
    "emoji": "👍"
  }
}
```

### Webhook Events (Incoming Payloads)

The following JSON structures represent the `value` object found in `entry[0].changes[0].value` of the webhook payload.

#### Text Message
```json
{
  "messaging_product": "whatsapp",
  "metadata": { "display_phone_number": "...", "phone_number_id": "..." },
  "contacts": [{ "profile": { "name": "..." }, "wa_id": "..." }],
  "messages": [
    {
      "from": "PHONE_NUMBER",
      "id": "wamid.ID",
      "timestamp": "TIMESTAMP",
      "type": "text",
      "text": {
        "body": "Message content"
      }
    }
  ]
}
```

#### Media Message (Image, Audio, Video, Sticker, Document)
```json
{
  "messages": [
    {
      "from": "PHONE_NUMBER",
      "id": "wamid.ID",
      "timestamp": "TIMESTAMP",
      "type": "image", // or audio, video, sticker, document
      "image": {
        "mime_type": "image/jpeg",
        "sha256": "...",
        "id": "MEDIA_ID",
        "caption": "Optional caption"
      }
    }
  ]
}
```

#### Location Message
```json
{
  "messages": [
    {
      "from": "PHONE_NUMBER",
      "id": "wamid.ID",
      "timestamp": "TIMESTAMP",
      "type": "location",
      "location": {
        "latitude": 37.758056,
        "longitude": -122.425332,
        "name": "Meta HQ",
        "address": "1 Hacker Way"
      }
    }
  ]
}
```

#### Contact Message
```json
{
  "messages": [
    {
      "from": "PHONE_NUMBER",
      "id": "wamid.ID",
      "timestamp": "TIMESTAMP",
      "type": "contacts",
      "contacts": [
        {
          "name": { "first_name": "John", "formatted_name": "John Doe" },
          "phones": [{ "phone": "+1234567890", "type": "WORK" }]
        }
      ]
    }
  ]
}
```

#### Interactive Reply (Button/List)
```json
{
  "messages": [
    {
      "from": "PHONE_NUMBER",
      "id": "wamid.ID",
      "timestamp": "TIMESTAMP",
      "type": "interactive",
      "interactive": {
        "type": "button_reply", // or list_reply
        "button_reply": {
          "id": "unique-button-id",
          "title": "Button Title"
        },
        "list_reply": {
          "id": "unique-row-id",
          "title": "Row Title",
          "description": "Row Description"
        }
      }
    }
  ]
}
```

#### Reaction Event
```json
{
  "messages": [
    {
      "from": "PHONE_NUMBER",
      "id": "wamid.ID",
      "timestamp": "TIMESTAMP",
      "type": "reaction",
      "reaction": {
        "message_id": "wamid.TARGET_MSG_ID",
        "emoji": "👍"
      }
    }
  ]
}
```

#### Message Status Update
```json
{
  "statuses": [
    {
      "id": "wamid.ID",
      "status": "sent", // delivered, read, failed
      "timestamp": "TIMESTAMP",
      "recipient_id": "PHONE_NUMBER",
      "conversation": {
        "id": "CONVERSATION_ID",
        "origin": { "type": "user_initiated" }
      },
      "pricing": {
        "billable": true,
        "pricing_model": "CBP",
        "category": "user_initiated"
      }
    }
  ]
}
```
