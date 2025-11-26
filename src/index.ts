export { default as ApexGanttChart } from "./ApexGanttChart";
export { useGanttEvents } from "./hooks/useGanttEvents";
export { useGanttData } from "./hooks/useGanttData";

// re-export types from apexgantt
export type {
  GanttUserOptions,
  TaskInput,
  TaskType,
  ThemeMode,
  Annotation,
  ParsingConfig,
  TaskUpdateEventDetail,
  TaskUpdateSuccessEventDetail,
  TaskUpdateErrorEventDetail,
  TaskValidationErrorEventDetail,
  TaskDraggedEventDetail,
  TaskResizedEventDetail,
} from "apexgantt";

export type { ApexGanttChartProps, ApexGanttHandle } from "./types";

// re-export GanttEvents for direct event listening if needed
export { GanttEvents, ViewMode } from "apexgantt";
