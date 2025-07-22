
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, ArrowRight, Building2, Upload } from 'lucide-react';
import { OnboardingStepper } from '@/components/dashboard/add-business/onboarding-stepper';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/auth-context';
import { BusinessSchema } from '@/lib/types';


const profileFormSchema = BusinessSchema.extend({
  logoFile: z.instanceof(File).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function AddBusinessPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      description: '',
      industry: '',
      logoFile: undefined,
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('logoFile', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) {
        toast({ variant: 'destructive', title: 'Not authenticated', description: 'You must be logged in to create a business.' });
        return;
    }
    setIsSubmitting(true);
    
    try {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('description', values.description);
        formData.append('industry', values.industry);
        // Temporarily disable file upload
        // if (values.logoFile) {
        //     formData.append('logoFile', values.logoFile);
        // }

        const response = await fetch('/api/modules/business', {
            method: 'POST',
            headers: {
                'x-api-key': process.env.NEXT_PUBLIC_MASTER_API_KEY!,
            },
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || `Failed to create business profile. Server responded with: ${response.status}`);
        }
        
        toast({ title: 'Profile Saved!', description: 'Now, select your AI agents.' });
        router.push(`/dashboard/add-business/agents?businessId=${result.id}`);

    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Error creating profile',
            description: error instanceof Error ? error.message : 'An unknown error occurred.',
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
        <div className="flex flex-col min-h-dvh bg-background text-foreground">
            <Header />
            <main className="flex-1 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </main>
            <Footer />
        </div>
    );
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1 bg-muted/30 py-12">
        <div className="container max-w-4xl px-4">
          <OnboardingStepper currentStep="profile" />

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Create Your Business Profile</CardTitle>
              <CardDescription>Tell us about your business. This helps the AI agents understand your context.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="logoFile"
                    render={() => (
                      <FormItem>
                        <FormLabel>Business Logo (Optional & Disabled)</FormLabel>
                        <div className="flex items-center gap-4 opacity-50">
                          <Avatar className="h-20 w-20 rounded-lg">
                            <AvatarImage src={previewImage || undefined} alt="Logo preview"/>
                            <AvatarFallback className="rounded-lg"><Building2 className="w-8 h-8" /></AvatarFallback>
                          </Avatar>
                           <Button asChild variant="outline" disabled>
                                <label htmlFor="logo-upload" className="cursor-not-allowed">
                                  <Upload className="mr-2 h-4 w-4" />
                                  Upload Logo
                                </label>
                            </Button>
                           <FormControl>
                                <Input 
                                    id="logo-upload" 
                                    type="file" 
                                    className="sr-only" 
                                    accept="image/png, image/jpeg, image/gif"
                                    onChange={handleFileChange}
                                    disabled
                                />
                           </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Acme Innovations Inc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger><SelectValue placeholder="Select your industry" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="tech">Technology / SaaS</SelectItem>
                                <SelectItem value="ecommerce">E-commerce / Retail</SelectItem>
                                <SelectItem value="agency">Marketing Agency</SelectItem>
                                <SelectItem value="logistics">Logistics / Supply Chain</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="What does your business do?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save & Continue'}
                      {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
