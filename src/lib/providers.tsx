'use client'

import { Provider } from 'react-redux'
import { store } from './store'

// React Query was mounted here with its devtools, but the storefront makes no
// queries: product data is a static import and the cart is Redux. Both were
// shipping to every visitor for nothing. Reinstate when there is server state
// to fetch -- a real inventory feed or an order lookup.
export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>
}
