// app/dashboard/subscriptions/[id]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// Define the subscription status type
type SubscriptionStatus = 'ACTIVE' | 'CANCELED' | 'PAUSED' | 'TRIAL';

// Define the subscription interface
interface Subscription {
  id: number;
  name: string;
  description: string;
  price: number;
  billingCycle: string;
  startDate: string;
  nextBillingDate: string;
  category: string;
  status: SubscriptionStatus;
  website?: string;
  notes?: string;
  logo: string;
}

// In a real app, you would fetch this from your database
const getSubscription = (id: string): Subscription | undefined => {
  // Sample data - this would come from your database
  const subscriptions: Subscription[] = [
    {
      id: 1,
      name: 'Netflix',
      description: 'Standard Plan',
      price: 15.99,
      billingCycle: 'MONTHLY',
      startDate: '2023-01-15',
      nextBillingDate: '2025-03-22',
      category: 'Entertainment',
      status: 'ACTIVE',
      website: 'https://netflix.com',
      notes: 'Family account shared with parents',
      logo: 'N'
    },
    // Add other subscriptions here
  ];
  
  const subscription = subscriptions.find(sub => sub.id.toString() === id);
  return subscription;
};

export default function SubscriptionDetailPage({ params }: { params: { id: string } }) {
  const subscription = getSubscription(params.id);
  
  if (!subscription) {
    notFound();
  }
  
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
  
  // Define status colors with proper typing
  const statusColors: Record<SubscriptionStatus, string> = {
    'ACTIVE': 'bg-green-100 text-green-800',
    'CANCELED': 'bg-red-100 text-red-800',
    'PAUSED': 'bg-yellow-100 text-yellow-800',
    'TRIAL': 'bg-blue-100 text-blue-800'
  };
  
  const calculateAnnualCost = () => {
    let monthlyCost = subscription.price;
    switch (subscription.billingCycle) {
      case 'MONTHLY':
        return monthlyCost * 12;
      case 'QUARTERLY':
        return (monthlyCost / 3) * 12;
      case 'BIANNUAL':
        return (monthlyCost / 6) * 12;
      case 'ANNUAL':
        return monthlyCost;
      default:
        return monthlyCost * 12;
    }
  };
  
  return (
    <div className="flex flex-col gap-6">
      {/* Rest of the component remains the same */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{subscription.name}</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/subscriptions">Back</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/subscriptions/${params.id}/edit`}>Edit</Link>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Main Details Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <div className="flex h-full w-full items-center justify-center bg-muted text-lg">
                    {subscription.logo}
                  </div>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">{subscription.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{subscription.description}</p>
                </div>
              </div>
              <Badge className={statusColors[subscription.status]}>
                {subscription.status.charAt(0) + subscription.status.slice(1).toLowerCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Rest of the content remains the same */}
          </CardContent>
        </Card>
        
        {/* Rest of the component remains the same */}
      </div>
    </div>
  );
}