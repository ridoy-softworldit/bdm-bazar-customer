import CartPage from '@/Component/Page/cart/Cart'
import MoreProducts from '@/Component/Page/cart/MoreProducts'
import PopularProducts from '@/Component/Page/cart/PopularProducts'
import React from 'react'
export default function page() {
  return (
    <div>
      <CartPage />
      <MoreProducts />
      <PopularProducts />
    </div>
  )
}
