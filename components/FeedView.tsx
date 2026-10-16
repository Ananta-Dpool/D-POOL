"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Listing } from "@/lib/types/database";
import { ListingCard } from "./ListingCard";
import {
  FilterModal,
  FilterOptions,
  CATEGORIES,
  BUDGET_OPTIONS,
  SORT_OPTIONS,
} from "./FilterModal";

interface FeedViewProps {
  initialListings: Listing[];
  searchQuery: string;
}

export function FeedView({ initialListings, searchQuery }: FeedViewProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    category: "all",
    budget: "all",
    sortBy: "newest",
  });

  // Calculate active filter count (excluding defaults)
  const activeFilterCount =
    (filters.category !== "all" ? 1 : 0) +
    (filters.budget !== "all" ? 1 : 0) +
    (filters.sortBy !== "newest" ? 1 : 0);

  const filteredListings = useMemo(() => {
    return initialListings
      .filter((item) => {
        // Category filter
        if (filters.category !== "all" && item.category !== filters.category) {
          return false;
        }

        // Budget filter
        if (filters.budget !== "all") {
          const budget = BUDGET_OPTIONS.find((b) => b.id === filters.budget);
          if (budget?.max && item.price > budget.max) {
            return false;
          }
        }

        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.description?.toLowerCase().includes(q) ?? false;
          const matchTag = item.deal_tag?.toLowerCase().includes(q) ?? false;
          return matchTitle || matchDesc || matchTag;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === "price_asc") return a.price - b.price;
        if (filters.sortBy === "price_desc") return b.price - a.price;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [initialListings, filters, searchQuery]);

  // Labels for active chips
  const activeCategoryLabel =
    filters.category !== "all"
      ? CATEGORIES.find((c) => c.id === filters.category)?.label
      : null;
  const activeBudgetLabel =
    filters.budget !== "all"
      ? BUDGET_OPTIONS.find((b) => b.id === filters.budget)?.label
      : null;
  const activeSortLabel =
    filters.sortBy !== "newest"
      ? SORT_OPTIONS.find((s) => s.id === filters.sortBy)?.label
      : null;

  return (
    <div className="flex-1 flex flex-col">
      {/* Compact Filter & Sort Bar (Replaces the two stacked pill rows) */}
      <div className="bg-surface border-b border-border px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Item count and active summary */}
        <div className="flex items-center gap-2 truncate">
          <span className="text-xs text-ink-sec whitespace-nowrap">
            Showing <strong className="text-ink font-semibold">{filteredListings.length}</strong> items
          </span>
        </div>

        {/* Right: Small sleek Filter & Sort button */}
        <button
          onClick={() => setIsFilterOpen(true)}
          className={`flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-semibold border transition-all ${
            activeFilterCount > 0
              ? "bg-accent text-surface border-accent shadow-xs"
              : "bg-paper hover:bg-border/40 text-ink border-border"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filter &amp; Sort</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 rounded-full bg-surface text-accent text-[10px] font-bold flex items-center justify-center -mr-1">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Applied Filter Tags (Compact row only when filters are active) */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-1.5 px-4 py-1.5 bg-accent-tint/40 border-b border-border/60 overflow-x-auto no-scrollbar text-[11px]">
          <span className="text-ink-sec text-[10px] uppercase font-bold tracking-wider mr-0.5">
            Active:
          </span>

          {activeCategoryLabel && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface border border-border text-ink font-medium">
              {activeCategoryLabel}
              <button
                onClick={() => setFilters({ ...filters, category: "all" })}
                className="hover:text-danger"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {activeBudgetLabel && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface border border-border text-ink font-medium">
              {activeBudgetLabel}
              <button
                onClick={() => setFilters({ ...filters, budget: "all" })}
                className="hover:text-danger"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {activeSortLabel && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface border border-border text-ink font-medium">
              {activeSortLabel}
              <button
                onClick={() => setFilters({ ...filters, sortBy: "newest" })}
                className="hover:text-danger"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={() =>
              setFilters({
                category: "all",
                budget: "all",
                sortBy: "newest",
              })
            }
            className="text-[10px] text-accent underline ml-1 hover:text-accent-hover font-medium whitespace-nowrap"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Listing Feed */}
      <div className="divide-y divide-border/60 pb-20">
        {filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))
        ) : (
          <div className="p-12 text-center">
            <p className="text-sm font-medium text-ink">No items match your criteria</p>
            <p className="text-xs text-ink-sec mt-1">
              Try adjusting the budget or goods category in the filter.
            </p>
            <button
              onClick={() =>
                setFilters({
                  category: "all",
                  budget: "all",
                  sortBy: "newest",
                })
              }
              className="mt-3 px-3.5 py-1.5 bg-accent text-surface font-semibold text-xs rounded-full hover:bg-accent-hover transition-colors shadow-2xs"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Filter & Sort Bottom Sheet Modal */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onApplyFilters={setFilters}
        totalResultsCount={filteredListings.length}
      />
    </div>
  );
}
