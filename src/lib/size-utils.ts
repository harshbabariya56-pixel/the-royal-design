/**
 * Normalize smart quotes and separators for size parsing.
 */
function normalizeSizeInput(value: string): string {
  return value
    .trim()
    .replace(/[‘’‛‹›]/g, "'")
    .replace(/[“”„«»]/g, '"')
    .replace(/[×✕✖*]/g, "x")
    .replace(/\s+/g, " ");
}

/**
 * Parse a feet-inches value into decimal feet.
 * Supports:
 * - 10'6", 10' 6", 10'-6", 10ft 6in
 * - 10.6  (Indian style: feet.inches → 10'6")
 * - 10.5  (true decimal feet when fraction > 11 or has more precision)
 * - 10
 */
export function parseFeetInches(value: string): number | null {
  const raw = normalizeSizeInput(value).toLowerCase();
  if (!raw) return null;

  // 10'6" | 10'-6" | 10' 6" | 10 ft 6 in
  const ftInMatch = raw.match(
    /^(\d+)\s*(?:'|ft|feet)?\s*-?\s*(?:(\d+)\s*(?:"|in|inch|inches)?)?$/i
  );
  if (ftInMatch && (raw.includes("'") || /ft|feet|in|inch|"/.test(raw))) {
    const feet = parseInt(ftInMatch[1], 10);
    const inches = ftInMatch[2] ? parseInt(ftInMatch[2], 10) : 0;
    if (inches >= 12) return null;
    return feet + inches / 12;
  }

  // Plain number or feet.inches / decimal feet
  if (/^\d+(\.\d+)?$/.test(raw)) {
    if (!raw.includes(".")) {
      return parseFloat(raw);
    }

    const [feetPart, fracPart] = raw.split(".");
    const feet = parseInt(feetPart, 10);
    const fracNum = parseInt(fracPart, 10);

    // Indian convention: 10.6 => 10 feet 6 inches (single/double digit inches 0–11)
    if (fracPart.length <= 2 && fracNum >= 0 && fracNum <= 11) {
      return feet + fracNum / 12;
    }

    // Otherwise treat as true decimal feet (e.g. 10.5, 10.75)
    return parseFloat(raw);
  }

  // Fallback: 10'6 without requiring quote chars already handled above
  const loose = raw.match(/^(\d+)\s*[^\d]+?\s*(\d+)$/);
  if (loose) {
    const feet = parseInt(loose[1], 10);
    const inches = parseInt(loose[2], 10);
    if (inches < 12) return feet + inches / 12;
  }

  return null;
}

/**
 * Split size string into length / width parts.
 */
export function splitSize(size: string): { length: string; width: string } {
  const raw = normalizeSizeInput(size);
  if (!raw) return { length: "", width: "" };

  const parts = raw.split(/\s*x\s*/i);
  if (parts.length >= 2) {
    return { length: parts[0].trim(), width: parts.slice(1).join("x").trim() };
  }
  return { length: raw, width: "" };
}

export function joinSize(length: string, width: string): string {
  const l = length.trim();
  const w = width.trim();
  if (l && w) return `${l} x ${w}`;
  return l || w;
}

/**
 * Parse size like `10'6" x 8'0"`, `10.6x8`, `12 x 10` into square feet.
 */
export function parseSizeToSqFt(size: string): number | null {
  const { length, width } = splitSize(size);
  if (!length || !width) return null;

  const l = parseFeetInches(length);
  const w = parseFeetInches(width);
  if (l === null || w === null || l <= 0 || w <= 0) return null;

  return Math.round(l * w * 100) / 100;
}

/**
 * Amount = Qty × Sq.Ft × Rate (if sqFt > 0), else Qty × Rate
 */
export function calculateRowAmount(quantity: number, sqFt: number, rate: number): number {
  const area = sqFt > 0 ? sqFt : 1;
  return Math.round(quantity * area * rate);
}
