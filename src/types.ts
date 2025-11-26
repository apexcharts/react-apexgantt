import type {
  GanttUserOptions,
  TaskInput,
  TaskUpdateEventDetail,
  TaskUpdateSuccessEventDetail,
  TaskUpdateErrorEventDetail,
  TaskValidationErrorEventDetail,
  TaskDraggedEventDetail,
  TaskResizedEventDetail,
  ViewMode,
  ThemeMode,
} from "apexgantt";
import ApexGantt from "apexgantt";

export interface ApexGanttChartProps {
  // core data
  tasks: TaskInput[];

  // configuration
  options?: Omit<GanttUserOptions, "series">;

  // convenience props (override options if provided)
  width?: string | number;
  height?: string | number;
  viewMode?: ViewMode;
  theme?: ThemeMode;

  // event handlers
  onTaskUpdate?: (detail: TaskUpdateEventDetail) => void;
  onTaskUpdateSuccess?: (detail: TaskUpdateSuccessEventDetail) => void;
  onTaskUpdateError?: (detail: TaskUpdateErrorEventDetail) => void;
  onTaskValidationError?: (detail: TaskValidationErrorEventDetail) => void;
  onTaskDragged?: (detail: TaskDraggedEventDetail) => void;
  onTaskResized?: (detail: TaskResizedEventDetail) => void;

  // styling
  className?: string;
  style?: React.CSSProperties;
}

export interface ApexGanttHandle {
  // public methods exposed via ref
  update: (options: GanttUserOptions) => void;
  updateTask: (taskId: string, taskData: Partial<TaskInput>) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  destroy: () => void;
  getInstance: () => ApexGantt | null;
}
