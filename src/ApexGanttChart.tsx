import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import ApexGantt, { GanttEvents } from 'apexgantt';
import type { TaskInput, GanttUserOptions, ViewMode, ThemeMode } from 'apexgantt';
import type { ApexGanttChartProps, ApexGanttHandle } from './types';
import { deepEqual } from './utils';

const ApexGanttChart = forwardRef<ApexGanttHandle, ApexGanttChartProps>(
  (
    {
      tasks,
      options = {},
      width,
      height,
      viewMode,
      theme,
      onTaskUpdate,
      onTaskUpdateSuccess,
      onTaskUpdateError,
      onTaskValidationError,
      onTaskDragged,
      onTaskResized,
      className,
      style,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<ApexGantt | null>(null);

    // store previous props for comparison
    const prevPropsRef = useRef<{
      tasks: TaskInput[];
      options: Omit<GanttUserOptions, 'series'>;
      width: string | number | undefined;
      height: string | number | undefined;
      viewMode: ViewMode | undefined;
      theme: ThemeMode | undefined;
    } | null>(null);

    const eventHandlersRef = useRef({
      onTaskUpdate,
      onTaskUpdateSuccess,
      onTaskUpdateError,
      onTaskValidationError,
      onTaskDragged,
      onTaskResized,
    });

    // keep event handlers up to date
    useEffect(() => {
      eventHandlersRef.current = {
        onTaskUpdate,
        onTaskUpdateSuccess,
        onTaskUpdateError,
        onTaskValidationError,
        onTaskDragged,
        onTaskResized,
      };
    });

    // expose methods via ref
    useImperativeHandle(
      ref,
      () => ({
        update: (newOptions) => {
          chartRef.current?.update(newOptions);
        },
        updateTask: (taskId, taskData) => {
          chartRef.current?.updateTask(taskId, taskData);
        },
        zoomIn: () => {
          chartRef.current?.zoomIn();
        },
        zoomOut: () => {
          chartRef.current?.zoomOut();
        },
        destroy: () => {
          chartRef.current?.destroy();
        },
        getInstance: () => chartRef.current,
      }),
      []
    );

    // initialize chart
    useEffect(() => {
      if (!containerRef.current) return;

      const ganttOptions = {
        ...options,
        series: tasks,
        ...(width !== undefined && { width }),
        ...(height !== undefined && { height }),
        ...(viewMode !== undefined && { viewMode }),
        ...(theme !== undefined && { theme }),
      };

      chartRef.current = new ApexGantt(containerRef.current, ganttOptions);
      chartRef.current.render();

      // store initial props
      prevPropsRef.current = { tasks, options, width, height, viewMode, theme };

      const container = containerRef.current;

      const taskUpdateHandler = (e: Event) => {
        const customEvent = e as CustomEvent<any>;
        eventHandlersRef.current.onTaskUpdate?.(customEvent.detail);
      };

      const taskUpdateSuccessHandler = (e: Event) => {
        const customEvent = e as CustomEvent<any>;
        eventHandlersRef.current.onTaskUpdateSuccess?.(customEvent.detail);
      };

      const taskUpdateErrorHandler = (e: Event) => {
        const customEvent = e as CustomEvent<any>;
        eventHandlersRef.current.onTaskUpdateError?.(customEvent.detail);
      };

      const taskValidationErrorHandler = (e: Event) => {
        const customEvent = e as CustomEvent<any>;
        eventHandlersRef.current.onTaskValidationError?.(customEvent.detail);
      };

      const taskDraggedHandler = (e: Event) => {
        const customEvent = e as CustomEvent<any>;
        eventHandlersRef.current.onTaskDragged?.(customEvent.detail);
      };

      const taskResizedHandler = (e: Event) => {
        const customEvent = e as CustomEvent<any>;
        eventHandlersRef.current.onTaskResized?.(customEvent.detail);
      };

      container.addEventListener(GanttEvents.TASK_UPDATE, taskUpdateHandler);
      container.addEventListener(GanttEvents.TASK_UPDATE_SUCCESS, taskUpdateSuccessHandler);
      container.addEventListener(GanttEvents.TASK_UPDATE_ERROR, taskUpdateErrorHandler);
      container.addEventListener(GanttEvents.TASK_VALIDATION_ERROR, taskValidationErrorHandler);
      container.addEventListener(GanttEvents.TASK_DRAGGED, taskDraggedHandler);
      container.addEventListener(GanttEvents.TASK_RESIZED, taskResizedHandler);

      return () => {
        container.removeEventListener(GanttEvents.TASK_UPDATE, taskUpdateHandler);
        container.removeEventListener(GanttEvents.TASK_UPDATE_SUCCESS, taskUpdateSuccessHandler);
        container.removeEventListener(GanttEvents.TASK_UPDATE_ERROR, taskUpdateErrorHandler);
        container.removeEventListener(GanttEvents.TASK_VALIDATION_ERROR, taskValidationErrorHandler);
        container.removeEventListener(GanttEvents.TASK_DRAGGED, taskDraggedHandler);
        container.removeEventListener(GanttEvents.TASK_RESIZED, taskResizedHandler);

        chartRef.current?.destroy();
        chartRef.current = null;
      };
    }, []);

    // handle prop updates - only call update() when props actually change
    useEffect(() => {
      if (!chartRef.current || !prevPropsRef.current) return;

      const prev = prevPropsRef.current;

      // check if anything actually changed
      const tasksChanged = !deepEqual(prev.tasks, tasks);
      const optionsChanged = !deepEqual(prev.options, options);
      const widthChanged = prev.width !== width;
      const heightChanged = prev.height !== height;
      const viewModeChanged = prev.viewMode !== viewMode;
      const themeChanged = prev.theme !== theme;

      if (!tasksChanged && !optionsChanged && !widthChanged && !heightChanged && !viewModeChanged && !themeChanged) {
        return;
      }

      // update stored props
      prevPropsRef.current = { tasks, options, width, height, viewMode, theme };

      const ganttOptions = {
        ...options,
        series: tasks,
        ...(width !== undefined && { width }),
        ...(height !== undefined && { height }),
        ...(viewMode !== undefined && { viewMode }),
        ...(theme !== undefined && { theme }),
      };

      chartRef.current.update(ganttOptions);
    }, [tasks, options, width, height, viewMode, theme]);

    return (
      <div
        ref={containerRef}
        className={className}
        style={style}
      />
    );
  }
);

ApexGanttChart.displayName = 'ApexGanttChart';

export default ApexGanttChart;