"use client";

import Link from "next/link";
import { MessageSquare, ShieldCheck } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";

export default function ChatsPage() {
  const mockChats = [
    {
      id: "c-1",
      otherUser: "Ananya Sharma",
      isVerified: true,
      itemTitle: "Vintage Denim Oversized Jacket",
      lastMessage: "Sure, let's meet at the campus cafeteria at 4 PM!",
      time: "10m ago",
      unread: true,
    },
    {
      id: "c-2",
      otherUser: "Rahul Verma",
      isVerified: true,
      itemTitle: "Rotring Isograph Pen Set",
      lastMessage: "I'll carry cash. Is ₹850 fine?",
      time: "2h ago",
      unread: false,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-paper pb-20">
      <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        <h1 className="font-serif font-bold text-base text-ink">Messages</h1>
        <div className="text-xs text-ink-sec font-medium">2 active chats</div>
      </header>

      <div className="divide-y divide-border/80">
        {mockChats.map((chat) => (
          <Link
            key={chat.id}
            href={`/chats/${chat.id}`}
            className="flex items-start gap-3 p-4 bg-surface hover:bg-paper/70 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-accent-tint text-accent font-serif font-semibold text-sm flex items-center justify-center border border-border flex-shrink-0">
              {chat.otherUser.charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-xs text-ink">{chat.otherUser}</span>
                  {chat.isVerified && (
                    <ShieldCheck className="w-3.5 h-3.5 text-success" />
                  )}
                </div>
                <span className="text-[10px] text-ink-ph">{chat.time}</span>
              </div>

              <p className="text-[11px] font-medium text-accent truncate mb-0.5">
                Re: {chat.itemTitle}
              </p>

              <p className="text-xs text-ink-sec truncate">{chat.lastMessage}</p>
            </div>

            {chat.unread && (
              <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0 self-center" />
            )}
          </Link>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
