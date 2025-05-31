# 📧 Leadmark Processor - Email Processing Backend

> **Postmark Integration Engine**: Handles inbound email parsing and AI-powered response generation

## 🎯 Purpose

The processor service is the backend engine that:
- Receives Postmark webhook events for inbound emails
- Processes emails through AI for intelligent responses
- Manages calendar integration for meeting scheduling
- Handles document processing and business context
- Sends automated responses via Postmark's outbound API

## 🏗️ Architecture

```
📧 Postmark Webhook → 🔄 Express API → 📋 BullMQ Jobs → 🧠 AI Processing → 📤 Email Response
                                           ↓
                                    💾 Supabase Database
```

## 🚀 Key Features

### Postmark Integration
- **Inbound Processing**: Webhook endpoint for Postmark email events
- **Message Parsing**: Extract headers, body, attachments, and metadata
- **Response Sending**: Professional email responses via Postmark API
- **Error Handling**: Robust webhook validation and retry mechanisms

### AI-Powered Responses
- **GPT-4 Integration**: Contextual response generation
- **Business Context**: Uses uploaded documents and conversation history
- **Custom Personas**: AI assistants with specific business roles
- **Meeting Detection**: Intelligent calendar scheduling requests

### Background Processing
- **BullMQ Jobs**: Async email processing for scalability
- **Job Queues**: Separate queues for validation, preprocessing, and dispatch
- **Error Recovery**: Automatic retry with exponential backoff
- **Monitoring**: Job status tracking and performance metrics

## 📁 Project Structure

```
processor/
├── src/
│   ├── api/
│   │   ├── index.ts          # API routes setup
│   │   ├── postman.ts        # Postmark webhook handler
│   │   └── emojis.ts         # Health check endpoint
│   │
│   ├── services/
│   │   ├── postman/          # Email processing services
│   │   │   ├── consumer/     # BullMQ job consumers
│   │   │   ├── header.ts     # Email header processing
│   │   │   ├── body.ts       # Email body parsing
│   │   │   └── helpers.ts    # Utility functions
│   │   │
│   │   ├── calendar/         # Google Calendar integration
│   │   │   ├── google-calendar.ts
│   │   │   └── meeting-detection.ts
│   │   │
│   │   ├── resources/        # Document processing
│   │   │   ├── openai/       # AI integration
│   │   │   └── handlers.ts   # File processing
│   │   │
│   │   └── supabase/         # Database operations
│   │       ├── client.ts     # Supabase client
│   │       └── base/         # Database models
│   │
│   ├── events/               # Event system (BullMQ)
│   │   ├── bullmq.ts        # Queue configuration
│   │   ├── producer.ts      # Job producers
│   │   └── consumer.ts      # Job consumers
│   │
│   ├── interfaces/           # TypeScript interfaces
│   ├── middlewares.ts        # Express middlewares
│   ├── constants.ts          # Application constants
│   ├── secrets.ts           # Environment variables
│   └── index.ts             # Application entry point
│
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Environment Setup

Create `.env` file:
```env
# Postmark Configuration
POSTMARK_API_KEY=your_postmark_server_token

# Database
DATABASE_URL=your_supabase_database_url
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Redis (for BullMQ)
REDIS_URL=redis://localhost:6379

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Google Calendar (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Application
NODE_ENV=development
PORT=3001
```

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## 📡 API Endpoints

### Postmark Webhook
```
POST /api/postman
Content-Type: application/json

# Receives Postmark inbound email webhooks
# Validates mailbox ownership
# Queues email for AI processing
```

### Health Check
```
GET /api/emojis
# Returns server status and emoji
```

## 🔄 Email Processing Flow

### 1. Webhook Reception
```typescript
// Receive Postmark webhook
const input = req.body as InboundMessageDetails;

// Validate mailbox exists
const mailboxWithOwner = await _validateMailbox(input.To);

// Queue for processing
await postmanEventProducerMQ.postman(input);
```

### 2. Background Processing
```typescript
// Extract email content
const messageText = input.TextBody || input.HtmlBody;

// Generate AI response
const { aiResponse, aiResponseToHtml } = await getAIResponse({
  thread, messageText, mailbox, contact, attachmentResourceIds, full_name
});

// Send response via Postmark
await postmark.sendEmail({
  From: `${owner.full_name} <${mailbox.unique_address}@${mailbox.dotcom}>`,
  To: input.FromFull.Email,
  Subject: subject,
  HtmlBody: aiResponseToHtml,
  TextBody: aiResponse,
});
```

### 3. Database Updates
```typescript
// Store inbound message
await insertMessage([{
  thread_id: thread?.id,
  html_content: input.HtmlBody,
  content: messageText,
  direction: "inbound"
}]);

// Store AI response
await storeOutboundMessage({
  thread, aiResponse, aiResponseToHtml, headers, recipients, subject
});
```

## 🧠 AI Integration

### Response Generation
- **Context Awareness**: Uses conversation history and business documents
- **Custom Objectives**: AI follows specific business goals and persona
- **Meeting Detection**: Identifies scheduling requests automatically
- **Professional Tone**: Maintains consistent brand voice

### Document Processing
- **PDF Parsing**: Extracts text from PDF attachments
- **Word Documents**: Processes DOCX files for business context
- **AI Summarization**: Creates business summaries from uploaded resources
- **Context Integration**: Uses document content in email responses

## 📅 Calendar Integration

### Meeting Scheduling
- **Availability Checking**: Queries Google Calendar for free slots
- **Automatic Booking**: Creates calendar events when time is confirmed
- **Conflict Prevention**: Prevents double-booking scenarios
- **Invitation Sending**: Automated calendar invites via email

### Time Detection
- **Natural Language**: Parses "next Tuesday at 2pm" style requests
- **Time Zone Handling**: Supports multiple time zones
- **Duration Estimation**: Suggests appropriate meeting lengths
- **Follow-up Management**: Tracks meeting confirmations

## 🔧 Development

### Adding New Features
1. Create service in appropriate `/services/` directory
2. Add TypeScript interfaces in `/interfaces/`
3. Implement BullMQ job if async processing needed
4. Add error handling and logging
5. Update API routes if external access required

### Testing Webhooks Locally
1. Use ngrok to expose local server: `ngrok http 3001`
2. Configure Postmark webhook URL: `https://your-ngrok-url.ngrok.io/api/postman`
3. Send test emails to your configured inbound address
4. Monitor logs for processing status

### Debugging
- Check BullMQ dashboard at: `http://localhost:3001/admin/queues`
- Monitor Redis for job status: `redis-cli monitor`
- Review Supabase logs for database operations
- Check Postmark activity feed for webhook deliveries

## 📊 Performance

### Scalability Features
- **Async Processing**: All email processing happens in background jobs
- **Queue Management**: Separate queues for different operation types
- **Error Recovery**: Automatic retry with exponential backoff
- **Resource Optimization**: Efficient database queries and caching

### Monitoring
- **Job Metrics**: Processing time and success rates
- **Error Tracking**: Failed webhook attempts and retries
- **Performance Logs**: Response generation times
- **Health Checks**: Service availability monitoring

## 🔒 Security

### Webhook Validation
- **Origin Verification**: Validates requests come from Postmark
- **Mailbox Ownership**: Ensures emails are for valid mailboxes
- **Input Sanitization**: Cleans email content before processing
- **Rate Limiting**: Prevents abuse of webhook endpoints

### Data Protection
- **Secure Storage**: Encrypted database connections
- **API Key Management**: Secure environment variable handling
- **Access Control**: Service-to-service authentication
- **Audit Logging**: Track all email processing activities

---

## 🤝 Contributing

This processor service is part of the Leadmark platform built for the **Postmark Challenge: Inbox Innovators**.

**Key Integration Points:**
- Must maintain Postmark webhook compatibility
- Follow existing job queue patterns
- Preserve AI response quality
- Maintain database schema consistency

---

**Transform email processing with AI-powered automation using Postmark's powerful inbound parsing capabilities.**