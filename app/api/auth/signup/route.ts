import { NextResponse } from "next/server";
import { hash } from "bcryptjs"; // bcryptjs works better in Next.js
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate input
    const result = signupSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid input", errors: result.error.errors },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password before storing
    const hashedPassword = await hash(password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Expires in 10 minutes

    // Start a transaction: create user & store OTP
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: false, // Ensure verification before login
      },
    });

    await prisma.oTP.upsert({
      where: { email },
      update: { code: otp, expiresAt },
      create: { email, code: otp, expiresAt },
    });

    // In a real app, send the OTP via email
    console.log(`OTP for ${email}: ${otp}`);

    return NextResponse.json(
      { message: "User created successfully. Please verify your email." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
