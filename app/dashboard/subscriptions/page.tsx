// app/dashboard/subscriptions/page.tsx
import Link from 'next/link';
import { Suspense } from 'react';
import { format } from 'date-fns';
import { PlusCircle, Loader2 } from 'lucide-react';
import { auth } from '@/auth';
import prisma from '@/lib/db';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define the Subscription type
interface Subscription {
  id: string;
  name: string;
  description: string | null;
  price: number | any; // Change this to accept Decimal
  currency: string;
  billingCycle: string;
  startDate: Date;
  nextBillingDate: Date;
  category: string | null;
  logo: string | null;
  website: string | null;
  status: "ACTIVE" | "CANCELED" | "PAUSED" | "TRIAL";
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function SubscriptionsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Subscriptions</h1>
          <p className="text-gray-500">
            Manage all your subscriptions in one place
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/subscriptions/add">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Subscription
          </Link>
        </Button>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="canceled">Canceled</TabsTrigger>
          <TabsTrigger value="paused">Paused</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Subscriptions List */}
      <Suspense fallback={<SubscriptionsSkeleton />}>
        <SubscriptionsList />
      </Suspense>
    </div>
  );
}

async function SubscriptionsList() {
  const session = await auth();
  
  if (!session || !session.user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>You must be signed in to view this page.</p>
      </div>
    );
  }
  
  // Fetch user's subscriptions
  const subscriptions = await prisma.subscription.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      nextBillingDate: 'asc',
    },
  });

  // If no subscriptions found
  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
        <h3 className="text-lg font-medium">No subscriptions yet</h3>
        <p className="text-gray-500 mb-6">
          Start tracking your subscriptions by adding your first one.
        </p>
        <Button asChild>
          <Link href="/dashboard/subscriptions/add">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Subscription
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {subscriptions.map(subscription => (
        <SubscriptionCard key={subscription.id} subscription={subscription} />
      ))}
    </div>
  );
}

function SubscriptionCard({ subscription }: { subscription: Subscription }) {
  const statusColors: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-800',
    CANCELED: 'bg-red-100 text-red-800',
    PAUSED: 'bg-yellow-100 text-yellow-800',
    TRIAL: 'bg-blue-100 text-blue-800'
  };

  const formatCurrency = (amount: number, currency: string = "MYR") => {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getBillingCycleText = (cycle: string) => {
    switch (cycle) {
      case "MONTHLY":
        return "Monthly";
      case "QUARTERLY":
        return "Every 3 months";
      case "BIANNUAL":
        return "Every 6 months";
      case "ANNUAL":
        return "Yearly";
      case "CUSTOM":
        return "Custom";
      default:
        return cycle;
    }
  };

  // Get first letter of name for avatar
  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Avatar>
              <div className="flex h-full w-full items-center justify-center bg-indigo-100 text-indigo-600 font-medium">
                {subscription.logo || getInitial(subscription.name)}
              </div>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{subscription.name}</CardTitle>
              <CardDescription>{subscription.category || "Uncategorized"}</CardDescription>
            </div>
          </div>
          <Badge className={statusColors[subscription.status] || "bg-gray-100 text-gray-800"}>
            {subscription.status.charAt(0) + subscription.status.slice(1).toLowerCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Price:</div>
          <div className="font-medium">
            {formatCurrency(Number(subscription.price), subscription.currency)}
          </div>
          
          <div className="text-muted-foreground">Billing:</div>
          <div className="font-medium">{getBillingCycleText(subscription.billingCycle)}</div>
          
          <div className="text-muted-foreground">Next Payment:</div>
          <div className="font-medium">
            {format(new Date(subscription.nextBillingDate), "MMM d, yyyy")}
          </div>
          
          {subscription.description && (
            <>
              <div className="text-muted-foreground">Description:</div>
              <div className="font-medium line-clamp-1">{subscription.description}</div>
            </>
          )}
        </div>
        
        <div className="mt-4 flex gap-2">
          <Button size="sm" variant="outline" asChild className="flex-1">
            <Link href={`/dashboard/subscriptions/${subscription.id}`}>View</Link>
          </Button>
          <Button size="sm" variant="outline" asChild className="flex-1">
            <Link href={`/dashboard/subscriptions/${subscription.id}/edit`}>Edit</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SubscriptionsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse"></div>
              <div>
                <div className="h-5 w-24 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-32 bg-muted rounded animate-pulse mt-1"></div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[1, 2, 3, 4].map(j => (
                <div key={j} className="flex justify-between">
                  <div className="h-4 w-20 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                </div>
              ))}
              <div className="flex gap-2 mt-4">
                <div className="h-8 flex-1 bg-muted rounded animate-pulse"></div>
                <div className="h-8 flex-1 bg-muted rounded animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}