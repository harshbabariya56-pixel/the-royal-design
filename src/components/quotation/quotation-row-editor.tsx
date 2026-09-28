"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Copy, GripVertical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { joinSize, splitSize } from "@/lib/size-utils";
import { formatCurrency } from "@/lib/utils";
import type { QuotationRow } from "@/types/quotation.types";

interface QuotationRowEditorProps {
  row: QuotationRow;
  index: number;
  onUpdate: (data: Partial<QuotationRow>) => void;
  onDuplicate: () => void;
  onRemove: () => void;
  canRemove: boolean;
}

const fieldLabel = "mb-0.5 text-[10px] font-medium leading-none text-muted-foreground";
const fieldInput = "h-8 px-1.5 text-xs";

export function QuotationRowEditor({
  row,
  index,
  onUpdate,
  onDuplicate,
  onRemove,
  canRemove,
}: QuotationRowEditorProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: row.id,
  });

  const { length, width } = splitSize(row.size);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  const updateDimension = (nextLength: string, nextWidth: string) => {
    onUpdate({ size: joinSize(nextLength, nextWidth) });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex min-w-[980px] items-end gap-1.5 rounded-md border bg-muted/30 px-2 py-2"
    >
      <div className="flex w-12 shrink-0 items-end gap-0.5">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-6 shrink-0 cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
          title="Drag to reorder"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-3.5 w-3.5" />
        </Button>
        <div className="min-w-0">
          <p className={fieldLabel}>#</p>
          <p className="flex h-8 items-center text-xs font-medium">{index + 1}</p>
        </div>
      </div>

      <div className="w-[130px] shrink-0">
        <p className={fieldLabel}>Particular</p>
        <Input
          className={fieldInput}
          value={row.particular}
          onChange={(e) => onUpdate({ particular: e.target.value })}
          placeholder="Item"
        />
      </div>

      <div className="w-[72px] shrink-0">
        <p className={fieldLabel}>L (ft-in)</p>
        <Input
          className={fieldInput}
          value={length}
          onChange={(e) => updateDimension(e.target.value, width)}
          placeholder={`10'6"`}
        />
      </div>

      <div className="w-[72px] shrink-0">
        <p className={fieldLabel}>W (ft-in)</p>
        <Input
          className={fieldInput}
          value={width}
          onChange={(e) => updateDimension(length, e.target.value)}
          placeholder={`8'0"`}
        />
      </div>

      <div className="w-[64px] shrink-0">
        <p className={fieldLabel}>Sq.Ft</p>
        <Input
          className={fieldInput}
          type="number"
          min={0}
          step="0.01"
          value={row.sqFt || ""}
          onChange={(e) => onUpdate({ sqFt: parseFloat(e.target.value) || 0 })}
          title="Enter manually, or auto-filled from L × W"
          placeholder="0"
        />
      </div>

      <div className="w-[52px] shrink-0">
        <p className={fieldLabel}>Qty</p>
        <Input
          className={fieldInput}
          type="number"
          min={0}
          value={row.quantity || ""}
          onChange={(e) => onUpdate({ quantity: parseFloat(e.target.value) || 0 })}
        />
      </div>

      <div className="min-w-[110px] flex-1">
        <p className={fieldLabel}>Description</p>
        <Input
          className={fieldInput}
          value={row.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Details"
        />
      </div>

      <div className="w-[76px] shrink-0">
        <p className={fieldLabel}>Rate (₹)</p>
        <Input
          className={fieldInput}
          type="number"
          min={0}
          value={row.rate || ""}
          onChange={(e) => onUpdate({ rate: parseFloat(e.target.value) || 0 })}
        />
      </div>

      <div className="w-[88px] shrink-0">
        <p className={fieldLabel}>Amount</p>
        <div className="flex h-8 items-center rounded-md border bg-background px-1.5 text-xs font-semibold tabular-nums">
          {formatCurrency(row.amount)}
        </div>
      </div>

      <div className="flex w-[64px] shrink-0 justify-end gap-0.5">
        <Button type="button" variant="ghost" size="icon" className="h-8 w-7" onClick={onDuplicate} title="Copy row">
          <Copy className="h-3.5 w-3.5" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-7 text-destructive hover:text-destructive"
          onClick={onRemove}
          disabled={!canRemove}
          title="Delete row"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

interface AddRowButtonProps {
  onClick: () => void;
}

export function AddRowButton({ onClick }: AddRowButtonProps) {
  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick} className="mt-2">
      <Plus className="h-4 w-4" />
      Add Row
    </Button>
  );
}
