/**
 * Generate a UUID that works in all environments (browser, Node.js, build time)
 * Falls back to a simple UUID v4 implementation if crypto.randomUUID is not available
 */
export function generateUUID(): string {
  // Try to use crypto.randomUUID if available (modern browsers and Node.js 19+)
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    try {
      return crypto.randomUUID();
    } catch (e) {
      // Fall through to fallback implementation
    }
  }

  // Fallback: Simple UUID v4 implementation
  // This works in all environments including during Next.js build
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

