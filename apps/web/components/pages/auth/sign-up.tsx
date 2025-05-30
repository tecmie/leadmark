'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogoMark } from '@/components/ui/logo-mark';
import { createClient } from '@/supabase/client';
import { routes } from '@/utils/routes';
import { Eye, EyeOff, KeyRound, Loader2, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [canResendLink, setCanResendLink] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const createSuccess = searchParams?.get('success') === 'true';
  const supabase = createClient();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullname,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data?.user) {
        // Create profile
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          full_name: fullname,
          email: email,
          onboarding_status: 'pending',
        });

        if (profileError) {
          toast.error(profileError.message);
          return;
        }

        router.push(`${routes.signUp}?success=true`);
        setTimeout(() => {
          setCanResendLink(true);
        }, 60 * 1000);
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmationEmail = async () => {
    setCanResendLink(false);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        toast.error(error.message);
        setCanResendLink(true);
        return;
      }

      toast.success('Confirmation email resent successfully');
    } catch (err) {
      toast.error((err as Error).message);
      setCanResendLink(true);
    }

    setTimeout(() => {
      setCanResendLink(true);
    }, 60 * 1000);
  };

  if (createSuccess) {
    return (
      <div className="flex flex-col gap-8 items-center w-full p-6 mx-auto max-w-[400px] text-center">
        <LogoMark />
        <div className="flex flex-col items-center w-full gap-1">
          <p>
            An email confirmation link has been sent to your email address (
            {email}). Please check your inbox and click the link to complete
            your registration.
          </p>
        </div>
        <div>
          Didn&apos;t receive any mail?{' '}
          <Button
            variant="link"
            size="sm"
            className="text-primary-base"
            onClick={handleResendConfirmationEmail}
            disabled={!canResendLink}
          >
            Resend email
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 items-center w-full p-6 mx-auto max-w-[400px] text-center">
      <LogoMark />
      <div className="flex flex-col items-center w-full gap-1">
        <h2 className="text-2xl font-bold">Create an account</h2>
        <p>Your journey to an AI automated inbox starts here.</p>
      </div>

      <form onSubmit={handleSignUp} className="flex flex-col w-full gap-4">
        <div className="space-y-2 flex items-start flex-col justify-start">
          <label htmlFor="fullname" className="text-sm font-medium">
            Full name
          </label>
          <Input
            id="fullname"
            type="text"
            placeholder="Enter your full name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            startIcon={User}
            required
          />
        </div>

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

        <div className="space-y-2 flex items-start flex-col justify-start">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            startIcon={KeyRound}
            endIcon={showPassword ? EyeOff : Eye}
            onClickEndIcon={() => setShowPassword(!showPassword)}
            required
          />
          <p className="text-xs text-left text-muted-foreground">
            Password should be at least 8 characters long
          </p>
        </div>

        <Button
          type="submit"
          className="w-full bg-black text-white"
          disabled={loading}
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            'Create account'
          )}
        </Button>
      </form>

      <p>
        Already have an account?{' '}
        <Link href={routes.signIn} className="text-primary-base">
          Log in
        </Link>
      </p>
    </div>
  );
};
