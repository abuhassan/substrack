// components/dashboard/SubscriptionSuggestions.tsx
'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  SubscriptionSuggestion, 
  subscriptionSuggestions, 
  subscriptionCategories 
} from "@/lib/subscription-data";

export default function SubscriptionSuggestions() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Filter suggestions based on search query and category
  const filteredSuggestions = subscriptionSuggestions.filter(
    (suggestion: SubscriptionSuggestion) => {
      const matchesSearch = 
        suggestion.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        suggestion.description.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesCategory = 
        selectedCategory === "all" ||
        suggestion.category === selectedCategory;
        
      return matchesSearch && matchesCategory;
    }
  );
  
  // Handle selecting a subscription suggestion
  const handleSelectSuggestion = (subscription: SubscriptionSuggestion) => {
    router.push(`/dashboard/subscriptions/add?preset=${subscription.id}`);
  };
  
  return (
    <div className="space-y-6">
      {/* Search and filter controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search input */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Category filter */}
        <div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="all-categories" value="all">All Categories</SelectItem>
              {subscriptionCategories.map((category: string) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Suggestions grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredSuggestions.length > 0 ? (
          filteredSuggestions.map((subscription: SubscriptionSuggestion, index: number) => (
            <Button
              key={subscription.id}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center justify-center gap-2 hover:border-primary/50"
              onClick={() => handleSelectSuggestion(subscription)}
            >
              <Avatar className="h-16 w-16">
                {/* Use initial for all cases instead of trying to load images */}
                <div className="flex h-full w-full items-center justify-center bg-primary/10 text-xl font-semibold text-primary">
                  {subscription.name.charAt(0)}
                </div>
              </Avatar>
              <span className="font-medium text-center">{subscription.name}</span>
              <span className="text-xs text-muted-foreground">
                {new Intl.NumberFormat("en-MY", {
                  style: "currency",
                  currency: subscription.currency || "MYR",
                }).format(subscription.price)} / {subscription.billingCycle.toLowerCase()}
              </span>
            </Button>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No matching subscriptions found</p>
            <Button 
              variant="link" 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}