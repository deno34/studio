
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from '@/components/ui/button';
import { PlusCircle, CheckCircle2, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const mockActivities = [
    { type: 'Meeting', title: 'Q4 Planning Session', time: '10:00 AM', status: 'Upcoming' },
    { type: 'Task', title: 'Finalize logistics for order #5821', time: '2:00 PM', status: 'Completed' },
    { type: 'Meeting', title: 'Client Onboarding Call', time: '4:00 PM', status: 'Upcoming' },
    { type: 'Task', title: 'Prepare weekly operations report', time: 'EOD', status: 'Overdue' },
];

export function SchedulingTab() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="grid gap-8 md:grid-cols-3 mt-4">
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Master Schedule</CardTitle>
                    <CardDescription>
                        {date ? format(date, 'PPP') : 'Select a date to view activities.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border p-0"
                    />
                </CardContent>
            </Card>
        </div>
        <div>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Tasks and meetings.</CardDescription>
                        </div>
                         <Button size="sm" variant="outline">
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                       {mockActivities.map((activity, index) => (
                           <li key={index} className="flex items-start gap-3">
                            <div className="mt-1">
                                {activity.status === 'Completed' ? 
                                    <CheckCircle2 className="w-5 h-5 text-green-500" /> :
                                    <Clock className="w-5 h-5 text-muted-foreground" />
                                }
                            </div>
                            <div>
                                <p className="font-semibold text-sm">{activity.title}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Badge variant={activity.type === 'Meeting' ? 'default' : 'secondary'}>{activity.type}</Badge>
                                    <span>{activity.time}</span>
                                </div>
                            </div>
                           </li>
                       ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
