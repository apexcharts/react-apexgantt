export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
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
  if (typeof window !== "undefined" && (window as any).ApexGantt) {
    (window as any).ApexGantt.setLicense(licenseKey);
  }
}
