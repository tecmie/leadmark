import type {
  IUser,
  IMailbox,
  OnboardingStatusType,
  OnboardingStepType,
  IResource
} from '@repo/types';
import type { User } from '@supabase/supabase-js';

type TransformUserOptions = {
  user: any; //User | Tables<'users'>;
  metadata: {
    bio?: string;
    link?: string;
    avatar_url?: string | null;
    full_name?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    username?: string | null;
    billing_address?: string | null;
    payment_method?: string | null;
  };
  onboarding: {
    onboardingStatus?: OnboardingStatusType;
    mailbox?: IMailbox;
    forwarderEmail?: string;
    resources?: IResource[];
    onboardingStep?: OnboardingStepType;
  };
  token?: string;
};

export const transformUser = ({
  user,
  metadata: {
    bio = '',
    link = '',
    avatar_url = null,
    first_name = null,
    last_name = null,
    full_name = null,
    username = null,
    billing_address = null,
    payment_method = null,
  },
  onboarding: {
    onboardingStatus = 'not_started',
    onboardingStep = 'not_started',
    forwarderEmail = '',
    // mailbox, // Not available in schema
    resources = [],
  },
  token = '',
}: TransformUserOptions): IUser => {
  const id = user.id;
  const email = user.email ?? '';

  return {
    id,
    email,
    avatar_url,
    // billing_address, // Not available in schema
    // first_name, // Not available in schema
    full_name: (user as User).user_metadata?.fullname ?? full_name,
    // last_name, // Not available in schema
    // payment_method, // Not available in schema
    // username, // Not available in schema
    // user_metadata: { // Not available in schema
    //   bio: (user as User).user_metadata?.bio ?? bio,
    //   link: (user as User).user_metadata?.link ?? link,
    // },
    // token, // Not available in schema
    google_calendar_token: null,
    google_connected_at: null,
    google_refresh_token: null,
    onboarding_status: onboardingStatus,
    onboarding_step: null,
    updated_at: null,
    // forwarderEmail, // Not available in schema
    // mailbox, // Not available in schema
    // resources, // Not available in schema
  };
};
