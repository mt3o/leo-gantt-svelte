import type { Dependency, Task, ViewportConfig } from '../types/gantt';
import { timeToPixel } from './viewport';
import type {GanttTheme} from "$lib/gantt-theme";

/**
 * Represents the coordinates for a dependency line.
 */
export interface LineCoords {
  /** Unique identifier for the line (e.g., "task1-task2") */
  id: string;
  /** ID of the source task */
  from: string;
  /** ID of the target task */
  to: string;
  /** Starting X coordinate */
  x1: number;
  /** Starting Y coordinate */
  y1: number;
  /** Ending X coordinate */
  x2: number;
  /** Ending Y coordinate */
  y2: number;
}

/**
 * Calculates straight line coordinates between tasks based on dependencies.
 *
 * @param dependencies List of dependencies to render.
 * @param tasks List of all tasks (used to find positions).
 * @param rowIndexMap Map of rowId to its vertical index (0-based).
 * @param viewportConfig Viewport configuration for time-to-pixel conversion.
 * @param rowHeight Height of a single row in pixels.
 * @param taskHeight Height of a task bar in pixels.
 * @returns Array of line coordinates ready for rendering.
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
