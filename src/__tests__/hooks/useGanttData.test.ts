import { renderHook } from "@testing-library/react";
import { useGanttData } from "../../hooks/useGanttData";
import { DataParser } from "apexgantt";

jest.mock("apexgantt", () => ({
  DataParser: {
    parse: jest.fn(),
    validateConfig: jest.fn(),
  },
}));

describe("useGanttData", () => {
  const mockData = [
    {
      task_id: "T1",
      task_name: "Task 1",
      start_date: "01-01-2024",
      end_date: "01-08-2024",
    },
  ];

  const mockParsing = {
    id: "task_id",
    name: "task_name",
    startTime: "start_date",
    endTime: "end_date",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return data as-is when no parsing config provided", () => {
    const { result } = renderHook(() =>
      useGanttData({ data: mockData, parsing: undefined })
    );

    expect(result.current).toEqual(mockData);
  });

  it("should parse data when parsing config is provided", () => {
    const parsedData = [
      {
        id: "T1",
        name: "Task 1",
        startTime: "01-01-2024",
        endTime: "01-08-2024",
      },
    ];

    (DataParser.validateConfig as jest.Mock).mockReturnValue(true);
    (DataParser.parse as jest.Mock).mockReturnValue(parsedData);

    const { result } = renderHook(() =>
      useGanttData({ data: mockData, parsing: mockParsing })
    );

    expect(DataParser.validateConfig).toHaveBeenCalledWith(mockParsing);
    expect(DataParser.parse).toHaveBeenCalledWith(mockData, mockParsing);
    expect(result.current).toEqual(parsedData);
  });

  it("should return empty array for invalid parsing config", () => {
    (DataParser.validateConfig as jest.Mock).mockReturnValue(false);

    const { result } = renderHook(() =>
      useGanttData({ data: mockData, parsing: mockParsing })
    );

    expect(result.current).toEqual([]);
  });

  it("should memoize result when data and parsing do not change", () => {
    const parsedData = [{ id: "T1", name: "Task 1" }];
    (DataParser.validateConfig as jest.Mock).mockReturnValue(true);
    (DataParser.parse as jest.Mock).mockReturnValue(parsedData);

    const { result, rerender } = renderHook(
      ({ data, parsing }) => useGanttData({ data, parsing }),
      {
        initialProps: { data: mockData, parsing: mockParsing },
      }
    );

    const firstResult = result.current;

    // rerender with same props
    rerender({ data: mockData, parsing: mockParsing });

    // should return same reference (memoized)
    expect(result.current).toBe(firstResult);
    expect(DataParser.parse).toHaveBeenCalledTimes(1);
  });
});
