import { useState, useEffect } from "react";

export function useOffline() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Simple function to test connectivity by trying to load a tiny image
    const testConnectivity = () => {
      const img = new Image();
      const timeout = setTimeout(() => {
        setIsOffline(true);
      }, 2000); // 2 second timeout

      img.onload = () => {
        clearTimeout(timeout);
        setIsOffline(false);
      };

      img.onerror = () => {
        clearTimeout(timeout);
        setIsOffline(true);
      };

      // Use a tiny image from a reliable CDN with cache busting
      img.src = `https://www.google.com/favicon.ico?t=${Date.now()}`;
    };

    const handleOnline = () => {
      testConnectivity();
    };
    
    const handleOffline = () => {
      setIsOffline(true);
    };

    // Initial test
    testConnectivity();

    // Listen to browser events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Test every 10 seconds
    const intervalId = setInterval(testConnectivity, 10000);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOffline };
}
