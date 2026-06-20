// lib/types.ts
export type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  order_number: string;
  status: OrderStatus;
  total: number;
  created_at: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  image_emoji?: string;
}

export interface Address {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  is_default: boolean;
}

export interface WishlistItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  image_emoji?: string;
}

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string;
  avatar_url: string | null;
  birthday: string | null;
  created_at: string;
}