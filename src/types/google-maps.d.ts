declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google.maps.places {
  class Autocomplete {
    constructor(
      input: HTMLInputElement,
      opts?: AutocompleteOptions
    );
    addListener(event: string, handler: () => void): MapsEventListener;
    getPlace(): PlaceResult;
  }

  interface AutocompleteOptions {
    types?: string[];
    componentRestrictions?: { country: string | string[] };
    fields?: string[];
  }

  interface PlaceResult {
    address_components?: AddressComponent[];
    formatted_address?: string;
    geometry?: {
      location: {
        lat(): number;
        lng(): number;
      };
    };
  }

  interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
  }

  class Place {
    constructor(options: { id: string });
    fetchFields(options: { fields: string[] }): Promise<void>;
    addressComponents?: AddressComponent[];
    formattedAddress?: string;
    location?: google.maps.LatLng;
  }

  namespace AutocompleteSuggestion {
    function fetchAutocompleteSuggestions(
      request: { input: string; includedRegionCodes?: string[] }
    ): Promise<{ suggestions: any[] }>;
  }
}

declare namespace google.maps {
  interface MapsEventListener {
    remove(): void;
  }
  namespace event {
    function removeListener(listener: MapsEventListener): void;
    function clearInstanceListeners(instance: object): void;
  }
  interface LatLng {
    lat(): number;
    lng(): number;
  }
}

export {};
