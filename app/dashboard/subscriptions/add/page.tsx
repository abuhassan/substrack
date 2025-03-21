// app/dashboard/subscriptions/add/page.tsx
import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SubscriptionAddForm from "@/components/dashboard/SubscriptionAddForm";
import SubscriptionSuggestions from "@/components/dashboard/SubscriptionSuggestions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AddSubscriptionPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Add New Subscription</h1>
      
      <Tabs defaultValue="suggestions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="suggestions">Popular Subscriptions</TabsTrigger>
          <TabsTrigger value="custom">Custom Subscription</TabsTrigger>
        </TabsList>
        
        <TabsContent value="suggestions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Choose from Popular Subscriptions</CardTitle>
              <CardDescription>
                Select a subscription service to quickly fill in details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading suggestions...</div>}>
                <SubscriptionSuggestions />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="custom" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Add Custom Subscription</CardTitle>
              <CardDescription>
                Enter the details of your subscription manually
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubscriptionAddForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}