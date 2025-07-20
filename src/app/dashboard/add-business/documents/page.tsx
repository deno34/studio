
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/landing/header';
import { Footer } from '@/components/landing/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, UploadCloud, File, X, Loader2 } from 'lucide-react';
import { OnboardingStepper } from '@/components/dashboard/add-business/onboarding-stepper';
import { useDropzone } from 'react-dropzone';

export default function DocumentUploadPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const businessId = searchParams.get('businessId');
  const { toast } = useToast();
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFiles(prev => [...prev, ...acceptedFiles]);
    },
    accept: {
      'application/pdf': ['.pdf'],
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    }
  });

  const removeFile = (fileToRemove: File) => {
    setFiles(files.filter(file => file !== fileToRemove));
  };

  const handleContinue = async () => {
    setIsUploading(true);
    // In a real app, this would upload files and trigger AI categorization.
    // This involves creating a new API endpoint.
    console.log('Uploading files for businessId:', businessId, files.map(f => f.name));
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({ title: 'Setup Almost Complete!', description: `Let's finalize your plan.` });
    router.push(`/dashboard/add-business/billing?businessId=${businessId}`);
    setIsUploading(false);
  };
  
  const handleSkip = () => {
     router.push(`/dashboard/add-business/billing?businessId=${businessId}`);
  }

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <Header />
      <main className="flex-1 bg-muted/30 py-12">
        <div className="container max-w-4xl px-4">
          <Button variant="ghost" asChild className="mb-4">
            <Link href={`/dashboard/add-business/agents?businessId=${businessId || ''}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Agents
            </Link>
          </Button>

          <OnboardingStepper currentStep="documents" />

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Upload Initial Documents (Optional)</CardTitle>
              <CardDescription>Give your agents a head start by providing some initial documents. The AI will automatically categorize them. You can always do this later.</CardDescription>
            </CardHeader>
            <CardContent>
                <div {...getRootProps()} className="flex flex-col items-center justify-center space-y-2 rounded-lg border-2 border-dashed p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
                    <input {...getInputProps()} />
                    <UploadCloud className="h-12 w-12 text-muted-foreground" />
                    {isDragActive ?
                        <p className="font-medium text-primary">Drop the files here ...</p> :
                        <p className="font-medium">Drag & drop files here, or click to select</p>
                    }
                    <p className="text-sm text-muted-foreground">Supported: PDF, CSV, XLSX</p>
                </div>

                {files.length > 0 && (
                    <div className="mt-6">
                        <h4 className="font-semibold">Selected Files:</h4>
                        <ul className="mt-2 space-y-2">
                            {files.map((file, index) => (
                                <li key={index} className="flex items-center justify-between rounded-md border p-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <File className="w-4 h-4 text-muted-foreground"/>
                                        <span>{file.name}</span>
                                        <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(file)}>
                                        <X className="w-4 h-4"/>
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                <div className="flex justify-between items-center mt-8">
                    <Button variant="ghost" onClick={handleSkip}>
                        Skip for now
                    </Button>
                    <Button onClick={handleContinue} disabled={isUploading}>
                      {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Continue'}
                      {!isUploading && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
