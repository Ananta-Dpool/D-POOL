"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
  MessageSquare,
  Share2,
  ShieldCheck,
} from "lucide-react";
import { SAMPLE_LISTINGS } from "@/lib/mock-data";
import { formatINR, getWhatsAppEnquiryUrl } from "@/lib/utils";

export default function ListingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const listing = SAMPLE_LISTINGS.find((item) => item.id === id) || SAMPLE_LISTINGS[0];

  const primaryImage =
    listing.images?.[0]?.storage_path ||
    "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80";

  const whatsappUrl = listing.seller?.whatsapp_number
    ? getWhatsAppEnquiryUrl({
        phone: listing.seller.whatsapp_number,
        itemTitle: listing.title,
        price: listing.price,
      })
    : null;

  return (
    <div className="flex flex-col min-h-screen bg-paper pb-24">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="p-1.5 -ml-1 text-ink-sec hover:text-ink rounded-full hover:bg-paper"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="font-serif text-sm font-semibold truncate max-w-[200px]">
          {listing.title}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: listing.title,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }
            }}
            className="p-1.5 text-ink-sec hover:text-ink rounded-full hover:bg-paper"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-ink-sec hover:text-danger rounded-full hover:bg-paper">
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Image */}
      <div className="relative w-full aspect-square bg-border/30 overflow-hidden border-b border-border">
        <Image
          src={primaryImage}
          alt={listing.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 448px"
          className="object-cover"
        />
        <div className="absolute top-3 left-3 bg-surface/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-accent border border-border">
          {listing.category.toUpperCase()}
        </div>
      </div>

      {/* Main Info */}
      <div className="p-4 bg-surface border-b border-border">
        <div className="flex items-baseline justify-between gap-4">
          <h1 className="font-serif text-xl font-bold text-ink leading-snug">
            {listing.title}
          </h1>
        </div>

        <div className="mt-2 flex items-baseline gap-3">
          <span className="text-2xl font-bold text-accent tnum">
            {formatINR(listing.price)}
          </span>
          <span className="text-xs uppercase tracking-wide font-semibold text-ink-sec bg-paper border border-border px-2 py-0.5 rounded">
            Condition: {listing.condition?.replace("_", " ")}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-ink-ph">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Listed 2 hours ago
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> 30-day active window
          </span>
        </div>
      </div>

      {/* Seller Card */}
      <div className="p-4 bg-surface border-b border-border mt-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-sec mb-2.5">
          Listed by Student
        </h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent-tint text-accent font-serif font-bold text-sm flex items-center justify-center border border-border">
              {listing.seller?.full_name?.charAt(0) || "S"}
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-medium text-sm text-ink">
                <span>{listing.seller?.full_name}</span>
                <span title="Verified SPAV Student">
                  <ShieldCheck className="w-4 h-4 text-success" />
                </span>
              </div>
              <p className="text-xs text-ink-sec">SPAV Vijayawada • Student Account</p>
            </div>
          </div>
        </div>
      </div>

      {/* Item Description */}
      <div className="p-4 bg-surface border-b border-border mt-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-sec mb-2">
          Description
        </h2>
        <p className="text-xs sm:text-sm text-ink leading-relaxed whitespace-pre-line">
          {listing.description}
        </p>
      </div>

      {/* Meetup Guidance (D-23) */}
      <div className="p-4 bg-accent-tint/50 border border-accent/20 rounded-12px m-4">
        <div className="flex gap-2.5">
          <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-xs text-ink">
            <p className="font-semibold text-accent">Campus Meetup & Exchange</p>
            <p className="text-ink-sec mt-0.5">
              Buyers and sellers coordinate their meetup spot directly (e.g. campus canteen, hostel quad, or library lobby). Pay on inspection with Cash or UPI.
            </p>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-surface/95 backdrop-blur-md border-t border-border p-3 flex gap-2.5 z-40">
        <Link
          href={`/chats/new?listingId=${listing.id}`}
          className="flex-1 h-11 rounded-8px border border-border text-ink bg-paper hover:bg-border/40 font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span>In-App Chat</span>
        </Link>

        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 h-11 rounded-8px bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Chat on WhatsApp</span>
          </a>
        )}
      </div>
    </div>
  );
}
