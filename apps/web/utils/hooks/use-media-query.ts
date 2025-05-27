/**
 * Credits - Steven Tey (Dub.sh)
 */

import { useEffect, useState } from 'react';

export default function useMediaQuery() {
  const [screen, setScreen] = useState<'sm' | 'md' | 'lg' | null>(null);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    const checkDevice = () => {
      if (window.matchMedia('(max-width: 640px)').matches) {
        setScreen('sm');
      } else if (
        window.matchMedia('(min-width: 641px) and (max-width: 1024px)').matches
      ) {
        setScreen('md');
      } else {
        setScreen('lg');
      }
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    // Initial detection
    checkDevice();

    // Listener for windows resize
    window.addEventListener('resize', checkDevice);

    // Cleanup listener
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  return {
    screen,
    width: dimensions?.width,
    height: dimensions?.height,
    isMobile: screen === 'sm',
    isTablet: screen === 'md',
    isDesktop: screen === 'lg'
  };
}
