
import {z} from 'zod';

/**
 * @fileOverview Shared types and schemas for the application.
 */

export const EarlyAccessRequestSchema = z.object({
  email: z.string().email({message: 'Please enter a valid email address.'}),
  company: z
    .string()
    .min(2, {message: 'Company name must be at least 2 characters.'}),
  intendedUse: z
    .string()
    .min(10, {message: 'Please describe your intended use case.'}),
  timeline: z
    .string()
    .nonempty({message: 'Please select an integration timeline.'}),
});

export type EarlyAccessRequest = z.infer<typeof EarlyAccessRequestSchema>;


// Financial Report Schemas
const ExpenseSchema = z.object({
  id: z.string(),
  amount: z.number(),
  category: z.string(),
  date: z.string(),
  note: z.string(),
});

export const FinancialReportInputSchema = z.object({
  reportType: z.enum(['pnl', 'balance_sheet']).describe("The type of financial report to generate."),
  expenses: z.array(ExpenseSchema).describe("A list of all expenses for the period."),
});
export type FinancialReportInput = z.infer<typeof FinancialReportInputSchema>;

export const FinancialReportOutputSchema = z.object({
  reportMarkdown: z.string().describe('The full financial report formatted as a Markdown string.'),
});
export type FinancialReportOutput = z.infer<typeof FinancialReportOutputSchema>;


// Payroll Schemas
export const PayrollSummaryInputSchema = z.object({
  payslipDataUri: z.string().describe("The content of the payslip. This can be a data URI for an image (e.g., 'data:image/png;base64,...') or the extracted text content from a PDF."),
  mimeType: z.string().describe("The MIME type of the uploaded document (e.g., 'application/pdf', 'image/png')."),
});
export type PayrollSummaryInput = z.infer<typeof PayrollSummaryInputSchema>;

export const PayrollSummaryOutputSchema = z.object({
  employeeName: z.string().optional().describe('The full name of the employee.'),
  payPeriod: z.string().optional().describe('The pay period (e.g., "October 2023" or "2023-10-01 to 2023-10-31").'),
  grossPay: z.number().optional().describe('The total gross salary before deductions.'),
  netPay: z.number().optional().describe('The final take-home pay after all deductions.'),
  deductions: z.array(z.object({
    name: z.string().describe('The name of the deduction (e.g., "Income Tax", "Pension Contribution").'),
    amount: z.number().describe('The amount of the deduction.'),
  })).optional().describe('A list of all deductions from the gross pay.'),
  isPayslip: z.boolean().describe('Whether the document appears to be a valid payslip or payroll document.'),
});
export type PayrollSummaryOutput = z.infer<typeof PayrollSummaryOutputSchema>;

// HR / Job Posting Schemas
export const JobPostingSchema = z.object({
  title: z.string().min(5, { message: "Job title must be at least 5 characters." }),
  location: z.string().min(2, { message: "Location must be at least 2 characters." }),
  description: z.string().min(50, { message: "Description must be at least 50 characters." }),
});
export type JobPostingFormValues = z.infer<typeof JobPostingSchema>;

export interface JobPosting extends JobPostingFormValues {
    id: string;
    status: 'Open' | 'Closed' | 'Draft';
    createdAt: string;
    userId: string;
}

// HR / Candidate Schemas
export const CandidateRankingInputSchema = z.object({
  jobTitle: z.string(),
  jobDescription: z.string(),
  resumeText: z.string(),
});
export type CandidateRankingInput = z.infer<typeof CandidateRankingInputSchema>;

export const CandidateRankingOutputSchema = z.object({
  matchPercentage: z.number().describe("A score from 0-100 indicating the candidate's match to the job."),
  explanation: z.string().describe("A brief justification for the match score."),
  matchingSkills: z.array(z.string()).describe("A list of key skills the candidate has that match the job requirements."),
});
export type CandidateRankingOutput = z.infer<typeof CandidateRankingOutputSchema>;

export interface Candidate {
    id: string;
    jobId: string;
    name: string;
    email: string;
    phone?: string;
    resumeUrl: string;
    resumeText: string;
    createdAt: string;
    status: 'New' | 'Shortlisted' | 'Interviewing' | 'Offer' | 'Hired' | 'Rejected';
    matchPercentage?: number;
    matchExplanation?: string;
    matchingSkills?: string[];
}
