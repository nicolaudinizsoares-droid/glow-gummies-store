import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/lib/store'
import { addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, openCart, closeCart } from '@/lib/features/cartSlice'
import { track } from '@/lib/analytics'

export const useCart = () => {
  const dispatch = useDispatch()
  const cart = useSelector((state: RootState) => state.cart)

  const handleAddToCart = (product: {
    id: string // This will be the product ID
    name: string
    price: number
    image?: string
    category: string
    size?: string
    sku: string
    quantity?: number
  }) => {
    // Add productId field and keep id as the original product ID for the cart slice
    const cartProduct = {
      ...product,
      productId: product.id, // Store original product ID
    }
    dispatch(addToCart(cartProduct))

    track({
      name: 'add_to_cart',
      id: product.id,
      item: product.name,
      quantity: product.quantity ?? 1,
      value: product.price * (product.quantity ?? 1),
    })
    
    // Auto-open cart sidebar for immediate feedback (Amazon-style)
    setTimeout(() => {
      dispatch(openCart())
    }, 100)
  }

  const handleRemoveFromCart = (id: string) => {
    const item = cart.items.find(i => i.id === id)
    dispatch(removeFromCart(id))

    if (item) {
      track({
        name: 'remove_from_cart',
        id: item.productId,
        item: item.name,
        quantity: item.quantity,
        value: item.price * item.quantity,
      })
    }
  }

  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }))
  }

  const handleClearCart = () => {
    dispatch(clearCart())
  }

  const handleToggleCart = () => {
    dispatch(toggleCart())
  }

  const handleOpenCart = () => {
    dispatch(openCart())
  }

  const handleCloseCart = () => {
    dispatch(closeCart())
  }

  return {
    ...cart,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
    toggleCart: handleToggleCart,
    openCart: handleOpenCart,
    closeCart: handleCloseCart,
  }
}
