import React, { useRef, useState } from 'react';
import {
  ApexGanttChart,
  ApexGanttHandle,
  useGanttData,
  ViewMode,
} from 'react-apexgantt';

const AdvancedExample: React.FC = () => {
  const ganttRef = useRef<ApexGanttHandle>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Week);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // example with data parsing
  const rawData = [
    {
      task_id: 'T1',
      task_name: 'Planning Phase',
      start: '2024-01-01',
      end: '2024-01-10',
      completion: 100,
    },
    {
      task_id: 'T2',
      task_name: 'Development',
      start: '2024-01-11',
      end: '2024-01-25',
      completion: 60,
      depends_on: 'T1',
    },
    {
      task_id: 'T3',
      task_name: 'Frontend',
      start: '2024-01-11',
      end: '2024-01-18',
      completion: 80,
      parent_task: 'T2',
    },
    {
      task_id: 'T4',
      task_name: 'Backend',
      start: '2024-01-19',
      end: '2024-01-25',
      completion: 40,
      parent_task: 'T2',
    },
  ];

  const tasks = useGanttData({
    data: rawData,
    parsing: {
      id: 'task_id',
      name: 'task_name',
      startTime: 'start',
      endTime: 'end',
      progress: 'completion',
      dependency: 'depends_on',
      parentId: 'parent_task',
    },
  });

  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2>Advanced Features</h2>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          Data parsing, view mode switching, and theme toggle
        </p>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div>
            <label style={{ marginRight: '8px' }}>View Mode:</label>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as ViewMode)}
            >
              <option value={ViewMode.Day}>Day</option>
              <option value={ViewMode.Week}>Week</option>
              <option value={ViewMode.Month}>Month</option>
              <option value={ViewMode.Quarter}>Quarter</option>
              <option value={ViewMode.Year}>Year</option>
            </select>
          </div>

          <div>
            <label style={{ marginRight: '8px' }}>Theme:</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value as any)}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <button onClick={() => ganttRef.current?.zoomIn()}>Zoom In</button>
          <button onClick={() => ganttRef.current?.zoomOut()}>Zoom Out</button>
        </div>
      </div>

      <ApexGanttChart
        ref={ganttRef}
        tasks={tasks}
        viewMode={viewMode}
        theme={theme}
        height="500px"
        options={{
          enableTaskDrag: true,
          enableTaskResize: true,
        }}
      />
    </div>
  );
};

export default AdvancedExample;