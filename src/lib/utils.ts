import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** PDF-safe currency — Helvetica lacks the ₹ glyph and renders it as superscript 1 */
export function formatPdfCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount);
  return `Rs. ${formatted}`;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(typeof date === "string" ? new Date(date) : date);
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function calculateRowAmount(quantity: number, rate: number, sqFt = 0): number {
  const area = sqFt > 0 ? sqFt : 1;
  return Math.round(quantity * area * rate);
}

export function calculateSectionTotal(rows: { amount: number }[]): number {
  return rows.reduce((sum, row) => sum + row.amount, 0);
}

export function calculateSubtotal(sections: { rows: { amount: number }[] }[]): number {
  return sections.reduce((sum, section) => sum + calculateSectionTotal(section.rows), 0);
}

export function calculateSummary(
  subtotal: number,
  discountPercent: number,
  gstPercent: number
) {
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const taxableAmount = subtotal - discountAmount;
  const gstAmount = Math.round((taxableAmount * gstPercent) / 100);
  const grandTotal = taxableAmount + gstAmount;

  return {
    subtotal,
    discountPercent,
    discountAmount,
    gstPercent,
    gstAmount,
    grandTotal,
  };
}

export function generateQuotationNumber(existingNumbers: string[]): string {
  const year = new Date().getFullYear();
  const prefix = `QT-${year}-`;

  const numbers = existingNumbers
    .filter((n) => n.startsWith(prefix))
    .map((n) => parseInt(n.replace(prefix, ""), 10))
    .filter((n) => !isNaN(n));

  const next = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
  return `${prefix}${String(next).padStart(4, "0")}`;
}

/** Default validity: 30 days from today (YYYY-MM-DD for date inputs) */
export function defaultValidTillDate(from: Date = new Date()): string {
  const date = new Date(from);
  date.setDate(date.getDate() + 30);
  return date.toISOString().slice(0, 10);
}
