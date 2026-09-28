"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Copy, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import type { QuotationSection, QuotationRow } from "@/types/quotation.types";
import { AddRowButton, QuotationRowEditor } from "./quotation-row-editor";

interface QuotationSectionEditorProps {
  section: QuotationSection;
  sectionTotal: number;
  onUpdateSection: (data: Partial<QuotationSection>) => void;
  onDuplicateSection: () => void;
  onRemoveSection: () => void;
  onAddRow: () => void;
  onUpdateRow: (rowId: string, data: Partial<QuotationRow>) => void;
  onDuplicateRow: (rowId: string) => void;
  onRemoveRow: (rowId: string) => void;
  onReorderRows: (activeId: string, overId: string) => void;
  canRemoveSection: boolean;
}

export function QuotationSectionEditor({
  section,
  sectionTotal,
  onUpdateSection,
  onDuplicateSection,
  onRemoveSection,
  onAddRow,
  onUpdateRow,
  onDuplicateRow,
  onRemoveRow,
  onReorderRows,
  canRemoveSection,
}: QuotationSectionEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    onReorderRows(String(active.id), String(over.id));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex flex-1 items-center gap-3">
          <CardTitle className="text-base">Section</CardTitle>
          <Input
            value={section.name}
            onChange={(e) => onUpdateSection({ name: e.target.value })}
            className="max-w-xs font-semibold"
            placeholder="Section name"
          />
        </div>
        <div className="flex items-center gap-1">
          <span className="mr-2 text-sm font-semibold text-accent">{formatCurrency(sectionTotal)}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onDuplicateSection}
            title="Copy section"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemoveSection}
            disabled={!canRemoveSection}
            title="Delete section"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 overflow-x-auto">
        <div className="flex min-w-[980px] gap-1.5 px-2 text-[10px] font-medium text-muted-foreground">
          <div className="w-12 shrink-0">#</div>
          <div className="w-[130px] shrink-0">Particular</div>
          <div className="w-[72px] shrink-0">L (ft-in)</div>
          <div className="w-[72px] shrink-0">W (ft-in)</div>
          <div className="w-[64px] shrink-0">Sq.Ft</div>
          <div className="w-[52px] shrink-0">Qty</div>
          <div className="min-w-[110px] flex-1">Description</div>
          <div className="w-[76px] shrink-0">Rate</div>
          <div className="w-[88px] shrink-0">Amount</div>
          <div className="w-[64px] shrink-0 text-right">Actions</div>
        </div>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={section.rows.map((row) => row.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="min-w-[980px] space-y-2">
              {section.rows.map((row, index) => (
                <QuotationRowEditor
                  key={row.id}
                  row={row}
                  index={index}
                  onUpdate={(data) => onUpdateRow(row.id, data)}
                  onDuplicate={() => onDuplicateRow(row.id)}
                  onRemove={() => onRemoveRow(row.id)}
                  canRemove={section.rows.length > 1}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <AddRowButton onClick={onAddRow} />
      </CardContent>
    </Card>
  );
}

interface AddSectionButtonProps {
  onClick: () => void;
}

export function AddSectionButton({ onClick }: AddSectionButtonProps) {
  return (
    <Button type="button" variant="outline" onClick={onClick} className="w-full border-dashed">
      <Plus className="h-4 w-4" />
      Add Section
    </Button>
  );
}
