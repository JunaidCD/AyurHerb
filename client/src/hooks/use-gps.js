import { useState, useEffect } from "react";

export function useGPS() {
  const [coordinates, setCoordinates] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [hasGPS, setHasGPS] = useState(false);
  const [error, setError] = useState(null);

  const getCurrentPosition = () => {
    console.log('GPS: Attempting to get current position...');
    
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
    getCurrentPosition();
  };

  return {
    coordinates,
    accuracy,
    hasGPS,
    error,
    refreshLocation,
  };
}
