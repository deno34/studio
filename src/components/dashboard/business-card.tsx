
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type Business } from '@/lib/types';
import { Building, Calculator, Users, Settings, ScanText, BarChart3, Bot, ChevronRight, FileText } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';

const agentIcons = {
    accounting: <Calculator className="w-3.5 h-3.5" />,
    hr: <Users className="w-3.5 h-3.5" />,
    operations: <Settings className="w-3.5 h-3.5" />,
    document: <ScanText className="w-3.5 h-3.5" />,
    bi: <BarChart3 className="w-3.5 h-3.5" />,
    custom: <Bot className="w-3.5 h-3.5" />,
};

interface BusinessCardProps {
  business: Business;
}

export function BusinessCard({ business }: BusinessCardProps) {
  return (
    <Card className="flex flex-col hover:shadow-lg hover:border-primary/50 transition-all">
      <CardHeader className="flex-row items-start gap-4 space-y-0">
        <Avatar className="w-12 h-12 rounded-lg">
          <AvatarImage src={business.logoUrl} />
          <AvatarFallback className="rounded-lg"><Building className="w-6 h-6" /></AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-lg">{business.name}</CardTitle>
          <CardDescription>{business.industry}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <div className="text-xs text-muted-foreground flex items-center gap-2">
            <FileText className="w-3 h-3" />
            {/* This is mock data for now */}
            <span>25 Documents</span>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2">Active Agents</h4>
          <div className="flex flex-wrap gap-2">
            {business.selectedAgents.length > 0 ? (
                business.selectedAgents.map(agentId => (
                    <Badge key={agentId} variant="secondary" className="capitalize">
                        {agentIcons[agentId as keyof typeof agentIcons]}
                        <span className="ml-1.5">{agentId}</span>
                    </Badge>
                ))
            ) : (
                <p className="text-xs text-muted-foreground">No agents selected.</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" asChild>
            <Link href={`/dashboard/businesses/${business.id}`}>
                Manage Business
                <ChevronRight className="w-4 h-4 ml-auto" />
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

BusinessCard.Skeleton = function BusinessCardSkeleton() {
    return (
        <Card className="flex flex-col">
            <CardHeader className="flex-row items-start gap-4 space-y-0">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
                <Skeleton className="h-4 w-1/3" />
                <div className="space-y-2">
                    <Skeleton className="h-5 w-1/4" />
                    <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-24" />
                        <Skeleton className="h-6 w-16" />
                    </div>
                </div>
            </CardContent>
             <CardFooter>
                 <Skeleton className="h-10 w-full" />
             </CardFooter>
        </Card>
    )
}
