import type { DietaryTag } from './cart'

// ─── Products ─────────────────────────────────────────────────────────────────

export type ProductStatus = 'active' | 'draft' | 'out_of_stock'

export interface AdminProduct {
  id: string
  name: string
  description: string
  price: number
  category: string
  stock: number
  status: ProductStatus
  image: string
  dietaryTags: DietaryTag[]
  createdAt: string
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export interface AdminOrderItem {
  productId: string
  name: string
  quantity: number
  price: number
}

export type AdminOrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export interface AdminOrder {
  id: string
  customerName: string
  customerEmail: string
  items: AdminOrderItem[]
  total: number
  status: AdminOrderStatus
  paymentMethod: string
  createdAt: string
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardStat {
  label: string
  value: string
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  icon: 'revenue' | 'orders' | 'stock' | 'customers'
}

export interface RevenueDataPoint {
  date: string
  revenue: number
}