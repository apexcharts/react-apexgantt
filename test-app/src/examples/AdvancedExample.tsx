import React, { useRef, useState } from 'react';
import {
  ApexGanttChart,
  ApexGanttHandle,
  ParsingConfig,
  useGanttData,
} from 'react-apexgantt';

// Zoom is continuous: the header levels follow from pixels per day.
const ZOOM_LEVELS = [
  { label: 'Days', pixelsPerDay: 80 },
  { label: 'Weeks', pixelsPerDay: 25.7 },
  { label: 'Months', pixelsPerDay: 4.9 },
  { label: 'Quarters', pixelsPerDay: 1.6 },
  { label: 'Years', pixelsPerDay: 0.5 },
];

// Module-scope data and options keep one identity across renders, so
// useGanttData parses once and the prop comparison is an identity check.
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

const parsing: ParsingConfig = {
  id: 'task_id',
  name: 'task_name',
  startTime: 'start',
  endTime: 'end',
  progress: 'completion',
  dependency: 'depends_on',
  parentId: 'parent_task',
};

const chartOptions = {
  enableTaskDrag: true,
  enableTaskResize: true,
};

const AdvancedExample: React.FC = () => {
  const ganttRef = useRef<ApexGanttHandle>(null);
  const [pixelsPerDay, setPixelsPerDay] = useState(25.7);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const tasks = useGanttData({ data: rawData, parsing });

  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2>Advanced Features</h2>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          Data parsing, zoom level and theme toggle. Drag a bar, then change the
          zoom or theme: only that option is sent, so the edit stays.
        </p>

        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div>
            <label style={{ marginRight: '8px' }}>Zoom:</label>
            <select
              value={pixelsPerDay}
              onChange={(e) => setPixelsPerDay(Number(e.target.value))}
            >
              {ZOOM_LEVELS.map((level) => (
                <option key={level.label} value={level.pixelsPerDay}>
                  {level.label} ({level.pixelsPerDay} px/day)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ marginRight: '8px' }}>Theme:</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
            >
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
        pixelsPerDay={pixelsPerDay}
        theme={theme}
        height="500px"
        options={chartOptions}
      />
    </div>
  );
};

export default AdvancedExample;
