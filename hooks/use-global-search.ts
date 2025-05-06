/**
 * Custom hook for global search functionality
 * Queries multiple endpoints and aggregates results
 */
import { useState, useEffect } from "react";
import { useSearch } from "@/contexts/search-context";
import { api } from "@/lib/api";
import { showToast } from "@/lib/toast";

// Define result types for different entities
export interface SearchResultBase {
  id: string;
  type: "customer" | "product" | "engineer" | "project" | "rate-card";
  title: string;
  subtitle?: string;
  url: string;
}

export interface CustomerSearchResult extends SearchResultBase {
  type: "customer";
  email: string;
}

export interface ProductSearchResult extends SearchResultBase {
  type: "product";
  sku: string;
}

export interface EngineerSearchResult extends SearchResultBase {
  type: "engineer";
  specialty: string;
}

export interface ProjectSearchResult extends SearchResultBase {
  type: "project";
  status: string;
}

export interface RateCardSearchResult extends SearchResultBase {
  type: "rate-card";
  customerName: string;
}

export type SearchResult =
  | CustomerSearchResult
  | ProductSearchResult
  | EngineerSearchResult
  | ProjectSearchResult
  | RateCardSearchResult;

/**
 * Custom hook for global search
 * @param initialFilters - Initial filters for search
 * @returns Search state and functions
 */
export function useGlobalSearch(initialFilters: string[] = []) {
  const { searchTerm } = useSearch();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>(initialFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Available filters for search
  const availableFilters = [
    { id: "customer", label: "Customers" },
    { id: "product", label: "Products" },
    { id: "engineer", label: "Engineers" },
    { id: "project", label: "Projects" },
    { id: "rate-card", label: "Rate Cards" },
  ];

  // Toggle a filter
  const toggleFilter = (filterId: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters([]);
  };

  // Set all filters
  const setAllFilters = () => {
    setActiveFilters(availableFilters.map((filter) => filter.id));
  };

  // Perform search when searchTerm or activeFilters change
  useEffect(() => {
    // Don't search if term is empty
    if (!searchTerm || searchTerm.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    // Don't search if no filters are active
    if (activeFilters.length === 0) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const searchEntities = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In development mode with mock auth, use mock data
        if (process.env.NODE_ENV === "development") {
          await new Promise((resolve) => setTimeout(resolve, 300));
          setResults(getMockSearchResults(searchTerm, activeFilters));
          return;
        }

        // Build query params
        const params = new URLSearchParams({
          q: searchTerm,
          types: activeFilters.join(","),
        });

        // Call search API
        const data = await api.get<{ results: SearchResult[] }>(
          `/search?${params.toString()}`
        );
        setResults(data.results);
      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to perform search. Please try again.");
        showToast.error("Search failed. Please try again.");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search to avoid too many requests
    const debounceTimeout = setTimeout(() => {
      searchEntities();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm, activeFilters]);

  return {
    results,
    isLoading,
    error,
    activeFilters,
    availableFilters,
    toggleFilter,
    clearFilters,
    setAllFilters,
  };
}

/**
 * Generate mock search results for development
 * @param term - Search term
 * @param filters - Active filters
 * @returns Mock search results
 */
function getMockSearchResults(term: string, filters: string[]): SearchResult[] {
  const results: SearchResult[] = [];
  const lowercaseTerm = term.toLowerCase().trim();

  // Mock customers
  if (filters.includes("customer")) {
    const customers: CustomerSearchResult[] = [
      {
        id: "c1",
        type: "customer",
        title: "Acme Corporation",
        subtitle: "Technology",
        url: "/customers/c1",
        email: "contact@acme.com",
      },
      {
        id: "c2",
        type: "customer",
        title: "Globex Industries",
        subtitle: "Manufacturing",
        url: "/customers/c2",
        email: "info@globex.com",
      },
      {
        id: "c3",
        type: "customer",
        title: "Stark Enterprises",
        subtitle: "Energy",
        url: "/customers/c3",
        email: "hello@stark.com",
      },
    ];

    results.push(
      ...customers.filter(
        (c) =>
          c.title.toLowerCase().includes(lowercaseTerm) ||
          c.email.toLowerCase().includes(lowercaseTerm) ||
          (c.subtitle && c.subtitle.toLowerCase().includes(lowercaseTerm))
      )
    );
  }

  // Mock products
  if (filters.includes("product")) {
    const products: ProductSearchResult[] = [
      {
        id: "p1",
        type: "product",
        title: "Widget Pro",
        subtitle: "$99.99",
        url: "/products/p1",
        sku: "WDG-PRO-001",
      },
      {
        id: "p2",
        type: "product",
        title: "Gadget Plus",
        subtitle: "$149.99",
        url: "/products/p2",
        sku: "GDG-PLS-002",
      },
      {
        id: "p3",
        type: "product",
        title: "Super Gizmo",
        subtitle: "$199.99",
        url: "/products/p3",
        sku: "SPR-GZM-003",
      },
    ];

    results.push(
      ...products.filter(
        (p) =>
          p.title.toLowerCase().includes(lowercaseTerm) ||
          p.sku.toLowerCase().includes(lowercaseTerm) ||
          (p.subtitle && p.subtitle.toLowerCase().includes(lowercaseTerm))
      )
    );
  }

  // Mock engineers
  if (filters.includes("engineer")) {
    const engineers: EngineerSearchResult[] = [
      {
        id: "e1",
        type: "engineer",
        title: "Jane Smith",
        subtitle: "Senior Engineer",
        url: "/engineers/e1",
        specialty: "Electrical",
      },
      {
        id: "e2",
        type: "engineer",
        title: "John Doe",
        subtitle: "Lead Engineer",
        url: "/engineers/e2",
        specialty: "Mechanical",
      },
      {
        id: "e3",
        type: "engineer",
        title: "Alice Johnson",
        subtitle: "Junior Engineer",
        url: "/engineers/e3",
        specialty: "Software",
      },
    ];

    results.push(
      ...engineers.filter(
        (e) =>
          e.title.toLowerCase().includes(lowercaseTerm) ||
          e.specialty.toLowerCase().includes(lowercaseTerm) ||
          (e.subtitle && e.subtitle.toLowerCase().includes(lowercaseTerm))
      )
    );
  }

  // Mock projects
  if (filters.includes("project")) {
    const projects: ProjectSearchResult[] = [
      {
        id: "pr1",
        type: "project",
        title: "City Center Renovation",
        subtitle: "Acme Corporation",
        url: "/projects/pr1",
        status: "In Progress",
      },
      {
        id: "pr2",
        type: "project",
        title: "Highway Bridge Construction",
        subtitle: "Globex Industries",
        url: "/projects/pr2",
        status: "Planning",
      },
      {
        id: "pr3",
        type: "project",
        title: "Airport Terminal Expansion",
        subtitle: "Stark Enterprises",
        url: "/projects/pr3",
        status: "Completed",
      },
    ];

    results.push(
      ...projects.filter(
        (p) =>
          p.title.toLowerCase().includes(lowercaseTerm) ||
          p.status.toLowerCase().includes(lowercaseTerm) ||
          (p.subtitle && p.subtitle.toLowerCase().includes(lowercaseTerm))
      )
    );
  }

  // Mock rate cards
  if (filters.includes("rate-card")) {
    const rateCards: RateCardSearchResult[] = [
      {
        id: "rc1",
        type: "rate-card",
        title: "Standard Rate Card",
        subtitle: "Basic services",
        url: "/rate-cards/rc1",
        customerName: "Acme Corporation",
      },
      {
        id: "rc2",
        type: "rate-card",
        title: "Premium Rate Card",
        subtitle: "Advanced services",
        url: "/rate-cards/rc2",
        customerName: "Globex Industries",
      },
      {
        id: "rc3",
        type: "rate-card",
        title: "Enterprise Rate Card",
        subtitle: "Full service package",
        url: "/rate-cards/rc3",
        customerName: "Stark Enterprises",
      },
    ];

    results.push(
      ...rateCards.filter(
        (r) =>
          r.title.toLowerCase().includes(lowercaseTerm) ||
          r.customerName.toLowerCase().includes(lowercaseTerm) ||
          (r.subtitle && r.subtitle.toLowerCase().includes(lowercaseTerm))
      )
    );
  }

  return results;
}
