'use client';

import { Button } from '@/components/ui/button';
import { LogoMark } from '@/components/ui/logo-mark';
import { createClient } from '@/supabase/client';
import { routes } from '@/utils/routes';
import { Eye, EyeOff, KeyRound, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
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
import { OnboardingStatusEnum } from '@repo/types';
import { checkOnboardingStatus } from '@/actions/server/user-profile';

const signInSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type SignInFormData = z.infer<typeof signInSchema>;

export const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    setLoading(true);

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      console.log(error);
      if (error) {
        toast.error(error.message);
        return;
      }

      if (authData?.user) {
        const onboardingStatus = await checkOnboardingStatus(
          authData?.user?.id || ''
        );
        if (onboardingStatus === OnboardingStatusEnum.COMPLETED) {
          router.push(routes.INBOX_OVERVIEW);
        } else {
          toast.success('Successfully signed in!');
          router.push(routes.ONBOARDING_GET_STARTED);
        }
      }
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
        <h2 className="text-2xl font-bold">Log in to your account</h2>
        <p>Start managing your inbox right away.</p>
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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your password"
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

          <div className="flex items-center justify-end">
            <Link
              href={routes.FORGOT_PASSWORD}
              className="text-sm font-medium text-primary-base"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full "
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              'Log in'
            )}
          </Button>
        </form>
      </Form>

      <p>
        Don&apos;t have an account yet?{' '}
        <Link href={routes.SIGN_UP} className="text-primary font-medium">
          Create an account
        </Link>
      </p>
    </div>
  );
};
