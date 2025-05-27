'use client';

import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import React from 'react';

function Providers({ children }: React.PropsWithChildren) {
  return (
    <div>
      <ProgressBar
        options={{ showSpinner: false }}
        shallowRouting
        color="#8DA6E1"
        height="3px"
      />
      {children}
    </div>
  );
}

export default Providers;
