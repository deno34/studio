
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
import { LayoutDashboard, KeyRound, Bot, FileText, CreditCard, ChevronRight, BarChart3, ShieldCheck, PlusCircle, Building } from 'lucide-react';

function DashboardSkeleton() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1 bg-muted/30">
        <div className="container max-w-7xl py-12 px-4">
          <div className="grid md:grid-cols-[240px_1fr] gap-8 items-start">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-8">
               <Skeleton className="h-8 w-48 mb-2" />
               <Skeleton className="h-4 w-72 mb-8" />
              <div className="grid gap-8 sm:grid-cols-2">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
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
    { href: '/dashboard', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
    { href: '/dashboard/businesses', label: 'My Businesses', icon: <Building className="w-4 h-4 mr-2" /> },
    { href: '/dashboard/agents', label: 'My Agents', icon: <Bot className="w-4 h-4 mr-2" /> },
    { href: '#', label: 'My APIs', icon: <KeyRound className="w-4 h-4 mr-2" /> },
    { href: '#', label: 'Docs', icon: <FileText className="w-4 h-4 mr-2" /> },
    { href: '#', label: 'Billing', icon: <CreditCard className="w-4 h-4 mr-2" /> },
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
      <main className="flex-1 bg-muted/30">
        <div className="container max-w-7xl py-12 px-4">
          <div className="grid md:grid-cols-[240px_1fr] gap-8 items-start">
            <nav className="flex flex-col gap-1 sticky top-20">
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  variant={item.href === '/dashboard' ? 'secondary' : 'ghost'}
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
              <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold">Welcome, {user.displayName || user.email?.split('@')[0]}</h1>
                    <p className="text-muted-foreground">Here's a quick overview of your Nerida AI account.</p>
                  </div>
                  <Button asChild>
                    <Link href="/dashboard/add-business">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Business
                    </Link>
                  </Button>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">API Keys</CardTitle>
                        <KeyRound className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">2 Active</div>
                        <p className="text-xs text-muted-foreground">Manage your API credentials</p>
                    </CardContent>
                 </Card>
                 <Card className="hover:border-primary/50 transition-colors">
                    <Link href="/dashboard/agents">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Agents Running</CardTitle>
                            <Bot className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">1 / 5 Active</div>
                            <p className="text-xs text-muted-foreground">Manage your AI agents</p>
                        </CardContent>
                    </Link>
                 </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Usage This Month</CardTitle>
                        <BarChart3 className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1.2M</div>
                        <p className="text-xs text-muted-foreground">Tokens processed</p>
                    </CardContent>
                 </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                        <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Verified</div>
                        <p className="text-xs text-muted-foreground">Your account is secure</p>
                    </CardContent>
                 </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>User Profile</CardTitle>
                  <CardDescription>Your personal information and settings.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName || user.email || ''} />
                            <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-lg font-semibold">{user.displayName || 'No display name'}</h2>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                     <Button variant="outline" size="sm" asChild>
                        <Link href="/dashboard/profile">
                            Edit Profile
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
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
