"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { ShoppingCart } from "lucide-react"

type Product = {
  id: string
  name: string
  description: string
  price: number
  images: string[]
  moodCategoryId: string
  moodCategory: {
    name: string
  }
}

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { addToCart } = useCart()

  useEffect(() => {
    // In a real app, this would fetch from your API
    const fetchProducts = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockProducts = Array.from({ length: 12 }).map((_, i) => ({
          id: `product-${i + 1}`,
          name: `Product ${i + 1}`,
          description:
            "This is a product description that would typically describe the features and benefits of the product.",
          price: 19.99 + i * 5,
          images: [`/placeholder.svg?height=300&width=300`],
          moodCategoryId: ["happy", "relaxed", "energetic", "stressed", "creative"][Math.floor(Math.random() * 5)],
          moodCategory: {
            name: ["Happy", "Relaxed", "Energetic", "Stressed", "Creative"][Math.floor(Math.random() * 5)],
          },
        }))

        setProducts(mockProducts)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-[200px] bg-muted rounded-t-lg" />
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded w-2/3 mb-2" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <div className="h-8 bg-muted rounded w-1/3" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">No products found</h2>
        <p className="text-muted-foreground">Try adjusting your filters or check back later for new products.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <Link href={`/products/${product.id}`} className="block relative h-[200px]">
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover transition-transform hover:scale-105"
            />
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {product.moodCategory.name}
            </div>
          </Link>
          <CardContent className="p-4">
            <Link href={`/products/${product.id}`} className="block">
              <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">{product.name}</h3>
              <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
            </Link>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between items-center">
            <span className="font-medium">${product.price.toFixed(2)}</span>
            <Button
              size="sm"
              onClick={() =>
                addToCart(
                  {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.images[0],
                  },
                  1,
                )
              }
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

