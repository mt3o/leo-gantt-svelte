import { describe, it, expect } from 'vitest';
import { getVisibleElements } from './virtualizer';
import type { Task, FlattenedItem } from '../types/gantt';

describe('Virtualizer Logic', () => {
  const rows: FlattenedItem[] = Array.from({ length: 100 }, (_, i) => ({
    id: `r${i}`, label: `Row ${i}`, type: 'row', level: 0, parentId: null, isVisible: true
  }));

  const tasks: Task[] = [
    { id: 't1', rowId: 'r0', start: new Date('2026-01-01T01:00:00Z'), end: new Date('2026-01-01T02:00:00Z'), label: 'T1' },
    { id: 't2', rowId: 'r50', start: new Date('2026-01-01T01:00:00Z'), end: new Date('2026-01-01T02:00:00Z'), label: 'T2' }
  ];

  it('slices rows correctly based on scroll', () => {
    const result = getVisibleElements(
      tasks, rows,
      new Date('2026-01-01T00:00:00Z'), new Date('2026-01-01T10:00:00Z'),
      500, 200, 50, 0 // scrollTop 500, height 200, rowHeight 50 -> rows 10 to 14
    );

    expect(result.visibleRows[0].id).toBe('r10');
    expect(result.visibleRows.length).toBe(4);
    expect(result.visibleTasks).toHaveLength(0); // t1 is row 0, t2 is row 50
  });
});
