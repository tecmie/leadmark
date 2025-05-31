# 🌐 Leadmark Web - Dashboard & User Interface

> **AI Email Automation Dashboard**: Real-time email management and business automation interface

## 🎯 Purpose

The web application provides the user-facing dashboard for Leadmark's AI-powered email automation platform. Users can manage conversations, configure AI assistants, track meetings, and monitor their automated email workflows.

## 🚀 Key Features

### 📊 Real-time Dashboard
- **Live Email Conversations**: Watch emails arrive and responses sent instantly
- **Thread Management**: Organized conversation views with context
- **AI Response Monitoring**: Track automated responses and engagement
- **Performance Analytics**: Email response rates and customer satisfaction

### 🤖 AI Assistant Configuration
- **Custom Objectives**: Define specific business goals and AI personality
- **Document Upload**: Train AI with business documents (PDF/DOCX)
- **Response Templates**: Customize automated response patterns
- **Persona Management**: Multiple AI assistants for different use cases

### 📅 Meeting Management
- **Calendar Integration**: Google Calendar sync and availability
- **Automatic Scheduling**: AI-detected meeting requests and booking
- **Conflict Resolution**: Smart scheduling to prevent double-booking
- **Meeting Analytics**: Track scheduling success and follow-ups

### 📋 Lead Management
- **Contact Organization**: Automatic contact creation and management
- **Lead Scoring**: AI-powered prospect qualification
- **Form Builder**: Dynamic contact forms with customization
- **Pipeline Tracking**: Monitor lead progression and conversion

## 🏗️ Architecture

### Next.js 15 App Router
```
app/
├── (dashboard)/           # Protected dashboard routes
│   ├── inbox/            # Email conversation management
│   ├── forms/            # Lead capture form builder
│   ├── profile/          # User settings and preferences
│   └── settings/         # AI configuration and integrations
│
├── auth/                 # Authentication flows
├── onboarding/           # User setup wizard
└── form/[id]/           # Public form submissions
```

### Component Architecture
```
components/
├── pages/                # Page-specific components
│   ├── inbox/           # Email conversation components
│   ├── onboarding/      # Setup wizard components
│   ├── auth/            # Authentication forms
│   └── forms/           # Form builder components
│
├── ui/                  # Reusable UI components
│   ├── button.tsx       # Button variants
│   ├── input.tsx        # Form inputs with icons
│   ├── dialog.tsx       # Modal dialogs
│   └── ...             # Other UI primitives
│
└── layouts/             # Layout components
    ├── auth-layout.tsx  # Authentication pages
    ├── inbox-layout.tsx # Dashboard layout
    └── ...             # Other layouts
```

## 🎨 Tech Stack

### Frontend Framework
- **Next.js 15**: Latest App Router with React Server Components
- **React 19**: Concurrent features and improved performance
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first styling with custom design system

### UI Components
- **Radix UI**: Accessible component primitives
- **Lucide React**: Consistent icon system
- **Framer Motion**: Smooth animations and transitions
- **React Hook Form**: Efficient form management with validation

### Data & State
- **Supabase**: Real-time database with auth integration
- **TanStack Query**: Server state management and caching
- **Zustand**: Client-side state management
- **Real-time Subscriptions**: Live updates via Supabase channels

## 🔧 Environment Setup

Create `.env.local`:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI (for client-side AI features)
OPENAI_API_KEY=your_openai_api_key

# Google Calendar Integration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_PROCESSOR_URL=http://localhost:3001

# Stripe (for payments - optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
```

## 🚀 Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Type checking
pnpm check-types

# Linting
pnpm lint
```

## 📱 Key Pages & Features

### Dashboard (`/inbox/u/[namespace]`)
```typescript
// Real-time inbox with live updates
const InboxPage = () => {
  const { data: threads } = useInboxThreads();
  
  // Real-time subscription for new emails
  useEffect(() => {
    const channel = supabase
      .channel('inbox-updates')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => updateThreads(payload.new)
      )
      .subscribe();
      
    return () => supabase.removeChannel(channel);
  }, []);
  
  return <DataTable columns={columns} data={threads} />;
};
```

### Onboarding Flow (`/onboarding/*`)
1. **Get Started**: User registration and welcome
2. **Setup Mail**: Configure unique email address
3. **Choose Template**: Select AI assistant type
4. **Customize**: Define objectives and upload documents
5. **Resource**: Business document processing

### AI Configuration (`/settings`)
- **Objective Setting**: Define AI assistant goals and personality
- **Document Management**: Upload and manage business context files
- **Integration Setup**: Connect Google Calendar and other services
- **Response Customization**: Configure automated response templates

### Form Builder (`/forms`)
- **Template Selection**: Choose from AI-generated form templates
- **Field Customization**: Drag-and-drop form builder interface
- **Styling Options**: Custom branding and design
- **Embed Code**: Generate embeddable forms for websites

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--primary: 210 100% 50%;        /* Blue */
--primary-foreground: 0 0% 100%; /* White */

/* UI Colors */
--background: 0 0% 100%;        /* White */
--foreground: 222.2 84% 4.9%;   /* Dark Gray */
--muted: 210 40% 96%;           /* Light Gray */
--border: 214.3 31.8% 91.4%;    /* Border Gray */

/* Status Colors */
--destructive: 0 84.2% 60.2%;   /* Red */
--warning: 38 92% 50%;          /* Orange */
--success: 142 71% 45%;         /* Green */
```

### Typography
- **Font Family**: Inter (system font fallback)
- **Headings**: Bold weights with proper line height
- **Body Text**: Regular weight with optimized readability
- **Code**: JetBrains Mono for technical content

### Components
- **Buttons**: Multiple variants with consistent spacing
- **Forms**: Accessible inputs with proper validation states
- **Cards**: Elevated surfaces with subtle shadows
- **Tables**: Responsive data tables with sorting and filtering

## 🔄 Data Flow

### Real-time Updates
```typescript
// Live email updates
const useInboxSubscription = () => {
  useEffect(() => {
    const channel = supabase
      .channel('inbox-realtime')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public', 
        table: 'messages'
      }, (payload) => {
        // Update UI immediately when new emails arrive
        queryClient.invalidateQueries(['inbox-threads']);
      })
      .subscribe();
      
    return () => supabase.removeChannel(channel);
  }, []);
};
```

### Server Actions
```typescript
// Server-side form processing
export async function updateAIObjective(formData: FormData) {
  'use server';
  
  const objective = formData.get('objective') as string;
  const { data, error } = await supabase
    .from('mailboxes')
    .update({ raw_objective: objective })
    .eq('owner_id', userId);
    
  revalidatePath('/settings');
  return { success: !error };
}
```

## 📊 Performance Optimizations

### Code Splitting
- **Route-based**: Automatic code splitting per page
- **Component-based**: Lazy loading for heavy components
- **Library Splitting**: Separate chunks for third-party libraries

### Caching Strategy
- **Static Generation**: Pre-generated pages where possible
- **Incremental Regeneration**: Update static content on demand
- **Client Caching**: TanStack Query for efficient data fetching
- **Edge Caching**: CDN optimization for global performance

### Image Optimization
- **Next.js Image**: Automatic WebP conversion and sizing
- **Responsive Images**: Multiple sizes for different viewports
- **Lazy Loading**: Progressive image loading for performance

## 🔒 Security

### Authentication
- **Supabase Auth**: Secure user authentication with JWT
- **Row Level Security**: Database-level access control
- **CSRF Protection**: Built-in Next.js security features
- **Input Validation**: Zod schema validation throughout

### Data Protection
- **Environment Variables**: Secure API key management
- **HTTPS Only**: Force secure connections in production
- **Content Security Policy**: Prevent XSS attacks
- **Rate Limiting**: Protect against abuse

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
sm: '640px'    /* Small tablets */
md: '768px'    /* Large tablets */
lg: '1024px'   /* Laptops */
xl: '1280px'   /* Desktops */
2xl: '1536px'  /* Large screens */
```

### Mobile Features
- **Touch-friendly**: Large tap targets and gestures
- **Responsive Tables**: Horizontal scrolling and card layouts
- **Bottom Navigation**: Mobile-optimized navigation
- **Progressive Web App**: Installable with offline capabilities

## 🧪 Testing

### Test Strategy
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API and database interaction testing
- **E2E Tests**: Full user workflow testing
- **Visual Regression**: Screenshot-based UI testing

### Testing Tools
- **Jest**: Unit test runner and mocking
- **React Testing Library**: Component testing utilities
- **Playwright**: End-to-end browser testing
- **Storybook**: Component development and testing

## 🚀 Deployment

### Production Build
```bash
# Build optimized production bundle
pnpm build

# Analyze bundle size
pnpm analyze

# Deploy to Vercel
vercel --prod
```

### Environment Configuration
- **Vercel**: Optimized for Next.js deployment
- **Environment Variables**: Secure secret management
- **Domain Setup**: Custom domain configuration
- **Analytics**: Built-in performance monitoring

---

## 🤝 Contributing

This web application is part of the Leadmark platform built for the **Postmark Challenge: Inbox Innovators**.

**Development Guidelines:**
- Follow TypeScript strict mode
- Use Tailwind CSS for all styling
- Implement proper accessibility features
- Maintain real-time update functionality
- Ensure mobile-responsive design

---

**Create beautiful, responsive interfaces for AI-powered email automation with Leadmark Web.**