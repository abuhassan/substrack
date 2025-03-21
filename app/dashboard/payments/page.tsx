// app/dashboard/payments/page.tsx
import React from 'react';
import { Suspense } from 'react';
import { auth } from '@/auth';
import prisma from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, DollarSign, AlertCircle, BarChart2 } from 'lucide-react';

// Component to display upcoming payments
async function UpcomingPayments() {
  const session = await auth();
  
  if (!session || !session.user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>You must be signed in to view your payments.</p>
      </div>
    );
  }
  
  // Fetch upcoming payments (next 30 days)
  const upcomingPayments = await prisma.subscription.findMany({
    where: {
      userId: session.user.id,
      status: "ACTIVE",
      nextBillingDate: {
        lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    },
    orderBy: {
      nextBillingDate: 'asc',
    },
  });
  
  if (upcomingPayments.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-muted-foreground">No upcoming payments in the next 30 days</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {upcomingPayments.map((payment) => (
        <Card key={payment.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium">{payment.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {new Date(payment.nextBillingDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {new Intl.NumberFormat('en-MY', {
                    style: 'currency',
                    currency: payment.currency || 'MYR',
                  }).format(Number(payment.price))}
                </p>
                <p className="text-xs text-muted-foreground">
                  {payment.billingCycle.toLowerCase()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Component to display payment history
async function PaymentHistory() {
  const session = await auth();
  
  if (!session || !session.user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>You must be signed in to view your payment history.</p>
      </div>
    );
  }
  
  // This would normally be a separate table in your database
  // For now, we'll just show a placeholder
  
  return (
    <div className="text-center py-6">
      <p className="text-muted-foreground">Payment history will be available soon</p>
    </div>
  );
}

// Component to display payment analytics
async function PaymentAnalytics() {
  const session = await auth();
  
  if (!session || !session.user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>You must be signed in to view your payment analytics.</p>
      </div>
    );
  }
  
  // Fetch all active subscriptions
  const subscriptions = await prisma.subscription.findMany({
    where: {
      userId: session.user.id,
      status: "ACTIVE",
    },
  });
  
  // Calculate total monthly cost
  const monthlyTotal = subscriptions.reduce((total, sub) => {
    const price = Number(sub.price);
    
    // Convert different billing cycles to monthly equivalent
    switch (sub.billingCycle) {
      case "MONTHLY":
        return total + price;
      case "QUARTERLY":
        return total + (price / 3);
      case "BIANNUAL":
        return total + (price / 6);
      case "ANNUAL":
        return total + (price / 12);
      default:
        return total + price;
    }
  }, 0);
  
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Monthly Spending</CardTitle>
          <CardDescription>Total of all active subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat('en-MY', {
              style: 'currency',
              currency: 'MYR',
            }).format(monthlyTotal)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Based on {subscriptions.length} active subscriptions
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Annual Projection</CardTitle>
          <CardDescription>Estimated yearly spending</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat('en-MY', {
              style: 'currency',
              currency: 'MYR',
            }).format(monthlyTotal * 12)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Based on current monthly spending
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Loading skeletons
function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
                <div>
                  <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
                  <div className="h-3 w-24 bg-muted rounded animate-pulse mt-1"></div>
                </div>
              </div>
              <div className="text-right">
                <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                <div className="h-3 w-12 bg-muted rounded animate-pulse mt-1 ml-auto"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Main page component
export default function PaymentsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Payments</h1>
        <p className="text-muted-foreground">
          Manage and track your subscription payments
        </p>
      </div>
      
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          <h2 className="text-xl font-semibold">Upcoming Payments</h2>
          <Suspense fallback={<LoadingSkeleton />}>
            <UpcomingPayments />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <h2 className="text-xl font-semibold">Payment History</h2>
          <Suspense fallback={<LoadingSkeleton />}>
            <PaymentHistory />
          </Suspense>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <h2 className="text-xl font-semibold">Payment Analytics</h2>
          <Suspense fallback={<LoadingSkeleton />}>
            <PaymentAnalytics />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}