// app/dashboard/subscriptions/[id]/page.tsx
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format, addMonths } from "date-fns";
import { Calendar, CreditCard, ExternalLink, Edit, MoreHorizontal, AlertTriangle } from "lucide-react";
import { auth } from "@/auth";
import prisma from "@/lib/db";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Skeleton loader for async content
function SubscriptionDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper Functions
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

const getStatusColor = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-100 text-green-800";
    case "CANCELED":
      return "bg-gray-100 text-gray-800";
    case "PAUSED":
      return "bg-yellow-100 text-yellow-800";
    case "TRIAL":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

// Get next few billing dates based on the cycle and start date
const getNextBillingDates = (startDate: Date, billingCycle: string, count: number = 3) => {
  const dates = [];
  let currentDate = new Date(startDate);
  
  for (let i = 0; i < count; i++) {
    const nextDate = new Date(currentDate);
    
    switch (billingCycle) {
      case "MONTHLY":
        nextDate.setMonth(nextDate.getMonth() + (i + 1));
        break;
      case "QUARTERLY":
        nextDate.setMonth(nextDate.getMonth() + (i + 1) * 3);
        break;
      case "BIANNUAL":
        nextDate.setMonth(nextDate.getMonth() + (i + 1) * 6);
        break;
      case "ANNUAL":
        nextDate.setFullYear(nextDate.getFullYear() + (i + 1));
        break;
      case "CUSTOM":
        // For custom, just add a month as an example
        nextDate.setMonth(nextDate.getMonth() + (i + 1));
        break;
    }
    
    dates.push(nextDate);
  }
  
  return dates;
};

// Calculate yearly cost
const calculateYearlyCost = (price: number, billingCycle: string) => {
  switch (billingCycle) {
    case "MONTHLY":
      return price * 12;
    case "QUARTERLY":
      return price * 4;
    case "BIANNUAL":
      return price * 2;
    case "ANNUAL":
      return price;
    default:
      return price * 12; // Default to monthly
  }
};

// Main Subscription Detail Component
async function SubscriptionDetailContent({ id }: { id: string }) {
  const session = await auth();
  
  if (!session || !session.user) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>You must be signed in to view this page.</p>
      </div>
    );
  }
  
  // Fetch subscription
  const subscription = await prisma.subscription.findUnique({
    where: {
      id,
      userId: session.user.id,
    },
  });
  
  if (!subscription) {
    notFound();
  }
  
  // Calculate next billing dates
  const nextBillingDates = getNextBillingDates(
    new Date(subscription.startDate),
    subscription.billingCycle,
    3
  );
  
  // Calculate costs
  const monthlyCost = 
    subscription.billingCycle === "MONTHLY" ? Number(subscription.price) :
    subscription.billingCycle === "QUARTERLY" ? Number(subscription.price) / 3 :
    subscription.billingCycle === "BIANNUAL" ? Number(subscription.price) / 6 :
    subscription.billingCycle === "ANNUAL" ? Number(subscription.price) / 12 :
    Number(subscription.price); // Default to the actual price
  
  const yearlyCost = calculateYearlyCost(Number(subscription.price), subscription.billingCycle);
  
  return (
    <div className="space-y-6">
      {/* Header with title and actions */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{subscription.name}</h1>
            <Badge 
              variant="outline" 
              className={getStatusColor(subscription.status)}
            >
              {subscription.status}
            </Badge>
          </div>
          <p className="text-gray-500">
            {subscription.category || "Uncategorized"} • {getBillingCycleText(subscription.billingCycle)}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/subscriptions/${id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          
          <SubscriptionActions id={id} status={subscription.status} />
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Cost per Billing Cycle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(Number(subscription.price), subscription.currency)}
            </div>
            <p className="text-sm text-gray-500">
              {getBillingCycleText(subscription.billingCycle)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Monthly Cost
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(monthlyCost, subscription.currency)}
            </div>
            <p className="text-sm text-gray-500">
              {formatCurrency(yearlyCost, subscription.currency)} per year
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Next Payment Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {format(new Date(subscription.nextBillingDate), "MMM d, yyyy")}
            </div>
            <p className="text-sm text-gray-500">
              {subscription.billingCycle === "MONTHLY" ? "Every month" : 
               subscription.billingCycle === "QUARTERLY" ? "Every 3 months" :
               subscription.billingCycle === "BIANNUAL" ? "Every 6 months" :
               subscription.billingCycle === "ANNUAL" ? "Every year" : 
               "Custom schedule"}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Description */}
          {subscription.description && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
              <p className="text-gray-700">{subscription.description}</p>
            </div>
          )}
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* Payment Schedule */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Schedule</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">Next Payment</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(subscription.nextBillingDate), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="font-semibold">
                    {formatCurrency(Number(subscription.price), subscription.currency)}
                  </div>
                </div>
                
                {nextBillingDates.slice(1).map((date, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-300" />
                      <div>
                        <p className="font-medium text-gray-600">
                          {index === 0 ? "Following Payment" : `Payment ${index + 2}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(date, "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>
                    <div className="font-semibold text-gray-600">
                      {formatCurrency(Number(subscription.price), subscription.currency)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Additional Info */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Additional Information</h3>
              <dl className="divide-y divide-gray-100">
                <div className="grid grid-cols-2 gap-1 py-3">
                  <dt className="font-medium text-gray-500">Start Date</dt>
                  <dd className="text-gray-700">
                    {format(new Date(subscription.startDate), "MMM d, yyyy")}
                  </dd>
                </div>
                
                <div className="grid grid-cols-2 gap-1 py-3">
                  <dt className="font-medium text-gray-500">Billing Cycle</dt>
                  <dd className="text-gray-700">
                    {getBillingCycleText(subscription.billingCycle)}
                  </dd>
                </div>
                
                <div className="grid grid-cols-2 gap-1 py-3">
                  <dt className="font-medium text-gray-500">Category</dt>
                  <dd className="text-gray-700">
                    {subscription.category || "Uncategorized"}
                  </dd>
                </div>
                
                {subscription.website && (
                  <div className="grid grid-cols-2 gap-1 py-3">
                    <dt className="font-medium text-gray-500">Website</dt>
                    <dd className="text-gray-700">
                      <a 
                        href={subscription.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-indigo-600 hover:text-indigo-500"
                      >
                        Visit Site
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </dd>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-1 py-3">
                  <dt className="font-medium text-gray-500">Added on</dt>
                  <dd className="text-gray-700">
                    {format(new Date(subscription.createdAt), "MMM d, yyyy")}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Back Link */}
      <div className="flex justify-start">
        <Button variant="ghost" asChild>
          <Link href="/dashboard/subscriptions">
            ← Back to Subscriptions
          </Link>
        </Button>
      </div>
    </div>
  );
}

// Subscription Actions Component
function SubscriptionActions({ 
  id, 
  status 
}: { 
  id: string; 
  status: string;
}) {
  const isActive = status === "ACTIVE";
  const isPaused = status === "PAUSED";
  const isCanceled = status === "CANCELED";
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <MoreHorizontal className="h-4 w-4 mr-2" />
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Manage Subscription</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {isActive && (
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/subscriptions/${id}/edit?action=pause`}>
              Pause Subscription
            </Link>
          </DropdownMenuItem>
        )}
        
        {isPaused && (
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/subscriptions/${id}/edit?action=resume`}>
              Resume Subscription
            </Link>
          </DropdownMenuItem>
        )}
        
        {!isCanceled && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Cancel Subscription
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will mark the subscription as canceled. You can always reactivate it later.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Link href={`/dashboard/subscriptions/${id}/edit?action=cancel`}>
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Yes, Cancel It
                  </Link>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        
        <DropdownMenuSeparator />
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem 
              onSelect={(e) => e.preventDefault()}
              className="text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the subscription and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Link 
                  href={`/api/subscriptions/${id}?_method=DELETE`}
                  className="bg-red-600 text-white hover:bg-red-700 inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Yes, Delete It
                </Link>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Page Component with Suspense
export default function SubscriptionDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<SubscriptionDetailSkeleton />}>
        <SubscriptionDetailContent id={params.id} />
      </Suspense>
    </div>
  );
}