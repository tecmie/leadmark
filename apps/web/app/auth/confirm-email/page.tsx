import ConfirmEmailPage from '@/components/pages/auth/confirm-email';
import { Suspense } from 'react';

export default function ConfirmEmail() {
  return (
    <Suspense fallback={<></>}>
      <ConfirmEmailPage />
    </Suspense>
  );
}
