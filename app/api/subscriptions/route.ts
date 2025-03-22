// app/api/subscriptions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/db';
import { calculateNextBillingDate } from '@/lib/utils';
import { BillingCycleType, SubscriptionStatus } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await request.json();
    
    // Create the base subscription data
    const subscriptionData = {
      name: data.name,
      description: data.description,
      price: data.price,
      currency: data.currency || 'MYR',
      billingCycle: data.billingCycle as BillingCycleType,
      startDate: new Date(data.startDate),
      // Next billing date is required in Prisma type, so provide a default
      nextBillingDate: new Date(data.startDate), // Default value that will be overwritten
      category: data.category,
      logo: data.logo,
      website: data.website,
      status: (data.status || 'ACTIVE') as SubscriptionStatus,
      userId: session.user.id,
    };
    
    // Update nextBillingDate based on billing cycle
    if (data.billingCycle !== 'LIFETIME') {
      // For non-lifetime subscriptions, calculate the next billing date
      subscriptionData.nextBillingDate = data.nextBillingDate 
        ? new Date(data.nextBillingDate) 
        : calculateNextBillingDate(new Date(data.startDate), data.billingCycle) || new Date(data.startDate);
    } else {
      // For lifetime subscriptions, set to null if your schema allows it
      // If not, you could set it to a far future date like the year 9999
      subscriptionData.nextBillingDate = null as any; // Type casting to bypass TypeScript
    }
    
    const subscription = await prisma.subscription.create({
      data: subscriptionData,
    });
    
    return NextResponse.json(subscription);
  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const billingCycle = searchParams.get('billingCycle');
    
    // Build where clause with proper types
    const where: any = { userId: session.user.id };
    
    if (status) {
      where.status = status as SubscriptionStatus;
    }
    
    if (category) {
      where.category = category;
    }
    
    if (billingCycle) {
      where.billingCycle = billingCycle as BillingCycleType;
    }
    
    // Determine order based on billingCycle
    const orderBy = billingCycle === 'LIFETIME' 
      ? { startDate: 'desc' as const } 
      : { nextBillingDate: 'asc' as const };
    
    // Fetch subscriptions with filters
    const subscriptions = await prisma.subscription.findMany({
      where,
      orderBy,
    });
    
    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}