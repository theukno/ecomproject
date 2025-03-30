import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verify } from "jsonwebtoken"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get("token")?.value // Safely access token value

    if (!token) {
      return NextResponse.json({ message: "Unauthorized: No token provided" }, { status: 401 })
    }

    let decoded
    try {
      decoded = verify(token, process.env.JWT_SECRET || "fallback_secret") as { id: string }
    } catch (err) {
      return NextResponse.json({ message: "Unauthorized: Invalid token" }, { status: 401 })
    }

    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, image: true },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
