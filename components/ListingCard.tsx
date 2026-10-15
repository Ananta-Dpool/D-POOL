"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { Listing } from "@/lib/types/database";
import { formatINR, getWhatsAppEnquiryUrl } from "@/lib/utils";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  const primaryImage =
    listing.images?.[0]?.storage_path ||
    "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80";

  const conditionLabel = listing.condition
    ? listing.condition.replace("_", " ")
    : "good";

  // Calculate discount percentage if original_price exists
  const discountPercent =
    listing.original_price && listing.original_price > listing.price
      ? Math.round(((listing.original_price - listing.price) / listing.original_price) * 100)
      : null;

  const whatsappUrl = listing.seller?.whatsapp_number
    ? getWhatsAppEnquiryUrl({
        phone: listing.seller.whatsapp_number,
        itemTitle: listing.title,
        price: listing.price,
      })
    : null;

  return (
    <article className="bg-surface border-b border-border/80 p-3.5 hover:bg-paper/40 transition-colors">
      <div className="flex gap-3.5">
        {/* Item Image with Wishlist Button Overlay (Flipkart / Amazon style) */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-12px overflow-hidden bg-paper border border-border/60">
          <Link href={`/listings/${listing.id}`} className="block w-full h-full">
            <Image
              src={primaryImage}
              alt={listing.title}
              fill
              sizes="112px"
              className="object-cover hover:scale-105 transition-transform duration-200"
            />
          </Link>

          {/* Wishlist Heart Icon */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsSaved(!isSaved);
            }}
            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-surface/85 backdrop-blur-xs text-ink-sec hover:text-danger hover:bg-surface transition-all shadow-xs"
            title={isSaved ? "Remove from Saved" : "Save Item"}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                isSaved ? "fill-danger text-danger" : "text-ink-sec"
              }`}
            />
          </button>

          {/* Negotiable Pill */}
          {listing.is_negotiable && (
            <span className="absolute bottom-1.5 left-1.5 bg-ink/75 text-white text-[9px] font-medium px-1.5 py-0.5 rounded backdrop-blur-xs">
              Offers OK
            </span>
          )}
        </div>

        {/* Content details */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            {/* Student Context / Deal Tag */}
            {listing.deal_tag && (
              <div className="mb-1">
                <span className="text-[10px] font-semibold text-accent bg-accent-tint px-1.5 py-0.5 rounded">
                  {listing.deal_tag}
                </span>
              </div>
            )}

            <Link
              href={`/listings/${listing.id}`}
              className="font-medium text-xs sm:text-sm text-ink leading-snug line-clamp-2 hover:text-accent"
            >
              {listing.title}
            </Link>

            {/* Price section with strike-through retail comparison */}
            <div className="mt-1 flex items-baseline gap-2 flex-wrap">
              <span className="font-bold text-accent text-sm sm:text-base tnum">
                {formatINR(listing.price)}
              </span>

              {listing.original_price && listing.original_price > listing.price && (
                <>
                  <span className="text-[11px] text-ink-ph line-through tnum">
                    {formatINR(listing.original_price)}
                  </span>
                  {discountPercent && (
                    <span className="text-[10px] font-bold text-success">
                      {discountPercent}% OFF
                    </span>
                  )}
                </>
              )}

              <span className="text-[10px] capitalize text-ink-sec bg-paper border border-border/70 px-1 py-0.5 rounded">
                {conditionLabel}
              </span>
            </div>

            {/* Campus Meetup Spot */}
            {listing.pickup_location && (
              <p className="flex items-center gap-1 text-[10px] text-ink-sec mt-1">
                <MapPin className="w-2.5 h-2.5 text-accent" />
                <span>Meetup at {listing.pickup_location}</span>
              </p>
            )}
          </div>

          {/* Bottom row: Verified Student & WhatsApp Quick Action */}
          <div className="mt-2 pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-ink-sec">
            <div className="flex items-center gap-1 truncate">
              <span className="truncate">{listing.seller?.full_name || "Student"}</span>
              {listing.seller?.verification_status === "verified" && (
                <span title="Verified Student">
                  <ShieldCheck className="w-3.5 h-3.5 text-success flex-shrink-0" />
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-[#1E7E34] hover:text-[#155D27] bg-[#EAF7EE] hover:bg-[#DCF2E2] px-2 py-1 rounded-full transition-colors"
                  title="Direct WhatsApp enquiry"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MessageCircle className="w-3 h-3 fill-current" />
                  <span>WhatsApp</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
