'use client';

import { ProgressProvider } from '@bprogress/next/app';
import { Toaster } from 'sonner';
import React from 'react';
import { ThemeProvider } from '@/components/ui/theme-provider';

function Providers({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      forcedTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <Toaster
        expand
        richColors
        closeButton
        visibleToasts={3}
        toastOptions={{
          duration: 3000,
        }}
        position="top-right"
        // icons={{
        //   success: <CheckCircle />,
        //   info: <Info />,
        //   warning: <AlertTriangle />,
        //   error: <AlertCircle />,
        //   loading: <Loader2 />,
        // }}
      />
      <ProgressProvider
        options={{ showSpinner: false }}
        shallowRouting
        color="#8DA6E1"
        height="3px"
      >
        {children}
      </ProgressProvider>
    </ThemeProvider>
  );
}

export default Providers;
