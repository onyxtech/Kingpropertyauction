let scriptLoadPromise: Promise<void> | null = null;
let isLoaded = false;

export const fetchGoogleApiKey = async (): Promise<string> => {
  try {
    const response = await fetch("/api/settings/google-places-key");
    const data = await response.json();
    return data.success ? data.data.apiKey || "" : "";
  } catch {
    return "";
  }
};

export const loadGoogleMapsScript = async (apiKey: string): Promise<void> => {
  if (!apiKey) return;
  if (isLoaded && window.google?.maps?.places) return;

  if (scriptLoadPromise) return scriptLoadPromise;

  scriptLoadPromise = new Promise((resolve, reject) => {
    if (window.google?.maps?.places) {
      isLoaded = true;
      resolve();
      return;
    }

    const existing = document.getElementById("google-maps-script");
    if (existing) {
      existing.remove();
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      isLoaded = true;
      resolve();
    };
    script.onerror = () => {
      scriptLoadPromise = null;
      reject(new Error("Failed to load Google Maps"));
    };
    document.head.appendChild(script);
  });

  return scriptLoadPromise;
};

export interface ParsedAddress {
  streetNumber: string;
  streetAddress: string;
  city: string;
  area: string;
  state: string;
  country: string;
  postalCode: string;
  formattedAddress: string;
  lat?: number;
  lng?: number;
}

export const parseAddressComponents = (
  place: google.maps.places.PlaceResult
): ParsedAddress => {
  const components = place.address_components || [];
  const result: ParsedAddress = {
    streetNumber: "",
    streetAddress: "",
    city: "",
    area: "",
    state: "",
    country: "United Kingdom",
    postalCode: "",
    formattedAddress: place.formatted_address || "",
  };

  for (const component of components) {
    const types = component.types;
    if (types.includes("street_number"))
      result.streetNumber = component.long_name;
    if (types.includes("route"))
      result.streetAddress = component.long_name;
    if (types.includes("postal_town") || types.includes("locality"))
      result.city = component.long_name;
    if (types.includes("administrative_area_level_2"))
      result.area = component.long_name;
    if (types.includes("administrative_area_level_1"))
      result.state = component.long_name;
    if (types.includes("country"))
      result.country = component.long_name;
    if (types.includes("postal_code"))
      result.postalCode = component.long_name;
  }

  result.streetAddress = [result.streetNumber, result.streetAddress]
    .filter(Boolean)
    .join(" ");

  if (place.geometry?.location) {
    result.lat = place.geometry.location.lat();
    result.lng = place.geometry.location.lng();
  }

  return result;
};

export const initAutocomplete = (
  input: HTMLInputElement,
  onSelect: (address: ParsedAddress) => void,
  options?: { types?: string[]; country?: string | string[] }
): (() => void) => {
  if (!window.google?.maps?.places) return () => {};

  let dropdown: HTMLDivElement | null = null;
  let debounceTimer: ReturnType<typeof setTimeout>;

  const removeDropdown = () => {
    if (dropdown) { dropdown.remove(); dropdown = null; }
  };

  const createDropdown = (suggestions: { placeId: string; text: string }[]) => {
    removeDropdown();
    if (!suggestions.length) return;

    dropdown = document.createElement("div");
    Object.assign(dropdown.style, {
      position: "absolute",
      width: input.offsetWidth + "px",
      zIndex: "9999",
      background: "white",
      border: "2px solid #e2e8f0",
      borderRadius: "12px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
      overflow: "hidden",
      marginTop: "4px",
    });

    suggestions.forEach(({ placeId, text }) => {
      const item = document.createElement("button");
      item.type = "button";
      Object.assign(item.style, {
        width: "100%",
        padding: "12px 16px",
        textAlign: "left",
        fontSize: "14px",
        fontWeight: "500",
        color: "#334155",
        background: "white",
        border: "none",
        borderBottom: "1px solid #f1f5f9",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      });
      item.innerHTML = `
        <svg width="16" height="16" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" style="flex-shrink:0">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <span>${text}</span>
      `;

      item.addEventListener("mouseover", () => {
        item.style.background = "#eff6ff";
        item.style.color = "#2563eb";
      });
      item.addEventListener("mouseout", () => {
        item.style.background = "white";
        item.style.color = "#334155";
      });

      item.addEventListener("mousedown", async (e) => {
        e.preventDefault();
        input.value = text;
        removeDropdown();

        try {
          const { Place } = (window.google.maps.places as any);
          const place = new Place({ id: placeId });
          await place.fetchFields({
            fields: ["addressComponents", "formattedAddress", "location"],
          });

          const parsed: ParsedAddress = {
            streetNumber: "",
            streetAddress: "",
            city: "",
            area: "",
            state: "",
            country: "United Kingdom",
            postalCode: "",
            formattedAddress: place.formattedAddress || text,
          };

          if (place.location) {
            parsed.lat = place.location.lat();
            parsed.lng = place.location.lng();
          }

          for (const comp of (place.addressComponents || [])) {
            const types = comp.types || [];
            if (types.includes("street_number"))
              parsed.streetNumber = comp.longText;
            if (types.includes("route"))
              parsed.streetAddress = comp.longText;
            if (types.includes("postal_town") || types.includes("locality"))
              parsed.city = comp.longText;
            if (types.includes("administrative_area_level_2"))
              parsed.area = comp.longText;
            if (types.includes("administrative_area_level_1"))
              parsed.state = comp.longText;
            if (types.includes("country"))
              parsed.country = comp.longText;
            if (types.includes("postal_code"))
              parsed.postalCode = comp.longText;
          }

          parsed.streetAddress = [parsed.streetNumber, parsed.streetAddress]
            .filter(Boolean).join(" ");

          onSelect(parsed);
        } catch (err) {
          console.warn("Place details failed:", err);
          onSelect({
            streetNumber: "",
            streetAddress: text,
            city: "",
            area: "",
            state: "",
            country: "United Kingdom",
            postalCode: "",
            formattedAddress: text,
          });
        }
      });

      dropdown!.appendChild(item);
    });

    const rect = input.getBoundingClientRect();
    Object.assign(dropdown.style, {
      position: "fixed",
      width: rect.width + "px",
      top: (rect.bottom + window.scrollY) + "px",
      left: (rect.left + window.scrollX) + "px",
      zIndex: "99999",
    });

    document.body.appendChild(dropdown);
  };

  const handleInput = async () => {
    clearTimeout(debounceTimer);
    const value = input.value.trim();
    if (!value || value.length < 2) {
      removeDropdown();
      return;
    }

    debounceTimer = setTimeout(async () => {
      try {
        const { AutocompleteSuggestion } = (window.google.maps.places as any);
        const request = {
          input: value,
          includedRegionCodes: [
            typeof options?.country === "string"
              ? options.country
              : "gb"
          ],
        };

        const { suggestions } =
          await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);

        // Extract text and placeId from new API structure
        const parsed = (suggestions || []).map((s: any) => {
          const data = s.mh?.[0];
          return {
            placeId: data?.[1] || "",
            text: data?.[2]?.[0] || "",
          };
        }).filter((s: any) => s.text && s.placeId);

        createDropdown(parsed);
      } catch (err) {
        console.warn("Suggestions failed:", err);
        removeDropdown();
      }
    }, 300);
  };

  const handleBlur = () => {
    setTimeout(removeDropdown, 200);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") removeDropdown();
  };

  input.addEventListener("input", handleInput);
  input.addEventListener("blur", handleBlur);
  input.addEventListener("keydown", handleKeyDown);

  return () => {
    clearTimeout(debounceTimer);
    input.removeEventListener("input", handleInput);
    input.removeEventListener("blur", handleBlur);
    input.removeEventListener("keydown", handleKeyDown);
    removeDropdown();
  };
};
