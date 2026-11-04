import type { GanttUserOptions, TaskInput } from "apexgantt";
import type { ApexGanttChartProps } from "./types";

/** Chart options as the component last resolved them, without `series`. */
export type ResolvedOptions = Record<string, unknown>;

/**
 * `options` with the shortcut props applied over it, without `series`
 * (which always comes from `tasks`).
 */
export function resolveOptions(
  options: ApexGanttChartProps["options"],
  width: ApexGanttChartProps["width"],
  height: ApexGanttChartProps["height"],
  pixelsPerDay: ApexGanttChartProps["pixelsPerDay"],
  theme: ApexGanttChartProps["theme"],
): ResolvedOptions {
  const resolved: ResolvedOptions = { ...options };
  delete resolved.series;
  if (width !== undefined) resolved.width = width;
  if (height !== undefined) resolved.height = height;
  if (pixelsPerDay !== undefined) resolved.pixelsPerDay = pixelsPerDay;
  if (theme !== undefined) resolved.theme = theme;
  return resolved;
}

/**
 * The colour options a theme owns. When `update()` switches the theme
 * (apexgantt 3.20.0 and later), each of these that the same call does not
 * pass goes back to the new theme's default. Kept in step with the core's
 * theme defaults table.
 */
export const THEME_COLOR_KEYS = [
  "annotationBgColor",
  "annotationBorderColor",
  "arrowColor",
  "backgroundColor",
  "barBackgroundColor",
  "barTextColor",
  "borderColor",
  "cellBorderColor",
  "criticalArrowColor",
  "criticalBarColor",
  "crosshairColor",
  "fontColor",
  "headerBackground",
  "milestoneColor",
  "rowBackgroundColors",
  "summaryBarColor",
  "tooltipBGColor",
  "tooltipBorderColor",
] as const satisfies ReadonlyArray<keyof GanttUserOptions>;

/** What the chart was last given: its tasks and its resolved options. */
export interface ChartInputs {
  tasks: TaskInput[];
  resolved: ResolvedOptions;
}

/**
 * What a prop change sends to `update()`: the option keys whose value
 * changed, and `series` when `tasks` (or the `parsing` config that reads it)
 * changed. An empty object means there is nothing to send.
 *
 * When the theme changes, the current value of every theme colour set in
 * `options` goes with it, so a custom colour survives a light/dark toggle
 * instead of going back to the theme default. A colour that changed or was
 * removed in the same render is sent as it now is.
 */
export function updatePayload(prev: ChartInputs, next: ChartInputs): Record<string, unknown> {
  const delta = changedKeys(prev.resolved, next.resolved);
  if ("theme" in delta) {
    for (const key of THEME_COLOR_KEYS) {
      if (!(key in delta) && next.resolved[key] !== undefined) {
        delta[key] = next.resolved[key];
      }
    }
  }
  if ("parsing" in delta || !deepEqual(prev.tasks, next.tasks)) delta.series = next.tasks;
  return delta;
}

function isPlainObject(value: object): boolean {
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

/**
 * Structural equality for props: arrays index by index, plain objects key by
 * key, `Date`s by time. Functions and other non-plain objects (class
 * instances, Maps, DOM nodes) compare by identity, so a change is never
 * missed; at worst it is resent.
 */
export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") return false;

  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  if (Array.isArray(b)) return false;

  if (a instanceof Date || b instanceof Date) {
    return a instanceof Date && b instanceof Date && a.getTime() === b.getTime();
  }
  if (!isPlainObject(a) || !isPlainObject(b)) return false;

  const objA = a as Record<string, unknown>;
  const objB = b as Record<string, unknown>;
  const keysA = Object.keys(objA);
  if (keysA.length !== Object.keys(objB).length) return false;

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(objB, key)) return false;
    if (!deepEqual(objA[key], objB[key])) return false;
  }
  return true;
}

/**
 * The keys whose value differs between `prev` and `next`, each with its
 * `next` value. A key present in `prev` but gone from `next` maps to
 * `undefined`, which `ApexGantt.update()` treats as "reset to the default".
 */
export function changedKeys(
  prev: Record<string, unknown>,
  next: Record<string, unknown>,
): Record<string, unknown> {
  const delta: Record<string, unknown> = {};
  const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
  keys.forEach((key) => {
    if (!deepEqual(prev[key], next[key])) delta[key] = next[key];
  });
  return delta;
}

/**
 * Sets the ApexGantt licence key for every chart on the page.
 *
 * ApexGantt is included in the Premium plan and above and has no free tier.
 * Without a key it renders with a trial watermark for evaluation.
 *
 * Set your licence key once at application start, before the first chart
 * renders. A key set later still removes the watermark from charts already
 * on the page; setting it first avoids a one-frame watermark.
 *
 * @param licenseKey - the licence key issued for your plan
 *
 * @example
 * ```tsx
 * import { setApexGanttLicense } from 'react-apexgantt';
 *
 * setApexGanttLicense('your-licence-key');
 * ```
 */
export function setApexGanttLicense(licenseKey: string): void {
  if (typeof window !== "undefined" && (window as { ApexGantt?: { setLicense: (key: string) => void } }).ApexGantt) {
    (window as { ApexGantt?: { setLicense: (key: string) => void } }).ApexGantt!.setLicense(licenseKey);
  }
}
