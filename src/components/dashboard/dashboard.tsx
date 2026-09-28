"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  Copy,
  Edit,
  Eye,
  FileText,
  Plus,
  Trash2,
} from "lucide-react";
import { deleteQuotationAction, duplicateQuotationAction } from "@/actions/quotation-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { StatusBadge } from "@/components/quotation/status-badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { QuotationListItem } from "@/types/quotation.types";

interface DashboardProps {
  quotations: QuotationListItem[];
}

export function Dashboard({ quotations }: DashboardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    router.push("/quotations/new");
  };

  const handleDuplicate = (id: string) => {
    startTransition(async () => {
      const duplicate = await duplicateQuotationAction(id);
      if (duplicate) {
        router.push(`/quotations/${duplicate.id}/edit`);
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      await deleteQuotationAction(id);
    });
  };

  const totalValue = quotations.reduce((sum, q) => sum + q.summary.grandTotal, 0);
  const draftCount = quotations.filter((q) => q.status === "draft").length;
  const approvedCount = quotations.filter((q) => q.status === "approved").length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Manage your interior design quotations</p>
        </div>
        <Button onClick={handleCreate} disabled={isPending}>
          <Plus className="h-4 w-4" />
          New Quotation
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Quotations</CardDescription>
            <CardTitle className="text-3xl">{quotations.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Value</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(totalValue)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Drafts</CardDescription>
            <CardTitle className="text-3xl">{draftCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Approved</CardDescription>
            <CardTitle className="text-3xl">{approvedCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {quotations.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
              <FileText className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No quotations yet</h3>
            <p className="mb-4 max-w-sm text-sm text-muted-foreground">
              Create your first interior design quotation to get started.
            </p>
            <Button onClick={handleCreate} disabled={isPending}>
              <Plus className="h-4 w-4" />
              Create Quotation
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Recent Quotations</h2>
          <div className="grid gap-3">
            {quotations.map((quotation) => (
              <Card key={quotation.id} className="transition-shadow hover:shadow-md">
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{quotation.quotationNumber}</span>
                      <StatusBadge status={quotation.status} />
                    </div>
                    <p className="text-sm font-medium">
                      {quotation.client.name || "No client"} — {quotation.project.name || "No project"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Updated {formatDate(quotation.updatedAt)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="outline" className="text-base font-bold">
                      {formatCurrency(quotation.summary.grandTotal)}
                    </Badge>
                    <div className="flex gap-1">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/quotations/${quotation.id}`}>
                          <Eye className="h-4 w-4" />
                          View
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/quotations/${quotation.id}/edit`}>
                          <Edit className="h-4 w-4" />
                          Edit
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDuplicate(quotation.id)}
                        disabled={isPending}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete quotation?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete {quotation.quotationNumber}. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(quotation.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
