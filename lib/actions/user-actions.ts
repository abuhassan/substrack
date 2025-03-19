// lib/actions/user-actions.ts
'use server';

import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema
const UserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function registerUser(formData: FormData) {
  try {
    // Extract and validate the form data
    const validatedFields = UserSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    });

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedFields.email },
    });

    if (existingUser) {
      return { error: 'User with this email already exists' };
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(validatedFields.password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        name: validatedFields.name,
        email: validatedFields.email,
        password: hashedPassword,
      },
    });

    return { success: true, userId: user.id };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: 'Failed to register user' };
  }
}