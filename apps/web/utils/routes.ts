export const routes = {
  // Auth routes
  SIGN_IN: '/auth/signin',
  SIGN_UP: '/auth/signup',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',

  // Onboarding routes
  ONBOARDING_GET_STARTED: '/onboarding',
  ONBOARDING_SETUP_MAIL_ACCOUNT: '/onboarding/setup-mail',
  ONBOARDING_SETUP_RESOURCE: '/onboarding/resource',
  ONBOARDING_CHOOSE_TEMPLATE: '/onboarding/choose-template',
  ONBOARDING_CUSTOMIZE: '/onboarding/customize',
  ONBOARDING_WELCOME: '/onboarding/welcome',
  BILLING: '/account',

  // Inbox routes
  INBOX_OVERVIEW: '/inbox/u',
  INBOX_SPAM: '/inbox/spam',
  INBOX_TRASH: '/inbox/trash',
  INBOX_VIEWER: '/inbox/u/',
  INBOX_IMPORTANT: '/inbox/imp',
  INBOX_ATTENTION: '/inbox/attention',
  INBOX_REPLY: '/inbox/u/[:namespace]/reply',

  // Settings routes
  PROFILE: '/profile',
  SETTINGS: '/settings',
  SETTINGS_DOCUMENTS: '/settings/documents',
  SETTINGS_LINKS: '/settings/links',
  SETTINGS_ACTIONS: '/settings/actions',
  SETTINGS_INTEGRATIONS: '/settings/integrations',

  // Apps routes
  APPS: '/apps',
};
