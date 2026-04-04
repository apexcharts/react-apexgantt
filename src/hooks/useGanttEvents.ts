import { useCallback, useRef } from "react";
import type { GanttEventMap } from "apexgantt";

interface UseGanttEventsOptions {
  onTaskUpdate?: (detail: GanttEventMap['taskUpdate']['detail']) => void;
  onTaskDragged?: (detail: GanttEventMap['taskDragged']['detail']) => void;
  onTaskResized?: (detail: GanttEventMap['taskResized']['detail']) => void;
}

/**
 * custom hook to manage gantt event handlers with proper memoization
 */
export function useGanttEvents(options: UseGanttEventsOptions) {
  const optionsRef = useRef(options);

  // keep options up to date
  optionsRef.current = options;

  const handleTaskUpdate = useCallback((detail: GanttEventMap['taskUpdate']['detail']) => {
    optionsRef.current.onTaskUpdate?.(detail);
  }, []);

  const handleTaskDragged = useCallback((detail: GanttEventMap['taskDragged']['detail']) => {
    optionsRef.current.onTaskDragged?.(detail);
  }, []);

  const handleTaskResized = useCallback((detail: GanttEventMap['taskResized']['detail']) => {
    optionsRef.current.onTaskResized?.(detail);
  }, []);

  return {
    handleTaskUpdate,
    handleTaskDragged,
    handleTaskResized,
  };
}
