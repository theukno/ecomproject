import { NextResponse } from "next/server"
import { compare } from "bcrypt"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { sign } from "jsonwebtoken"
import { cookies } from "next/headers"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Validate input
    const result = loginSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ message: "Invalid input", errors: result.error.errors }, { status: 400 })
    }

    const { email, password } = result.data

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return NextResponse.json({ message: "Please verify your email before logging in" }, { status: 403 })
    }

    // Verify password
    const passwordMatch = await compare(password, user.password)
    if (!passwordMatch) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // Create JWT token
    const token = sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "fallback_secret", {
      expiresIn: "7d",
    })

    // Set cookie
    const cookieStore = cookies()
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    })

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}

