# React Gantt Chart Component — react-apexgantt

A React Gantt chart component for interactive project timelines. Render tasks, dependencies, milestones, critical path, and baselines as a fully drag-and-drop schedule — with props-driven configuration, typed event callbacks, a `useGanttData` hook, and React 16.8+ support.

📚 **Documentation:** [apexcharts.com/apexgantt/docs](https://apexcharts.com/apexgantt/docs/) · 🎬 **Live demos:** [apexcharts.com/apexgantt/demos](https://apexcharts.com/apexgantt/demos/) · 📦 **npm:** [react-apexgantt](https://www.npmjs.com/package/react-apexgantt) · 📖 **Guide:** [React Gantt Chart](https://apexcharts.com/react-gantt-chart/) · 🌐 **Part of** [ApexGantt](https://apexcharts.com/apexgantt/) — one Gantt component for JavaScript, React, Angular, and Vue.

## Features

- Task dependencies and milestones
- Critical path highlighting
- Baselines (planned vs actual)
- Multiple view modes: day, week, month, quarter, year
- Drag-and-drop scheduling
- Light and dark themes
- Typed event callbacks and a `useGanttData` hook
- TypeScript type definitions

## Installation

Install the wrapper alongside the `apexgantt` core engine:

```bash
npm install react-apexgantt apexgantt
# or
yarn add react-apexgantt apexgantt
```

## License Setup

If you have a commercial license, set it once at app initialization before rendering any charts:

```tsx
import { setApexGanttLicense } from "react-apexgantt";

// call this at the top of your app
setApexGanttLicense("your-license-key-here");
```

**Example with React app entry point:**

```tsx
// main.tsx or index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { setApexGanttLicense } from "react-apexgantt";
import App from "./App";

// set license before rendering
setApexGanttLicense("your-license-key-here");

ReactDOM.createRoot(document.getElementById("root")!).render();
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
| `onTaskUpdate`            | `(detail) => void` | Fired when a task is being updated (before completion) |
| `onTaskUpdateSuccess`     | `(detail) => void` | Fired after successful task update          |
| `onTaskUpdateError`       | `(detail) => void` | Fired when a task update fails              |
| `onTaskValidationError`   | `(detail) => void` | Fired when task form validation fails       |
| `onTaskDragged`           | `(detail) => void` | Fired when a task is dragged                |
| `onTaskResized`           | `(detail) => void` | Fired when a task is resized                |
| `onSelectionChange`       | `(detail) => void` | Fired when the set of selected tasks changes |
| `onDependencyArrowUpdate` | `(detail) => void` | Fired when a dependency arrow is created, moved, or deleted |

### Ref Methods

```tsx
const ganttRef = useRef<ApexGanttHandle>(null);

// Available methods
ganttRef.current?.update(options);
ganttRef.current?.updateTask(taskId, data);
ganttRef.current?.zoomIn();
ganttRef.current?.zoomOut();
ganttRef.current?.destroy();
ganttRef.current?.getInstance();
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

## Framework wrappers

Using a different framework? Use the dedicated wrapper — all share the same core engine and task data model:

- **JavaScript** — [`apexgantt`](https://www.npmjs.com/package/apexgantt) ([GitHub](https://github.com/apexcharts/apexgantt))
- **Angular** — [`ngx-apexgantt`](https://www.npmjs.com/package/ngx-apexgantt) ([GitHub](https://github.com/apexcharts/ngx-apexgantt))
- **Vue** — [`vue-apexgantt`](https://www.npmjs.com/package/vue-apexgantt) ([GitHub](https://github.com/apexcharts/vue-apexgantt))

## License

See [LICENSE](LICENSE) for details. Commercial licenses available at [apexcharts.com/pricing](https://apexcharts.com/pricing/).

## About

A React wrapper for [ApexGantt](https://github.com/apexcharts/apexgantt) — part of the [ApexCharts](https://apexcharts.com/) family, a Gantt chart component for JavaScript, React, Angular, and Vue with one consistent API across every framework wrapper.
