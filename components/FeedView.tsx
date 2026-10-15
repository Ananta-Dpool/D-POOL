"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal, Sparkles } from "lucide-react";
import { Listing } from "@/lib/types/database";
import { ListingCard } from "./ListingCard";

interface FeedViewProps {
  initialListings: Listing[];
  searchQuery: string;
}

const CATEGORIES = [
  { id: "all", label: "All Items" },
  { id: "thrift", label: "Thrift & Fashion" },
  { id: "dorm_decor", label: "Dorm Essentials" },
  { id: "accessories", label: "Accessories" },
  { id: "other", label: "Studio Tools" },
];

const BUDGET_FILTERS = [
  { id: "all", label: "Any Price" },
  { id: "under_300", label: "Under ₹300", max: 300 },
  { id: "under_600", label: "Under ₹600", max: 600 },
  { id: "under_1000", label: "Under ₹1,000", max: 1000 },
];

export function FeedView({ initialListings, searchQuery }: FeedViewProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBudget, setSelectedBudget] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc">("newest");

  const filteredListings = useMemo(() => {
    return initialListings
      .filter((item) => {
        // Category filter
        if (selectedCategory !== "all" && item.category !== selectedCategory) {
          return false;
        }

        // Budget filter
        if (selectedBudget !== "all") {
          const budget = BUDGET_FILTERS.find((b) => b.id === selectedBudget);
          if (budget?.max && item.price > budget.max) {
            return false;
          }
        }

        // Search filter
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
        if (sortBy === "price_asc") return a.price - b.price;
        if (sortBy === "price_desc") return b.price - a.price;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [initialListings, selectedCategory, selectedBudget, searchQuery, sortBy]);

  return (
    <div className="flex-1 flex flex-col">
      {/* Category Filter Chips */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar px-4 pt-2.5 pb-2 bg-surface border-b border-border">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                isSelected
                  ? "bg-accent text-surface shadow-2xs"
                  : "bg-paper text-ink-sec border border-border/80 hover:text-ink"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Flipkart/Amazon-style Budget Filter Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-4 py-2 bg-paper/60 border-b border-border/70 text-[11px]">
        <span className="text-ink-sec font-medium whitespace-nowrap text-[10px] uppercase tracking-wider">
          Budget:
        </span>
        {BUDGET_FILTERS.map((b) => {
          const isSelected = selectedBudget === b.id;
          return (
            <button
              key={b.id}
              onClick={() => setSelectedBudget(b.id)}
              className={`px-2.5 py-0.5 rounded-full whitespace-nowrap transition-colors text-[11px] ${
                isSelected
                  ? "bg-ink text-surface font-semibold"
                  : "bg-surface border border-border text-ink-sec hover:text-ink"
              }`}
            >
              {b.label}
            </button>
          );
        })}
      </div>

      {/* Live Campus Wanted Ticker (Depop / Campus Community style) */}
      <div className="bg-accent-tint/30 border-b border-border/60 px-4 py-2 flex items-center gap-2 text-xs overflow-hidden">
        <Sparkles className="w-3.5 h-3.5 text-accent flex-shrink-0" />
        <div className="text-[11px] text-ink truncate">
          <span className="font-semibold text-accent mr-1">Wanted on Campus:</span>
          <span className="text-ink-sec">
            Pooja is looking for Casio 991ES • Rahul needs A2 drafter • Sneha wants warm string lights
          </span>
        </div>
      </div>

      {/* Results Header + Sort */}
      <div className="flex justify-between items-center px-4 py-2 bg-paper/90 border-b border-border text-xs text-ink-sec">
        <span>
          Showing <strong className="text-ink font-semibold">{filteredListings.length}</strong> items
        </span>

        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="w-3.5 h-3.5 text-ink-ph" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent text-xs text-ink font-medium border-none focus:outline-none cursor-pointer"
          >
            <option value="newest">Newest first</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Listing Feed */}
      <div className="divide-y divide-border/60 pb-20">
        {filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))
        ) : (
          <div className="p-12 text-center">
            <p className="text-sm font-medium text-ink">No items match your filters</p>
            <p className="text-xs text-ink-sec mt-1">
              Try resetting the budget filter or search for something else.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedBudget("all");
              }}
              className="mt-3 px-3 py-1 bg-accent-tint text-accent font-semibold text-xs rounded-full hover:bg-accent hover:text-surface transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
