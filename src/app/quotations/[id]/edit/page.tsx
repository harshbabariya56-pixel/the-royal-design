import { notFound } from "next/navigation";
import { fetchQuotation } from "@/actions/quotation-actions";
import { QuotationForm } from "@/components/quotation/quotation-form";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditQuotationPage({ params }: PageProps) {
  const { id } = await params;
  const quotation = await fetchQuotation(id);

  if (!quotation) notFound();

  return <QuotationForm initialQuotation={quotation} mode="edit" />;
}
