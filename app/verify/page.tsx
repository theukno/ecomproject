"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function VerifyPage() {
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const searchParams = useSearchParams()
  const router = useRouter()
  const { verifyOTP, requestOTP } = useAuth()

  const email = searchParams.get("email") || ""

  useEffect(() => {
    if (!email) {
      router.push("/login")
    }
  }, [email, router])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await verifyOTP(email, otp)
      if (success) {
        router.push("/login")
      }
    } catch (error) {
      console.error("Verification error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setIsLoading(true)

    try {
      await requestOTP(email)
      setCountdown(60)
    } catch (error) {
      console.error("Resend OTP error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-8rem)] py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Verify Your Email</CardTitle>
          <CardDescription className="text-center">We&apos;ve sent a verification code to {email}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify Email"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-muted-foreground">Didn&apos;t receive the code?</p>
          <Button
            type="button"
            variant="outline"
            onClick={handleResendOTP}
            disabled={isLoading || countdown > 0}
            className="w-full"
          >
            {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

