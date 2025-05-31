'use client';

import { Button } from '@/components/ui/button';
import { LogoMark } from '@/components/ui/logo-mark';
import { createClient } from '@/supabase/client';
import { routes } from '@/utils/routes';
import { AlertCircle, Eye, EyeOff, KeyRound, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Password updated successfully');
      router.push(routes.SIGN_IN);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 items-center w-full p-6 mx-auto max-w-[400px] min-h-[80vh] justify-center text-center">
      <div className="flex flex-col items-center w-full gap-1">
        <LogoMark />
        <h2 className="text-2xl font-medium">Reset password</h2>
        <p>Enter your new password and confirm it to reset your password.</p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full gap-4"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>New password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your new password"
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    startIcon={KeyRound}
                    endIcon={showPassword ? EyeOff : Eye}
                    onClickEndIcon={() => setShowPassword(!showPassword)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Confirm new password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Re-enter your new password"
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    startIcon={KeyRound}
                    endIcon={showPassword ? EyeOff : Eye}
                    onClickEndIcon={() => setShowPassword(!showPassword)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-start gap-2">
            <AlertCircle size={16} />
            <p className="text-xs text-left text-muted-foreground">
              Password should be a combination of letters, numbers and special
              characters
            </p>
          </div>

          <Button
            type="submit"
            className="w-full text-white bg-primary-base"
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              'Reset password'
            )}
          </Button>
        </form>
      </Form>

      <p>
        Remember your password?{' '}
        <Link href={routes.SIGN_IN} className="text-primary-base">
          Log in
        </Link>
      </p>
    </div>
  );
};
