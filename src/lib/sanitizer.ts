/**
 * Security Sanitization Utilities for Studio Kloche & Co.
 * Mitigates XSS injection, tag manipulation, and script execution.
 */

export function sanitizeString(val: string): string {
  if (typeof val !== "string") return val;
  return val
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .replace(/`/g, "&#x60;");
}

/**
 * Recursively scans and sanitizes structures containing string values.
 */
export function sanitizeData<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === "string") {
    return sanitizeString(data) as unknown as T;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeData(item)) as unknown as T;
  }

  if (typeof data === "object") {
    const sanitizedObj: any = {};
    for (const [key, val] of Object.entries(data)) {
      sanitizedObj[key] = sanitizeData(val);
    }
    return sanitizedObj as T;
  }

  return data;
}
