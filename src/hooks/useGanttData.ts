import { useMemo } from "react";
import type { TaskInput, ParsingConfig } from "apexgantt";
import { DataParser } from "apexgantt";

interface UseGanttDataOptions {
  data: any[];
  parsing?: ParsingConfig;
}

/**
 * custom hook to parse and memoize gantt data
 */
export function useGanttData({
  data,
  parsing,
}: UseGanttDataOptions): TaskInput[] {
  return useMemo(() => {
    if (!parsing) {
      return data as TaskInput[];
    }

    if (!DataParser.validateConfig(parsing)) {
      console.error("Invalid parsing configuration");
      return [];
    }

    return DataParser.parse(data, parsing);
  }, [data, parsing]);
}
