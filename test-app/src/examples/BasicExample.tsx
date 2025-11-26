import React, { useRef } from 'react';
import { ApexGanttChart, ApexGanttHandle, TaskInput, ViewMode } from 'react-apexgantt';

const BasicExample: React.FC = () => {
  const ganttRef = useRef<ApexGanttHandle>(null);

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
      endTime: '01-25-2024',
      progress: 0,
      dependency: 'task-2',
    },
  ];

  const handleZoomIn = () => {
    ganttRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    ganttRef.current?.zoomOut();
  };

  return (
    <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2>Basic Gantt Chart</h2>
        <p style={{ color: '#666', marginBottom: '15px' }}>
          Simple example with zoom controls
        </p>
        <button onClick={handleZoomIn} style={{ marginRight: '10px' }}>
          Zoom In
        </button>
        <button onClick={handleZoomOut}>Zoom Out</button>
      </div>

      <ApexGanttChart
        ref={ganttRef}
        tasks={tasks}
        viewMode={ViewMode.Week}
        theme="light"
        height="400px"
      />
    </div>
  );
};

export default BasicExample;