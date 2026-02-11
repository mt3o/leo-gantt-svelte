import type { Task, FlattenedItem } from '../types/gantt';

/**
 * Result of the virtualization process.
 */
export interface VirtualizationResult {
  /** Tasks that are currently visible in the viewport */
  visibleTasks: Task[];
  /** Rows that are currently visible in the viewport */
  visibleRows: FlattenedItem[];
  /** The index of the first visible row in the full list */
  startIndex: number;
  /** The index of the last visible row (exclusive) */
  endIndex: number;
}

/**
 * Filters tasks and rows that are currently within the viewable area.
 * Implements 2D virtualization (vertical for rows, horizontal for tasks).
 * 
 * @param tasks The full list of tasks.
 * @param flatRows The full list of flattened rows.
 * @param viewStart The start date of the visible time range.
 * @param viewEnd The end date of the visible time range.
 * @param scrollTop The current vertical scroll position.
 * @param containerHeight The height of the scrollable container.
 * @param rowHeight The fixed height of each row.
 * @param buffer Number of extra rows to render above and below the viewport (default: 2).
 * @returns Object containing visible tasks, rows, and indices.
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
