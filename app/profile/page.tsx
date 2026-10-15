"use client";

import Link from "next/link";
import {
  ExternalLink,
  LogOut,
  MapPin,
  Package,
  Phone,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen bg-paper pb-20">
      <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        <h1 className="font-serif font-bold text-base text-ink">My Profile</h1>
        <button className="p-1 text-ink-sec hover:text-ink">
          <Settings className="w-4 h-4" />
        </button>
      </header>

      {/* User Card */}
      <div className="p-4 bg-surface border-b border-border">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-full bg-accent text-surface font-serif font-bold text-lg flex items-center justify-center shadow-sm">
            NN
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="font-serif font-bold text-base text-ink">Nishchinth</h2>
              <span title="Verified Student">
                <ShieldCheck className="w-4 h-4 text-success" />
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-ink-sec mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-accent" />
              <span>SPAV Vijayawada</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-ink-sec">
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-accent" />
            <span>WhatsApp: Connected</span>
          </div>
          <span className="text-[11px] bg-accent-tint text-accent px-2 py-0.5 rounded font-medium">
            Student Account
          </span>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-3 bg-surface border-b border-border divide-x divide-border py-3 text-center">
        <div>
          <div className="text-sm font-bold text-accent">1</div>
          <div className="text-[10px] text-ink-sec uppercase">Active Listing</div>
        </div>
        <div>
          <div className="text-sm font-bold text-success">0</div>
          <div className="text-[10px] text-ink-sec uppercase">Deals Sold</div>
        </div>
        <div>
          <div className="text-sm font-bold text-ink">5.0 ★</div>
          <div className="text-[10px] text-ink-sec uppercase">Campus Trust</div>
        </div>
      </div>

      {/* Profile menu links */}
      <div className="mt-3 bg-surface border-y border-border divide-y divide-border/60 text-xs">
        <Link
          href="/sell"
          className="flex items-center justify-between p-3.5 hover:bg-paper transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Package className="w-4 h-4 text-accent" />
            <span className="font-medium text-ink">Manage My Listings</span>
          </div>
          <span className="text-ink-ph">→</span>
        </Link>
        <Link
          href="https://spav.ac.in"
          target="_blank"
          className="flex items-center justify-between p-3.5 hover:bg-paper transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <ExternalLink className="w-4 h-4 text-ink-sec" />
            <span className="text-ink-sec">Visit SPAV Campus Portal</span>
          </div>
          <span className="text-ink-ph">↗</span>
        </Link>
        <button className="w-full flex items-center justify-between p-3.5 hover:bg-paper text-danger transition-colors">
          <div className="flex items-center gap-2.5">
            <LogOut className="w-4 h-4" />
            <span className="font-medium">Sign Out</span>
          </div>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
