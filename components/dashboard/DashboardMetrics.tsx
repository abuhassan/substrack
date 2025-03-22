'use client';

import { useMemo } from 'react';
import { CreditCard, BarChart3, TrendingUp, Gift } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface Subscription {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingCycle: string;
  nextBillingDate: Date | null;
  status: string;
  category: string | null;
}

interface DashboardMetricsProps {
  subscriptions: Subscription[];
}

export default function DashboardMetrics({ subscriptions }: DashboardMetricsProps) {
  // Filter active subscriptions
  const activeSubscriptions = useMemo(() => {
    return subscriptions.filter(sub => sub.status === 'ACTIVE');
  }, [subscriptions]);

  // Separate recurring subscriptions and lifetime purchases
  const recurringSubscriptions = useMemo(() => {
    return activeSubscriptions.filter(sub => sub.billingCycle !== 'LIFETIME');
  }, [activeSubscriptions]);

  const lifetimePurchases = useMemo(() => {
    return activeSubscriptions.filter(sub => sub.billingCycle === 'LIFETIME');
  }, [activeSubscriptions]);

  // Calculate monthly cost
  const monthlyCost = useMemo(() => {
    return recurringSubscriptions.reduce((total, sub) => {
      const price = Number(sub.price);
      
      // Convert different billing cycles to monthly equivalent
      switch (sub.billingCycle) {
        case 'MONTHLY':
          return total + price;
        case 'QUARTERLY':
          return total + (price / 3);
        case 'BIANNUAL':
          return total + (price / 6);
        case 'ANNUAL':
          return total + (price / 12);
        default:
          return total;
      }
    }, 0);
  }, [recurringSubscriptions]);

  // Calculate lifetime purchases total
  const lifetimeTotal = useMemo(() => {
    return lifetimePurchases.reduce((total, sub) => {
      return total + Number(sub.price);
    }, 0);
  }, [lifetimePurchases]);

  // Calculate annual cost
  const annualCost = monthlyCost * 12;

  // Calculate upcoming payments (next 30 days)
  const upcomingPayments = useMemo(() => {
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);
    
    return recurringSubscriptions.filter(sub => {
      if (!sub.nextBillingDate) return false;
      
      const nextBillingDate = new Date(sub.nextBillingDate);
      return nextBillingDate >= today && nextBillingDate <= thirtyDaysLater;
    });
  }, [recurringSubscriptions]);

  // Calculate upcoming payments total
  const upcomingTotal = useMemo(() => {
    return upcomingPayments.reduce((total, sub) => {
      return total + Number(sub.price);
    }, 0);
  }, [upcomingPayments]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Monthly Spending Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Spending</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(monthlyCost)}
          </div>
          <p className="text-xs text-muted-foreground">
            {recurringSubscriptions.length} active subscription{recurringSubscriptions.length !== 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

      {/* Annual Spending Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Annual Spending</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(annualCost)}
          </div>
          <p className="text-xs text-muted-foreground">
            Projected yearly total
          </p>
        </CardContent>
      </Card>

      {/* Upcoming Payments Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Upcoming (30 days)</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(upcomingTotal)}
          </div>
          <p className="text-xs text-muted-foreground">
            {upcomingPayments.length} upcoming payment{upcomingPayments.length !== 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

      {/* Lifetime Purchases Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Lifetime Purchases</CardTitle>
          <Gift className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(lifetimeTotal)}
          </div>
          <p className="text-xs text-muted-foreground">
            {lifetimePurchases.length} one-time purchase{lifetimePurchases.length !== 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}