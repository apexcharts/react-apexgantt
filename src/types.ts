import type {
  GanttUserOptions,
  GanttEventMap,
  ViewMode,
  ThemeMode,
  TaskInput,
} from "apexgantt";
import ApexGantt from "apexgantt";

/**
 * Props for the `<ApexGanttChart>` React component.
 *
 * Pass `tasks` and an optional `options` object to render a Gantt chart.
 * Convenience props (`width`, `height`, `viewMode`, `theme`) override the
 * matching fields in `options` when both are provided.
 *
 * All `on*` callbacks receive the typed event detail — see {@link GanttEventMap}
 * for the full event-to-detail mapping.
 */
export interface ApexGanttChartProps {
  /** Array of tasks to render in the chart. */
  tasks: TaskInput[];
  /** Chart configuration (everything except `series`, which is derived from `tasks`). */
  options?: Omit<GanttUserOptions, "series">;

  /** Override the chart width. Accepts CSS values (`"100%"`, `800`). */
  width?: string | number;
  /** Override the chart height. Accepts CSS values (`"600px"`, `400`). */
  height?: string | number;
  /** Override the time-scale view mode (day, week, month, etc.). */
  viewMode?: ViewMode;
  /** Override the color theme (`"light"` or `"dark"`). */
  theme?: ThemeMode;

  /** Fires when a task is being updated (before completion). */
  onTaskUpdate?: (detail: GanttEventMap["taskUpdate"]["detail"]) => void;
  /** Fires after a task update completes successfully. */
  onTaskUpdateSuccess?: (
    detail: GanttEventMap["taskUpdateSuccess"]["detail"],
  ) => void;
  /** Fires when a task update fails with an error. */
  onTaskUpdateError?: (
    detail: GanttEventMap["taskUpdateError"]["detail"],
  ) => void;
  /** Fires when task form validation fails. */
  onTaskValidationError?: (
    detail: GanttEventMap["taskValidationError"]["detail"],
  ) => void;
  /** Fires when a task bar is dragged to a new position. */
  onTaskDragged?: (detail: GanttEventMap["taskDragged"]["detail"]) => void;
  /** Fires when a task bar is resized via its handles. */
  onTaskResized?: (detail: GanttEventMap["taskResized"]["detail"]) => void;
  /** Fires when the set of selected tasks changes. */
  onSelectionChange?: (
    detail: GanttEventMap["selectionChange"]["detail"],
  ) => void;
  /** Fires when a dependency arrow is created, moved, or deleted. */
  onDependencyArrowUpdate?: (
    detail: GanttEventMap["dependencyArrowUpdate"]["detail"],
  ) => void;

  /** CSS class name applied to the wrapper `<div>`. */
  className?: string;
  /** Inline styles applied to the wrapper `<div>`. */
  style?: React.CSSProperties;
}

/**
 * Imperative handle returned by `ref` on `<ApexGanttChart>`.
 *
 * Use `React.useRef<ApexGanttHandle>(null)` and pass it as `ref` to access
 * these methods after the chart mounts.
 *
 * @example
 * ```tsx
 * const ganttRef = useRef<ApexGanttHandle>(null);
 * <ApexGanttChart ref={ganttRef} tasks={tasks} />
 * // later…
 * ganttRef.current?.zoomIn();
 * ```
 */
export interface ApexGanttHandle {
  /** Replace the entire chart configuration and re-render. */
  update: (options: GanttUserOptions) => void;
  /** Update a single task by ID with a partial set of fields. */
  updateTask: (taskId: string, taskData: Partial<TaskInput>) => void;
  /** Zoom in one level on the time scale. */
  zoomIn: () => void;
  /** Zoom out one level on the time scale. */
  zoomOut: () => void;
  /** Destroy the chart instance and clean up DOM / listeners. */
  destroy: () => void;
  /** Access the underlying `ApexGantt` instance (or `null` before mount). */
  getInstance: () => ApexGantt | null;
}
