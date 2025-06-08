import { PropsWithChildren } from 'react';
import { Footer } from '../ui/footer';

export const AuthLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className="h-full min-h-[calc(100dvh)] flex flex-col px-4 py-6 sm:p-6">
      <section className="flex-1">{children}</section>
      <Footer />
    </main>
  );
};
