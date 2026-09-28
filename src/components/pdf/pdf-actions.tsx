"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Download, Eye, Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuotationPDFDocument } from "@/components/pdf/quotation-pdf-document";
import { DEFAULT_COMPANY } from "@/lib/quotation-defaults";
import type { Quotation } from "@/types/quotation.types";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    ),
  }
);

async function loadLogoDataUrl(): Promise<string> {
  const res = await fetch(`${window.location.origin}${DEFAULT_COMPANY.logoUrl}`);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

interface PdfActionsProps {
  quotation: Quotation;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function PdfActions({ quotation, variant = "outline", size = "sm" }: PdfActionsProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [logoDataUrl, setLogoDataUrl] = useState<string>("");

  useEffect(() => {
    loadLogoDataUrl()
      .then(setLogoDataUrl)
      .catch(() => setLogoDataUrl(""));
  }, []);

  const generateBlob = async () => {
    const { pdf } = await import("@react-pdf/renderer");
    const logo = logoDataUrl || (await loadLogoDataUrl());
    const doc = <QuotationPDFDocument quotation={quotation} logoSrc={logo} />;
    return pdf(doc).toBlob();
  };

  const handleDownload = async () => {
    setLoading("download");
    try {
      const blob = await generateBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${quotation.quotationNumber}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(null);
    }
  };

  const handlePrint = async () => {
    setLoading("print");
    try {
      const blob = await generateBlob();
      const url = URL.createObjectURL(blob);
      const printWindow = window.open(url);
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant={variant}
          size={size}
          onClick={() => setPreviewOpen(true)}
        >
          <Eye className="h-4 w-4" />
          Preview
        </Button>
        <Button
          type="button"
          variant={variant}
          size={size}
          onClick={handleDownload}
          disabled={loading === "download"}
        >
          {loading === "download" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Download
        </Button>
        <Button
          type="button"
          variant={variant}
          size={size}
          onClick={handlePrint}
          disabled={loading === "print"}
        >
          {loading === "print" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Printer className="h-4 w-4" />
          )}
          Print
        </Button>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-5xl h-[85vh] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle>PDF Preview — {quotation.quotationNumber}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 h-[calc(85vh-80px)]">
            {logoDataUrl ? (
              <PDFViewer width="100%" height="100%" showToolbar>
                <QuotationPDFDocument quotation={quotation} logoSrc={logoDataUrl} />
              </PDFViewer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
