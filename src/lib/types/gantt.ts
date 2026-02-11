/**
 * Unique identifier for a row.
 */
export type RowId = string;

/**
 * Unique identifier for a task.
 */
export type TaskId = string;

/**
 * Configuration for the visible horizontal area of the Gantt chart.
 */
export interface ViewportConfig {
  /** The start date of the currently visible time window */
  viewStart: Date;
  /** The end date of the currently visible time window */
  viewEnd: Date;
}

/**
 * Represents a task to be displayed on the Gantt chart.
 */
export interface Task {
  /** Unique identifier for the task */
  id: TaskId;
  /** The ID of the row this task belongs to */
  rowId: RowId;
  /** The start date and time of the task */
  start: Date;
  /** The end date and time of the task */
  end: Date;
  /** The label to display on the task bar */
  label: string;
  /**
   * Optional background color for the task bar.
   * Can be a CSS color string (e.g., '#ff0000', 'rgb(255,0,0)').
   * If not provided, `theme.colors.taskDefault` will be used.
   */
  color?: string;
  /**
   * Optional text color for the task label.
   * Can be a CSS color string.
   * If not provided, `theme.colors.taskText` will be used.
   */
  textColor?: string;
}

/**
 * Represents a resource row in the hierarchical data structure.
 */
export interface ResourceRow {
  /** Unique identifier for the row */
  id: RowId;
  /** The label to display for the row */
  label: string;
  /** Discriminator for row type */
  type: 'row';
}

/**
 * Represents a group of resources in the hierarchical data structure.
 */
export interface ResourceGroup {
  /** Unique identifier for the group */
  id: RowId;
  /** The label to display for the group */
  label: string;
  /** Discriminator for group type */
  type: 'group';
  /** Child resources (rows or other groups) */
  children: (ResourceGroup | ResourceRow)[];
}

/**
 * Represents a dependency between two tasks.
 */
export interface Dependency {
  /** The ID of the predecessor task */
  from: TaskId;
  /** The ID of the successor task */
  to: TaskId;
}

/**
 * Represents a row in its flattened state, ready for the virtualized list.
 */
export interface FlattenedItem {
  /** Unique identifier for the row */
  id: RowId;
  /** The label to display for the row */
  label: string;
  /** The type of the row ('row' or 'group') */
  type: 'row' | 'group';
  /** The nesting level (0 for root, 1 for children, etc.) */
  level: number;
  /** The ID of the parent group, or null if it's a root item */
  parentId: RowId | null;
  /** Whether the group is expanded (only applicable if type is 'group') */
  isExpanded?: boolean;
  /** Whether the row is currently visible (i.e., not hidden by a collapsed parent) */
  isVisible: boolean;
}
