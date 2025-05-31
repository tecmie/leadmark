'use server';

import {
  BackendResponse,
  CreateAccountOptions,
  IUser,
  LoginOptions,
  OauthOptions,
  ResetPasswordOptions,
  UpdatePasswordOptions,
} from '@repo/types';
import { getURL } from '@/utils/helpers';
import { transformUser } from '@/utils/transform-user';
import { AuthError, Session, User } from '@supabase/supabase-js';
import { checkOnboardingStatus, checkOnboardingStep } from './user-profile';
import { createClient } from '@/supabase/server';
import { cookies } from 'next/headers';

const getUrl = getURL();

const _handleUserResponse = async (
  data: { user: User | null; session?: Session | null },
  error: AuthError | null,
  successMessage: string
): Promise<BackendResponse<IUser>> => {
  if (error || !data.user) {
    return {
      success: false,
      message: error?.message ?? 'Could not update password',
    };
  }

  const status = await checkOnboardingStatus(data.user.id);
  const step = await checkOnboardingStep(data.user.id);

  const transformedUser = transformUser({
    user: data.user,
    metadata: {},
    onboarding: {
      onboardingStatus: status,
      onboardingStep: step,
    },
  });

  return {
    success: true,
    message: successMessage,
    data: transformedUser,
  };
};

export async function logout() {
  const supabase = await  createClient();
  const { error } = await supabase.auth.signOut();
  //clear all cookies
  const cookieStore = await cookies();
  cookieStore.delete('supabase-auth-token');
  cookieStore.delete('supabase-auth-token-type');
  cookieStore.delete('supabase-auth-token-expires-at');
  cookieStore.delete('supabase-auth-token-refresh-token');
  cookieStore.delete('supabase-auth-token-access-token');
  cookieStore.delete('supabase-auth-token-access-token-expires-at');
  cookieStore.delete('supabase-auth-token-access-token-refresh-token');
  cookieStore.delete('supabase-auth-token-access-token-access-token');
  if (error) {
    console.error('Error:', error);
  }

  return {
    success: true,
    message: 'Logout successful',
  };
}

export const socialProviderAuth = async ({ provider }: OauthOptions) => {
    const supabase = await  createClient();

  await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${getURL}/auth/callback`,
    },
  });
};

export const resendConfirmationEmail = async (): Promise<BackendResponse> => {
  const user = await getUserDetails();
  const email = user?.email;

  if (!email)
    return {
      success: false,
      /* NB: this error message can be misleading */
      message: 'No valid email found',
    };

    const supabase = await  createClient();

  const { data, error } = await supabase.auth.resend({
    type: 'signup',
    email,
  });

  if (error || !data.user) {
    return {
      success: false,
      message: error?.message ?? 'Confirmation email not sent',
    };
  }

  return {
    success: true,
    message: 'Confirmation email sent successfully',
  };
};

export const resetPassword = async ({
  email,
}: ResetPasswordOptions): Promise<BackendResponse<void>> => {
    const supabase = await  createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getUrl}/auth/reset-password`,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: 'Password reset request sent successfully',
  };
};

export const updatePassword = async ({
  newPassword: password,
}: UpdatePasswordOptions): Promise<BackendResponse<IUser>> => {
    const supabase = await  createClient();

  const { data, error } = await supabase.auth.updateUser({
    password,
  });

  return await _handleUserResponse(
    data,
    error,
    'Password reset request sent successfully'
  );
};

export const login = async ({
  email,
  password,
}: LoginOptions): Promise<BackendResponse<IUser>> => {
    const supabase = await  createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  const result = await _handleUserResponse(data, error, 'Login successful');

  return result;
};

export const createAccount = async ({
  email,
  password,
  fullname,
}: CreateAccountOptions): Promise<BackendResponse<IUser>> => {
  /** @TODO: Review functions .. This should be another implementation where leadmark emails are rejected 8? */
  // else people will use their proposed leadmark email to create an account and create forwarders
  // if (isEmailBlacklisted(email)) {
  //   return {
  //     success: false,
  //     message: 'Email address is blacklisted'
  //   };
  // }

  // if (isReservedAddress(email)) {
  //   return {
  //     success: false,
  //     message: 'Email address is reserved'
  //   };
  // }

    const supabase = await  createClient();

  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: { fullname },
      emailRedirectTo: `${getURL}/auth/callback`,
    },
  });

  const result = await _handleUserResponse(
    data,
    error,
    'Account created successfully'
  );

  return result;
};

export const getUserDetails = async () => {
  try {
      const supabase = await  createClient();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    
    const { data: userDetails } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    return userDetails;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export async function getSession() {
    const supabase = await  createClient();

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

export async function getOrAddToWaitlist(id: string) {
  // TODO: Implement waitlist table in database schema
  return {
    success: false,
    message: "Waitlist functionality not yet implemented - missing 'waitlist' table",
  };
}
