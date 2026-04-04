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
  TaskType,
  TaskDependency,
  DependencyType,
  BaselineInput,
  BaselineOptions,
  ParsingConfig,
  ParsingValue,

  // Annotations
  Annotation,
  Orientation,

  // Toolbar
  ToolbarItem,
  ToolbarButton,
  ToolbarSelect,
  ToolbarSeparator,
  ToolbarContext,
  ColumnListItem,

  // Typed event map and detail interfaces
  GanttEventMap,
  TaskUpdateEventDetail,
  TaskUpdateSuccessEventDetail,
  TaskUpdateErrorEventDetail,
  TaskValidationErrorEventDetail,
  TaskDraggedEventDetail,
  TaskResizedEventDetail,
  SelectionChangeEventDetail,
  DependencyArrowUpdateDetail,
} from "apexgantt";

// Value re-exports (needed at runtime)
export {
  ApexGantt,
  ViewMode,
  ColumnKey,
  ColumnList,
  GanttEvents,
  LightTheme,
  DarkTheme,
  getTheme,
  DataParser,
} from "apexgantt";

// Wrapper-specific types
export type { ApexGanttChartProps, ApexGanttHandle } from "./types";
