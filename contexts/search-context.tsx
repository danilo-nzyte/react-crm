"use client";

/**
 * Search context for global search functionality
 */
import React, { createContext, useContext, useState } from "react";

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isSearching: boolean;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

/**
 * Provider component for search context
 */
export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Update isSearching based on searchTerm
  const handleSetSearchTerm = (term: string) => {
    setSearchTerm(term);
    setIsSearching(term.trim().length > 1);
  };

  return (
    <SearchContext.Provider
      value={{
        searchTerm,
        setSearchTerm: handleSetSearchTerm,
        isSearching,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

/**
 * Hook to use search context
 */
export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
