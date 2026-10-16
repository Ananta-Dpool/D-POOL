"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, PlusSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Sell", href: "/sell", icon: PlusSquare },
    { label: "Chats", href: "/chats", icon: MessageSquare, hasBadge: true },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-surface/95 backdrop-blur-md border-t border-border flex justify-around items-center h-14 px-2 z-40">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 w-16 h-full text-[11px] font-medium transition-colors relative",
              isActive ? "text-accent font-semibold" : "text-ink-sec hover:text-ink"
            )}
          >
            <Icon className="w-4 h-4" />
            <span>{item.label}</span>
            {item.hasBadge && (
              <span className="absolute top-2 right-4 w-1.5 h-1.5 bg-danger rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
