import { Badge } from "@/components/ui/badge";
import type { Quotation } from "@/types/quotation.types";

const statusVariant: Record<Quotation["status"], "secondary" | "warning" | "success" | "destructive"> = {
  draft: "secondary",
  sent: "warning",
  approved: "success",
  rejected: "destructive",
};

export function StatusBadge({ status }: { status: Quotation["status"] }) {
  return (
    <Badge variant={statusVariant[status]} className="capitalize">
      {status}
    </Badge>
  );
}
