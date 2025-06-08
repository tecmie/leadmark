"use server";

import { createClient } from "@/supabase/server";
import {
  BackendResponse,
  IUser,
  OnboardingStatusEnum,
  OnboardingStatusType,
  OnboardingStepType,
} from "@repo/types";
import { fetchMailbox } from "./mailbox";
import { fetchResources } from "./resources";
import { fetchForwarderTool } from "./tools";
import { transformUser } from "@/utils/transform-user";

// export const checkOnboardingStatus = async (
//   userId: string
// ): Promise<OnboardingStatus> => {
//   let onboardingStatus: OnboardingStatusType = 'account_created';

//   const mailbox = await fetchMailbox(userId);

//   if (!mailbox.success) {
//     return {
//       onboardingStatus: onboardingStatus,
//     };
//   }

//   onboardingStatus = 'mailbox_created';

//   const forwarderTool = await fetchForwarderTool(userId);

//   if (!forwarderTool.success) {
//     return {
//       onboardingStatus: onboardingStatus,
//       mailbox: mailbox.data,
//     };
//   }

//   onboardingStatus = 'forwarder_created';

//   const resources = await fetchResources(userId);

//   if (!resources.success) {
//     return {
//       onboardingStatus: onboardingStatus,
//       mailbox: mailbox.data,
//       forwarderEmail: forwarderTool.data,
//     };
//   }

//   const { data: waitlistUser } = await supabase
//     .from('waitlist')
//     .select()
//     .eq('user_id', userId)
//     .single();

//   if (waitlistUser?.is_onboard) {
//     onboardingStatus = 'links_created';
//   }

//   return {
//     onboardingStatus: onboardingStatus,
//     mailbox: mailbox.data,
//     forwarderEmail: forwarderTool.data,
//     resources: resources.data,
//   };
// };

export const fetchProfileInfo = async (
  userId: string
): Promise<BackendResponse<IUser>> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select()
    .eq("id", userId)
    .single();

  if (error || !data) {
    return {
      success: false,
      message: error.message ?? "User not found",
    };
  }

  const status = await checkOnboardingStatus(data.id);
  const step = await checkOnboardingStep(data.id);

  const transformedUser = transformUser({
    user: data,
    metadata: {},
    onboarding: {
      onboardingStatus: status,
      onboardingStep: step,
    },
  });

  return {
    success: true,
    message: "Profile information fetched successfully",
    data: transformedUser,
  };
};

export const updateProfileInfo = async (
  userModel: IUser
): Promise<BackendResponse<void>> => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: userModel.full_name,
      email: userModel.email,
    })
    .eq("id", userModel.id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Profile information updated successfully",
  };
};

export const fetchUserData = async (): Promise<BackendResponse<IUser>> => {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return {
      success: false,
      message: error?.message ?? "User not found",
    };
  }

  const transformedUser = transformUser({
    user: data.user,
    metadata: {},
    onboarding: {},
  });

  return {
    success: true,
    message: "User data fetched successfully",
    data: transformedUser,
  };
};

// Update onboarding progress (step and status) for a user
export const updateOnboardingProgress = async (
  userId: string,
  onboardingStatus: OnboardingStatusType,
  onboardingStep: OnboardingStepType
): Promise<BackendResponse<void>> => {
  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      onboarding_status: onboardingStatus,
      onboarding_step: onboardingStep,
    })
    .eq("id", userId);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Onboarding progress updated successfully",
  };
};
// add onboarding step check
export const checkOnboardingStep = async (
  userId: string
): Promise<OnboardingStepType> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("onboarding_step")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return "not_started";
  }

  return (data.onboarding_step as OnboardingStepType) ?? "not_started";
};

export const checkOnboardingStatus = async (
  userId: string
): Promise<OnboardingStatusType> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("onboarding_status")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return "not_started";
  }

  return (data.onboarding_status as OnboardingStatusType) ?? "not_started";
};

export const updateGoogleAccessToken = async (
  accessToken: string,
  refreshToken?: string
): Promise<BackendResponse<void>> => {
  const supabase = await createClient();

  const { data: user, error: userError } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("profiles")
    .update({
      google_calendar_token: accessToken,
      google_refresh_token: refreshToken,
      google_connected_at: new Date().toISOString(),
    })
    .eq("id", user!.user!.id);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Google access token saved successfully",
  };
};

export const getGoogleAccessToken = async (
  userId: string
): Promise<BackendResponse<{ accessToken: string; refreshToken?: string }>> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("google_calendar_token, google_refresh_token")
    .eq("id", userId)
    .single();

  if (error || !data) {
    return {
      success: false,
      message: error?.message ?? "User not found",
    };
  }

  if (!data.google_calendar_token) {
    return {
      success: false,
      message: "No Google access token found",
    };
  }

  return {
    success: true,
    message: "Google access token retrieved successfully",
    data: {
      accessToken: data.google_calendar_token,
      refreshToken: data.google_refresh_token ?? "",
    },
  };
};
