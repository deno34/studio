
'use client';

import { cn } from '@/lib/utils';
import { Building, Bot, FileUp, CreditCard } from 'lucide-react';

const steps = [
  { id: 'profile', name: 'Business Profile', icon: <Building className="w-5 h-5" /> },
  { id: 'agents', name: 'Select Agents', icon: <Bot className="w-5 h-5" /> },
  { id: 'documents', name: 'Upload Docs', icon: <FileUp className="w-5 h-5" /> },
  { id: 'billing', name: 'Billing', icon: <CreditCard className="w-5 h-5" /> },
];

interface OnboardingStepperProps {
  currentStep: 'profile' | 'agents' | 'documents' | 'billing';
}

export function OnboardingStepper({ currentStep }: OnboardingStepperProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={cn('relative', stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : '')}>
            {stepIdx < currentStepIndex ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-primary" />
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {step.icon}
                </div>
                <p className="absolute -bottom-6 text-xs font-medium text-primary">{step.name}</p>
              </>
            ) : stepIdx === currentStepIndex ? (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-background">
                  <span className="text-primary">{step.icon}</span>
                </div>
                <p className="absolute -bottom-6 text-xs font-medium text-primary">{step.name}</p>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>
                <div className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-background">
                   <span className="text-gray-400">{step.icon}</span>
                </div>
                <p className="absolute -bottom-6 text-xs font-medium text-muted-foreground">{step.name}</p>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
