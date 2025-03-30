import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const requestOTPSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate input
    const result = requestOTPSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ message: "Invalid input", errors: result.error.errors }, { status: 400 })
    }

    const { email } = result.data

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 10) // OTP expires in 10 minutes

    await prisma.oTP.upsert({
      where: { email },
      update: {
        code: otp,
        expiresAt,
      },
      create: {
        email,
        code: otp,
        expiresAt,
      },
    })

    // In a real app, you would send the OTP via email
    console.log(`OTP for ${email}: ${otp}`)

    return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 })
  } catch (error) {
    console.error("Request OTP error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

