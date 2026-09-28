"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { Quotation } from "@/types/quotation.types";
import { DEFAULT_COMPANY } from "@/lib/quotation-defaults";
import { formatDate, formatPdfCurrency } from "@/lib/utils";

/** The Royal Design brand palette (logo charcoal / slate) */
const colors = {
  black: "#1A1A1A",
  gold: "#6E6874",
  goldDark: "#4A4450",
  muted: "#6B6570",
  border: "#E2E0E5",
  cream: "#F7F7F8",
  white: "#FFFFFF",
};

/** Logo natural size after processing (314×371) */
const LOGO_ASPECT = 314 / 371;
const LOGO_WIDTH = 72;
const LOGO_HEIGHT = Math.round(LOGO_WIDTH / LOGO_ASPECT);

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: colors.black,
    backgroundColor: colors.white,
    paddingTop: 36,
    paddingBottom: 56,
    paddingHorizontal: 40,
    lineHeight: 1.4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
    paddingBottom: 14,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.gold,
  },
  logoSection: {
    flexDirection: "row",
    alignItems: "center",
    width: "62%",
    gap: 10,
  },
  logoWrap: {
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
    flexShrink: 0,
  },
  logo: {
    width: LOGO_WIDTH,
    height: LOGO_HEIGHT,
  },
  companyBlock: {
    flexGrow: 1,
    flexShrink: 1,
    width: 200,
    paddingTop: 2,
  },
  companyName: {
    fontSize: 11,
    fontWeight: "bold",
    color: colors.black,
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  companyLine: {
    fontSize: 7,
    color: colors.muted,
    marginBottom: 1.5,
    lineHeight: 1.35,
  },
  companyPhone: {
    fontSize: 7,
    color: colors.black,
    marginTop: 2,
  },
  quoteMeta: {
    width: "34%",
    textAlign: "right",
    alignItems: "flex-end",
  },
  quoteTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 2,
    letterSpacing: 1.5,
  },
  quoteTitleRule: {
    width: 48,
    height: 2,
    backgroundColor: colors.gold,
    alignSelf: "flex-end",
    marginBottom: 8,
  },
  metaText: {
    fontSize: 8,
    color: colors.muted,
    marginBottom: 2,
  },
  metaAccent: {
    fontSize: 8,
    color: colors.goldDark,
    fontWeight: "bold",
    marginBottom: 2,
  },
  infoRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  infoBox: {
    flex: 1,
    backgroundColor: colors.cream,
    padding: 10,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
  },
  infoTitle: {
    fontSize: 8,
    fontWeight: "bold",
    color: colors.goldDark,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  infoText: {
    fontSize: 8,
    color: colors.black,
    marginBottom: 2,
    maxWidth: "100%",
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.black,
    backgroundColor: colors.cream,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginTop: 10,
    marginBottom: 4,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
  },
  table: {
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.black,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tableHeaderCell: {
    color: colors.white,
    fontSize: 7,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 4,
    paddingHorizontal: 4,
    minHeight: 18,
  },
  tableRowAlt: {
    backgroundColor: colors.cream,
  },
  tableCell: {
    fontSize: 7,
    color: colors.black,
  },
  colSr: { width: "4%" },
  colParticular: { width: "16%" },
  colSize: { width: "14%" },
  colSqFt: { width: "8%", textAlign: "right" },
  colQty: { width: "6%", textAlign: "center" },
  colDesc: { width: "20%" },
  colRate: { width: "14%", textAlign: "right" },
  colAmount: { width: "18%", textAlign: "right" },
  sectionTotal: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingVertical: 5,
    paddingHorizontal: 4,
    borderTopWidth: 1,
    borderTopColor: colors.gold,
  },
  sectionTotalText: {
    fontSize: 8,
    fontWeight: "bold",
    color: colors.goldDark,
  },
  listSection: {
    marginTop: 10,
    marginBottom: 5,
  },
  listTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: colors.goldDark,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  listItem: {
    fontSize: 8,
    marginBottom: 2,
    paddingLeft: 8,
    color: colors.black,
  },
  summaryBox: {
    marginTop: 16,
    alignSelf: "flex-end",
    width: "48%",
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.cream,
  },
  summaryLabel: {
    fontSize: 8,
    color: colors.muted,
  },
  summaryValue: {
    fontSize: 8,
    fontWeight: "bold",
    color: colors.black,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 9,
    paddingHorizontal: 10,
    backgroundColor: colors.black,
  },
  grandTotalLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.gold,
  },
  grandTotalValue: {
    fontSize: 10,
    fontWeight: "bold",
    color: colors.gold,
  },
  paymentTable: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  paymentHeader: {
    flexDirection: "row",
    backgroundColor: colors.black,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  paymentHeaderCell: {
    fontSize: 7,
    fontWeight: "bold",
    color: colors.white,
  },
  paymentRow: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  paymentCol1: { width: "70%" },
  paymentCol2: { width: "30%", textAlign: "right" },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    paddingTop: 16,
  },
  signatureBox: {
    width: "40%",
    alignItems: "center",
  },
  signatureLine: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: colors.black,
    marginBottom: 5,
    height: 36,
  },
  signatureLabel: {
    fontSize: 8,
    color: colors.muted,
  },
  footer: {
    position: "absolute",
    bottom: 22,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.gold,
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7,
    color: colors.muted,
    maxWidth: "78%",
  },
  pageNumber: {
    fontSize: 7,
    color: colors.goldDark,
  },
  notes: {
    marginTop: 10,
    padding: 8,
    backgroundColor: colors.cream,
    borderLeftWidth: 3,
    borderLeftColor: colors.gold,
    fontSize: 8,
  },
});

function PageFooter({ company }: { company: Quotation["company"] }) {
  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerText}>
        {company.name}
        {company.phone ? `  ·  ${company.phone}` : ""}
        {"  ·  Vadodara & Ahmedabad"}
      </Text>
      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
      />
    </View>
  );
}

function QuotationTable({ quotation }: { quotation: Quotation }) {
  let rowCounter = 0;

  return (
    <View>
      {quotation.sections.map((section) => {
        const sectionRows = section.rows.filter(
          (r) => r.particular || r.description || r.rate > 0
        );
        if (sectionRows.length === 0) return null;

        const sectionTotal = section.rows.reduce((s, r) => s + r.amount, 0);

        return (
          <View key={section.id} wrap={false}>
            <Text style={styles.sectionTitle}>{section.name}</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, styles.colSr]}>#</Text>
                <Text style={[styles.tableHeaderCell, styles.colParticular]}>Particular</Text>
                <Text style={[styles.tableHeaderCell, styles.colSize]}>Size</Text>
                <Text style={[styles.tableHeaderCell, styles.colSqFt]}>Sq.Ft</Text>
                <Text style={[styles.tableHeaderCell, styles.colQty]}>Qty</Text>
                <Text style={[styles.tableHeaderCell, styles.colDesc]}>Description</Text>
                <Text style={[styles.tableHeaderCell, styles.colRate]}>Rate (Rs.)</Text>
                <Text style={[styles.tableHeaderCell, styles.colAmount]}>Amount (Rs.)</Text>
              </View>
              {sectionRows.map((row, idx) => {
                rowCounter++;
                return (
                  <View
                    key={row.id}
                    style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}
                  >
                    <Text style={[styles.tableCell, styles.colSr]}>{rowCounter}</Text>
                    <Text style={[styles.tableCell, styles.colParticular]}>{row.particular}</Text>
                    <Text style={[styles.tableCell, styles.colSize]}>{row.size}</Text>
                    <Text style={[styles.tableCell, styles.colSqFt]}>
                      {row.sqFt ? row.sqFt.toLocaleString("en-IN") : "—"}
                    </Text>
                    <Text style={[styles.tableCell, styles.colQty]}>{row.quantity}</Text>
                    <Text style={[styles.tableCell, styles.colDesc]}>{row.description}</Text>
                    <Text style={[styles.tableCell, styles.colRate]}>
                      {row.rate.toLocaleString("en-IN")}
                    </Text>
                    <Text style={[styles.tableCell, styles.colAmount]}>
                      {row.amount.toLocaleString("en-IN")}
                    </Text>
                  </View>
                );
              })}
              <View style={styles.sectionTotal}>
                <Text style={styles.sectionTotalText}>
                  Section Total: {formatPdfCurrency(sectionTotal)}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

function StringListSection({ title, items }: { title: string; items: string[] }) {
  const filtered = items.filter(Boolean);
  if (filtered.length === 0) return null;

  return (
    <View style={styles.listSection}>
      <Text style={styles.listTitle}>{title}</Text>
      {filtered.map((item, i) => (
        <Text key={i} style={styles.listItem}>
          • {item}
        </Text>
      ))}
    </View>
  );
}

/** Split address into short readable lines for the PDF header */
function formatAddressLines(address: string): string[] {
  const trimmed = address.trim();
  if (!trimmed) return [];

  // Prefer explicit multi-line addresses (e.g. two offices)
  if (trimmed.includes("\n")) {
    return trimmed
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  }

  const parts = trimmed
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length <= 2) return [trimmed];

  const mid = Math.ceil(parts.length / 2);
  return [parts.slice(0, mid).join(", "), parts.slice(mid).join(", ")];
}

export function QuotationPDFDocument({
  quotation,
  logoSrc = "",
}: {
  quotation: Quotation;
  logoSrc?: string;
}) {
  // Always use current The Royal Design branding (logo + company details)
  const company = {
    ...DEFAULT_COMPANY,
    ...quotation.company,
    name: DEFAULT_COMPANY.name,
    tagline: DEFAULT_COMPANY.tagline,
    address: DEFAULT_COMPANY.address,
    phone: DEFAULT_COMPANY.phone,
    website: DEFAULT_COMPANY.website,
    logoUrl: DEFAULT_COMPANY.logoUrl,
  };
  const { client, project, summary } = quotation;

  return (
    <Document
      title={`Quotation ${quotation.quotationNumber}`}
      author={company.name}
      subject={`${company.name} Quotation`}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoSection}>
            {logoSrc ? (
              <View style={styles.logoWrap}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image src={logoSrc} style={styles.logo} />
              </View>
            ) : null}
            <View style={styles.companyBlock}>
              <Text style={styles.companyName}>{company.name}</Text>
              {formatAddressLines(company.address).map((line) => (
                <Text key={line} style={styles.companyLine}>
                  {line}
                </Text>
              ))}
              {company.phone ? (
                <Text style={styles.companyPhone}>Ph: {company.phone}</Text>
              ) : null}
            </View>
          </View>
          <View style={styles.quoteMeta}>
            <Text style={styles.quoteTitle}>QUOTATION</Text>
            <View style={styles.quoteTitleRule} />
            <Text style={styles.metaAccent}>{quotation.quotationNumber}</Text>
            <Text style={styles.metaText}>Date: {formatDate(quotation.createdAt)}</Text>
            {quotation.validTill ? (
              <Text style={styles.metaText}>Valid Till: {formatDate(quotation.validTill)}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Bill To</Text>
            <Text style={styles.infoText}>{client.name || "—"}</Text>
            {client.phone ? <Text style={styles.infoText}>{client.phone}</Text> : null}
            {client.email ? <Text style={styles.infoText}>{client.email}</Text> : null}
            {formatAddressLines(client.address || "").map((line) => (
              <Text key={line} style={styles.infoText}>
                {line}
              </Text>
            ))}
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Project Details</Text>
            <Text style={styles.infoText}>{project.name || "—"}</Text>
            {project.location ? (
              <Text style={styles.infoText}>{project.location}</Text>
            ) : null}
            {project.area ? <Text style={styles.infoText}>{project.area}</Text> : null}
            {project.type ? <Text style={styles.infoText}>{project.type}</Text> : null}
          </View>
        </View>

        <QuotationTable quotation={quotation} />

        <View style={styles.summaryBox} wrap={false}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatPdfCurrency(summary.subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Discount ({summary.discountPercent}%)</Text>
            <Text style={styles.summaryValue}>- {formatPdfCurrency(summary.discountAmount)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>GST ({summary.gstPercent}%)</Text>
            <Text style={styles.summaryValue}>{formatPdfCurrency(summary.gstAmount)}</Text>
          </View>
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>{formatPdfCurrency(summary.grandTotal)}</Text>
          </View>
        </View>

        <PageFooter company={company} />
      </Page>

      <Page size="A4" style={styles.page}>
        <StringListSection title="Package Includes" items={quotation.packageIncludes} />
        <StringListSection title="Package Excludes" items={quotation.packageExcludes} />
        <StringListSection title="Material Brands" items={quotation.materialBrands} />

        {quotation.paymentSchedule.filter((p) => p.milestone).length > 0 && (
          <View style={styles.listSection}>
            <Text style={styles.listTitle}>Payment Schedule</Text>
            <View style={styles.paymentTable}>
              <View style={styles.paymentHeader}>
                <Text style={[styles.paymentHeaderCell, styles.paymentCol1]}>Milestone</Text>
                <Text style={[styles.paymentHeaderCell, styles.paymentCol2]}>Amount</Text>
              </View>
              {quotation.paymentSchedule
                .filter((p) => p.milestone)
                .map((item) => (
                  <View key={item.id} style={styles.paymentRow}>
                    <Text style={[styles.tableCell, styles.paymentCol1]}>{item.milestone}</Text>
                    <Text style={[styles.tableCell, styles.paymentCol2]}>
                      {formatPdfCurrency(item.amount)}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        )}

        <StringListSection title="Terms & Conditions" items={quotation.termsAndConditions} />

        {quotation.notes ? (
          <View style={styles.notes}>
            <Text style={{ fontWeight: "bold", marginBottom: 4, color: colors.goldDark }}>Notes</Text>
            <Text>{quotation.notes}</Text>
          </View>
        ) : null}

        <View style={styles.signatureSection} wrap={false}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Client Signature</Text>
          </View>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureLabel}>Authorized Signatory</Text>
            <Text style={[styles.signatureLabel, { marginTop: 2, color: colors.goldDark }]}>
              {company.name}
            </Text>
          </View>
        </View>

        <PageFooter company={company} />
      </Page>
    </Document>
  );
}
