export interface QuotationRow {
  id: string;
  particular: string;
  size: string;
  sqFt: number;
  quantity: number;
  description: string;
  rate: number;
  amount: number;
}

export interface QuotationSection {
  id: string;
  name: string;
  rows: QuotationRow[];
}

export interface ClientDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface ProjectDetails {
  name: string;
  location: string;
  area: string;
  type: string;
}

export interface PaymentScheduleItem {
  id: string;
  milestone: string;
  amount: number;
}

export interface CompanyInfo {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  gstNumber: string;
  logoUrl: string;
}

export interface QuotationSummary {
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  gstPercent: number;
  gstAmount: number;
  grandTotal: number;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  createdAt: string;
  updatedAt: string;
  validTill: string;
  status: "draft" | "sent" | "approved" | "rejected";
  company: CompanyInfo;
  client: ClientDetails;
  project: ProjectDetails;
  sections: QuotationSection[];
  packageIncludes: string[];
  packageExcludes: string[];
  materialBrands: string[];
  paymentSchedule: PaymentScheduleItem[];
  termsAndConditions: string[];
  notes: string;
  summary: QuotationSummary;
}

export type QuotationListItem = Pick<
  Quotation,
  "id" | "quotationNumber" | "createdAt" | "updatedAt" | "status" | "client" | "project" | "summary"
>;
