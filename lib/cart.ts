"use client"

import { useState, useEffect } from "react"

export interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image_url: string
  brand: string
  stock_quantity: number
}

export interface Cart {
  items: CartItem[]
  total: number
  itemCount: number
}

const CART_STORAGE_KEY = "blows_cart"

export const useCart = () => {
  const [cart, setCart] = useState<Cart>({
    items: [],
    total: 0,
    itemCount: 0,
  })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setCart(parsedCart)
      } catch (error) {
        console.error("Error loading cart:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  const calculateTotals = (items: CartItem[]) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
    return { total, itemCount }
  }

  const addToCart = (product: Omit<CartItem, "quantity">, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.items.find((item) => item.id === product.id)

      let newItems: CartItem[]
      if (existingItem) {
        // Update quantity if item already exists
        const newQuantity = Math.min(existingItem.quantity + quantity, product.stock_quantity)
        newItems = prevCart.items.map((item) => (item.id === product.id ? { ...item, quantity: newQuantity } : item))
      } else {
        // Add new item
        const safeQuantity = Math.min(quantity, product.stock_quantity)
        newItems = [...prevCart.items, { ...product, quantity: safeQuantity }]
      }

      const { total, itemCount } = calculateTotals(newItems)
      return { items: newItems, total, itemCount }
    })
  }

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => {
      const newItems = prevCart.items.filter((item) => item.id !== productId)
      const { total, itemCount } = calculateTotals(newItems)
      return { items: newItems, total, itemCount }
    })
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart((prevCart) => {
      const newItems = prevCart.items.map((item) => {
        if (item.id === productId) {
          const safeQuantity = Math.min(quantity, item.stock_quantity)
          return { ...item, quantity: safeQuantity }
        }
        return item
      })

      const { total, itemCount } = calculateTotals(newItems)
      return { items: newItems, total, itemCount }
    })
  }

  const clearCart = () => {
    setCart({ items: [], total: 0, itemCount: 0 })
  }

  const getItemQuantity = (productId: number): number => {
    const item = cart.items.find((item) => item.id === productId)
    return item ? item.quantity : 0
  }

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
  }
}
