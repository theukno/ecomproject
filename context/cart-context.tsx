"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "./auth-context"

type CartItem = {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

interface CartContextType {
  cartItems: CartItem[]
  cartItemsCount: number
  cartTotal: number
  addToCart: (
    product: {
      id: string
      name: string
      price: number
      image: string
    },
    quantity: number,
  ) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useAuth()

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0)
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const res = await fetch("/api/cart")
          if (res.ok) {
            const data = await res.json()
            setCartItems(data.items)
          }
        } catch (error) {
          console.error("Failed to fetch cart:", error)
        }
      } else {
        // Load from local storage if not logged in
        const storedCart = localStorage.getItem("cart")
        if (storedCart) {
          setCartItems(JSON.parse(storedCart))
        }
      }
      setIsLoading(false)
    }

    fetchCart()
  }, [user])

  // Save cart to localStorage whenever it changes (for non-logged in users)
  useEffect(() => {
    if (!user && !isLoading) {
      localStorage.setItem("cart", JSON.stringify(cartItems))
    }
  }, [cartItems, user, isLoading])

  const addToCart = async (
    product: {
      id: string
      name: string
      price: number
      image: string
    },
    quantity: number,
  ) => {
    const existingItemIndex = cartItems.findIndex((item) => item.productId === product.id)
    let updatedCart: CartItem[]

    if (existingItemIndex >= 0) {
      // Update quantity if item already exists
      updatedCart = [...cartItems]
      updatedCart[existingItemIndex].quantity += quantity
    } else {
      // Add new item
      const newItem: CartItem = {
        id: Math.random().toString(36).substring(2, 9), // Temporary ID for non-logged in users
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
        image: product.image,
      }
      updatedCart = [...cartItems, newItem]
    }

    setCartItems(updatedCart)

    if (user) {
      try {
        await fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: product.id,
            quantity: quantity,
          }),
        })
      } catch (error) {
        console.error("Failed to update cart on server:", error)
      }
    }

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    })
  }

  const removeFromCart = async (productId: string) => {
    const updatedCart = cartItems.filter((item) => item.productId !== productId)
    setCartItems(updatedCart)

    if (user) {
      try {
        await fetch(`/api/cart/items/${productId}`, {
          method: "DELETE",
        })
      } catch (error) {
        console.error("Failed to remove item from cart on server:", error)
      }
    }

    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart",
    })
  }

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    const updatedCart = cartItems.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    setCartItems(updatedCart)

    if (user) {
      try {
        await fetch(`/api/cart/items/${productId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity }),
        })
      } catch (error) {
        console.error("Failed to update quantity on server:", error)
      }
    }
  }

  const clearCart = async () => {
    setCartItems([])

    if (user) {
      try {
        await fetch("/api/cart", {
          method: "DELETE",
        })
      } catch (error) {
        console.error("Failed to clear cart on server:", error)
      }
    }
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartItemsCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

