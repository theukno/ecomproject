import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-12 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>Thank you for your purchase. Your order has been successfully placed and is being processed.</p>
          <p className="text-muted-foreground">
            You will receive an email confirmation shortly with your order details.
          </p>
          <div className="bg-muted p-4 rounded-md mt-6">
            <h3 className="font-medium mb-2">Order Number</h3>
            <p className="text-lg font-mono">{generateOrderNumber()}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/orders">View Your Orders</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

// Generate a random order number for demo purposes
function generateOrderNumber() {
  return `ORD-${Math.floor(100000 + Math.random() * 900000)}`
}

