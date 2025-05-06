"use client";

/**
 * SearchResults component
 * Displays search results in a dropdown with entity tags
 */
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Package,
  FileText,
  User,
  Briefcase,
  Search,
  X,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";
import { useGlobalSearch, SearchResult } from "@/hooks/use-global-search";
import { useSearch } from "@/contexts/search-context";

/**
 * SearchResults component
 * Displays search results in a dropdown
 */
export function SearchResults() {
  const router = useRouter();
  const { searchTerm, setSearchTerm } = useSearch();
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    results,
    isLoading,
    activeFilters,
    availableFilters,
    toggleFilter,
    clearFilters,
    setAllFilters,
  } = useGlobalSearch([
    "customer",
    "product",
    "engineer",
    "project",
    "rate-card",
  ]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Open dropdown when search term is entered
  useEffect(() => {
    if (searchTerm && searchTerm.trim().length > 1) {
      setOpen(true);
    }
  }, [searchTerm]);

  // Get icon for result type
  const getIconForType = (type: SearchResult["type"]) => {
    switch (type) {
      case "customer":
        return <Users className="h-4 w-4 text-blue-500" />;
      case "product":
        return <Package className="h-4 w-4 text-green-500" />;
      case "engineer":
        return <User className="h-4 w-4 text-purple-500" />;
      case "project":
        return <Briefcase className="h-4 w-4 text-orange-500" />;
      case "rate-card":
        return <FileText className="h-4 w-4 text-red-500" />;
      default:
        return <Tag className="h-4 w-4" />;
    }
  };

  // Get label for result type
  const getLabelForType = (type: SearchResult["type"]) => {
    switch (type) {
      case "customer":
        return "Customer";
      case "product":
        return "Product";
      case "engineer":
        return "Engineer";
      case "project":
        return "Project";
      case "rate-card":
        return "Rate Card";
      default:
        return type;
    }
  };

  // Handle result selection
  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    router.push(result.url);
  };

  // Handle filter toggle
  const handleFilterToggle = (filterId: string) => {
    toggleFilter(filterId);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    setOpen(false);
  };

  return (
    <div className="relative w-full">
      <div className="relative w-full" ref={inputRef}>
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search..."
          className="w-full rounded-md border border-input bg-background px-8 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => {
            if (searchTerm && searchTerm.trim().length > 1) {
              setOpen(true);
            }
          }}
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={handleClearSearch}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </Button>
        )}
      </div>

      {/* Custom dropdown */}
      {open && (
        <div
          ref={dropdownRef}
          className="absolute left-0 top-full z-50 mt-1 w-full overflow-hidden rounded-md border border-input bg-popover shadow-md md:w-[400px] lg:w-[500px]"
        >
          <Command>
            <CommandInput
              placeholder="Search..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList className="max-h-[300px]">
              <CommandEmpty>
                {isLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    <span className="ml-2">Searching...</span>
                  </div>
                ) : (
                  "No results found."
                )}
              </CommandEmpty>
              <div className="border-t px-2 py-2">
                <div className="flex flex-wrap gap-1">
                  {availableFilters.map((filter) => (
                    <Badge
                      key={filter.id}
                      variant={
                        activeFilters.includes(filter.id)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => handleFilterToggle(filter.id)}
                    >
                      {filter.label}
                    </Badge>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto h-auto px-2 text-xs"
                    onClick={clearFilters}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto px-2 text-xs"
                    onClick={setAllFilters}
                  >
                    All
                  </Button>
                </div>
              </div>
              <Separator />
              {results.length > 0 && (
                <CommandGroup heading="Results">
                  {results.map((result) => (
                    <CommandItem
                      key={`${result.type}-${result.id}`}
                      onSelect={() => handleSelect(result)}
                      className="flex items-center gap-2"
                    >
                      {getIconForType(result.type)}
                      <div className="flex flex-1 flex-col">
                        <span className="text-sm font-medium">
                          {result.title}
                        </span>
                        {result.subtitle && (
                          <span className="text-xs text-muted-foreground">
                            {result.subtitle}
                          </span>
                        )}
                      </div>
                      <Badge variant="outline" className="ml-auto">
                        {getLabelForType(result.type)}
                      </Badge>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
