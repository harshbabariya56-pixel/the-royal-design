"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StringListEditorProps {
  title: string;
  items: string[];
  onUpdate: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  placeholder?: string;
}

export function StringListEditor({
  title,
  items,
  onUpdate,
  onAdd,
  onRemove,
  placeholder = "Enter item",
}: StringListEditorProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) => onUpdate(index, e.target.value)}
              placeholder={placeholder}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onRemove(index)}
              className="shrink-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </CardContent>
    </Card>
  );
}

interface PaymentScheduleEditorProps {
  items: {
    id: string;
    milestone: string;
    amount: string;
  }[];
  onUpdate: (id: string, field: string, value: string | number) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

export function PaymentScheduleEditor({ items, onUpdate, onAdd, onRemove }: PaymentScheduleEditorProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Payment Schedule</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_180px_auto]">
            <div className="space-y-1">
              <Label className="text-xs">Milestone</Label>
              <Input
                value={item.milestone}
                onChange={(e) => onUpdate(item.id, "milestone", e.target.value)}
                placeholder="Milestone name"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Amount / %</Label>
              <Input
                type="text"
                value={item.amount}
                onChange={(e) => onUpdate(item.id, "amount", e.target.value)}
                placeholder="e.g. 50000 or 30%"
              />
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onRemove(item.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus className="h-4 w-4" />
          Add Milestone
        </Button>
      </CardContent>
    </Card>
  );
}
