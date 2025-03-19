import { NextResponse } from "next/server";
import { z } from "zod";
import bcryptjs from "bcryptjs";
import prisma from "@/lib/db";

// User registration schema
const UserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const result = UserSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    
    const { name, email, password } = result.data;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);
    
    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    
    return NextResponse.json(
      { 
        message: "User registered successfully", 
        user: newUser 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}