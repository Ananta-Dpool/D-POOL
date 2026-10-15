"use client";

import { useEffect, useState } from "react";
import { TopHeader } from "@/components/TopHeader";
import { FeedView } from "@/components/FeedView";
import { BottomNav } from "@/components/BottomNav";
import { SplashScreen } from "@/components/SplashScreen";
import { SAMPLE_LISTINGS } from "@/lib/mock-data";
import { Sparkles, TrendingUp, Users } from "lucide-react";

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Check if user already saw splash in current session
    const hasSeen = sessionStorage.getItem("dpool_splash_seen");
    if (hasSeen) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashFinish = () => {
    sessionStorage.setItem("dpool_splash_seen", "true");
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && (
        <SplashScreen durationMs={1000} onFinish={handleSplashFinish} />
      )}

      <div className="flex flex-col min-h-screen bg-paper">
        <TopHeader
          campusName="SPAV Vijayawada"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Campus Bulletin / Thrift Drop Highlight Banner */}
        <section className="px-4 pt-3 pb-1">
          <div className="bg-gradient-to-r from-accent/90 to-accent text-surface rounded-12px p-3.5 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-accent-tint tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SPAV Thrift &amp; Studio Exchange</span>
              </div>
              <h2 className="font-serif font-bold text-base mt-1 text-white leading-tight">
                Fresh drops from hostel rooms &amp; seniors
              </h2>
              <p className="text-[11px] text-white/80 mt-1 line-clamp-2">
                Pre-loved online finds, architecture studio essentials, and dorm gear. Meet up directly on campus.
              </p>

              <div className="mt-2.5 flex items-center gap-3 text-[10px] text-white/90">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3 text-accent-tint" /> 100% Student Verified
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-accent-tint" /> WhatsApp Instant Connect
                </span>
              </div>
            </div>
            
            {/* Background design pattern */}
            <div className="absolute -right-4 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
          </div>
        </section>

        {/* Live Marketplace Feed */}
        <FeedView
          initialListings={SAMPLE_LISTINGS}
          searchQuery={searchQuery}
        />

        <BottomNav />
      </div>
    </>
  );
}
