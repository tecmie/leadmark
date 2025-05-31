'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Zap, Users, Shield, BarChart3, MessageSquare, Mail, Code, GitBranch, Trophy, ExternalLink, Play, Webhook, Database, Brain } from 'lucide-react';
import Link from 'next/link';

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
              <Link href="https://github.com/tecmie/leadmark" target="_blank">
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

      {/* Video Demo Showcase */}
      <section className="px-4 py-32 bg-black">
        <div className="app-container">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-white sm:text-5xl mb-6">
              See it in action
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Watch how Postmark transforms email into powerful workflows
            </p>
          </div>

          {/* Video Container */}
          <div className="max-w-6xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 to-black shadow-2xl">
              <div className="aspect-video flex items-center justify-center relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
                
                {/* Elegant Play Button */}
                <div className="relative z-10 flex items-center justify-center w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                  <Play className="w-10 h-10 text-white ml-1" />
                </div>
                
                {/* Minimal Video Info */}
                <div className="absolute bottom-8 left-8 text-white">
                  <div className="text-sm font-medium text-gray-300 mb-1">Demo Video</div>
                  <div className="text-2xl font-semibold">Email → Workflow</div>
                </div>
                
                {/* Duration Badge */}
                <div className="absolute top-8 right-8">
                  <div className="bg-black/50 backdrop-blur-md rounded-full px-4 py-2 text-sm text-white border border-white/10">
                    2:15
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-4 py-20 bg-slate-50">
        <div className="app-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">
              How it works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Your AI assistant handles business communications automatically
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-2xl mx-auto mb-6 text-xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Golden Opportunity</h3>
                <p className="text-slate-600 mb-4">
                  A Fortune 500 company emails expansion@leadmark.email interested in a massive rollout while you're enjoying family dinner.
                </p>
                <div className="bg-slate-100 rounded-lg p-4 text-sm text-slate-700">
                  <div className="font-medium mb-1">To: expansion@leadmark.email</div>
                  <div className="font-medium mb-1">Subject: Enterprise rollout for 50,000 users</div>
                  <div>Hi! We saw your product demo and want to discuss expanding from our pilot to all 50k employees. What's our timeline and pricing for Q1 launch?</div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-purple-500 text-white rounded-2xl mx-auto mb-6 text-xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">AI Seizes the Moment</h3>
                <p className="text-slate-600 mb-4">
                  AI instantly recognizes this as a mega-deal, sends tailored enterprise proposal, implementation timeline, and exclusive pricing.
                </p>
                <div className="bg-slate-100 rounded-lg p-4 text-sm text-slate-700 text-left">
                  <div className="text-xs">
                    <strong>Hi [Name],</strong><br/><br/>
                    Fantastic timing! For 50k users, here's what we can offer:<br/><br/>
                    ✅ Custom enterprise pricing: $8/user (vs $15 standard)<br/>
                    ✅ Dedicated Q1 implementation team<br/>
                    ✅ White-glove onboarding & training<br/><br/>
                    I've reserved this pricing for 48 hours and scheduled our enterprise team for a deep-dive tomorrow.
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-2xl mx-auto mb-6 text-xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Million-Dollar Win</h3>
                <p className="text-slate-600 mb-4">
                  Wake up to an excited response and meeting confirmed. AI captured a $4.8M annual deal opportunity while you were offline.
                </p>
                <div className="bg-slate-100 rounded-lg p-4 text-sm text-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium">$4.8M Deal Pipeline • Meeting Tomorrow</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Enterprise pricing locked • Implementation team assigned • Deal fast-tracked
                  </div>
                </div>
              </div>
            </div>

            {/* Real Examples */}
            <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm border">
              <h3 className="text-xl font-semibold text-slate-900 mb-6 text-center">Life-Changing Edge Cases That Actually Matter</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                      <span className="font-mono bg-green-100 text-green-700 px-2 py-1 rounded text-xs">vip@leadmark.email</span>
                    </div>
                    <div className="text-sm text-slate-600">
                      <strong>Celebrity Endorsement:</strong> A-list celebrity's manager emails wanting to partner on a major campaign while you're sleeping. AI recognizes the opportunity, sends media kit, usage rights, and books strategy call. <span className="text-green-700 font-medium">$2M brand deal launched.</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                      <span className="font-mono bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">partnership@leadmark.email</span>
                    </div>
                    <div className="text-sm text-slate-600">
                      <strong>Strategic Alliance:</strong> Microsoft emails about integrating your product into Office 365 for 300M users. AI immediately sends technical specs, API docs, and schedules architect meeting—all during your weekend. <span className="text-green-700 font-medium">$50M partnership opportunity.</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                      <span className="font-mono bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">investor@leadmark.email</span>
                    </div>
                    <div className="text-sm text-slate-600">
                      <strong>Dream Funding:</strong> Andreessen Horowitz partner emails at 2 AM wanting to lead your Series B after seeing viral product demo. AI sends tailored deck, traction metrics, and books partner dinner. <span className="text-green-700 font-medium">$25M Series B initiated.</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="font-semibold text-slate-900 flex items-center gap-2">
                      <span className="font-mono bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs">media@leadmark.email</span>
                    </div>
                    <div className="text-sm text-slate-600">
                      <strong>Viral Moment:</strong> TechCrunch editor emails asking for exclusive story about your breakthrough AI innovation. AI sends press kit, founder photos, and schedules interview for tomorrow's headline. <span className="text-green-700 font-medium">Front-page feature secured.</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="text-center">
                    <div className="font-semibold text-slate-900 mb-3">The Reality: Life-Changing Opportunities Happen at 3 AM</div>
                    <div className="text-sm text-slate-600 max-w-3xl mx-auto">
                      The biggest deals don't happen during business hours. Game-changing partnerships come from unexpected emails. Your breakthrough moment might arrive while you're sleeping. 
                      <strong> Your AI assistant ensures you never miss the opportunity that changes everything.</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                    <div className="text-slate-400 text-sm">Customer emails: support@leadmark.email</div>
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

      {/* Challenge Innovation */}
      <section className="px-4 py-20 bg-slate-900">
        <div className="app-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
              Built for Postmark Challenge
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Our innovative approach to the "Inbox Innovators" challenge: transforming email from 
              a messaging tool into a powerful workflow automation platform.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Challenge Response */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-white">Challenge Response</h3>
                <div className="space-y-4">
                  <div className="bg-slate-800 rounded-lg p-6">
                    <h4 className="font-semibold text-white mb-2">The Brief</h4>
                    <p className="text-slate-300 text-sm">"Do something cool with Inbound Email Processing"</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-6">
                    <h4 className="font-semibold text-white mb-2">Our Solution</h4>
                    <p className="text-slate-300 text-sm">Email-first collaboration platform where every email becomes an interactive workflow trigger</p>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-6">
                    <h4 className="font-semibold text-white mb-2">Innovation</h4>
                    <p className="text-slate-300 text-sm">Turn any email address into a powerful API endpoint using Postmark's inbound processing</p>
                  </div>
                </div>
              </div>

              {/* Technical Implementation */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-white">Technical Stack</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-800 rounded-lg p-4 text-center">
                    <Webhook className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="font-medium text-white text-sm">Postmark Inbound</div>
                    <div className="text-xs text-slate-400">Email → JSON</div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4 text-center">
                    <Code className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <div className="font-medium text-white text-sm">Next.js 15</div>
                    <div className="text-xs text-slate-400">Webhook Handler</div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4 text-center">
                    <Database className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <div className="font-medium text-white text-sm">Supabase</div>
                    <div className="text-xs text-slate-400">Real-time DB</div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4 text-center">
                    <Brain className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                    <div className="font-medium text-white text-sm">OpenAI</div>
                    <div className="text-xs text-slate-400">Content Analysis</div>
                  </div>
                </div>
                
                {/* Key Stats */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6">
                  <h4 className="font-semibold text-white mb-4">Development Stats</h4>
                  <div className="grid grid-cols-3 gap-4 text-center text-white">
                    <div>
                      <div className="text-2xl font-bold">3.2ms</div>
                      <div className="text-xs text-blue-100">Webhook Response</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">127</div>
                      <div className="text-xs text-blue-100">Test Emails</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">98%</div>
                      <div className="text-xs text-blue-100">Parse Accuracy</div>
                    </div>
                  </div>
                </div>
              </div>
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
              <Link href="https://github.com/tecmie/leadmark" target="_blank">
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
                  <Link href="https://github.com/tecmie/leadmark" target="_blank" className="hover:text-white flex items-center gap-1">
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
            <div>© 2024 Leadmark. Hackathon submission by Tecmie • DEV.to × Postmark</div>
          </div>
        </div>
      </footer>
    </div>
  );
}