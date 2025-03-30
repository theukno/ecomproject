import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  const cookieStore = cookies()

  // Expire the token by setting an empty value & maxAge to 0
  cookieStore.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0), // Immediately expire
    path: "/",
  })

  return NextResponse.json({ message: "Logged out successfully" }, { status: 200 })
}
