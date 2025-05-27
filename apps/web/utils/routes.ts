export const routes = {
  // Auth routes
  signIn: '/auth/signin',
  signUp: '/auth/signup',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  // signIn: '/unstable_signin',
  // signUp: '/unstable_signin',
  // forgotPassword: '/unstable_signin',
  // resetPassword: '/unstable_signin',

  // Onboarding routes
  getStarted: '/onboarding/get-started',
  setupMailAccount: '/onboarding/setup-mail',
  setupForwarder: '/onboarding/setup-forwarder',
  setupInboxLinks: '/onboarding/setup-links',
  welcome: '/onboarding/welcome',
  billing: '/account',

  // Inbox routes
  inboxOverview: '/inbox/u',
  inboxSpam: '/inbox/spam',
  inboxTrash: '/inbox/trash',
  inboxViewer: '/inbox/u/',
  inboxImportant: '/inbox/imp',
  inboxAttention: '/inbox/attention',
  inboxReply: '/inbox/u/[:namespace]/reply',

  // Settings routes
  profile: '/profile',
  settings: '/settings',
  settingsDocuments: '/settings/documents',
  settingsLinks: '/settings/links',
  settingsActions: '/settings/actions',
  settingsIntegrations: '/settings/integrations',

  // Apps routes
  apps: '/apps'
};
