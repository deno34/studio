
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BarChart2 } from "lucide-react";

export function ReportsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Reports</CardTitle>
        <CardDescription>Generate AI-powered financial reports from your accounting data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
            <Button size="lg" variant="outline" className="h-auto py-4">
                <div className="flex flex-col items-center gap-2">
                    <FileText className="w-8 h-8" />
                    <span className="font-semibold">Generate Profit & Loss</span>
                    <span className="text-xs text-muted-foreground">For a selected period</span>
                </div>
            </Button>
            <Button size="lg" variant="outline" className="h-auto py-4">
                 <div className="flex flex-col items-center gap-2">
                    <BarChart2 className="w-8 h-8" />
                    <span className="font-semibold">Generate Balance Sheet</span>
                    <span className="text-xs text-muted-foreground">As of a specific date</span>
                </div>
            </Button>
        </div>
         <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-semibold">Generated Report Preview</h4>
            <p className="text-sm text-muted-foreground mt-2">Your generated report will appear here. For example, Mistral can provide a natural language summary followed by a structured P&L table.</p>
        </div>
      </CardContent>
    </Card>
  );
}
