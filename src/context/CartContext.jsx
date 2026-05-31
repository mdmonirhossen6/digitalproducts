import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext({})
export const useCart = () => useContext(CartContext)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cart')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const addItem = (product) => {
    setItems(prev => prev.find(i => i.id === product.id)
      ? prev
      : [...prev, product])
  }
  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id))
  const clearCart  = () => setItems([])
  const total = items.reduce((s, i) => s + i.price, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total }}>
      {children}
    </CartContext.Provider>
  )
}
