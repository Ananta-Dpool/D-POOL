"use client";

import { useState, useMemo } from "react";
import { SlidersHorizontal } from "lucide-react";
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

export function FeedView({ initialListings, searchQuery }: FeedViewProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc">("newest");

  const filteredListings = useMemo(() => {
    return initialListings
      .filter((item) => {
        // Category filter
        if (selectedCategory !== "all" && item.category !== selectedCategory) {
          return false;
        }

        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.description?.toLowerCase().includes(q) ?? false;
          return matchTitle || matchDesc;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") return a.price - b.price;
        if (sortBy === "price_desc") return b.price - a.price;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [initialListings, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="flex-1 flex flex-col">
      {/* Category Filter Chips */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar px-4 py-2.5 bg-surface border-b border-border">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                isSelected
                  ? "bg-accent text-surface"
                  : "bg-paper text-ink-sec border border-border/80 hover:text-ink"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Results Header + Sort */}
      <div className="flex justify-between items-center px-4 py-2 bg-paper/70 border-b border-border text-xs text-ink-sec">
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
            <p className="text-sm font-medium text-ink">No items found</p>
            <p className="text-xs text-ink-sec mt-1">
              Try searching for different keywords or clear the category filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
