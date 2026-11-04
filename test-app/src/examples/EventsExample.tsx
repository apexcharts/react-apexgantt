import React, { useRef, useState } from 'react';
import {
  ApexGanttChart,
  TaskInput,
  TaskDraggedEventDetail,
  TaskResizedEventDetail,
  TaskUpdateSuccessEventDetail,
  TaskProgressChangedEventDetail,
  HistoryChangeEventDetail,
} from 'react-apexgantt';

interface EventLog {
  id: number;
  type: string;
  message: string;
  timestamp: string;
}

const tasks: TaskInput[] = [
  {
    id: 'task-1',
    name: 'Project Planning',
    startTime: '01-01-2024',
    endTime: '01-08-2024',
    progress: 75,
  },
  {
    id: 'task-2',
    name: 'Development',
    startTime: '01-09-2024',
    endTime: '01-20-2024',
    progress: 40,
    dependency: 'task-1',
  },
  {
    id: 'task-3',
    name: 'Testing',
    startTime: '01-21-2024',
    endTime: '01-28-2024',
    progress: 20,
    dependency: 'task-2',
  },
];

const chartOptions = {
  enableTaskDrag: true,
  enableTaskResize: true,
  enableTaskEdit: true,
};

const EventsExample: React.FC = () => {
  const [eventLogs, setEventLogs] = useState<EventLog[]>([]);
  // one edit fires several events in the same millisecond, so ids come from a counter
  const nextLogId = useRef(0);

  // Inline handlers are fine: the chart reads them at dispatch time, so a new
  // identity on every render neither re-subscribes nor updates the chart.
  const addLog = (type: string, message: string) => {
    const log: EventLog = {
      id: nextLogId.current++,
      type,
      message,
      timestamp: new Date().toLocaleTimeString(),
    };
    setEventLogs((prev) => [log, ...prev].slice(0, 10)); // keep last 10 logs
  };

  const handleTaskDragged = (detail: TaskDraggedEventDetail) => {
    addLog(
      'drag',
      `Task ${detail.taskId} moved ${detail.daysMoved} days (${detail.newStartTime} → ${detail.newEndTime})`
    );
  };

  const handleTaskResized = (detail: TaskResizedEventDetail) => {
    addLog(
      'resize',
      `Task ${detail.taskId} resized by ${detail.durationChange} days using ${detail.resizeHandle} handle`
    );
  };

  const handleTaskUpdateSuccess = (detail: TaskUpdateSuccessEventDetail) => {
    addLog('update', `Task ${detail.taskId} updated successfully`);
  };

  const handleTaskProgressChanged = (detail: TaskProgressChangedEventDetail) => {
    addLog('progress', `Task ${detail.taskId} progress ${detail.oldProgress}% → ${detail.newProgress}%`);
  };

  const handleHistoryChange = (detail: HistoryChangeEventDetail) => {
    addLog('history', `History ${detail.kind}: ${detail.undoSize} undo, ${detail.redoSize} redo`);
  };

  const clearLogs = () => {
    setEventLogs([]);
  };

  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2>Events & Interactions</h2>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          Try dragging tasks, resizing them by their handles, or dragging the progress handle
        </p>
      </div>

      <ApexGanttChart
        tasks={tasks}
        pixelsPerDay={25.7}
        theme="light"
        height="400px"
        onTaskDragged={handleTaskDragged}
        onTaskResized={handleTaskResized}
        onTaskUpdateSuccess={handleTaskUpdateSuccess}
        onTaskProgressChanged={handleTaskProgressChanged}
        onHistoryChange={handleHistoryChange}
        options={chartOptions}
      />

      <div style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3>Event Log</h3>
          <button onClick={clearLogs}>Clear Log</button>
        </div>

        <div
          style={{
            maxHeight: '300px',
            overflow: 'auto',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            padding: '10px',
          }}
        >
          {eventLogs.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
              No events yet. Try interacting with the Gantt chart above.
            </p>
          ) : (
            eventLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  padding: '10px',
                  marginBottom: '8px',
                  background: '#f5f5f5',
                  borderRadius: '4px',
                  borderLeft: `3px solid ${log.type === 'drag' ? '#4caf50' : log.type === 'resize' ? '#ff9800' : '#2196f3'
                    }`,
                }}
              >
                <div style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>
                  {log.timestamp} • {log.type.toUpperCase()}
                </div>
                <div style={{ fontSize: '13px', color: '#333' }}>{log.message}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsExample;