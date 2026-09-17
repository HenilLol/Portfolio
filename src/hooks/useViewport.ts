import { useState, useEffect } from 'react';

export interface ViewportState {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  hasTouch: boolean;
}

export function useViewport(): ViewportState {
  const [viewport, setViewport] = useState<ViewportState>(() => {
    if (typeof window === 'undefined') {
      return {
        width: 1280,
        height: 800,
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        hasTouch: false,
      };
    }
    const width = window.innerWidth;
    const height = window.innerHeight;
    return {
      width,
      height,
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
      hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: number;

    const handleResize = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        setViewport({
          width,
          height,
          isMobile: width < 768,
          isTablet: width >= 768 && width < 1024,
          isDesktop: width >= 1024,
          hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        });
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return viewport;
}
