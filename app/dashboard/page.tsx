// app/dashboard/page.tsx
import { Suspense } from "react";
import Link from "next/link";
import { format, addMonths, isBefore } from "date-fns";
import { CalendarIcon, PlusCircle, CreditCard, DollarSign, LineChart, Calendar, ArrowRightIcon } from "lucide-react";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Skeleton loader for async content
function DashboardSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-4 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent className="pt-0">
            {[1, 2, 3].map((i) => (
              <div key={i} className="mb-3">
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Skeleton className="h-9 w-full max-w-[120px]" />
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent className="pt-0">
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper Functions
// Replace the formatCurrency function in your files
// (dashboard, subscription list, subscription detail)

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

// Main Dashboard Component
async function DashboardContent() {
  const session = await auth();
  
  if (!session || !session.user) {
    return (
      <div className="flex items-center justify-center h-96">
        <p>You must be signed in to view this page.</p>
      </div>
    );
  }
  
  // Fetch user's subscriptions
  const subscriptions = await prisma.subscription.findMany({
    where: {
      userId: session.user.id,
      status: "ACTIVE", // Only active subscriptions
    },
    orderBy: {
      nextBillingDate: "asc",
    },
  });
  
  // Calculate metrics
  const totalSubscriptions = subscriptions.length;
  
  const monthlyTotal = subscriptions.reduce((total, sub) => {
    let monthlyPrice = Number(sub.price);
    
    // Convert to monthly price based on billing cycle
    switch (sub.billingCycle) {
      case "QUARTERLY":
        monthlyPrice = monthlyPrice / 3;
        break;
      case "BIANNUAL":
        monthlyPrice = monthlyPrice / 6;
        break;
      case "ANNUAL":
        monthlyPrice = monthlyPrice / 12;
        break;
    }
    
    return total + monthlyPrice;
  }, 0);
  
  const yearlyTotal = monthlyTotal * 12;
  
  // Get upcoming payments (next 30 days)
  const today = new Date();
  const nextMonth = addMonths(today, 1);
  
  const upcomingPayments = subscriptions
    .filter((sub) => 
      isBefore(new Date(sub.nextBillingDate), nextMonth)
    )
    .sort((a, b) => 
      new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime()
    );
  
  // Get spending by category
  const categories: Record<string, number> = {};
  
  subscriptions.forEach((sub) => {
    const category = sub.category || "Other";
    
    if (!categories[category]) {
      categories[category] = 0;
    }
    
    let monthlyPrice = Number(sub.price);
    
    // Convert to monthly price based on billing cycle
    switch (sub.billingCycle) {
      case "QUARTERLY":
        monthlyPrice = monthlyPrice / 3;
        break;
      case "BIANNUAL":
        monthlyPrice = monthlyPrice / 6;
        break;
      case "ANNUAL":
        monthlyPrice = monthlyPrice / 12;
        break;
    }
    
    categories[category] += monthlyPrice;
  });
  
  // Convert categories to array for display
  const categoryBreakdown = Object.entries(categories)
    .map(([name, amount]) => ({
      name,
      amount,
      percentage: (amount / monthlyTotal) * 100,
    }))
    .sort((a, b) => b.amount - a.amount);
    
  return (
    <div className="space-y-8">
      {/* Welcome Message */}
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, {session.user.name || "User"}
        </h1>
        <p className="text-gray-500">
          Here's an overview of your subscription expenses
        </p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-gray-500" />
              <CardTitle className="text-sm font-medium text-gray-500">
                Active Subscriptions
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSubscriptions}</div>
            <p className="text-sm text-gray-500">
              {totalSubscriptions === 0 
                ? "No active subscriptions" 
                : totalSubscriptions === 1 
                ? "1 subscription" 
                : `${totalSubscriptions} subscriptions`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <CardTitle className="text-sm font-medium text-gray-500">
                Monthly Spend
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(monthlyTotal)}
            </div>
            <p className="text-sm text-gray-500">
              {formatCurrency(yearlyTotal)} per year
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <CardTitle className="text-sm font-medium text-gray-500">
                Next Payment
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingPayments.length > 0 ? (
              <>
                <div className="text-2xl font-bold">
                  {formatCurrency(Number(upcomingPayments[0].price), upcomingPayments[0].currency)}
                </div>
                <p className="text-sm text-gray-500">
                  {upcomingPayments[0].name} on {format(new Date(upcomingPayments[0].nextBillingDate), "MMM d, yyyy")}
                </p>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">$0.00</div>
                <p className="text-sm text-gray-500">No upcoming payments</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Upcoming Payments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Payments</CardTitle>
            <CardDescription>
              Your next 30 days of subscription charges
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {upcomingPayments.length > 0 ? (
              <div className="space-y-4">
                {upcomingPayments.map((subscription) => (
                  <div 
                    key={subscription.id}
                    className="flex items-center justify-between p-3 border border-gray-100 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <CreditCard className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">{subscription.name}</h4>
                        <p className="text-sm text-gray-500">
                          {getBillingCycleText(subscription.billingCycle)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatCurrency(Number(subscription.price), subscription.currency)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(subscription.nextBillingDate), "MMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="text-gray-400 mb-3">
                  <CalendarIcon className="h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium">No upcoming payments</h3>
                <p className="text-sm text-gray-500 text-center max-w-sm">
                  You don't have any payments coming up in the next 30 days.
                </p>
              </div>
            )}
          </CardContent>
          {subscriptions.length > 0 && (
            <CardFooter>
              <Button variant="outline" size="sm" asChild className="w-full">
                <Link href="/dashboard/subscriptions">
                  View All Subscriptions
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardFooter>
          )}
        </Card>
        
        {/* Spending by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>
              Monthly breakdown of your subscription costs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {categoryBreakdown.length > 0 ? (
              <div className="space-y-4">
                {categoryBreakdown.map((category) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Badge 
                          variant="outline" 
                          className="mr-2 bg-gray-50"
                        >
                          {category.name}
                        </Badge>
                        <span className="text-sm font-medium">
                          {formatCurrency(category.amount)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {category.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div 
                        className="bg-indigo-600 h-2.5 rounded-full" 
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="text-gray-400 mb-3">
                  <LineChart className="h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium">No data available</h3>
                <p className="text-sm text-gray-500 text-center max-w-sm">
                  Add some subscriptions to see your spending breakdown.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Add Subscription CTA */}
      {subscriptions.length === 0 && (
        <Card className="bg-gray-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="text-gray-400 mb-3">
                <PlusCircle className="h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium mb-1">
                Start tracking your subscriptions
              </h3>
              <p className="text-sm text-gray-500 mb-4 max-w-md">
                Add your first subscription to start monitoring your expenses and get insights on your spending habits.
              </p>
              <Button asChild>
                <Link href="/dashboard/subscriptions/add">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Your First Subscription
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Page Component with Suspense
export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}