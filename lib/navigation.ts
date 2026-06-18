import type { LucideIcon } from 'lucide-react'
import { Home, LayoutGrid, ShoppingBag, Heart, User } from 'lucide-react'

export interface NavLink {
  label: string
  href: string
}

export interface MegaMenuColumn {
  title: string
  links: NavLink[]
}

export interface NavCategory {
  label: string
  href: string
  columns: MegaMenuColumn[]
}

export interface TabItem {
  label: string
  href: string
  icon: LucideIcon
}

export const primaryNav: NavLink[] = [
  { label: 'Shop All', href: '/shop' },
  { label: 'Bestsellers', href: '/bestsellers' },
  { label: 'Gift Boxes', href: '/gifts' },
  { label: 'Our Story', href: '/story' },
]

export const categories: NavCategory[] = [
  {
    label: 'Categories',
    href: '/categories',
    columns: [
      {
        title: 'Pantry',
        links: [
          { label: 'Oils & Vinegars', href: '/categories/oils' },
          { label: 'Honey & Preserves', href: '/categories/honey' },
          { label: 'Spices & Blends', href: '/categories/spices' },
          { label: 'Pasta & Grains', href: '/categories/grains' },
        ],
      },
      {
        title: 'Sweet',
        links: [
          { label: 'Chocolate', href: '/categories/chocolate' },
          { label: 'Biscuits & Bakes', href: '/categories/biscuits' },
          { label: 'Jams & Spreads', href: '/categories/jams' },
        ],
      },
      {
        title: 'Drinks',
        links: [
          { label: 'Coffee', href: '/categories/coffee' },
          { label: 'Loose Leaf Tea', href: '/categories/tea' },
          { label: 'Cordials', href: '/categories/cordials' },
        ],
      },
    ],
  },
]

export const footerSections: MegaMenuColumn[] = [
  {
    title: 'Help',
    links: [
      { label: 'Delivery Info', href: '/help/delivery' },
      { label: 'Returns', href: '/help/returns' },
      { label: 'Track Order', href: '/help/track' },
      { label: 'FAQs', href: '/help/faqs' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Our Story', href: '/story' },
      { label: 'Our Producers', href: '/producers' },
      { label: 'Blog & Recipes', href: '/blog' },
      { label: 'Press', href: '/press' },
      { label: 'Careers', href: '/careers' },
    ],
  },
  {
    title: 'Shop',
    links: [
      { label: 'Shop All', href: '/shop' },
      { label: 'Bestsellers', href: '/bestsellers' },
      { label: 'Gift Boxes', href: '/gifts' },
      { label: 'New Arrivals', href: '/new' },
    ],
  },
]

export const tabItems: TabItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Shop', href: '/shop', icon: LayoutGrid },
  { label: 'Cart', href: '/cart', icon: ShoppingBag },
  { label: 'Wishlist', href: '/wishlist', icon: Heart },
  { label: 'Account', href: '/account', icon: User },
]
