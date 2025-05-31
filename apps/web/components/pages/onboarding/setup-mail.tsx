'use client';

import type React from 'react';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { XCircle, Loader2, CheckCircle2 } from 'lucide-react';
import {
  checkUsernameAvailability,
  processMailboxObjective,
  createMailboxForUser,
} from '@/actions/server/onboarding';
import { routes } from '@/utils/routes';
import { useRouter } from 'next/navigation';
import { updateOnboardingProgress } from '@/actions/server/user-profile';
import { createClient } from '@/supabase/client';
import { toast } from 'sonner';

export default function SetupMailPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<
    'idle' | 'checking' | 'available' | 'taken'
  >('idle');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [objective, setObjective] = useState('');
  const [, setUseFile] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const checkUsername = async (value: string) => {
    if (value.length < 3) return;

    setUsernameStatus('checking');
    try {
      const result = await checkUsernameAvailability(value);
      if (result.success && result.data?.available) {
        setUsernameStatus('available');
        setSuggestions([]);
      } else {
        setUsernameStatus('taken');
        setSuggestions(result.data?.suggestions || []);
      }
    } catch {
      setUsernameStatus('idle');
    }
  };

  // Debounce username check with useEffect
  useEffect(() => {
    if (username.length < 3) {
      setUsernameStatus('idle');
      setSuggestions([]);
      return;
    }
    setUsernameStatus('checking');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      checkUsername(username);
    }, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    setUsernameStatus('idle');
    setSuggestions([]);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUseFile(true);

      // Read file content and populate textarea
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setObjective(content);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameStatus !== 'available' || !objective.trim()) return;

    setIsProcessing(true);
    setError('');

    try {
      // Process the objective with AI
      const result = await processMailboxObjective(objective);

      if (result.success) {
        // Get current user ID
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const userId = user?.id;
        if (userId) {
          // return if the update failed
          const updateResult = await updateOnboardingProgress(
            userId,
            'in_progress',
            'resource'
          );
          if (!updateResult.success) {
            toast.error(
              updateResult.message || 'Failed to update onboarding progress'
            );
          }
          // Create mailbox for user
          const mailboxResult = await createMailboxForUser({
            userId,
            unique_address: username,
            rawObjective: objective,
            processedObjective: result.data,
          });
          if (!mailboxResult.success) {
            toast.error(mailboxResult.message || 'Failed to create mailbox');
            setIsProcessing(false);
            return;
          }
        }
        // Store data in sessionStorage for next step
        sessionStorage.setItem(
          'onboarding-data',
          JSON.stringify({
            username,
            rawObjective: objective,
            processedObjective: result.data,
          })
        );

        router.push(routes.ONBOARDING_SETUP_RESOURCE);
      } else {
        toast.error(result.message || 'Failed to process mailbox objective');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="text-center w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Setup Your Mail Account
          </h1>
          <p className="text-gray-600">
            Choose your username and define your mailbox objective
          </p>
        </div>
      </div>

      <div className="rounded-2xl bg-white/90 border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Username Section */}
          <div className="space-y-2">
            <Label htmlFor="username" className="font-medium text-xs">
              Choose Username
            </Label>
            <div className="relative">
              <Input
                id="username"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="paul"
                className="pr-10 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                autoComplete="off"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {usernameStatus === 'checking' && (
                  <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                )}
                {usernameStatus === 'available' && (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                )}
                {usernameStatus === 'taken' && (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Your email will be:{' '}
              <span className="font-medium">
                {username || 'username'}@leadmark.email
              </span>
            </p>
            {suggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <Button
                      key={suggestion}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="hover:bg-blue-50 border-blue-200"
                      onClick={() => {
                        setUsername(suggestion);
                        setUsernameStatus('checking');
                      }}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Objective Section */}
          <div className="space-y-4">
            <Label className="font-medium text-xs">Mailbox Objective</Label>
            <Textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Describe what you want to use this mailbox for, e.g. 'I want to qualify leads for my SaaS product and schedule calls with potential customers.'"
              rows={7}
              className="resize-none focus:ring-2 p-3 transition-all"
            />
            <div className="flex items-center space-x-4">
              <button
                type="button"
                className="text-sm font-medium cursor-pointer text-gray-500 underline"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            <div className="bg-blue-50/80 p-5 rounded-xl border border-blue-100 mt-2">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <span role="img" aria-label="lightbulb">
                  💡
                </span>{' '}
                Tips for a great objective:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc pl-5">
                <li>
                  Be specific about your business goals and target audience
                </li>
                <li>
                  Include what actions the AI should take (qualify leads,
                  schedule calls, etc.)
                </li>
                <li>Mention your products/services and value propositions</li>
                <li>
                  Define the tone and personality you want (professional,
                  friendly, etc.)
                </li>
                <li>Include any time-sensitive objectives or constraints</li>
              </ul>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full py-3 rounded-lg text-sm font-semibold shadow-sm transition-all"
            disabled={
              usernameStatus !== 'available' ||
              !objective.trim() ||
              isProcessing
            }
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing Objective...
              </>
            ) : (
              'Continue to Resources'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
