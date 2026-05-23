import { useEffect } from "react";
import { fetchGoogleApiKey, loadGoogleMapsScript } from "@/lib/googlePlaces";

export const useInitGoogleMaps = () => {
  useEffect(() => {
    const init = async () => {
      try {
        const apiKey = await fetchGoogleApiKey();
        if (apiKey) {
          await loadGoogleMapsScript(apiKey);
        }
      } catch {
        // Silent fail - Google Places is optional enhancement
      }
    };
    init();
  }, []);
};
