import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="bg-gray-50">
      {/* Hero section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Take control of your{" "}
              <span className="text-indigo-600">subscriptions</span>
            </h1>
            <p className="text-lg text-gray-600 mb-10">
              SubsTrack helps you manage all your subscriptions in one place.
              Track payment dates, monitor spending, and never miss a renewal.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-base">
                <Link href="/auth/register">Get started</Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="text-base">
                <Link href="#features">Learn more</Link>
              </Button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="bg-indigo-50 p-4 rounded-lg mb-6">
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">Your Subscriptions</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white rounded border border-gray-200">
                  <div>
                    <p className="font-medium">Netflix</p>
                    <p className="text-sm text-gray-500">Next payment: 3/19/2025</p>
                  </div>
                  <p className="font-semibold">$9.99/mo</p>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white rounded border border-gray-200">
                  <div>
                    <p className="font-medium">Spotify</p>
                    <p className="text-sm text-gray-500">Next payment: 3/24/2025</p>
                  </div>
                  <p className="font-semibold">$19.98/mo</p>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white rounded border border-gray-200">
                  <div>
                    <p className="font-medium">Adobe Creative Cloud</p>
                    <p className="text-sm text-gray-500">Next payment: 3/29/2025</p>
                  </div>
                  <p className="font-semibold">$29.97/mo</p>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-white rounded border border-gray-200">
                  <div>
                    <p className="font-medium">Notion Pro</p>
                    <p className="text-sm text-gray-500">Next payment: 4/3/2025</p>
                  </div>
                  <p className="font-semibold">$39.96/mo</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-indigo-100">
                <p className="font-semibold">Monthly Total</p>
                <p className="font-bold text-xl">$64.96</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section id="features" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything you need to manage subscriptions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Keep track of all your recurring payments in one place and stay on top of your finances.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Track All Subscriptions</h3>
              <p className="text-gray-600">
                Keep all your subscriptions organized in one place, from streaming services to software tools.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Payment Reminders</h3>
              <p className="text-gray-600">
                Never miss a payment with timely reminders before your subscriptions renew.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Spending Analytics</h3>
              <p className="text-gray-600">
                Visualize your subscription spending by category and identify opportunities to save.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to action section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to take control of your subscriptions?</h2>
          <p className="text-indigo-100 max-w-2xl mx-auto mb-8">
            Join thousands of users who are saving money and staying organized with SubsTrack.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-base">
            <Link href="/auth/register">Get started for free</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}