import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";
import { fetchQuotation } from "@/actions/quotation-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/quotation/status-badge";
import { PdfActions } from "@/components/pdf/pdf-actions";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function QuotationViewPage({ params }: PageProps) {
  const { id } = await params;
  const quotation = await fetchQuotation(id);

  if (!quotation) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{quotation.quotationNumber}</h1>
              <StatusBadge status={quotation.status} />
            </div>
            <p className="text-sm text-muted-foreground">
              Created {formatDate(quotation.createdAt)} · Updated {formatDate(quotation.updatedAt)}
              {quotation.validTill ? ` · Valid till ${formatDate(quotation.validTill)}` : ""}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <PdfActions quotation={quotation} />
          <Button asChild size="sm">
            <Link href={`/quotations/${quotation.id}/edit`}>
              <Edit className="h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Client Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium">{quotation.client.name || "—"}</p>
            <p className="text-muted-foreground">{quotation.client.email}</p>
            <p className="text-muted-foreground">{quotation.client.phone}</p>
            <p className="text-muted-foreground">{quotation.client.address}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p><span className="text-muted-foreground">Project:</span> {quotation.project.name || "—"}</p>
            <p><span className="text-muted-foreground">Location:</span> {quotation.project.location}</p>
            <p><span className="text-muted-foreground">Area:</span> {quotation.project.area}</p>
            <p><span className="text-muted-foreground">Type:</span> {quotation.project.type}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {quotation.sections.map((section) => {
          const rows = section.rows.filter((r) => r.particular || r.rate > 0);
          if (rows.length === 0) return null;
          const sectionTotal = rows.reduce((s, r) => s + r.amount, 0);

          return (
            <Card key={section.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">{section.name}</CardTitle>
                <span className="font-semibold text-accent">{formatCurrency(sectionTotal)}</span>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="pb-2 pr-4">#</th>
                        <th className="pb-2 pr-4">Particular</th>
                        <th className="pb-2 pr-4">Size</th>
                        <th className="pb-2 pr-4 text-right">Sq.Ft</th>
                        <th className="pb-2 pr-4">Qty</th>
                        <th className="pb-2 pr-4">Description</th>
                        <th className="pb-2 pr-4 text-right">Rate</th>
                        <th className="pb-2 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, i) => (
                        <tr key={row.id} className="border-b last:border-0">
                          <td className="py-2 pr-4">{i + 1}</td>
                          <td className="py-2 pr-4">{row.particular}</td>
                          <td className="py-2 pr-4">{row.size}</td>
                          <td className="py-2 pr-4 text-right">{row.sqFt || "—"}</td>
                          <td className="py-2 pr-4">{row.quantity}</td>
                          <td className="py-2 pr-4">{row.description}</td>
                          <td className="py-2 pr-4 text-right">{formatCurrency(row.rate)}</td>
                          <td className="py-2 text-right font-medium">{formatCurrency(row.amount)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="flex justify-end p-6">
          <div className="w-full max-w-xs space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(quotation.summary.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Discount ({quotation.summary.discountPercent}%)</span>
              <span className="text-destructive">- {formatCurrency(quotation.summary.discountAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">GST ({quotation.summary.gstPercent}%)</span>
              <span>{formatCurrency(quotation.summary.gstAmount)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-base font-bold">
              <span>Grand Total</span>
              <span className="text-accent">{formatCurrency(quotation.summary.grandTotal)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
