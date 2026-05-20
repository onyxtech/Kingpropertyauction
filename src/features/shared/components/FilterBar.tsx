import { Search, X } from "lucide-react";
import { useState } from "react";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: {
    label: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
  }[];
  className?: string;
}

export default function FilterBar({ searchPlaceholder = "Search...", searchValue, onSearchChange, filters = [], className = "" }: FilterBarProps) {
  const hasActiveFilters = searchValue || filters.some((f) => f.value);

  return (
    <div className={`bg-white/80 backdrop-blur-xl rounded-2xl p-4 border-2 border-white/60 shadow-lg flex flex-wrap items-center gap-3 ${className}`}>
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-400 transition-all"
        />
        {searchValue && (
          <button onClick={() => onSearchChange("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-slate-200 rounded">
            <X className="size-3 text-slate-400" />
          </button>
        )}
      </div>

      {/* Filters */}
      {filters.map((filter) => (
        <select
          key={filter.label}
          value={filter.value}
          onChange={(e) => filter.onChange(e.target.value)}
          className="px-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:border-blue-400 cursor-pointer"
        >
          <option value="">{filter.label}</option>
          {filter.options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ))}

      {/* Clear all */}
      {hasActiveFilters && (
        <button
          onClick={() => {
            onSearchChange("");
            filters.forEach((f) => f.onChange(""));
          }}
          className="px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all flex items-center gap-1"
        >
          <X className="size-3" /> Clear All
        </button>
      )}
    </div>
  );
}