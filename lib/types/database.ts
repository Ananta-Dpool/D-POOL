export type UserRole = "student" | "campus_admin" | "platform_admin";
export type VerificationStatus = "pending" | "verified" | "rejected";
export type ListingCategory = "thrift" | "clothing" | "accessories" | "dorm_decor" | "textbooks" | "electronics" | "other";
export type ListingCondition = "like_new" | "good" | "fair" | "poor";
export type ListingStatus = "active" | "sold" | "removed" | "draft";
export type TransactionStatus =
  | "initiated"
  | "agreed"
  | "meetup_scheduled"
  | "buyer_arrived"
  | "seller_arrived"
  | "completed"
  | "cancelled"
  | "disputed";
export type PaymentMethod = "cash" | "upi" | "platform";

export interface Campus {
  id: string;
  name: string;
  city: string | null;
  email_domains: string[];
  is_active: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  campus_id: string | null;
  full_name: string | null;
  avatar_url: string | null;
  whatsapp_number?: string | null;
  role: UserRole;
  verification_status: VerificationStatus;
  verified_at: string | null;
  is_suspended: boolean;
  created_at: string;
  updated_at: string;
}

export interface ListingImage {
  id: string;
  listing_id: string;
  storage_path: string;
  position: number;
}

export interface Listing {
  id: string;
  campus_id: string;
  seller_id: string;
  title: string;
  description: string | null;
  price: number;
  category: ListingCategory;
  condition: ListingCondition | null;
  status: ListingStatus;
  sold_at: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  seller?: Profile;
  campus?: Campus;
  images?: ListingImage[];
}

export interface Chat {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  last_message_at: string | null;
  // Joined fields
  listing?: Listing;
  buyer?: Profile;
  seller?: Profile;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  body: string;
  read_at: string | null;
  created_at: string;
}

export interface Transaction {
  id: string;
  listing_id: string;
  chat_id: string | null;
  buyer_id: string;
  seller_id: string;
  agreed_price: number;
  payment_method: PaymentMethod;
  status: TransactionStatus;
  meetup_location: string | null;
  meetup_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}
