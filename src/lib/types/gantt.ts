export type RowId = string;
export type TaskId = string;

/**
 * Configuration for the visible horizontal area of the Gantt chart.
 */
export interface ViewportConfig {
  /** The start date of the currently visible time window */
  viewStart: Date;
  /** The end date of the currently visible time window */
  viewEnd: Date;
  /** The width of the SVG/Canvas container in pixels */
  containerWidth: number;
}

export interface Task {
  id: TaskId;
  rowId: RowId;
  start: Date;
  end: Date;
  label: string;
  color?: string;
}

export interface ResourceRow {
  id: RowId;
  label: string;
  type: 'row';
}

export interface ResourceGroup {
  id: RowId;
  label: string;
  type: 'group';
  children: (ResourceGroup | ResourceRow)[];
}

export interface Dependency {
  from: TaskId;
  to: TaskId;
}

/**
 * Represents a row in its flattened state, ready for the virtualized list.
 */
export interface FlattenedItem {
  id: RowId;
  label: string;
  type: 'row' | 'group';
  level: number;
  parentId: RowId | null;
  isExpanded?: boolean;
  isVisible: boolean;
}
