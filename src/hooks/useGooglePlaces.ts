import { useEffect, useRef, useCallback, useState } from "react";
import {
  loadGoogleMapsScript,
  fetchGoogleApiKey,
  initAutocomplete,
  ParsedAddress,
} from "@/lib/googlePlaces";

interface UseGooglePlacesOptions {
  onSelect: (address: ParsedAddress) => void;
  country?: string | string[];
  types?: string[];
}

export const useGooglePlaces = ({
  onSelect,
  country = "gb",
  types = ["address"],
}: UseGooglePlacesOptions) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const [isReady, setIsReady] = useState(false);
  const onSelectRef = useRef(onSelect);
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  const initialize = useCallback(async () => {
    if (!inputRef.current) return;

    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }

    try {
      if (!window.google?.maps?.places) {
        const apiKey = await fetchGoogleApiKey();
        if (!apiKey) return;
        await loadGoogleMapsScript(apiKey);
      }

      if (!inputRef.current) return;

      cleanupRef.current = initAutocomplete(
        inputRef.current,
        (address) => onSelectRef.current(address),
        { country, types }
      );
      setIsReady(true);
    } catch (err) {
      console.warn("Google Places not available:", err);
    }
  }, [country, types]);

  useEffect(() => {
    initialize();

    const interval = setInterval(() => {
      if (window.google?.maps?.places && !cleanupRef.current) {
        initialize();
        clearInterval(interval);
      }
    }, 500);

    const timeout = setTimeout(() => clearInterval(interval), 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [initialize]);

  return { inputRef, isReady };
};
