import { useCallback, useMemo, useRef } from "react";
import type {
  TaskUpdateEventDetail,
  TaskDraggedEventDetail,
  TaskResizedEventDetail,
} from "apexgantt";
import type { GanttEventHandlers, GanttEventName } from "../events";
import { GANTT_EVENTS, activeGanttEvents, callGanttHandler } from "../events";

/**
 * What `useGanttEvents` returns: a stable `on*` callback for every handler
 * you passed (spread it onto `<ApexGanttChart>`), plus the three original
 * `handle*` names.
 */
export type UseGanttEventsResult = GanttEventHandlers & {
  /** @deprecated Use `onTaskUpdate`, which this hook also returns. */
  handleTaskUpdate: (detail: TaskUpdateEventDetail) => void;
  /** @deprecated Use `onTaskDragged`, which this hook also returns. */
  handleTaskDragged: (detail: TaskDraggedEventDetail) => void;
  /** @deprecated Use `onTaskResized`, which this hook also returns. */
  handleTaskResized: (detail: TaskResizedEventDetail) => void;
};

/**
 * Wraps chart event handlers in callbacks whose identity never changes while
 * the same set of handlers is passed. Each callback calls the latest handler.
 *
 * `<ApexGanttChart>` already reads its handlers through a ref, so inline
 * handlers never re-subscribe or update the chart and this hook is not
 * needed for that. Use it when the handlers also go to memoised children,
 * or into effect dependencies, where a stable identity matters.
 *
 * Accepts every prop of {@link GanttEventHandlers}, one per chart event.
 *
 * @example
 * ```tsx
 * const events = useGanttEvents({
 *   onTaskDragged: (d) => save(d.taskId, d.newStartTime, d.newEndTime),
 *   onHistoryChange: (d) => setCanUndo(d.canUndo),
 * });
 * <ApexGanttChart tasks={tasks} {...events} />
 * ```
 */
export function useGanttEvents(handlers: GanttEventHandlers): UseGanttEventsResult {
  const handlersRef = useRef(handlers);

  // keep handlers up to date
  handlersRef.current = handlers;

  // rebuilt only when a handler is added or removed
  const active = activeGanttEvents(handlers).join(" ");
  const stable = useMemo(() => {
    const out: Record<string, (detail: unknown) => void> = {};
    if (active) {
      (active.split(" ") as GanttEventName[]).forEach((name) => {
        out[GANTT_EVENTS[name].prop] = (detail) => callGanttHandler(handlersRef.current, name, detail);
      });
    }
    return out as GanttEventHandlers;
  }, [active]);

  const handleTaskUpdate = useCallback((detail: TaskUpdateEventDetail) => {
    handlersRef.current.onTaskUpdate?.(detail);
  }, []);

  const handleTaskDragged = useCallback((detail: TaskDraggedEventDetail) => {
    handlersRef.current.onTaskDragged?.(detail);
  }, []);

  const handleTaskResized = useCallback((detail: TaskResizedEventDetail) => {
    handlersRef.current.onTaskResized?.(detail);
  }, []);

  return useMemo(
    () => ({ ...stable, handleTaskUpdate, handleTaskDragged, handleTaskResized }),
    [stable, handleTaskUpdate, handleTaskDragged, handleTaskResized],
  );
}
