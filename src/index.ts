export { default as ApexGanttChart } from "./ApexGanttChart";
export { useGanttEvents } from "./hooks/useGanttEvents";
export { useGanttData } from "./hooks/useGanttData";
export { setApexGanttLicense } from "./utils";

// Type-only re-exports from apexgantt (zero runtime cost)
export type {
  // Options
  GanttUserOptions,
  GanttTheme,
  ThemeMode,

  // Task model
  TaskInput,
  Task,
  TaskDependency,
  DependencyType,
  BaselineInput,
  BaselineOptions,
  ParsingConfig,
  ParsingValue,

  // Annotations
  Annotation,

  // Toolbar
  ToolbarItem,
  ToolbarButton,
  ToolbarSelect,
  ToolbarSeparator,
  ToolbarContext,
  ColumnListItem,

  // Typed event map and one detail type per event
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

// Value re-exports (needed at runtime). TaskType and Orientation are enums,
// so they are values: `type: TaskType.Milestone` needs the runtime object.
export {
  ApexGantt,
  ColumnKey,
  ColumnList,
  GanttEvents,
  LightTheme,
  DarkTheme,
  getTheme,
  DataParser,
  TaskType,
  Orientation,
} from "apexgantt";

// Wrapper-specific types
export type { ApexGanttChartProps, ApexGanttHandle } from "./types";
export type { GanttEventHandlers, GanttEventName } from "./events";
export type { UseGanttEventsResult } from "./hooks/useGanttEvents";
