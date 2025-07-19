
'use client';

import Link from 'next/link';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, FileText, DollarSign, Users, Landmark, AlertTriangle } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { InvoicesTab } from '@/components/dashboard/accounting/invoices-tab';
import { ExpensesTab } from '@/components/dashboard/accounting/expenses-tab';
import { PayrollTab } from '@/components/dashboard/accounting/payroll-tab';
import { TaxesTab } from '@/components/dashboard/accounting/taxes-tab';
import { ReportsTab } from '@/components/dashboard/accounting/reports-tab';
import { Progress } from '@/components/ui/progress';

const summaryCards = [
    { title: "Total Invoices", value: "KES 450,000", icon: <FileText className="w-6 h-6 text-muted-foreground" /> },
    { title: "Total Expenses", value: "KES 123,000", icon: <DollarSign className="w-6 h-6 text-muted-foreground" /> },
    { title: "Payroll Total", value: "KES 320,000", icon: <Users className="w-6 h-6 text-muted-foreground" /> },
    { title: "Taxes Logged", value: "14 Entries", icon: <Landmark className="w-6 h-6 text-muted-foreground" /> },
];

const budgetData = [
  { name: 'Marketing', spent: 4500, budget: 6000 },
  { name: 'Software', spent: 1800, budget: 2000 },
  { name: 'Travel', spent: 2500, budget: 4000 },
  { name: 'Utilities', spent: 800, budget: 1000 },
];

// For now, budget limits are hardcoded. In the future, this would come from a user setting in Firestore.
const budgetLimits = {
    "Transport": 5000,
    "Food & Entertainment": 3000,
    "Software": 1200,
    "Marketing": 6000,
    "Utilities": 1000,
    "Travel": 4000,
    "Other": 1000,
};

export default function AccountingAgentPage() {

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1 bg-muted/30 py-8 md:py-12">
        <div className="container max-w-7xl px-4">
            <Button variant="ghost" asChild className="mb-6">
                <Link href="/dashboard/agents">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Agents
                </Link>
            </Button>

            <div className="mb-8">
                <h1 className="text-3xl font-bold">Accounting Agent</h1>
                <p className="text-muted-foreground">
                    Your AI assistant for finance and accounting tasks.
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Summary Cards */}
                    <div className="grid gap-6 sm:grid-cols-2">
                        {summaryCards.map(card => (
                            <Card key={card.title}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                                    {card.icon}
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{card.value}</div>
                                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Tabs for Tools */}
                    <Tabs defaultValue="expenses" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
                            <TabsTrigger value="invoices">Invoices</TabsTrigger>
                            <TabsTrigger value="expenses">Expenses</TabsTrigger>
                            <TabsTrigger value="payroll">Payroll</TabsTrigger>
                            <TabsTrigger value="tax">Taxes</TabsTrigger>
                            <TabsTrigger value="reports">Reports</TabsTrigger>
                        </TabsList>
                        <TabsContent value="invoices">
                           <InvoicesTab />
                        </TabsContent>
                        <TabsContent value="expenses">
                            <ExpensesTab />
                        </TabsContent>
                        <TabsContent value="payroll">
                            <PayrollTab />
                        </TabsContent>
                         <TabsContent value="tax">
                            <TaxesTab />
                        </TabsContent>
                         <TabsContent value="reports">
                            <ReportsTab />
                        </TabsContent>
                    </Tabs>

                </div>

                {/* Sidebar Area */}
                <div className="lg:col-span-1 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Budget Overview</CardTitle>
                            <CardDescription>Monthly expenses vs. budget.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={budgetData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `KES ${value/1000}k`}/>
                                    <Tooltip
                                        cursor={{ fill: 'hsla(var(--muted))' }}
                                        contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                                    />
                                    <Bar dataKey="spent" fill="hsl(var(--primary))" name="Spent" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="budget" fill="hsla(var(--primary) / 0.2)" name="Budget" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
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

    