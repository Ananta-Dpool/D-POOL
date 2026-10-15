"use client";

import Link from "next/link";
import {
  ExternalLink,
  LogIn,
  LogOut,
  MapPin,
  Package,
  Phone,
  Settings,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/lib/auth/context";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-paper pb-20">
      <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        <h1 className="font-serif font-bold text-base text-ink">My Profile</h1>
        <button className="p-1 text-ink-sec hover:text-ink">
          <Settings className="w-4 h-4" />
        </button>
      </header>

      {/* User Card */}
      {user ? (
        <div className="p-4 bg-surface border-b border-border">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-full bg-accent text-surface font-serif font-bold text-lg flex items-center justify-center shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="font-serif font-bold text-base text-ink">{user.name}</h2>
                <span title="Verified Student">
                  <ShieldCheck className="w-4 h-4 text-success" />
                </span>
              </div>
              <p className="text-xs text-ink-sec truncate">{user.email}</p>
              <div className="flex items-center gap-1 text-xs text-ink-sec mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-accent" />
                <span>{user.campusName}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-ink-sec">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-accent" />
              <span>
                WhatsApp: {user.whatsappNumber ? `+91 ${user.whatsappNumber}` : "Not set"}
              </span>
            </div>
            <span className="text-[11px] bg-accent-tint text-accent px-2 py-0.5 rounded font-medium">
              Student Account
            </span>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-surface border-b border-border text-center">
          <div className="w-14 h-14 rounded-full bg-accent-tint text-accent font-serif font-bold text-lg flex items-center justify-center mx-auto mb-3 shadow-2xs">
            SPAV
          </div>
          <h2 className="font-serif font-bold text-base text-ink">Welcome to D&apos; POOL</h2>
          <p className="text-xs text-ink-sec mt-1 max-w-xs mx-auto">
            Log in with your Gmail ID to view your listings, manage chats, and trade on campus.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Link
              href="/login"
              className="px-4 py-2 rounded-8px bg-accent text-surface text-xs font-semibold hover:bg-accent-hover transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 rounded-8px border border-border bg-paper text-ink text-xs font-semibold hover:bg-border/30 transition-colors flex items-center gap-1.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </Link>
          </div>
        </div>
      )}

      {/* Stats summary */}
      <div className="grid grid-cols-3 bg-surface border-b border-border divide-x divide-border py-3 text-center">
        <div>
          <div className="text-sm font-bold text-accent">{user ? "1" : "0"}</div>
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
        {user && (
          <button
            onClick={logout}
            className="w-full flex items-center justify-between p-3.5 hover:bg-paper text-danger transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Sign Out</span>
            </div>
          </button>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
