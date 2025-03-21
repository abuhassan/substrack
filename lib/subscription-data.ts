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
  {
    id: "spotify",
    name: "Spotify",
    description: "Music streaming service",
    price: 14.90,
    currency: "MYR",
    billingCycle: "MONTHLY",
    category: "Entertainment",
    website: "https://spotify.com"
  },
  {
    id: "disney-plus",
    name: "Disney+",
    description: "Streaming service for Disney content",
    price: 28.90,
    currency: "MYR",
    billingCycle: "MONTHLY",
    category: "Entertainment",
    website: "https://disneyplus.com"
  },
  {
    id: "prime-video",
    name: "Amazon Prime Video",
    description: "Video streaming service by Amazon",
    price: 14.90,
    currency: "MYR",
    billingCycle: "MONTHLY",
    category: "Entertainment",
    website: "https://primevideo.com"
  },
  {
    id: "youtube-premium",
    name: "YouTube Premium",
    description: "Ad-free YouTube with background play",
    price: 23.90,
    currency: "MYR",
    billingCycle: "MONTHLY",
    category: "Entertainment",
    website: "https://youtube.com/premium"
  },
  
  // Productivity
  {
    id: "microsoft365",
    name: "Microsoft 365",
    description: "Office applications and cloud services",
    price: 42.00,
    currency: "MYR",
    billingCycle: "MONTHLY",
    category: "Productivity",
    website: "https://microsoft.com/microsoft-365"
  },
  {
    id: "adobe-cc",
    name: "Adobe Creative Cloud",
    description: "Suite of Adobe creative applications",
    price: 228.00,
    currency: "MYR",
    billingCycle: "MONTHLY",
    category: "Productivity",
    website: "https://adobe.com/creativecloud"
  },
  {
    id: "notion",
    name: "Notion",
    description: "All-in-one workspace for notes and tasks",
    price: 36.00,
    currency: "MYR",
    billingCycle: "MONTHLY",
    category: "Productivity",
    website: "https://notion.so"
  },
  
  // Utilities
  {
    id: "icloud",
    name: "iCloud+",
    description: "Cloud storage for Apple devices",
    price: 10.90,
    currency: "MYR",
    billingCycle: "MONTHLY",
    category: "Utilities",
    website: "https://apple.com/icloud"
  },
  {
    id: "google-one",
    name: "Google One",
    description: "Cloud storage for Google services",
    price: 9.90,
    currency: "MYR",
    billingCycle: "MONTHLY",
    category: "Utilities",
    website: "https://one.google.com"
  },
  
  // Shopping
  {
    id: "amazon-prime",
    name: "Amazon Prime",
    description: "Fast shipping and other Amazon benefits",
    price: 14.90,
    currency: "MYR",
    billingCycle: "MONTHLY",
    category: "Shopping",
    website: "https://amazon.com/prime"
  },
  {
    id: "shopee-premium",
    name: "Shopee Premium",
    description: "Shopee membership with free shipping",
    price: 14.90,
    currency: "MYR",
    billingCycle: "MONTHLY",
    category: "Shopping",
    website: "https://shopee.com.my"
  },
  
  // Fitness
  {
    id: "fitbit-premium",
    name: "Fitbit Premium",
    description: "Advanced health insights and programs",
    price: 39.00,
    currency: "MYR",
    billingCycle: "MONTHLY",
    category: "Fitness",
    website: "https://fitbit.com/premium"
  },
  
  // Gaming
  {
    id: "xbox-game-pass",
    name: "Xbox Game Pass",
    description: "Subscription service for Xbox games",
    price: 39.00,
    currency: "MYR",
    billingCycle: "MONTHLY",
    category: "Gaming",
    website: "https://xbox.com/gamepass"
  },
  {
    id: "ps-plus",
    name: "PlayStation Plus",
    description: "Subscription service for PlayStation games",
    price: 29.00,
    currency: "MYR",
    billingCycle: "MONTHLY",
    category: "Gaming",
    website: "https://playstation.com/plus"
  }
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

// Available billing cycles
export const billingCycles: BillingCycleOption[] = [
  { value: "MONTHLY", label: "Monthly" },
  { value: "QUARTERLY", label: "Every 3 months" },
  { value: "BIANNUAL", label: "Every 6 months" },
  { value: "ANNUAL", label: "Yearly" },
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