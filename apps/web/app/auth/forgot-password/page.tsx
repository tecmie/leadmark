import { ForgotPasswordPage } from '@/components/pages/auth/forgot-password';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordPage />
    </Suspense>
  );
}
