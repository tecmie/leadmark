'use client';

import { ProgressProvider } from '@bprogress/next/app';
import { Toaster } from 'sonner';
import React from 'react';

function Providers({ children }: React.PropsWithChildren) {
  return (
    <div>
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
    </div>
  );
}

export default Providers;
