import { type NextRequest, NextResponse } from 'next/server';
import { routes } from '@/utils/routes';
import { OnboardingStatusEnum, OnboardingStepEnum } from '@repo/types';
import { createClient } from '@/supabase/server';

// List of public routes that don't require authentication
const publicRoutes = [
  routes.SIGN_IN,
  routes.SIGN_UP,
  routes.FORGOT_PASSWORD,
  routes.RESET_PASSWORD,
  routes.CONFIRM_EMAIL,
  '/', // home page
];

// List of onboarding routes
const onboardingRoutes = [
  routes.ONBOARDING_GET_STARTED,
  routes.ONBOARDING_SETUP_MAIL_ACCOUNT,
  routes.ONBOARDING_SETUP_RESOURCE,
  routes.ONBOARDING_CHOOSE_TEMPLATE,
  routes.ONBOARDING_CUSTOMIZE,
  routes.ONBOARDING_WELCOME,
];

export async function middleware(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the current path
    const path = request.nextUrl.pathname;

    // Check if the path is a public route
    const isPublicRoute = publicRoutes.includes(path);
    const isOnboardingRoute = onboardingRoutes.includes(path);

    // Get the user session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // If there's no session and trying to access a protected route
    if (!session && !isPublicRoute) {
      const redirectUrl = new URL(routes.SIGN_IN, request.url);
      redirectUrl.searchParams.set('redirectTo', path);
      return NextResponse.redirect(redirectUrl);
    }

    // If there's a session
    if (session) {
      // If trying to access auth pages while logged in
      if (isPublicRoute && path !== '/') {
        return NextResponse.redirect(
          new URL(routes.INBOX_OVERVIEW, request.url)
        );
      }

      // Get user's onboarding status and step
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_status, onboarding_step')
        .eq('id', session.user.id)
        .single();

      const onboardingStatus =
        profile?.onboarding_status as OnboardingStatusEnum;
      const onboardingStep = profile?.onboarding_step as OnboardingStepEnum;

      // If onboarding is not completed and trying to access non-onboarding routes
      if (
        onboardingStatus !== OnboardingStatusEnum.COMPLETED &&
        !isOnboardingRoute
      ) {
        // Redirect to the appropriate onboarding step
        switch (onboardingStep) {
          case OnboardingStepEnum.NOT_STARTED:
            return NextResponse.redirect(
              new URL(routes.ONBOARDING_GET_STARTED, request.url)
            );
          case OnboardingStepEnum.SETUP_MAIL:
            return NextResponse.redirect(
              new URL(routes.ONBOARDING_SETUP_MAIL_ACCOUNT, request.url)
            );
          case OnboardingStepEnum.RESOURCE:
            return NextResponse.redirect(
              new URL(routes.ONBOARDING_SETUP_RESOURCE, request.url)
            );
          case OnboardingStepEnum.CHOOSE_TEMPLATE:
            return NextResponse.redirect(
              new URL(routes.ONBOARDING_CHOOSE_TEMPLATE, request.url)
            );
          case OnboardingStepEnum.CUSTOMIZE:
            return NextResponse.redirect(
              new URL(routes.ONBOARDING_CUSTOMIZE, request.url)
            );
          case OnboardingStepEnum.WELCOME:
            return NextResponse.redirect(
              new URL(routes.ONBOARDING_WELCOME, request.url)
            );
          default:
            return NextResponse.redirect(
              new URL(routes.ONBOARDING_GET_STARTED, request.url)
            );
        }
      }

      // If onboarding is completed and trying to access onboarding routes
      if (
        onboardingStatus === OnboardingStatusEnum.COMPLETED &&
        isOnboardingRoute
      ) {
        return NextResponse.redirect(
          new URL(routes.INBOX_OVERVIEW, request.url)
        );
      }
    }

    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  } catch (e) {
    // If there's an error, allow the request to continue
    // This prevents the middleware from breaking the application
    console.error('Middleware error:', e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
