import { useState, useEffect } from "react";

export function useGPS() {
  const [coordinates, setCoordinates] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [hasGPS, setHasGPS] = useState(false);
  const [error, setError] = useState(null);

  const getCurrentPosition = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setAccuracy(position.coords.accuracy);
        setHasGPS(true);
        setError(null);
      },
      (error) => {
        setError(error.message);
        setHasGPS(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  useEffect(() => {
    getCurrentPosition();
  }, []);

  const refreshLocation = () => {
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
