'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { createClient } from '@/supabase/client';
import { Loader2, Mail, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RESEND_INTERVAL = 60; // seconds
const STORAGE_KEY = 'resendEmailEndTime';

// Get initial countdown value from localStorage (no flash)
function getInitialCountdown() {
  if (typeof window === 'undefined') return RESEND_INTERVAL;
  const endTime = localStorage.getItem(STORAGE_KEY);
  if (endTime) {
    const diff = Math.floor((parseInt(endTime) - Date.now()) / 1000);
    return diff > 0 ? diff : 0;
  }
  return RESEND_INTERVAL;
}

export default function ConfirmEmailPage() {
  const params = useSearchParams();
  const email = params.get('email');
  const [resendCountdown, setResendCountdown] = useState(getInitialCountdown);
  const [canResend, setCanResend] = useState(resendCountdown === 0);
  const [isResending, setIsResending] = useState(false);
  const supabase = createClient();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Only set a new end time if not present
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(
        STORAGE_KEY,
        (Date.now() + RESEND_INTERVAL * 1000).toString()
      );
    }

    // Start interval
    const timer = setInterval(() => {
      const end = parseInt(localStorage.getItem(STORAGE_KEY) || '0');
      const diff = Math.floor((end - Date.now()) / 1000);
      if (diff > 0) {
        setResendCountdown(diff);
        setCanResend(false);
      } else {
        setResendCountdown(0);
        setCanResend(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleResendConfirmationEmail = async () => {
    setIsResending(true);
    setCanResend(false);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email || '',
      });

      if (error) {
        toast.error(error.message);
        setCanResend(true);
        return;
      }

      toast.success('Confirmation email resent successfully');

      // After sending:
      const newEndTime = Date.now() + RESEND_INTERVAL * 1000;
      localStorage.setItem(STORAGE_KEY, newEndTime.toString());
      setResendCountdown(RESEND_INTERVAL);
      setCanResend(false);
    } catch (err) {
      toast.error((err as Error).message);
      setCanResend(true);
    } finally {
      setIsResending(false);
    }
  };

  // Don't render anything until mounted (avoids SSR mismatch)
  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-8 items-center w-full p-6 mx-auto max-w-[400px] min-h-[80vh] justify-center text-center">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="text-4xl font-bold text-primary-base">Leadmark</div>
        </div>

        {/* Email Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center">
            <Mail className="w-8 h-8 text-primary" />
          </div>
        </div>

        {/* Main Message */}
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold ">
            Check your email
          </h1>
          <p className=" text-lg leading-relaxed">
            An email confirmation link has been sent to your email address{' '}
            {email && (
              <a
                href={`mailto:${email}`}
                className="font-medium  underline"
              >
                ({email})
              </a>
            )}
            . Please check your inbox and click the link to complete your
            registration.
          </p>
        </div>

        {/* Additional Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-primary">
            <strong>Don&apos;t see the email?</strong> Check your spam folder or
            try searching for Leadmark in your inbox.
          </p>
        </div>

        {/* Resend Section */}
        <div className="pt-4">
          <p className=" mb-4">Didn&apos;t receive any mail?</p>

          <Button
            onClick={handleResendConfirmationEmail}
            disabled={!canResend || isResending}
            className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
              canResend && !isResending
                ? 'bg-primary  focus:ring-4 focus:ring-primary-base/20'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isResending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : canResend ? (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Resend email
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Resend in {resendCountdown}s
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
