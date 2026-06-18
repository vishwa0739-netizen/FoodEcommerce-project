import { Hero } from '@/components/home/hero'
import { CategoryCards } from '@/components/home/category-cards'
import { FeaturedProducts } from '@/components/home/featured-products'
import { Testimonials } from '@/components/home/testimonials'
import { Newsletter } from '@/components/home/newsletter'

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryCards />
      <FeaturedProducts />
      <Testimonials />
      <Newsletter />
    </>
  )
}
