import { AuthLayout } from "@/components/layouts/auth-layout";
import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import { routes } from "@/utils/routes";
import { PropsWithChildren } from "react";

export default async function Layout({ children }: PropsWithChildren) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (user.user?.id) {
    return redirect(routes.ONBOARDING_GET_STARTED);
  }
  return <AuthLayout>{children}</AuthLayout>;
}
