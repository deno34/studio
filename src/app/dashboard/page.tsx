
'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, loading, signOutUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
       <div className="flex flex-col min-h-dvh bg-background text-foreground">
        <Header />
        <main className="flex-1">
           <div className="container max-w-7xl py-12 px-4">
              <Skeleton className="h-8 w-1/4 mb-4" />
              <Skeleton className="h-4 w-1/2 mb-8" />
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
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <div className="container max-w-7xl py-12 px-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back to Nerida AI.</p>
          <Card className="mt-8">
            <CardHeader>
                <CardTitle>User Profile</CardTitle>
                <CardDescription>This is your profile information.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                    <AvatarImage src={user.photoURL} alt={user.displayName || user.email} />
                    <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-lg font-semibold">{user.displayName || 'No display name'}</h2>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
