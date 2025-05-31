'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogoMark } from '@/components/ui/logo-mark';
import { createClient } from '@/supabase/client';
import { routes } from '@/utils/routes';
import { Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetSuccess = searchParams?.get('success') === 'true';
  const supabase = createClient();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      router.push(`${routes.FORGOT_PASSWORD}?success=true`);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (resetSuccess) {
    return (
      <div className="flex flex-col gap-8 items-center w-full p-6 mx-auto max-w-[400px] text-center">
        <LogoMark />
        <div className="flex flex-col items-center w-full gap-1">
          <p>
            A password reset link has been sent to your email address ({email}).
            Please check your inbox and click the link to reset your password.
          </p>
        </div>
        <div>
          Not you?{' '}
          <Link href={routes.FORGOT_PASSWORD} className="text-primary-base">
            Change email address
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 items-center w-full p-6 mx-auto max-w-[400px] text-center">
      <LogoMark />
      <div className="flex flex-col items-center w-full gap-1">
        <h2 className="text-2xl font-medium">Forgot your password?</h2>
        <p>
          Enter the email address associated with your account and we will send
          you a password reset link.
        </p>
      </div>

      <form
        onSubmit={handleResetPassword}
        className="flex flex-col w-full gap-4"
      >
        <div className="space-y-2 flex items-start flex-col justify-start">
          <label htmlFor="email" className="text-sm font-medium">
            Email address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            startIcon={Mail}
            required
          />
        </div>

        <Button type="submit" className="w-full text-white" disabled={loading}>
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            'Send reset link'
          )}
        </Button>
      </form>

      <p>
        Remember your password?{' '}
        <Link href={routes.SIGN_IN} className="text-blue-500 font-medium">
          Log in
        </Link>
      </p>
    </div>
  );
};
