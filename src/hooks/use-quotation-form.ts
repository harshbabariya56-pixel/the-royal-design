"use client";

import { useCallback, useMemo, useState } from "react";
import { recalculateQuotation, createEmptyRow, createEmptySection } from "@/lib/quotation-defaults";
import { parseSizeToSqFt } from "@/lib/size-utils";
import { generateId } from "@/lib/utils";
import type { Quotation, QuotationRow, QuotationSection } from "@/types/quotation.types";

export function useQuotationForm(initial: Quotation) {
  const [quotation, setQuotation] = useState<Quotation>(() => recalculateQuotation(initial));
  const [isDirty, setIsDirty] = useState(false);

  const update = useCallback((updater: (prev: Quotation) => Quotation) => {
    setQuotation((prev) => {
      const next = recalculateQuotation(updater(prev));
      return next;
    });
    setIsDirty(true);
  }, []);

  const setField = useCallback(
    <K extends keyof Quotation>(key: K, value: Quotation[K]) => {
      update((prev) => ({ ...prev, [key]: value }));
    },
    [update]
  );

  const updateClient = useCallback(
    (field: keyof Quotation["client"], value: string) => {
      update((prev) => ({
        ...prev,
        client: { ...prev.client, [field]: value },
      }));
    },
    [update]
  );

  const updateProject = useCallback(
    (field: keyof Quotation["project"], value: string) => {
      update((prev) => ({
        ...prev,
        project: { ...prev.project, [field]: value },
      }));
    },
    [update]
  );

  const updateSummaryField = useCallback(
    (field: "discountPercent" | "gstPercent", value: number) => {
      update((prev) => ({
        ...prev,
        summary: { ...prev.summary, [field]: value },
      }));
    },
    [update]
  );

  const addSection = useCallback(
    (name?: string) => {
      update((prev) => ({
        ...prev,
        sections: [...prev.sections, createEmptySection(name)],
      }));
    },
    [update]
  );

  const updateSection = useCallback(
    (sectionId: string, data: Partial<QuotationSection>) => {
      update((prev) => ({
        ...prev,
        sections: prev.sections.map((s) => (s.id === sectionId ? { ...s, ...data } : s)),
      }));
    },
    [update]
  );

  const removeSection = useCallback(
    (sectionId: string) => {
      update((prev) => ({
        ...prev,
        sections: prev.sections.filter((s) => s.id !== sectionId),
      }));
    },
    [update]
  );

  const duplicateSection = useCallback(
    (sectionId: string) => {
      update((prev) => {
        const index = prev.sections.findIndex((s) => s.id === sectionId);
        if (index < 0) return prev;

        const source = prev.sections[index];
        const clone: QuotationSection = {
          id: generateId(),
          name: `${source.name} (Copy)`,
          rows: source.rows.map((row) => ({ ...row, id: generateId() })),
        };

        const sections = [...prev.sections];
        sections.splice(index + 1, 0, clone);
        return { ...prev, sections };
      });
    },
    [update]
  );

  const addRow = useCallback(
    (sectionId: string) => {
      update((prev) => ({
        ...prev,
        sections: prev.sections.map((s) =>
          s.id === sectionId ? { ...s, rows: [...s.rows, createEmptyRow()] } : s
        ),
      }));
    },
    [update]
  );

  const updateRow = useCallback(
    (sectionId: string, rowId: string, data: Partial<QuotationRow>) => {
      update((prev) => ({
        ...prev,
        sections: prev.sections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                rows: s.rows.map((r) => {
                  if (r.id !== rowId) return r;
                  const next = { ...r, ...data };
                  // When L × W is complete, auto sq.ft overwrites any manual value.
                  // If L/W is incomplete/empty, keep the current (possibly manual) sq.ft.
                  if (Object.prototype.hasOwnProperty.call(data, "size")) {
                    const parsed = parseSizeToSqFt(next.size);
                    if (parsed !== null) {
                      next.sqFt = parsed;
                    }
                  }
                  return next;
                }),
              }
            : s
        ),
      }));
    },
    [update]
  );

  const removeRow = useCallback(
    (sectionId: string, rowId: string) => {
      update((prev) => ({
        ...prev,
        sections: prev.sections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                rows:
                  s.rows.filter((r) => r.id !== rowId).length > 0
                    ? s.rows.filter((r) => r.id !== rowId)
                    : [createEmptyRow()],
              }
            : s
        ),
      }));
    },
    [update]
  );

  const duplicateRow = useCallback(
    (sectionId: string, rowId: string) => {
      update((prev) => ({
        ...prev,
        sections: prev.sections.map((s) => {
          if (s.id !== sectionId) return s;
          const index = s.rows.findIndex((r) => r.id === rowId);
          if (index < 0) return s;
          const clone: QuotationRow = { ...s.rows[index], id: generateId() };
          const rows = [...s.rows];
          rows.splice(index + 1, 0, clone);
          return { ...s, rows };
        }),
      }));
    },
    [update]
  );

  const reorderRows = useCallback(
    (sectionId: string, activeId: string, overId: string) => {
      if (activeId === overId) return;

      update((prev) => ({
        ...prev,
        sections: prev.sections.map((s) => {
          if (s.id !== sectionId) return s;
          const oldIndex = s.rows.findIndex((r) => r.id === activeId);
          const newIndex = s.rows.findIndex((r) => r.id === overId);
          if (oldIndex < 0 || newIndex < 0) return s;
          const rows = [...s.rows];
          const [moved] = rows.splice(oldIndex, 1);
          rows.splice(newIndex, 0, moved);
          return { ...s, rows };
        }),
      }));
    },
    [update]
  );

  const updateStringList = useCallback(
    (field: "packageIncludes" | "packageExcludes" | "materialBrands" | "termsAndConditions", index: number, value: string) => {
      update((prev) => ({
        ...prev,
        [field]: prev[field].map((item, i) => (i === index ? value : item)),
      }));
    },
    [update]
  );

  const addStringListItem = useCallback(
    (field: "packageIncludes" | "packageExcludes" | "materialBrands" | "termsAndConditions") => {
      update((prev) => ({
        ...prev,
        [field]: [...prev[field], ""],
      }));
    },
    [update]
  );

  const removeStringListItem = useCallback(
    (field: "packageIncludes" | "packageExcludes" | "materialBrands" | "termsAndConditions", index: number) => {
      update((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }));
    },
    [update]
  );

  const updatePaymentSchedule = useCallback(
    (id: string, field: string, value: string | number) => {
      update((prev) => ({
        ...prev,
        paymentSchedule: prev.paymentSchedule.map((item) =>
          item.id === id ? { ...item, [field]: value } : item
        ),
      }));
    },
    [update]
  );

  const addPaymentScheduleItem = useCallback(() => {
    update((prev) => ({
      ...prev,
      paymentSchedule: [
        ...prev.paymentSchedule,
        { id: generateId(), milestone: "", amount: "" },
      ],
    }));
  }, [update]);

  const removePaymentScheduleItem = useCallback(
    (id: string) => {
      update((prev) => ({
        ...prev,
        paymentSchedule: prev.paymentSchedule.filter((item) => item.id !== id),
      }));
    },
    [update]
  );

  const resetDirty = useCallback(() => setIsDirty(false), []);

  const sectionTotals = useMemo(
    () =>
      quotation.sections.map((section) => ({
        id: section.id,
        name: section.name,
        total: section.rows.reduce((sum, row) => sum + row.amount, 0),
      })),
    [quotation.sections]
  );

  return {
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
    setQuotation,
  };
}
