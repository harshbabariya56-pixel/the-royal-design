import type { Prisma } from "@prisma/client";
import type { Quotation, QuotationListItem } from "@/types/quotation.types";
import { prisma } from "@/lib/db";
import { recalculateQuotation } from "@/lib/quotation-defaults";

function toListItem(quotation: Quotation): QuotationListItem {
  return {
    id: quotation.id,
    quotationNumber: quotation.quotationNumber,
    createdAt: quotation.createdAt,
    updatedAt: quotation.updatedAt,
    status: quotation.status,
    client: quotation.client,
    project: quotation.project,
    summary: quotation.summary,
  };
}

function fromRecord(data: Prisma.JsonValue): Quotation {
  return recalculateQuotation(data as unknown as Quotation);
}

export async function getAllQuotations(): Promise<QuotationListItem[]> {
  const rows = await prisma.quotationRecord.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return rows.map((row) => toListItem(fromRecord(row.data)));
}

export async function getQuotationById(id: string): Promise<Quotation | null> {
  const row = await prisma.quotationRecord.findUnique({ where: { id } });
  if (!row) return null;
  return fromRecord(row.data);
}

export async function getQuotationNumbers(): Promise<string[]> {
  const rows = await prisma.quotationRecord.findMany({
    select: { quotationNumber: true },
  });
  return rows.map((row) => row.quotationNumber);
}

export async function saveQuotation(quotation: Quotation): Promise<Quotation> {
  const updated = recalculateQuotation({
    ...quotation,
    updatedAt: new Date().toISOString(),
  });

  const payload = updated as unknown as Prisma.InputJsonValue;

  await prisma.quotationRecord.upsert({
    where: { id: updated.id },
    create: {
      id: updated.id,
      quotationNumber: updated.quotationNumber,
      status: updated.status,
      clientName: updated.client.name || "",
      projectName: updated.project.name || "",
      grandTotal: updated.summary.grandTotal,
      data: payload,
      createdAt: new Date(updated.createdAt),
      updatedAt: new Date(updated.updatedAt),
    },
    update: {
      quotationNumber: updated.quotationNumber,
      status: updated.status,
      clientName: updated.client.name || "",
      projectName: updated.project.name || "",
      grandTotal: updated.summary.grandTotal,
      data: payload,
      updatedAt: new Date(updated.updatedAt),
    },
  });

  return updated;
}

export async function deleteQuotation(id: string): Promise<boolean> {
  try {
    await prisma.quotationRecord.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
