'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogoMark } from '@/components/ui/logo-mark';
import { createClient } from '@/supabase/client';
import { routes } from '@/utils/routes';
import { Eye, EyeOff, KeyRound, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data?.user) {
        // const { data: profile } = await supabase
        //   .from('profiles')
        //   .select('onboarding_status')
        //   .eq('id', data.user.id)
        //   .single();

        router.push(routes.ONBOARDING_GET_STARTED);
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 items-center w-full p-6 mx-auto max-w-[400px] text-center">
      <LogoMark />
      <div className="flex flex-col items-center w-full gap-1">
        <h2 className="text-2xl font-bold">Log in to your account</h2>
        <p>Start managing your inbox right away.</p>
      </div>

      <form onSubmit={handleSignIn} className="flex flex-col w-full gap-4">
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
        </div>

        <div className="flex items-center justify-end">
          <Link
            href={routes.FORGOT_PASSWORD}
            className="text-sm font-medium text-primary-base"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full text-white" disabled={loading}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : 'Log in'}
        </Button>
      </form>

      <p>
        Don&apos;t have an account yet?{' '}
        <Link href={routes.SIGN_UP} className="text-blue-500 font-medium">
          Create an account
        </Link>
      </p>
    </div>
  );
};
