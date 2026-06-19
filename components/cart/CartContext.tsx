'use client'

import React, { createContext, useContext, useReducer, useCallback } from 'react'
import type { CartItem, CartState, CartSummary } from '@/types/cart'

// ─── Actions ─────────────────────────────────────────────────────────────────

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QTY'; payload: { id: string; qty: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'TOGGLE_CART' }

// ─── Reducer ─────────────────────────────────────────────────────────────────

const DELIVERY_THRESHOLD = 499
const DELIVERY_FEE = 49

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(
        (i) => i.productId === action.payload.productId
      )
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.productId === action.payload.productId
              ? { ...i, quantity: Math.min(i.quantity + 1, i.maxQuantity) }
              : i
          ),
        }
      }
      return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] }
    }

    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) }

    case 'UPDATE_QTY':
      if (action.payload.qty <= 0) {
        return { ...state, items: state.items.filter((i) => i.id !== action.payload.id) }
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: Math.min(action.payload.qty, i.maxQuantity) }
            : i
        ),
      }

    case 'CLEAR_CART':
      return { ...state, items: [] }

    case 'OPEN_CART':
      return { ...state, isOpen: true }

    case 'CLOSE_CART':
      return { ...state, isOpen: false }

    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }

    default:
      return state
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface CartContextValue {
  state: CartState
  summary: CartSummary
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

// ─── Provider ────────────────────────────────────────────────────────────────

const initialState: CartState = { items: [], isOpen: false }

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const summary: CartSummary = React.useMemo(() => {
    const subtotal = state.items.reduce(
      (sum, i) => sum + i.price * i.quantity, 0
    )
    const discount = state.items.reduce((sum, i) => {
      const saved = i.originalPrice
        ? (i.originalPrice - i.price) * i.quantity
        : 0
      return sum + saved
    }, 0)
    const deliveryFee = subtotal >= DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
    return {
      subtotal,
      deliveryFee,
      discount,
      total: subtotal + deliveryFee,
      itemCount: state.items.reduce((n, i) => n + i.quantity, 0),
    }
  }, [state.items])

  const addItem    = useCallback((item: CartItem)              => dispatch({ type: 'ADD_ITEM',    payload: item }),           [])
  const removeItem = useCallback((id: string)                  => dispatch({ type: 'REMOVE_ITEM', payload: id }),             [])
  const updateQty  = useCallback((id: string, qty: number)     => dispatch({ type: 'UPDATE_QTY',  payload: { id, qty } }),    [])
  const clearCart  = useCallback(()                            => dispatch({ type: 'CLEAR_CART' }),                           [])
  const openCart   = useCallback(()                            => dispatch({ type: 'OPEN_CART' }),                            [])
  const closeCart  = useCallback(()                            => dispatch({ type: 'CLOSE_CART' }),                           [])
  const toggleCart = useCallback(()                            => dispatch({ type: 'TOGGLE_CART' }),                          [])

  return (
    <CartContext.Provider
      value={{ state, summary, addItem, removeItem, updateQty, clearCart, openCart, closeCart, toggleCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}