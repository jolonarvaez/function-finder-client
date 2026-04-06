"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type GeolocationStatus = "idle" | "loading" | "granted" | "denied" | "unavailable";

export type GeolocationState = {
  coords: { lng: number; lat: number } | null;
  status: GeolocationStatus;
  /** Call directly from a user gesture (e.g. button onClick) to request location */
  start: () => void;
  stop: () => void;
};

export function useGeolocation(): GeolocationState {
  const [coords, setCoords] = useState<{ lng: number; lat: number } | null>(null);
  const [status, setStatus] = useState<GeolocationStatus>("idle");
  const watchIdRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setStatus("unavailable");
      return;
    }

    stop();
    setStatus("loading");

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setCoords({ lng: pos.coords.longitude, lat: pos.coords.latitude });
        setStatus("granted");
      },
      (err) => {
        setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "unavailable");
        stop();
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [stop]);

  // Proactively detect if permission is already denied so the banner shows
  // immediately without requiring a click
  useEffect(() => {
    if (typeof navigator === "undefined" || !("permissions" in navigator)) return;
    navigator.permissions
      .query({ name: "geolocation" })
      .then((result) => {
        if (result.state === "denied") setStatus("denied");
        result.addEventListener("change", () => {
          if (result.state === "denied") setStatus("denied");
          else if (result.state === "prompt") setStatus("idle");
        });
      })
      .catch(() => {
        /* permissions API not supported */
      });
  }, []);

  // Clean up the watcher when the component unmounts
  useEffect(() => () => stop(), [stop]);

  return { coords, status, start, stop };
}
