import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ApexGanttChart from '../ApexGanttChart';
import type { TaskInput } from 'apexgantt';
import { ViewMode } from 'apexgantt';

// create a proper mock type
interface MockApexGanttInstance {
  render: jest.Mock;
  update: jest.Mock;
  updateTask: jest.Mock;
  zoomIn: jest.Mock;
  zoomOut: jest.Mock;
  destroy: jest.Mock;
}

// mock ApexGantt constructor
const mockApexGanttConstructor = jest.fn<MockApexGanttInstance, [HTMLElement, any]>();

jest.mock('apexgantt', () => {
  return {
    __esModule: true,
    default: mockApexGanttConstructor,
    GanttEvents: {
      TASK_UPDATE: 'taskUpdate',
      TASK_UPDATE_SUCCESS: 'taskUpdateSuccess',
      TASK_UPDATE_ERROR: 'taskUpdateError',
      TASK_VALIDATION_ERROR: 'taskValidationError',
      TASK_DRAGGED: 'taskDragged',
      TASK_RESIZED: 'taskResized',
    },
    ViewMode: {
      Day: 'day',
      Week: 'week',
      Month: 'month',
      Quarter: 'quarter',
      Year: 'year',
    },
  };
});

describe('ApexGanttChart', () => {
  const mockTasks: TaskInput[] = [
    {
      id: 'task-1',
      name: 'Test Task',
      startTime: '01-01-2024',
      endTime: '01-08-2024',
      progress: 50,
    },
  ];

  // default mock instance
  let mockInstance: MockApexGanttInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // create fresh mock instance for each test
    mockInstance = {
      render: jest.fn(),
      update: jest.fn(),
      updateTask: jest.fn(),
      zoomIn: jest.fn(),
      zoomOut: jest.fn(),
      destroy: jest.fn(),
    };

    mockApexGanttConstructor.mockReturnValue(mockInstance);
  });

  it('should render without crashing', () => {
    render(<ApexGanttChart tasks={mockTasks} />);
    expect(mockApexGanttConstructor).toHaveBeenCalled();
  });

  it('should initialize ApexGantt with correct options', () => {
    render(
      <ApexGanttChart
        tasks={mockTasks}
        width="100%"
        height="500px"
        viewMode={ViewMode.Week}
        theme="light"
      />
    );

    expect(mockApexGanttConstructor).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({
        series: mockTasks,
        width: '100%',
        height: '500px',
        viewMode: ViewMode.Week,
        theme: 'light',
      })
    );
  });

  it('should call render on mount', () => {
    render(<ApexGanttChart tasks={mockTasks} />);
    expect(mockInstance.render).toHaveBeenCalled();
  });

  it('should call destroy on unmount', () => {
    const { unmount } = render(<ApexGanttChart tasks={mockTasks} />);
    unmount();

    expect(mockInstance.destroy).toHaveBeenCalled();
  });

  it('should update chart when tasks change', async () => {
    const { rerender } = render(<ApexGanttChart tasks={mockTasks} />);

    const newTasks: TaskInput[] = [
      ...mockTasks,
      {
        id: 'task-2',
        name: 'New Task',
        startTime: '01-09-2024',
        endTime: '01-15-2024',
        progress: 30,
      },
    ];

    rerender(<ApexGanttChart tasks={newTasks} />);

    await waitFor(() => {
      expect(mockInstance.update).toHaveBeenCalledWith(
        expect.objectContaining({
          series: newTasks,
        })
      );
    });
  });

  it('should expose methods via ref', () => {
    const ref = React.createRef<any>();
    render(<ApexGanttChart ref={ref} tasks={mockTasks} />);

    // test exposed methods
    ref.current?.zoomIn();
    expect(mockInstance.zoomIn).toHaveBeenCalled();

    ref.current?.zoomOut();
    expect(mockInstance.zoomOut).toHaveBeenCalled();

    ref.current?.updateTask('task-1', { progress: 75 });
    expect(mockInstance.updateTask).toHaveBeenCalledWith('task-1', { progress: 75 });
  });

  it('should handle event callbacks', () => {
    const mockOnTaskDragged = jest.fn();
    const mockOnTaskResized = jest.fn();

    render(
      <ApexGanttChart
        tasks={mockTasks}
        onTaskDragged={mockOnTaskDragged}
        onTaskResized={mockOnTaskResized}
      />
    );

    // simulate event dispatch
    const container = screen.getByRole('generic');
    const dragEvent = new CustomEvent('taskDragged', {
      detail: { taskId: 'task-1', daysMoved: 2 },
    });
    container.dispatchEvent(dragEvent);

    expect(mockOnTaskDragged).toHaveBeenCalledWith(
      expect.objectContaining({ taskId: 'task-1', daysMoved: 2 })
    );
  });

  it('should apply custom className and style', () => {
    const { container } = render(
      <ApexGanttChart
        tasks={mockTasks}
        className="custom-gantt"
        style={{ border: '1px solid red' }}
      />
    );

    const ganttContainer = container.firstChild as HTMLElement;
    expect(ganttContainer).toHaveClass('custom-gantt');
    expect(ganttContainer).toHaveStyle({ border: '1px solid red' });
  });

  it('should update when viewMode changes', async () => {
    const { rerender } = render(
      <ApexGanttChart tasks={mockTasks} viewMode={ViewMode.Week} />
    );

    rerender(<ApexGanttChart tasks={mockTasks} viewMode={ViewMode.Month} />);

    await waitFor(() => {
      expect(mockInstance.update).toHaveBeenCalledWith(
        expect.objectContaining({
          viewMode: ViewMode.Month,
        })
      );
    });
  });

  it('should update when theme changes', async () => {
    const { rerender } = render(
      <ApexGanttChart tasks={mockTasks} theme="light" />
    );

    rerender(<ApexGanttChart tasks={mockTasks} theme="dark" />);

    await waitFor(() => {
      expect(mockInstance.update).toHaveBeenCalledWith(
        expect.objectContaining({
          theme: 'dark',
        })
      );
    });
  });

  it('should pass custom options correctly', () => {
    render(
      <ApexGanttChart
        tasks={mockTasks}
        options={{
          enableTaskDrag: true,
          enableTaskResize: false,
          rowHeight: 40,
        }}
      />
    );

    expect(mockApexGanttConstructor).toHaveBeenCalledWith(
      expect.any(HTMLElement),
      expect.objectContaining({
        enableTaskDrag: true,
        enableTaskResize: false,
        rowHeight: 40,
      })
    );
  });

  it('should expose getInstance method', () => {
    const ref = React.createRef<any>();
    render(<ApexGanttChart ref={ref} tasks={mockTasks} />);

    const instance = ref.current?.getInstance();
    expect(instance).toBe(mockInstance);
  });
});