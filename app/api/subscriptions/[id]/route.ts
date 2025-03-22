// Example API route for updating a subscription (app/api/subscriptions/[id]/route.ts)
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const subscription = await prisma.subscription.findUnique({
      where: { 
        id: params.id,
        userId: session.user.id, // Ensure user can only update their own subscriptions
      },
    });
    
    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }
    
    const data = await request.json();
    
    // Validate data here
    
    const updated = await prisma.subscription.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        currency: data.currency,
        billingCycle: data.billingCycle,
        category: data.category,
        website: data.website,
        logo: data.logo,
        status: data.status,
        nextBillingDate: new Date(data.nextBillingDate),
        // other fields...
      },
    });
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const subscription = await prisma.subscription.findUnique({
      where: { 
        id: params.id,
        userId: session.user.id, // Ensure user can only delete their own subscriptions
      },
    });
    
    if (!subscription) {
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 });
    }
    
    await prisma.subscription.delete({
      where: { id: params.id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting subscription:', error);
    return NextResponse.json(
      { error: 'Failed to delete subscription' },
      { status: 500 }
    );
  }
}