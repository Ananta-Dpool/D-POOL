"use client";

import { useState } from "react";
import { TopHeader } from "@/components/TopHeader";
import { FeedView } from "@/components/FeedView";
import { BottomNav } from "@/components/BottomNav";
import { SAMPLE_LISTINGS } from "@/lib/mock-data";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col min-h-screen">
      <TopHeader
        campusName="SPAV Vijayawada"
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <FeedView
        initialListings={SAMPLE_LISTINGS}
        searchQuery={searchQuery}
      />

      <BottomNav />
    </div>
  );
}
