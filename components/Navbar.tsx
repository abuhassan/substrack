// components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, User } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  
  // Check if we're on the home page
  const isHomePage = pathname === "/";

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            SubsTrack
          </Link>
          
          {/* Navigation links - only show some links when authenticated */}
          <nav className="ml-10 hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className={`text-sm font-medium ${isHomePage ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
            >
              Home
            </Link>
            <Link 
              href="/features" 
              className="text-sm font-medium text-gray-600 hover:text-indigo-600"
            >
              Features
            </Link>
            <Link 
              href="/pricing" 
              className="text-sm font-medium text-gray-600 hover:text-indigo-600"
            >
              Pricing
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  href="/dashboard" 
                  className="text-sm font-medium text-gray-600 hover:text-indigo-600"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/dashboard/subscriptions" 
                  className="text-sm font-medium text-gray-600 hover:text-indigo-600"
                >
                  My Subscriptions
                </Link>
              </>
            )}
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Button asChild variant="outline" className="hidden md:inline-flex">
                <Link href="/dashboard/subscriptions/add">
                  Add Subscription
                </Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {session?.user?.name && (
                        <p className="font-medium">{session.user.name}</p>
                      )}
                      {session?.user?.email && (
                        <p className="w-[200px] truncate text-sm text-gray-600">
                          {session.user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/subscriptions">My Subscriptions</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(event) => {
                      event.preventDefault();
                      signOut({ callbackUrl: "/" });
                    }}
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden md:inline-flex">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild className="hidden md:inline-flex">
                <Link href="/auth/register">Register</Link>
              </Button>
            </>
          )}
          
          {/* Mobile menu button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/features">Features</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/pricing">Pricing</Link>
              </DropdownMenuItem>
              
              {isAuthenticated ? (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/subscriptions">My Subscriptions</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/subscriptions/add">Add Subscription</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(event) => {
                      event.preventDefault();
                      signOut({ callbackUrl: "/" });
                    }}
                  >
                    Sign out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/auth/login">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/register">Register</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}