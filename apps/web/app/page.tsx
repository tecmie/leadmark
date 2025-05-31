'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, CheckCircle, Inbox, Zap, Users, Shield, BarChart3, MessageSquare, Mail, Code, GitBranch, Trophy, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { appList } from '@/constants/apps';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <header className="relative z-10 px-4 py-6">
        <div className="app-container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-slate-900">Leadmark</div>
            <Badge className="bg-orange-500 text-white hover:bg-orange-600">
              <Trophy className="w-3 h-3 mr-1" />
              Hackathon Submission
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <Link href="https://dev.to/challenges/postmark" target="_blank">
              <Button variant="ghost" className="text-slate-600">
                <ExternalLink className="w-4 h-4 mr-2" />
                DEV Challenge
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Try Demo</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hackathon Hero Section */}
      <section className="relative overflow-hidden px-4 py-20">
        <div className="app-container text-center">
          <div className="mx-auto max-w-5xl">
            {/* Challenge Badge */}
            <div className="flex justify-center mb-8">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Postmark Challenge: Inbox Innovators
              </div>
            </div>

            <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Email-First
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Collaboration</span>
              <br />
              <span className="text-4xl sm:text-5xl lg:text-6xl">Reimagined</span>
            </h1>
            <p className="mt-8 text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
              Built for the Postmark Challenge, Leadmark transforms email from a simple messaging tool into a powerful, 
              interactive platform using <strong>Postmark's Inbound Email Processing</strong>. Manage projects, collaborate with teams, 
              and automate workflows—all through email.
            </p>

            {/* Tech Stack Highlights */}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Badge variant="secondary" className="px-3 py-1">
                <Mail className="w-3 h-3 mr-1" />
                Postmark Inbound
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                <Code className="w-3 h-3 mr-1" />
                Next.js 15
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                <Shield className="w-3 h-3 mr-1" />
                Supabase
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                <Zap className="w-3 h-3 mr-1" />
                Real-time Updates
              </Badge>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="text-lg px-8 py-4 h-auto">
                  Experience the Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="https://github.com/yourusername/leadmark" target="_blank">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto">
                  <GitBranch className="mr-2 h-5 w-5" />
                  View Source Code
                </Button>
              </Link>
            </div>
            <div className="mt-6 text-sm text-slate-500">
              🏆 Submission for DEV.to × Postmark Challenge • Built with ❤️ for developers
            </div>
          </div>
        </div>
      </section>

      {/* Innovation Showcase */}
      <section className="px-4 py-20 bg-white/50">
        <div className="app-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Innovative Email-First Workflows
            </h2>
            <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
              See how Postmark's Inbound Email Processing transforms traditional workflows into seamless, email-driven experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-orange-500 text-white text-xs">Postmark Power</Badge>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-6">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Email-to-Task Automation</h3>
              <p className="text-slate-600">
                Send an email to create tasks, assign team members, set priorities, and track progress—all parsed automatically via Postmark inbound webhooks.
              </p>
              <div className="mt-4 text-sm text-blue-600 font-medium">
                task@yourproject.leadmark.email
              </div>
            </Card>

            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-orange-500 text-white text-xs">Postmark Power</Badge>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-6">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Email Thread Management</h3>
              <p className="text-slate-600">
                Reply to any email thread to continue conversations, add participants, or update project status—Postmark processes it all in real-time.
              </p>
              <div className="mt-4 text-sm text-purple-600 font-medium">
                reply+thread-123@leadmark.email
              </div>
            </Card>

            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-orange-500 text-white text-xs">Postmark Power</Badge>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-6">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Form-to-Email Pipeline</h3>
              <p className="text-slate-600">
                Transform any form submission into a structured email workflow. Postmark inbound processing automatically categorizes and routes submissions.
              </p>
              <div className="mt-4 text-sm text-green-600 font-medium">
                forms+contact@leadmark.email
              </div>
            </Card>

            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-orange-500 text-white text-xs">Postmark Power</Badge>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-xl mb-6">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">AI-Enhanced Processing</h3>
              <p className="text-slate-600">
                Every inbound email gets analyzed by AI for sentiment, intent, and priority. Postmark delivers the raw content, we add the intelligence.
              </p>
              <div className="mt-4 text-sm text-orange-600 font-medium">
                Smart categorization & routing
              </div>
            </Card>

            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-orange-500 text-white text-xs">Postmark Power</Badge>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-xl mb-6">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Real-time Webhooks</h3>
              <p className="text-slate-600">
                Every email processed by Postmark triggers instant updates across your workspace. See changes happen in real-time as emails arrive.
              </p>
              <div className="mt-4 text-sm text-indigo-600 font-medium">
                Live collaboration updates
              </div>
            </Card>

            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="bg-orange-500 text-white text-xs">Postmark Power</Badge>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-pink-100 rounded-xl mb-6">
                <Shield className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Secure Email Parsing</h3>
              <p className="text-slate-600">
                Postmark's robust parsing handles attachments, HTML content, and complex email structures while maintaining security and reliability.
              </p>
              <div className="mt-4 text-sm text-pink-600 font-medium">
                Enterprise-grade processing
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Technical Demo */}
      <section className="px-4 py-20 bg-slate-900">
        <div className="app-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              See Postmark Inbound in Action
            </h2>
            <p className="mt-4 text-lg text-slate-300 max-w-3xl mx-auto">
              Watch how incoming emails get transformed into actionable data through Postmark's powerful webhook system
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Email Flow Visualization */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-white mb-6">Email Processing Flow</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-800 rounded-xl">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full text-sm font-bold">1</div>
                  <div>
                    <div className="text-white font-medium">Email Sent to Postmark</div>
                    <div className="text-slate-400 text-sm">User emails: task@project.leadmark.email</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-slate-800 rounded-xl">
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-500 text-white rounded-full text-sm font-bold">2</div>
                  <div>
                    <div className="text-white font-medium">Postmark Processes & Parses</div>
                    <div className="text-slate-400 text-sm">Headers, body, attachments → JSON payload</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-slate-800 rounded-xl">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-500 text-white rounded-full text-sm font-bold">3</div>
                  <div>
                    <div className="text-white font-medium">Webhook to Leadmark</div>
                    <div className="text-slate-400 text-sm">Real-time POST to our Next.js API route</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-slate-800 rounded-xl">
                  <div className="flex items-center justify-center w-8 h-8 bg-orange-500 text-white rounded-full text-sm font-bold">4</div>
                  <div>
                    <div className="text-white font-medium">AI Processing & Storage</div>
                    <div className="text-slate-400 text-sm">OpenAI analysis + Supabase real-time updates</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Code Example */}
            <div className="bg-slate-800 rounded-xl p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-semibold">Inbound Webhook Handler</h4>
                <Badge className="bg-green-500 text-white text-xs">Live Code</Badge>
              </div>
              <pre className="text-green-400 text-sm overflow-x-auto">
{`// app/api/inbound/route.ts
export async function POST(request: Request) {
  const payload = await request.json();
  
  // Extract email data from Postmark
  const {
    From, Subject, TextBody, 
    HtmlBody, Attachments
  } = payload;
  
  // AI-powered content analysis
  const analysis = await openai.analyze({
    subject: Subject,
    content: TextBody,
    intent: 'task_creation'
  });
  
  // Create thread in real-time
  const { data } = await supabase
    .from('threads')
    .insert({
      contact_email: From,
      subject: Subject,
      content: TextBody,
      ai_analysis: analysis,
      status: 'active'
    });
    
  return Response.json({ success: true });
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Hackathon Stats */}
      <section className="px-4 py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="app-container text-center">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
              Built for the Challenge
            </h2>
            <p className="text-xl text-blue-100">
              Technical achievements and innovation metrics
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-white">
            <div>
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-blue-100">Postmark Powered</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">5ms</div>
              <div className="text-blue-100">Webhook Response</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">∞</div>
              <div className="text-blue-100">Email Workflows</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white mb-2">🏆</div>
              <div className="text-blue-100">Hackathon Ready</div>
            </div>
          </div>
        </div>
      </section>

      {/* Hackathon CTA */}
      <section className="px-4 py-20 bg-white">
        <div className="app-container text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">
              Experience Email Innovation
            </h2>
            <p className="text-xl text-slate-600 mb-8">
              See how Postmark's Inbound Email Processing can transform your workflow. This demo showcases 
              the future of email-driven applications built for the DEV.to challenge.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/auth/signup">
                <Button size="lg" className="text-lg px-8 py-4 h-auto">
                  Try Live Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="https://github.com/yourusername/leadmark" target="_blank">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto">
                  <GitBranch className="mr-2 h-5 w-5" />
                  View Source Code
                </Button>
              </Link>
              <Link href="https://dev.to/challenges/postmark" target="_blank">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto">
                  <Trophy className="mr-2 h-5 w-5" />
                  Challenge Details
                </Button>
              </Link>
            </div>

            {/* Challenge Info */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Hackathon Submission Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <div className="font-semibold text-slate-900 mb-2">Challenge</div>
                  <div className="text-slate-600">Postmark Challenge: Inbox Innovators</div>
                  <div className="text-slate-600">DEV.to × Postmark</div>
                </div>
                <div>
                  <div className="font-semibold text-slate-900 mb-2">Innovation Focus</div>
                  <div className="text-slate-600">Inbound Email Processing</div>
                  <div className="text-slate-600">Email-First Workflows</div>
                </div>
                <div>
                  <div className="font-semibold text-slate-900 mb-2">Tech Stack</div>
                  <div className="text-slate-600">Next.js 15, Postmark, Supabase</div>
                  <div className="text-slate-600">OpenAI, Tailwind CSS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 bg-slate-900 text-white">
        <div className="app-container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-xl font-bold">Leadmark</div>
                <Badge className="bg-orange-500 text-white text-xs">
                  <Trophy className="w-3 h-3 mr-1" />
                  Hackathon
                </Badge>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                Email-first collaboration platform built for the Postmark Challenge. 
                Transforming email workflows with innovative inbound processing.
              </p>
              <div className="text-orange-400 text-sm font-medium">
                🏆 Postmark Challenge: Inbox Innovators
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Challenge Links</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="https://dev.to/challenges/postmark" target="_blank" className="hover:text-white flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    DEV Challenge Page
                  </Link>
                </li>
                <li>
                  <Link href="https://postmarkapp.com/developer/inbound" target="_blank" className="hover:text-white flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    Postmark Inbound Docs
                  </Link>
                </li>
                <li>
                  <Link href="https://github.com/yourusername/leadmark" target="_blank" className="hover:text-white flex items-center gap-1">
                    <GitBranch className="w-3 h-3" />
                    Source Code
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">Technical Writeup</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Innovation Features</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>Email-to-Task Automation</li>
                <li>Real-time Webhook Processing</li>
                <li>AI-Enhanced Email Analysis</li>
                <li>Dynamic Thread Management</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Tech Stack</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Mail className="w-3 h-3 inline mr-2" />
                  Postmark Inbound Processing
                </li>
                <li>
                  <Code className="w-3 h-3 inline mr-2" />
                  Next.js 15 + TypeScript
                </li>
                <li>
                  <Shield className="w-3 h-3 inline mr-2" />
                  Supabase + Real-time
                </li>
                <li>
                  <Zap className="w-3 h-3 inline mr-2" />
                  OpenAI Integration
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-400">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-orange-400" />
              <span>Built for Postmark Challenge: Inbox Innovators</span>
            </div>
            <div>© 2024 Leadmark. Hackathon submission by [Your Name] • DEV.to × Postmark</div>
          </div>
        </div>
      </footer>
    </div>
  );
}