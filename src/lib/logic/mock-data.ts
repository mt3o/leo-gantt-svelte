import type { Task, ResourceGroup, ResourceRow, Dependency, RowId } from '../types/gantt';


// Generating test data for gantt chart:
// const start = new Date('2026-01-01');
// const end = new Date('2026-01-10');
//
// const resourceTree = generateResources(10, 3); // 10 top level, depth of 3
// const rowIds = getAllRowIds(resourceTree);
// const mockTasks = generateTasks(rowIds, 10, start, end);
// const mockDeps = generateDependencies(mockTasks, 50);
//
// // These would be passed into <GanttChart />

/**
 * Generates a random date between two boundaries.
 */
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Generates a nested resource tree.
 */
export function generateResources(
  count: number,
  depth: number = 2,
  currentDepth: number = 0,
  prefix: string = 'R'
): (ResourceGroup | ResourceRow)[] {
  const resources: (ResourceGroup | ResourceRow)[] = [];

  for (let i = 0; i < count; i++) {
    const id = `${prefix}-${currentDepth}-${i}`;
    if (currentDepth < depth && Math.random() > 0.3) {
      resources.push({
        id,
        label: `Group ${id}`,
        type: 'group',
        children: generateResources(Math.max(2, count / 2), depth, currentDepth + 1, id)
      });
    } else {
      resources.push({
        id,
        label: `Resource ${id}`,
        type: 'row'
      });
    }
  }

  return resources;
}

/**
 * Extracts all leaf row IDs from a nested resource tree.
 */
export function getAllRowIds(resources: (ResourceGroup | ResourceRow)[]): RowId[] {
  let ids: RowId[] = [];
  for (const item of resources) {
    if (item.type === 'row') {
      ids.push(item.id);
    } else {
      ids = [...ids, ...getAllRowIds(item.children)];
    }
  }
  return ids;
}

/**
 * Generates tasks for a list of row IDs.
 * Ensures tasks within the same row do not overlap.
 */
export function generateTasks(
  rowIds: RowId[],
  tasksPerRow: number,
  rangeStart: Date,
  rangeEnd: Date
): Task[] {
  const tasks: Task[] = [];
  const totalDuration = rangeEnd.getTime() - rangeStart.getTime();
  const slotDuration = totalDuration / tasksPerRow;

  rowIds.forEach((rowId) => {
    for (let i = 0; i < tasksPerRow; i++) {
      const slotStart = rangeStart.getTime() + i * slotDuration;
      const start = new Date(slotStart + Math.random() * (slotDuration * 0.4));
      const end = new Date(start.getTime() + Math.random() * (slotDuration * 0.5));

      tasks.push({
        id: `T-${rowId}-${i}`,
        rowId,
        start,
        end,
        label: `Task ${i}`,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`
      });
    }
  });

  return tasks;
}

/**
 * Generates random dependencies between tasks.
 */
export function generateDependencies(tasks: Task[], count: number): Dependency[] {
  const dependencies: Dependency[] = [];
  for (let i = 0; i < count; i++) {
    const fromIdx = Math.floor(Math.random() * (tasks.length - 1));
    const toIdx = Math.floor(Math.random() * (tasks.length - 1));

    if (fromIdx !== toIdx) {
      dependencies.push({
        from: tasks[fromIdx].id,
        to: tasks[toIdx].id
      });
    }
  }
  return dependencies;
}
