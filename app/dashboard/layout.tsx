// app/dashboard/layout.tsx
import Link from 'next/link';
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-card">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary">SubsTrack</h1>
        </div>
        <nav className="flex-1 px-4 py-2">
          <ul className="space-y-1">
            <NavItem href="/dashboard" current>Dashboard</NavItem>
            <NavItem href="/dashboard/subscriptions">Subscriptions</NavItem>
            <NavItem href="/dashboard/payments">Payments</NavItem>
            <NavItem href="/dashboard/reports">Reports</NavItem>
            <NavItem href="/dashboard/settings">Settings</NavItem>
          </ul>
        </nav>
        <div className="p-4 border-t">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link href="/api/auth/signout">Sign out</Link>
          </Button>
        </div>
      </aside>
      
      {/* Mobile Navigation (visible on small screens) */}
      <div className="md:hidden flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-bold text-primary">SubsTrack</h1>
        {/* You would add a mobile menu button here */}
      </div>
      
      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}

function NavItem({ 
  href, 
  children, 
  current = false 
}: { 
  href: string; 
  children: ReactNode; 
  current?: boolean;
}) {
  return (
    <li>
      <Link 
        href={href}
        className={`flex items-center px-4 py-2 rounded-md text-sm font-medium ${
          current 
            ? 'bg-primary/10 text-primary' 
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        }`}
      >
        {children}
      </Link>
    </li>
  );
}