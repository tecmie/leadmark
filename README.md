# 🚀 Leadmark - AI-Powered Email Automation Platform

> **Postmark Challenge: Inbox Innovators** - Transform any email address into an intelligent business automation engine

Leadmark converts your email inbox into a powerful AI assistant that handles customer inquiries, schedules meetings, and processes leads automatically using Postmark's inbound email parsing capabilities.

## 🎯 What It Does

**Turn Email Into Your Most Powerful Business Tool:**
- ✉️ **Smart Email Responses**: AI analyzes incoming emails and responds with contextual, business-specific information
- 📅 **Automatic Meeting Booking**: Detects scheduling requests and books meetings directly in Google Calendar
- 📋 **Lead Qualification**: Custom forms capture and qualify prospects automatically
- 🧠 **Business Context Aware**: Upload documents (PDF/DOCX) to train your AI assistant about your business
- ⚡ **Real-time Processing**: Instant responses powered by Postmark's webhook infrastructure

## 🌟 Key Features

### 🤖 AI-Powered Email Assistant
- **GPT-4 Integration**: Contextual responses based on your business objectives
- **Document Intelligence**: AI analyzes uploaded business documents for better responses
- **Custom Personas**: Define specific AI assistant roles and behaviors
- **Conversation Memory**: Maintains context across email threads

### 📅 Smart Meeting Scheduling
- **Google Calendar Integration**: Automatic availability checking and booking
- **Conflict Detection**: Prevents double-booking with intelligent scheduling
- **Time Zone Handling**: Supports global meeting coordination
- **Meeting Confirmations**: Automated calendar invites and confirmations

### 📊 Dynamic Lead Capture
- **AI-Generated Forms**: Creates custom contact forms based on your business
- **Real-time Processing**: Form submissions trigger immediate email workflows
- **Lead Qualification**: Automatically scores and categorizes prospects
- **CRM Integration**: Structured data collection for business insights

## 🏗️ Architecture

### Microservices Design
```
📧 Postmark Inbound → 🔄 Processor API → 🧠 AI Engine → 📤 Postmark Outbound
                          ↓
                     📊 Web Dashboard ← 💾 Supabase Database
```

**Tech Stack:**
- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Express.js, BullMQ, Redis
- **Database**: Supabase (PostgreSQL) with real-time subscriptions  
- **AI**: OpenAI GPT-4 with function calling
- **Email**: Postmark inbound/outbound processing
- **Calendar**: Google Calendar API
- **Storage**: Supabase Storage for document processing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm
- Postmark account (free trial available)
- Supabase account
- OpenAI API key
- Google Calendar API credentials (optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/tecmie/leadmark.git
cd leadmark
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Environment Setup**

Create `.env.local` in `apps/web/`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Google Calendar (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Create `.env` in `apps/processor/`:
```env
# Postmark
POSTMARK_API_KEY=your_postmark_server_token

# Database
DATABASE_URL=your_supabase_database_url

# Redis
REDIS_URL=redis://localhost:6379

# OpenAI
OPENAI_API_KEY=your_openai_api_key
```

4. **Start the development servers**
```bash
# Terminal 1 - Web app
pnpm dev

# Terminal 2 - Email processor (new terminal)
cd apps/processor
pnpm dev
```

5. **Configure Postmark Webhook**
   - In your Postmark account, set up an inbound server
   - Point the webhook URL to: `https://your-domain.com/api/postman`
   - Configure your inbound email address (e.g., `inbox@yourdomain.com`)

## 🎬 Demo Workflow

### 1. Initial Setup
1. Sign up and create your unique email address (e.g., `yourname@leadmark.email`)
2. Define your AI assistant's objective and personality
3. Upload business documents (PDFs, Word docs) for context
4. Choose or customize a lead capture form template

### 2. Email Processing Flow
```
📧 Customer sends email to yourname@leadmark.email
    ↓
🔄 Postmark webhook triggers processor
    ↓
🧠 AI analyzes email content + business context
    ↓ 
📅 Detects meeting request → Books calendar appointment
    OR
💬 Generates contextual business response
    ↓
📤 Sends professional reply via Postmark
    ↓
📊 Updates dashboard with conversation history
```

### 3. Real Business Examples

**Customer Inquiry:**
```
From: client@company.com
Subject: Web Development Services

Hi, I'm looking for a web development team to build 
an e-commerce platform. What's your process and pricing?
```

**AI Response (auto-generated):**
```
Hi there!

Thanks for reaching out about web development services. 
I'd be happy to help with your e-commerce platform.

Our development process includes:
- Discovery & requirements gathering
- UI/UX design phase
- Development & testing
- Launch & ongoing support

For e-commerce projects, we typically work with Shopify 
or custom solutions depending on your needs.

I'd love to schedule a call to discuss your project in detail. 
Are you available this week for a 30-minute consultation?

Best regards,
[Your Name]
```

**Meeting Scheduling:**
```
From: prospect@business.com
Subject: Schedule a Demo

Can we set up a demo call sometime next week?
```

**AI Response + Calendar Booking:**
```
Absolutely! I've checked my calendar and have these times available:

• Tuesday, June 4th at 2:00 PM EST
• Wednesday, June 5th at 10:00 AM EST  
• Thursday, June 6th at 3:00 PM EST

Just reply with your preferred time and I'll send a calendar invite.

Looking forward to showing you what we can do!
```

## 📁 Project Structure

```
leadmark/
├── apps/
│   ├── processor/          # Email processing backend
│   │   ├── src/
│   │   │   ├── api/        # Postmark webhook handlers
│   │   │   ├── services/   # AI, calendar, database services
│   │   │   └── events/     # BullMQ job processing
│   │   └── package.json
│   │
│   └── web/               # Next.js frontend dashboard
│       ├── app/           # App router pages
│       ├── components/    # Reusable UI components
│       ├── actions/       # Server actions
│       └── package.json
│
├── packages/
│   └── types/            # Shared TypeScript definitions
│
├── README.md
└── package.json
```

## 🔌 Postmark Integration Details

### Inbound Email Processing
- **Webhook Endpoint**: `/api/postman` 
- **Validation**: Mailbox ownership and sender verification
- **Processing**: Async job queue with BullMQ for scalability
- **Features**: Full email parsing including attachments, headers, and metadata

### Outbound Email Sending
- **Rich Responses**: HTML + Plain text formatting
- **Thread Management**: Maintains conversation context
- **Professional Formatting**: Branded email signatures and styling

## 🎯 Business Impact

### For Small Businesses
- **24/7 Customer Service**: Never miss an inquiry, even outside business hours
- **Professional Image**: Consistent, well-written responses build credibility  
- **Time Savings**: Automate 80%+ of routine email responses
- **Lead Generation**: Convert more prospects with immediate, helpful responses

### For Freelancers & Consultants
- **Streamlined Booking**: Clients can schedule meetings without back-and-forth
- **Consistent Branding**: Professional responses reflect your expertise
- **Scalability**: Handle more inquiries without hiring support staff

## 🏆 Hackathon Highlights

### Innovation in Email Processing
- **Beyond Basic Parsing**: Combines Postmark's infrastructure with advanced AI
- **Production Ready**: Enterprise-grade architecture with proper error handling
- **Real Business Value**: Solves actual problems faced by small businesses

### Technical Excellence
- **Type Safety**: Full TypeScript implementation
- **Modern Stack**: Latest React, Next.js, and Node.js technologies
- **Scalable Design**: Microservices architecture with event-driven processing
- **Real-time Features**: Live dashboard updates and instant email processing

## 🔮 Future Enhancements

- 📱 **Mobile App**: iOS/Android apps for on-the-go management
- 🔗 **CRM Integrations**: Connect with Salesforce, HubSpot, Pipedrive
- 📈 **Analytics Dashboard**: Email performance and response analytics
- 🌍 **Multi-language Support**: AI responses in multiple languages
- 🔒 **Enterprise Features**: Team management, advanced security, custom domains

## 📸 Screenshots

### Dashboard Overview
*Email conversations, meeting scheduling, and lead management in one place*

### AI Assistant Configuration  
*Custom business objectives and document upload for context*

### Real-time Email Processing
*Watch emails arrive and responses sent automatically*

---

## 🤝 Contributing

This project was built for the **Postmark Challenge: Inbox Innovators**. 

**Built with ❤️ for the Postmark community**

### Team
- **Lead Developer**: [Tecmie Leadmark Team](https://github.com/tecmie/leadmark)
- **Challenge**: Postmark Inbox Innovators 2024
- **Demo**: [Live Demo URL]
- **Video**: [Demo Video URL]

---

**Transform your email from a time sink into your most powerful business automation tool with Leadmark.**