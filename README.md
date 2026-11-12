# React Gantt Chart Component: react-apexgantt

A React Gantt chart component for interactive project timelines. Render tasks, dependencies, milestones, critical path, and baselines as a fully drag-and-drop schedule, with props-driven configuration, typed event callbacks for every chart event, a `useGanttData` hook, and React 16.8+ support.

📚 **Documentation:** [apexcharts.com/apexgantt/docs](https://apexcharts.com/apexgantt/docs/) · 🎬 **Live demos:** [apexcharts.com/apexgantt/demos](https://apexcharts.com/apexgantt/demos/) · 📦 **npm:** [react-apexgantt](https://www.npmjs.com/package/react-apexgantt) · 📖 **Guide:** [React Gantt Chart](https://apexcharts.com/react-gantt-chart/) · 🌐 **Part of** [ApexGantt](https://apexcharts.com/apexgantt/): one Gantt component for JavaScript, React, Angular, and Vue.

## Features

- Task dependencies (FS, SS, FF, SF) and milestones
- Critical path highlighting
- Baselines (planned vs actual)
- Continuous zoom with `pixelsPerDay`: the header levels, from minutes to years, follow automatically
- Drag-and-drop scheduling, resizing and progress editing
- Light and dark themes
- Localization: a Japanese locale pack, timeline header formats, week start and fiscal years (apexgantt 3.22.0 and later)
- A typed callback prop for every chart event, plus `useGanttData` and `useGanttEvents` hooks
- TypeScript type definitions

## Installation

Install the wrapper alongside the `apexgantt` core engine:

```bash
npm install react-apexgantt apexgantt
# or
yarn add react-apexgantt apexgantt
```

`apexgantt` is a peer dependency and must be version 3.20.0 or later.

## Licence key

ApexGantt is included in the Premium plan and above and has no free tier. Without a key it renders with a trial watermark for evaluation.

Set your licence key once at application start, before the first chart renders:

```tsx
// main.tsx or index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { setApexGanttLicense } from "react-apexgantt";
import App from "./App";

setApexGanttLicense("your-licence-key");

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
```

A key set later still removes the watermark from charts already on the page; setting it first avoids a one-frame watermark.

## Quick Start

```tsx
import React from "react";
import { ApexGanttChart } from "react-apexgantt";

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

function App() {
  return <ApexGanttChart tasks={tasks} pixelsPerDay={25.7} height="500px" />;
}
```

## API Reference

### Props

| Prop           | Type                                | Description |
| -------------- | ----------------------------------- | ----------- |
| `tasks`        | `TaskInput[]`                       | Tasks to display. Sent to the chart as `series` only when it changed (see [How prop changes reach the chart](#how-prop-changes-reach-the-chart)). |
| `options`      | `Omit<GanttUserOptions, "series">`  | ApexGantt configuration options. |
| `width`        | `string \| number`                  | Chart width. Overrides `options.width`. |
| `height`       | `string \| number`                  | Chart height. Overrides `options.height`. |
| `pixelsPerDay` | `number`                            | Continuous zoom level in pixels per day. The header levels follow from it: `0.5` years, `1.6` quarters, `4.9` months, `25.7` weeks, `80` days. When omitted, the chart fits the data span. Overrides `options.pixelsPerDay`. |
| `theme`        | `'light' \| 'dark' \| string`       | Colour theme, or the name of a registered theme (from ApexGantt 3.21.0). Overrides `options.theme`. Left unset, the chart is light, or follows the dark variant of an Ignite UI theme (see [Using with Ignite UI](#using-with-ignite-ui)). |
| `className`    | `string`                            | CSS class name for the wrapper `<div>`. |
| `style`        | `CSSProperties`                     | Inline styles for the wrapper `<div>`. |
| `ref`          | `Ref<ApexGanttHandle>`              | Imperative handle, see [Ref methods](#ref-methods). |
| `on*`          | `(detail) => void`                  | One callback per chart event, see [Events](#events). |

### How prop changes reach the chart

On every render the component compares the props with the ones the chart last received, and calls the core `update()` with only what changed:

- `series` is sent only when `tasks` changed (or when `options.parsing`, which reads it, changed).
- `width`, `height`, `pixelsPerDay`, `theme` and each key of `options` are sent only when their own value changed. A key you remove is sent as `undefined`, which resets it to its default.
- A theme change (the `theme` prop or `options.theme`) also sends the current value of every theme colour set in `options`. From apexgantt 3.20.0 a theme switch resets the colours the theme owns to the new theme's defaults unless the same update passes them, so this keeps a custom `barBackgroundColor` through a light/dark toggle. The theme colours are `annotationBgColor`, `annotationBorderColor`, `arrowColor`, `backgroundColor`, `barBackgroundColor`, `barTextColor`, `borderColor`, `cellBorderColor`, `criticalArrowColor`, `criticalBarColor`, `crosshairColor`, `fontColor`, `headerBackground`, `milestoneColor`, `rowBackgroundColors`, `summaryBarColor`, `tooltipBGColor` and `tooltipBorderColor`; every other option carries over a theme switch on its own.
- When nothing changed, nothing is sent.

The comparison is deep, so a new array or object with the same contents does not count as a change. Functions compare by identity: an inline `tooltipTemplate`, renderer or `beforeTaskUpdate` hook is a new function on every render and is resent every time. Define callbacks at module scope or with `useCallback`, and build `options` objects that hold them with `useMemo`, so a re-render of the parent does not update the chart. Memoising `tasks` also turns the comparison into an identity check.

From apexgantt 3.20.0, an `update()` without `series` keeps the user's edits: drags, resizes, inline and dialog edits, `updateTask`, `addTask`, `deleteTask`, `moveTask` and dependency changes all survive a theme switch, a zoom change or any other option change. A changed `tasks` array replaces the chart's data and clears its undo history. If you copy every edit back into the `tasks` you pass, each copy resends the whole series; to keep undo working, keep `tasks` as the data you load and read the current state from the chart (`getInstance()?.getTasks()` and `getInstance()?.getDependencies()` from apexgantt 3.20.0, see [Saving the chart](#saving-the-chart)).

### Events

Every event the chart dispatches has a callback prop. Each callback receives the event's typed `detail`; the detail types are exported from `react-apexgantt`.

| Prop                      | Core event              | Detail type                       | Fires when |
| ------------------------- | ----------------------- | --------------------------------- | ---------- |
| `onTaskUpdate`            | `taskUpdate`            | `TaskUpdateEventDetail`           | An edit is being committed, before `taskUpdateSuccess`. |
| `onTaskUpdateSuccess`     | `taskUpdateSuccess`     | `TaskUpdateSuccessEventDetail`    | An edit was applied. |
| `onTaskUpdateError`       | `taskUpdateError`       | `TaskUpdateErrorEventDetail`      | An edit failed to apply. |
| `onTaskValidationError`   | `taskValidationError`   | `TaskValidationErrorEventDetail`  | The task edit dialog failed validation. |
| `onTaskAdded`             | `taskAdded`             | `TaskAddedEventDetail`            | A task was inserted. |
| `onTaskDeleted`           | `taskDeleted`           | `TaskDeletedEventDetail`          | A task was removed (once per task in a cascading delete). |
| `onTaskMoved`             | `taskMoved`             | `TaskMovedEventDetail`            | A task was moved to a new parent. |
| `onDependencyAdded`       | `dependencyAdded`       | `DependencyChangeEventDetail`     | A dependency link was created. |
| `onDependencyRemoved`     | `dependencyRemoved`     | `DependencyChangeEventDetail`     | A dependency link was removed. |
| `onTaskDragged`           | `taskDragged`           | `TaskDraggedEventDetail`          | A bar was dropped at a new position. |
| `onTaskResized`           | `taskResized`           | `TaskResizedEventDetail`          | A bar was resized by one of its handles. |
| `onTaskProgressChanged`   | `taskProgressChanged`   | `TaskProgressChangedEventDetail`  | The in-bar progress handle was dragged to a new value. |
| `onSelectionChange`       | `selectionChange`       | `SelectionChangeEventDetail`      | The set of selected rows changed (needs `enableSelection`). |
| `onDependencyArrowUpdate` | `dependencyArrowUpdate` | `DependencyArrowUpdateDetail`     | Internal redraw signal: an arrow's path was recomputed because a task it connects moved, on every frame of a drag. Not a create or remove notification; use `onDependencyAdded` and `onDependencyRemoved` for those. |
| `onHistoryChange`         | `historyChange`         | `HistoryChangeEventDetail`        | The undo/redo stack changed (record, undo, redo or clear). |
| `onSortChange`            | `sortChange`            | `SortChangeEventDetail`           | The active sort changed (API or column header click). |
| `onFilterChange`          | `filterChange`          | `FilterChangeEventDetail`         | The active filter changed. |
| `onGroupChange`           | `groupChange`           | `GroupChangeEventDetail`          | The active grouping changed. |
| `onColumnResize`          | `columnResize`          | `ColumnResizeEventDetail`         | A task-list column was resized (header drag or API). |
| `onColumnReorder`         | `columnReorder`         | `ColumnReorderEventDetail`        | Task-list columns were reordered (header drag or API). |

From apexgantt 3.20.0, `taskUpdate` and `taskUpdateSuccess` fire once per committed edit on every edit path (drag, resize, progress drag, dialog, inline edit, keyboard, `updateTask`), and their detail carries a `source` field naming the path. They do not fire for undo/redo or for `updateTask(id, updates, { silent: true })`. `taskDragged`, `taskResized` and `taskProgressChanged` fire only after the edit is accepted by `beforeTaskUpdate`. An app that saves on both `onTaskDragged` and `onTaskUpdateSuccess` therefore saves each drag twice: save on one of them.

The component listens only to the events you pass a callback for. Callbacks are read when the event fires, so inline arrow functions are fine: a new function on each render neither re-subscribes nor updates the chart. Removing a callback prop removes its listener, and unmounting removes them all.

```tsx
<ApexGanttChart
  tasks={tasks}
  options={{ enableTaskDrag: true }}
  onTaskUpdateSuccess={(detail) => save(detail.taskId, detail.updatedTask)}
  onHistoryChange={(detail) => setCanUndo(detail.canUndo)}
/>
```

### Ref methods

```tsx
import { useRef } from "react";
import { ApexGanttChart, type ApexGanttHandle } from "react-apexgantt";

const ganttRef = useRef<ApexGanttHandle>(null);
<ApexGanttChart ref={ganttRef} tasks={tasks} />;
```

| Method                          | Description |
| ------------------------------- | ----------- |
| `update(options)`               | Merge `Partial<GanttUserOptions>` into the chart and re-render. Pass only the keys to change. Without `series` the user's edits are kept (apexgantt 3.20.0 and later); with `series` the data is replaced and undo history cleared. The object goes to the chart as it is: when you switch `theme` this way, include any custom theme colours, or they go back to the theme's defaults. The next prop change is still compared with the previous props, not with what you passed here. |
| `updateTask(taskId, data)`      | Update one task with a partial set of fields. |
| `zoomIn()`                      | Zoom in one step. |
| `zoomOut()`                     | Zoom out one step. |
| `destroy()`                     | Destroy the chart. Prop changes are no longer forwarded; remount the component to get a new chart. |
| `getInstance()`                 | The underlying `ApexGantt` instance, or `null` before mount and after `destroy()`. |

Every other core method is on `getInstance()`, for example `scrollToTask`, `addTask`, `deleteTask`, `moveTask`, `addDependency`, `canAddDependency`, `undo`, `redo`, `clearHistory`, `sort`, `filter`, `groupBy`, `getSelectedTasks` and `exportChart`. apexgantt 3.20.0 adds `getTask`, `getTasks`, `getDependencies`, `expandTask` and `collapseTask`.

```tsx
ganttRef.current?.getInstance()?.scrollToTask("task-2");
```

### Saving the chart

To save the chart as the user left it, read it from the instance: `getTasks()` returns every task with its edits, and `getDependencies()` returns every link as it is now (`{ fromId, toId, type, lag }`), including links added with `addDependency()` or drawn by the user, less any removed. A task's `dependency` holds only the link it was loaded with, so save both rather than rebuilding the links from `onDependencyAdded` and `onDependencyRemoved`. Both need apexgantt 3.20.0.

```tsx
import type { DependencyLink } from "apexgantt";

const save = () => {
  const gantt = ganttRef.current?.getInstance();
  if (gantt) saveChart({ tasks: gantt.getTasks(), links: gantt.getDependencies() });
};

// once the saved tasks are rendered (passed as `tasks`)
const restoreLinks = (links: DependencyLink[]) => {
  const gantt = ganttRef.current?.getInstance();
  if (!gantt) return;
  for (const { fromId, toId, type, lag } of links) {
    // the links the tasks carry are already there and are not accepted again
    if (gantt.canAddDependency(fromId, toId).ok) gantt.addDependency(fromId, toId, { type, lag });
  }
  gantt.clearHistory(); // so the restore cannot be undone
};
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

The result is memoised on `data` and `parsing`, so keep both stable (state, `useMemo` or module scope) to avoid parsing on every render.

### useGanttEvents

Wraps event callbacks in functions whose identity stays the same across renders while the same set of callbacks is passed; each one calls your latest callback. It accepts every `on*` prop from the [Events](#events) table and returns the same keys, ready to spread onto the chart:

```tsx
import { useGanttEvents } from "react-apexgantt";

const events = useGanttEvents({
  onTaskDragged: (detail) => save(detail.taskId, detail.newStartTime, detail.newEndTime),
  onHistoryChange: (detail) => setCanUndo(detail.canUndo),
});

<ApexGanttChart tasks={tasks} {...events} />;
```

`<ApexGanttChart>` already reads its callbacks when an event fires, so the hook is not needed to stop re-subscribing. Use it when the same callbacks also go to memoised children or into effect dependencies. The result also carries the earlier names `handleTaskUpdate`, `handleTaskDragged` and `handleTaskResized`, now deprecated in favour of the matching `on*` keys.

## Using with Ignite UI

From ApexGantt 3.21.0 the chart can follow an Ignite UI theme loaded on the page: bars, text, gridlines, the header, the tooltip, the font, and light or dark. The theming is a free add-on in the `apexgantt` package. Import it once, before the first chart renders:

```tsx
// main.tsx
import "apexgantt/ignite-ui";
```

Without a bundler, load `apexgantt.ignite-ui.min.js` with a script tag, before or after `apexgantt.min.js`.

- Leave `theme` and `backgroundColor` unset (the `theme` prop and both keys in `options`) to follow the Ignite UI variant: a dark Ignite UI theme gives the chart its dark colours. A `theme` or `backgroundColor` you set wins over the variant.
- `theme` also takes the name of a theme registered with `registerTheme` from the `apex-commons` package (`import { registerTheme } from 'apex-commons'`). The registry is shared by every Apex product on the page; the ApexGantt README ("Named themes") lists the tokens a theme can set.
- An option you pass, an `--apex-gantt-*` variable and an `--apx-*` token all win over the Ignite UI tokens.
- `options={{ designSystem: false }}` turns the add-on off for one chart; `options={{ tokens: false }}` stops the chart reading the `--apx-*` tokens and the design system.
- There is no `refreshTokens()`: the chart reads the tokens each time it renders, so after swapping the Ignite UI stylesheet call `ganttRef.current?.getInstance()?.render()` (any prop change that updates the chart does the same).

## Localization

From apexgantt 3.22.0 the chart takes a locale pack, timeline header formats, a week start and a fiscal year. They are ordinary options, passed in `options` with no wrapper release needed. The peer range still accepts apexgantt 3.20.0 and 3.21.0, so upgrade the core to use them: 3.22.0 or later, and 3.23.0 or later for the behaviour described below.

### Locale packs

A locale pack sets a whole language at once: every message, the month and weekday names, the header word order, `YYYY/MM/DD` dates in the task list and tooltips, and Monday weeks. apexgantt ships a Japanese pack (`ja`, `status: 'reviewed'` since 3.23.1) in its own file, so the core bundle does not carry it:

```tsx
import { ApexGanttChart } from "react-apexgantt";
import ja from "apexgantt/locales/ja"; // or: import { ja } from "apexgantt/locales/ja";

<ApexGanttChart tasks={tasks} options={{ locale: { pack: ja } }} />;
```

The pack is the base layer: every `locale.*` and `calendar.*` option you set wins over it, so `locale: { pack: ja, messages: { addTask: "追加" } }` changes one message and keeps the rest of the pack.

### Week start and fiscal years

On its own the `ja` pack shows calendar years (`2026年`, January to December) and calendar quarters. For 年度 labels add the fiscal year yourself; April suits most Japanese organizations:

```tsx
const options = {
  locale: { pack: ja },
  calendar: { fiscalYearStartMonth: 4 }, // 2026年度 = April 2026 to March 2027
};
```

The year row then reads `2026年度` and the quarters count from April. `calendar: { weekStart: 0 }` replaces the pack's Monday weeks with Sunday weeks. A `calendar` that holds only `weekStart` and `fiscalYearStartMonth` shapes the header and does not turn the working calendar on: every day stays a working day. (The 3.22.0 `ja` pack set an April fiscal year itself; from 3.23.0 it leaves that to you.)

### Timeline header formats

`locale.timelineHeaderFormat` replaces the labels of the header's top and sub rows, one zoom tier at a time (`minute`, `hour`, `halfday`, `day`, `week`, `month`, `quarter`, `year`). A row is a dayjs pattern string, or an array of candidates gated by cell width: each cell uses the widest candidate whose `minWidth` fits. Rows in the `fiscal` block (apexgantt 3.23.0 and later) are used instead of the same rows only while a fiscal year is in use:

```tsx
const options = {
  locale: {
    timelineHeaderFormat: {
      year: { top: "YYYY年", sub: "YYYY年" },
      quarter: { sub: [{ minWidth: 96, format: "第{fq}四半期" }, { format: "{fq}[Q]" }] },
      week: { sub: "M/D～" },
      fiscal: { year: { top: "{fy}年度", sub: "{fy}年度" } },
    },
  },
};
```

`{fy}` and `{fq}` are the fiscal year and quarter while a fiscal year is in use, and the calendar year and quarter otherwise. A bare `Q` is the calendar quarter token, so a literal Q is escaped as `[Q]`: `"{fq}Q"` prints `11`, `22`. A row you set wins over the pack's; a row you leave unset keeps the pack's label, or the built-in one. These are the rows the `ja` pack ships, so over the pack set only the rows you change, for example `locale: { pack: ja, timelineHeaderFormat: { week: { sub: "M/D～{end:M/D}" } } }`.

### Keeping options stable

The component compares `options` deeply (see [How prop changes reach the chart](#how-prop-changes-reach-the-chart)), so a pack, a `calendar` and pattern strings written inline in JSX are equal on every render and send nothing. Functions compare by identity: a label function in `timelineHeaderFormat`, a function in `locale.messages` or a `calendar.holidayTooltip`, written inline, is a new function on every render, so the whole `locale` is sent and the chart re-renders on every parent render. Define such functions at module scope, or build the `options` that hold them with `useMemo`. Better still, use pattern strings, and template strings for messages (`editTaskTitle: "編集: {name}"`), which are plain data and need neither.

### Switching language at run time

Pass a new `options` object; only what changed is sent:

```tsx
<ApexGanttChart tasks={tasks} options={{ locale: { pack: lang === "ja" ? ja : undefined } }} />
```

`pack: undefined` returns the chart to English. The chart merges `locale` key by key, so a key you leave out of the new `locale` keeps its earlier value: set it to `undefined` as well (`messages: undefined`), or remove `locale` from `options`, which resets all of it. Remove `calendar` the same way to drop the fiscal year and your week start.

See [Locale packs](https://apexcharts.com/apexgantt/docs/localization/#Locale-packs) for every pack field and the precedence rules, `locale.tag`, `dateLocale` and right-to-left layout, and the [React localization docs](https://apexcharts.com/apexgantt/docs/react-apexgantt/#Localization).

## TypeScript

All types are exported from `react-apexgantt`: the options and task model (`GanttUserOptions`, `TaskInput`, `Task`, and more), the event map (`GanttEventMap`), every detail type in the [Events](#events) table, and the wrapper's own `ApexGanttChartProps`, `ApexGanttHandle`, `GanttEventHandlers`, `GanttEventName` and `UseGanttEventsResult`. The enums `TaskType`, `Orientation` and `ColumnKey` are exported as values, so `type: TaskType.Milestone` works. The locale types (`GanttLocalePack`, `TimelineHeaderFormat`, `CalendarOptions`, `GanttMessagesInput`) are imported from `apexgantt` 3.22.0 and later.

## Testing Examples Locally

To test the examples and verify the wrapper works correctly:

```bash
# 1. Build the package first
npm run build

# 2. Set up and run the test app
cd test-app
npm install
npm run dev
```

The test app will be available at `http://localhost:5173`

The test app includes:

- **Basic Example**: Simple Gantt with zoom controls
- **Advanced Example**: Data parsing, zoom level (`pixelsPerDay`) and theme toggle
- **Events Example**: Interactive testing of drag, resize, progress and history events

## Framework wrappers

Using a different framework? Use the dedicated wrapper. All of them share the same core engine and task data model:

- **JavaScript**: [`apexgantt`](https://www.npmjs.com/package/apexgantt) ([GitHub](https://github.com/apexcharts/apexgantt))
- **Angular**: [`ngx-apexgantt`](https://www.npmjs.com/package/ngx-apexgantt) ([GitHub](https://github.com/apexcharts/ngx-apexgantt))
- **Vue**: [`vue-apexgantt`](https://www.npmjs.com/package/vue-apexgantt) ([GitHub](https://github.com/apexcharts/vue-apexgantt))

## Licence

ApexGantt is included in the Premium plan and above and has no free tier. Without a key it renders with a trial watermark for evaluation. See [LICENSE.md](LICENSE.md) for the terms and [apexcharts.com/pricing](https://apexcharts.com/pricing/) for plans.

## About

A React wrapper for [ApexGantt](https://github.com/apexcharts/apexgantt), part of the [ApexCharts](https://apexcharts.com/) family: a Gantt chart component for JavaScript, React, Angular, and Vue with one consistent API across every framework wrapper.
