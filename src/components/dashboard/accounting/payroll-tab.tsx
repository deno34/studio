
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud } from "lucide-react";

export function PayrollTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payroll</CardTitle>
        <CardDescription>Manage payroll summaries and upload payslips for analysis.</CardDescription>
      </CardHeader>
      <CardContent>
         <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <div className="p-3 rounded-full bg-primary/10 mb-4 inline-block">
                <UploadCloud className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Upload Payslips</h3>
            <p className="text-muted-foreground mt-1">Drag & drop files here or click to browse.</p>
            <p className="text-xs text-muted-foreground mt-2">AI will extract salary, deductions, and generate a summary.</p>
        </div>
      </CardContent>
    </Card>
  );
}
