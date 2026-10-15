"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageCircle, ShieldCheck } from "lucide-react";
import { Listing } from "@/lib/types/database";
import { formatINR, getWhatsAppEnquiryUrl } from "@/lib/utils";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const primaryImage =
    listing.images?.[0]?.storage_path ||
    "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80";

  const conditionLabel = listing.condition
    ? listing.condition.replace("_", " ")
    : "good";

  const whatsappUrl = listing.seller?.whatsapp_number
    ? getWhatsAppEnquiryUrl({
        phone: listing.seller.whatsapp_number,
        itemTitle: listing.title,
        price: listing.price,
      })
    : null;

  return (
    <article className="bg-surface border-b border-border/80 p-3.5 hover:bg-paper/60 transition-colors">
      <div className="flex gap-3.5">
        {/* Item Image with Link */}
        <Link
          href={`/listings/${listing.id}`}
          className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-12px overflow-hidden bg-paper border border-border/60"
        >
          <Image
            src={primaryImage}
            alt={listing.title}
            fill
            sizes="112px"
            className="object-cover hover:scale-105 transition-transform duration-200"
          />
        </Link>

        {/* Content details */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-2">
              <Link
                href={`/listings/${listing.id}`}
                className="font-medium text-xs sm:text-sm text-ink leading-snug line-clamp-2 hover:text-accent"
              >
                {listing.title}
              </Link>
            </div>

            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-semibold text-accent text-sm sm:text-base tnum">
                {formatINR(listing.price)}
              </span>
              <span className="text-[11px] capitalize text-ink-sec bg-paper border border-border/70 px-1.5 py-0.5 rounded">
                {conditionLabel}
              </span>
            </div>
          </div>

          {/* Bottom row: Seller & WhatsApp Quick Action */}
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
