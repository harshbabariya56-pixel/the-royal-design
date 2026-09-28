import type {
  CompanyInfo,
  Quotation,
  QuotationRow,
  QuotationSection,
} from "@/types/quotation.types";
import { calculateRowAmount } from "@/lib/size-utils";
import { defaultValidTillDate, generateId } from "@/lib/utils";

export const DEFAULT_COMPANY: CompanyInfo = {
  name: "The Royal Design",
  tagline: "Interior Design Studio",
  address:
    "603, Vihav CBD, Bhayli, Vadodara - 391410\n401-c Sun South Trade, Gala Gymkhana Rd., South Bopal, Ahmedabad",
  phone: "81407 54393",
  email: "hello@theroyalinteriorstudio.com",
  website: "www.theroyalinteriorstudio.com",
  gstNumber: "",
  logoUrl: "/logo.png",
};

export function createEmptyRow(): QuotationRow {
  return {
    id: generateId(),
    particular: "",
    size: "",
    sqFt: 0,
    quantity: 1,
    description: "",
    rate: 0,
    amount: 0,
  };
}

export function createEmptySection(name = "New Section"): QuotationSection {
  return {
    id: generateId(),
    name,
    rows: [createEmptyRow()],
  };
}

export const DEFAULT_SECTION_NAMES = [
  "Entrance",
  "Living Room",
  "Cabin",
  "Furniture",
  "Electrical",
  "Kitchen",
  "Bedroom",
];

export const DEFAULT_PACKAGE_INCLUDES = [
  "Design consultation and 3D visualization",
  "Material procurement and quality checks",
  "Skilled labour and site supervision",
  "Post-completion walkthrough",
];

export const DEFAULT_PACKAGE_EXCLUDES = [
  "Civil work and structural modifications",
  "Appliances and electronics",
  "Government fees and permits",
  "Items not explicitly mentioned in quotation",
];

export const DEFAULT_MATERIAL_BRANDS = [
  "Century Ply / Green Ply for modular furniture",
  "Hettich / Hafele for hardware fittings",
  "Asian Paints / Berger for wall finishes",
  "Philips / Havells for electrical fixtures",
];

export const DEFAULT_TERMS = [
  "Quotation valid for 30 days from date of issue.",
  "50% advance payment required to commence work.",
  "Balance payment upon milestone completion.",
  "Any additional work will be charged separately.",
  "Timeline subject to material availability and site readiness.",
  "Client to provide water and electricity at site.",
];

export function createDefaultQuotation(quotationNumber: string): Quotation {
  const now = new Date().toISOString();

  return {
    id: generateId(),
    quotationNumber,
    createdAt: now,
    updatedAt: now,
    validTill: defaultValidTillDate(),
    status: "draft",
    company: { ...DEFAULT_COMPANY },
    client: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
    project: {
      name: "",
      location: "",
      area: "",
      type: "Residential",
    },
    sections: DEFAULT_SECTION_NAMES.slice(0, 3).map((name) => createEmptySection(name)),
    packageIncludes: [...DEFAULT_PACKAGE_INCLUDES],
    packageExcludes: [...DEFAULT_PACKAGE_EXCLUDES],
    materialBrands: [...DEFAULT_MATERIAL_BRANDS],
    paymentSchedule: [
      {
        id: generateId(),
        milestone: "Booking Amount",
        amount: 0,
      },
      {
        id: generateId(),
        milestone: "Mid-Project",
        amount: 0,
      },
      {
        id: generateId(),
        milestone: "Final Handover",
        amount: 0,
      },
    ],
    termsAndConditions: [...DEFAULT_TERMS],
    notes: "",
    summary: {
      subtotal: 0,
      discountPercent: 0,
      discountAmount: 0,
      gstPercent: 18,
      gstAmount: 0,
      grandTotal: 0,
    },
  };
}

export function recalculateQuotation(quotation: Quotation): Quotation {
  const sections = quotation.sections.map((section) => ({
    ...section,
    rows: section.rows.map((row) => {
      const sqFt = typeof row.sqFt === "number" ? row.sqFt : 0;
      return {
        ...row,
        sqFt,
        amount: calculateRowAmount(row.quantity, sqFt, row.rate),
      };
    }),
  }));

  const subtotal = sections.reduce(
    (sum, s) => sum + s.rows.reduce((rs, r) => rs + r.amount, 0),
    0
  );

  const discountAmount = Math.round((subtotal * quotation.summary.discountPercent) / 100);
  const taxableAmount = subtotal - discountAmount;
  const gstAmount = Math.round((taxableAmount * quotation.summary.gstPercent) / 100);
  const grandTotal = taxableAmount + gstAmount;

  return {
    ...quotation,
    validTill: quotation.validTill || defaultValidTillDate(new Date(quotation.createdAt)),
    sections,
    summary: {
      ...quotation.summary,
      subtotal,
      discountAmount,
      gstAmount,
      grandTotal,
    },
  };
}

export function duplicateQuotation(source: Quotation, newNumber: string): Quotation {
  const now = new Date().toISOString();
  const clone = JSON.parse(JSON.stringify(source)) as Quotation;

  clone.id = generateId();
  clone.quotationNumber = newNumber;
  clone.createdAt = now;
  clone.updatedAt = now;
  clone.validTill = defaultValidTillDate();
  clone.status = "draft";

  clone.sections = clone.sections.map((section) => ({
    ...section,
    id: generateId(),
    rows: section.rows.map((row) => ({ ...row, id: generateId() })),
  }));

  clone.paymentSchedule = clone.paymentSchedule.map((item) => ({
    ...item,
    id: generateId(),
  }));

  return clone;
}
