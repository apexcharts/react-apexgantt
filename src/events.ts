import type {
  GanttEventMap,
  TaskUpdateEventDetail,
  TaskUpdateSuccessEventDetail,
  TaskUpdateErrorEventDetail,
  TaskValidationErrorEventDetail,
  TaskAddedEventDetail,
  TaskDeletedEventDetail,
  TaskMovedEventDetail,
  DependencyChangeEventDetail,
  TaskDraggedEventDetail,
  TaskResizedEventDetail,
  TaskProgressChangedEventDetail,
  SelectionChangeEventDetail,
  DependencyArrowUpdateDetail,
  HistoryChangeEventDetail,
  SortChangeEventDetail,
  FilterChangeEventDetail,
  GroupChangeEventDetail,
  ColumnResizeEventDetail,
  ColumnReorderEventDetail,
} from "apexgantt";

/** Name of an event the chart dispatches, such as `"taskDragged"`. */
export type GanttEventName = keyof GanttEventMap;

/**
 * One optional callback per chart event. Each receives the event's typed
 * `detail`. `<ApexGanttChart>` accepts all of them as props and
 * `useGanttEvents` accepts and returns them.
 *
 * Handlers are read at dispatch time, so passing a new function on every
 * render is fine: it neither re-subscribes nor updates the chart.
 */
export interface GanttEventHandlers {
  /**
   * `taskUpdate`: an edit is being committed, before `taskUpdateSuccess`.
   * From apexgantt 3.20.0 it fires once per committed edit on every path
   * (drag, resize, progress drag, dialog, inline edit, keyboard,
   * `updateTask`) and the detail carries a `source` field naming the path.
   * It does not fire for undo/redo or for `updateTask(..., { silent: true })`.
   */
  onTaskUpdate?: (detail: TaskUpdateEventDetail) => void;
  /**
   * `taskUpdateSuccess`: an edit was applied. Fires on the same paths, with
   * the same `source` field, as `taskUpdate` (apexgantt 3.20.0 and later).
   */
  onTaskUpdateSuccess?: (detail: TaskUpdateSuccessEventDetail) => void;
  /** `taskUpdateError`: an edit failed to apply. */
  onTaskUpdateError?: (detail: TaskUpdateErrorEventDetail) => void;
  /** `taskValidationError`: the task edit dialog failed validation. */
  onTaskValidationError?: (detail: TaskValidationErrorEventDetail) => void;
  /** `taskAdded`: a task was inserted. */
  onTaskAdded?: (detail: TaskAddedEventDetail) => void;
  /**
   * `taskDeleted`: a task was removed. A cascading delete fires once per
   * removed task.
   */
  onTaskDeleted?: (detail: TaskDeletedEventDetail) => void;
  /** `taskMoved`: a task was moved to a new parent. */
  onTaskMoved?: (detail: TaskMovedEventDetail) => void;
  /** `dependencyAdded`: a dependency link was created. */
  onDependencyAdded?: (detail: DependencyChangeEventDetail) => void;
  /** `dependencyRemoved`: a dependency link was removed. */
  onDependencyRemoved?: (detail: DependencyChangeEventDetail) => void;
  /**
   * `taskDragged`: a bar was dropped at a new position. From apexgantt
   * 3.20.0 it fires only after the commit is accepted (`beforeTaskUpdate`
   * did not veto it). An app that saves on both this and
   * `taskUpdateSuccess` saves each drag twice.
   */
  onTaskDragged?: (detail: TaskDraggedEventDetail) => void;
  /**
   * `taskResized`: a bar was resized by one of its handles. From apexgantt
   * 3.20.0 it fires only after the commit is accepted.
   */
  onTaskResized?: (detail: TaskResizedEventDetail) => void;
  /**
   * `taskProgressChanged`: the in-bar progress handle was dragged to a new
   * value. From apexgantt 3.20.0 it fires only after the commit is accepted.
   */
  onTaskProgressChanged?: (detail: TaskProgressChangedEventDetail) => void;
  /** `selectionChange`: the set of selected rows changed (needs `enableSelection`). */
  onSelectionChange?: (detail: SelectionChangeEventDetail) => void;
  /**
   * `dependencyArrowUpdate`: an internal redraw signal. An arrow's path was
   * recomputed because a task it connects moved, which happens on every
   * frame of a drag, so keep this handler cheap. It is not a create or
   * remove notification: use `onDependencyAdded` and `onDependencyRemoved`
   * for those.
   */
  onDependencyArrowUpdate?: (detail: DependencyArrowUpdateDetail) => void;
  /** `historyChange`: the undo/redo stack changed (record, undo, redo or clear). */
  onHistoryChange?: (detail: HistoryChangeEventDetail) => void;
  /** `sortChange`: the active sort changed (API or column header click). */
  onSortChange?: (detail: SortChangeEventDetail) => void;
  /** `filterChange`: the active filter changed. */
  onFilterChange?: (detail: FilterChangeEventDetail) => void;
  /** `groupChange`: the active grouping changed. */
  onGroupChange?: (detail: GroupChangeEventDetail) => void;
  /** `columnResize`: a task-list column was resized (header drag or API). */
  onColumnResize?: (detail: ColumnResizeEventDetail) => void;
  /** `columnReorder`: task-list columns were reordered (header drag or API). */
  onColumnReorder?: (detail: ColumnReorderEventDetail) => void;
}

type HandlerProp<K extends string> = `on${Capitalize<K>}`;

interface EventRow<K extends GanttEventName> {
  /** The prop (and `GanttEventHandlers` key) that receives this event's detail. */
  readonly prop: HandlerProp<K>;
  /**
   * `"root"` for an event the core dispatches on the document (or the shadow
   * root holding the chart) rather than on the chart container. Such events
   * carry `chartInstanceId`, which is matched against the chart's own id.
   */
  readonly target?: "root";
}

/**
 * The one table every subscription is driven from: each core event and the
 * prop that receives it. `satisfies` makes the build fail when the core adds
 * or renames an event and this table was not updated.
 */
export const GANTT_EVENTS = {
  taskUpdate: { prop: "onTaskUpdate" },
  taskUpdateSuccess: { prop: "onTaskUpdateSuccess" },
  taskUpdateError: { prop: "onTaskUpdateError" },
  taskValidationError: { prop: "onTaskValidationError" },
  taskAdded: { prop: "onTaskAdded" },
  taskDeleted: { prop: "onTaskDeleted" },
  taskMoved: { prop: "onTaskMoved" },
  dependencyAdded: { prop: "onDependencyAdded" },
  dependencyRemoved: { prop: "onDependencyRemoved" },
  taskDragged: { prop: "onTaskDragged" },
  taskResized: { prop: "onTaskResized" },
  taskProgressChanged: { prop: "onTaskProgressChanged" },
  selectionChange: { prop: "onSelectionChange" },
  dependencyArrowUpdate: { prop: "onDependencyArrowUpdate", target: "root" },
  historyChange: { prop: "onHistoryChange" },
  sortChange: { prop: "onSortChange" },
  filterChange: { prop: "onFilterChange" },
  groupChange: { prop: "onGroupChange" },
  columnResize: { prop: "onColumnResize" },
  columnReorder: { prop: "onColumnReorder" },
} as const satisfies { readonly [K in GanttEventName]: EventRow<K> };

const EVENT_NAMES = Object.keys(GANTT_EVENTS) as GanttEventName[];

// Compile-time guard: GanttEventHandlers must declare exactly one prop per core
// event, typed with that event's detail. Fails the build when the core adds,
// removes or retypes an event and the interface above was not updated.
type HandlersFromCore = {
  [K in GanttEventName as HandlerProp<K>]?: (detail: GanttEventMap[K]["detail"]) => void;
};
type Equal<A, B> =
  (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
type Expect<T extends true> = T;
type HandlersMatchCore = Expect<Equal<GanttEventHandlers, HandlersFromCore>>;

// Built on the guard so the guard counts as used under `noUnusedLocals`.
type AnyHandler = HandlersMatchCore extends true ? (detail: unknown) => void : never;

/**
 * The events that have a handler in `handlers`, in table order. Used as an
 * effect dependency (joined), so only adding or removing a handler changes
 * the subscription, never a new function identity.
 */
export function activeGanttEvents(handlers: GanttEventHandlers): GanttEventName[] {
  return EVENT_NAMES.filter((name) => typeof handlers[GANTT_EVENTS[name].prop] === "function");
}

/** Calls the current handler for `name`, if there is one. */
export function callGanttHandler(
  handlers: GanttEventHandlers,
  name: GanttEventName,
  detail: unknown,
): void {
  const handler = handlers[GANTT_EVENTS[name].prop] as AnyHandler | undefined;
  handler?.(detail);
}

/**
 * Adds one listener per event in `events` and returns a function that removes
 * every one of them. Handlers are looked up through `getHandlers` at dispatch
 * time, so callers keep them in a ref instead of re-subscribing.
 */
export function subscribeGanttEvents(
  container: HTMLElement,
  events: readonly GanttEventName[],
  getHandlers: () => GanttEventHandlers,
  getInstanceId: () => string | undefined,
): () => void {
  const root = container.getRootNode();
  const removers = events.map((name) => {
    const row: EventRow<GanttEventName> = GANTT_EVENTS[name];
    const target: EventTarget = row.target === "root" ? root : container;
    const listener = (event: Event) => {
      const detail = (event as CustomEvent).detail;
      if (row.target === "root") {
        const id = getInstanceId();
        if (!id || (detail as { chartInstanceId?: string } | null)?.chartInstanceId !== id) return;
      }
      callGanttHandler(getHandlers(), name, detail);
    };
    target.addEventListener(name, listener);
    return () => target.removeEventListener(name, listener);
  });
  return () => removers.forEach((remove) => remove());
}
