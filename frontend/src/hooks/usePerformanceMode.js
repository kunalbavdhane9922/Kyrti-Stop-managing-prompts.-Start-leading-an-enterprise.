import { useState, useEffect } from 'react';

/**
 * Sovereign Protocol — Performance Mode Hook
 * Detects low-end devices, mobile browsers, and accessibility preferences
 * to gracefully degrade heavy animations and WebGL contexts.
 */
export function usePerformanceMode() {
  const [isLowPower, setIsLowPower] = useState(false);

  useEffect(() => {
    // 1. Accessibility: Reduced Motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // 2. Hardware: Low CPU core count (often correlates to low-end devices)
    const lowCores = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    
    // 3. Device: Mobile User Agent (WebGL fluid sims run poorly and drain battery on most mobile devices)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // 4. Network/Battery: Save-data mode or slow connections
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const isSlowConnection = connection && (connection.saveData || connection.effectiveType === '2g' || connection.effectiveType === '3g');

    if (prefersReducedMotion || lowCores || isMobile || isSlowConnection) {
      setIsLowPower(true);
    }
  }, []);

  return { isLowPower };
}
