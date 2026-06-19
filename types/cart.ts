// ─── Product & Cart ──────────────────────────────────────────────────────────

export interface Product {
  id: string
  name: string
  slug: string
  price: number
  originalPrice?: number
  image: string
  badge?: string
  category: string
  tag?: string
  rating?: number
  reviewCount?: number
  inStock: boolean
  isAvailable: boolean
}

export interface CartItem {
  id: string
  productId: string
  name: string
  image: string
  price: number
  originalPrice?: number
  quantity: number
  maxQuantity: number
  category: string
  badge?: string
}

export interface CartState {
  items: CartItem[]
  isOpen: boolean
}

export interface CartSummary {
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
  itemCount: number
}

// ─── Filters & Sorting ───────────────────────────────────────────────────────

export type DietaryTag =
  | 'Vegan'
  | 'Gluten-Free'
  | 'Organic'
  | 'Sugar-Free'
  | 'Dairy-Free'
  | 'Nut-Free'
  | 'Halal'
  | 'Jain'

export type SortOption =
  | 'relevance'
  | 'price_asc'
  | 'price_desc'
  | 'newest'
  | 'rating'
  | 'bestseller'

export interface PriceRange {
  min: number
  max: number
}

export interface Filter {
  categories: string[]
  dietaryTags: DietaryTag[]
  priceRange: PriceRange
  sort: SortOption
  inStockOnly: boolean
}

// ─── Address & Checkout ──────────────────────────────────────────────────────

export interface Address {
  id?: string
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  landmark?: string
  city: string
  state: string
  pincode: string
  isDefault?: boolean
}

export type PaymentMethod =
  | 'upi'
  | 'card'
  | 'netbanking'
  | 'wallet'

export interface UPIDetails {
  vpa: string
}

export interface CardDetails {
  number: string
  expiry: string
  cvv: string
  holderName: string
}

export interface NetbankingDetails {
  bank: string
}

export interface WalletDetails {
  provider: string
}

export interface PaymentDetails {
  method: PaymentMethod
  upi?: UPIDetails
  card?: CardDetails
  netbanking?: NetbankingDetails
  wallet?: WalletDetails
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  address: Address
  payment: PaymentDetails
  summary: CartSummary
  status: OrderStatus
  razorpayOrderId?: string
  razorpayPaymentId?: string
  createdAt: string
  updatedAt: string
  estimatedDelivery?: string
  trackingId?: string
}

export type CheckoutStep = 'address' | 'payment' | 'review'

export interface CheckoutState {
  step: CheckoutStep
  address: Partial<Address>
  payment: Partial<PaymentDetails>
  isProcessing: boolean
  error?: string
}