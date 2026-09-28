"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";
import type { Quotation } from "@/types/quotation.types";

interface QuotationSummaryPanelProps {
  summary: Quotation["summary"];
  onUpdateDiscount: (value: number) => void;
  onUpdateGst: (value: number) => void;
}

export function QuotationSummaryPanel({
  summary,
  onUpdateDiscount,
  onUpdateGst,
}: QuotationSummaryPanelProps) {
  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle className="text-base">Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatCurrency(summary.subtotal)}</span>
        </div>

        <div className="space-y-2">
          <Label htmlFor="discount">Discount (%)</Label>
          <Input
            id="discount"
            type="number"
            min={0}
            max={100}
            value={summary.discountPercent || ""}
            onChange={(e) => onUpdateDiscount(parseFloat(e.target.value) || 0)}
          />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Discount Amount</span>
            <span className="text-destructive">- {formatCurrency(summary.discountAmount)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gst">GST (%)</Label>
          <Input
            id="gst"
            type="number"
            min={0}
            value={summary.gstPercent || ""}
            onChange={(e) => onUpdateGst(parseFloat(e.target.value) || 0)}
          />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">GST Amount</span>
            <span className="font-medium">{formatCurrency(summary.gstAmount)}</span>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between">
            <span className="text-base font-semibold">Grand Total</span>
            <span className="text-lg font-bold text-accent">{formatCurrency(summary.grandTotal)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ClientProjectFormProps {
  client: Quotation["client"];
  project: Quotation["project"];
  onUpdateClient: (field: keyof Quotation["client"], value: string) => void;
  onUpdateProject: (field: keyof Quotation["project"], value: string) => void;
}

export function ClientProjectForm({
  client,
  project,
  onUpdateClient,
  onUpdateProject,
}: ClientProjectFormProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Client Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>Client Name</Label>
            <Input
              value={client.name}
              onChange={(e) => onUpdateClient("name", e.target.value)}
              placeholder="Full name"
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={client.email}
              onChange={(e) => onUpdateClient("email", e.target.value)}
              placeholder="email@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              value={client.phone}
              onChange={(e) => onUpdateClient("phone", e.target.value)}
              placeholder="+91 XXXXX XXXXX"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Address</Label>
            <Textarea
              value={client.address}
              onChange={(e) => onUpdateClient("address", e.target.value)}
              placeholder="Client address"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Project Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>Project Name</Label>
            <Input
              value={project.name}
              onChange={(e) => onUpdateProject("name", e.target.value)}
              placeholder="Project title"
            />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              value={project.location}
              onChange={(e) => onUpdateProject("location", e.target.value)}
              placeholder="City / Area"
            />
          </div>
          <div className="space-y-2">
            <Label>Area</Label>
            <Input
              value={project.area}
              onChange={(e) => onUpdateProject("area", e.target.value)}
              placeholder="e.g. 1200 sq.ft"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Project Type</Label>
            <Input
              value={project.type}
              onChange={(e) => onUpdateProject("type", e.target.value)}
              placeholder="Residential / Commercial"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
