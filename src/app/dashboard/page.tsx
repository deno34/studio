
'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, KeyRound, Bot, FileText, CreditCard } from 'lucide-react';

function DashboardSkeleton() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <div className="container max-w-7xl py-12 px-4">
          <Skeleton className="h-8 w-1/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          <div className="grid md:grid-cols-[240px_1fr] gap-8">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-32" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: <LayoutDashboard /> },
    { href: '#', label: 'My APIs', icon: <KeyRound /> },
    { href: '#', label: 'My Agents', icon: <Bot /> },
    { href: '#', label: 'Docs', icon: <FileText /> },
    { href: '#', label: 'Billing', icon: <CreditCard /> },
  ];

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <div className="container max-w-7xl py-12 px-4">
          <div className="grid md:grid-cols-[240px_1fr] gap-8 items-start">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  variant={router.pathname === item.href ? 'secondary' : 'ghost'}
                  className="justify-start"
                  asChild
                >
                  <Link href={item.href}>
                    {item.icon}
                    {item.label}
                  </Link>
                </Button>
              ))}
            </nav>
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back to Nerida AI.</p>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>User Profile</CardTitle>
                  <CardDescription>This is your profile information.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName || user.email || ''} />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-lg font-semibold">{user.displayName || 'No display name'}</h2>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
