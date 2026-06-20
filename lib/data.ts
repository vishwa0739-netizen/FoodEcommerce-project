export interface Category {
  id: string
  name: string
  href: string
  image: string
}

export interface Product {
  id: string
  name: string
  category: string
  price: number
  compareAt?: number
  rating: number
  reviews: number
  image: string
  badge?: string
}

export interface Testimonial {
  id: string
  quote: string
  author: string
  location: string
  rating: number
}

export const categories: Category[] = [
  { id: 'oils', name: 'Oils & Vinegars', href: '/shop?category=oils', image: '/images/cat-oils.png' },
  { id: 'honey', name: 'Honey & Preserves', href: '/shop?category=honey', image: '/images/cat-honey.png' },
  { id: 'chocolate', name: 'Chocolate', href: '/shop?category=chocolate', image: '/images/cat-chocolate.png' },
  { id: 'spices', name: 'Spices & Blends', href: '/shop?category=spices', image: '/images/cat-spices.png' },
  { id: 'coffee', name: 'Coffee', href: '/shop?category=coffee', image: '/images/cat-coffee.png' },
  { id: 'tea', name: 'Loose Leaf Tea', href: '/shop?category=tea', image: '/images/cat-tea.png' },
]

export const featuredProducts: Product[] = [
  {
    id: 'olive-oil',
    name: 'Cold-Pressed Olive Oil',
    category: 'Oils & Vinegars',
    price: 24.0,
    rating: 5,
    reviews: 128,
    image: '/images/prod-olive-oil.png',
    badge: 'Bestseller',
  },
  {
    id: 'wildflower-honey',
    name: 'Wildflower Honey',
    category: 'Honey & Preserves',
    price: 16.5,
    rating: 5,
    reviews: 94,
    image: '/images/prod-honey.png',
  },
  {
    id: 'dark-chocolate',
    name: '72% Dark Chocolate',
    category: 'Chocolate',
    price: 9.0,
    compareAt: 12.0,
    rating: 4,
    reviews: 212,
    image: '/images/prod-chocolate.png',
    badge: 'Limited',
  },
  {
    id: 'saffron',
    name: 'Pure Saffron Threads',
    category: 'Spices & Blends',
    price: 38.0,
    rating: 5,
    reviews: 47,
    image: '/images/prod-saffron.png',
  },
  {
    id: 'coffee',
    name: 'Single-Origin Coffee',
    category: 'Coffee',
    price: 19.0,
    rating: 4,
    reviews: 156,
    image: '/images/prod-coffee.png',
  },
  {
    id: 'earl-grey',
    name: 'Earl Grey Loose Tea',
    category: 'Loose Leaf Tea',
    price: 14.0,
    rating: 5,
    reviews: 73,
    image: '/images/prod-tea.png',
  },
  {
    id: 'balsamic',
    name: 'Aged Balsamic Vinegar',
    category: 'Oils & Vinegars',
    price: 28.0,
    rating: 5,
    reviews: 61,
    image: '/images/prod-balsamic.png',
    badge: 'New',
  },
  {
    id: 'fig-preserve',
    name: 'Fig & Walnut Preserve',
    category: 'Honey & Preserves',
    price: 12.5,
    rating: 4,
    reviews: 88,
    image: '/images/prod-preserve.png',
  },
]

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    quote:
      'Every jar feels like a gift. The wildflower honey is the best I have ever tasted, and it arrived beautifully packaged.',
    author: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
  },
  {
    id: 't2',
    quote:
      'I order the cold-pressed olive oil every month. Knowing the exact producer behind it makes all the difference.',
    author: 'James Whitfield',
    location: 'London',
    rating: 5,
  },
  {
    id: 't3',
    quote:
      'The gift box was a hit at our dinner party. Premium quality from start to finish — I am a customer for life.',
    author: 'Ananya Rao',
    location: 'Bengaluru',
    rating: 5,
  },
  {
    id: 't4',
    quote:
      'Fast delivery, gorgeous presentation, and the dark chocolate is genuinely exceptional. Highly recommended.',
    author: 'Marco Bianchi',
    location: 'Milan',
    rating: 4,
  },
  {
    id: 't5',
    quote:
      'Finally a gourmet store that cares about sourcing. The saffron is vivid and aromatic — restaurant grade.',
    author: 'Sofia Mendes',
    location: 'Lisbon',
    rating: 5,
  },
  {
    id: 't6',
    quote:
      'Their coffee changed my mornings. Rich, smooth, and ethically sourced. The subscription is effortless.',
    author: 'David Chen',
    location: 'Singapore',
    rating: 5,
  },
]
