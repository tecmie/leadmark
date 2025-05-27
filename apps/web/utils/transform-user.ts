import type {
  GPTIUser,
  MailBox,
  OnboardingStatusType,
  Resource,
  Tables
} from '@repo/types';
import type { User } from '@supabase/supabase-js';

type TransformUserOptions = {
  user: any;//User | Tables<'users'>;
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
    mailbox?: MailBox;
    forwarderEmail?: string;
    resources?: Resource[];
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
    payment_method = null
  },
  onboarding: {
    onboardingStatus = 'account_created',
    forwarderEmail = '',
    mailbox,
    resources = []
  },
  token = ''
}: TransformUserOptions): GPTIUser => {
  const id = user.id;
  const email = user.email ?? '';

  return {
    id,
    email,
    avatar_url,
    billing_address,
    first_name,
    full_name: (user as User).user_metadata?.fullname ?? full_name,
    last_name,
    payment_method,
    username,
    user_metadata: {
      bio: (user as User).user_metadata?.bio ?? bio,
      link: (user as User).user_metadata?.link ?? link
    },
    token,
    onboardingStatus,
    forwarderEmail,
    mailbox,
    resources
  };
};
