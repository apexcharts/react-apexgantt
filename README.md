# React ApexGantt

React wrapper for [ApexGantt](https://github.com/apexcharts/apexgantt) - A JavaScript library to create interactive Gantt charts.

## Installation

```bash
npm install react-apexgantt apexgantt
# or
yarn add react-apexgantt apexgantt
```

## Quick Start

```tsx
import React from "react";
import { ApexGanttChart } from "react-apexgantt";

function App() {
  const tasks = [
    {
      id: "task-1",
      name: "Project Planning",
      startTime: "01-01-2024",
      endTime: "01-08-2024",
      progress: 75,
    },
    {
      id: "task-2",
      name: "Development",
      startTime: "01-09-2024",
      endTime: "01-20-2024",
      progress: 40,
      dependency: "task-1",
    },
  ];

  return <ApexGanttChart tasks={tasks} viewMode="week" height="500px" />;
}
```

## API Reference

### Props

| Prop        | Type                | Description                                          |
| ----------- | ------------------- | ---------------------------------------------------- |
| `tasks`     | `TaskInput[]`       | Array of tasks to display                            |
| `options`   | `GanttUserOptions`  | ApexGantt configuration options                      |
| `width`     | `string \| number`  | Chart width                                          |
| `height`    | `string \| number`  | Chart height                                         |
| `viewMode`  | `ViewMode`          | View mode: 'day', 'week', 'month', 'quarter', 'year' |
| `theme`     | `'light' \| 'dark'` | Color theme                                          |
| `className` | `string`            | CSS class name                                       |
| `style`     | `CSSProperties`     | Inline styles                                        |

### Events

| Event                 | Type               | Description                        |
| --------------------- | ------------------ | ---------------------------------- |
| `onTaskUpdate`        | `(detail) => void` | Fired when a task is being updated |
| `onTaskUpdateSuccess` | `(detail) => void` | Fired after successful task update |
| `onTaskDragged`       | `(detail) => void` | Fired when a task is dragged       |
| `onTaskResized`       | `(detail) => void` | Fired when a task is resized       |

### Ref Methods

```tsx
const ganttRef = useRef<ApexGanttHandle>(null);

// Available methods
ganttRef.current?.update(options);
ganttRef.current?.updateTask(taskId, data);
ganttRef.current?.zoomIn();
ganttRef.current?.zoomOut();
ganttRef.current?.destroy();
```

## Custom Hooks

### useGanttData

Parse external data into ApexGantt format:

```tsx
import { useGanttData } from "react-apexgantt";

const tasks = useGanttData({
  data: apiData,
  parsing: {
    id: "task_id",
    name: "task_name",
    startTime: "start_date",
    endTime: "end_date",
  },
});
```

## Testing Examples Locally

To test the examples and verify the wrapper works correctly:

```bash
# 1. Build the package first
npm run build

# 2. Setup and run test app
cd test-app
npm install
npm run dev
```

The test app will be available at `http://localhost:5173`

The test app includes:

- **Basic Example**: Simple Gantt with zoom controls
- **Advanced Example**: Data parsing, view mode switching, theme toggle
- **Events Example**: Interactive testing of drag, resize, and update events
