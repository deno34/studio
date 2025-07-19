
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { CheckCircle2, Clock, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import type { Task } from '@/lib/types';
import { CreateTaskForm } from './create-task-form';

export function SchedulingTab() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/modules/operations/tasks', {
        headers: { 'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY! }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch tasks.');
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error fetching tasks",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

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
              <CreateTaskForm onTaskCreated={fetchTasks} />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <ul className="space-y-4">
                {tasks.length > 0 ? tasks.map((task) => (
                  <li key={task.id} className="flex items-start gap-3">
                    <div className="mt-1">
                      {task.status === 'Completed' ? 
                        <CheckCircle2 className="w-5 h-5 text-green-500" /> :
                        <Clock className="w-5 h-5 text-muted-foreground" />
                      }
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{task.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant={task.type === 'Meeting' ? 'default' : 'secondary'}>{task.type}</Badge>
                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </li>
                )) : (
                  <div className="text-center text-sm text-muted-foreground py-10">
                    No tasks found. Add one to get started.
                  </div>
                )}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
