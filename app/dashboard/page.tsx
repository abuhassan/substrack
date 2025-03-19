// app/dashboard/page.tsx
import Link from 'next/link';
import { Suspense } from 'react';

// Import shadcn/ui components
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar } from '@/components/ui/avatar';

// This component will be the main dashboard page
export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      {/* Stats Cards Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<StatCardSkeleton />}>
          <StatsCard 
            title="Active Subscriptions" 
            value="8" 
            description="Across all categories" 
            trend="up"
          />
        </Suspense>
        <Suspense fallback={<StatCardSkeleton />}>
          <StatsCard 
            title="Monthly Spend" 
            value="$49.94" 
            description="$3.22 less than last month" 
            trend="down"
          />
        </Suspense>
        <Suspense fallback={<StatCardSkeleton />}>
          <StatsCard 
            title="Annual Spend" 
            value="$599.28" 
            description="Projected from current subscriptions" 
            trend="neutral"
          />
        </Suspense>
        <Suspense fallback={<StatCardSkeleton />}>
          <StatsCard 
            title="Next Payment" 
            value="Netflix" 
            description="March 22, 2025" 
            trend="neutral"
          />
        </Suspense>
      </div>
      
      {/* Main Content Area */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Upcoming Payments */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Upcoming Payments</CardTitle>
            <CardDescription>Your next subscription renewals</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<UpcomingPaymentsSkeleton />}>
              <UpcomingPaymentsList />
            </Suspense>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="ml-auto">
              <Link href="/dashboard/payments">View all payments</Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Spend by Category */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Spend by Category</CardTitle>
            <CardDescription>Your monthly subscription distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<CategoryChartSkeleton />}>
              <CategoryChart />
            </Suspense>
          </CardContent>
        </Card>
      </div>
      
      {/* Recently Added Subscriptions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recently Added</CardTitle>
            <CardDescription>Your newest subscriptions</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/subscriptions">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<RecentSubscriptionsSkeleton />}>
            <RecentSubscriptions />
          </Suspense>
        </CardContent>
      </Card>
      
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks you might want to perform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href="/dashboard/subscriptions/add">Add Subscription</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/reports">View Reports</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Component for individual stat cards
function StatsCard({ 
  title, 
  value, 
  description, 
  trend 
}: { 
  title: string; 
  value: string; 
  description: string;
  trend: 'up' | 'down' | 'neutral'
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {trend === 'up' && <span className="text-green-600">↑</span>}
        {trend === 'down' && <span className="text-red-600">↓</span>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

// Upcoming payments list
function UpcomingPaymentsList() {
  // This would fetch from your database in a real implementation
  const upcomingPayments = [
    { id: 1, name: 'Netflix', amount: '$15.99', date: 'March 22, 2025', logo: 'N' },
    { id: 2, name: 'Spotify', amount: '$9.99', date: 'March 25, 2025', logo: 'S' },
    { id: 3, name: 'Adobe Creative Cloud', amount: '$52.99', date: 'April 1, 2025', logo: 'A' },
    { id: 4, name: 'New York Times', amount: '$4.99', date: 'April 3, 2025', logo: 'NYT' },
  ];
  
  return (
    <div className="space-y-4">
      {upcomingPayments.map(payment => (
        <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            <Avatar>
              <div className="flex h-full w-full items-center justify-center bg-muted">
                {payment.logo}
              </div>
            </Avatar>
            <div>
              <p className="font-medium">{payment.name}</p>
              <p className="text-sm text-muted-foreground">{payment.date}</p>
            </div>
          </div>
          <div className="font-bold">{payment.amount}</div>
        </div>
      ))}
    </div>
  );
}

// Category chart using shadcn/ui Progress component
function CategoryChart() {
  // This would be dynamic data in a real implementation
  const categories = [
    { name: 'Entertainment', percentage: 45, amount: '$22.47' },
    { name: 'Productivity', percentage: 30, amount: '$14.98' },
    { name: 'News', percentage: 15, amount: '$7.49' },
    { name: 'Other', percentage: 10, amount: '$5.00' },
  ];
  
  return (
    <div className="space-y-4">
      {categories.map(category => (
        <div key={category.name} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{category.name}</span>
            <span className="text-muted-foreground">{category.amount}</span>
          </div>
          <Progress value={category.percentage} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">{category.percentage}%</p>
        </div>
      ))}
    </div>
  );
}

// Recent subscriptions list
function RecentSubscriptions() {
  // This would fetch from your database in a real implementation
  const recentSubscriptions = [
    { id: 1, name: 'Notion Pro', amount: '$8/month', date: 'Added March 15, 2025', logo: 'N' },
    { id: 2, name: 'Disney+', amount: '$7.99/month', date: 'Added March 10, 2025', logo: 'D+' },
  ];
  
  return (
    <div className="space-y-4">
      {recentSubscriptions.map(subscription => (
        <div key={subscription.id} className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            <Avatar>
              <div className="flex h-full w-full items-center justify-center bg-muted">
                {subscription.logo}
              </div>
            </Avatar>
            <div>
              <p className="font-medium">{subscription.name}</p>
              <p className="text-sm text-muted-foreground">{subscription.date}</p>
            </div>
          </div>
          <div className="font-medium text-muted-foreground">{subscription.amount}</div>
        </div>
      ))}
      {recentSubscriptions.length === 0 && (
        <p className="text-muted-foreground text-center py-4">No recent subscriptions</p>
      )}
    </div>
  );
}

// Skeleton loaders for Suspense fallbacks
function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
      </CardHeader>
      <CardContent>
        <div className="h-6 w-16 bg-muted rounded animate-pulse mb-2"></div>
        <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
      </CardContent>
    </Card>
  );
}

function UpcomingPaymentsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
              <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
          <div className="h-6 w-16 bg-muted rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  );
}

function CategoryChartSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="space-y-2">
          <div className="flex justify-between">
            <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-12 bg-muted rounded animate-pulse"></div>
          </div>
          <div className="h-2 w-full bg-muted rounded animate-pulse"></div>
          <div className="h-3 w-8 bg-muted rounded animate-pulse ml-auto"></div>
        </div>
      ))}
    </div>
  );
}

function RecentSubscriptionsSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2].map(i => (
        <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
              <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
          <div className="h-6 w-16 bg-muted rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  );
}