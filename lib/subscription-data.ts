// lib/subscription-data.ts

// Interface for subscription suggestions
export interface SubscriptionSuggestion {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: string;
  category: string;
  logo?: string;
  website?: string;
}

// Popular subscription services with predefined data
export const subscriptionSuggestions: SubscriptionSuggestion[] = [
  // Entertainment
  {
    id: "netflix",
    name: "Netflix",
    description: "Streaming service for movies and TV shows",
    price: 54.90,
    currency: "MYR",
    billingCycle: "MONTHLY",
    category: "Entertainment",
    website: "https://netflix.com"
  },
  // Other subscriptions...
];

// Function to get a subscription suggestion by ID
export function getSubscriptionSuggestionById(id: string): SubscriptionSuggestion | undefined {
  return subscriptionSuggestions.find(suggestion => suggestion.id === id);
}

// Define interface for billing cycle items
export interface BillingCycleOption {
  value: string;
  label: string;
}

// Available billing cycles - Added LIFETIME option
export const billingCycles: BillingCycleOption[] = [
  { value: "MONTHLY", label: "Monthly" },
  { value: "QUARTERLY", label: "Every 3 months" },
  { value: "BIANNUAL", label: "Every 6 months" },
  { value: "ANNUAL", label: "Yearly" },
  { value: "LIFETIME", label: "One-time purchase" },
  { value: "CUSTOM", label: "Custom" }
];

// Available subscription categories
export const subscriptionCategories: string[] = [
  "Entertainment",
  "Productivity",
  "Utilities",
  "Shopping",
  "Gaming",
  "Fitness",
  "Food & Drink",
  "Health",
  "News & Media",
  "Finance",
  "Education",
  "Software",  // Added Software category for lifetime purchases
  "Other"
];

// Define interface for status options
export interface StatusOption {
  value: string;
  label: string;
}

// Available subscription statuses
export const subscriptionStatuses: StatusOption[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "TRIAL", label: "Trial" },
  { value: "PAUSED", label: "Paused" },
  { value: "CANCELED", label: "Canceled" }
];