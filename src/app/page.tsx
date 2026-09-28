import { fetchQuotations } from "@/actions/quotation-actions";
import { Dashboard } from "@/components/dashboard/dashboard";
import type { QuotationListItem } from "@/types/quotation.types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function HomePage() {
  let quotations: QuotationListItem[] = [];
  try {
    quotations = await fetchQuotations();
  } catch (error) {
    console.error("[dashboard] Failed to load quotations:", error);
    throw error;
  }
  return <Dashboard quotations={quotations} />;
}
