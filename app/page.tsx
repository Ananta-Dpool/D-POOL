"use client";

import { useEffect, useState } from "react";
import { TopHeader } from "@/components/TopHeader";
import { FeedView } from "@/components/FeedView";
import { BottomNav } from "@/components/BottomNav";
import { SplashScreen } from "@/components/SplashScreen";
import { SAMPLE_LISTINGS } from "@/lib/mock-data";
import { getActiveListings } from "@/lib/supabase/listings";
import { Listing } from "@/lib/types/database";

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [listings, setListings] = useState<Listing[]>(SAMPLE_LISTINGS);

  useEffect(() => {
    // Check if user already saw splash in current session
    const hasSeen = sessionStorage.getItem("dpool_splash_seen");
    if (hasSeen) {
      setShowSplash(false);
    }

    // Fetch live listings from Supabase
    getActiveListings().then((data) => {
      if (data && data.length > 0) {
        setListings(data);
      }
    });
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

        {/* Live Marketplace Feed */}
        <FeedView
          initialListings={listings}
          searchQuery={searchQuery}
        />

        <BottomNav />
      </div>
    </>
  );
}
