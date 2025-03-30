import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const verifyOTPSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate input
    const result = verifyOTPSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ message: "Invalid input", errors: result.error.errors }, { status: 400 })
    }

    const { email, otp } = result.data

    // Find OTP record
    const otpRecord = await prisma.OTP.findUnique({
      where: { email },
    })

    if (!otpRecord) {
      return NextResponse.json({ message: "No OTP request found" }, { status: 404 })
    }

    // Check if OTP is expired
    if (otpRecord.expiresAt < new Date()) {
      await prisma.OTP.delete({ where: { email } }) // Clean up expired OTP
      return NextResponse.json({ message: "OTP has expired" }, { status: 400 })
    }

    // Verify OTP
    if (otpRecord.code !== otp) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 })
    }

    // Mark email as verified
    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    })

    // Delete OTP record after successful verification
    await prisma.OTP.delete({ where: { email } })

    return NextResponse.json({ message: "Email verified successfully" }, { status: 200 })
  } catch (error) {
    console.error("Verify OTP error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}
