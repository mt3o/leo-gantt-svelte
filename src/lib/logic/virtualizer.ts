import type { Task, FlattenedItem } from '../types/gantt';

export interface VirtualizationResult {
  visibleTasks: Task[];
  visibleRows: FlattenedItem[];
  startIndex: number;
  endIndex: number;
}

/**
 * Filters tasks and rows that are currently within the viewable area.
 */
export function getVisibleElements(
  tasks: Task[],
  flatRows: FlattenedItem[],
  viewStart: Date,
  viewEnd: Date,
  scrollTop: number,
  containerHeight: number,
  rowHeight: number,
  buffer = 2
): VirtualizationResult {
  // Vertical Virtualization
  const startIdx = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer);
  const endIdx = Math.min(
    flatRows.length,
    Math.ceil((scrollTop + containerHeight) / rowHeight) + buffer
  );

  const visibleRows = flatRows.slice(startIdx, endIdx);
  const visibleRowIds = new Set(visibleRows.map(r => r.id));

  // Horizontal + Vertical Task Filtering
  const visibleTasks = tasks.filter(task => {
    const isInRow = visibleRowIds.has(task.rowId);
    const isVisibleInTime = task.start < viewEnd && task.end > viewStart;
    return isInRow && isVisibleInTime;
  });

  return {
    visibleTasks,
    visibleRows,
    startIndex: startIdx,
    endIndex: endIdx
  };
}
