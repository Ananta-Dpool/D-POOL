import { createClient } from "./client";
import { Listing } from "../types/database";
import { SAMPLE_LISTINGS } from "../mock-data";

/**
 * Fetch all active listings from Supabase for the pilot campus
 * Falls back to local curated mock listings if DB table is currently empty
 */
export async function getActiveListings(): Promise<Listing[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("listings")
      .select(`
        *,
        seller:profiles(*),
        images:listing_images(*)
      `)
      .eq("status", "active")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return SAMPLE_LISTINGS;
    }

    return data as Listing[];
  } catch {
    return SAMPLE_LISTINGS;
  }
}

/**
 * Create a new listing in Supabase
 */
export async function createListing(params: {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  imageUrl?: string;
  isNegotiable?: boolean;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Please log in first to post an item." };
    }

    // Get user's campus or default to SPAV
    const { data: profile } = await supabase
      .from("profiles")
      .select("campus_id")
      .eq("id", user.id)
      .single();

    const campusId = profile?.campus_id || "a0000000-0000-0000-0000-000000000001";

    const { data: listing, error: listingError } = await supabase
      .from("listings")
      .insert({
        campus_id: campusId,
        seller_id: user.id,
        title: params.title,
        description: params.description,
        price: params.price,
        category: params.category,
        condition: params.condition,
        is_negotiable: params.isNegotiable ?? false,
        status: "active",
      })
      .select("id")
      .single();

    if (listingError) {
      return { success: false, error: listingError.message };
    }

    // Attach image if provided
    if (params.imageUrl && listing?.id) {
      await supabase.from("listing_images").insert({
        listing_id: listing.id,
        storage_path: params.imageUrl,
        position: 0,
      });
    }

    return { success: true, id: listing?.id };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create listing" };
  }
}
