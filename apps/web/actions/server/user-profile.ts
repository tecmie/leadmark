'use server';

import { createClient } from '@/supabase/client';
import {
  BackendResponse,
  IUser,
  OnboardingStatus,
  OnboardingStatusType,
} from '@repo/types';
import { fetchMailbox } from './mailbox';
import { fetchResources } from './resources';
import { fetchForwarderTool } from './tools';
import { transformUser } from '@/utils/transform-user';

const supabase = createClient();

export const checkOnboardingStatus = async (
  userId: string
): Promise<OnboardingStatus> => {
  let onboardingStatus: OnboardingStatusType = 'account_created';

  const mailbox = await fetchMailbox(userId);

  if (!mailbox.success) {
    return {
      onboardingStatus: onboardingStatus,
    };
  }

  onboardingStatus = 'mailbox_created';

  const forwarderTool = await fetchForwarderTool(userId);

  if (!forwarderTool.success) {
    return {
      onboardingStatus: onboardingStatus,
      mailbox: mailbox.data,
    };
  }

  onboardingStatus = 'forwarder_created';

  const resources = await fetchResources(userId);

  if (!resources.success) {
    return {
      onboardingStatus: onboardingStatus,
      mailbox: mailbox.data,
      forwarderEmail: forwarderTool.data,
    };
  }

  const { data: waitlistUser } = await supabase
    .from('waitlist')
    .select()
    .eq('user_id', userId)
    .single();

  if (waitlistUser?.is_onboard) {
    onboardingStatus = 'links_created';
  }

  return {
    onboardingStatus: onboardingStatus,
    mailbox: mailbox.data,
    forwarderEmail: forwarderTool.data,
    resources: resources.data,
  };
};

export const fetchProfileInfo = async (
  userId: string
): Promise<BackendResponse<IUser>> => {
  const { data, error } = await supabase
    .from('users')
    .select()
    .eq('id', userId);

  if (error || !data) {
    return {
      success: false,
      message: error.message ?? 'User not found',
    };
  }

  const status = await checkOnboardingStatus(data[0].id);

  const transformedUser = transformUser({
    user: data[0],
    metadata: {},
    onboarding: { ...status },
  });

  return {
    success: true,
    message: 'Profile information fetched successfully',
    data: transformedUser,
  };
};

export const updateProfileInfo = async (
  userModel: IUser
): Promise<BackendResponse<void>> => {
  const { error } = await supabase
    .from('users')
    .update({
      full_name: userModel.full_name,
      email: userModel.email,
    })
    .eq('id', userModel.id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: 'Profile information updated successfully',
  };
};

export const fetchUserData = async (): Promise<BackendResponse<IUser>> => {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return {
      success: false,
      message: error?.message ?? 'User not found',
    };
  }

  const transformedUser = transformUser({
    user: data.user,
    metadata: {},
    onboarding: {},
  });

  return {
    success: true,
    message: 'User data fetched successfully',
    data: transformedUser,
  };
};
