import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, Building2, Gavel, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

export default function CustomerSearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const { data: propertyResults = [] } = useQuery({
    queryKey: ["customer-search-props", query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];
      const r = await apiClient.fetch(
        `/properties?search=${encodeURIComponent(query)}&limit=3`
      );
      return r.success ? (r.data || []) : [];
    },
    enabled: query.length >= 2,
  });

  const { data: auctionResults = [] } = useQuery({
    queryKey: ["customer-search-auctions", query],
    queryFn: async () => {
      if (!query || query.length < 2) return [];
      const r = await apiClient.fetch(
        `/auctions?search=${encodeURIComponent(query)}&limit=3`
      );
      return r.success ? (r.data || r.data?.auctions || []) : [];
    },
    enabled: query.length >= 2,
  });

  const hasResults =
    (propertyResults as any[]).length > 0 ||
    (auctionResults as any[]).length > 0;

  const handleSelect = (path: string) => {
    setShowResults(false);
    setQuery("");
    navigate(path);
  };

  return (
    <div className="relative" ref={ref}>
      <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2.5 w-64">
        <Search className="size-4 text-slate-400 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          placeholder="Search properties, auctions..."
          className="bg-transparent text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none w-full"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setShowResults(false);
            }}
          >
            <X className="size-3.5 text-slate-400 hover:text-slate-600" />
          </button>
        )}
      </div>

      {showResults && query.length >= 2 && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border-2 border-slate-100 overflow-hidden z-50">
          {!hasResults ? (
            <div className="p-4 text-center text-slate-400 text-sm">
              No results for "{query}"
            </div>
          ) : (
            <div>
              {(propertyResults as any[]).length > 0 && (
                <div>
                  <p className="px-4 pt-3 pb-1 text-xs font-black text-slate-400 uppercase">
                    Properties
                  </p>
                  {(propertyResults as any[]).map((p: any) => (
                    <button
                      key={p._id}
                      onClick={() =>
                        handleSelect(`/properties/${p.slug || p._id}`)
                      }
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-all text-left"
                    >
                      <div className="size-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Building2 className="size-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {p.propertyTitle || p.title}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {p.location?.city || "Property"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {(auctionResults as any[]).length > 0 && (
                <div className="border-t border-slate-100">
                  <p className="px-4 pt-3 pb-1 text-xs font-black text-slate-400 uppercase">
                    Auctions
                  </p>
                  {(auctionResults as any[]).map((a: any) => (
                    <button
                      key={a._id}
                      onClick={() =>
                        handleSelect(`/auctions/${a.slug || a._id}`)
                      }
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-all text-left"
                    >
                      <div className="size-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                        <Gavel className="size-4 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {a.auctionTitle || a.title}
                        </p>
                        <p className="text-xs text-slate-500">
                          {a.status === "live" ? "🔴 Live Now" : a.status}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <div className="border-t border-slate-100 p-3">
                <button
                  onClick={() =>
                    handleSelect(`/auctions?search=${query}`)
                  }
                  className="w-full text-center text-xs font-bold text-blue-600 hover:text-blue-700"
                >
                  View all results for "{query}" →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
