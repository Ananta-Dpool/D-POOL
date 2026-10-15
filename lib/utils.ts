import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency in Indian Rupees (₹)
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generate direct WhatsApp chat URL with pre-filled enquiry text
 * Per Decision D-24
 */
export function getWhatsAppEnquiryUrl(params: {
  phone: string;
  itemTitle: string;
  price: number;
  listingUrl?: string;
}): string {
  const cleanPhone = params.phone.replace(/[^0-9]/g, "");
  // Ensure country code (default to +91 if 10 digits)
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const message = `Hi! I'm interested in your listing "${params.itemTitle}" (₹${params.price}) on D' POOL. Is it still available?`;
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}
