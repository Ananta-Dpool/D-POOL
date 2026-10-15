"use client";

import Link from "next/link";
import { Bell, MapPin, Search } from "lucide-react";

interface TopHeaderProps {
  campusName?: string;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export function TopHeader({
  campusName = "SPAV Vijayawada",
  searchQuery = "",
  onSearchChange,
}: TopHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-border px-4 py-3">
      {/* Top row: Campus pill + Brand + Notification */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <Link href="/" className="font-serif font-bold text-lg tracking-tight text-ink hover:text-accent">
            D&apos; POOL
          </Link>
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-accent-tint text-accent">
            Pilot
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Campus Indicator */}
          <div className="flex items-center gap-1 text-xs font-medium text-ink-sec bg-paper border border-border px-2.5 py-1 rounded-full">
            <MapPin className="w-3 h-3 text-accent" />
            <span className="max-w-[130px] truncate">{campusName}</span>
          </div>

          <Link
            href="/notifications"
            className="p-1.5 text-ink-sec hover:text-ink relative rounded-full hover:bg-paper transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </Link>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-ph" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder="Search thrift, jackets, tools, dorm gear..."
          className="w-full h-9 pl-9 pr-4 text-xs rounded-8px border border-border bg-paper text-ink placeholder:text-ink-ph transition-all"
        />
      </div>
    </header>
  );
}
