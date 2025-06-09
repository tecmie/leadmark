Here’s your Postmark Challenge entry, structured to the template:

---

## What I Built

**LeadMark** is an AI-powered lead qualification engine that automatically ingests inbound email, SMS, and WhatsApp messages via Postmark Dev Inbox and applies your custom qualification rules to each message. Low-quality leads receive an auto-reply deferment, while high-value leads are instantly routed to your CRM or Slack—saving you hours of manual work every day.

---

## Demo

* **Live App:** [https://www.leadmark.email](https://www.leadmark.email)
* **Screenshots:**

  1. **Inbox Dashboard** showing real-time incoming messages and your custom score column
  2. **Rule Editor** where you define keyword or ML-based scoring rules
  3. **History View** of auto-replies sent and high-value leads forwarded

> **Testing Instructions:**
>
> 1. Sign up with any email address on [https://www.leadmark.email/signup](https://www.leadmark.email/signup)
> 2. Configure your Postmark Dev Inbox webhook to point at `https://<your-domain>/api/inbox`
> 3. Send a test email to your Postmark Dev Inbox address—include keywords like “investment” or “franchise” to trigger a high-value score, or leave them out for a low-value auto-reply
> 4. Watch LeadMark classify the message, send the appropriate automated response, and forward high-value leads to Slack or your chosen CRM via the built-in integration

Feel free to use the following test credentials on the demo instance:

```
Email: tester+1@leadmark.email  
Password: Test1234!  
```

---

## Code Repository

🔗 [https://github.com/tecmie/leadmark](https://github.com/tecmie/leadmark)



## Team Members
*This submission was built by @koolamusic and the Tecmie team.*

* [Andrew](https://dev.to/koolamusic)


---

## How I Built It

* **Frontend:** Next.js 15 + TypeScript + Tailwind CSS for a fast, mobile-friendly dashboard
* **Inbound Processor:** Next.js API routes receive Postmark Dev Inbox webhooks, enqueue jobs in BullMQ/Redis
* **Scoring Engine:**

  * **Today:** Keyword/rule-based scoring (e.g., “budget:50k+”, “investment”)
  * **Future:** Plug-in GPT-4 or custom TensorFlow\.js models
* **Storage & Real-time:** Supabase (PostgreSQL + real-time subscriptions)
* **Integrations:**

  * **Postmark Dev Inbox API** for email ingestion
  * **Twilio SMS & WhatsApp Business API** for multi-channel lead capture
  * **Slack Webhooks** or any CRM REST API for instant forwarding
  * **Google Calendar** for one-click booking invites
* **Auto-Replies:** Leveraging Postmark’s outbound transactional API for “thank you” or deferment messages
* **DevOps:** Vercel for front-end and processor, Redis and Supabase hosted on managed services for zero-ops

---


## 🚀 Quick Test Instructions

### For Judges to Test:
1. Visit: [https://www.leadmark.email](https://www.leadmark.email)
2. Send email to: `demo@leadmark.email`
3. Watch dashboard for real-time response
4. Try meeting scheduling by mentioning availability
5. Explore form builder and AI configuration

### Test Scenarios:
- **Service Inquiry**: Ask about web development, consulting, etc.
- **Meeting Request**: "Can we schedule a call?"
- **Product Question**: Ask specific business-related questions
- **Pricing Request**: "What are your rates?"

---

**Ready to transform email into your most powerful business tool? Try Leadmark today!**


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kn52w3vx09lairgcicyy.jpeg)