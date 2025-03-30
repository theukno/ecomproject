"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingBag, Package, Clock, CheckCircle, XCircle } from "lucide-react"

type Order = {
  id: string
  date: Date
  total: number
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  items: {
    id: string
    name: string
    quantity: number
    price: number
  }[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch from your API
    const fetchOrders = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockOrders: Order[] = Array.from({ length: 5 }).map((_, i) => ({
          id: `ORD-${100000 + i}`,
          date: new Date(Date.now() - i * 86400000 * 3), // Each order is 3 days apart
          total: 50 + Math.random() * 200,
          status: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"][i % 5] as any,
          items: Array.from({ length: 1 + Math.floor(Math.random() * 3) }).map((_, j) => ({
            id: `item-${i}-${j}`,
            name: `Product ${j + 1}`,
            quantity: 1 + Math.floor(Math.random() * 3),
            price: 19.99 + j * 10,
          })),
        }))

        setOrders(mockOrders)
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4" />
      case "PROCESSING":
        return <ShoppingBag className="h-4 w-4" />
      case "SHIPPED":
        return <Package className="h-4 w-4" />
      case "DELIVERED":
        return <CheckCircle className="h-4 w-4" />
      case "CANCELLED":
        return <XCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      case "PROCESSING":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "SHIPPED":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
      case "DELIVERED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Orders</h1>
        <Card className="text-center py-12">
          <CardContent className="flex flex-col items-center space-y-4">
            <ShoppingBag className="h-16 w-16 text-muted-foreground" />
            <h2 className="text-2xl font-semibold">No orders yet</h2>
            <p className="text-muted-foreground">
              You haven&apos;t placed any orders yet. Start shopping to see your orders here.
            </p>
            <Button asChild className="mt-4">
              <Link href="/products">Start Shopping</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Orders</h1>

      <Tabs defaultValue="all">
        <TabsList className="mb-8">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Order #{order.id}</CardTitle>
                  <CardDescription>Placed on {order.date.toLocaleDateString()}</CardDescription>
                </div>
                <Badge className={`flex items-center gap-1 ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">Quantity: {item.quantity}</div>
                      </div>
                      <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                  <div className="flex justify-between pt-4 border-t">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="processing" className="space-y-6">
          {orders
            .filter((order) => order.status === "PENDING" || order.status === "PROCESSING")
            .map((order) => (
              <Card key={order.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Order #{order.id}</CardTitle>
                    <CardDescription>Placed on {order.date.toLocaleDateString()}</CardDescription>
                  </div>
                  <Badge className={`flex items-center gap-1 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">Quantity: {item.quantity}</div>
                        </div>
                        <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                    <div className="flex justify-between pt-4 border-t">
                      <span className="font-bold">Total</span>
                      <span className="font-bold">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="shipped" className="space-y-6">
          {orders
            .filter((order) => order.status === "SHIPPED")
            .map((order) => (
              <Card key={order.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Order #{order.id}</CardTitle>
                    <CardDescription>Placed on {order.date.toLocaleDateString()}</CardDescription>
                  </div>
                  <Badge className={`flex items-center gap-1 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">Quantity: {item.quantity}</div>
                        </div>
                        <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                    <div className="flex justify-between pt-4 border-t">
                      <span className="font-bold">Total</span>
                      <span className="font-bold">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="delivered" className="space-y-6">
          {orders
            .filter((order) => order.status === "DELIVERED")
            .map((order) => (
              <Card key={order.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Order #{order.id}</CardTitle>
                    <CardDescription>Placed on {order.date.toLocaleDateString()}</CardDescription>
                  </div>
                  <Badge className={`flex items-center gap-1 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">Quantity: {item.quantity}</div>
                        </div>
                        <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                    <div className="flex justify-between pt-4 border-t">
                      <span className="font-bold">Total</span>
                      <span className="font-bold">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

