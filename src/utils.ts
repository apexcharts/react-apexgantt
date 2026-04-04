export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const objA = a as Record<string, unknown>;
  const objB = b as Record<string, unknown>;
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(objA[key], objB[key])) return false;
  }

  return true;
}

/**
 * sets the ApexGantt license key globally
 * should be called once at app initialization, before rendering any charts
 *
 * @param licenseKey - the license key string provided by ApexGantt
 *
 * @example
 * ```tsx
 * import { setApexGanttLicense } from 'react-apexgantt';
 *
 * // call this at the top of your app, before rendering any charts
 * setApexGanttLicense('your-license-key-here');
 * ```
 */
export function setApexGanttLicense(licenseKey: string): void {
  if (typeof window !== "undefined" && (window as { ApexGantt?: { setLicense: (key: string) => void } }).ApexGantt) {
    (window as { ApexGantt?: { setLicense: (key: string) => void } }).ApexGantt!.setLicense(licenseKey);
  }
}
