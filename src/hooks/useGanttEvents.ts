import { useCallback, useRef } from "react";
import type {
  TaskUpdateEventDetail,
  TaskDraggedEventDetail,
  TaskResizedEventDetail,
} from "apexgantt";

interface UseGanttEventsOptions {
  onTaskUpdate?: (detail: TaskUpdateEventDetail) => void;
  onTaskDragged?: (detail: TaskDraggedEventDetail) => void;
  onTaskResized?: (detail: TaskResizedEventDetail) => void;
}

/**
 * custom hook to manage gantt event handlers with proper memoization
 */
export function useGanttEvents(options: UseGanttEventsOptions) {
  const optionsRef = useRef(options);

  // keep options up to date
  optionsRef.current = options;

  const handleTaskUpdate = useCallback((detail: TaskUpdateEventDetail) => {
    optionsRef.current.onTaskUpdate?.(detail);
  }, []);

  const handleTaskDragged = useCallback((detail: TaskDraggedEventDetail) => {
    optionsRef.current.onTaskDragged?.(detail);
  }, []);

  const handleTaskResized = useCallback((detail: TaskResizedEventDetail) => {
    optionsRef.current.onTaskResized?.(detail);
  }, []);

  return {
    handleTaskUpdate,
    handleTaskDragged,
    handleTaskResized,
  };
}
