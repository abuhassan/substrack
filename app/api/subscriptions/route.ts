// app/api/subscriptions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get current user
    const userId = session.user.id;
    
    // Get subscription data from request
    const data = await request.json();
    
    // Calculate the next billing date if not provided
    let nextBillingDate = data.nextBillingDate 
      ? new Date(data.nextBillingDate) 
      : new Date(data.startDate);
      
    // If nextBillingDate was not provided, calculate it
    if (!data.nextBillingDate) {
      switch (data.billingCycle) {
        case "MONTHLY":
          nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
          break;
        case "QUARTERLY":
          nextBillingDate.setMonth(nextBillingDate.getMonth() + 3);
          break;
        case "BIANNUAL":
          nextBillingDate.setMonth(nextBillingDate.getMonth() + 6);
          break;
        case "ANNUAL":
          nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
          break;
        // Default to monthly if custom or unspecified
        default:
          nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      }
    }
    
    // Create subscription
    const subscription = await prisma.subscription.create({
      data: {
        name: data.name,
        description: data.description || null,
        price: data.price,
        currency: data.currency || "MYR",
        billingCycle: data.billingCycle,
        startDate: new Date(data.startDate),
        nextBillingDate: nextBillingDate,
        category: data.category || null,
        website: data.website || null,
        logo: data.logo || null,
        status: data.status || "ACTIVE",
        userId: userId,
      },
    });
    
    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { message: "Error creating subscription", error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get current user
    const userId = session.user.id;
    
    // Get search params
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    
    // Build query filters
    const filters: any = {
      userId: userId,
    };
    
    if (status) {
      filters.status = status;
    }
    
    if (category) {
      filters.category = category;
    }
    
    // Get subscriptions
    const subscriptions = await prisma.subscription.findMany({
      where: filters,
      orderBy: {
        nextBillingDate: "asc",
      },
    });
    
    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { message: "Error fetching subscriptions", error: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get ID from query params
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { message: "Subscription ID is required" },
        { status: 400 }
      );
    }
    
    // Check if subscription exists and belongs to user
    const subscription = await prisma.subscription.findUnique({
      where: {
        id: id,
        userId: session.user.id,
      },
    });
    
    if (!subscription) {
      return NextResponse.json(
        { message: "Subscription not found" },
        { status: 404 }
      );
    }
    
    // Delete subscription
    await prisma.subscription.delete({
      where: {
        id: id,
      },
    });
    
    return NextResponse.json(
      { message: "Subscription deleted successfully" }
    );
  } catch (error) {
    console.error("Error deleting subscription:", error);
    return NextResponse.json(
      { message: "Error deleting subscription", error: String(error) },
      { status: 500 }
    );
  }
}

// Handle subscription status updates (PATCH)
export async function PATCH(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get ID from query params
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { message: "Subscription ID is required" },
        { status: 400 }
      );
    }
    
    // Get data from request
    const data = await request.json();
    
    // Check if subscription exists and belongs to user
    const subscription = await prisma.subscription.findUnique({
      where: {
        id: id,
        userId: session.user.id,
      },
    });
    
    if (!subscription) {
      return NextResponse.json(
        { message: "Subscription not found" },
        { status: 404 }
      );
    }
    
    // Update subscription
    const updatedSubscription = await prisma.subscription.update({
      where: {
        id: id,
      },
      data: data,
    });
    
    return NextResponse.json(updatedSubscription);
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { message: "Error updating subscription", error: String(error) },
      { status: 500 }
    );
  }
}