'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogoMark } from '@/components/ui/logo-mark';
import { createClient } from '@/supabase/client';
import { routes } from '@/utils/routes';
import { AlertCircle, Eye, EyeOff, KeyRound, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Password updated successfully');
      router.push(routes.signIn);
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
        <h2 className="text-2xl font-medium">Reset password</h2>
        <p>Enter your new password and confirm it to reset your password.</p>
      </div>

      <form
        onSubmit={handleResetPassword}
        className="flex flex-col w-full gap-4"
      >
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            New password
          </label>
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            startIcon={KeyRound}
            endIcon={showPassword ? EyeOff : Eye}
            onClickEndIcon={() => setShowPassword(!showPassword)}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium">
            Confirm new password
          </label>
          <Input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="Re-enter your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            startIcon={KeyRound}
            endIcon={showPassword ? EyeOff : Eye}
            onClickEndIcon={() => setShowPassword(!showPassword)}
            required
          />
        </div>

        <div className="flex items-start gap-2">
          <AlertCircle size={16} />
          <p className="text-xs text-left text-muted-foreground">
            Password should be a combination of letters, numbers and special
            characters
          </p>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            'Reset password'
          )}
        </Button>
      </form>

      <p>
        Remember your password?{' '}
        <Link href={routes.signIn} className="text-primary-base">
          Log in
        </Link>
      </p>
    </div>
  );
};
