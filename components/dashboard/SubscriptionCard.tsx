// components/dashboard/SubscriptionCard.tsx
import Link from 'next/link';
import { format } from 'date-fns';
import { BadgeCheck, CalendarDays, Clock } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Define the Subscription type if not already defined elsewhere
interface Subscription {
  id: string;
  name: string;
  description: string | null;
  price: number | any; // Handle Decimal type from Prisma
  currency: string;
  billingCycle: string;
  startDate: Date;
  nextBillingDate: Date | null; // Updated to allow null for lifetime purchases
  category: string | null;
  logo: string | null;
  website: string | null;
  status: "ACTIVE" | "CANCELED" | "PAUSED" | "TRIAL";
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function SubscriptionCard({ subscription }: { subscription: Subscription }) {
  const statusColors: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-800',
    CANCELED: 'bg-red-100 text-red-800',
    PAUSED: 'bg-yellow-100 text-yellow-800',
    TRIAL: 'bg-blue-100 text-blue-800'
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
      case "LIFETIME":
        return "One-time purchase";
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
              <div className="text-sm text-muted-foreground">{subscription.category || "Uncategorized"}</div>
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
            {subscription.billingCycle !== "LIFETIME" && (
              <span className="text-xs text-muted-foreground ml-1">
                /{getBillingCycleText(subscription.billingCycle).toLowerCase()}
              </span>
            )}
          </div>
          
          <div className="text-muted-foreground">Type:</div>
          <div className="font-medium">{getBillingCycleText(subscription.billingCycle)}</div>
          
          {subscription.billingCycle === "LIFETIME" ? (
            <>
              <div className="text-muted-foreground">Purchase Date:</div>
              <div className="font-medium flex items-center">
                <CalendarDays className="mr-1 h-3 w-3 text-muted-foreground" />
                {format(new Date(subscription.startDate), "MMM d, yyyy")}
              </div>
              <div className="col-span-2 mt-1">
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  <BadgeCheck className="mr-1 h-3 w-3" /> Lifetime purchase
                </Badge>
              </div>
            </>
          ) : (
            <>
              <div className="text-muted-foreground">Next Payment:</div>
              <div className="font-medium flex items-center">
                <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
                {subscription.nextBillingDate ? 
                  format(new Date(subscription.nextBillingDate), "MMM d, yyyy") : 
                  "N/A"}
              </div>
            </>
          )}
          
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