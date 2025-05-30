import { AuthLayout } from '@/components/layouts/auth-layout';
import { PropsWithChildren } from 'react';

export default async function Layout({ children }: PropsWithChildren) {
  return <AuthLayout>{children}</AuthLayout>;
}
