import type { Dependency, Task, ViewportConfig } from '../types/gantt';
import { timeToPixel } from './viewport';
import type {GanttTheme} from "$lib/gantt-theme";

export interface LineCoords {
  id: string;
  from: string;
  to: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/**
 * Calculates straight line coordinates between tasks.
 * rowIndexMap is a Map of rowId -> rowIndex (global)
 */
export function calculateDependencyLines(
  dependencies: Dependency[],
  tasks: Task[],
  rowIndexMap: Map<string, number>,
  viewportConfig: ViewportConfig,
  rowHeight: number,
  taskHeight: number,
  theme: GanttTheme,
): LineCoords[] {
  const taskMap = new Map(tasks.map((t) => [t.id, t]));
  const lines: LineCoords[] = [];

  for (const dep of dependencies) {
    const fromTask = taskMap.get(dep.from);
    const toTask = taskMap.get(dep.to);

    if (fromTask && toTask) {
      const fromRowIndex = rowIndexMap.get(fromTask.rowId);
      const toRowIndex = rowIndexMap.get(toTask.rowId);

      if (fromRowIndex !== undefined && toRowIndex !== undefined) {
        const fromY = fromRowIndex * rowHeight;
        const toY = toRowIndex * rowHeight;

        // Center the line vertically within the task bar
        const verticalOffset = (rowHeight - taskHeight) / 2 + taskHeight / 2;

        lines.push({
          id: `${dep.from}-${dep.to}`,
          from: dep.from,
          to: dep.to,
          x1: timeToPixel(fromTask.end, viewportConfig, theme),
          y1: fromY + verticalOffset,
          x2: timeToPixel(toTask.start, viewportConfig, theme),
          y2: toY + verticalOffset
        });
      }
    }
  }

  return lines;
}
