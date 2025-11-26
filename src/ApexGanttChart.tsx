import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import ApexGantt, { GanttEvents } from 'apexgantt';
import type { ApexGanttChartProps, ApexGanttHandle } from './types';

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
    const eventHandlersRef = useRef({
      onTaskUpdate,
      onTaskUpdateSuccess,
      onTaskUpdateError,
      onTaskValidationError,
      onTaskDragged,
      onTaskResized,
    });

    // keep event handlers up to date without triggering re-renders
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

      // merge convenience props with options
      const ganttOptions = {
        ...options,
        series: tasks,
        ...(width !== undefined && { width }),
        ...(height !== undefined && { height }),
        ...(viewMode !== undefined && { viewMode }),
        ...(theme !== undefined && { theme }),
      };

      // create chart instance
      chartRef.current = new ApexGantt(containerRef.current, ganttOptions);
      chartRef.current.render();

      // setup event listeners
      const container = containerRef.current;
      const handlers = eventHandlersRef.current;

      const taskUpdateHandler = (e: Event) => {
        const customEvent = e as CustomEvent<any>;
        handlers.onTaskUpdate?.(customEvent.detail);
      };

      const taskUpdateSuccessHandler = (e: Event) => {
        const customEvent = e as CustomEvent<any>;
        handlers.onTaskUpdateSuccess?.(customEvent.detail);
      };

      const taskUpdateErrorHandler = (e: Event) => {
        const customEvent = e as CustomEvent<any>;
        handlers.onTaskUpdateError?.(customEvent.detail);
      };

      const taskValidationErrorHandler = (e: Event) => {
        const customEvent = e as CustomEvent<any>;
        handlers.onTaskValidationError?.(customEvent.detail);
      };

      const taskDraggedHandler = (e: Event) => {
        const customEvent = e as CustomEvent<any>;
        handlers.onTaskDragged?.(customEvent.detail);
      };

      const taskResizedHandler = (e: Event) => {
        const customEvent = e as CustomEvent<any>;
        handlers.onTaskResized?.(customEvent.detail);
      };

      container.addEventListener(GanttEvents.TASK_UPDATE, taskUpdateHandler);
      container.addEventListener(GanttEvents.TASK_UPDATE_SUCCESS, taskUpdateSuccessHandler);
      container.addEventListener(GanttEvents.TASK_UPDATE_ERROR, taskUpdateErrorHandler);
      container.addEventListener(GanttEvents.TASK_VALIDATION_ERROR, taskValidationErrorHandler);
      container.addEventListener(GanttEvents.TASK_DRAGGED, taskDraggedHandler);
      container.addEventListener(GanttEvents.TASK_RESIZED, taskResizedHandler);

      // cleanup
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
    }, []); // only run once on mount

    // handle updates to tasks and options
    useEffect(() => {
      if (!chartRef.current) return;

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