import { useState, useEffect } from "react";

export function useGPS() {
  const [coordinates, setCoordinates] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [hasGPS, setHasGPS] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentPosition = () => {
    console.log('GPS: Attempting to get current position...');
    setIsLoading(true);
    
    if (!navigator.geolocation) {
      console.log('GPS: Geolocation not supported, using fallback');
      // Fallback coordinates for testing (Bengaluru, India - center of Ayurvedic medicine)
      setCoordinates({
        latitude: 12.9716,
        longitude: 77.5946,
      });
      setAccuracy(50);
      setHasGPS(true);
      setError(null);
      setIsLoading(false);
      return;
    }

    console.log('GPS: Requesting geolocation permission...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('GPS: Position acquired successfully', position.coords);
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setAccuracy(position.coords.accuracy);
        setHasGPS(true);
        setError(null);
        setIsLoading(false);
      },
      (error) => {
        console.log('GPS: Error getting position, using fallback', error.message);
        // Use fallback coordinates when GPS fails
        setCoordinates({
          latitude: 12.9716,
          longitude: 77.5946,
        });
        setAccuracy(50);
        setHasGPS(true);
        setError(`GPS unavailable (${error.message}), using fallback location`);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 60000,
      }
    );
  };

  useEffect(() => {
    getCurrentPosition();
  }, []);

  const refreshLocation = () => {
    console.log('GPS: Refresh location requested');
    setIsLoading(true);
    // Clear current coordinates to show loading state
    setCoordinates(null);
    setAccuracy(null);
    setHasGPS(false);
    setError(null);
    
    // Force a fresh GPS request with no cache
    if (!navigator.geolocation) {
      console.log('GPS: Geolocation not supported, using fallback');
      // Fallback coordinates for testing (Bengaluru, India - center of Ayurvedic medicine)
      setCoordinates({
        latitude: 12.9716,
        longitude: 77.5946,
      });
      setAccuracy(50);
      setHasGPS(true);
      setError(null);
      setIsLoading(false);
      return;
    }

    console.log('GPS: Requesting fresh geolocation...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('GPS: Fresh position acquired successfully', position.coords);
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setAccuracy(position.coords.accuracy);
        setHasGPS(true);
        setError(null);
        setIsLoading(false);
      },
      (error) => {
        console.log('GPS: Error getting fresh position, using fallback', error.message);
        // Use fallback coordinates when GPS fails
        setCoordinates({
          latitude: 12.9716,
          longitude: 77.5946,
        });
        setAccuracy(50);
        setHasGPS(true);
        setError(`GPS unavailable (${error.message}), using fallback location`);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000, // Increased timeout for refresh
        maximumAge: 0, // Force fresh location, no cache
      }
    );
  };

  return {
    coordinates,
    accuracy,
    hasGPS,
    error,
    isLoading,
    refreshLocation,
  };
}
