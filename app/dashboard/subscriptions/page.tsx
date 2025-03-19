// app/dashboard/subscriptions/page.tsx
import Link from 'next/link';
import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// Define the Subscription type
interface Subscription {
    id: number;
    name: string;
    description: string;
    price: number;
    billingCycle: string;
    nextBillingDate: string;
    category: string;
    status: "ACTIVE" | "CANCELED" | "PAUSED" | "TRIAL"; // Use literal union type
    logo: string;
  }

export default function SubscriptionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
        <Button asChild>
          <Link href="/dashboard/subscriptions/add">Add Subscription</Link>
        </Button>
      </div>

      {/* Filters and sorting */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter and sort your subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">All</Button>
            <Button variant="outline" size="sm">Active</Button>
            <Button variant="outline" size="sm">Canceled</Button>
            <Button variant="outline" size="sm">Trial</Button>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions List */}
      <Suspense fallback={<SubscriptionsSkeleton />}>
        <SubscriptionsList />
      </Suspense>
    </div>
  );
}

function SubscriptionsList() {
  // This would be fetched from your database in a real implementation
  const subscriptions: Subscription[] = [
    {
      id: 1,
      name: 'Netflix',
      description: 'Standard Plan',
      price: 15.99,
      billingCycle: 'MONTHLY',
      nextBillingDate: '2025-03-22',
      category: 'Entertainment',
      status: 'ACTIVE',
      logo: 'N'
    },
    {
      id: 2,
      name: 'Spotify',
      description: 'Premium Individual',
      price: 9.99,
      billingCycle: 'MONTHLY',
      nextBillingDate: '2025-03-25',
      category: 'Entertainment',
      status: 'ACTIVE' as 'ACTIVE',
      logo: 'S'
    },
    {
      id: 3,
      name: 'Adobe Creative Cloud',
      description: 'All Apps',
      price: 52.99,
      billingCycle: 'MONTHLY',
      nextBillingDate: '2025-04-01',
      category: 'Productivity',
      status: 'ACTIVE',
      logo: 'A'
    },
    {
      id: 4,
      name: 'New York Times',
      description: 'Digital Subscription',
      price: 4.99,
      billingCycle: 'MONTHLY',
      nextBillingDate: '2025-04-03',
      category: 'News',
      status: 'ACTIVE',
      logo: 'NYT'
    },
    {
      id: 5,
      name: 'Notion Pro',
      description: 'Pro Plan',
      price: 8.00,
      billingCycle: 'MONTHLY',
      nextBillingDate: '2025-04-15',
      category: 'Productivity',
      status: 'ACTIVE',
      logo: 'N'
    },
    {
      id: 6,
      name: 'Disney+',
      description: 'Standard Plan',
      price: 7.99,
      billingCycle: 'MONTHLY',
      nextBillingDate: '2025-04-10',
      category: 'Entertainment',
      status: 'ACTIVE',
      logo: 'D+'
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {subscriptions.map(subscription => (
        <SubscriptionCard key={subscription.id} subscription={subscription} />
      ))}
    </div>
  );
}

interface Subscription {
  id: number;
  name: string;
  description: string;
  price: number;
  billingCycle: string;
  nextBillingDate: string;
  category: string;
  status: 'ACTIVE' | 'CANCELED' | 'PAUSED' | 'TRIAL';
  logo: string;
}

function SubscriptionCard({ subscription }: { subscription: Subscription }) {
  const statusColors = {
    ACTIVE: 'bg-green-100 text-green-800',
    CANCELED: 'bg-red-100 text-red-800',
    PAUSED: 'bg-yellow-100 text-yellow-800',
    TRIAL: 'bg-blue-100 text-blue-800'
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatBillingCycle = (cycle: string) => {
    return cycle.charAt(0) + cycle.slice(1).toLowerCase();
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Avatar>
              <div className="flex h-full w-full items-center justify-center bg-muted">
                {subscription.logo}
              </div>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{subscription.name}</CardTitle>
              <CardDescription>{subscription.description}</CardDescription>
            </div>
          </div>
          <Badge className={statusColors[subscription.status]}>
            {subscription.status.charAt(0) + subscription.status.slice(1).toLowerCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-muted-foreground">Price:</div>
          <div className="font-medium">${subscription.price.toFixed(2)}/{subscription.billingCycle.toLowerCase() === 'monthly' ? 'mo' : 'yr'}</div>
          
          <div className="text-muted-foreground">Billing:</div>
          <div className="font-medium">{formatBillingCycle(subscription.billingCycle)}</div>
          
          <div className="text-muted-foreground">Next Payment:</div>
          <div className="font-medium">{formatDate(subscription.nextBillingDate)}</div>
          
          <div className="text-muted-foreground">Category:</div>
          <div className="font-medium">{subscription.category}</div>
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