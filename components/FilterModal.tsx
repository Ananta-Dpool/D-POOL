"use client";

import { useEffect } from "react";
import { Check, RotateCcw, X } from "lucide-react";

export interface FilterOptions {
  category: string;
  budget: string;
  sortBy: "newest" | "price_asc" | "price_desc";
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onApplyFilters: (newFilters: FilterOptions) => void;
  totalResultsCount: number;
}

export const CATEGORIES = [
  { id: "all", label: "All Items" },
  { id: "thrift", label: "Thrift & Fashion" },
  { id: "dorm_decor", label: "Dorm Essentials" },
  { id: "accessories", label: "Accessories" },
  { id: "other", label: "Studio Tools" },
  { id: "electronics", label: "Electronics" },
];

export const BUDGET_OPTIONS = [
  { id: "all", label: "Any Price", max: null },
  { id: "under_300", label: "Under ₹300", max: 300 },
  { id: "under_600", label: "Under ₹600", max: 600 },
  { id: "under_1000", label: "Under ₹1,000", max: 1000 },
  { id: "under_2000", label: "Under ₹2,000", max: 2000 },
];

export const SORT_OPTIONS = [
  { id: "newest", label: "Newest First" },
  { id: "price_asc", label: "Price: Low to High" },
  { id: "price_desc", label: "Price: High to Low" },
];

export function FilterModal({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  totalResultsCount,
}: FilterModalProps) {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleReset = () => {
    onApplyFilters({
      category: "all",
      budget: "all",
      sortBy: "newest",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-surface rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl border-t sm:border border-border z-10 animate-in slide-in-from-bottom-8 duration-250">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <h2 className="font-serif font-bold text-base text-ink">Filter &amp; Sort</h2>
            <p className="text-[11px] text-ink-sec">Refine by goods type, budget &amp; order</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-[11px] font-medium text-ink-sec hover:text-accent px-2 py-1 rounded hover:bg-paper transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-ink-sec hover:text-ink rounded-full hover:bg-paper transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {/* Section 1: Type of Goods (Category) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-2">
              Type of Goods
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = filters.category === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => onApplyFilters({ ...filters, category: cat.id })}
                    className={`flex items-center justify-between px-3 py-2 rounded-8px text-xs font-medium border transition-colors ${
                      isSelected
                        ? "bg-accent-tint text-accent border-accent/40 font-semibold"
                        : "bg-surface border-border text-ink hover:bg-paper"
                    }`}
                  >
                    <span>{cat.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-accent" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Budget Range */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-2">
              Budget Range
            </label>
            <div className="flex flex-wrap gap-2">
              {BUDGET_OPTIONS.map((b) => {
                const isSelected = filters.budget === b.id;
                return (
                  <button
                    key={b.id}
                    onClick={() => onApplyFilters({ ...filters, budget: b.id })}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      isSelected
                        ? "bg-accent text-surface border-accent shadow-2xs font-semibold"
                        : "bg-surface border-border text-ink hover:bg-paper"
                    }`}
                  >
                    {b.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Sort Order */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-2">
              Sort Order
            </label>
            <div className="space-y-1.5">
              {SORT_OPTIONS.map((s) => {
                const isSelected = filters.sortBy === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() =>
                      onApplyFilters({
                        ...filters,
                        sortBy: s.id as FilterOptions["sortBy"],
                      })
                    }
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-8px text-xs font-medium border transition-colors ${
                      isSelected
                        ? "bg-accent-tint text-accent border-accent/40 font-semibold"
                        : "bg-surface border-border text-ink hover:bg-paper"
                    }`}
                  >
                    <span>{s.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-accent" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-paper/60 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-10 bg-accent hover:bg-accent-hover text-surface rounded-8px font-semibold text-xs transition-colors flex items-center justify-center gap-1 shadow-sm"
          >
            Show {totalResultsCount} Results
          </button>
        </div>
      </div>
    </div>
  );
}
