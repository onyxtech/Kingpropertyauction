import { useState, useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import {
  fetchGoogleApiKey,
  loadGoogleMapsScript,
  ParsedAddress,
} from "@/lib/googlePlaces";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect: (address: ParsedAddress) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
  inputClassName?: string;
  country?: string | string[];
  disabled?: boolean;
}

export default function AddressAutocomplete({
  value,
  onChange,
  onAddressSelect,
  placeholder = "Start typing address...",
  label,
  required = false,
  className = "",
  inputClassName = "",
  country = "gb",
  disabled = false,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const initDoneRef = useRef(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        if (!window.google?.maps?.places) {
          const apiKey = await fetchGoogleApiKey();
          if (!apiKey) return;
          await loadGoogleMapsScript(apiKey);
        }
        if (window.google?.maps?.places?.AutocompleteSuggestion) {
          setIsReady(true);
        }
      } catch (err) {
        console.warn("Init failed:", err);
      }
    };
    init();

    const interval = setInterval(() => {
      if (window.google?.maps?.places?.AutocompleteSuggestion) {
        setIsReady(true);
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const searchTimeoutRef = useRef<any>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const removeDropdown = () => {
    if (dropdownRef.current) {
      if ((dropdownRef.current as any)._cleanup) {
        (dropdownRef.current as any)._cleanup();
      }
      dropdownRef.current.remove();
      dropdownRef.current = null;
    }
  };

  const showDropdown = (suggestions: { placeId: string; text: string }[]) => {
    removeDropdown();
    if (!suggestions.length || !inputRef.current) return;

    const rect = inputRef.current.getBoundingClientRect();
    const div = document.createElement("div");
    Object.assign(div.style, {
      position: "fixed",
      top: rect.bottom + "px",
      left: rect.left + "px",
      width: rect.width + "px",
      zIndex: "99999",
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
      item.innerHTML = `
        <svg width="16" height="16" fill="none" stroke="#94a3b8" viewBox="0 0 24 24" style="flex-shrink:0;margin-right:8px">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        ${text}
      `;
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
      });

      item.onmouseover = () => {
        item.style.background = "#eff6ff";
      };
      item.onmouseout = () => {
        item.style.background = "white";
      };

      item.onmousedown = async (e) => {
        e.preventDefault();
        onChange(text);
        removeDropdown();

        try {
          const { Place } = window.google.maps.places as any;
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

          for (const comp of place.addressComponents || []) {
            const types = comp.types || [];
            if (types.includes("street_number"))
              parsed.streetNumber = comp.longText;
            if (types.includes("route")) parsed.streetAddress = comp.longText;
            if (types.includes("postal_town") || types.includes("locality"))
              parsed.city = comp.longText;
            if (types.includes("administrative_area_level_2"))
              parsed.area = comp.longText;
            if (types.includes("administrative_area_level_1"))
              parsed.state = comp.longText;
            if (types.includes("country")) parsed.country = comp.longText;
            if (types.includes("postal_code"))
              parsed.postalCode = comp.longText;
          }

          parsed.streetAddress = [parsed.streetNumber, parsed.streetAddress]
            .filter(Boolean)
            .join(" ");

          onAddressSelect(parsed);
        } catch (err) {
          onAddressSelect({
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
      };

      div.appendChild(item);
    });

    document.body.appendChild(div);
    dropdownRef.current = div;

    // Reposition on scroll/resize
    const reposition = () => {
      if (inputRef.current && dropdownRef.current) {
        const newRect = inputRef.current.getBoundingClientRect();
        dropdownRef.current.style.top = newRect.bottom + "px";
        dropdownRef.current.style.left = newRect.left + "px";
        dropdownRef.current.style.width = newRect.width + "px";
      }
    };
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    (div as any)._cleanup = () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);

    if (!val || val.length < 2) return;

    if (!window.google?.maps?.places?.AutocompleteSuggestion) return;

    clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const { AutocompleteSuggestion } = window.google.maps.places as any;
        const { suggestions } =
          await AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: val,
            includedRegionCodes: [typeof country === "string" ? country : "gb"],
          });

        const mapped = (suggestions || []).map((s: any) => {
          try {
            // Method 1: Direct placePrediction API (newer)
            if (s.placePrediction) {
              return {
                placeId:
                  s.placePrediction.placeId ||
                  s.placePrediction.place?.id ||
                  "",
                text:
                  s.placePrediction.text?.text ||
                  s.placePrediction.structuredFormat?.mainText?.text ||
                  "",
              };
            }

            // Method 2: Parse internal structure
            const raw = JSON.parse(JSON.stringify(s));

            // Try known internal keys
            const data =
              raw.mh?.[0] ||
              raw.nh?.[0] ||
              raw.oh?.[0] ||
              raw.ph?.[0] ||
              raw.Bh?.[0] ||
              raw.Ch?.[0];
            if (data) {
              return {
                placeId: data?.[1] || "",
                text: data?.[2]?.[0] || data?.[3]?.[0] || "",
              };
            }

            // Method 3: Find any array with placeId pattern
            const keys = Object.keys(raw);
            for (const key of keys) {
              if (Array.isArray(raw[key]) && raw[key].length > 0) {
                const item = raw[key][0];
                if (Array.isArray(item) && item.length >= 3) {
                  const possibleId = item[1];
                  const possibleText = item[2];
                  if (
                    typeof possibleId === "string" &&
                    possibleId.length > 10 &&
                    (typeof possibleText === "string" ||
                      Array.isArray(possibleText))
                  ) {
                    return {
                      placeId: possibleId,
                      text: Array.isArray(possibleText)
                        ? possibleText[0]
                        : possibleText,
                    };
                  }
                }
              }
            }

            // Method 4: Log full structure for debugging
            console.log("Suggestion structure:", JSON.stringify(raw, null, 2));
            return { placeId: "", text: "" };
          } catch (e) {
            console.warn("Suggestion parse error:", e);
            return { placeId: "", text: "" };
          }
        });
        const parsed = mapped.filter((s: any) => s.text && s.placeId);

        showDropdown(parsed);
      } catch (err) {
        console.warn("Suggestions failed:", err);
      }
    }, 300);
  };

  const handleBlur = () => {
    setTimeout(removeDropdown, 200);
  };

  useEffect(() => {
    return () => {
      removeDropdown();
      clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-bold text-slate-700 mb-2">
          {label}
          {required && " *"}
        </label>
      )}
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-11 pr-10 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50 ${inputClassName}`}
          autoComplete="off"
        />
        {isReady && (
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2"
            title="Google Places enabled"
          >
            <div className="size-2 bg-green-500 rounded-full" />
          </div>
        )}
      </div>
      {isReady && (
        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
          <MapPin className="size-3" />
          Type to search and auto-fill address fields
        </p>
      )}
    </div>
  );
}
