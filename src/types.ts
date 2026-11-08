import type { GanttUserOptions, TaskInput } from "apexgantt";
import type ApexGantt from "apexgantt";
import type { GanttEventHandlers } from "./events";

/**
 * Props for the `<ApexGanttChart>` React component.
 *
 * Pass `tasks` and an optional `options` object to render a Gantt chart.
 * Convenience props (`width`, `height`, `pixelsPerDay`, `theme`) override the
 * matching fields in `options` when both are provided.
 *
 * On a re-render the component calls the core `update()` with only what
 * changed: `series` only when `tasks` changed, and only the option keys whose
 * value changed. Functions compare by identity, so memoise `options` objects
 * that hold callbacks (`useMemo`, `useCallback` or module scope) to avoid
 * resending them on every render.
 *
 * Every `on*` callback receives the typed event detail; see
 * {@link GanttEventHandlers} for one prop per chart event.
 */
export interface ApexGanttChartProps extends GanttEventHandlers {
  /**
   * Tasks to render. Compared deeply between renders: a changed array is
   * sent to the chart as `series`, which replaces its data and clears undo
   * history. An unchanged array is not resent, so edits made in the chart
   * are kept (apexgantt 3.20.0 and later).
   */
  tasks: TaskInput[];
  /** Chart configuration (everything except `series`, which is derived from `tasks`). */
  options?: Omit<GanttUserOptions, "series">;

  /** Override the chart width. Accepts CSS values (`"100%"`, `800`). */
  width?: string | number;
  /** Override the chart height. Accepts CSS values (`"600px"`, `400`). */
  height?: string | number;
  /**
   * Override the continuous zoom level, in pixels per day. The header levels
   * (year, quarter, month, week, day, hour, minute) follow from this value.
   * Reference points: `0.5` years, `1.6` quarters, `4.9` months, `25.7`
   * weeks, `80` days. When omitted, the chart fits the data span.
   */
  pixelsPerDay?: number;
  /**
   * Override the colour theme: `"light"`, `"dark"`, or the name of a theme
   * registered on the family registry (apexgantt 3.21.0 and later). Leave it
   * out and the chart is light, or follows the dark variant of a design
   * system loaded on the page (the `apexgantt/ignite-ui` add-on). A change
   * also resends the theme colours set in `options` (`barBackgroundColor`
   * and the rest), which a theme switch would otherwise reset to the new
   * theme's defaults (apexgantt 3.20.0 and later).
   */
  theme?: NonNullable<GanttUserOptions["theme"]>;

  /** CSS class name applied to the wrapper `<div>`. */
  className?: string;
  /** Inline styles applied to the wrapper `<div>`. */
  style?: React.CSSProperties;
}

/**
 * Imperative handle returned by `ref` on `<ApexGanttChart>`.
 *
 * Use `React.useRef<ApexGanttHandle>(null)` and pass it as `ref` to access
 * these methods after the chart mounts. Every other core method is
 * available on `getInstance()`.
 *
 * @example
 * ```tsx
 * const ganttRef = useRef<ApexGanttHandle>(null);
 * <ApexGanttChart ref={ganttRef} tasks={tasks} />
 * // later
 * ganttRef.current?.zoomIn();
 * ```
 */
export interface ApexGanttHandle {
  /**
   * Merge the given options into the chart and re-render. Pass only the keys
   * to change. From apexgantt 3.20.0 an update without `series` keeps the
   * user's edits; passing `series` replaces the data and clears undo history.
   * The object is passed through as it is, so a `theme` switched here resets
   * the theme colours it does not also carry.
   */
  update: (options: Partial<GanttUserOptions>) => void;
  /** Update a single task by ID with a partial set of fields. */
  updateTask: (taskId: string, taskData: Partial<TaskInput>) => void;
  /** Zoom in one step on the time scale. */
  zoomIn: () => void;
  /** Zoom out one step on the time scale. */
  zoomOut: () => void;
  /**
   * Destroy the chart instance and clean up DOM and listeners. The component
   * stops forwarding prop changes afterwards; remount it to get a new chart.
   */
  destroy: () => void;
  /**
   * The underlying `ApexGantt` instance, or `null` before mount and after
   * `destroy()`. Use it for every core method the handle does not wrap.
   */
  getInstance: () => ApexGantt | null;
}
