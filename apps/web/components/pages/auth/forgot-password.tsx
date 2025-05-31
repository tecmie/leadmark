'use client';

import { Button } from '@/components/ui/button';
import { LogoMark } from '@/components/ui/logo-mark';
import { createClient } from '@/supabase/client';
import { routes } from '@/utils/routes';
import { Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetSuccess = searchParams?.get('success') === 'true';
  const supabase = createClient();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
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
            A password reset link has been sent to your email address (
            {form.getValues('email')}). Please check your inbox and click the
            link to reset your password.
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
    <div className="flex flex-col gap-8 items-center w-full p-6 mx-auto max-w-[400px] min-h-[80vh] justify-center text-center">
      <div className="flex flex-col items-center w-full gap-1">
        <LogoMark />
        <h2 className="text-2xl font-medium">Forgot your password?</h2>
        <p>
          Enter the email address associated with your account and we will send
          you a password reset link.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full gap-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email address"
                    {...field}
                    type="email"
                    startIcon={Mail}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full text-white bg-primary-base"
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              'Send reset link'
            )}
          </Button>
        </form>
      </Form>

      <p>
        Remember your password?{' '}
        <Link href={routes.SIGN_IN} className="text-blue-500 font-medium">
          Log in
        </Link>
      </p>
    </div>
  );
};
