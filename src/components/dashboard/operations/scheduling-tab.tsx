
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export function SchedulingTab() {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Meeting & Task Scheduling</CardTitle>
        <CardDescription>Manage your schedule, tasks, and meetings in one place.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
            <Calendar className="w-16 h-16 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Scheduling features are coming soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
