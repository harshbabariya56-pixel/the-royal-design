"use server";

import { revalidatePath } from "next/cache";
import {
  deleteQuotation as deleteFromStore,
  getAllQuotations,
  getQuotationById,
  getQuotationNumbers,
  saveQuotation as saveToStore,
} from "@/lib/data/quotation-store";
import {
  createDefaultQuotation,
  duplicateQuotation,
  recalculateQuotation,
} from "@/lib/quotation-defaults";
import { generateQuotationNumber } from "@/lib/utils";
import type { Quotation } from "@/types/quotation.types";

export async function fetchQuotations() {
  return getAllQuotations();
}

export async function fetchQuotation(id: string) {
  return getQuotationById(id);
}

export async function createQuotationAction() {
  const numbers = await getQuotationNumbers();
  const quotationNumber = generateQuotationNumber(numbers);
  const quotation = recalculateQuotation(createDefaultQuotation(quotationNumber));
  const saved = await saveToStore(quotation);
  revalidatePath("/");
  return saved;
}

export async function saveQuotationAction(quotation: Quotation) {
  const recalculated = recalculateQuotation(quotation);
  const saved = await saveToStore(recalculated);
  revalidatePath("/");
  revalidatePath(`/quotations/${saved.id}`);
  revalidatePath(`/quotations/${saved.id}/edit`);
  return saved;
}

export async function deleteQuotationAction(id: string) {
  const success = await deleteFromStore(id);
  revalidatePath("/");
  return success;
}

export async function duplicateQuotationAction(id: string) {
  const source = await getQuotationById(id);
  if (!source) return null;

  const numbers = await getQuotationNumbers();
  const quotationNumber = generateQuotationNumber(numbers);
  const duplicate = recalculateQuotation(duplicateQuotation(source, quotationNumber));
  const saved = await saveToStore(duplicate);
  revalidatePath("/");
  return saved;
}
