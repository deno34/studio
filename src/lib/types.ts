
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


// Business Profile Schemas
export const BusinessSchema = z.object({
  name: z.string().min(3, { message: 'Business name must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Please provide a brief description of your business.' }),
  industry: z.string().nonempty({ message: 'Please select an industry.' }),
  logoUrl: z.string().url().optional(),
});
export type Business = z.infer<typeof BusinessSchema> & {
    id: string;
    userId: string;
    createdAt: string;
    selectedAgents: string[];
};

// Document Schemas
export const DocumentSchema = z.object({
  id: z.string(),
  businessId: z.string(),
  userId: z.string(),
  fileName: z.string(),
  fileUrl: z.string().url(),
  contentType: z.string(),
  category: z.string(), // To be filled by AI categorization
  status: z.enum(['Uploaded', 'Processing', 'Categorized', 'Error']),
  createdAt: z.string(),
});
export type Document = z.infer<typeof DocumentSchema>;


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
export const CandidateStatus = z.enum(['New', 'Shortlisted', 'Interviewing', 'Offer', 'Hired', 'Rejected']);
export type CandidateStatusType = z.infer<typeof CandidateStatus>;

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
    status: CandidateStatusType;
    matchPercentage?: number;
    matchExplanation?: string;
    matchingSkills?: string[];
    notes?: string;
}

// HR / Interview Summary Schemas
export const InterviewSummaryInputSchema = z.object({
  transcript: z.string().describe("The full text transcript of the interview conversation."),
});
export type InterviewSummaryInput = z.infer<typeof InterviewSummaryInputSchema>;

export const InterviewSummaryOutputSchema = z.object({
  keyPoints: z.array(z.string()).describe("A list of the main takeaways from the interview."),
  strengths: z.array(z.string()).describe("A list of the candidate's perceived strengths."),
  weaknesses: z.array(z.string()).describe("A list of the candidate's perceived weaknesses or areas of concern."),
  recommendationScore: z.number().describe("A score from 1-10 recommending the candidate."),
  recommendationJustification: z.string().describe("A brief justification for the recommendation score."),
});
export type InterviewSummaryOutput = z.infer<typeof InterviewSummaryOutputSchema>;

// Operations / Logistics Schemas
export const LogisticsPlanInputSchema = z.object({
    origin: z.string().min(3, "Origin is required."),
    destination: z.string().min(3, "Destination is required."),
    goodsDescription: z.string().min(10, "Goods description is required."),
    transportMode: z.enum(['Road', 'Air', 'Sea']),
    deliveryDeadline: z.string().optional().describe("The delivery deadline for the shipment."),
});
export type LogisticsPlanInput = z.infer<typeof LogisticsPlanInputSchema>;

export const LogisticsPlanOutputSchema = z.object({
    summary: z.string().describe("A brief summary of the logistics plan."),
    recommendedRoute: z.string().describe("The suggested route for the shipment."),
    estimatedCost: z.string().describe("The estimated cost for the shipment (e.g., 'KES 80,000 - 95,000')."),
    estimatedTime: z.string().describe("The estimated delivery time (e.g., '3-4 business days')."),
    suggestedVendor: z.string().describe("A recommended logistics partner for this task."),
});
export type LogisticsPlanOutput = z.infer<typeof LogisticsPlanOutputSchema>;


// Operations / Scheduling Schemas
export const TaskStatus = z.enum(['Upcoming', 'Completed', 'Overdue']);
export type TaskStatusType = z.infer<typeof TaskStatus>;

export const TaskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  type: z.enum(['Task', 'Meeting']),
  status: TaskStatus,
  dueDate: z.string().describe("The due date for the task in ISO 8601 format."),
  participants: z.array(z.string()).optional().describe("A list of participants for the task or meeting."),
});

export interface Task extends z.infer<typeof TaskSchema> {
    id: string;
    userId: string;
    createdAt: string;
}

// Operations / Daily Planner Schemas
export const DailyPlannerInputSchema = z.object({
    tasks: z.array(TaskSchema.pick({ title: true, type: true })).describe("A list of tasks and meetings for the day."),
});
export type DailyPlannerInput = z.infer<typeof DailyPlannerInputSchema>;

export const DailyPlannerOutputSchema = z.object({
    planMarkdown: z.string().describe("The full daily plan formatted as a Markdown string."),
});
export type DailyPlannerOutput = z.infer<typeof DailyPlannerOutputSchema>;

// Operations / Inventory Schemas
export const VendorSchema = z.object({
    name: z.string().min(2, "Vendor name is required."),
    contactPerson: z.string().optional(),
    email: z.string().email().optional(),
});
export interface Vendor extends z.infer<typeof VendorSchema> {
    id: string;
    createdAt: string;
}

export const InventoryItemSchema = z.object({
    name: z.string().min(2, "Item name is required."),
    sku: z.string().min(3, "SKU must be at least 3 characters."),
    stockLevel: z.coerce.number().min(0, "Stock level cannot be negative."),
    reorderLevel: z.coerce.number().min(0, "Reorder level cannot be negative."),
    vendorId: z.string().optional(),
    location: z.string().optional(),
});

export interface InventoryItem extends z.infer<typeof InventoryItemSchema> {
    id: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
}

// Operations / Restock Suggestion Schemas
export const RestockSuggestionInputSchema = z.object({
  inventoryItems: z.array(z.object({
    name: z.string(),
    sku: z.string(),
    stockLevel: z.number(),
    reorderLevel: z.number(),
  })).describe("A list of all inventory items."),
});
export type RestockSuggestionInput = z.infer<typeof RestockSuggestionInputSchema>;

export const RestockSuggestionSchema = z.object({
  itemName: z.string().describe("The name of the item to reorder."),
  sku: z.string().describe("The SKU of the item to reorder."),
  quantityToReorder: z.number().describe("The suggested quantity to reorder."),
  justification: z.string().describe("The reason for the restock suggestion."),
});
export type RestockSuggestion = z.infer<typeof RestockSuggestionSchema>;

export const RestockSuggestionOutputSchema = z.object({
  suggestions: z.array(RestockSuggestionSchema).describe('A list of restock suggestions. Should be empty if no items need restocking.'),
});
export type RestockSuggestionOutput = z.infer<typeof RestockSuggestionOutputSchema>;


// CRM / Client Schemas
export const ClientStatus = z.enum(['Lead', 'Contacted', 'Proposal', 'Closed (Won)', 'Closed (Lost)']);
export type ClientStatusType = z.infer<typeof ClientStatus>;

export const ClientSchema = z.object({
    name: z.string().min(2, "Client name is required."),
    email: z.string().email("Invalid email address."),
    company: z.string().optional(),
    status: ClientStatus,
});

export interface Client extends z.infer<typeof ClientSchema> {
    id: string;
    createdAt: string;
}

// CRM / Lead Follow-up Schemas
export const LeadFollowupSuggestionInputSchema = z.object({
    clients: z.array(z.object({
        name: z.string(),
        status: ClientStatus,
        createdAt: z.string(),
    })).describe("A list of all clients in the CRM."),
    currentDate: z.string().describe("Today's date in YYYY-MM-DD format."),
});
export type LeadFollowupSuggestionInput = z.infer<typeof LeadFollowupSuggestionInputSchema>;

export const LeadFollowupSuggestionSchema = z.object({
  clientName: z.string().describe("The name of the client to follow up with."),
  justification: z.string().describe("The reason for the follow-up suggestion."),
});
export type LeadFollowupSuggestion = z.infer<typeof LeadFollowupSuggestionSchema>;

export const LeadFollowupSuggestionOutputSchema = z.object({
  suggestions: z.array(LeadFollowupSuggestionSchema).describe('A prioritized list of follow-up suggestions for the day.'),
});
export type LeadFollowupSuggestionOutput = z.infer<typeof LeadFollowupSuggestionOutputSchema>;

// Document AI / Contract Parser Schemas
export const ContractParserInputSchema = z.object({
  contractText: z.string().describe("The full text content extracted from the contract document."),
});
export type ContractParserInput = z.infer<typeof ContractParserInputSchema>;

export const ContractParserOutputSchema = z.object({
  parties: z.array(z.string()).describe("The names of the parties involved in the contract."),
  effectiveDate: z.string().optional().describe("The date the contract becomes effective."),
  terminationDate: z.string().optional().describe("The date the contract terminates."),
  jurisdiction: z.string().optional().describe("The governing law or jurisdiction."),
  keyObligations: z.array(z.object({
    party: z.string().describe("The party responsible for the obligation."),
    obligation: z.string().describe("A summary of the key obligation."),
  })).describe("A list of key responsibilities and duties for each party."),
  isContract: z.boolean().describe("Whether the document appears to be a legal contract."),
});
export type ContractParserOutput = z.infer<typeof ContractParserOutputSchema>;

// Document AI / Document Writer Schemas
export const DocumentWriterInputSchema = z.object({
  documentType: z.enum(['Email', 'Report', 'Proposal', 'Memo']),
  purpose: z.string().min(10, "Purpose must be at least 10 characters."),
  audience: z.string().min(3, "Audience must be at least 3 characters."),
  keywords: z.string().optional(),
  tone: z.enum(['Professional', 'Casual', 'Formal', 'Friendly']),
  length: z.enum(['Short', 'Medium', 'Long']),
});
export type DocumentWriterInput = z.infer<typeof DocumentWriterInputSchema>;

export const DocumentWriterOutputSchema = z.object({
  draftContent: z.string().describe("The AI-generated document draft in Markdown format."),
});
export type DocumentWriterOutput = z.infer<typeof DocumentWriterOutputSchema>;


// Document AI / Document Summarizer Schemas
export const DocumentSummaryInputSchema = z.object({
  documentText: z.string().describe("The full text content extracted from the document."),
});
export type DocumentSummaryInput = z.infer<typeof DocumentSummaryInputSchema>;

export const DocumentSummaryOutputSchema = z.object({
  summaryPoints: z.array(z.string()).describe("A bulleted list of key takeaways."),
  sentiment: z.enum(['Positive', 'Negative', 'Neutral']).describe("The overall sentiment of the document."),
  entities: z.object({
    people: z.array(z.string()).describe("A list of people mentioned."),
    companies: z.array(z.string()).describe("A list of companies or organizations mentioned."),
  }).describe("Key entities identified in the document."),
});
export type DocumentSummaryOutput = z.infer<typeof DocumentSummaryOutputSchema>;


// Business Intelligence / Forecasting Schemas
export const ForecastingInputSchema = z.object({
  jsonData: z.string().describe("A JSON string representing an array of data points. Each object should have a 'date' key and a key for the metric to be forecasted."),
  metric: z.string().describe("The name of the key in the data objects to forecast."),
  period: z.number().describe("The number of future periods to forecast (e.g., 3 for 3 months)."),
});
export type ForecastingInput = z.infer<typeof ForecastingInputSchema>;

export const ForecastPointSchema = z.object({
  date: z.string().describe("The date for the data point."),
  value: z.number().optional().describe("The historical value for the data point."),
  forecast: z.number().optional().describe("The forecasted value for the data point."),
});
export type ForecastPoint = z.infer<typeof ForecastPointSchema>;

export const ForecastingOutputSchema = z.object({
  forecast: z.array(ForecastPointSchema).describe("An array containing both the historical data and the new forecasted data points."),
  analysis: z.string().describe("A text-based analysis of the forecast, including trends, anomalies, and insights."),
});
export type ForecastingOutput = z.infer<typeof ForecastingOutputSchema>;


// Business Intelligence / Dashboard Generator Schemas
export const DashboardGeneratorInputSchema = z.object({
  data: z.string().describe("The dataset as a JSON string."),
  prompt: z.string().describe("The user's prompt describing what they want to see in the dashboard."),
});
export type DashboardGeneratorInput = z.infer<typeof DashboardGeneratorInputSchema>;

export const DashboardCardSchema = z.object({
  title: z.string().describe("The title of the KPI card."),
  value: z.string().describe("The main value or metric to display on the card."),
  insight: z.string().describe("A brief, one-sentence insight about the metric."),
});
export type DashboardCard = z.infer<typeof DashboardCardSchema>;

export const DashboardGeneratorOutputSchema = z.object({
  cards: z.array(DashboardCardSchema).describe("A list of KPI cards to be displayed on the dashboard."),
});
export type DashboardGeneratorOutput = z.infer<typeof DashboardGeneratorOutputSchema>;

// Business Intelligence / KPI Summary Schemas
export const KpiSummaryInputSchema = z.object({
  kpiName: z.string().describe("The name of the KPI being analyzed."),
  kpiData: z.array(z.number()).describe("A time-series array of the KPI's value over the last N periods."),
});
export type KpiSummaryInput = z.infer<typeof KpiSummaryInputSchema>;

export const KpiSummaryOutputSchema = z.object({
  status: z.enum(['Improving', 'Warning', 'Stable']).describe("The overall status of the KPI trend."),
  summary: z.string().describe("A one-sentence summary of the KPI's performance."),
  cause: z.string().describe("A likely cause or reason behind the observed trend."),
  action: z.string().describe("A single, actionable recommendation based on the analysis."),
});
export type KpiSummaryOutput = z.infer<typeof KpiSummaryOutputSchema>;

// Business Intelligence / Chart Generator Schemas
export const ChartGeneratorInputSchema = z.object({
  data: z.string().describe("The dataset as a JSON string."),
  prompt: z.string().describe("The user's prompt describing what kind of chart to generate and what to show."),
  chartType: z.enum(['bar', 'line', 'pie']).describe("The desired chart type."),
});
export type ChartGeneratorInput = z.infer<typeof ChartGeneratorInputSchema>;

export const ChartGeneratorOutputSchema = z.object({
  chartData: z.string().describe("A JSON string of the data, transformed and ready to be used by a charting library like Recharts. This should be an array of objects."),
  chartConfig: z.string().describe("A JSON string describing the chart configuration. This should include keys for the x-axis, y-axis, and any other relevant series."),
  analysis: z.string().describe("A text-based analysis of what the generated chart shows."),
});
export type ChartGeneratorOutput = z.infer<typeof ChartGeneratorOutputSchema>;

// Business Intelligence / Competitor Analysis Schemas
export const AnalysisCategory = z.enum(['Headlines', 'Pricing', 'Key Features', 'Recent News']);
export type AnalysisCategoryType = z.infer<typeof AnalysisCategory>;

export const CompetitorAnalysisInputSchema = z.object({
  htmlContent: z.string().describe("The raw HTML content of the competitor's webpage."),
  categories: z.array(AnalysisCategory).describe("The specific categories of information to extract."),
});
export type CompetitorAnalysisInput = z.infer<typeof CompetitorAnalysisInputSchema>;

export const ExtractedInfoSchema = z.object({
    category: AnalysisCategory,
    findings: z.array(z.string()).describe("A list of extracted data points for the category."),
});

export const CompetitorAnalysisOutputSchema = z.object({
  summary: z.string().describe("A high-level summary of the findings from the webpage."),
  extractedData: z.array(ExtractedInfoSchema).describe("A list of structured data extracted from the page, grouped by category."),
});
export type CompetitorAnalysisOutput = z.infer<typeof CompetitorAnalysisOutputSchema>;
