'use client';

import { Button } from '@/components/ui/button';
import { LogoMark } from '@/components/ui/logo-mark';
import { createClient } from '@/supabase/client';
import { routes } from '@/utils/routes';
import { Eye, EyeOff, KeyRound, Loader2, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
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
import { useRouter } from '@bprogress/next/app';

const signUpSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    ),
  fullname: z.string().min(1, 'Full name is required'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      fullname: '',
    },
  });

  const [resendCountdown, setResendCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!canResend && resendCountdown > 0) {
      timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
    } else if (resendCountdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown, canResend]);

  const onSubmit = async (data: SignUpFormData) => {
    setLoading(true);

    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: data.fullname,
            onboarding_status: OnboardingStatusEnum.NOT_STARTED,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (authData?.user) {
        console.log('authData', authData);
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ onboarding_status: OnboardingStatusEnum.NOT_STARTED })
          .eq('id', authData.user.id);

        if (profileError) {
          toast.error(profileError.message);
          return;
        }
        form.reset({
          email: '',
          password: '',
          fullname: '',
        });
        router.push(routes.CONFIRM_EMAIL + '?email=' + data.email);
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
        <h2 className="text-2xl font-bold">Create an account</h2>
        <p>Your journey to an AI automated inbox starts here.</p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col w-full gap-4"
        >
          <FormField
            control={form.control}
            name="fullname"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your full name"
                    {...field}
                    startIcon={User}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              'Create account'
            )}
          </Button>
        </form>
      </Form>

      <p>
        Already have an account?{' '}
        <Link href={routes.SIGN_IN} className="text-primary font-medium">
          Log in
        </Link>
      </p>
    </div>
  );
};
