"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, LogIn, MapPin, Search } from "lucide-react";
import { useAuth } from "@/lib/auth/context";

interface TopHeaderProps {
  campusName?: string;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

const SEARCH_SUGGESTIONS = [
  "Search 'vintage denim jacket'...",
  "Search 'rotring technical pen'...",
  "Search 'A2 drafting board'...",
  "Search 'warm desk lamp'...",
  "Search 'corduroy tote bag'...",
  "Search 'urbanic thrift'...",
];

export function TopHeader({
  campusName = "SPAV Vijayawada",
  searchQuery = "",
  onSearchChange,
}: TopHeaderProps) {
  const { user } = useAuth();
  const [suggestionIdx, setSuggestionIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSuggestionIdx((prev) => (prev + 1) % SEARCH_SUGGESTIONS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur-md border-b border-border">
      {/* Top row: Brand + Campus Indicator + Notification */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-1.5">
          <Link
            href="/"
            className="font-serif font-bold text-lg tracking-tight text-ink hover:text-accent flex items-center gap-1"
          >
            <span>D&apos; POOL</span>
          </Link>
          <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-accent-tint text-accent">
            SPAV
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Amazon/Flipkart inspired Location / Campus Pill */}
          <div className="flex items-center gap-1 text-[11px] font-medium text-ink-sec bg-paper border border-border px-2.5 py-1 rounded-full shadow-2xs">
            <MapPin className="w-3 h-3 text-accent flex-shrink-0" />
            <span className="max-w-[130px] truncate">{campusName}</span>
          </div>

          <Link
            href="/chats"
            className="p-1.5 text-ink-sec hover:text-ink relative rounded-full hover:bg-paper transition-colors"
            title="Messages"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </Link>

          {/* Small Login Button or User Profile Pill beside Bell icon */}
          {user ? (
            <Link
              href="/profile"
              className="h-7 pl-1.5 pr-2.5 rounded-full bg-accent-tint border border-border/80 text-accent text-xs font-semibold flex items-center gap-1.5 hover:bg-accent-tint/80 transition-colors"
              title={user.name}
            >
              <div className="w-4 h-4 rounded-full bg-accent text-surface text-[9px] font-bold flex items-center justify-center">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="max-w-[65px] truncate text-[11px]">{user.name.split(" ")[0]}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="h-7 px-2.5 rounded-full bg-accent text-surface hover:bg-accent-hover text-xs font-semibold flex items-center gap-1 transition-all shadow-2xs"
              title="Log in to your account"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log in</span>
            </Link>
          )}
        </div>
      </div>

      {/* Rotating Search Bar (Amazon/Flipkart inspired) */}
      <div className="px-4 pb-2.5">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-ph" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={SEARCH_SUGGESTIONS[suggestionIdx]}
            className="w-full h-9 pl-9 pr-4 text-xs rounded-8px border border-border bg-paper text-ink placeholder:text-ink-ph transition-all duration-300"
          />
        </div>
      </div>

      {/* Amazon-style Context Strip: Campus Hand-delivery */}
      <div className="bg-accent-tint/60 border-t border-border/60 px-4 py-1.5 flex items-center justify-between text-[11px] text-ink-sec">
        <div className="flex items-center gap-1.5 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-success flex-shrink-0" />
          <span className="truncate">Hand-to-hand campus meetup • Pay on inspection</span>
        </div>
        <span className="text-accent font-semibold text-[10px] flex-shrink-0">
          Zero Delivery Fees
        </span>
      </div>
    </header>
  );
}
