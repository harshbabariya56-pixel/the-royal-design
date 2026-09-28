import { getQuotationNumbers } from "@/lib/data/quotation-store";
import { createDefaultQuotation, recalculateQuotation } from "@/lib/quotation-defaults";
import { generateQuotationNumber } from "@/lib/utils";
import { QuotationForm } from "@/components/quotation/quotation-form";

export const dynamic = "force-dynamic";

export default async function NewQuotationPage() {
  const numbers = await getQuotationNumbers();
  const quotationNumber = generateQuotationNumber(numbers);
  const quotation = recalculateQuotation(createDefaultQuotation(quotationNumber));

  return <QuotationForm initialQuotation={quotation} mode="create" />;
}
