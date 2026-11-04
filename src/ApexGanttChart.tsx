import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import ApexGantt from 'apexgantt';
import type { GanttUserOptions } from 'apexgantt';
import type { ApexGanttChartProps, ApexGanttHandle } from './types';
import type { GanttEventHandlers, GanttEventName } from './events';
import { activeGanttEvents, subscribeGanttEvents } from './events';
import type { ChartInputs } from './utils';
import { resolveOptions, updatePayload } from './utils';

const ApexGanttChart = forwardRef<ApexGanttHandle, ApexGanttChartProps>((props, ref) => {
  const { tasks, options, width, height, pixelsPerDay, theme, className, style } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ApexGantt | null>(null);

  // what the chart was last given, so only what changed is sent
  const prevRef = useRef<ChartInputs | null>(null);

  // Latest handlers, read at dispatch time, so a new function identity on
  // every render never needs a re-subscribe.
  const handlersRef = useRef<GanttEventHandlers>(props);
  useEffect(() => {
    handlersRef.current = props;
  });

  // Listen only to events that have a handler. `subscribed` changes when a
  // handler prop is added or removed, and the cleanup then removes every
  // listener (as it does on unmount). Declared before the chart is created so
  // events fired by its first render are not missed.
  const subscribed = activeGanttEvents(props).join(' ');
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !subscribed) return;
    return subscribeGanttEvents(
      container,
      subscribed.split(' ') as GanttEventName[],
      () => handlersRef.current,
      () => chartRef.current?.getInstanceId(),
    );
  }, [subscribed]);

  useImperativeHandle(
    ref,
    () => ({
      update: (newOptions) => {
        // apexgantt 3.20.0 types update() with Partial<GanttUserOptions>;
        // older typings require `series`, which the core never needed.
        chartRef.current?.update(newOptions as GanttUserOptions);
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
        chartRef.current = null;
      },
      getInstance: () => chartRef.current,
    }),
    [],
  );

  // create the chart once
  useEffect(() => {
    if (!containerRef.current) return;

    const resolved = resolveOptions(options, width, height, pixelsPerDay, theme);
    chartRef.current = new ApexGantt(containerRef.current, {
      ...resolved,
      series: tasks,
    } as GanttUserOptions);
    chartRef.current.render();
    prevRef.current = { tasks, resolved };

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // On a prop change, send only what changed. `series` goes only when `tasks`
  // changed (or the parsing config that reads it), so edits made in the chart
  // survive an unrelated update from apexgantt 3.20.0 on. A theme change also
  // carries the theme colours set in `options`, which the core would
  // otherwise reset to the new theme's defaults.
  useEffect(() => {
    const prev = prevRef.current;
    if (!chartRef.current || !prev) return;

    const next: ChartInputs = {
      tasks,
      resolved: resolveOptions(options, width, height, pixelsPerDay, theme),
    };
    const delta = updatePayload(prev, next);

    prevRef.current = next;
    if (Object.keys(delta).length === 0) return;

    // every key comes from `options`, a shortcut prop or `series`
    chartRef.current.update(delta as unknown as GanttUserOptions);
  }, [tasks, options, width, height, pixelsPerDay, theme]);

  return <div ref={containerRef} className={className} style={style} />;
});

ApexGanttChart.displayName = 'ApexGanttChart';

export default ApexGanttChart;
