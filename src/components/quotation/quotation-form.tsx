"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  Copy,
  Loader2,
  Save,
  ArrowLeft,
} from "lucide-react";
import { saveQuotationAction, duplicateQuotationAction } from "@/actions/quotation-actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useQuotationForm } from "@/hooks/use-quotation-form";
import { ClientProjectForm, QuotationSummaryPanel } from "@/components/quotation/quotation-summary-panel";
import {
  AddSectionButton,
  QuotationSectionEditor,
} from "@/components/quotation/quotation-section-editor";
import {
  PaymentScheduleEditor,
  StringListEditor,
} from "@/components/quotation/string-list-editor";
import { PdfActions } from "@/components/pdf/pdf-actions";
import type { Quotation } from "@/types/quotation.types";

interface QuotationFormProps {
  initialQuotation: Quotation;
  mode: "create" | "edit";
}

export function QuotationForm({ initialQuotation, mode }: QuotationFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {
    quotation,
    isDirty,
    sectionTotals,
    setField,
    updateClient,
    updateProject,
    updateSummaryField,
    addSection,
    updateSection,
    removeSection,
    duplicateSection,
    addRow,
    updateRow,
    removeRow,
    duplicateRow,
    reorderRows,
    updateStringList,
    addStringListItem,
    removeStringListItem,
    updatePaymentSchedule,
    addPaymentScheduleItem,
    removePaymentScheduleItem,
    resetDirty,
  } = useQuotationForm(initialQuotation);

  const handleSave = () => {
    startTransition(async () => {
      const saved = await saveQuotationAction(quotation);
      resetDirty();
      if (mode === "create") {
        router.replace(`/quotations/${saved.id}/edit`);
      }
    });
  };

  const handleDuplicate = () => {
    startTransition(async () => {
      const duplicate = await duplicateQuotationAction(quotation.id);
      if (duplicate) {
        router.push(`/quotations/${duplicate.id}/edit`);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button type="button" variant="ghost" size="icon" onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {mode === "create" ? "New Quotation" : "Edit Quotation"}
            </h1>
            <p className="text-sm text-muted-foreground">{quotation.quotationNumber}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <PdfActions quotation={quotation} />
          {mode === "edit" && (
            <Button type="button" variant="outline" size="sm" onClick={handleDuplicate} disabled={isPending}>
              <Copy className="h-4 w-4" />
              Duplicate
            </Button>
          )}
          <Button type="button" size="sm" onClick={handleSave} disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isDirty ? "Save Changes" : "Saved"}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-1">
          <Label>Status</Label>
          <Select
            value={quotation.status}
            onValueChange={(value) =>
              setField("status", value as Quotation["status"])
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label htmlFor="validTill">Valid Till</Label>
          <Input
            id="validTill"
            type="date"
            className="w-[180px]"
            value={quotation.validTill || ""}
            onChange={(e) => setField("validTill", e.target.value)}
          />
        </div>
      </div>

      <ClientProjectForm
        client={quotation.client}
        project={quotation.project}
        onUpdateClient={updateClient}
        onUpdateProject={updateProject}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Quotation Builder</h2>
          {quotation.sections.map((section) => {
            const total = sectionTotals.find((t) => t.id === section.id)?.total ?? 0;
            return (
              <QuotationSectionEditor
                key={section.id}
                section={section}
                sectionTotal={total}
                onUpdateSection={(data) => updateSection(section.id, data)}
                onDuplicateSection={() => duplicateSection(section.id)}
                onRemoveSection={() => removeSection(section.id)}
                onAddRow={() => addRow(section.id)}
                onUpdateRow={(rowId, data) => updateRow(section.id, rowId, data)}
                onDuplicateRow={(rowId) => duplicateRow(section.id, rowId)}
                onRemoveRow={(rowId) => removeRow(section.id, rowId)}
                onReorderRows={(activeId, overId) => reorderRows(section.id, activeId, overId)}
                canRemoveSection={quotation.sections.length > 1}
              />
            );
          })}
          <AddSectionButton onClick={() => addSection()} />
        </div>

        <QuotationSummaryPanel
          summary={quotation.summary}
          onUpdateDiscount={(v) => updateSummaryField("discountPercent", v)}
          onUpdateGst={(v) => updateSummaryField("gstPercent", v)}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <StringListEditor
          title="Package Includes"
          items={quotation.packageIncludes}
          onUpdate={(i, v) => updateStringList("packageIncludes", i, v)}
          onAdd={() => addStringListItem("packageIncludes")}
          onRemove={(i) => removeStringListItem("packageIncludes", i)}
        />
        <StringListEditor
          title="Package Excludes"
          items={quotation.packageExcludes}
          onUpdate={(i, v) => updateStringList("packageExcludes", i, v)}
          onAdd={() => addStringListItem("packageExcludes")}
          onRemove={(i) => removeStringListItem("packageExcludes", i)}
        />
        <StringListEditor
          title="Material Brands"
          items={quotation.materialBrands}
          onUpdate={(i, v) => updateStringList("materialBrands", i, v)}
          onAdd={() => addStringListItem("materialBrands")}
          onRemove={(i) => removeStringListItem("materialBrands", i)}
        />
        <StringListEditor
          title="Terms & Conditions"
          items={quotation.termsAndConditions}
          onUpdate={(i, v) => updateStringList("termsAndConditions", i, v)}
          onAdd={() => addStringListItem("termsAndConditions")}
          onRemove={(i) => removeStringListItem("termsAndConditions", i)}
        />
      </div>

      <PaymentScheduleEditor
        items={quotation.paymentSchedule}
        onUpdate={updatePaymentSchedule}
        onAdd={addPaymentScheduleItem}
        onRemove={removePaymentScheduleItem}
      />

      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea
          value={quotation.notes}
          onChange={(e) => setField("notes", e.target.value)}
          placeholder="Additional notes for the client..."
          rows={4}
        />
      </div>
    </div>
  );
}
