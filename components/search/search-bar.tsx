"use client";

/**
 * SearchBar component
 * Provides a search input with results dropdown
 */
import { SearchResults } from "@/components/search/search-results";

interface SearchBarProps {
  className?: string;
}

/**
 * SearchBar component
 * Uses the global search context for state management
 */
export function SearchBar({ className }: SearchBarProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <SearchResults />
    </div>
  );
}
