'use client'

import { useEffect } from 'react'
import { Provider, useDispatch } from 'react-redux'
import { store } from './store'
import { hydrateCart } from './features/cartSlice'

// React Query was mounted here with its devtools, but the storefront makes no
// queries: product data is a static import and the cart is Redux. Both were
// shipping to every visitor for nothing. Reinstate when there is server state
// to fetch -- a real inventory feed or an order lookup.

/**
 * Restores a saved bag once, after mount.
 *
 * This cannot happen during store creation: the server has no localStorage, so
 * initialising from it there would render different markup on the server and
 * the client and break hydration.
 */
function CartHydrator() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(hydrateCart())
  }, [dispatch])
  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <CartHydrator />
      {children}
    </Provider>
  )
}
